using System.Net;
using System.Net.Http.Json;
using System.Text.RegularExpressions;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Domain.Profiles;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace QuinntyneBrown.Community.Api.Tests.Platform;

public partial class ServerAuthorizationTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    // Endpoints the design marks anonymous (L2-042 AC1), plus the health probes (L2-047), the invite link (L2-011) and
    // public events with guest RSVP (L2-023) and the connect link lookup and sign-up.
    private static readonly string[] AnonymousRoutes =
    [
        "health/live",
        "health/ready",
        "api/account/sign-up",
        "api/account/verify-email",
        "api/account/resend-verification",
        "api/account/forgot-password",
        "api/account/reset-password",
        "connect/authorize",
        "connect/token",
        "connect/logout",
        "connect/revoke",
        "api/account/sign-in",
        "api/invites/lookup",
        "api/invites/accept",
        "api/connect/lookup",
        "api/connect/sign-up",
        "api/public/events/{id:guid}",
        "api/public/events/{id:guid}/rsvps",
        "api/public/events/{id:guid}/rsvps/cancel",
        "api/public/events/{id:guid}/calendar.ics",
        "api/announcements/unsubscribe",
    ];

    [Fact]
    public async Task Every_endpoint_returns_401_without_authentication_unless_marked_anonymous()
    {
        // One request per endpoint from one address: more endpoints than the global limit of 100 a minute.
        var client = factory.WithWebHostBuilder(b => b.UseSetting("RateLimits:PerMinute", "100000")).CreateClient();
        var endpoints = factory.Services.GetRequiredService<EndpointDataSource>().Endpoints.OfType<RouteEndpoint>()
            .SelectMany(e => (e.Metadata.GetMetadata<HttpMethodMetadata>()?.HttpMethods ?? ["GET"])
                .Select(method => (method, route: e.RoutePattern.RawText!.TrimStart('/'))))
            .ToList();
        Assert.Contains(endpoints, e => e.route == "api/me");

        foreach (var (method, route) in endpoints)
        {
            var path = "/" + RouteParameter().Replace(route, Guid.NewGuid().ToString());
            var response = await client.SendAsync(new HttpRequestMessage(new HttpMethod(method), path));

            if (AnonymousRoutes.Contains(route))
            {
                Assert.True(response.StatusCode != HttpStatusCode.Unauthorized, $"{method} {route} should be anonymous");
            }
            else
            {
                Assert.True(response.StatusCode == HttpStatusCode.Unauthorized, $"{method} {route} returned {response.StatusCode}");
            }
        }
    }

    [Fact]
    // Traces to: L2-135, L2-155
    public async Task Me_returns_the_signed_in_user_and_access_gives_their_permissions_from_their_roles()
    {
        // The permissions come from the roles the member really holds, resolved on this request.
        var member = await factory.AddMemberAsync("Grace Okonkwo");
        var client = factory.ClientFor(member, SeededRole.CityLead, SeededRole.Staff);

        var me = await client.GetFromJsonAsync<MeResponse>("/api/me");
        var access = await client.GetFromJsonAsync<AccessResponse>("/api/me/access");

        Assert.Equal((member.UserId, false), (me!.Id, me.IsSystemAdmin));
        var toronto = access!.Orgs.Single(o => o.Slug == "faithtech-toronto");
        Assert.True(toronto.IsMember);
        Assert.Contains("workspaces.create", toronto.Permissions);
        Assert.Contains("reports.view", toronto.Permissions);
        Assert.DoesNotContain("announcements.send", toronto.Permissions);
    }

    private sealed record MeResponse(Guid Id, bool IsSystemAdmin);

    private sealed record AccessOrg(string Slug, bool IsMember, string[] Permissions);

    private sealed record AccessResponse(AccessOrg[] Orgs);

    [GeneratedRegex(@"\{[^}]+\}")]
    private static partial Regex RouteParameter();
}
