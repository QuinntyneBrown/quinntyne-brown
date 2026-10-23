// Traces to: L2-159, L2-160, L2-167
using System.Net;
using System.Net.Http.Json;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Integrations;

/// <summary>Rotating keeps the old secret for 24 hours; revoking is permanent; both are audited (L2-159, L2-160, L2-167).</summary>
public class RotateAndRevokeTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private async Task<HttpClient> LeadAsync() =>
        factory.ClientFor(await factory.AddMemberAsync($"Lead {Guid.NewGuid():N}"[..13]), "faithtech-toronto", SeededRole.OrgLead);

    private Task<HttpStatusCode> SendAsync(string sourceId, string secret) =>
        factory.DeliverAsync(sourceId, secret, IntegrationClients.ContactRequestBody()).ContinueWith(t => t.Result.StatusCode);

    // L2-159 AC1
    [Fact]
    public async Task Rotating_returns_a_new_secret_and_keeps_the_old_one_for_24_hours()
    {
        var lead = await LeadAsync();
        var registered = await factory.RegisterAsync(client: lead);
        var rotatedAt = factory.Time.GetUtcNow();

        var response = await lead.PostAsync($"/api/integrations/apps/{registered.App.Id}/rotate", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var rotated = (await response.Content.ReadFromJsonAsync<IntegrationClients.Rotated>())!;
        Assert.NotEqual(registered.Secret, rotated.Secret);
        Assert.Equal(rotated.Secret[..10], rotated.App.SecretPrefix);
        Assert.Equal(rotatedAt.AddHours(24), rotated.PreviousSecretExpiresAt);
        Assert.Equal(HttpStatusCode.Accepted, await SendAsync(registered.App.SourceId, rotated.Secret));
        Assert.Equal(HttpStatusCode.Accepted, await SendAsync(registered.App.SourceId, registered.Secret));

        factory.Time.Advance(TimeSpan.FromHours(24));

        Assert.Equal(HttpStatusCode.Unauthorized, await SendAsync(registered.App.SourceId, registered.Secret));
        Assert.Equal(HttpStatusCode.Accepted, await SendAsync(registered.App.SourceId, rotated.Secret));
    }

    // L2-159 AC2
    [Fact]
    public async Task Rotating_again_within_24_hours_drops_the_oldest_secret_at_once()
    {
        var lead = await LeadAsync();
        var registered = await factory.RegisterAsync(client: lead);
        var second = (await (await lead.PostAsync($"/api/integrations/apps/{registered.App.Id}/rotate", null)).Content.ReadFromJsonAsync<IntegrationClients.Rotated>())!;

        var third = (await (await lead.PostAsync($"/api/integrations/apps/{registered.App.Id}/rotate", null)).Content.ReadFromJsonAsync<IntegrationClients.Rotated>())!;

        Assert.Equal(HttpStatusCode.Unauthorized, await SendAsync(registered.App.SourceId, registered.Secret));
        Assert.Equal(HttpStatusCode.Accepted, await SendAsync(registered.App.SourceId, second.Secret));
        Assert.Equal(HttpStatusCode.Accepted, await SendAsync(registered.App.SourceId, third.Secret));
    }

    // L2-160 AC1, AC2
    [Fact]
    public async Task A_revoked_source_answers_401_with_either_secret_and_its_events_stay()
    {
        var lead = await LeadAsync();
        var registered = await factory.RegisterAsync(client: lead);
        await SendAsync(registered.App.SourceId, registered.Secret);
        var rotated = (await (await lead.PostAsync($"/api/integrations/apps/{registered.App.Id}/rotate", null)).Content.ReadFromJsonAsync<IntegrationClients.Rotated>())!;

        var response = await lead.PostAsync($"/api/integrations/apps/{registered.App.Id}/revoke", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var revoked = (await response.Content.ReadFromJsonAsync<IntegrationClients.App>())!;
        Assert.Equal("Revoked", revoked.Status);
        Assert.Equal(factory.Time.GetUtcNow(), revoked.RevokedAt);
        Assert.NotNull(revoked.RevokedBy);
        Assert.Equal(HttpStatusCode.Unauthorized, await SendAsync(registered.App.SourceId, rotated.Secret));
        Assert.Equal(HttpStatusCode.Unauthorized, await SendAsync(registered.App.SourceId, registered.Secret));
        Assert.Contains("\"totalCount\":1", await lead.GetStringAsync($"/api/integrations/apps/{registered.App.Id}/events"));
    }

    // L2-159 AC3, L2-160 AC3
    [Fact]
    public async Task A_revoked_application_cannot_be_rotated_or_revoked_again()
    {
        var lead = await LeadAsync();
        var registered = await factory.RegisterAsync(client: lead);
        await lead.PostAsync($"/api/integrations/apps/{registered.App.Id}/revoke", null);

        Assert.Equal(HttpStatusCode.Conflict, (await lead.PostAsync($"/api/integrations/apps/{registered.App.Id}/rotate", null)).StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, (await lead.PostAsync($"/api/integrations/apps/{registered.App.Id}/revoke", null)).StatusCode);
    }

    // L2-159 AC4, L2-160 AC4
    [Fact]
    public async Task Staff_get_403_and_members_without_view_get_404()
    {
        var registered = await factory.RegisterAsync();
        var staff = factory.ClientFor(await factory.AddMemberAsync("Daniel Reyes"), "faithtech-toronto", SeededRole.Staff);
        var member = factory.ClientFor(await factory.AddMemberAsync("Jonah Bell"), "faithtech-toronto");

        foreach (var action in new[] { "rotate", "revoke" })
        {
            Assert.Equal(HttpStatusCode.Forbidden, (await staff.PostAsync($"/api/integrations/apps/{registered.App.Id}/{action}", null)).StatusCode);
            Assert.Equal(HttpStatusCode.NotFound, (await member.PostAsync($"/api/integrations/apps/{registered.App.Id}/{action}", null)).StatusCode);
        }

        Assert.Equal(HttpStatusCode.Accepted, await SendAsync(registered.App.SourceId, registered.Secret));
    }

    // L2-167 AC1
    [Fact]
    public async Task Rotating_and_revoking_are_audited_in_the_org_without_secrets()
    {
        var lead = await LeadAsync();
        var registered = await factory.RegisterAsync(client: lead);
        var rotated = (await (await lead.PostAsync($"/api/integrations/apps/{registered.App.Id}/rotate", null)).Content.ReadFromJsonAsync<IntegrationClients.Rotated>())!;
        await lead.PostAsync($"/api/integrations/apps/{registered.App.Id}/revoke", null);

        var entries = await factory.WithDbAsync(db => db.AuditEntries.Where(e => e.TargetId == registered.App.Id.ToString()).ToListAsync());

        Assert.Equal(["integration.registered", "integration.revoked", "integration.secretRotated"], entries.Select(e => e.Action).Order());
        Assert.All(entries, e => Assert.Equal(registered.App.Organization.Id, e.OrganizationId));
        Assert.All(entries, e => Assert.DoesNotContain(rotated.Secret, (e.BeforeJson ?? "") + e.AfterJson + e.Detail));
        Assert.All(entries, e => Assert.DoesNotContain(registered.Secret, (e.BeforeJson ?? "") + e.AfterJson + e.Detail));
    }
}
