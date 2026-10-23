// Traces to: L2-008, L2-009, L2-041, L2-136
using System.Net;
using System.Net.Http.Json;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Domain.Notifications;
using QuinntyneBrown.Community.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Admin;

public class AssignRolesTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private static readonly Guid Granter = Guid.NewGuid();

    public sealed record RoleDto(string Key, string Name, string Kind, Guid? OrganizationId, string? OrganizationName);

    [Theory]
    [InlineData(SeededRole.EventLead)]
    [InlineData(SeededRole.CreateLead)]
    [InlineData(SeededRole.CommunicationsLead)]
    [InlineData(SeededRole.Volunteer)]
    [InlineData(SeededRole.ProductEngineer)]
    [InlineData(SeededRole.Attendee)]
    public async Task City_lead_adds_a_role_in_their_can_grant_list_and_the_owner_is_notified(SeededRole role)
    {
        var grace = await factory.AddMemberAsync("Grace Okonkwo");
        var ruth = await factory.AddMemberAsync("Ruth Alvarez");

        var response = await factory.ClientFor(grace, SeededRole.CityLead).PostAsJsonAsync($"/api/profiles/{ruth.ProfileId}/roles", new { Role = role.Key() });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var roles = (await response.Content.ReadFromJsonAsync<RoleDto[]>())!;
        Assert.Equal([role.Key()], roles.Select(r => r.Key));
        Assert.Equal("FaithTech Toronto", roles.Single().OrganizationName);
        Assert.True(await HoldsAsync(ruth, role));
        var notification = await factory.WithDbAsync(db => db.Notifications.SingleAsync(n => n.RecipientId == ruth.ProfileId));
        Assert.Equal(NotificationKind.RoleChanged, notification.Kind);
        Assert.Contains("Grace Okonkwo", notification.Title);
        Assert.Contains(role.Name(), notification.Title);
        Assert.Single(await factory.QueuedEmailsToAsync(await EmailOfAsync(ruth)));
    }

    [Fact]
    public async Task City_lead_removes_a_permitted_role_and_the_owner_is_notified()
    {
        var grace = await factory.AddMemberAsync("Grace Okonkwo");
        var ruth = await factory.AddMemberAsync("Ruth Alvarez", p => { p.AddRole(SeededRole.Volunteer, Granter, DateTime.UtcNow); p.AddRole(SeededRole.Attendee, Granter, DateTime.UtcNow); });

        var response = await factory.ClientFor(grace, SeededRole.CityLead).DeleteAsync($"/api/profiles/{ruth.ProfileId}/roles/volunteer");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(["attendee"], (await response.Content.ReadFromJsonAsync<RoleDto[]>())!.Select(r => r.Key));
        Assert.False(await HoldsAsync(ruth, SeededRole.Volunteer));
        Assert.True(await factory.WithDbAsync(db => db.Notifications.AnyAsync(n => n.RecipientId == ruth.ProfileId && n.Kind == NotificationKind.RoleChanged)));
    }

    [Theory]
    [InlineData(SeededRole.CityLead)]
    [InlineData(SeededRole.OrgLead)]
    [InlineData(SeededRole.PortfolioLead)]
    [InlineData(SeededRole.SystemAdmin)]
    public async Task City_lead_cannot_grant_or_remove_city_lead_or_any_tier(SeededRole role)
    {
        var grace = await factory.AddMemberAsync("Grace Okonkwo");
        var marcus = await factory.AddMemberAsync("Marcus Lee");
        var holder = await factory.AddMemberAsync("Daniel Reyes", p => p.AddRole(role, Granter, DateTime.UtcNow));
        var client = factory.ClientFor(grace, SeededRole.CityLead);

        var grant = await client.PostAsJsonAsync($"/api/profiles/{marcus.ProfileId}/roles", new { Role = role.Key() });
        var remove = await client.DeleteAsync($"/api/profiles/{holder.ProfileId}/roles/{role.Key()}");

        Assert.Equal(HttpStatusCode.Forbidden, grant.StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, remove.StatusCode);
        Assert.False(await HoldsAsync(marcus, role));
        Assert.True(await HoldsAsync(holder, role));
    }

    [Theory]
    [InlineData(SeededRole.CityLead)]
    [InlineData(SeededRole.Volunteer)]
    public async Task Org_lead_grants_any_catalogue_role_in_their_org_and_the_owner_is_notified(SeededRole role)
    {
        var lead = await factory.AddMemberAsync("Olivia Grant", p => p.AddRole(SeededRole.OrgLead, Granter, DateTime.UtcNow));
        var ruth = await factory.AddMemberAsync("Ruth Alvarez");

        var response = await factory.ClientFor(lead).PostAsJsonAsync($"/api/profiles/{ruth.ProfileId}/roles", new { Role = role.Key() });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True(await HoldsAsync(ruth, role));
        Assert.True(await factory.WithDbAsync(db => db.Notifications.AnyAsync(n => n.RecipientId == ruth.ProfileId && n.Kind == NotificationKind.RoleChanged)));
    }

    [Theory]
    [InlineData(SeededRole.OrgLead)]
    [InlineData(SeededRole.PortfolioLead)]
    [InlineData(SeededRole.SystemAdmin)]
    public async Task Org_lead_cannot_grant_org_lead_or_platform_tiers(SeededRole role)
    {
        var lead = await factory.AddMemberAsync("Olivia Grant", p => p.AddRole(SeededRole.OrgLead, Granter, DateTime.UtcNow));
        var ruth = await factory.AddMemberAsync("Ruth Alvarez");

        var response = await factory.ClientFor(lead).PostAsJsonAsync($"/api/profiles/{ruth.ProfileId}/roles", new { Role = role.Key() });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        Assert.False(await HoldsAsync(ruth, role));
    }

    [Theory]
    [InlineData(SeededRole.OrgLead)]
    [InlineData(SeededRole.CityLead)]
    public async Task Portfolio_lead_grants_org_lead_and_catalogue_roles_and_each_change_is_audited_not_notified(SeededRole role)
    {
        var quinn = await factory.AddMemberAsync("Quinn Lead", p => p.AddRole(SeededRole.PortfolioLead, Granter, DateTime.UtcNow));
        var esther = await factory.AddMemberAsync("Esther Nakamura");

        var response = await factory.ClientFor(quinn).PostAsJsonAsync($"/api/profiles/{esther.ProfileId}/roles", new { Role = role.Key() });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True(await HoldsAsync(esther, role));
        var entry = await factory.WithDbAsync(db => db.AuditEntries.SingleAsync(a => a.TargetId == esther.ProfileId.ToString()));
        Assert.Equal("role.granted", entry.Action);
        Assert.Equal(HierarchySeed.TorontoId, entry.OrganizationId);
        Assert.Equal(HierarchySeed.PortfolioId, entry.PortfolioId);
        Assert.False(await factory.WithDbAsync(db => db.Notifications.AnyAsync(n => n.RecipientId == esther.ProfileId)));
    }

    [Theory]
    [InlineData(SeededRole.SystemAdmin)]
    [InlineData(SeededRole.PortfolioLead)]
    [InlineData(SeededRole.OrgLead)]
    [InlineData(SeededRole.Volunteer)]
    public async Task System_admin_grants_and_removes_any_role_and_each_change_is_audited(SeededRole role)
    {
        var priya = await factory.AddMemberAsync("Priya Shah", p => p.AddRole(SeededRole.SystemAdmin, Granter, DateTime.UtcNow));
        var esther = await factory.AddMemberAsync("Esther Nakamura");
        var client = factory.ClientFor(priya, SeededRole.SystemAdmin);

        var grant = await client.PostAsJsonAsync($"/api/profiles/{esther.ProfileId}/roles", new { Role = role.Key() });
        var remove = await client.DeleteAsync($"/api/profiles/{esther.ProfileId}/roles/{role.Key()}");

        Assert.Equal(HttpStatusCode.OK, grant.StatusCode);
        Assert.Equal(HttpStatusCode.OK, remove.StatusCode);
        var entries = await factory.WithDbAsync(db => db.AuditEntries
            .Where(a => a.TargetId == esther.ProfileId.ToString()).OrderBy(a => a.OccurredAtUtc).ThenBy(a => a.Action).ToListAsync());
        Assert.Equal(["role.granted", "role.removed"], entries.Select(e => e.Action).Order());
        Assert.All(entries, e => Assert.Equal(priya.ProfileId, e.ActorId));
        var granted = entries.Single(e => e.Action == "role.granted");
        Assert.Equal("{\"Roles\":[]}", granted.BeforeJson);
        Assert.Equal($"{{\"Roles\":[\"{role.Key()}\"]}}", granted.AfterJson);
        Assert.False(await factory.WithDbAsync(db => db.Notifications.AnyAsync(n => n.RecipientId == esther.ProfileId)));
    }

    [Fact]
    public async Task City_lead_role_changes_are_audited_too()
    {
        var grace = await factory.AddMemberAsync("Grace Okonkwo");
        var jonah = await factory.AddMemberAsync("Jonah Bell");

        await factory.ClientFor(grace, SeededRole.CityLead).PostAsJsonAsync($"/api/profiles/{jonah.ProfileId}/roles", new { Role = "attendee" });

        var entry = await factory.WithDbAsync(db => db.AuditEntries.SingleAsync(a => a.TargetId == jonah.ProfileId.ToString()));
        Assert.Equal("role.granted", entry.Action);
        Assert.Equal(grace.ProfileId, entry.ActorId);
        Assert.Equal(HierarchySeed.TorontoId, entry.OrganizationId);
    }

    [Theory]
    [InlineData]
    [InlineData(SeededRole.Staff)]
    [InlineData(SeededRole.EventLead)]
    [InlineData(SeededRole.Volunteer)]
    [InlineData(SeededRole.Portfolio)]
    public async Task Any_other_role_gets_403(params SeededRole[] roles)
    {
        var member = await factory.AddMemberAsync("Leah Thompson");
        var jonah = await factory.AddMemberAsync("Jonah Bell", p => p.AddRole(SeededRole.Attendee, Granter, DateTime.UtcNow));
        var client = factory.ClientFor(member, roles);

        var grant = await client.PostAsJsonAsync($"/api/profiles/{jonah.ProfileId}/roles", new { Role = "volunteer" });
        var remove = await client.DeleteAsync($"/api/profiles/{jonah.ProfileId}/roles/attendee");

        Assert.Equal(HttpStatusCode.Forbidden, grant.StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, remove.StatusCode);
        Assert.Equal([SeededRole.Attendee], await factory.WithDbAsync(db => SeededRoles.OfAsync(db, jonah.ProfileId)));
    }

    [Fact]
    public async Task A_role_change_for_someone_outside_the_callers_orgs_is_404()
    {
        var grace = await factory.AddMemberAsync("Grace Okonkwo");
        var shelfie = await factory.AddMemberAsync("Sam Shelfie", joinToronto: false);
        await factory.WithDbAsync(async db =>
        {
            db.OrgMemberships.Add(new Domain.Organizations.OrgMembership(HierarchySeed.ShelfieId, shelfie.ProfileId, Domain.Organizations.JoinedVia.Seed, DateTime.UtcNow));
            return await db.SaveChangesAsync();
        });

        var response = await factory.ClientFor(grace, SeededRole.CityLead).PostAsJsonAsync($"/api/profiles/{shelfie.ProfileId}/roles", new { Role = "volunteer" });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task The_last_system_admin_cannot_be_removed()
    {
        // Each fixture shares one database, so clear other admins first to make this the last one.
        await factory.WithDbAsync(async db =>
        {
            foreach (var p in await db.Profiles.Where(p => p.IsSystemAdmin).ToListAsync())
            {
                p.SetSystemAdmin(false);
            }

            return await db.SaveChangesAsync();
        });
        var priya = await factory.AddMemberAsync("Priya Shah", p => p.AddRole(SeededRole.SystemAdmin, Granter, DateTime.UtcNow));
        var client = factory.ClientFor(priya, SeededRole.SystemAdmin);

        var response = await client.DeleteAsync($"/api/profiles/{priya.ProfileId}/roles/system-admin");

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.Equal("There must always be at least one System Admin.", problem!.Detail);
        Assert.True(await HoldsAsync(priya, SeededRole.SystemAdmin));

        var second = await factory.AddMemberAsync("Second Admin", p => p.AddRole(SeededRole.SystemAdmin, Granter, DateTime.UtcNow));
        Assert.Equal(HttpStatusCode.OK, (await client.DeleteAsync($"/api/profiles/{second.ProfileId}/roles/system-admin")).StatusCode);
    }

    [Fact]
    public async Task A_held_role_cannot_be_added_again_nor_a_missing_one_removed()
    {
        var grace = await factory.AddMemberAsync("Grace Okonkwo");
        var ruth = await factory.AddMemberAsync("Ruth Alvarez", p => p.AddRole(SeededRole.Volunteer, Granter, DateTime.UtcNow));
        var client = factory.ClientFor(grace, SeededRole.CityLead);

        var again = await client.PostAsJsonAsync($"/api/profiles/{ruth.ProfileId}/roles", new { Role = "volunteer" });
        var missing = await client.DeleteAsync($"/api/profiles/{ruth.ProfileId}/roles/attendee");

        Assert.Equal(HttpStatusCode.Conflict, again.StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, missing.StatusCode);
    }

    [Fact]
    public async Task Unknown_role_is_400_and_unknown_profile_is_404_to_a_city_lead_and_403_to_a_member()
    {
        var grace = await factory.AddMemberAsync("Grace Okonkwo");
        var ruth = await factory.AddMemberAsync("Ruth Alvarez");
        var unknown = $"/api/profiles/{Guid.NewGuid()}/roles";

        var badRole = await factory.ClientFor(grace, SeededRole.CityLead).PostAsJsonAsync($"/api/profiles/{ruth.ProfileId}/roles", new { Role = "pope" });
        var asLead = await factory.ClientFor(grace, SeededRole.CityLead).PostAsJsonAsync(unknown, new { Role = "volunteer" });
        var asMember = await factory.ClientFor(ruth).PostAsJsonAsync(unknown, new { Role = "volunteer" });

        Assert.Equal(HttpStatusCode.BadRequest, badRole.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, asLead.StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, asMember.StatusCode);
    }

    private Task<bool> HoldsAsync(ProfileClients.Member member, SeededRole role) =>
        factory.WithDbAsync(db => SeededRoles.HoldsAsync(db, member.ProfileId, role));

    private Task<string> EmailOfAsync(ProfileClients.Member member) =>
        factory.WithDbAsync(db => db.Users.Where(u => u.Id == member.UserId).Select(u => u.Email!).SingleAsync());
}
