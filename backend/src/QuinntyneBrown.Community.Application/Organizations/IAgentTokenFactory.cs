namespace QuinntyneBrown.Community.Application.Organizations;

/// <summary>A new agent token: shown once; only its hash is stored, and its prefix tells tokens apart (ADR 0036).</summary>
public record NewAgentToken(string Token, string Hash, string Prefix);

/// <summary>Makes and hashes agent tokens (<c>ftca_</c> followed by random base64url).</summary>
public interface IAgentTokenFactory
{
    public const string Scheme = "ftca_";

    NewAgentToken Create();

    string Hash(string token);
}
