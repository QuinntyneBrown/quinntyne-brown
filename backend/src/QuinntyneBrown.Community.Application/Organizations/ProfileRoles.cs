using QuinntyneBrown.Community.Application.Common;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Organizations;

/// <summary>
/// The roles people hold, for display in profiles, People, the team list and the admin pages: System Admin, Portfolio
/// Lead, Org Lead and catalogue roles per org (limited to <c>orgIds</c> when given), and cross-org roles.
/// </summary>
public class ProfileRoles(IApplicationDbContext db)
{
    public async Task<IReadOnlyDictionary<Guid, IReadOnlyList<RoleDto>>> ForAsync(
        IReadOnlyCollection<Guid> profileIds, IReadOnlyCollection<Guid>? orgIds = null, CancellationToken cancellationToken = default)
    {
        var ids = profileIds.Distinct().ToList();
        var admins = await db.Profiles.AsNoTracking().Where(p => ids.Contains(p.Id) && p.IsSystemAdmin).Select(p => p.Id).ToListAsync(cancellationToken);
        var portfolioLeads = await db.PortfolioLeads.AsNoTracking().Where(l => ids.Contains(l.ProfileId)).Select(l => l.ProfileId).ToListAsync(cancellationToken);
        var orgNames = await db.Organizations.AsNoTracking().ToDictionaryAsync(o => o.Id, o => o.Name, cancellationToken);
        var leads = await db.OrgMemberships.AsNoTracking().Where(m => ids.Contains(m.ProfileId) && m.IsOrgLead)
            .Select(m => new { m.ProfileId, m.OrganizationId }).ToListAsync(cancellationToken);
        var assignments = await db.OrgRoleAssignments.AsNoTracking().Where(a => ids.Contains(a.ProfileId))
            .Join(db.RoleDefinitions, a => a.RoleDefinitionId, r => r.Id, (a, r) => new { a.ProfileId, a.OrganizationId, r.Key, r.Name, r.SortOrder })
            .ToListAsync(cancellationToken);
        var crossOrg = await db.CrossOrgAssignments.AsNoTracking().Where(a => ids.Contains(a.ProfileId))
            .Join(db.CrossOrgRoles, a => a.CrossOrgRoleId, r => r.Id, (a, r) => new { a.ProfileId, r.Key, r.Name })
            .ToListAsync(cancellationToken);

        bool InScope(Guid orgId) => orgIds is null || orgIds.Contains(orgId);
        var result = new Dictionary<Guid, IReadOnlyList<RoleDto>>();
        foreach (var id in ids)
        {
            var roles = new List<RoleDto>();
            if (admins.Contains(id))
            {
                roles.Add(new(RoleKeys.SystemAdmin, RoleKeys.NameOf(RoleKeys.SystemAdmin), "tier"));
            }

            if (portfolioLeads.Contains(id))
            {
                roles.Add(new(RoleKeys.PortfolioLead, RoleKeys.NameOf(RoleKeys.PortfolioLead), "tier"));
            }

            roles.AddRange(leads.Where(l => l.ProfileId == id && InScope(l.OrganizationId))
                .Select(l => new RoleDto(RoleKeys.OrgLead, RoleKeys.NameOf(RoleKeys.OrgLead), "tier", l.OrganizationId, orgNames.GetValueOrDefault(l.OrganizationId))));
            roles.AddRange(assignments.Where(a => a.ProfileId == id && InScope(a.OrganizationId)).OrderBy(a => a.SortOrder)
                .Select(a => new RoleDto(a.Key, a.Name, "catalogue", a.OrganizationId, orgNames.GetValueOrDefault(a.OrganizationId))));
            roles.AddRange(crossOrg.Where(c => c.ProfileId == id).OrderBy(c => c.Name).Select(c => new RoleDto(c.Key, c.Name, "crossOrg")));
            result[id] = roles;
        }

        return result;
    }

    public async Task<IReadOnlyList<RoleDto>> ForAsync(Guid profileId, IReadOnlyCollection<Guid>? orgIds = null, CancellationToken cancellationToken = default) =>
        (await ForAsync([profileId], orgIds, cancellationToken))[profileId];
}
