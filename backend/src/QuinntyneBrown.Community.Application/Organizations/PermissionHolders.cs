using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Domain.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Organizations;

/// <summary>
/// Who holds a permission in an org through a role: members whose Member bundle or catalogue roles include it
/// (ADR 0033). Used for lists such as the team, partner owners and role audiences; tiers are not "holders".
/// </summary>
public class PermissionHolders(IApplicationDbContext db)
{
    /// <summary>The catalogue roles of the org's type that grant <paramref name="permission"/>; empty if the feature is off.</summary>
    public async Task<IReadOnlyList<Guid>> RolesGrantingAsync(Guid orgId, string permission, CancellationToken cancellationToken = default)
    {
        var type = await TypeOfAsync(orgId, cancellationToken);
        if (type is null || !type.IsEnabled(Permissions.FeatureOf[permission]))
        {
            return [];
        }

        var roles = await db.RoleDefinitions.AsNoTracking().Where(r => r.OrgTypeId == type.Id).ToListAsync(cancellationToken);
        return [.. roles.Where(r => r.Permissions.Contains(permission)).Select(r => r.Id)];
    }

    /// <summary>Profiles of the org's members who hold <paramref name="permission"/> by role.</summary>
    public async Task<IReadOnlyList<Guid>> MembersWithAsync(Guid orgId, string permission, CancellationToken cancellationToken = default)
    {
        var type = await TypeOfAsync(orgId, cancellationToken);
        if (type is null || !type.IsEnabled(Permissions.FeatureOf[permission]))
        {
            return [];
        }

        if (type.MemberPermissions.Contains(permission))
        {
            return await db.OrgMemberships.AsNoTracking().Where(m => m.OrganizationId == orgId).Select(m => m.ProfileId).ToListAsync(cancellationToken);
        }

        var roleIds = await RolesGrantingAsync(orgId, permission, cancellationToken);
        return await db.OrgRoleAssignments.AsNoTracking()
            .Where(a => a.OrganizationId == orgId && roleIds.Contains(a.RoleDefinitionId))
            .Select(a => a.ProfileId).Distinct().ToListAsync(cancellationToken);
    }

    /// <summary>Org Leads of the org and Portfolio Leads of its portfolio: who hears that a workspace needs a new owner (D12).</summary>
    public async Task<IReadOnlyList<Guid>> LeadersOfAsync(Guid orgId, CancellationToken cancellationToken = default)
    {
        var portfolioId = await db.Organizations.AsNoTracking().Where(o => o.Id == orgId).Select(o => o.PortfolioId).SingleOrDefaultAsync(cancellationToken);
        var orgLeads = await db.OrgMemberships.AsNoTracking().Where(m => m.OrganizationId == orgId && m.IsOrgLead).Select(m => m.ProfileId).ToListAsync(cancellationToken);
        var portfolioLeads = await db.PortfolioLeads.AsNoTracking().Where(l => l.PortfolioId == portfolioId).Select(l => l.ProfileId).ToListAsync(cancellationToken);
        return [.. orgLeads.Concat(portfolioLeads).Distinct()];
    }

    private async Task<OrgType?> TypeOfAsync(Guid orgId, CancellationToken cancellationToken) =>
        await db.Organizations.AsNoTracking().Where(o => o.Id == orgId)
            .Join(db.OrgTypes, o => o.OrgTypeId, t => t.Id, (o, t) => t)
            .SingleOrDefaultAsync(cancellationToken);
}
