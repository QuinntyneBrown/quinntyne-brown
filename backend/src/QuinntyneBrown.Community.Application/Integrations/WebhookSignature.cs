using System.Globalization;
using System.Security.Cryptography;
using System.Text;

namespace QuinntyneBrown.Community.Application.Integrations;

/// <summary>
/// The ICD's signature: <c>sha256=</c> and the hex HMAC-SHA256 of <c>timestamp + "." + rawBody</c>, keyed with the
/// UTF-8 bytes of the whole secret. Comparison is on the decoded bytes, in constant time (L2-161 AC3).
/// </summary>
public static class WebhookSignature
{
    public const string Scheme = "sha256=";

    public static byte[] Compute(string secret, string timestamp, ReadOnlySpan<byte> body)
    {
        var prefix = Encoding.UTF8.GetBytes(timestamp + ".");
        var signed = new byte[prefix.Length + body.Length];
        prefix.CopyTo(signed, 0);
        body.CopyTo(signed.AsSpan(prefix.Length));
        return HMACSHA256.HashData(Encoding.UTF8.GetBytes(secret), signed);
    }

    /// <summary>The decoded digest of a <c>sha256=</c> header with 64 hex digits, or null when it is malformed.</summary>
    public static byte[]? Decode(string? header)
    {
        if (header is null || !header.StartsWith(Scheme, StringComparison.Ordinal) || header.Length != Scheme.Length + 64)
        {
            return null;
        }

        try
        {
            return Convert.FromHexString(header.AsSpan(Scheme.Length));
        }
        catch (FormatException)
        {
            return null;
        }
    }

    public static bool Matches(byte[] presented, string secret, string timestamp, ReadOnlySpan<byte> body) =>
        CryptographicOperations.FixedTimeEquals(presented, Compute(secret, timestamp, body));

    /// <summary>Unix seconds as an integer string, or null.</summary>
    public static DateTimeOffset? ParseTimestamp(string? value) =>
        long.TryParse(value, NumberStyles.None, CultureInfo.InvariantCulture, out var seconds) && seconds <= 253402300799
            ? DateTimeOffset.FromUnixTimeSeconds(seconds)
            : null;
}
