using System.Security.Cryptography;
using System.Text;
using QuinntyneBrown.Community.Application.Organizations;

namespace QuinntyneBrown.Community.Infrastructure.Organizations;

/// <summary>32 random bytes as base64url after <c>ftca_</c>; the SHA-256 hash (hex) is what the database keeps.</summary>
public class AgentTokenFactory : IAgentTokenFactory
{
    public NewAgentToken Create()
    {
        var secret = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32)).TrimEnd('=').Replace('+', '-').Replace('/', '_');
        var token = IAgentTokenFactory.Scheme + secret;
        return new NewAgentToken(token, Hash(token), secret[..8]);
    }

    public string Hash(string token) => Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
}
