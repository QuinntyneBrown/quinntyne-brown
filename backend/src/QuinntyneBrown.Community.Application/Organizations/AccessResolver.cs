using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Domain.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Organizations;

/// <summary>
/// Builds the caller's <see cref="CallerAccess"/> from the database (ADR 0034): System Admin, Portfolio Lead,
/// memberships and Org Lead, catalogue roles, cross-org roles (scope resolved now, so new orgs are covered at once)
/// and each org's enabled features. Called once per request; nothing is cached across requests.
/// </summary>
public class AccessResolver(IApplicationDbContext db)
{
    /// <param name="orgHeader">The <c>X-Org</c> value: an org slug, <c>all</c>, or null.</param>
    /// <param name="tokenOrgIds">An agent token's orgs (ADR 0036); coverage is intersected with them.</param>
    public async Task<CallerAccess> ResolveAsync(
        Guid? userId, string? orgHeader, IReadOnlyCollection<Guid>? tokenOrgIds = null, Guid? credentialId = null, CancellationToken cancellationToken = default)
    {
        if (userId is null)
        {
            return CallerAccess.Anonymous;
        }

        var profile = await db.Users.AsNoTracking().Where(u => u.Id == userId)
            .Join(db.Profiles, u => u.ProfileId, p => p.Id, (u, p) => new { p.Id, p.IsSystemAdmin, p.Kind })
            .SingleOrDefaultAsync(cancellationToken);
        if (profile is null)
        {
            return CallerAccess.Anonymous;
        }

        return await ResolveProfileAsync(profile.Id, profile.IsSystemAdmin, profile.Kind, orgHeader, tokenOrgIds, credentialId, cancellationToken);
    }

    /// <summary>Another person's coverage and permissions, for rules about them (eligibility, ownership); no active org.</summary>
    public async Task<CallerAccess> ForProfileAsync(Guid profileId, CancellationToken cancellationToken = default)
    {
        var profile = await db.Profiles.AsNoTracking().Where(p => p.Id == profileId)
            .Select(p => new { p.IsSystemAdmin, p.Kind }).SingleOrDefaultAsync(cancellationToken);
        return profile is null
            ? CallerAccess.Anonymous
            : await ResolveProfileAsync(profileId, profile.IsSystemAdmin, profile.Kind, null, null, null, cancellationToken);
    }

