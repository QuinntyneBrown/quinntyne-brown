using System.Security.Claims;

namespace QuinntyneBrown.Community.Api.Authentication;

/// <summary>The claims an agent token puts on the principal (ADR 0036): the credential and the orgs it may reach.</summary>
public static class AgentTokenClaims
{
    public const string Credential = "ftc_credential";
    public const string Org = "ftc_org";

    public record AgentCredentialClaim(Guid Id, IReadOnlyCollection<Guid> OrgIds);

    public static AgentCredentialClaim? CredentialOf(ClaimsPrincipal principal) =>
        Guid.TryParse(principal.FindFirst(Credential)?.Value, out var id)
            ? new AgentCredentialClaim(id, [.. principal.FindAll(Org).Select(c => Guid.Parse(c.Value))])
            : null;
}
