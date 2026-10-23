using System.Net;
using Microsoft.AspNetCore.Hosting;

namespace QuinntyneBrown.Community.Api.Tests.Platform;

/// <summary>The apex domain sends every request to the marketing page (L2-133).</summary>
public class ApexRedirectTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private const string ApexHost = "faithtech.test";

    // Traces to: L2-133 AC1.
    [Theory]
    [InlineData("/", "https://www.faithtech.test/")]
    [InlineData("/events/42?rsvp=1", "https://www.faithtech.test/events/42?rsvp=1")]
    [InlineData("/api/me", "https://www.faithtech.test/api/me")]
    public async Task A_request_on_the_apex_host_is_redirected_permanently_to_the_marketing_origin(string path, string expected)
    {
        using var client = ApexClient();

        var response = await client.GetAsync(path);

        Assert.Equal(HttpStatusCode.MovedPermanently, response.StatusCode);
        Assert.Equal(expected, response.Headers.Location?.ToString());
    }

    // Traces to: L2-133 AC2.
    [Fact]
    public async Task Another_host_is_not_redirected()
    {
        using var client = ApexClient();
        client.DefaultRequestHeaders.Host = new Uri(CommunityApiFactory.WebAppOrigin).Authority;

        var response = await client.GetAsync("/health/live");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    // Traces to: L2-133 AC3.
    [Fact]
    public async Task Without_an_apex_host_nothing_is_redirected()
    {
        var client = factory.CreateClient(new() { AllowAutoRedirect = false });
        client.DefaultRequestHeaders.Host = ApexHost;

        var response = await client.GetAsync("/health/live");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    private HttpClient ApexClient()
    {
        var client = factory.WithWebHostBuilder(b => b.UseSetting("Marketing:ApexHost", ApexHost))
            .CreateClient(new() { AllowAutoRedirect = false });
        client.DefaultRequestHeaders.Host = ApexHost;
        return client;
    }
}
