// Traces to: L2-158, L2-167
using System.Net;
using System.Net.Http.Json;
using QuinntyneBrown.Community.Api.Tests.Organizations;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Integrations;

/// <summary>An Org Lead or the Portfolio Lead registers an application and sees its secret once (L2-158).</summary>
public class RegisterApplicationTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private async Task<HttpClient> ClientAsync(string? org, params SeededRole[] roles) =>
        factory.ClientFor(await factory.AddMemberAsync($"Person {Guid.NewGuid():N}"[..14]), org, roles);

    // AC1, AC2
    [Fact]
    public async Task An_org_lead_registers_an_application_and_gets_its_source_id_and_secret_once()
    {
        var registered = await factory.RegisterAsync("Goodwork", await ClientAsync("faithtech-toronto", SeededRole.OrgLead));

        Assert.Matches("^src_[0-9a-f]{32}$", registered.App.SourceId);
        Assert.Matches("^whsec_[A-Za-z0-9_-]{43}$", registered.Secret);
        Assert.Equal(registered.Secret[..10], registered.App.SecretPrefix);
        Assert.Equal(("Goodwork", "Active", HierarchySeed.TorontoId), (registered.App.Name, registered.App.Status, registered.App.Organization.Id));
        var stored = await factory.WithDbAsync(db => db.IntegrationApps.SingleAsync(a => a.Id == registered.App.Id));
        Assert.DoesNotContain(registered.Secret[10..], stored.SecretCiphertext);
        Assert.Equal(HierarchySeed.TorontoId, stored.OrganizationId);
    }

    [Fact]
    public async Task The_portfolio_lead_registers_in_the_active_org()
    {
        var registered = await factory.RegisterAsync("Shelfie site", await ClientAsync("shelfie", SeededRole.PortfolioLead));

        Assert.Equal(HierarchySeed.ShelfieId, registered.App.Organization.Id);
    }

    // AC3
    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("A name that is far too long for an application because it runs on well past the eighty character limit")]
    public async Task A_missing_or_long_name_is_refused(string name)
    {
        var client = await ClientAsync("faithtech-toronto", SeededRole.OrgLead);
        var before = await factory.WithDbAsync(db => db.IntegrationApps.CountAsync());

        var response = await client.PostAsJsonAsync("/api/integrations/apps", new { name });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.True((await response.Content.ReadFromJsonAsync<ValidationProblemDetails>())!.Errors.ContainsKey("name"));
        Assert.Equal(before, await factory.WithDbAsync(db => db.IntegrationApps.CountAsync()));
    }

    // AC4
    [Fact]
    public async Task Staff_and_members_without_manage_are_refused_with_403()
    {
        var staff = await ClientAsync("faithtech-toronto", SeededRole.Staff);
        var member = await ClientAsync("faithtech-toronto");

        Assert.Equal(HttpStatusCode.Forbidden, (await staff.PostAsJsonAsync("/api/integrations/apps", new { name = "Goodwork" })).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await member.PostAsJsonAsync("/api/integrations/apps", new { name = "Goodwork" })).StatusCode);
    }

    // AC4
    [Fact]
    public async Task An_org_lead_of_another_org_gets_404_in_an_org_they_do_not_cover()
    {
        var halifax = await factory.AddOrgAsync("FaithTech Halifax");
        var lead = await factory.AddMemberOfAsync(halifax, "Hannah Halifax", SeededRole.OrgLead);

        var response = await factory.ClientFor(lead, "faithtech-toronto").PostAsJsonAsync("/api/integrations/apps", new { name = "Goodwork" });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    // L2-167 AC1
    [Fact]
    public async Task Registering_is_audited_in_the_org_without_the_secret()
    {
        var registered = await factory.RegisterAsync("Audited site", await ClientAsync("faithtech-toronto", SeededRole.OrgLead));

        var entry = await factory.WithDbAsync(db => db.AuditEntries.SingleAsync(e => e.Action == "integration.registered" && e.TargetId == registered.App.Id.ToString()));
        Assert.Equal(HierarchySeed.TorontoId, entry.OrganizationId);
        Assert.DoesNotContain(registered.Secret, entry.AfterJson ?? string.Empty);
    }
}
