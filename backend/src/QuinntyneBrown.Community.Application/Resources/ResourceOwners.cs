using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Domain.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Resources;

/// <summary>Who may own resources in an org, and through which role (L2-064).</summary>
public class ResourceOwners(IApplicationDbContext db, AccessResolver resolver)
{
    /// <summary>
    /// The name of the role through which the person may own resources in the org (a catalogue role, a cross-org role or
    /// a tier), or null when they may not (L2-064).
    /// </summary>
    public async Task<string?> OwnerRoleAsync(Guid profileId, Guid orgId, CancellationToken cancellationToken)
    {
        var person = await resolver.ForProfileAsync(profileId, cancellationToken);
        if (!person.Has(orgId, Permissions.ResourcesCreate) || !person.Orgs.TryGetValue(orgId, out var org))
        {
            return null;
        }

        var held = org.RoleIds.Concat(org.CrossOrgRoleIds).ToList();
        var catalogue = await db.RoleDefinitions.AsNoTracking().Where(r => held.Contains(r.Id)).OrderBy(r => r.SortOrder).ToListAsync(cancellationToken);
        if (catalogue.FirstOrDefault(r => r.Permissions.Contains(Permissions.ResourcesCreate)) is { } role)
        {
            return role.Name;
        }

        var crossOrg = await db.CrossOrgRoles.AsNoTracking().Where(r => held.Contains(r.Id)).OrderBy(r => r.Name).ToListAsync(cancellationToken);
        return crossOrg.FirstOrDefault(r => r.Permissions.Contains(Permissions.ResourcesCreate))?.Name
            ?? (person.IsSystemAdmin ? RoleKeys.NameOf(RoleKeys.SystemAdmin)
                : org.IsPortfolioLead ? RoleKeys.NameOf(RoleKeys.PortfolioLead)
                : RoleKeys.NameOf(RoleKeys.OrgLead));
    }

}
