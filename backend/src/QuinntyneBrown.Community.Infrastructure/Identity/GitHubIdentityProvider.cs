using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;
using QuinntyneBrown.Community.Application.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace QuinntyneBrown.Community.Infrastructure.Identity;

/// <summary>GitHub OAuth app settings, from configuration or environment variables; never in the repository.</summary>
public class GitHubOptions
{
    public const string Section = "GitHub";

    public string ClientId { get; set; } = string.Empty;

    public string ClientSecret { get; set; } = string.Empty;

    public bool IsConfigured => !string.IsNullOrWhiteSpace(ClientId) && !string.IsNullOrWhiteSpace(ClientSecret);
}

/// <summary>
/// GitHub's OAuth 2.0 authorization code flow with PKCE (ADR 0027). GitHub has no ID token, so the person is read
/// from its REST API with the access token, which is used for those two reads and never kept.
/// </summary>
public class GitHubIdentityProvider(
    HttpClient http,
    IOptions<GitHubOptions> options,
    ILogger<GitHubIdentityProvider> logger) : IGitHubIdentityProvider
{
    public const string AuthorizationEndpoint = "https://github.com/login/oauth/authorize";
    public const string TokenEndpoint = "https://github.com/login/oauth/access_token";
    public const string UserEndpoint = "https://api.github.com/user";
    public const string EmailsEndpoint = "https://api.github.com/user/emails";

    public string? BuildAuthorizationUrl(string state, string codeVerifier, string redirectUri)
    {
        if (!options.Value.IsConfigured)
        {
            return null;
        }

        var query = new Dictionary<string, string>
        {
            ["client_id"] = options.Value.ClientId,
            ["redirect_uri"] = redirectUri,
            ["scope"] = "read:user user:email",
            ["state"] = state,
            ["code_challenge"] = Challenge(codeVerifier),
            ["code_challenge_method"] = "S256",
        };
        return $"{AuthorizationEndpoint}?{string.Join('&', query.Select(p => $"{p.Key}={Uri.EscapeDataString(p.Value)}"))}";
    }

    public async Task<GitHubIdentity?> ExchangeCodeAsync(string code, string redirectUri, string codeVerifier, CancellationToken cancellationToken = default)
    {
        if (!options.Value.IsConfigured)
        {
            return null;
        }

        try
        {
            var accessToken = await ExchangeAsync(code, redirectUri, codeVerifier, cancellationToken);
            if (accessToken is null)
            {
                return null;
            }

            var user = await GetAsync<User>(UserEndpoint, accessToken, cancellationToken);
            var emails = await GetAsync<Email[]>(EmailsEndpoint, accessToken, cancellationToken);
            // The primary address is the one GitHub stands behind; a secondary one never stands in for it.
            var primary = emails?.FirstOrDefault(e => e.Primary && !string.IsNullOrWhiteSpace(e.Address));
            if (user is null || user.Id <= 0 || primary is null)
            {
                return null;
            }

            return new GitHubIdentity(user.Id.ToString(System.Globalization.CultureInfo.InvariantCulture), primary.Address!, primary.Verified,
                string.IsNullOrWhiteSpace(user.Name) ? user.Login : user.Name);
        }
        catch (Exception exception) when (exception is HttpRequestException or TaskCanceledException or System.Text.Json.JsonException)
        {
            logger.LogWarning(exception, "GitHub is unavailable");
            return null;
        }
    }

    private async Task<string?> ExchangeAsync(string code, string redirectUri, string codeVerifier, CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, TokenEndpoint)
        {
            Content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["client_id"] = options.Value.ClientId,
                ["client_secret"] = options.Value.ClientSecret,
                ["code"] = code,
                ["redirect_uri"] = redirectUri,
                ["code_verifier"] = codeVerifier,
            }),
        };
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        using var response = await http.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            logger.LogWarning("GitHub refused the authorization code with {Status}", (int)response.StatusCode);
            return null;
        }

        // GitHub answers a refused code with 200 and an error field.
        var tokens = await response.Content.ReadFromJsonAsync<TokenResponse>(cancellationToken);
        if (tokens?.Error is { } error)
        {
            logger.LogWarning("GitHub refused the authorization code: {Error}", error);
        }

        return string.IsNullOrEmpty(tokens?.AccessToken) ? null : tokens.AccessToken;
    }

    private async Task<T?> GetAsync<T>(string url, string accessToken, CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.github+json"));
        request.Headers.UserAgent.Add(new ProductInfoHeaderValue("QuinntyneBrown.Community", "1.0"));
        request.Headers.Add("X-GitHub-Api-Version", "2022-11-28");
        using var response = await http.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            logger.LogWarning("GitHub answered {Url} with {Status}", url, (int)response.StatusCode);
            return default;
        }

        return await response.Content.ReadFromJsonAsync<T>(cancellationToken);
    }

    /// <summary>The PKCE S256 challenge: base64url of the SHA-256 of the verifier (RFC 7636).</summary>
    private static string Challenge(string codeVerifier) =>
        Convert.ToBase64String(SHA256.HashData(Encoding.ASCII.GetBytes(codeVerifier))).TrimEnd('=').Replace('+', '-').Replace('/', '_');

    private sealed record TokenResponse(
        [property: JsonPropertyName("access_token")] string? AccessToken,
        [property: JsonPropertyName("error")] string? Error);

    private sealed record User(
        [property: JsonPropertyName("id")] long Id,
        [property: JsonPropertyName("login")] string? Login,
        [property: JsonPropertyName("name")] string? Name);

    private sealed record Email(
        [property: JsonPropertyName("email")] string? Address,
        [property: JsonPropertyName("primary")] bool Primary,
        [property: JsonPropertyName("verified")] bool Verified);
}
