// Traces to: L2-178
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Ideas;

/// <summary>Ten ideas an hour per address, or per account when signed in (L2-178, ADR 0044).</summary>
public class SubmitIdeaRateLimitTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    // AC1: the production limit is 10.
    [Fact]
    public async Task The_11th_idea_in_an_hour_from_one_address_answers_429_and_is_not_stored()
    {
        var client = factory.WithWebHostBuilder(b => b.UseSetting("RateLimits:IdeaSubmitPerHour", "10")).CreateClient();
        var before = await factory.WithDbAsync(db => db.Ideas.CountAsync());
        var statuses = new List<HttpStatusCode>();

        for (var i = 0; i < 11; i++)
        {
            statuses.Add((await client.PostAsJsonAsync(IdeaClients.SubmitPath, IdeaBodies.Visitor())).StatusCode);
        }

        Assert.All(statuses.Take(10), s => Assert.Equal(HttpStatusCode.Created, s));
        Assert.Equal(HttpStatusCode.TooManyRequests, statuses[10]);
        Assert.Equal(before + 10, await factory.WithDbAsync(db => db.Ideas.CountAsync()));
    }

    // AC3: the setting replaces 10.
    [Fact]
    public async Task The_limit_is_configurable()
    {
        var client = factory.WithWebHostBuilder(b => b.UseSetting("RateLimits:IdeaSubmitPerHour", "1")).CreateClient();

        var first = await client.PostAsJsonAsync(IdeaClients.SubmitPath, IdeaBodies.Visitor());
        var second = await client.PostAsJsonAsync(IdeaClients.SubmitPath, IdeaBodies.Visitor());

        Assert.Equal((HttpStatusCode.Created, HttpStatusCode.TooManyRequests), (first.StatusCode, second.StatusCode));
    }
}
