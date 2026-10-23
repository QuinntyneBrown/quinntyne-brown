using QuinntyneBrown.Community.Application.Admin;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Identity;
using QuinntyneBrown.Community.Application.Profiles;
using QuinntyneBrown.Community.Domain.Organizations;
using QuinntyneBrown.Community.Domain.Profiles;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Organizations;

public record AgentDto(Guid ProfileId, string Name, string? PhotoUrl, IReadOnlyList<OrgLabel> Orgs, int TokenCount);

public record CreateAgentCommand(Guid PortfolioId, string? Name);

public record IssueTokenCommand(string? Name, int? ExpiresInDays, IReadOnlyList<Guid>? OrgIds);

public record IssuedTokenDto(Guid Id, string Name, string Prefix, IReadOnlyList<OrgLabel> Orgs, DateTimeOffset ExpiresAt, string Token);

public record AgentTokenDto(
    Guid Id, string Name, string Prefix, IReadOnlyList<OrgLabel> Orgs, PersonRefDto IssuedBy, DateTimeOffset CreatedAt,
    DateTimeOffset ExpiresAt, DateTimeOffset? LastUsedAt, DateTimeOffset? RevokedAt);

/// <summary>
/// Agents and their tokens (L2-154, ADR 0036). The Portfolio Lead creates agents; it or an Org Lead (for orgs it leads)
/// issues tokens, shown once; the issuer, the Portfolio Lead or a System Admin revokes them. Every issue and revoke
/// is audited. Roles come through the usual membership and role endpoints.
/// </summary>
public class AgentsHandler(
    IApplicationDbContext db,
    ICurrentUser current,
    ProfileAccess profiles,
    IAuditLog audit,
    IAgentTokenFactory tokens,
    TimeProvider time)
{
    public async Task<(Result Result, IReadOnlyList<AgentDto>? Agents)> ListAsync(Guid portfolioId, CancellationToken cancellationToken = default)
    {
        var access = current.Access;
        var administers = PortfolioAccess.Refusal(access, portfolioId) is null;
        var led = access.Orgs.Values.Where(o => o.PortfolioId == portfolioId && access.LeadsOrg(o.OrgId)).Select(o => o.OrgId).ToList();
        if (!administers && led.Count == 0)
        {
            return (PortfolioAccess.Refusal(access, portfolioId)!, null);
        }

        var agents = await db.Profiles.AsNoTracking().Where(p => p.Kind == ProfileKind.Agent).OrderBy(p => p.Name).ToListAsync(cancellationToken);
        var ids = agents.Select(a => a.Id).ToList();
        var memberships = await db.OrgMemberships.AsNoTracking().Where(m => ids.Contains(m.ProfileId))
            .Join(db.Organizations.AsNoTracking(), m => m.OrganizationId, o => o.Id, (m, o) => new { m.ProfileId, Org = new OrgLabel(o.Id, o.Slug, o.DisplayName ?? o.Name), o.PortfolioId })
            .ToListAsync(cancellationToken);
        var now = time.GetUtcNow();
        var credentials = await db.AgentCredentials.AsNoTracking().Where(c => ids.Contains(c.AgentProfileId)).ToListAsync(cancellationToken);
        return (Result.Ok(), [.. agents
            .Where(a => administers || memberships.Any(m => m.ProfileId == a.Id && led.Contains(m.Org.Id)))
            .Select(a => new AgentDto(
                a.Id, a.Name, null,
                [.. memberships.Where(m => m.ProfileId == a.Id && m.PortfolioId == portfolioId).Select(m => m.Org).OrderBy(o => o.Name)],
                credentials.Count(c => c.AgentProfileId == a.Id && c.IsUsable(now))))]);
    }

    /// <summary>A profile of kind Agent with a user row that has no email, password or external login (AC1).</summary>
    public async Task<(Result Result, AgentDto? Agent)> CreateAsync(CreateAgentCommand command, CancellationToken cancellationToken = default)
    {
        if (PortfolioAccess.Refusal(current.Access, command.PortfolioId) is { } refusal)
        {
            return (refusal, null);
        }

        var name = command.Name?.Trim() ?? string.Empty;
        if (name.Length is 0 or > 80)
        {
            return (Result.Invalid("name", "Enter a name of 80 characters or fewer."), null);
        }

        var now = time.GetUtcNow().UtcDateTime;
        var profile = new Profile(name, now, ProfileKind.Agent);
        var userName = $"agent-{profile.Id:N}";
        db.Profiles.Add(profile);
        db.Users.Add(new CommunityUser
        {
            Id = Guid.NewGuid(),
            UserName = userName,
            NormalizedUserName = userName.ToUpperInvariant(),
            SecurityStamp = Guid.NewGuid().ToString("N"),
            ProfileId = profile.Id,
        });
        var actor = await profiles.CallerProfileIdAsync(cancellationToken) ?? Guid.Empty;
        audit.Record(actor, "agent.created", "Profile", profile.Id.ToString(), null, new { profile.Name }, null, command.PortfolioId);
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), new AgentDto(profile.Id, profile.Name, null, [], 0));
    }

    /// <summary>1 to 90 days (30 by default) and at least one org; the Org Lead only for orgs it leads (AC2).</summary>
    public async Task<(Result Result, IssuedTokenDto? Token)> IssueAsync(Guid agentId, IssueTokenCommand command, CancellationToken cancellationToken = default)
    {
        if (!await IsAgentAsync(agentId, cancellationToken))
        {
            return (Result.NotFound(), null);
        }

        var name = command.Name?.Trim() ?? string.Empty;
        if (name.Length is 0 or > 80)
        {
            return (Result.Invalid("name", "Enter a name of 80 characters or fewer."), null);
        }

        var days = command.ExpiresInDays ?? AgentCredential.DefaultDays;
        if (days is < 1 or > AgentCredential.MaxDays)
        {
            return (Result.Invalid("expiresInDays", "Choose an expiry of 1 to 90 days."), null);
        }

        var orgIds = (command.OrgIds ?? []).Distinct().ToList();
        if (orgIds.Count == 0)
        {
            return (Result.Invalid("orgIds", "Choose at least one organization."), null);
        }

        var orgs = await db.Organizations.AsNoTracking().Where(o => orgIds.Contains(o.Id)).ToListAsync(cancellationToken);
        if (orgs.Count != orgIds.Count)
        {
            return (Result.Invalid("orgIds", "Choose organizations from the list."), null);
        }

        if (orgs.Any(o => !MayIssueIn(o)))
        {
            return (Result.Forbidden(), null);
        }

        var issuer = await profiles.CallerProfileIdAsync(cancellationToken) ?? Guid.Empty;
        var now = time.GetUtcNow();
        var token = tokens.Create();
        var credential = new AgentCredential(agentId, name, token.Hash, token.Prefix, issuer, orgIds, now, now.AddDays(days));
        db.AgentCredentials.Add(credential);
        audit.Record(issuer, "agent.tokenIssued", "Profile", agentId.ToString(), null,
            new { Token = name, credential.Prefix, credential.OrgIds, credential.ExpiresAt }, orgIds.Count == 1 ? orgIds[0] : null, orgs[0].PortfolioId);
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), new IssuedTokenDto(credential.Id, name, token.Prefix, Labels(orgs), credential.ExpiresAt, token.Token));
    }

    /// <summary>Never returns the token or its hash; an Org Lead sees only tokens that name an org it leads.</summary>
    public async Task<(Result Result, IReadOnlyList<AgentTokenDto>? Tokens)> ListTokensAsync(Guid agentId, CancellationToken cancellationToken = default)
    {
        if (!await IsAgentAsync(agentId, cancellationToken))
        {
            return (Result.NotFound(), null);
        }

        var caller = await profiles.CallerProfileIdAsync(cancellationToken);
        var credentials = await db.AgentCredentials.AsNoTracking().Where(c => c.AgentProfileId == agentId).OrderByDescending(c => c.CreatedAt).ToListAsync(cancellationToken);
        var orgIds = credentials.SelectMany(c => c.OrgIds).Distinct().ToList();
        var orgs = await db.Organizations.AsNoTracking().Where(o => orgIds.Contains(o.Id)).ToListAsync(cancellationToken);
        var issuerIds = credentials.Select(c => c.IssuedById).Distinct().ToList();
        var issuers = await db.Profiles.AsNoTracking().Where(p => issuerIds.Contains(p.Id)).ToDictionaryAsync(p => p.Id, p => p.Name, cancellationToken);
        var visible = credentials.Where(c => c.IssuedById == caller || orgs.Where(o => c.OrgIds.Contains(o.Id)).Any(MayIssueIn)).ToList();
        if (visible.Count == 0 && credentials.Count > 0 && !current.Access.IsSystemAdmin)
        {
            return (Result.Forbidden(), null);
        }

        return (Result.Ok(), [.. visible.Select(c => new AgentTokenDto(
            c.Id, c.Name, c.Prefix, Labels(orgs.Where(o => c.OrgIds.Contains(o.Id))), new PersonRefDto(c.IssuedById, issuers.GetValueOrDefault(c.IssuedById, "Someone")),
            c.CreatedAt, c.ExpiresAt, c.LastUsedAt, c.RevokedAt))]);
    }

    /// <summary>The issuer, the Portfolio Lead or a System Admin; the token stops working at once (AC4).</summary>
    public async Task<Result> RevokeAsync(Guid agentId, Guid tokenId, CancellationToken cancellationToken = default)
    {
        var credential = await db.AgentCredentials.SingleOrDefaultAsync(c => c.Id == tokenId && c.AgentProfileId == agentId, cancellationToken);
        if (credential is null)
        {
            return Result.NotFound();
        }

        var caller = await profiles.CallerProfileIdAsync(cancellationToken) ?? Guid.Empty;
        var portfolios = await db.Organizations.AsNoTracking().Where(o => credential.OrgIds.Contains(o.Id)).Select(o => o.PortfolioId).Distinct().ToListAsync(cancellationToken);
        var allowed = credential.IssuedById == caller || current.Access.IsSystemAdmin || portfolios.Any(p => current.Access.LedPortfolios.Contains(p));
        if (!allowed)
        {
            return Result.Forbidden();
        }

        credential.Revoke(time.GetUtcNow());
        audit.Record(caller, "agent.tokenRevoked", "Profile", agentId.ToString(), null, new { Token = credential.Name, credential.Prefix }, null, portfolios.FirstOrDefault());
        await db.SaveChangesAsync(cancellationToken);
        return Result.Ok();
    }

    private bool MayIssueIn(Organization org) =>
        PortfolioAccess.Refusal(current.Access, org.PortfolioId) is null || current.Access.IsOrgLead(org.Id);

    private Task<bool> IsAgentAsync(Guid profileId, CancellationToken cancellationToken) =>
        db.Profiles.AnyAsync(p => p.Id == profileId && p.Kind == ProfileKind.Agent, cancellationToken);

    private static IReadOnlyList<OrgLabel> Labels(IEnumerable<Organization> orgs) =>
        [.. orgs.OrderBy(o => o.Name).Select(o => new OrgLabel(o.Id, o.Slug, o.DisplayName ?? o.Name))];
}
