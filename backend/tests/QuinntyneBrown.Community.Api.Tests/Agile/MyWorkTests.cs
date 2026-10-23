// Traces to: L2-145
using System.Net;
using System.Net.Http.Json;
using QuinntyneBrown.Community.Api.Tests.Organizations;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Domain.Agile;

namespace QuinntyneBrown.Community.Api.Tests.Agile;

/// <summary>My work: the items assigned to the caller in every workspace they can open, labelled by org (L2-145 AC3).</summary>
public class MyWorkTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private sealed record Org(Guid Id, string Slug, string Name);

    private sealed record Item(Guid Id, string Title, string Kind, string Status, Guid WorkspaceId, string WorkspaceName, Org Organization);

    [Fact]
    public async Task Work_assigned_in_several_orgs_is_listed_together_with_each_org()
    {
        var (pat, toronto, shelfie) = await PatWithWorkInBothOrgsAsync();

        var items = (await factory.ClientFor(pat).GetFromJsonAsync<Item[]>("/api/work/mine"))!;

        Assert.Equal(
            [("Barcode scan for shelf check-in", "Shelfie app", "Shelfie"), ("Book the venue", "Toronto team", "FaithTech Toronto")],
            items.Select(i => (i.Title, i.WorkspaceName, i.Organization.Name)).OrderBy(i => i.Item1));
        Assert.Contains(items, i => i.WorkspaceId == toronto && i.Status == "InProgress" && i.Kind == "Story");
        Assert.Contains(items, i => i.WorkspaceId == shelfie);
    }

    [Fact]
    public async Task An_org_in_the_header_narrows_the_list_to_that_org()
    {
        var (pat, _, shelfie) = await PatWithWorkInBothOrgsAsync();

        var items = (await factory.ClientFor(pat, OrgClients.Shelfie.Slug).GetFromJsonAsync<Item[]>("/api/work/mine"))!;

        Assert.Equal([shelfie], items.Select(i => i.WorkspaceId));
    }

    [Fact]
    public async Task Work_assigned_to_others_or_archived_is_left_out()
    {
        var owner = await factory.AddWithRolesAsync("Grace Okonkwo", SeededRole.CityLead);
        var ruth = await factory.AddWithRolesAsync("Ruth Alvarez", SeededRole.Volunteer);
        var ws = await factory.AddWorkspaceAsync(owner, "Toronto team", WorkspaceMethod.Scrum, ruth);
        await factory.AddStoryAsync(ws, "Owner's story", assigneeId: owner.ProfileId);
        var archived = await factory.AddStoryAsync(ws, "Old story", assigneeId: ruth.ProfileId);
        await factory.WithDbAsync(async db =>
        {
            var item = db.WorkItems.Single(i => i.Id == archived);
            item.Archive([], owner.ProfileId, factory.Time.GetUtcNow());
            return await db.SaveChangesAsync();
        });

        var items = (await factory.ClientFor(ruth).GetFromJsonAsync<Item[]>("/api/work/mine"))!;

        Assert.Empty(items);
        Assert.Equal(HttpStatusCode.Unauthorized, (await factory.CreateClient().GetAsync("/api/work/mine")).StatusCode);
    }

    private async Task<(ProfileClients.Member Pat, Guid Toronto, Guid Shelfie)> PatWithWorkInBothOrgsAsync()
    {
        var pat = await factory.AddWithRolesAsync("Pat Morgan", SeededRole.Volunteer);
        await factory.WithDbAsync(async db =>
        {
            await SeededRoles.JoinAsync(db, pat.ProfileId, OrgClients.Shelfie.Id);
            return 0;
        });
        await factory.GrantStartupRoleAsync(pat, OrgClients.Shelfie, "engineer");
        var grace = await factory.AddWithRolesAsync("Grace Okonkwo", SeededRole.CityLead);
        var amara = await factory.AddMemberOfAsync(OrgClients.Shelfie, "Amara Osei");
        await factory.GrantStartupRoleAsync(amara, OrgClients.Shelfie, "engineer");
        var toronto = await factory.AddWorkspaceAsync(grace, "Toronto team", WorkspaceMethod.Scrum, pat);
        var shelfie = await factory.AddWorkspaceInAsync(OrgClients.Shelfie.Id, amara, "Shelfie app", WorkspaceMethod.Scrum, pat);
        await factory.AddStoryAsync(toronto, "Book the venue", WorkItemStatus.InProgress, assigneeId: pat.ProfileId);
        await factory.AddStoryAsync(shelfie, "Barcode scan for shelf check-in", assigneeId: pat.ProfileId);
        await factory.AddStoryAsync(shelfie, "Someone else's", assigneeId: amara.ProfileId);
        return (pat, toronto, shelfie);
    }
}
