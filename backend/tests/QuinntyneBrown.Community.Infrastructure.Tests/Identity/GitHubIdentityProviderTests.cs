// Traces to: L2-130 AC1, AC2, AC4, AC6, AC7
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using QuinntyneBrown.Community.Infrastructure.Identity;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

namespace QuinntyneBrown.Community.Infrastructure.Tests.Identity;

public class GitHubIdentityProviderTests
{
    private const string ClientId = "github-client-id";
    private const string ClientSecret = "github-client-secret";
    private const string RedirectUri = "https://app.test/api/account/github/callback";
    private const string Verifier = "verifier-kept-in-the-correlation-cookie-0123456789";

    private readonly FakeGitHub _github = new();

    [Fact]
    public void The_authorization_url_asks_for_the_profile_and_emails_with_an_S256_challenge()
    {
        var url = new Uri(Provider().BuildAuthorizationUrl("the-state", Verifier, RedirectUri)!);

        Assert.Equal("https://github.com/login/oauth/authorize", url.GetLeftPart(UriPartial.Path));
        var query = HttpUtility.ParseQueryString(url.Query);
        Assert.Equal(ClientId, query["client_id"]);
        Assert.Equal(RedirectUri, query["redirect_uri"]);
        Assert.Equal("read:user user:email", query["scope"]);
        Assert.Equal("the-state", query["state"]);
        Assert.Equal(Challenge(Verifier), query["code_challenge"]);
        Assert.Equal("S256", query["code_challenge_method"]);
        Assert.DoesNotContain(ClientSecret, url.ToString());
    }

    [Theory]
    [InlineData("", ClientSecret)]
    [InlineData(ClientId, "")]
    public async Task Without_a_client_id_or_secret_GitHub_sign_in_is_off(string clientId, string clientSecret)
    {
        var provider = Provider(clientId, clientSecret);

        Assert.Null(provider.BuildAuthorizationUrl("state", Verifier, RedirectUri));
        Assert.Null(await provider.ExchangeCodeAsync("code", RedirectUri, Verifier));
        Assert.Empty(_github.Requests);
    }

    [Fact]
    public async Task A_code_is_exchanged_with_the_secret_and_verifier_and_the_person_read_from_the_API()
    {
        var identity = await Provider().ExchangeCodeAsync("the-code", RedirectUri, Verifier);

        Assert.Equal(new("583231", "leah@example.test", true, "Leah Thompson"), identity);
        var token = _github.Requests[0];
        Assert.Equal((HttpMethod.Post, "https://github.com/login/oauth/access_token"), (token.Method, token.Url));
        Assert.Equal("application/json", token.Accept);
        var form = HttpUtility.ParseQueryString(token.Body);
        Assert.Equal((ClientId, ClientSecret, "the-code", RedirectUri, Verifier),
            (form["client_id"], form["client_secret"], form["code"], form["redirect_uri"], form["code_verifier"]));
        Assert.Equal(["https://api.github.com/user", "https://api.github.com/user/emails"], _github.Requests.Skip(1).Select(r => r.Url));
        Assert.All(_github.Requests.Skip(1), r =>
        {
            Assert.Equal("Bearer gho_access", r.Authorization);
            Assert.False(string.IsNullOrEmpty(r.UserAgent));
        });
    }

    [Fact]
    public async Task A_GitHub_account_with_no_name_is_named_by_its_login()
    {
        _github.User = """{ "id": 583231, "login": "leah-builds", "name": null }""";

        var identity = await Provider().ExchangeCodeAsync("the-code", RedirectUri, Verifier);

        Assert.Equal("leah-builds", identity!.Name);
    }

    [Fact]
    public async Task The_primary_email_is_used_and_its_verified_flag_reported()
    {
        _github.Emails = """
            [
              { "email": "old@example.test", "primary": false, "verified": true },
              { "email": "leah@example.test", "primary": true, "verified": false }
            ]
            """;

        var identity = await Provider().ExchangeCodeAsync("the-code", RedirectUri, Verifier);

        Assert.Equal(("leah@example.test", false), (identity!.Email, identity.EmailVerified));
    }

