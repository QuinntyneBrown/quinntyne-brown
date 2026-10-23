using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Domain.Profiles;

namespace QuinntyneBrown.Community.Application.Organizations;

/// <summary>
/// Who may see a profile (D9, ADR 0034, L2-140): its owner, System Admin, and anyone who covers an org the profile is a
/// member of. The one predicate for People, search, pickers, mentions and profile pages.
/// </summary>
public static class ProfileVisibility
{
    public static IQueryable<Profile> WhereVisibleTo(this IQueryable<Profile> profiles, IApplicationDbContext db, CallerAccess access)
    {
        if (access.IsSystemAdmin)
        {
            return profiles;
        }

        var self = access.ProfileId ?? Guid.Empty;
        var covered = access.Orgs.Keys.ToList();
        return profiles.Where(p => p.Id == self || db.OrgMemberships.Any(m => m.ProfileId == p.Id && covered.Contains(m.OrganizationId)));
    }

    /// <summary>Profiles visible to the caller that are members of one of <paramref name="orgIds"/>.</summary>
    public static IQueryable<Profile> InOrgs(this IQueryable<Profile> profiles, IApplicationDbContext db, IReadOnlyCollection<Guid> orgIds)
    {
        var ids = orgIds.ToList();
        return profiles.Where(p => db.OrgMemberships.Any(m => m.ProfileId == p.Id && ids.Contains(m.OrganizationId)));
    }
}
