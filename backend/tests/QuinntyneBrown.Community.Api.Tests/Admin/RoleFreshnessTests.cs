// Traces to: L2-009, L2-042
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using QuinntyneBrown.Community.Api.Tests.Identity;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Domain.Profiles;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Admin;

/// <summary>
/// Real tokens from the code + PKCE flow: the server authorizes with the caller's current roles, not the
/// roles copied into the token when it was issued.
/// </summary>
public class RoleFreshnessTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private readonly OidcFlow _flow = new(factory);

    [Fact]
    public async Task A_removed_City_Lead_role_stops_working_on_the_token_issued_before_the_removal()
    {
        var (email, profileId) = await AccountWithRolesAsync(SeededRole.CityLead);
        var api = _flow.Api((await _flow.SignInAndGetTokensAsync(email)).AccessToken);
        Assert.Equal(HttpStatusCode.OK, (await api.GetAsync("/api/invites")).StatusCode);

        var removed = await (await AdminClientAsync()).DeleteAsync($"/api/profiles/{profileId}/roles/city-lead?organizationId={Infrastructure.Persistence.HierarchySeed.TorontoId}");
        Assert.Equal(HttpStatusCode.OK, removed.StatusCode);

        Assert.Equal(HttpStatusCode.Forbidden, (await api.GetAsync("/api/invites")).StatusCode);
        var invite = await api.PostAsJsonAsync("/api/invites", new { Email = $"{Guid.NewGuid():N}@example.org" });
        Assert.Equal(HttpStatusCode.Forbidden, invite.StatusCode);
    }

    [Fact]
    public async Task A_removed_System_Admin_is_refused_with_the_old_token_and_after_refreshing_it()
    {
        var (email, profileId) = await AccountWithRolesAsync(SeededRole.SystemAdmin);
        var tokens = await _flow.SignInAndGetTokensAsync(email);
        var api = _flow.Api(tokens.AccessToken);
        Assert.Equal(HttpStatusCode.OK, (await api.GetAsync("/api/admin/users")).StatusCode);

        var removed = await (await AdminClientAsync()).DeleteAsync($"/api/profiles/{profileId}/roles/system-admin");
        Assert.Equal(HttpStatusCode.OK, removed.StatusCode);

        Assert.Equal(HttpStatusCode.Forbidden, (await api.GetAsync("/api/admin/users")).StatusCode);
        var refreshed = await _flow.RefreshAsync(tokens.RefreshToken);
        refreshed.EnsureSuccessStatusCode();
        var renewed = _flow.Api((await refreshed.Content.ReadFromJsonAsync<TokenResponse>())!.AccessToken);
        Assert.Equal(HttpStatusCode.Forbidden, (await renewed.GetAsync("/api/admin/users")).StatusCode);
        Assert.False((await renewed.GetFromJsonAsync<JsonElement>("/api/me")).GetProperty("isSystemAdmin").GetBoolean());
    }

    [Fact]
    public async Task An_added_role_is_shown_and_honoured_once_the_session_is_refreshed()
    {
        var (email, profileId) = await AccountWithRolesAsync();
        var tokens = await _flow.SignInAndGetTokensAsync(email);

        var added = await (await AdminClientAsync()).PostAsJsonAsync(
            $"/api/profiles/{profileId}/roles", new { Role = "city-lead", OrganizationId = Infrastructure.Persistence.HierarchySeed.TorontoId });
        Assert.Equal(HttpStatusCode.OK, added.StatusCode);

        var refreshed = await _flow.RefreshAsync(tokens.RefreshToken);
        refreshed.EnsureSuccessStatusCode();
        var api = _flow.Api((await refreshed.Content.ReadFromJsonAsync<TokenResponse>())!.AccessToken);
        var org = (await api.GetFromJsonAsync<JsonElement>("/api/me/access")).GetProperty("orgs").EnumerateArray().Single();
        Assert.Contains("invites.send", org.GetProperty("permissions").EnumerateArray().Select(p => p.GetString()));
        Assert.Equal(HttpStatusCode.OK, (await api.GetAsync("/api/invites")).StatusCode);
    }

    private async Task<(string Email, Guid ProfileId)> AccountWithRolesAsync(params SeededRole[] roles)
    {
        var email = await _flow.CreateAccountAsync();
        var profileId = await factory.WithDbAsync(async db =>
        {
            var id = await db.Users.Where(u => u.Email == email).Select(u => u.ProfileId).SingleAsync();
            await SeededRoles.JoinAsync(db, id);
            foreach (var role in roles)
            {
                await SeededRoles.GrantAsync(db, id, role);
            }

            return id;
        });
        return (email, profileId);
    }

    private async Task<HttpClient> AdminClientAsync()
    {
        var admin = await factory.AddMemberAsync("Priya Raman", p => p.AddRole(SeededRole.SystemAdmin, Guid.Empty, DateTime.UtcNow));
        return factory.ClientFor(admin, SeededRole.SystemAdmin);
    }
}
