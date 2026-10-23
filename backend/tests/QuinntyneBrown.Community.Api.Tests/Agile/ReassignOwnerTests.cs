// Traces to: L2-037 AC2, L2-042
using System.Net;
using System.Net.Http.Json;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Domain.Notifications;
using QuinntyneBrown.Community.Domain.Profiles;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Agile;

public class ReassignOwnerTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    public record Workspace(Guid OwnerId, bool NeedsNewOwner);

    public record OwnerView(string Access, bool NeedsNewOwner);

    [Fact]
    public async Task Given_an_owner_who_loses_city_lead_when_the_role_is_removed_then_each_system_admin_is_notified()
    {
        var cast = await factory.AddCastAsync();
        // The org's Org Lead hears about it (L2-146 AC4).
        var orgLead = await factory.AddWithRolesAsync("Olivia Grant", SeededRole.OrgLead);

        var response = await factory.AdminClient(cast).DeleteAsync($"/api/profiles/{cast.Owner.ProfileId}/roles/city-lead");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var notification = await factory.WithDbAsync(db => db.Notifications
            .SingleAsync(n => n.RecipientId == orgLead.ProfileId && n.Kind == NotificationKind.WorkspaceOwnerLostCityLead));
        Assert.Equal(
            ("Grace Okonkwo can no longer own workspaces but owns Toronto team", $"/workspaces/{cast.WorkspaceId}/settings"),
            (notification.Title, notification.LinkPath));
        var workspace = await factory.AdminClient(cast).GetFromJsonAsync<Workspace>($"/api/workspaces/{cast.WorkspaceId}");
        Assert.True(workspace!.NeedsNewOwner);
    }

    [Fact]
    public async Task Given_an_archived_workspace_whose_owner_lost_city_lead_then_it_is_not_flagged_until_it_is_restored()
    {
        var cast = await factory.AddCastAsync();
        await factory.OwnerClient(cast).PostAsync($"/api/workspaces/{cast.WorkspaceId}/archive", null);

        await factory.AdminClient(cast).DeleteAsync($"/api/profiles/{cast.Owner.ProfileId}/roles/city-lead");

        var archived = (await factory.AdminClient(cast).GetFromJsonAsync<WorkspacesTests.Summary[]>("/api/workspaces"))!.Single(w => w.Id == cast.WorkspaceId);
        Assert.Equal((true, false), (archived.IsArchived, archived.NeedsNewOwner));
        Assert.False(await factory.WithDbAsync(db => db.Notifications.AnyAsync(n => n.Kind == NotificationKind.WorkspaceOwnerLostCityLead && n.LinkPath.Contains(cast.WorkspaceId.ToString()))));

        await factory.AdminClient(cast).PostAsync($"/api/workspaces/{cast.WorkspaceId}/restore", null);

        var restored = (await factory.AdminClient(cast).GetFromJsonAsync<WorkspacesTests.Summary[]>("/api/workspaces"))!.Single(w => w.Id == cast.WorkspaceId);
        Assert.Equal((false, true), (restored.IsArchived, restored.NeedsNewOwner));
    }

    [Fact]
    public async Task Given_a_workspace_needing_an_owner_when_a_system_admin_reassigns_it_to_a_city_lead_then_the_former_owner_stays_a_member_and_it_is_audited()
    {
        var cast = await factory.AddCastAsync();
        var joel = await factory.AddWithRolesAsync("Joel Mbeki", SeededRole.CityLead);
        await factory.AdminClient(cast).DeleteAsync($"/api/profiles/{cast.Owner.ProfileId}/roles/city-lead");

        var response = await factory.AdminClient(cast).PutAsJsonAsync($"/api/workspaces/{cast.WorkspaceId}/owner", new { OwnerId = joel.ProfileId });

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        var workspace = await factory.LoadWorkspaceAsync(cast.WorkspaceId);
        Assert.Equal(joel.ProfileId, workspace.OwnerId);
        Assert.True(workspace.IsMember(cast.Owner.ProfileId));
        var entry = await factory.WithDbAsync(db => db.AuditEntries.SingleAsync(a => a.TargetId == cast.WorkspaceId.ToString()));
        Assert.Equal("workspace.owner.reassigned", entry.Action);
        Assert.Contains(joel.ProfileId.ToString(), entry.AfterJson);
        var asJoel = await factory.ClientFor(joel, SeededRole.CityLead).GetFromJsonAsync<OwnerView>($"/api/workspaces/{cast.WorkspaceId}");
        Assert.Equal(("Owner", false), (asJoel!.Access, asJoel.NeedsNewOwner));
    }

    [Fact]
    public async Task Given_a_profile_without_city_lead_when_a_system_admin_picks_them_then_400_and_the_owner_is_unchanged()
    {
        var cast = await factory.AddCastAsync();

        var response = await factory.AdminClient(cast).PutAsJsonAsync($"/api/workspaces/{cast.WorkspaceId}/owner", new { OwnerId = cast.Member.ProfileId });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("Choose someone who can create workspaces in this organization.", await response.Content.ReadAsStringAsync());
        Assert.Equal(cast.Owner.ProfileId, (await factory.LoadWorkspaceAsync(cast.WorkspaceId)).OwnerId);
    }

    [Fact]
    public async Task Given_no_owner_chosen_then_400()
    {
        var cast = await factory.AddCastAsync();

        var response = await factory.AdminClient(cast).PutAsJsonAsync($"/api/workspaces/{cast.WorkspaceId}/owner", new { OwnerId = (Guid?)null });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("Choose who will own this workspace.", await response.Content.ReadAsStringAsync());
    }

    [Theory]
    [InlineData("owner", HttpStatusCode.Forbidden)]
    [InlineData("member", HttpStatusCode.Forbidden)]
    [InlineData("staff", HttpStatusCode.Forbidden)]
    [InlineData("outsider", HttpStatusCode.NotFound)]
    public async Task Given_anyone_but_a_system_admin_when_they_reassign_the_owner_then_refused(string who, HttpStatusCode expected)
    {
        var cast = await factory.AddCastAsync();
        var joel = await factory.AddWithRolesAsync("Joel Mbeki", SeededRole.CityLead);
        var client = who switch
        {
            "owner" => factory.OwnerClient(cast),
            "member" => factory.MemberClient(cast),
            "staff" => factory.StaffClient(cast),
            _ => factory.OutsiderClient(cast),
        };

        var response = await client.PutAsJsonAsync($"/api/workspaces/{cast.WorkspaceId}/owner", new { OwnerId = joel.ProfileId });

        Assert.Equal(expected, response.StatusCode);
        Assert.Equal(cast.Owner.ProfileId, (await factory.LoadWorkspaceAsync(cast.WorkspaceId)).OwnerId);
    }

    [Fact]
    public async Task Given_a_system_admin_when_they_list_owner_candidates_then_only_city_leads_but_the_current_owner_are_offered()
    {
        var cast = await factory.AddCastAsync();
        var joel = await factory.AddWithRolesAsync("Joel Mbeki", SeededRole.CityLead);

        var candidates = await factory.AdminClient(cast).GetFromJsonAsync<AgileCandidate[]>($"/api/workspaces/{cast.WorkspaceId}/owner-candidates");

        Assert.Contains(candidates!, c => c.ProfileId == joel.ProfileId);
        Assert.DoesNotContain(candidates!, c => c.ProfileId == cast.Owner.ProfileId || c.ProfileId == cast.Member.ProfileId);
        Assert.Equal(HttpStatusCode.Forbidden, (await factory.OwnerClient(cast).GetAsync($"/api/workspaces/{cast.WorkspaceId}/owner-candidates")).StatusCode);
    }

    public record AgileCandidate(Guid ProfileId, string Name);
}
