using QuinntyneBrown.Community.Application.Admin;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Application.Profiles;
using QuinntyneBrown.Community.Domain.Agile;
using QuinntyneBrown.Community.Domain.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Agile;

/// <summary>How the caller relates to one workspace (ADR 0011), from least to most access.</summary>
public enum WorkspaceAccess
{
    Outsider,
    /// <summary>A holder of <c>workspaces.readAll</c> in the workspace's org (Staff): read-only.</summary>
    Staff,
    /// <summary>
    /// The org's Org Lead, the Portfolio Lead or a System Admin who does not own the workspace, member or not: every
    /// write is an audited override (D12).
    /// </summary>
    Admin,
    Member,
    Owner,
}

public record WorkspaceCaller(Guid ProfileId, WorkspaceAccess Access)
{
    public bool CanRead => Access != WorkspaceAccess.Outsider;

    /// <summary>Stories, tasks, comments, card moves, sprint planning and Planning Poker.</summary>
    public bool CanEdit => Access is WorkspaceAccess.Member or WorkspaceAccess.Owner or WorkspaceAccess.Admin;

    /// <summary>Initiatives and epics, settings, members, sprints, method and archive.</summary>
    public bool CanManage => Access is WorkspaceAccess.Owner or WorkspaceAccess.Admin;

    public bool IsOverride => Access == WorkspaceAccess.Admin;

    /// <summary>404 for an outsider, 403 for a reader without the right, otherwise null.</summary>
    public Result? Refuse(bool manage) =>
        !CanRead ? Result.NotFound()
            : (manage ? CanManage : CanEdit) ? null
            : Result.Forbidden();
}

/// <summary>
/// Decides who may read and change a workspace and everything in it (L2-031, L2-042, ADR 0011).
/// Every agile handler and the hub ask it first; lists use <see cref="Visible"/> so the filter runs in the database.
/// </summary>
public class WorkspaceAccessPolicy(IApplicationDbContext db, ICurrentUser current, ProfileAccess profiles, IAuditLog audit)
{
    private CallerAccess Access => current.Access;

    public bool IsSystemAdmin => Access.IsSystemAdmin;

    /// <summary>Whether the caller is "Admin" for workspaces of the org: its Org Lead, the Portfolio Lead or a System Admin (D12).</summary>
    public bool AdministersOrg(Guid orgId) => Access.LeadsOrg(orgId) && Access.Covers(orgId, Features.Agile);

    public Task<Guid?> CallerProfileIdAsync(CancellationToken cancellationToken = default) => profiles.CallerProfileIdAsync(cancellationToken);

    /// <summary>
    /// Owner first; then the org's administrators, even when they also belong to the workspace, so every action they
    /// take outside their own workspace succeeds and is audited (L2-031 AC7); then member, read-all and outsider. A
    /// workspace of an org the caller does not cover, or with agile switched off, is always outsider (404).
    /// </summary>
    public WorkspaceAccess Classify(Workspace workspace, Guid? caller) =>
        !Access.Covers(workspace.OrganizationId, Features.Agile) ? WorkspaceAccess.Outsider
            : caller is { } me && workspace.OwnerId == me ? WorkspaceAccess.Owner
            : AdministersOrg(workspace.OrganizationId) ? WorkspaceAccess.Admin
            : caller is { } m && workspace.Members.Any(x => x.ProfileId == m) ? WorkspaceAccess.Member
            : Access.Has(workspace.OrganizationId, Permissions.WorkspacesReadAll) ? WorkspaceAccess.Staff
            : WorkspaceAccess.Outsider;

    /// <summary>The workspaces the caller may read, in the request's scope (ADR 0034).</summary>
    public IQueryable<Workspace> Visible(IQueryable<Workspace> workspaces, Guid? caller)
    {
        var scope = Access.ReadScope(Features.Agile);
        var readAll = scope.Where(org => AdministersOrg(org) || Access.Has(org, Permissions.WorkspacesReadAll)).ToList();
        var me = caller ?? Guid.Empty;
        return workspaces.Where(w => scope.Contains(w.OrganizationId)
            && (readAll.Contains(w.OrganizationId) || w.OwnerId == me || w.Members.Any(m => m.ProfileId == me)));
    }

    /// <summary>
    /// Loads a workspace (tracked) with the caller's access. The workspace is null when it does not exist or, unless
    /// <paramref name="includeArchived"/>, when it is archived.
    /// </summary>
    public async Task<(Workspace? Workspace, WorkspaceCaller Caller)> LoadAsync(
        Guid workspaceId, CancellationToken cancellationToken = default, bool includeArchived = false)
    {
        var caller = await CallerProfileIdAsync(cancellationToken);
        var workspaces = includeArchived ? db.Workspaces.IgnoreQueryFilters() : db.Workspaces;
        var workspace = await workspaces.SingleOrDefaultAsync(w => w.Id == workspaceId, cancellationToken);
        return workspace is null
            ? (null, new WorkspaceCaller(caller ?? Guid.Empty, WorkspaceAccess.Outsider))
            : (workspace, new WorkspaceCaller(caller ?? Guid.Empty, Classify(workspace, caller)));
    }

    /// <summary>
    /// Loads a workspace for a write: the refusal is 404 when it is missing or the caller may not read it, 403 when
    /// they may read but lack the right (<paramref name="manage"/> for owner actions), otherwise null.
    /// </summary>
    public async Task<(Workspace Workspace, WorkspaceCaller Caller, Result? Refusal)> AuthorizeAsync(
        Guid workspaceId, bool manage, CancellationToken cancellationToken = default, bool includeArchived = false)
    {
        var (workspace, caller) = await LoadAsync(workspaceId, cancellationToken, includeArchived);
        return workspace is null ? (null!, caller, Result.NotFound()) : (workspace, caller, caller.Refuse(manage));
    }

    /// <summary>Records an action only an administrator may take, such as reassigning the owner.</summary>
    public void Audit(WorkspaceCaller caller, string action, string targetType, Guid targetId, object? before, object? after, Guid? organizationId = null) =>
        audit.Record(caller.ProfileId, action, targetType, targetId.ToString(), before, after, organizationId);

    /// <summary>Records an administrator's override (ADR 0011); writes by the owner or a member are not audited.</summary>
    public void AuditOverride(WorkspaceCaller caller, string action, string targetType, Guid targetId, object? before, object? after, Guid? organizationId = null)
    {
        if (caller.IsOverride)
        {
            audit.Record(caller.ProfileId, action, targetType, targetId.ToString(), before, after, organizationId);
        }
    }
}