    private async Task<CallerAccess> ResolveProfileAsync(
        Guid profileId, bool isSystemAdmin, Domain.Profiles.ProfileKind kind, string? orgHeader, IReadOnlyCollection<Guid>? tokenOrgIds, Guid? credentialId,
        CancellationToken cancellationToken)
    {
        var orgs = await db.Organizations.AsNoTracking().Where(o => o.ArchivedAtUtc == null).ToListAsync(cancellationToken);
        var types = await db.OrgTypes.AsNoTracking().ToDictionaryAsync(t => t.Id, cancellationToken);
        var memberships = await db.OrgMemberships.AsNoTracking().Where(m => m.ProfileId == profileId).ToListAsync(cancellationToken);
        var roleIds = await db.OrgRoleAssignments.AsNoTracking().Where(a => a.ProfileId == profileId)
            .Select(a => new { a.OrganizationId, a.RoleDefinitionId }).ToListAsync(cancellationToken);
        var heldRoleIds = roleIds.Select(r => r.RoleDefinitionId).Distinct().ToList();
        var roles = await db.RoleDefinitions.AsNoTracking().Where(r => heldRoleIds.Contains(r.Id)).ToDictionaryAsync(r => r.Id, cancellationToken);
        var crossAssignments = await db.CrossOrgAssignments.AsNoTracking().Where(a => a.ProfileId == profileId).ToListAsync(cancellationToken);
        var crossRoleIds = crossAssignments.Select(a => a.CrossOrgRoleId).Distinct().ToList();
        var crossRoles = await db.CrossOrgRoles.AsNoTracking().Where(r => crossRoleIds.Contains(r.Id)).ToDictionaryAsync(r => r.Id, cancellationToken);
        var ledPortfolios = (await db.PortfolioLeads.AsNoTracking().Where(l => l.ProfileId == profileId)
            .Select(l => l.PortfolioId).ToListAsync(cancellationToken)).ToHashSet();

        var result = new Dictionary<Guid, OrgAccess>();
        foreach (var org in orgs)
        {
            if (tokenOrgIds is not null && !tokenOrgIds.Contains(org.Id))
            {
                continue;
            }

            var type = types[org.OrgTypeId];
            var membership = memberships.FirstOrDefault(m => m.OrganizationId == org.Id);
            var isPortfolioLead = ledPortfolios.Contains(org.PortfolioId);
            var covering = crossAssignments
                .Where(a => crossRoles.TryGetValue(a.CrossOrgRoleId, out var role) && CrossOrgCovers(role, a, org))
                .Select(a => crossRoles[a.CrossOrgRoleId])
                .ToList();
            if (membership is null && covering.Count == 0 && !isPortfolioLead && !isSystemAdmin)
            {
                continue;
            }

            var features = Features.All.Where(type.IsEnabled).ToHashSet();
            var granted = new HashSet<string>();
            var held = new HashSet<Guid>();
            if (membership is not null)
            {
                granted.UnionWith(type.MemberPermissions);
                foreach (var assignment in roleIds.Where(r => r.OrganizationId == org.Id))
                {
                    if (roles.TryGetValue(assignment.RoleDefinitionId, out var role) && role.OrgTypeId == type.Id)
                    {
                        granted.UnionWith(role.Permissions);
                        held.Add(role.Id);
                    }
                }
            }

            foreach (var role in covering)
            {
                granted.UnionWith(role.Permissions);
            }

            var isOrgLead = membership?.IsOrgLead == true;
            var everything = isOrgLead || isPortfolioLead || isSystemAdmin;
            var rolePermissions = OnlyEnabled(granted, features);
            var permissions = everything ? OnlyEnabled(Permissions.All, features) : rolePermissions;

            result[org.Id] = new OrgAccess(
                org.Id, org.PortfolioId, org.OrgTypeId, org.Slug, org.Name, org.ShownName, type.Name, org.LogoBlobName, org.AccentColour,
                IsMember: membership is not null,
                IsOrgLead: isOrgLead,
                IsPortfolioLead: isPortfolioLead,
                CanJoinWork: covering.Any(r => r.CanJoinWork),
                features, rolePermissions, permissions, held,
                covering.Select(r => r.Id).ToHashSet());
        }

        Guid? activeOrgId = null;
        var allOrgs = false;
        var missing = false;
        if (!string.IsNullOrWhiteSpace(orgHeader))
        {
            if (orgHeader == OrgSlug.AllOrgs)
            {
                allOrgs = true;
            }
            else if (result.Values.FirstOrDefault(o => o.Slug == orgHeader) is { } active)
            {
                activeOrgId = active.OrgId;
            }
            else
            {
                missing = true;
            }
        }

        return new CallerAccess(profileId, isSystemAdmin, result, ledPortfolios, activeOrgId, allOrgs, missing,
            kind == Domain.Profiles.ProfileKind.Agent, credentialId);
    }

    /// <summary>Whether a cross-org role, as narrowed by the assignment, covers the org (ADR 0035).</summary>
    public static bool CrossOrgCovers(CrossOrgRole role, CrossOrgAssignment assignment, Domain.Organizations.Organization org)
    {
        if (org.PortfolioId != role.PortfolioId)
        {
            return false;
        }

        var inScope = role.ScopeKind switch
        {
            CrossOrgScopeKind.Portfolio => true,
            CrossOrgScopeKind.OrgType => org.OrgTypeId == role.ScopeOrgTypeId,
            _ => role.ScopeOrgIds.Contains(org.Id),
        };
        return inScope && (assignment.NarrowedOrgIds.Count == 0 || assignment.NarrowedOrgIds.Contains(org.Id));
    }

    private static HashSet<string> OnlyEnabled(IEnumerable<string> permissions, IReadOnlySet<string> features) =>
        permissions.Where(p => Permissions.FeatureOf.TryGetValue(p, out var feature) && features.Contains(feature)).ToHashSet();
}
