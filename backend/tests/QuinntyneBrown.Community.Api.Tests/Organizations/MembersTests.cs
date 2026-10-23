// Traces to: L2-143, L2-142, L2-136
using System.Net;
using System.Net.Http.Json;
using QuinntyneBrown.Community.Api.Tests.Agile;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Domain.Agile;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Organizations;

/// <summary>Org Leads and the Portfolio Lead add and remove members (L2-143).</summary>
public class MembersTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private static readonly string Members = $"/api/organizations/{OrgClients.Toronto.Id}/members";

    public sealed record Role(string Key, string Name, string Kind);

    public sealed record Member(Guid ProfileId, string Name, string Kind, bool IsOrgLead, Role[] Roles, string JoinedVia);

    private sealed record Access(AccessOrg[] Orgs);

    private sealed record AccessOrg(string Slug);

    [Fact]
    public async Task An_org_lead_adds_an_existing_account_by_email_who_is_told_and_sees_the_org()
    {
        var olivia = await factory.AddMemberAsync("Olivia Grant", p => p.AddRole(SeededRole.OrgLead, Guid.Empty, DateTime.UtcNow));
        var sami = await factory.AddMemberAsync("Sami Shah", joinToronto: false);

        var response = await factory.ClientFor(olivia).PostAsJsonAsync(Members, new { email = (await factory.EmailOfAsync(sami)).ToUpperInvariant() });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var member = (await response.Content.ReadFromJsonAsync<Member>())!;
        Assert.Equal((sami.ProfileId, "Sami Shah", "Person", false, "Added"), (member.ProfileId, member.Name, member.Kind, member.IsOrgLead, member.JoinedVia));
        var notice = await factory.WithDbAsync(db => db.Notifications.SingleAsync(n => n.RecipientId == sami.ProfileId));
        Assert.Equal("Olivia Grant added you to FaithTech Toronto", notice.Title);
        var access = (await factory.ClientFor(sami).GetFromJsonAsync<Access>("/api/me/access"))!;
        Assert.Equal(["faithtech-toronto"], access.Orgs.Select(o => o.Slug));
        Assert.True(await factory.WithDbAsync(db => db.AuditEntries.AnyAsync(e => e.Action == "member.added" && e.TargetId == sami.ProfileId.ToString())));
    }

    [Fact]
    public async Task An_email_with_no_account_asks_for_an_invite_and_a_member_cannot_be_added_twice()
    {
        var olivia = await factory.AddMemberAsync("Olivia Grant", p => p.AddRole(SeededRole.OrgLead, Guid.Empty, DateTime.UtcNow));
        var ruth = await factory.AddMemberAsync("Ruth Alvarez");
        var client = factory.ClientFor(olivia);

        var unknown = await client.PostAsJsonAsync(Members, new { email = "nobody@example.org" });
        var again = await client.PostAsJsonAsync(Members, new { email = await factory.EmailOfAsync(ruth) });

        Assert.Equal(HttpStatusCode.NotFound, unknown.StatusCode);
        Assert.Equal("No account uses that email. Send an invite instead.", (await unknown.Content.ReadFromJsonAsync<ProblemDetails>())!.Detail);
        Assert.Equal(HttpStatusCode.Conflict, again.StatusCode);
    }

    [Fact]
    public async Task The_members_list_shows_roles_and_the_org_lead_flag_and_searches_by_name()
    {
        var lena = await factory.AddMemberAsync("Lena Listlead", p => p.AddRole(SeededRole.OrgLead, Guid.Empty, DateTime.UtcNow));
        await factory.AddMemberAsync("Rosa Listvolunteer", p => p.AddRole(SeededRole.Volunteer, Guid.Empty, DateTime.UtcNow));

        var members = (await factory.ClientFor(lena).GetFromJsonAsync<Member[]>($"{Members}?q=listvolunteer"))!;
        var leads = (await factory.ClientFor(lena).GetFromJsonAsync<Member[]>($"{Members}?q=listlead"))!;

        var ruth = Assert.Single(members);
        Assert.Equal(["volunteer"], ruth.Roles.Select(r => r.Key));
        Assert.True(Assert.Single(leads).IsOrgLead);
    }

    [Fact]
    public async Task Removing_a_member_drops_their_roles_there_keeps_their_records_and_flags_their_workspaces()
    {
        var olivia = await factory.AddMemberAsync("Olivia Grant", p => p.AddRole(SeededRole.OrgLead, Guid.Empty, DateTime.UtcNow));
        var grace = await factory.AddWithRolesAsync("Grace Okonkwo", SeededRole.CityLead);
        var workspace = await factory.AddWorkspaceAsync(grace, "Toronto team");

        var response = await factory.ClientFor(olivia).DeleteAsync($"{Members}/{grace.ProfileId}");

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.Empty(await factory.WithDbAsync(db => SeededRoles.OfAsync(db, grace.ProfileId)));
        Assert.False(await factory.WithDbAsync(db => db.OrgMemberships.AnyAsync(m => m.ProfileId == grace.ProfileId)));
        Assert.Equal(grace.ProfileId, (await factory.LoadWorkspaceAsync(workspace)).OwnerId);
        var notice = await factory.WithDbAsync(db => db.Notifications.SingleAsync(n => n.RecipientId == olivia.ProfileId));
        Assert.Equal("Grace Okonkwo can no longer own workspaces but owns Toronto team", notice.Title);
    }

    [Fact]
    public async Task The_last_org_lead_stays_unless_the_portfolio_lead_removes_them()
    {
        var org = await factory.AddOrgAsync("FaithTech Ottawa");
        var odette = await factory.AddMemberOfAsync(org, "Odette Ottawa", SeededRole.OrgLead);
        var quinn = await factory.AddMemberAsync("Quinn Lead", p => p.AddRole(SeededRole.PortfolioLead, Guid.Empty, DateTime.UtcNow));
        var url = $"/api/organizations/{org.Id}/members/{odette.ProfileId}";

        var bySelf = await factory.ClientFor(odette).DeleteAsync(url);
        var byPortfolioLead = await factory.ClientFor(quinn).DeleteAsync(url);

        Assert.Equal(HttpStatusCode.Conflict, bySelf.StatusCode);
        Assert.Equal("Every organization needs an Org Lead.", (await bySelf.Content.ReadFromJsonAsync<ProblemDetails>())!.Detail);
        Assert.Equal(HttpStatusCode.NoContent, byPortfolioLead.StatusCode);
    }

    [Fact]
    public async Task Only_the_portfolio_lead_makes_someone_org_lead()
    {
        var olivia = await factory.AddMemberAsync("Olivia Grant", p => p.AddRole(SeededRole.OrgLead, Guid.Empty, DateTime.UtcNow));
        var quinn = await factory.AddMemberAsync("Quinn Lead", p => p.AddRole(SeededRole.PortfolioLead, Guid.Empty, DateTime.UtcNow));
        var ruth = await factory.AddMemberAsync("Ruth Alvarez");
        var url = $"{Members}/{ruth.ProfileId}/org-lead";

        Assert.Equal(HttpStatusCode.Forbidden, (await factory.ClientFor(olivia).PutAsync(url, null)).StatusCode);
        Assert.Equal(HttpStatusCode.NoContent, (await factory.ClientFor(quinn).PutAsync(url, null)).StatusCode);
        Assert.Contains(SeededRole.OrgLead, await factory.WithDbAsync(db => SeededRoles.OfAsync(db, ruth.ProfileId)));
        Assert.Equal(HttpStatusCode.NoContent, (await factory.ClientFor(quinn).DeleteAsync(url)).StatusCode);
    }

    [Fact]
    public async Task Anyone_else_is_refused_and_an_uncovered_org_is_not_found()
    {
        var grace = await factory.AddWithRolesAsync("Grace Okonkwo", SeededRole.CityLead);
        var ruth = await factory.AddMemberAsync("Ruth Alvarez");
        var client = factory.ClientFor(grace);

        Assert.Equal(HttpStatusCode.Forbidden, (await client.GetAsync(Members)).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await client.PostAsJsonAsync(Members, new { email = "x@example.org" })).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await client.DeleteAsync($"{Members}/{ruth.ProfileId}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync($"/api/organizations/{OrgClients.Shelfie.Id}/members")).StatusCode);
    }
}
