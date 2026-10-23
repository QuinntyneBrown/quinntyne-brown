using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Domain.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Organizations;

/// <summary>
/// Who may join and own an org's workspaces (D12, L2-146): members holding <c>workspaces.join</c>, plus holders of a
/// covering cross-org role with <c>CanJoinWork</c>; owners hold <c>workspaces.create</c> or lead the org.
/// </summary>
public class WorkEligibility(IApplicationDbContext db, AccessResolver resolver, PermissionHolders holders)
{
    public async Task<bool> CanJoinAsync(Guid profileId, Guid orgId, CancellationToken cancellationToken = default)
    {
        var access = await resolver.ForProfileAsync(profileId, cancellationToken);
        return access.HasByRole(orgId, Permissions.WorkspacesJoin) || access.CanJoinWork(orgId);
    }

    public async Task<bool> CanOwnAsync(Guid profileId, Guid orgId, CancellationToken cancellationToken = default)
    {
        var access = await resolver.ForProfileAsync(profileId, cancellationToken);
        return access.Has(orgId, Permissions.WorkspacesCreate);
    }

    /// <summary>Everyone who may join the org's work: eligible members and covering cross-org holders (marked).</summary>
    public async Task<IReadOnlyList<(Guid ProfileId, bool IsCrossOrg)>> CandidatesAsync(Guid orgId, CancellationToken cancellationToken = default)
    {
        var members = await holders.MembersWithAsync(orgId, Permissions.WorkspacesJoin, cancellationToken);
        var org = await db.Organizations.AsNoTracking().SingleAsync(o => o.Id == orgId, cancellationToken);
        var roles = await db.CrossOrgRoles.AsNoTracking().Where(r => r.PortfolioId == org.PortfolioId && r.CanJoinWork).ToDictionaryAsync(r => r.Id, cancellationToken);
        var roleIds = roles.Keys.ToList();
        var assignments = await db.CrossOrgAssignments.AsNoTracking().Where(a => roleIds.Contains(a.CrossOrgRoleId)).ToListAsync(cancellationToken);
        var crossOrg = assignments.Where(a => AccessResolver.CrossOrgCovers(roles[a.CrossOrgRoleId], a, org)).Select(a => a.ProfileId)
            .Where(id => !members.Contains(id)).Distinct();
        return [.. members.Select(id => (id, false)), .. crossOrg.Select(id => (id, true))];
    }

    /// <summary>Everyone who may own the org's workspaces: holders of <c>workspaces.create</c> and its Org Leads.</summary>
    public async Task<IReadOnlyList<Guid>> OwnerCandidatesAsync(Guid orgId, CancellationToken cancellationToken = default)
    {
        var creators = await holders.MembersWithAsync(orgId, Permissions.WorkspacesCreate, cancellationToken);
        var leads = await db.OrgMemberships.AsNoTracking().Where(m => m.OrganizationId == orgId && m.IsOrgLead).Select(m => m.ProfileId).ToListAsync(cancellationToken);
        return [.. creators.Concat(leads).Distinct()];
    }
}
