// Traces to: L2-134, L2-135, L2-138
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Domain.Organizations;
using QuinntyneBrown.Community.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Organizations;

/// <summary>Permissions come from catalogue data, cross-org roles and tiers, resolved on every request (ADR 0033 to 0035).</summary>
public class PermissionResolutionTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private static readonly DateTimeOffset Start = new(2027, 3, 4, 23, 0, 0, TimeSpan.Zero);

    private static object NewEvent(string title = "Builders Night") => new
    {
        title, description = "Build.", type = "BuildersNight", startsAt = Start, endsAt = Start.AddHours(2), city = "Toronto",
        format = "InPerson", venue = "The Hub", visibility = "MembersOnly",
    };

    [Fact]
    public async Task Several_roles_give_the_union_of_their_permissions()
    {
        var member = await factory.AddMemberAsync("Hannah Lee");

        var eventOnly = await factory.ClientFor(member, SeededRole.EventLead).PostAsJsonAsync("/api/announcements",
            new { Subject = "Hi", Body = "Hello there.", AlsoEmail = false, Audience = new { Kind = "Everyone" } });
        var both = await factory.ClientFor(member, SeededRole.CommunicationsLead).PostAsJsonAsync("/api/announcements",
            new { Subject = "Hi", Body = "Hello there.", AlsoEmail = false, Audience = new { Kind = "Everyone" } });
        var events = await factory.ClientFor(member).PostAsJsonAsync("/api/events", NewEvent());

        Assert.Equal(HttpStatusCode.Forbidden, eventOnly.StatusCode);
        Assert.Equal(HttpStatusCode.Created, both.StatusCode);
        Assert.Equal(HttpStatusCode.Created, events.StatusCode);
    }

    [Fact]
    public async Task A_permission_removed_from_a_catalogue_role_is_refused_on_the_next_request()
    {
        // A type of its own, so editing its catalogue leaves the seeded one alone.
        var (org, roleId) = await factory.WithDbAsync(async db =>
        {
            var type = new OrgType(HierarchySeed.PortfolioId, $"test-{Guid.NewGuid():N}", "Test City", Features.Switchable, []);
            var role = new RoleDefinition(type.Id, "organizer", "Organizer", null, 0, [Permissions.EventsManage]);
            var o = new Organization(HierarchySeed.PortfolioId, type.Id, "Test City One", $"test-city-{Guid.NewGuid().ToString("N")[..8]}");
            db.AddRange(type, role, o);
            await db.SaveChangesAsync();
            return (new OrgClients.Org(o.Id, o.Slug, o.Name), role.Id);
        });
        var member = await factory.AddMemberOfAsync(org, "Olu Organizer");
        await factory.WithDbAsync(async db =>
        {
            db.OrgRoleAssignments.Add(new OrgRoleAssignment(org.Id, member.ProfileId, roleId, Guid.Empty, DateTime.UtcNow));
            return await db.SaveChangesAsync();
        });
        var client = factory.ClientFor(member);
        Assert.Equal(HttpStatusCode.Created, (await client.PostAsJsonAsync("/api/events", NewEvent())).StatusCode);

        await factory.WithDbAsync(async db =>
        {
            (await db.RoleDefinitions.SingleAsync(r => r.Id == roleId)).SetPermissions([]);
            return await db.SaveChangesAsync();
        });

        Assert.Equal(HttpStatusCode.Forbidden, (await client.PostAsJsonAsync("/api/events", NewEvent())).StatusCode);
    }

    [Fact]
    public async Task An_org_lead_holds_every_permission_in_their_org_but_never_another_persons_private_contacts()
    {
        var grace = await factory.AddMemberAsync("Grace Okonkwo", p => p.AddRole(SeededRole.CityLead, Guid.Empty, DateTime.UtcNow));
        var contact = await factory.ClientFor(grace).PostAsJsonAsync("/api/contacts", new { Name = "Tomás Ortega", City = "Toronto" });
        var contactId = (await contact.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("id").GetGuid();
        var orgLead = factory.ClientFor(await factory.AddMemberAsync("Olivia Grant"), SeededRole.OrgLead);

        Assert.Equal(HttpStatusCode.Created, (await orgLead.PostAsJsonAsync("/api/events", NewEvent())).StatusCode);
        Assert.Equal(HttpStatusCode.Created, (await orgLead.PostAsJsonAsync("/api/workspaces", new { Name = "Leads", Method = "Kanban" })).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await orgLead.GetAsync("/api/reports")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await orgLead.GetAsync($"/api/contacts/{contactId}")).StatusCode);
    }

    [Fact]
    public async Task Staff_read_the_pipeline_people_and_reports_of_every_faithtech_city_but_change_nothing()
    {
        var halifax = await factory.AddOrgAsync("FaithTech Halifax");
        var lead = await factory.AddMemberOfAsync(halifax, "Hannah Halifax", SeededRole.CityLead);
        var partner = await factory.ClientFor(lead).PostAsJsonAsync("/api/partners", new { Name = "Halifax Church" });
        var partnerId = (await partner.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("id").GetGuid();
        // Staff covers every FaithTech City org, including one created after the assignment (L2-138 AC2).
        var staff = await factory.AddMemberAsync("Zed Staffer", joinToronto: false);
        await factory.AssignCrossOrgAsync(staff, SeededRole.Staff);
        var later = await factory.AddOrgAsync("FaithTech Calgary");
        var client = factory.ClientFor(staff);

        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync($"/api/partners/{partnerId}")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await client.PutAsJsonAsync($"/api/partners/{partnerId}", new { Name = "Renamed" })).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await factory.ClientFor(staff, later.Slug).GetAsync("/api/reports")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await factory.ClientFor(staff, halifax.Slug).GetAsync("/api/people")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await factory.ClientFor(staff, OrgClients.Shelfie.Slug).GetAsync("/api/workspaces")).StatusCode);
    }

    [Fact]
    public async Task The_portfolio_role_reads_every_org_but_manages_nothing_and_a_narrowed_assignment_reaches_only_its_orgs()
    {
        var wife = await factory.AddMemberAsync("Pat Portfolio", joinToronto: false);
        await factory.AssignCrossOrgAsync(wife, SeededRole.Portfolio);
        var agent = await factory.AddMemberAsync("Narrow Reader", joinToronto: false);
        await factory.AssignCrossOrgAsync(agent, SeededRole.Portfolio, OrgClients.Shelfie);

        var access = await factory.ClientFor(wife).GetFromJsonAsync<JsonElement>("/api/me/access");
        var slugs = access.GetProperty("orgs").EnumerateArray().Select(o => o.GetProperty("slug").GetString()).ToList();
        Assert.Contains("faithtech-toronto", slugs);
        Assert.Contains("shelfie", slugs);
        Assert.Equal(HttpStatusCode.OK, (await factory.ClientFor(wife, "faithtech-toronto").GetAsync("/api/partners")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await factory.ClientFor(wife, "faithtech-toronto").PostAsJsonAsync("/api/events", NewEvent())).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await factory.ClientFor(agent, "faithtech-toronto").GetAsync("/api/events")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await factory.ClientFor(agent, "shelfie").GetAsync("/api/workspaces")).StatusCode);
    }

    [Fact]
    public async Task Holders_of_a_cross_org_role_that_can_join_work_can_be_added_to_workspaces_and_others_cannot()
    {
        var owner = await factory.AddMemberAsync("Grace Okonkwo", p => p.AddRole(SeededRole.CityLead, Guid.Empty, DateTime.UtcNow));
        var created = await factory.ClientFor(owner).PostAsJsonAsync("/api/workspaces", new { Name = "Toronto build", Method = "Kanban" });
        var workspaceId = (await created.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("id").GetGuid();
        var portfolio = await factory.AddMemberAsync("Pat Portfolio", joinToronto: false);
        await factory.AssignCrossOrgAsync(portfolio, SeededRole.Portfolio);
        var staff = await factory.AddMemberAsync("Zed Staffer", joinToronto: false);
        await factory.AssignCrossOrgAsync(staff, SeededRole.Staff);

        var candidates = await factory.ClientFor(owner).GetFromJsonAsync<JsonElement>($"/api/workspaces/{workspaceId}/candidates");
        var addPortfolio = await factory.ClientFor(owner).PostAsJsonAsync($"/api/workspaces/{workspaceId}/members", new { ProfileIds = new[] { portfolio.ProfileId } });
        var addStaff = await factory.ClientFor(owner).PostAsJsonAsync($"/api/workspaces/{workspaceId}/members", new { ProfileIds = new[] { staff.ProfileId } });

        var offered = candidates.EnumerateArray().Single(c => c.GetProperty("profileId").GetGuid() == portfolio.ProfileId);
        Assert.True(offered.GetProperty("isCrossOrg").GetBoolean());
        Assert.True(addPortfolio.IsSuccessStatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, addStaff.StatusCode);
    }
}
