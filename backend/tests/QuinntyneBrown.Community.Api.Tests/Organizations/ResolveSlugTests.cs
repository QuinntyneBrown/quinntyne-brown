// Traces to: L2-145
using System.Net;
using System.Net.Http.Json;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Domain.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Organizations;

/// <summary>An old link keeps working after a slug change, without revealing orgs the caller does not cover (ADR 0037).</summary>
public class ResolveSlugTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private sealed record Resolved(string Slug);

    [Fact]
    public async Task An_old_slug_resolves_to_the_orgs_current_one()
    {
        var org = await factory.AddOrgAsync("FaithTech Ottawa");
        var member = await factory.AddMemberOfAsync(org, "Odette Ottawa");
        var renamed = $"ottawa-{Guid.NewGuid().ToString("N")[..6]}";
        await factory.WithDbAsync(async db =>
        {
            var entity = await db.Organizations.SingleAsync(o => o.Id == org.Id);
            db.OrgSlugAliases.Add(new OrgSlugAlias(entity.ChangeSlug(renamed), entity.Id));
            return await db.SaveChangesAsync();
        });
        var client = factory.ClientFor(member);

        Assert.Equal(renamed, (await client.GetFromJsonAsync<Resolved>($"/api/orgs/resolve/{org.Slug}"))!.Slug);
        Assert.Equal(renamed, (await client.GetFromJsonAsync<Resolved>($"/api/orgs/resolve/{renamed}"))!.Slug);
    }

    [Fact]
    public async Task An_unknown_slug_or_one_the_caller_does_not_cover_is_not_found()
    {
        var grace = await factory.AddMemberAsync("Grace Okonkwo");
        var client = factory.ClientFor(grace);

        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync("/api/orgs/resolve/nowhere")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync($"/api/orgs/resolve/{OrgClients.Shelfie.Slug}")).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await factory.CreateClient().GetAsync("/api/orgs/resolve/nowhere")).StatusCode);
    }
}
