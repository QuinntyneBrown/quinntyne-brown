// Traces to: L2-161, L2-162
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Integrations;

/// <summary>A publisher posts signed events; only authentic, fresh ones from an active application are stored (ICD).</summary>
public class ReceiveEventTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    public sealed record Ack(string Status, Guid EventId);

    private Task<int> StoredForAsync(Guid appId) => factory.WithDbAsync(db => db.IntegrationEvents.CountAsync(e => e.IntegrationAppId == appId));

    // L2-161 AC1
    [Fact]
    public async Task A_signed_contact_request_is_accepted_and_stored()
    {
        var registered = await factory.RegisterAsync();
        var eventId = Guid.NewGuid();

        var response = await factory.DeliverAsync(registered.App.SourceId, registered.Secret, IntegrationClients.ContactRequestBody(eventId));

        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);
        Assert.Equal(new Ack("accepted", eventId), await response.Content.ReadFromJsonAsync<Ack>());
        var stored = await factory.WithDbAsync(db => db.IntegrationEvents.SingleAsync(e => e.EventId == eventId));
        Assert.Equal((registered.App.Id, registered.App.Organization.Id, IntegrationClients.ContactRequest), (stored.IntegrationAppId, stored.OrganizationId, stored.EventType));
        Assert.Equal(DateTimeOffset.Parse("2026-10-21T14:05:00Z"), stored.OccurredAt);
        Assert.Equal(factory.Time.GetUtcNow(), stored.ReceivedAt);
        Assert.Equal("Ada Lovelace", JsonDocument.Parse(stored.DataJson).RootElement.GetProperty("name").GetString());
    }

    // L2-161 AC2
    [Fact]
    public async Task An_unknown_event_type_is_stored_as_sent()
    {
        var registered = await factory.RegisterAsync();
        var eventId = Guid.NewGuid();
        var body = JsonSerializer.Serialize(new
        {
            eventId,
            eventType = "newsletter.subscribed",
            occurredAt = "2026-10-20T16:05:00-04:00",
            data = new { email = "mira@example.com", list = "monthly" },
        });

        var response = await factory.DeliverAsync(registered.App.SourceId, registered.Secret, body);

        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);
        var stored = await factory.WithDbAsync(db => db.IntegrationEvents.SingleAsync(e => e.EventId == eventId));
        Assert.Equal("newsletter.subscribed", stored.EventType);
        Assert.Equal("monthly", JsonDocument.Parse(stored.DataJson).RootElement.GetProperty("list").GetString());
    }

    // L2-162 AC1
    [Fact]
    public async Task A_bad_signature_an_unknown_source_and_missing_headers_answer_the_same_401()
    {
        var registered = await factory.RegisterAsync();
        var body = Encoding.UTF8.GetBytes(IntegrationClients.ContactRequestBody());

        var wrongSecret = await factory.DeliverRawAsync(registered.App.SourceId, body, "whsec_" + new string('A', 43));
        var tampered = await factory.DeliverRawAsync(registered.App.SourceId, body, registered.Secret, signature: "sha256=" + new string('0', 64));
        var garbage = await factory.DeliverRawAsync(registered.App.SourceId, body, registered.Secret, signature: "md5=abc");
        var unknown = await factory.DeliverRawAsync("src_" + new string('f', 32), body, registered.Secret);
        var noSource = await factory.DeliverRawAsync(null, body, registered.Secret);
        var noSignature = await factory.DeliverRawAsync(registered.App.SourceId, body, registered.Secret, signature: null);
        var badTimestamp = await factory.DeliverRawAsync(registered.App.SourceId, body, registered.Secret, timestamp: "yesterday");

        HttpResponseMessage[] all = [wrongSecret, tampered, garbage, unknown, noSource, noSignature, badTimestamp];
        Assert.All(all, r => Assert.Equal(HttpStatusCode.Unauthorized, r.StatusCode));
        var details = await Task.WhenAll(all.Select(async r => (await r.Content.ReadFromJsonAsync<ProblemDetails>())!.Detail));
        Assert.All(details, d => Assert.Equal("The request could not be authenticated.", d));
        Assert.Equal(0, await StoredForAsync(registered.App.Id));
    }

    // L2-162 AC1: the timestamp must be within 300 seconds of the server's clock.
    [Theory]
    [InlineData(-301, HttpStatusCode.Unauthorized)]
    [InlineData(301, HttpStatusCode.Unauthorized)]
    [InlineData(-299, HttpStatusCode.Accepted)]
    [InlineData(299, HttpStatusCode.Accepted)]
    public async Task A_timestamp_more_than_five_minutes_off_is_refused(int offsetSeconds, HttpStatusCode expected)
    {
        var registered = await factory.RegisterAsync();

        var response = await factory.DeliverAsync(
            registered.App.SourceId, registered.Secret, IntegrationClients.ContactRequestBody(), factory.Time.GetUtcNow().AddSeconds(offsetSeconds));

        Assert.Equal(expected, response.StatusCode);
    }

    // L2-161 AC3: hex digits in either case decode to the same bytes.
    [Fact]
    public async Task An_uppercase_hex_signature_is_accepted()
    {
        var registered = await factory.RegisterAsync();
        var body = Encoding.UTF8.GetBytes(IntegrationClients.ContactRequestBody());
        var timestamp = factory.Time.GetUtcNow().ToUnixTimeSeconds().ToString(System.Globalization.CultureInfo.InvariantCulture);
        var signature = IntegrationClients.Sign(registered.Secret, timestamp, body).ToUpperInvariant().Replace("SHA256=", "sha256=");

        var response = await factory.DeliverRawAsync(registered.App.SourceId, body, registered.Secret, signature: signature, timestamp: timestamp);

        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);
    }
}
