using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using QuinntyneBrown.Community.Application.Identity;

namespace QuinntyneBrown.Community.Api.Tests.Fakes;

/// <summary>
/// Plays GitHub: it builds an authorization URL that carries the state and the S256 code challenge, and exchanges
/// a code it issued for the identity it was issued with, once, and only with the verifier behind that challenge.
/// </summary>
public class FakeGitHubIdentityProvider : IGitHubIdentityProvider
{
    public const string AuthorizationEndpoint = "https://github.test/login/oauth/authorize";

    private readonly ConcurrentDictionary<string, (GitHubIdentity Identity, string Challenge)> _codes = new();

    /// <summary>False plays an API with no GitHub:ClientId or GitHub:ClientSecret.</summary>
    public bool Configured { get; set; } = true;

    public string? BuildAuthorizationUrl(string state, string codeVerifier, string redirectUri) => Configured
        ? $"{AuthorizationEndpoint}?state={Uri.EscapeDataString(state)}&code_challenge={Uri.EscapeDataString(Challenge(codeVerifier))}"
          + $"&code_challenge_method=S256&redirect_uri={Uri.EscapeDataString(redirectUri)}"
        : null;

    /// <summary>What GitHub hands back after the person authorizes: a code for this identity, bound to the challenge it was sent.</summary>
    public string IssueCode(GitHubIdentity identity, string codeChallenge)
    {
        var code = Guid.NewGuid().ToString("N");
        _codes[code] = (identity, codeChallenge);
        return code;
    }

    public Task<GitHubIdentity?> ExchangeCodeAsync(string code, string redirectUri, string codeVerifier, CancellationToken cancellationToken = default) =>
        Task.FromResult(_codes.TryRemove(code, out var issued) && issued.Challenge == Challenge(codeVerifier) ? issued.Identity : null);

    public static (string State, string CodeChallenge) ReadAuthorizationUrl(Uri location)
    {
        var query = HttpUtility.ParseQueryString(location.Query);
        return (query["state"]!, query["code_challenge"]!);
    }

    private static string Challenge(string verifier) =>
        Convert.ToBase64String(SHA256.HashData(Encoding.ASCII.GetBytes(verifier))).TrimEnd('=').Replace('+', '-').Replace('/', '_');
}
