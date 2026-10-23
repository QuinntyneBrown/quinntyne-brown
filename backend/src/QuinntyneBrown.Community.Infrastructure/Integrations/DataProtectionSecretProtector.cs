using System.Security.Cryptography;
using QuinntyneBrown.Community.Application.Integrations;
using Microsoft.AspNetCore.DataProtection;

namespace QuinntyneBrown.Community.Infrastructure.Integrations;

/// <summary>
/// Signing secrets encrypted with ASP.NET Data Protection under their own purpose, so no other protected payload in
/// the system decrypts as one (ADR 0042).
/// </summary>
public class DataProtectionSecretProtector(IDataProtectionProvider provider) : ISecretProtector
{
    private readonly IDataProtector _protector = provider.CreateProtector("QuinntyneBrown.Community.Integrations.SigningSecret.v1");

    public string Protect(string secret) => _protector.Protect(secret);

    public string? Unprotect(string ciphertext)
    {
        try
        {
            return _protector.Unprotect(ciphertext);
        }
        catch (Exception exception) when (exception is CryptographicException or FormatException)
        {
            return null;
        }
    }
}
