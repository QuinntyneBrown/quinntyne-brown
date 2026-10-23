using System.Security.Cryptography;
using System.Text.Json;
using Microsoft.AspNetCore.DataProtection;

namespace QuinntyneBrown.Community.Api.Authentication;

/// <summary>
/// An external sign-in's correlation cookie (ADR 0019, ADR 0032): the state, the secret that binds the code to
/// this browser and where to land, protected so the browser can neither read nor forge it, kept for 10 minutes
/// and deleted when the provider sends the browser back. Each provider has its own cookie, path and purpose.
/// </summary>
public abstract class SignInCorrelation(IDataProtectionProvider dataProtection, TimeProvider time, string cookieName, string cookiePath, string purpose)
{
    public static readonly TimeSpan Lifetime = TimeSpan.FromMinutes(10);

    private readonly ITimeLimitedDataProtector _protector = dataProtection.CreateProtector(purpose).ToTimeLimitedDataProtector();

    /// <param name="Secret">Google's nonce, or GitHub's PKCE code verifier.</param>
    /// <param name="FromApp">True when the sign-in started on the community app's own pages, so outcomes return there.</param>
    public record Pending(string State, string Secret, string ReturnUrl, bool KeepSignedIn, bool FromApp = false);

    public static string NewSecret() => Base64Url(RandomNumberGenerator.GetBytes(32));

    public void Write(HttpContext context, Pending pending)
    {
        var expires = time.GetUtcNow() + Lifetime;
        var value = _protector.Protect(JsonSerializer.Serialize(pending), expires);
        context.Response.Cookies.Append(cookieName, value, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            // Lax: the provider's redirect back is a top-level GET, so the cookie comes with it.
            SameSite = SameSiteMode.Lax,
            Path = cookiePath,
            Expires = expires,
            IsEssential = true,
        });
    }

    /// <summary>Reads the pending sign-in and deletes the cookie, so a callback can be used once.</summary>
    public Pending? ReadAndClear(HttpContext context)
    {
        var value = context.Request.Cookies[cookieName];
        context.Response.Cookies.Delete(cookieName, new CookieOptions { Path = cookiePath, Secure = true, HttpOnly = true, SameSite = SameSiteMode.Lax });
        if (string.IsNullOrEmpty(value))
        {
            return null;
        }

        try
        {
            return JsonSerializer.Deserialize<Pending>(_protector.Unprotect(value, out var expiration)) is { } pending && expiration > time.GetUtcNow()
                ? pending
                : null;
        }
        catch (CryptographicException)
        {
            return null;
        }
    }

    /// <summary>Compares the state the provider returned with the one sent, in constant time.</summary>
    public static bool StateMatches(Pending pending, string? state) =>
        state is not null && CryptographicOperations.FixedTimeEquals(
            System.Text.Encoding.UTF8.GetBytes(pending.State), System.Text.Encoding.UTF8.GetBytes(state));

    private static string Base64Url(byte[] bytes) =>
        Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');
}

/// <summary>The Google sign-in correlation cookie (ADR 0019).</summary>
public class GoogleCorrelation(IDataProtectionProvider dataProtection, TimeProvider time)
    : SignInCorrelation(dataProtection, time, CookieName, CookiePath, "QuinntyneBrown.Community.GoogleSignIn")
{
    public const string CookieName = "ftc.google";
    public const string CookiePath = "/api/account/google";
}

/// <summary>The GitHub sign-in correlation cookie (ADR 0032).</summary>
public class GitHubCorrelation(IDataProtectionProvider dataProtection, TimeProvider time)
    : SignInCorrelation(dataProtection, time, CookieName, CookiePath, "QuinntyneBrown.Community.GitHubSignIn")
{
    public const string CookieName = "ftc.github";
    public const string CookiePath = "/api/account/github";
}
