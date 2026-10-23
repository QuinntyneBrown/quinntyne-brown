// Traces to: L2-152 AC1
using System.Net.Http.Json;
using QuinntyneBrown.Community.Api.Tests.Organizations;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Domain.Notifications;

namespace QuinntyneBrown.Community.Api.Tests.Notifications;

/// <summary>A notification raised in an org carries the org's name (L2-152 AC1).</summary>
public class NotificationOrgLabelTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private sealed record Org(Guid Id, string Slug, string Name);

    private sealed record Item(string Title, Org? Organization);

    private sealed record Page(Item[] Items);

    [Fact]
    public async Task A_notification_from_an_org_names_it_and_a_platform_one_names_none()
    {
        var pat = await factory.AddMemberAsync("Pat Morgan");
        await factory.WithDbAsync(async db =>
        {
            db.Notifications.Add(new Notification(pat.ProfileId, NotificationKind.RoleChanged, "Shelfie news", "/", factory.Time.GetUtcNow(), organizationId: OrgClients.Shelfie.Id));
            db.Notifications.Add(new Notification(pat.ProfileId, NotificationKind.RoleChanged, "Platform news", "/", factory.Time.GetUtcNow().AddMinutes(-1)));
            return await db.SaveChangesAsync();
        });

        var page = (await factory.ClientFor(pat).GetFromJsonAsync<Page>("/api/notifications"))!;

        Assert.Equal(new Item("Shelfie news", new Org(OrgClients.Shelfie.Id, OrgClients.Shelfie.Slug, "Shelfie")), page.Items[0]);
        Assert.Equal(new Item("Platform news", null), page.Items[1]);
    }
}
