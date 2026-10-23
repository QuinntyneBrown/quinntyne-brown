// Traces to: L2-140
using System.Net;
using System.Net.Http.Json;
using QuinntyneBrown.Community.Api.Tests.Profiles;

namespace QuinntyneBrown.Community.Api.Tests.Organizations;

/// <summary>A profile is visible to its owner, people who share or cover one of its orgs, and System Admin (D9).</summary>
public class ProfileVisibilityTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private async Task<ProfileClients.Member> ShelfieEngineerAsync(string name) =>
        await factory.AddMemberOfAsync(OrgClients.Shelfie, name);

    [Fact]
    public async Task People_who_share_no_org_cannot_find_each_other_anywhere()
    {
        var engineer = await ShelfieEngineerAsync($"Sami Shelfie {Guid.NewGuid():N}"[..20]);
        var attendee = await factory.AddMemberAsync($"Ada Attendee {Guid.NewGuid():N}"[..20], p => p.AddRole(SeededRole.Attendee, Guid.Empty, DateTime.UtcNow));
        var lead = factory.ClientFor(await factory.AddMemberAsync("Grace Okonkwo"), SeededRole.CityLead);
        var engineerName = await factory.WithDbAsync(db => Task.FromResult(db.Profiles.Single(p => p.Id == engineer.ProfileId).Name));

        Assert.Equal(HttpStatusCode.NotFound, (await factory.ClientFor(attendee).GetAsync($"/api/profiles/{engineer.ProfileId}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await factory.ClientFor(engineer).GetAsync($"/api/profiles/{attendee.ProfileId}")).StatusCode);
        Assert.DoesNotContain(engineerName, await lead.GetStringAsync($"/api/people?q={Uri.EscapeDataString(engineerName)}"));
        Assert.DoesNotContain(engineerName, await lead.GetStringAsync($"/api/search?q={Uri.EscapeDataString(engineerName)}"));
        Assert.DoesNotContain(engineerName, await lead.GetStringAsync($"/api/notes/members?q={Uri.EscapeDataString(engineerName)}"));
        Assert.DoesNotContain(engineerName, await lead.GetStringAsync("/api/workspaces/candidates"));
    }

    [Fact]
    public async Task People_who_share_an_org_see_each_other()
    {
        var a = await factory.AddMemberAsync("Ada Attendee");
        var b = await factory.AddMemberAsync("Ben Builder");

        Assert.Equal(HttpStatusCode.OK, (await factory.ClientFor(a).GetAsync($"/api/profiles/{b.ProfileId}")).StatusCode);
    }

    [Fact]
    public async Task A_cross_org_role_covering_one_of_their_orgs_or_a_system_admin_sees_the_profile()
    {
        var engineer = await ShelfieEngineerAsync("Sami Shelfie");
        var portfolio = await factory.AddMemberAsync("Pat Portfolio", joinToronto: false);
        await factory.AssignCrossOrgAsync(portfolio, SeededRole.Portfolio);
        var staff = await factory.AddMemberAsync("Zed Staffer", joinToronto: false);
        await factory.AssignCrossOrgAsync(staff, SeededRole.Staff);
        var admin = await factory.AddMemberAsync("Priya Shah", joinToronto: false);

        Assert.Equal(HttpStatusCode.OK, (await factory.ClientFor(portfolio).GetAsync($"/api/profiles/{engineer.ProfileId}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await factory.ClientFor(staff).GetAsync($"/api/profiles/{engineer.ProfileId}")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await factory.ClientFor(admin, SeededRole.SystemAdmin).GetAsync($"/api/profiles/{engineer.ProfileId}")).StatusCode);
    }

    [Fact]
    public async Task Someone_in_no_org_still_sees_their_own_profile()
    {
        var waiting = await factory.AddMemberAsync("Wren Waiting", joinToronto: false);

        var own = await factory.ClientFor(waiting).GetAsync($"/api/profiles/{waiting.ProfileId}");
        var access = await factory.ClientFor(waiting).GetFromJsonAsync<AccessResponse>("/api/me/access");

        Assert.Equal(HttpStatusCode.OK, own.StatusCode);
        Assert.Empty(access!.Orgs);
    }

    private sealed record AccessResponse(object[] Orgs);
}
