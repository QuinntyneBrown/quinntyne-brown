using System.Linq.Expressions;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Domain.Notes;
using QuinntyneBrown.Community.Domain.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Notes;

/// <summary>
/// Who may open and change note pages (L2-092, L2-098, L2-148, ADR 0025, ADR 0039). Visibility is applied inside every
/// query against the caller's coverage and roles at request time; a page the caller may not open is not found. Only the
/// owner changes a page, or a System Admin, whose change is audited. Private pages are the owner's and System Admin's.
/// </summary>
public class NoteAccess(IApplicationDbContext db, ICurrentUser current)
{
    private Guid? _caller;

    public CallerAccess Access => current.Access;

    public bool IsSystemAdmin => Access.IsSystemAdmin;

    /// <summary>The org a new top-level page is created in (ADR 0034).</summary>
    public CreateTarget CreateTarget() => Access.TargetFor(Permissions.NotesCreate);

    /// <summary>The caller's profile id, or <see cref="Guid.Empty"/> when there is none.</summary>
    public async Task<Guid> CallerAsync(CancellationToken cancellationToken = default) =>
        _caller ??= current.UserId is { } userId
            ? await db.Users.Where(u => u.Id == userId).Select(u => u.ProfileId).SingleOrDefaultAsync(cancellationToken)
            : Guid.Empty;

    /// <summary>The active pages of the request's scope the caller may open (lists and search).</summary>
    public IQueryable<NotePage> Visible(IQueryable<NotePage> pages, Guid caller) =>
        VisibleIn(pages, caller, Access.ReadScope(Features.Notes));

    /// <summary>The active pages of any org the caller covers that they may open (by id, links, breadcrumbs).</summary>
    public IQueryable<NotePage> VisibleAnywhere(IQueryable<NotePage> pages, Guid caller) =>
        VisibleIn(pages, caller, Access.CoveredWith(Features.Notes));

    /// <summary>Org-wide pages, their own, or Shared with them or a role they hold in the page's org now.</summary>
    public IQueryable<NotePage> VisibleIn(IQueryable<NotePage> pages, Guid caller, IReadOnlyList<Guid> orgs)
    {
        var active = pages.Where(p => p.ArchivedAt == null && orgs.Contains(p.OrganizationId));
        if (IsSystemAdmin)
        {
            return active;
        }

        var heldRole = ShareRoles.HeldIn<NotePage>(Access, p => p.OrganizationId, p => p.SharedRoles.Select(x => x.RoleId));
        Expression<Func<NotePage, bool>> open = p =>
            p.Visibility == NoteVisibility.Global
            || p.OwnerId == caller
            || (p.Visibility == NoteVisibility.Shared && p.SharedMembers.Any(m => m.ProfileId == caller));
        Expression<Func<NotePage, bool>> shared = p => p.Visibility == NoteVisibility.Shared;
        return active.Where(ShareRoles.Or(open, ShareRoles.And(shared, heldRole)));
    }

    /// <summary>Whether the caller holds one of the roles in the page's org.</summary>
    public bool HoldsAny(Guid orgId, IEnumerable<Guid> roleIds)
    {
        var held = ShareRoles.HeldPerOrg(Access).GetValueOrDefault(orgId);
        return held is not null && roleIds.Any(held.Contains);
    }

    /// <summary>One page the caller may open; archived ones only for their owner and System Admin (L2-095).</summary>
    public async Task<NotePage?> FindAsync(Guid id, Guid caller, CancellationToken cancellationToken = default)
    {
        var visible = await VisibleAnywhere(db.NotePages, caller).SingleOrDefaultAsync(p => p.Id == id, cancellationToken);
        if (visible is not null)
        {
            return visible;
        }

        var covered = Access.CoveredWith(Features.Notes);
        var archived = await db.NotePages.SingleOrDefaultAsync(p => p.Id == id && p.ArchivedAt != null && covered.Contains(p.OrganizationId), cancellationToken);
        return archived is not null && (archived.OwnerId == caller || IsSystemAdmin) ? archived : null;
    }

    public bool CanChange(NotePage page, Guid caller) => page.OwnerId == caller || IsSystemAdmin;

    /// <summary>A System Admin acting on a page they do not own: written to the audit log (L2-098).</summary>
    public bool IsOverride(NotePage page, Guid caller) => page.OwnerId != caller && IsSystemAdmin;

    /// <summary>Refuses a caller whose email is not verified (L2-085, as L2-002 AC3).</summary>
    public async Task<Result?> VerifiedAsync(Guid caller, CancellationToken cancellationToken)
    {
        var verified = await db.Users.Where(u => u.ProfileId == caller).Select(u => u.EmailConfirmed).SingleOrDefaultAsync(cancellationToken);
        return verified ? null : Result.Forbidden("Verify your email before creating pages.");
    }
}
