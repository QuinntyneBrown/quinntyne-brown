// Traces to: L2-162, L2-163
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Integrations;

/// <summary>A retried delivery is stored once; an oversized or invalid body is refused and stores nothing (ICD).</summary>
public class DuplicateAndValidationTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    public sealed record Ack(string Status, Guid EventId);

    private Task<int> StoredForAsync(Guid appId) => factory.WithDbAsync(db => db.IntegrationEvents.CountAsync(e => e.IntegrationAppId == appId));

    // L2-163 AC1
    [Fact]
    public async Task A_repeated_event_id_answers_200_and_keeps_the_first_payload()
    {
        var registered = await factory.RegisterAsync();
        var eventId = Guid.NewGuid();
        await factory.DeliverAsync(registered.App.SourceId, registered.Secret, IntegrationClients.ContactRequestBody(eventId, name: "Ada Lovelace"));

        var again = await factory.DeliverAsync(registered.App.SourceId, registered.Secret, IntegrationClients.ContactRequestBody(eventId, name: "Someone Else"));

        Assert.Equal(HttpStatusCode.OK, again.StatusCode);
        Assert.Equal(new Ack("duplicate", eventId), await again.Content.ReadFromJsonAsync<Ack>());
        var stored = await factory.WithDbAsync(db => db.IntegrationEvents.Where(e => e.IntegrationAppId == registered.App.Id).ToListAsync());
        Assert.Equal("Ada Lovelace", JsonDocument.Parse(Assert.Single(stored).DataJson).RootElement.GetProperty("name").GetString());
    }

    // L2-163 AC2
    [Fact]
    public async Task The_same_event_id_from_two_applications_is_stored_for_each()
    {
        var first = await factory.RegisterAsync("First site");
        var second = await factory.RegisterAsync("Second site");
        var eventId = Guid.NewGuid();

        var a = await factory.DeliverAsync(first.App.SourceId, first.Secret, IntegrationClients.ContactRequestBody(eventId));
        var b = await factory.DeliverAsync(second.App.SourceId, second.Secret, IntegrationClients.ContactRequestBody(eventId));

        Assert.Equal((HttpStatusCode.Accepted, HttpStatusCode.Accepted), (a.StatusCode, b.StatusCode));
    }

    // L2-162 AC2
    [Fact]
    public async Task A_body_over_64_kb_is_refused_with_413_and_one_of_exactly_64_kb_is_accepted()
    {
        var registered = await factory.RegisterAsync();

        var exact = await factory.DeliverRawAsync(registered.App.SourceId, PaddedBody(65_536), registered.Secret);
        var over = await factory.DeliverRawAsync(registered.App.SourceId, PaddedBody(65_537), registered.Secret);
        var overUnsigned = await factory.DeliverRawAsync(registered.App.SourceId, PaddedBody(65_537), registered.Secret, signature: null);

        Assert.Equal(HttpStatusCode.Accepted, exact.StatusCode);
        Assert.Equal(HttpStatusCode.RequestEntityTooLarge, over.StatusCode);
        Assert.Equal(HttpStatusCode.RequestEntityTooLarge, overUnsigned.StatusCode);
        Assert.Equal(1, await StoredForAsync(registered.App.Id));
    }

    // L2-162 AC3
    [Theory]
    [InlineData("not json", "body")]
    [InlineData("[1,2,3]", "body")]
    [InlineData("""{"eventType":"contact-request.created","occurredAt":"2026-10-21T14:05:00Z","data":{}}""", "eventId")]
    [InlineData("""{"eventId":"0b1f7c5e-8a43-4f0e-9d0e-7a2b8c1d3e4f","eventType":"Contact Request","occurredAt":"2026-10-21T14:05:00Z","data":{}}""", "eventType")]
    [InlineData("""{"eventId":"0b1f7c5e-8a43-4f0e-9d0e-7a2b8c1d3e4f","eventType":"other.thing","occurredAt":"2026-10-21T14:05:00","data":{}}""", "occurredAt")]
    [InlineData("""{"eventId":"0b1f7c5e-8a43-4f0e-9d0e-7a2b8c1d3e4f","eventType":"other.thing","occurredAt":"2026-10-21T14:05:00Z","data":"text"}""", "data")]
    public async Task An_invalid_envelope_is_refused_with_400_naming_the_field(string body, string field)
    {
        var registered = await factory.RegisterAsync();

        var response = await factory.DeliverRawAsync(registered.App.SourceId, Encoding.UTF8.GetBytes(body), registered.Secret);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.True((await response.Content.ReadFromJsonAsync<ValidationProblemDetails>())!.Errors.ContainsKey(field), await response.Content.ReadAsStringAsync());
        Assert.Equal(0, await StoredForAsync(registered.App.Id));
    }

    // L2-162 AC3: contact-request.created data rules.
    [Fact]
    public async Task A_contact_request_that_breaks_its_field_rules_is_refused_naming_each_field()
    {
        var registered = await factory.RegisterAsync();
        var body = JsonSerializer.Serialize(new
        {
            eventId = Guid.NewGuid(),
            eventType = IntegrationClients.ContactRequest,
            occurredAt = "2026-10-21T14:05:00Z",
            data = new { name = " ", email = "not-an-email", message = new string('m', 5001), organization = new string('o', 201), phone = new string('1', 41) },
        });

        var response = await factory.DeliverAsync(registered.App.SourceId, registered.Secret, body);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var errors = (await response.Content.ReadFromJsonAsync<ValidationProblemDetails>())!.Errors.Keys;
        Assert.Equal(["data.email", "data.message", "data.name", "data.organization", "data.phone"], errors.Order());
    }

    // L2-162 AC3
    [Fact]
    public async Task A_body_that_is_not_json_by_content_type_is_refused()
    {
        var registered = await factory.RegisterAsync();

        var response = await factory.DeliverRawAsync(
            registered.App.SourceId, Encoding.UTF8.GetBytes(IntegrationClients.ContactRequestBody()), registered.Secret, contentType: "text/plain");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.True((await response.Content.ReadFromJsonAsync<ValidationProblemDetails>())!.Errors.ContainsKey("contentType"));
    }

    // L2-162: authentication comes before validation, so an unauthenticated caller learns nothing about its body.
    [Fact]
    public async Task An_invalid_body_with_a_bad_signature_answers_401()
    {
        var registered = await factory.RegisterAsync();

        var response = await factory.DeliverRawAsync(registered.App.SourceId, "not json"u8.ToArray(), registered.Secret, signature: "sha256=" + new string('0', 64));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    /// <summary>A valid envelope of an unknown type padded to exactly <paramref name="size"/> bytes.</summary>
    private static byte[] PaddedBody(int size)
    {
        var start = $$"""{"eventId":"{{Guid.NewGuid()}}","eventType":"padding.test","occurredAt":"2026-10-21T14:05:00Z","data":{"pad":" """.TrimEnd();
        const string end = "\"}}";
        return Encoding.UTF8.GetBytes(start + new string('x', size - start.Length - end.Length) + end);
    }
}
