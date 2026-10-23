using System.Security.Claims;
using System.Text.Encodings.Web;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using OpenIddict.Abstractions;

namespace QuinntyneBrown.Community.Api.Authentication;

/// <summary>
/// Authenticates <c>Authorization: Bearer ftca_…</c> (ADR 0036). A missing, revoked or expired credential, a profile
/// that is not an agent, or a suspended agent fails, so the API answers 401. The credential is looked up on every
/// request, so revoking it takes effect at once.
/// </summary>
public class AgentTokenAuthenticationHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder,
    IApplicationDbContext db,
    IAgentTokenFactory tokens,
    TimeProvider time) : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    public const string SchemeName = "AgentToken";

    public static bool Carries(HttpRequest request) =>
        request.Headers.Authorization.ToString().StartsWith($"Bearer {IAgentTokenFactory.Scheme}", StringComparison.Ordinal);

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Carries(Request))
        {
            return AuthenticateResult.NoResult();
        }

        var token = Request.Headers.Authorization.ToString()["Bearer ".Length..].Trim();
        var hash = tokens.Hash(token);
        var credential = await db.AgentCredentials.SingleOrDefaultAsync(c => c.TokenHash == hash, Context.RequestAborted);
        var now = time.GetUtcNow();
        if (credential is null || !credential.IsUsable(now))
        {
            return AuthenticateResult.Fail("The agent token is not valid.");
        }

        var agent = await db.Users.Where(u => u.ProfileId == credential.AgentProfileId)
            .Join(db.Profiles, u => u.ProfileId, p => p.Id, (u, p) => new { UserId = u.Id, p.Kind, p.IsSuspended })
            .SingleOrDefaultAsync(Context.RequestAborted);
        if (agent is null || agent.Kind != Domain.Profiles.ProfileKind.Agent || agent.IsSuspended)
        {
            return AuthenticateResult.Fail("The agent cannot use the API.");
        }

        if (credential.Touch(now))
        {
            await db.SaveChangesAsync(Context.RequestAborted);
        }

        var identity = new ClaimsIdentity(SchemeName);
        identity.AddClaim(new Claim(OpenIddictConstants.Claims.Subject, agent.UserId.ToString()));
        identity.AddClaim(new Claim(AgentTokenClaims.Credential, credential.Id.ToString()));
        foreach (var orgId in credential.OrgIds)
        {
            identity.AddClaim(new Claim(AgentTokenClaims.Org, orgId.ToString()));
        }

        return AuthenticateResult.Success(new AuthenticationTicket(new ClaimsPrincipal(identity), SchemeName));
    }
}
