// Traces to: L2-164
using System.Net;
using System.Text;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;

namespace QuinntyneBrown.Community.Api.Tests.Integrations;

/// <summary>Each source may send 60 requests a minute; over that it gets 429 with Retry-After (ICD).</summary>
public class RateLimitTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    // AC1
    [Fact]
    public async Task The_61st_request_in_a_minute_from_one_source_answers_429_with_retry_after()
    {
        var registered = await factory.RegisterAsync();
        var client = factory.CreateClient();
        var statuses = new List<HttpStatusCode>();

        for (var i = 0; i < 61; i++)
        {
            statuses.Add((await factory.DeliverAsync(registered.App.SourceId, registered.Secret, IntegrationClients.ContactRequestBody(), client: client)).StatusCode);
        }

        Assert.All(statuses.Take(60), s => Assert.Equal(HttpStatusCode.Accepted, s));
        Assert.Equal(HttpStatusCode.TooManyRequests, statuses[60]);
        var limited = await factory.DeliverAsync(registered.App.SourceId, registered.Secret, IntegrationClients.ContactRequestBody(), client: client);
        Assert.InRange(limited.Headers.RetryAfter!.Delta!.Value.TotalSeconds, 1, 60);
    }

    // AC2, AC3
    [Fact]
    public async Task The_limit_is_per_source_and_configurable()
    {
        await using var limited = factory.WithWebHostBuilder(b => b.UseSetting("RateLimits:WebhookPerMinute", "2"));
        var client = limited.CreateClient();
        var first = await factory.RegisterAsync("First site");
        var second = await factory.RegisterAsync("Second site");

        async Task<HttpStatusCode> Send((IntegrationClients.App App, string Secret) app) =>
            (await factory.DeliverRawAsync(app.App.SourceId, Encoding.UTF8.GetBytes(IntegrationClients.ContactRequestBody()), app.Secret, client: client)).StatusCode;

        var firstStatuses = new[] { await Send((first.App, first.Secret)), await Send((first.App, first.Secret)), await Send((first.App, first.Secret)) };
        var secondStatus = await Send((second.App, second.Secret));

        Assert.Equal([HttpStatusCode.Accepted, HttpStatusCode.Accepted, HttpStatusCode.TooManyRequests], firstStatuses);
        Assert.Equal(HttpStatusCode.Accepted, secondStatus);
    }
}
