using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Domain.Identity;

namespace QuinntyneBrown.Community.Application.Identity;

/// <summary>What GitHub's API says about the person: the numeric user id, the primary email and its verified flag (ADR 0032).</summary>
public record GitHubIdentity(string Subject, string Email, bool EmailVerified, string? Name);

/// <summary>GitHub's OAuth 2.0 provider; Infrastructure talks to GitHub, tests use a fake.</summary>
public interface IGitHubIdentityProvider
{
    /// <summary>
    /// The URL that sends the browser to GitHub with the S256 challenge of <paramref name="codeVerifier"/>, or null
    /// when GitHub sign-in is not configured.
    /// </summary>
    string? BuildAuthorizationUrl(string state, string codeVerifier, string redirectUri);

    /// <summary>
    /// Exchanges the authorization code with <paramref name="codeVerifier"/> and reads the person from GitHub's API.
    /// Null when GitHub refuses the code or the person has no primary email.
    /// </summary>
    Task<GitHubIdentity?> ExchangeCodeAsync(string code, string redirectUri, string codeVerifier, CancellationToken cancellationToken = default);
}

public record GitHubSignInCommand(string Code, string RedirectUri, string CodeVerifier);

public enum GitHubSignInError
{
    InvalidToken,
    UnverifiedEmail,
    Suspended,
}

public record GitHubSignInResult(CommunityUser? User, GitHubSignInError? Error)
{
    public bool Succeeded => User is not null;
}

/// <summary>
/// Signs in, links or creates an account from a GitHub identity (L2-130, ADR 0032), by the same rule as Google: a
/// GitHub login is linked only to an account whose email is GitHub's verified primary email.
/// </summary>
public class GitHubSignInHandler(
    IApplicationDbContext db,
    IGitHubIdentityProvider github,
    ExternalAccounts accounts)
{
    public const string LoginProvider = "GitHub";

    public async Task<GitHubSignInResult> HandleAsync(GitHubSignInCommand command, CancellationToken cancellationToken = default)
    {
        var identity = await github.ExchangeCodeAsync(command.Code, command.RedirectUri, command.CodeVerifier, cancellationToken);
        if (identity is null)
        {
            return new(null, GitHubSignInError.InvalidToken);
        }

        // Only an address GitHub has verified proves who the person is; nothing is created or linked otherwise.
        if (!identity.EmailVerified)
        {
            return new(null, GitHubSignInError.UnverifiedEmail);
        }

        var user = await accounts.FindLinkOrCreateAsync(LoginProvider, identity.Subject, identity.Email, identity.Name, cancellationToken);

        // The same rule and outcome as password sign-in, reported only now the person has proven who they are.
        return await AccountStatus.IsSuspendedAsync(db, user, cancellationToken)
            ? new(null, GitHubSignInError.Suspended)
            : new(user, null);
    }
}
