namespace QuinntyneBrown.Community.Application.Integrations;

/// <summary>
/// Encrypts signing secrets at rest (ADR 0042). They are encrypted, not hashed, because verifying an HMAC needs the
/// raw secret. <see cref="Unprotect"/> returns null when the ciphertext cannot be read.
/// </summary>
public interface ISecretProtector
{
    string Protect(string secret);

    string? Unprotect(string ciphertext);
}
