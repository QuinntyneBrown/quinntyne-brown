// Traces to: L2-148
using System.Net;
using System.Net.Http.Json;
using QuinntyneBrown.Community.Api.Tests.Notes;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Api.Tests.Resources;

namespace QuinntyneBrown.Community.Api.Tests.Organizations;

/// <summary>Private, Shared, Org-wide and Portfolio-wide resources and note pages (ADR 0039).</summary>
public class VisibilityLevelsTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private sealed record Resource(Guid Id, string Visibility);

    private static object Link(string visibility) =>
        new { Url = "https://example.org/brand", Title = "Brand guide", Type = "Template", Tags = Array.Empty<string>(), Visibility = visibility };

    [Fact]
    public async Task A_new_resource_is_org_wide_and_seen_only_in_its_org()
    {
        var grace = await factory.AddMemberAsync("Grace Okonkwo");
        var ruth = await factory.AddMemberAsync("Ruth Alvarez");
        var sami = await factory.AddMemberOfAsync(OrgClients.Shelfie, "Sami Shelfie");
        var body = new { Url = "https://example.org/deck", Title = "City deck", Type = "Template", Tags = Array.Empty<string>() };

        var created = (await (await factory.ClientFor(grace, SeededRole.CityLead).PostAsJsonAsync("/api/resources/links", body))
            .Content.ReadFromJsonAsync<Resource>())!;

        Assert.Equal("OrgWide", created.Visibility);
        Assert.Equal(HttpStatusCode.OK, (await factory.ClientFor(ruth).GetAsync($"/api/resources/{created.Id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await factory.ClientFor(sami).GetAsync($"/api/resources/{created.Id}")).StatusCode);
    }

    [Fact]
    public async Task Only_the_portfolio_lead_publishes_portfolio_wide_and_every_org_of_the_portfolio_sees_it()
    {
        var quinn = await factory.AddMemberAsync("Quinn Lead", p => p.AddRole(SeededRole.PortfolioLead, Guid.Empty, DateTime.UtcNow));
        var grace = await factory.AddMemberAsync("Grace Okonkwo");
        var sami = await factory.AddMemberOfAsync(OrgClients.Shelfie, "Sami Shelfie");

        var refused = await factory.ClientFor(grace, SeededRole.CityLead).PostAsJsonAsync("/api/resources/links", Link("PortfolioWide"));
        var published = await factory.ClientFor(quinn, OrgClients.Toronto.Slug).PostAsJsonAsync("/api/resources/links", Link("PortfolioWide"));

        Assert.Equal(HttpStatusCode.Forbidden, refused.StatusCode);
        var resource = (await published.Content.ReadFromJsonAsync<Resource>())!;
        Assert.Equal("PortfolioWide", resource.Visibility);
        Assert.Equal(HttpStatusCode.OK, (await factory.ClientFor(sami).GetAsync($"/api/resources/{resource.Id}")).StatusCode);
        Assert.Contains((await factory.ClientFor(sami, OrgClients.Shelfie.Slug).ListResourcesAsync()).Items, r => r.Id == resource.Id);
    }

    [Fact]
    public async Task A_note_page_starts_private_and_only_the_portfolio_lead_shares_it_portfolio_wide()
    {
        var quinn = await factory.AddMemberAsync("Quinn Lead", p => p.AddRole(SeededRole.PortfolioLead, Guid.Empty, DateTime.UtcNow));
        var grace = await factory.AddMemberAsync("Grace Okonkwo");
        var sami = await factory.AddMemberOfAsync(OrgClients.Shelfie, "Sami Shelfie");
        var mine = await factory.ClientFor(grace).CreateNoteAsync("City plan");
        var theirs = await factory.ClientFor(quinn, OrgClients.Toronto.Slug).CreateNoteAsync("Portfolio values");

        Assert.Equal("Private", mine.Visibility);
        var refused = await factory.ClientFor(grace).PutAsJsonAsync($"/api/notes/{mine.Id}/visibility", new { Visibility = "PortfolioWide" });
        var orgWide = await factory.ClientFor(grace).PutAsJsonAsync($"/api/notes/{mine.Id}/visibility", new { Visibility = "OrgWide" });
        var shared = await factory.ClientFor(quinn).PutAsJsonAsync($"/api/notes/{theirs.Id}/visibility", new { Visibility = "PortfolioWide" });

        Assert.Equal(HttpStatusCode.Forbidden, refused.StatusCode);
        Assert.Equal(HttpStatusCode.OK, orgWide.StatusCode);
        Assert.Equal(HttpStatusCode.OK, shared.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await factory.ClientFor(sami).GetAsync($"/api/notes/{mine.Id}")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await factory.ClientFor(sami).GetAsync($"/api/notes/{theirs.Id}")).StatusCode);
    }

    [Fact]
    public async Task A_private_page_stays_hidden_from_the_portfolio_lead_and_org_lead()
    {
        var quinn = await factory.AddMemberAsync("Quinn Lead", p => p.AddRole(SeededRole.PortfolioLead, Guid.Empty, DateTime.UtcNow));
        var olivia = await factory.AddMemberAsync("Olivia Grant", p => p.AddRole(SeededRole.OrgLead, Guid.Empty, DateTime.UtcNow));
        var grace = await factory.AddMemberAsync("Grace Okonkwo");
        var page = await factory.ClientFor(grace).CreateNoteAsync("Private thoughts");

        Assert.Equal(HttpStatusCode.NotFound, (await factory.ClientFor(quinn).GetAsync($"/api/notes/{page.Id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await factory.ClientFor(olivia).GetAsync($"/api/notes/{page.Id}")).StatusCode);
    }
}
