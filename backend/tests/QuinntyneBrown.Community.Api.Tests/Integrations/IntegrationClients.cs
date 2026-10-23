using System.Globalization;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Application.Integrations;
using QuinntyneBrown.Community.Domain.Integrations;
using QuinntyneBrown.Community.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;

namespace QuinntyneBrown.Community.Api.Tests.Integrations;

/// <summary>Registers applications and posts signed webhook deliveries as a publisher would (ICD, ADR 0042).</summary>
public static class IntegrationClients
{
    public sealed record OrgRef(Guid Id, string Slug, string Name);

    public sealed record PersonRef(Guid ProfileId, string Name);

    public sealed record App(
        Guid Id, string Name, string SourceId, string SecretPrefix, OrgRef Organization, string Status, DateTimeOffset CreatedAt,
        PersonRef CreatedBy, DateTimeOffset? RotatedAt, DateTimeOffset? PreviousSecretExpiresAt, DateTimeOffset? RevokedAt,
        PersonRef? RevokedBy, DateTimeOffset? LastEventAt, int EventCount, bool CanManage);

    public sealed record Registered(App App, string Secret);

    public sealed record Rotated(App App, string Secret, DateTimeOffset PreviousSecretExpiresAt);

    public const string ContactRequest = "contact-request.created";

    /// <summary>An Org Lead of FaithTech Toronto registers an application there and returns it with its secret.</summary>
    public static async Task<Registered> RegisterAsync(this CommunityApiFactory factory, string name = "Goodwork", HttpClient? client = null)
    {
        client ??= factory.ClientFor(await factory.AddMemberAsync($"Lead {Guid.NewGuid():N}"[..13]), "faithtech-toronto", SeededRole.OrgLead);
        var response = await client.PostAsJsonAsync("/api/integrations/apps", new { name });
        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"Register answered {response.StatusCode}: {await response.Content.ReadAsStringAsync()}");
        }

        return (await response.Content.ReadFromJsonAsync<Registered>())!;
    }

    /// <summary>An active application in the org, written straight to the database with a secret protected by the API's own protector.</summary>
    public static async Task<(Guid Id, string SourceId, string Secret)> SeedAppAsync(this CommunityApiFactory factory, Guid? orgId = null, string name = "Seeded site")
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var protector = scope.ServiceProvider.GetRequiredService<ISecretProtector>();
        var db = scope.ServiceProvider.GetRequiredService<CommunityDbContext>();
        var secret = WebhookCredentials.NewSecret();
        var app = new IntegrationApp(
            orgId ?? HierarchySeed.TorontoId, name, WebhookCredentials.NewSourceId(), protector.Protect(secret), WebhookCredentials.Prefix(secret), Guid.Empty, factory.Time.GetUtcNow());
        db.IntegrationApps.Add(app);
        await db.SaveChangesAsync();
        return (app.Id, app.SourceId, secret);
    }

    /// <summary>A <c>contact-request.created</c> envelope with a new event id unless one is given.</summary>
    public static string ContactRequestBody(Guid? eventId = null, string name = "Ada Lovelace", string email = "ada@example.com", string message = "We'd like to volunteer.") =>
        System.Text.Json.JsonSerializer.Serialize(new
        {
            eventId = eventId ?? Guid.NewGuid(),
            eventType = ContactRequest,
            occurredAt = "2026-10-21T14:05:00Z",
            data = new { name, email, message, organization = "Analytical Engines Ltd", phone = "+1 416 555 0100" },
        });

    /// <summary>The ICD's signature: sha256= and the hex HMAC-SHA256 of timestamp + "." + body, keyed with the secret.</summary>
    public static string Sign(string secret, string timestamp, byte[] body) =>
        "sha256=" + Convert.ToHexStringLower(HMACSHA256.HashData(Encoding.UTF8.GetBytes(secret), (byte[])[.. Encoding.UTF8.GetBytes(timestamp + "."), .. body]));

    /// <summary>Posts a delivery signed with <paramref name="secret"/> at the factory's current time (or <paramref name="at"/>).</summary>
    public static Task<HttpResponseMessage> DeliverAsync(
        this CommunityApiFactory factory, string sourceId, string secret, string body, DateTimeOffset? at = null, HttpClient? client = null) =>
        factory.DeliverRawAsync(sourceId, Encoding.UTF8.GetBytes(body), secret, at, client: client);

    /// <summary>Posts raw bytes with the three headers; any header may be overridden or left out with null.</summary>
    public static Task<HttpResponseMessage> DeliverRawAsync(
        this CommunityApiFactory factory, string? sourceId, byte[] body, string secret, DateTimeOffset? at = null,
        string? signature = "sign", string? timestamp = null, string contentType = "application/json", HttpClient? client = null)
    {
        client ??= factory.CreateClient();
        timestamp ??= (at ?? factory.Time.GetUtcNow()).ToUnixTimeSeconds().ToString(CultureInfo.InvariantCulture);
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/webhooks/events") { Content = new ByteArrayContent(body) };
        request.Content.Headers.TryAddWithoutValidation("Content-Type", contentType);
        if (sourceId is not null)
        {
            request.Headers.Add("X-Webhook-Source", sourceId);
        }

        request.Headers.Add("X-Webhook-Timestamp", timestamp);
        if (signature is not null)
        {
            request.Headers.Add("X-Webhook-Signature", signature == "sign" ? Sign(secret, timestamp, body) : signature);
        }

        return client.SendAsync(request);
    }
}
