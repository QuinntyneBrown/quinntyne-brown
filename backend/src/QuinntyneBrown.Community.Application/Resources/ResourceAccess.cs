using System.Linq.Expressions;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Domain.Organizations;
using QuinntyneBrown.Community.Domain.Resources;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Resources;

/// <summary>
/// Who may add, open and change resources (L2-057, L2-060, L2-062, L2-066, L2-148). Visibility is applied inside every
/// query, against the caller's coverage and roles at request time (ADR 0017, ADR 0039); a resource the caller may not
/// open is not found. Private resources are the owner's and System Admin's only, whatever tier the caller holds.
/// </summary>
public class ResourceAccess(IApplicationDbContext db, ICurrentUser current)
{
    private Guid? _caller;

    public CallerAccess Access => current.Access;

    /// <summary>Holders of <c>resources.create</c> add and own resources; Staff is the deliberate carve-out from read-only.</summary>
    public bool CanContribute => Access.ReadScope(Features.Resources).Any(org => Access.Has(org, Permissions.ResourcesCreate));

    /// <summary>The org a new resource is added to (ADR 0034).</summary>
    public CreateTarget CreateTarget() => Access.TargetFor(Permissions.ResourcesCreate);

    public bool IsSystemAdmin => Access.IsSystemAdmin;

    /// <summary>The caller's profile id, or <see cref="Guid.Empty"/> when there is none.</summary>
    public async Task<Guid> CallerAsync(CancellationToken cancellationToken = default) =>
        _caller ??= current.UserId is { } userId
            ? await db.Users.Where(u => u.Id == userId).Select(u => u.ProfileId).SingleOrDefaultAsync(cancellationToken)
            : Guid.Empty;

    /// <summary>The active resources of the request's scope the caller may open (lists and search).</summary>
    public IQueryable<Resource> Visible(IQueryable<Resource> resources, Guid caller) =>
        VisibleIn(resources, caller, Access.ReadScope(Features.Resources));

    /// <summary>
    /// The active resources of <paramref name="orgs"/> the caller may open: Org-wide, their own, or Shared with them or a
    /// role they hold in the resource's org now. System Admin opens every one.
    /// </summary>
    public IQueryable<Resource> VisibleIn(IQueryable<Resource> resources, Guid caller, IReadOnlyList<Guid> orgs)
    {
        var active = resources.Where(r => r.ArchivedAt == null && orgs.Contains(r.OrganizationId));
        if (IsSystemAdmin)
        {
            return active;
        }

        var heldRole = ShareRoles.HeldIn<Resource>(Access, r => r.OrganizationId, r => r.SharedRoles.Select(x => x.RoleId));
        Expression<Func<Resource, bool>> open = r =>
            r.Visibility == ResourceVisibility.Global
            || r.OwnerId == caller
            || (r.Visibility == ResourceVisibility.Shared && r.SharedMembers.Any(m => m.ProfileId == caller));
        Expression<Func<Resource, bool>> shared = r => r.Visibility == ResourceVisibility.Shared;
        return active.Where(ShareRoles.Or(open, ShareRoles.And(shared, heldRole)));
    }

    /// <summary>One resource the caller may open, in any org they cover; archived ones only for their owner and System Admin (L2-063 AC2).</summary>
    public async Task<Resource?> FindAsync(Guid id, Guid caller, CancellationToken cancellationToken = default)
    {
        var covered = Access.CoveredWith(Features.Resources);
        var visible = await VisibleIn(db.Resources, caller, covered).SingleOrDefaultAsync(r => r.Id == id, cancellationToken);
        if (visible is not null)
        {
            return visible;
        }

        var archived = await db.Resources.SingleOrDefaultAsync(r => r.Id == id && r.ArchivedAt != null && covered.Contains(r.OrganizationId), cancellationToken);
        return archived is not null && (archived.OwnerId == caller || IsSystemAdmin) ? archived : null;
    }

    public bool CanChange(Resource resource, Guid caller) => resource.OwnerId == caller || IsSystemAdmin;

    /// <summary>A change made by a System Admin to a resource they do not own: it is written to the audit log.</summary>
    public bool IsOverride(Resource resource, Guid caller) => resource.OwnerId != caller && IsSystemAdmin;

    /// <summary>Whether the caller holds a role the resource is shared with, in its org.</summary>
    public bool HoldsSharedRole(Resource resource) =>
        Access.Orgs.TryGetValue(resource.OrganizationId, out var org)
        && resource.SharedRoles.Any(x => org.RoleIds.Contains(x.RoleId) || org.CrossOrgRoleIds.Contains(x.RoleId));
}
