using System.Security.Cryptography;

namespace QuinntyneBrown.Community.Application.Integrations;

/// <summary>An application's source ID and signing secret, as the ICD defines them (ADR 0042).</summary>
public static class WebhookCredentials
{
    public const string SourcePrefix = "src_";
    public const string SecretPrefixText = "whsec_";
    public const int DisplayedSecretLength = 10;

    /// <summary><c>src_</c> and 32 lowercase hex characters.</summary>
    public static string NewSourceId() => SourcePrefix + Guid.NewGuid().ToString("N");

    /// <summary><c>whsec_</c> and 32 random bytes in base64url (43 characters).</summary>
    public static string NewSecret() =>
        SecretPrefixText + Convert.ToBase64String(RandomNumberGenerator.GetBytes(32)).TrimEnd('=').Replace('+', '-').Replace('/', '_');

    /// <summary>The first characters of a secret, the only part ever shown again.</summary>
    public static string Prefix(string secret) => secret[..DisplayedSecretLength];
}
