// Traces to: L2-155, L2-136
using System.Net.Http.Json;
using QuinntyneBrown.Community.Api.Tests.Profiles;

namespace QuinntyneBrown.Community.Api.Tests.Organizations;

/// <summary>What the web app learns about the caller to build navigation and offer choices (ADR 0037).</summary>
public class MyAccessTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    public sealed record RoleOption(string Key, string Name, string? Description, bool IsCrossOrg);

    public sealed record Branding(string DisplayName, string? LogoUrl, string? Accent, string? AccentForeground);

    public sealed record Org(
        string Slug, string Name, string TypeName, bool IsMember, bool IsOrgLead, bool IsPortfolioLead, bool CanJoinWork,
        string[] Features, string[] Permissions, string[] Roles, RoleOption[] GrantableRoles, RoleOption[] ShareRoles, Branding Branding);

    public sealed record Access(bool IsSystemAdmin, Org[] Orgs);

    [Fact]
    public async Task A_city_lead_learns_the_features_permissions_and_the_roles_they_may_grant_and_share_with()
    {
        var grace = await factory.AddMemberAsync("Grace Okonkwo");

        var access = (await factory.ClientFor(grace, SeededRole.CityLead).GetFromJsonAsync<Access>("/api/me/access"))!;

        var toronto = Assert.Single(access.Orgs);
        Assert.Equal(("faithtech-toronto", "FaithTech City", "FaithTech Toronto"), (toronto.Slug, toronto.TypeName, toronto.Branding.DisplayName));
        Assert.Contains("partners", toronto.Features);
        Assert.Contains("people.view", toronto.Permissions);
        Assert.Equal(["City Lead"], toronto.Roles);
        Assert.Equal(
            ["event-lead", "create-lead", "communications-lead", "volunteer", "product-engineer", "attendee"],
            toronto.GrantableRoles.Select(r => r.Key));
        Assert.Contains(toronto.ShareRoles, r => r.Key == "staff" && r.IsCrossOrg);
        Assert.Contains(toronto.ShareRoles, r => r.Key == "city-lead" && !r.IsCrossOrg);
    }

    [Fact]
    public async Task A_member_with_no_grant_right_is_offered_no_role_and_an_org_lead_is_offered_the_whole_catalogue()
    {
        var member = await factory.AddMemberAsync("Ada Attendee");
        var lead = await factory.AddMemberAsync("Olivia Grant", p => p.AddRole(SeededRole.OrgLead, Guid.Empty, DateTime.UtcNow));

        var asMember = (await factory.ClientFor(member).GetFromJsonAsync<Access>("/api/me/access"))!.Orgs.Single();
        var asLead = (await factory.ClientFor(lead).GetFromJsonAsync<Access>("/api/me/access"))!.Orgs.Single();

        Assert.Empty(asMember.GrantableRoles);
        Assert.Equal(["notes.create"], asMember.Permissions);
        Assert.Equal(7, asLead.GrantableRoles.Length);
        Assert.Empty(asMember.Roles);
        Assert.Equal(["Org Lead"], asLead.Roles);
        Assert.True(asLead.IsOrgLead);
    }

    [Fact]
    public async Task A_startup_shows_only_its_features()
    {
        var engineer = await factory.AddMemberOfAsync(OrgClients.Shelfie, "Sami Shelfie");

        var shelfie = (await factory.ClientFor(engineer).GetFromJsonAsync<Access>("/api/me/access"))!.Orgs.Single();

        Assert.Equal(["agile", "integrations", "invites", "notes", "profiles", "resources"], shelfie.Features);
        Assert.DoesNotContain("events.manage", shelfie.Permissions);
    }
}