    [Theory]
    [InlineData("token-error")]
    [InlineData("token-status")]
    [InlineData("user-status")]
    [InlineData("emails-status")]
    [InlineData("no-primary")]
    [InlineData("bad-json")]
    [InlineData("unreachable")]
    public async Task Anything_GitHub_does_not_confirm_gives_no_identity(string broken)
    {
        switch (broken)
        {
            case "token-error": _github.Token = """{ "error": "bad_verification_code" }"""; break;
            case "token-status": _github.TokenStatus = HttpStatusCode.BadRequest; break;
            case "user-status": _github.UserStatus = HttpStatusCode.Unauthorized; break;
            case "emails-status": _github.EmailsStatus = HttpStatusCode.Forbidden; break;
            case "no-primary": _github.Emails = """[{ "email": "leah@example.test", "primary": false, "verified": true }]"""; break;
            case "bad-json": _github.User = "not json"; break;
            case "unreachable": _github.Unreachable = true; break;
        }

        Assert.Null(await Provider().ExchangeCodeAsync("the-code", RedirectUri, Verifier));
    }

    private GitHubIdentityProvider Provider(string clientId = ClientId, string clientSecret = ClientSecret) =>
        new(new HttpClient(_github),
            Options.Create(new GitHubOptions { ClientId = clientId, ClientSecret = clientSecret }),
            NullLogger<GitHubIdentityProvider>.Instance);

    private static string Challenge(string verifier) =>
        Convert.ToBase64String(SHA256.HashData(Encoding.ASCII.GetBytes(verifier))).TrimEnd('=').Replace('+', '-').Replace('/', '_');

    private sealed record Request(HttpMethod Method, string Url, string? Accept, string? Authorization, string? UserAgent, string Body);

    /// <summary>Plays GitHub's token endpoint and REST API.</summary>
    private sealed class FakeGitHub : HttpMessageHandler
    {
        public List<Request> Requests { get; } = [];

        public string Token { get; set; } = """{ "access_token": "gho_access", "token_type": "bearer", "scope": "read:user,user:email" }""";

        public HttpStatusCode TokenStatus { get; set; } = HttpStatusCode.OK;

        public string User { get; set; } = """{ "id": 583231, "login": "leah-t", "name": "Leah Thompson" }""";

        public HttpStatusCode UserStatus { get; set; } = HttpStatusCode.OK;

        public string Emails { get; set; } = """
            [
              { "email": "leah@users.noreply.github.com", "primary": false, "verified": true },
              { "email": "leah@example.test", "primary": true, "verified": true }
            ]
            """;

        public HttpStatusCode EmailsStatus { get; set; } = HttpStatusCode.OK;

        public bool Unreachable { get; set; }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            if (Unreachable)
            {
                throw new HttpRequestException("GitHub is unreachable");
            }

            var url = request.RequestUri!.GetLeftPart(UriPartial.Path);
            Requests.Add(new(
                request.Method,
                url,
                request.Headers.Accept.FirstOrDefault()?.MediaType,
                request.Headers.Authorization?.ToString(),
                request.Headers.UserAgent.ToString(),
                request.Content is null ? string.Empty : await request.Content.ReadAsStringAsync(cancellationToken)));
            var (status, body) = url switch
            {
                "https://github.com/login/oauth/access_token" => (TokenStatus, Token),
                "https://api.github.com/user" => (UserStatus, User),
                "https://api.github.com/user/emails" => (EmailsStatus, Emails),
                _ => (HttpStatusCode.NotFound, "{}"),
            };
            return new HttpResponseMessage(status) { Content = new StringContent(body, Encoding.UTF8, "application/json") };
        }
    }
}
