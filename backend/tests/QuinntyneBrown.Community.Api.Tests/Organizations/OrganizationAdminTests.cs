// Traces to: L2-156, L2-144, L2-138
using System.Net;
using System.Net.Http.Json;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Organizations;

/// <summary>The Portfolio Lead creates, renames, re-slugs, archives and restores orgs, and assigns cross-org roles (L2-156, L2-138).</summary>
public class OrganizationAdminTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private static readonly string Organizations = $"/api/portfolios/{HierarchySeed.PortfolioId}/organizations";
    private static readonly string CrossOrgRoles = $"/api/portfolios/{HierarchySeed.PortfolioId}/cross-org-roles";

    public sealed record OrgTypeRef(Guid Id, string Name);

    public sealed record PersonRef(Guid ProfileId, string Name);

    public sealed record OrganizationSummary(Guid Id, string Slug, string Name, string DisplayName, OrgTypeRef OrgType, int MemberCount, PersonRef[] OrgLeads, DateTime? ArchivedAt);

    public sealed record Organization(Guid Id, string Slug, string Name, string DisplayName, OrgTypeRef OrgType, string[] Aliases);

    public sealed record CrossOrgRole(Guid Id, string Key, string Name, string[] Permissions, bool CanJoinWork, string ScopeKind, Guid? ScopeOrgTypeId, Guid[] ScopeOrgIds, int HolderCount);

    public sealed record Assignment(Guid Id, Guid ProfileId, string Name, Guid[] NarrowedOrgIds);

    private sealed record Access(AccessOrg[] Orgs);

    private sealed record AccessOrg(string Slug);

    private static string Slug(string name) => $"{name}-{Guid.NewGuid().ToString("N")[..6]}";

    private Task<ProfileClients.Member> PortfolioLeadAsync() =>
        factory.AddMemberAsync($"Quinn Lead {Guid.NewGuid():N}"[..16], p => p.AddRole(SeededRole.PortfolioLead, Guid.Empty, DateTime.UtcNow));

    // AC1, AC3
    [Fact]
    public async Task The_portfolio_lead_creates_an_org_which_is_listed_and_audited()
    {
        var client = factory.ClientFor(await PortfolioLeadAsync());
        var slug = Slug("faithtech-ottawa");

        var response = await client.PostAsJsonAsync(Organizations, new { name = "FaithTech Ottawa", slug, orgTypeId = HierarchySeed.FaithTechCityTypeId });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var created = (await response.Content.ReadFromJsonAsync<Organization>())!;
        Assert.Equal(("FaithTech Ottawa", "FaithTech City"), (created.DisplayName, created.OrgType.Name));
        var list = (await client.GetFromJsonAsync<OrganizationSummary[]>(Organizations))!;
        Assert.Contains(list, o => o.Slug == slug && o.MemberCount == 0);
        Assert.Contains(list, o => o.Slug == "faithtech-toronto");
        Assert.True(await factory.WithDbAsync(db => db.AuditEntries.AnyAsync(e => e.Action == "organization.created" && e.TargetId == created.Id.ToString())));
    }

    [Fact]
    public async Task An_invalid_slug_is_refused_and_a_taken_one_conflicts()
    {
        var client = factory.ClientFor(await PortfolioLeadAsync());

        var invalid = await client.PostAsJsonAsync(Organizations, new { name = "Bad", slug = "All", orgTypeId = HierarchySeed.FaithTechCityTypeId });
        var taken = await client.PostAsJsonAsync(Organizations, new { name = "Copy", slug = "shelfie", orgTypeId = HierarchySeed.StartupTypeId });

        Assert.Equal(HttpStatusCode.BadRequest, invalid.StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, taken.StatusCode);
    }

    // AC2, L2-144: a changed slug keeps the old one as an alias.
    [Fact]
    public async Task A_changed_slug_keeps_the_old_one_as_an_alias_and_an_org_lead_cannot_change_it()
    {
        var quinn = await PortfolioLeadAsync();
        var client = factory.ClientFor(quinn);
        var org = await factory.AddOrgAsync("FaithTech Laval");
        var lead = await factory.AddMemberOfAsync(org, "Lou Lead", SeededRole.OrgLead);
        var renamed = Slug("faithtech-laval-nord");

        var refused = await factory.ClientFor(lead, org.Slug).PutAsJsonAsync($"/api/organizations/{org.Id}", new { name = "Laval", slug = renamed });
        var response = await client.PutAsJsonAsync($"/api/organizations/{org.Id}", new { name = "FaithTech Laval Nord", slug = renamed });

        Assert.Equal(HttpStatusCode.Forbidden, refused.StatusCode);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var saved = (await response.Content.ReadFromJsonAsync<Organization>())!;
        Assert.Equal((renamed, "FaithTech Laval Nord"), (saved.Slug, saved.Name));
        Assert.Equal([org.Slug], saved.Aliases);
        var resolved = await factory.ClientFor(lead).GetFromJsonAsync<System.Text.Json.JsonElement>($"/api/orgs/resolve/{org.Slug}");
        Assert.Equal(renamed, resolved.GetProperty("slug").GetString());
    }

    // AC2: an archived org leaves every switcher and its records are not found; the Portfolio Lead restores it.
    [Fact]
    public async Task An_archived_org_disappears_for_its_members_and_comes_back_when_restored()
    {
        var client = factory.ClientFor(await PortfolioLeadAsync());
        var org = await factory.AddOrgAsync("FaithTech Gatineau");
        var member = await factory.AddMemberOfAsync(org, "Gab Member");
        var memberClient = factory.ClientFor(member);

        Assert.Equal(HttpStatusCode.NoContent, (await client.PostAsync($"/api/organizations/{org.Id}/archive", null)).StatusCode);

        Assert.DoesNotContain((await memberClient.GetFromJsonAsync<Access>("/api/me/access"))!.Orgs, o => o.Slug == org.Slug);
        var archived = (await client.GetFromJsonAsync<OrganizationSummary[]>($"{Organizations}?archived=true"))!;
        Assert.Contains(archived, o => o.Id == org.Id && o.ArchivedAt is not null);
        Assert.DoesNotContain((await client.GetFromJsonAsync<OrganizationSummary[]>(Organizations))!, o => o.Id == org.Id);

        Assert.Equal(HttpStatusCode.NoContent, (await client.PostAsync($"/api/organizations/{org.Id}/restore", null)).StatusCode);
        Assert.Contains((await memberClient.GetFromJsonAsync<Access>("/api/me/access"))!.Orgs, o => o.Slug == org.Slug);
    }

    // AC5
    [Fact]
    public async Task A_member_or_org_lead_cannot_create_or_archive_orgs()
    {
        var olivia = await factory.AddMemberAsync("Olivia Grant", p => p.AddRole(SeededRole.OrgLead, Guid.Empty, DateTime.UtcNow));
        var client = factory.ClientFor(olivia);

        Assert.Equal(HttpStatusCode.Forbidden, (await client.PostAsJsonAsync(Organizations, new { name = "Nope", slug = Slug("nope"), orgTypeId = HierarchySeed.FaithTechCityTypeId })).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await client.PostAsync($"/api/organizations/{OrgClients.Toronto.Id}/archive", null)).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await client.PostAsync($"/api/organizations/{OrgClients.Shelfie.Id}/archive", null)).StatusCode);
    }

    // L2-138 AC2, AC4, AC7: a cross-org role covers every org of its type, an assignment can narrow it, and both are audited.
    [Fact]
    public async Task A_cross_org_role_scoped_to_a_type_covers_its_orgs_and_can_be_narrowed_and_unassigned()
    {
        var client = factory.ClientFor(await PortfolioLeadAsync());
        var key = $"mentor-{Guid.NewGuid().ToString("N")[..6]}";
        var created = await client.PostAsJsonAsync(CrossOrgRoles, new
        {
            key, name = "Mentor", description = "Mentors every startup", permissions = new[] { "people.view" }, canJoinWork = true,
            scope = new { kind = "OrgType", orgTypeId = HierarchySeed.StartupTypeId, orgIds = Array.Empty<Guid>() },
        });
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        var role = (await created.Content.ReadFromJsonAsync<CrossOrgRole>())!;
        var second = await factory.AddOrgAsync("Startup Two", HierarchySeed.StartupTypeId);
        var mentor = await factory.AddMemberAsync("Mae Mentor", joinToronto: false);
        var mentorClient = factory.ClientFor(mentor);

        var assigned = await client.PostAsJsonAsync($"/api/cross-org-roles/{role.Id}/assignments", new { profileId = mentor.ProfileId, narrowedOrgIds = Array.Empty<Guid>() });

        Assert.Equal(HttpStatusCode.Created, assigned.StatusCode);
        var assignment = (await assigned.Content.ReadFromJsonAsync<Assignment>())!;
        var covered = (await mentorClient.GetFromJsonAsync<Access>("/api/me/access"))!.Orgs.Select(o => o.Slug).ToList();
        Assert.Contains("shelfie", covered);
        Assert.Contains(second.Slug, covered);
        Assert.DoesNotContain("faithtech-toronto", covered);

        var narrowed = await client.PutAsJsonAsync($"/api/cross-org-roles/{role.Id}/assignments/{assignment.Id}", new { narrowedOrgIds = new[] { second.Id } });
        Assert.Equal(HttpStatusCode.OK, narrowed.StatusCode);
        Assert.Equal([second.Slug], (await mentorClient.GetFromJsonAsync<Access>("/api/me/access"))!.Orgs.Select(o => o.Slug));

        Assert.Equal(HttpStatusCode.NoContent, (await client.DeleteAsync($"/api/cross-org-roles/{role.Id}/assignments/{assignment.Id}")).StatusCode);
        Assert.Empty((await mentorClient.GetFromJsonAsync<Access>("/api/me/access"))!.Orgs);
        Assert.True(await factory.WithDbAsync(db => db.AuditEntries.AnyAsync(e => e.Action == "crossOrgRole.assigned" && e.TargetId == mentor.ProfileId.ToString())));
        var roles = (await client.GetFromJsonAsync<CrossOrgRole[]>(CrossOrgRoles))!;
        Assert.Contains(roles, r => r.Name == "Staff" && r.ScopeKind == "OrgType");
    }

    [Fact]
    public async Task Only_the_portfolio_lead_manages_cross_org_roles()
    {
        var olivia = await factory.AddMemberAsync("Olivia Grant", p => p.AddRole(SeededRole.OrgLead, Guid.Empty, DateTime.UtcNow));
        var client = factory.ClientFor(olivia);

        var create = await client.PostAsJsonAsync(CrossOrgRoles, new { key = "x-role", name = "X", permissions = Array.Empty<string>(), canJoinWork = false, scope = new { kind = "Portfolio" } });
        var assign = await client.PostAsJsonAsync($"/api/cross-org-roles/{HierarchySeed.StaffRoleId}/assignments", new { profileId = olivia.ProfileId });

        Assert.Equal(HttpStatusCode.Forbidden, create.StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, assign.StatusCode);
    }
}
