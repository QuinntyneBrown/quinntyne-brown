// Traces to: L2-130, L2-079, L2-131
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Web;
using QuinntyneBrown.Community.Api.Tests.Fakes;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Application.Identity;
using QuinntyneBrown.Community.Domain.Notifications;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using static QuinntyneBrown.Community.Api.Tests.Contacts.ContactClients;

namespace QuinntyneBrown.Community.Api.Tests.Identity;

public class GitHubSignInTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private const string Failed = $"{CommunityApiFactory.MarketingOrigin}/?github=failed";
    private const string Suspended = $"{CommunityApiFactory.MarketingOrigin}/?github=suspended";

    private readonly OidcFlow _flow = new(factory);

    [Fact]
    public async Task Start_sends_the_browser_to_GitHub_with_a_state_and_PKCE_challenge_kept_in_a_protected_cookie()
    {
        var response = await _flow.Browser.GetAsync("/api/account/github/start?returnUrl=%2Fevents&keepSignedIn=true");

        Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
        var location = response.Headers.Location!;
        Assert.StartsWith(FakeGitHubIdentityProvider.AuthorizationEndpoint, location.ToString());
        var (state, challenge) = FakeGitHubIdentityProvider.ReadAuthorizationUrl(location);
        Assert.True(state.Length >= 32 && challenge.Length >= 43 && state != challenge);
        Assert.Equal($"{CommunityApiFactory.WebAppOrigin}/api/account/github/callback", HttpUtility.ParseQueryString(location.Query)["redirect_uri"]);
        var cookie = Assert.Single(response.Headers.GetValues("Set-Cookie"), c => c.StartsWith("ftc.github="));
        Assert.Contains("path=/api/account/github", cookie, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("httponly", cookie, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("secure", cookie, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("samesite=lax", cookie, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain(state, cookie);
    }

    [Fact]
    public async Task A_new_GitHub_account_creates_an_account_with_no_role_a_verified_email_and_no_password()
    {
        var email = NewEmail();

        var landing = await SignInWithGitHubAsync(Identity(email, name: "Leah Thompson"), "/events", keepSignedIn: true);

        Assert.Equal($"{CommunityApiFactory.WebAppOrigin}/auth/continue?returnUrl=%2Fevents&keepSignedIn=1", landing);
        var me = await MeAfterPkceAsync();
        Assert.Equal(email, me.GetProperty("email").GetString());
        Assert.Equal("Leah Thompson", me.GetProperty("name").GetString());
        Assert.True(me.GetProperty("emailVerified").GetBoolean());
        Assert.Empty(me.GetProperty("roles").EnumerateArray());
        var user = await factory.WithDbAsync(db => db.Users.SingleAsync(u => u.Email == email));
        Assert.Null(user.PasswordHash);
        Assert.True(await factory.WithDbAsync(db => db.UserLogins.AnyAsync(l => l.UserId == user.Id && l.LoginProvider == "GitHub")));
    }

    [Fact]
    public async Task A_GitHub_account_with_no_name_is_named_by_its_login()
    {
        await SignInWithGitHubAsync(Identity(NewEmail(), name: "leah-builds"));

        var me = await MeAfterPkceAsync();
        Assert.Equal("leah-builds", me.GetProperty("name").GetString());
    }

    [Fact]
    public async Task A_verified_matching_email_signs_into_the_existing_account_and_links_GitHub_to_it()
    {
        var email = await _flow.CreateAccountAsync();
        var github = Identity(email);

        await SignInWithGitHubAsync(github);
        var first = await MeAfterPkceAsync();
        // GitHub keeps the same user id when the person changes their primary email.
        await SignInWithGitHubAsync(github with { Email = NewEmail() });
        var second = await MeAfterPkceAsync();

        Assert.Equal(email, first.GetProperty("email").GetString());
        Assert.Equal(first.GetProperty("id").GetString(), second.GetProperty("id").GetString());
        Assert.Equal(1, await factory.WithDbAsync(db => db.Users.CountAsync(u => u.Email == email)));
    }

    [Fact]
    public async Task An_account_already_linked_to_Google_can_also_link_GitHub()
    {
        var email = await _flow.CreateAccountAsync();
        var user = await factory.WithDbAsync(db => db.Users.SingleAsync(u => u.Email == email));
        await factory.WithDbAsync(async db =>
        {
            db.UserLogins.Add(new() { LoginProvider = "Google", ProviderKey = Guid.NewGuid().ToString("N"), ProviderDisplayName = "Google", UserId = user.Id });
            return await db.SaveChangesAsync();
        });

        await SignInWithGitHubAsync(Identity(email));

        var me = await MeAfterPkceAsync();
        Assert.Equal(user.Id.ToString(), me.GetProperty("id").GetString());
        var providers = await factory.WithDbAsync(db => db.UserLogins.Where(l => l.UserId == user.Id).Select(l => l.LoginProvider).OrderBy(p => p).ToListAsync());
        Assert.Equal(["GitHub", "Google"], providers);
    }

    [Fact]
    public async Task Linking_an_unverified_account_verifies_it_and_removes_the_unproven_password()
    {
        var email = await _flow.CreateAccountAsync(verified: false);

        await SignInWithGitHubAsync(Identity(email));

        var user = await factory.WithDbAsync(db => db.Users.SingleAsync(u => u.Email == email));
        Assert.True(user.EmailConfirmed);
        Assert.Null(user.PasswordHash);
        var withOldPassword = await new OidcFlow(factory).SignInAsync(email);
        Assert.Equal(HttpStatusCode.BadRequest, withOldPassword.StatusCode);
    }

    [Fact]
    public async Task An_unverified_primary_email_is_refused_and_nothing_is_created_or_linked()
    {
        var newEmail = NewEmail();
        var existing = await _flow.CreateAccountAsync();

        var refusedNew = await SignInWithGitHubAsync(Identity(newEmail, verified: false));
        var refusedExisting = await SignInWithGitHubAsync(Identity(existing, verified: false));

        Assert.Equal(Failed, refusedNew);
        Assert.Equal(Failed, refusedExisting);
        Assert.False(await factory.WithDbAsync(db => db.Users.AnyAsync(u => u.Email == newEmail)));
        var user = await factory.WithDbAsync(db => db.Users.SingleAsync(u => u.Email == existing));
        Assert.False(await factory.WithDbAsync(db => db.UserLogins.AnyAsync(l => l.UserId == user.Id)));
        await AssertNoSessionAsync();
    }

    [Fact]
    public async Task A_suspended_account_is_refused_with_the_same_outcome_as_password_sign_in()
    {
        var email = await _flow.CreateAccountAsync();
        await factory.WithDbAsync(async db =>
        {
            var profileId = await db.Users.Where(u => u.Email == email).Select(u => u.ProfileId).SingleAsync();
            (await db.Profiles.SingleAsync(p => p.Id == profileId)).Suspend("Misuse", DateTime.UtcNow);
            return await db.SaveChangesAsync();
        });

        var landing = await SignInWithGitHubAsync(Identity(email));

        Assert.Equal(Suspended, landing);
        await AssertNoSessionAsync();
    }

    [Fact]
    public async Task A_callback_whose_state_does_not_match_is_refused()
    {
        var (_, challenge) = await StartAsync();
        var code = factory.GitHub.IssueCode(Identity(NewEmail()), challenge);

        var response = await _flow.Browser.GetAsync($"/api/account/github/callback?code={code}&state=forged");

        Assert.Equal(Failed, response.Headers.Location!.ToString());
        await AssertNoSessionAsync();
    }

    [Fact]
    public async Task A_replayed_callback_is_refused()
    {
        var (state, challenge) = await StartAsync();
        var callback = $"/api/account/github/callback?code={factory.GitHub.IssueCode(Identity(NewEmail()), challenge)}&state={Uri.EscapeDataString(state)}";
        await _flow.Browser.GetAsync(callback);
        var attacker = new OidcFlow(factory);

        var replay = await attacker.Browser.GetAsync(callback);

        Assert.Equal(Failed, replay.Headers.Location!.ToString());
        var authorize = await attacker.Browser.GetAsync(OidcFlow.AuthorizeUrl("challenge"));
        Assert.StartsWith($"{CommunityApiFactory.WebAppOrigin}/sign-in", authorize.Headers.Location!.ToString());
    }

    [Fact]
    public async Task A_code_issued_for_another_sign_ins_PKCE_challenge_is_refused()
    {
        var (state, _) = await StartAsync();
        // GitHub issued this code to another browser's sign-in, so this sign-in's verifier does not redeem it.
        var code = factory.GitHub.IssueCode(Identity(NewEmail()), "another-challenge");

        var response = await _flow.Browser.GetAsync($"/api/account/github/callback?code={code}&state={Uri.EscapeDataString(state)}");

        Assert.Equal(Failed, response.Headers.Location!.ToString());
        await AssertNoSessionAsync();
    }

    [Fact]
    public async Task A_Google_correlation_cookie_does_not_complete_a_GitHub_callback()
    {
        var google = await _flow.Browser.GetAsync("/api/account/google/start");
        var (state, _) = FakeGoogleIdentityProvider.ReadAuthorizationUrl(google.Headers.Location!);
        var code = factory.GitHub.IssueCode(Identity(NewEmail()), "any");

        var response = await _flow.Browser.GetAsync($"/api/account/github/callback?code={code}&state={Uri.EscapeDataString(state)}");

        Assert.Equal(Failed, response.Headers.Location!.ToString());
    }

    [Fact]
    public async Task GitHub_refusing_authorization_returns_the_visitor_to_the_marketing_page()
    {
        var (state, _) = await StartAsync();

        var response = await _flow.Browser.GetAsync($"/api/account/github/callback?error=access_denied&state={Uri.EscapeDataString(state)}");

        Assert.Equal(Failed, response.Headers.Location!.ToString());
    }

    [Fact]
    public async Task Without_GitHub_configuration_the_button_returns_the_visitor_with_the_failure()
    {
        var unconfigured = new FakeGitHubIdentityProvider { Configured = false };
        var client = factory.WithWebHostBuilder(b => b.ConfigureTestServices(s => s.AddSingleton<IGitHubIdentityProvider>(unconfigured)))
            .CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false, BaseAddress = new Uri("https://localhost") });

        var response = await client.GetAsync("/api/account/github/start");

        Assert.Equal(Failed, response.Headers.Location!.ToString());
    }

    [Fact]
    public async Task A_failure_started_on_the_community_app_returns_to_its_sign_in_page_with_the_return_url()
    {
        var landing = await SignInWithGitHubAsync(Identity(NewEmail(), verified: false), "/events", from: "app");

        Assert.Equal($"{CommunityApiFactory.WebAppOrigin}/sign-in?github=failed&returnUrl=%2Fevents", landing);
    }

    [Fact]
    public async Task A_suspended_account_started_on_the_community_app_returns_to_its_sign_in_page()
    {
        var email = await _flow.CreateAccountAsync();
        await factory.WithDbAsync(async db =>
        {
            var profileId = await db.Users.Where(u => u.Email == email).Select(u => u.ProfileId).SingleAsync();
            (await db.Profiles.SingleAsync(p => p.Id == profileId)).Suspend("Misuse", DateTime.UtcNow);
            return await db.SaveChangesAsync();
        });

        var landing = await SignInWithGitHubAsync(Identity(email), from: "app");

        Assert.Equal($"{CommunityApiFactory.WebAppOrigin}/sign-in?github=suspended&returnUrl=%2F", landing);
    }

    [Fact]
    public async Task Without_configuration_the_community_app_button_returns_to_its_sign_in_page()
    {
        var unconfigured = new FakeGitHubIdentityProvider { Configured = false };
        var client = factory.WithWebHostBuilder(b => b.ConfigureTestServices(s => s.AddSingleton<IGitHubIdentityProvider>(unconfigured)))
            .CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false, BaseAddress = new Uri("https://localhost") });

        var response = await client.GetAsync("/api/account/github/start?from=app&returnUrl=%2Fteam");

        Assert.Equal($"{CommunityApiFactory.WebAppOrigin}/sign-in?github=failed&returnUrl=%2Fteam", response.Headers.Location!.ToString());
    }

    [Fact]
    public async Task An_interrupted_authorization_request_resumes_after_signing_in_from_the_community_app()
    {
        var authorize = OidcFlow.AuthorizeUrl("challenge");

        var landing = await SignInWithGitHubAsync(Identity(NewEmail()), authorize, from: "app");

        Assert.Equal(new Uri($"{CommunityApiFactory.WebAppOrigin}{authorize}"), new Uri(landing));
        var resumed = await _flow.Browser.GetAsync(authorize);
        Assert.DoesNotContain("/sign-in", resumed.Headers.Location!.ToString());
    }

    [Fact]
    public async Task A_return_url_outside_the_community_app_lands_on_home()
    {
        var landing = await SignInWithGitHubAsync(Identity(NewEmail()), "https://evil.example/steal");

        Assert.Equal($"{CommunityApiFactory.WebAppOrigin}/auth/continue?returnUrl=%2F&keepSignedIn=0", landing);
    }

    [Fact]
    public async Task A_new_GitHub_account_matches_private_contacts_with_that_email()
    {
        var grace = await factory.AddMemberAsync("Grace Okonkwo");
        var email = NewEmail();
        await factory.CreateContactAsync(grace, "Tomás Ortega", email);

        await SignInWithGitHubAsync(Identity(email, name: "Tomás Ortega"));

        Assert.True(await factory.WithDbAsync(db => db.Notifications.AnyAsync(n => n.RecipientId == grace.ProfileId && n.Kind == NotificationKind.ContactSignedUp)));
    }

    [Fact]
    public async Task The_21st_GitHub_request_in_a_minute_from_one_address_returns_429()
    {
        var client = factory.WithWebHostBuilder(b => b.UseSetting("RateLimits:AuthPerMinute", "20"))
            .CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false, BaseAddress = new Uri("https://localhost") });

        for (var i = 0; i < 20; i++)
        {
            Assert.Equal(HttpStatusCode.Redirect, (await client.GetAsync("/api/account/github/start")).StatusCode);
        }

        Assert.Equal(HttpStatusCode.TooManyRequests, (await client.GetAsync("/api/account/github/callback?code=x&state=y")).StatusCode);
    }

    private static string NewEmail() => $"{Guid.NewGuid():N}@github.example";

    private static GitHubIdentity Identity(string email, bool verified = true, string? name = "GitHub Person") =>
        new(Random.Shared.NextInt64(1, long.MaxValue).ToString(), email, verified, name);

    private async Task<(string State, string CodeChallenge)> StartAsync(string? returnUrl = null, bool keepSignedIn = false, string? from = null)
    {
        var query = $"keepSignedIn={(keepSignedIn ? "true" : "false")}" + (returnUrl is null ? string.Empty : $"&returnUrl={Uri.EscapeDataString(returnUrl)}")
            + (from is null ? string.Empty : $"&from={from}");
        var response = await _flow.Browser.GetAsync($"/api/account/github/start?{query}");
        Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
        return FakeGitHubIdentityProvider.ReadAuthorizationUrl(response.Headers.Location!);
    }

    /// <summary>Start, authorize at "GitHub" and return to the callback; answers where the browser is sent.</summary>
    private async Task<string> SignInWithGitHubAsync(GitHubIdentity identity, string? returnUrl = null, bool keepSignedIn = false, string? from = null)
    {
        var (state, challenge) = await StartAsync(returnUrl, keepSignedIn, from);
        var code = factory.GitHub.IssueCode(identity, challenge);
        var response = await _flow.Browser.GetAsync($"/api/account/github/callback?code={code}&state={Uri.EscapeDataString(state)}");
        Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
        return response.Headers.Location!.ToString();
    }

    /// <summary>What the community app's /auth/continue does next: authorization code + PKCE, then /api/me.</summary>
    private async Task<JsonElement> MeAfterPkceAsync()
    {
        var verifier = OidcFlow.NewCodeVerifier();
        var tokens = await (await _flow.ExchangeCodeAsync(await _flow.AuthorizeAsync(verifier), verifier)).Content.ReadFromJsonAsync<TokenResponse>();
        return await _flow.Api(tokens!.AccessToken).GetFromJsonAsync<JsonElement>("/api/me");
    }

    private async Task AssertNoSessionAsync()
    {
        var authorize = await _flow.Browser.GetAsync(OidcFlow.AuthorizeUrl("challenge"));
        Assert.StartsWith($"{CommunityApiFactory.WebAppOrigin}/sign-in", authorize.Headers.Location!.ToString());
    }
}
