using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Domain.Agile;
using QuinntyneBrown.Community.Domain.Notifications;
using QuinntyneBrown.Community.Domain.Organizations;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Agile;

/// <summary>An archived item on the settings page, ready to restore (L2-037 AC1).</summary>
public record ArchivedItemDto(Guid Id, string Kind, string Title, DateTimeOffset ArchivedAt, string ArchivedByName);

public record ReassignOwnerCommand(Guid? OwnerId);

public class ReassignOwnerValidator : AbstractValidator<ReassignOwnerCommand>
{
    public ReassignOwnerValidator()
    {
        RuleFor(x => x.OwnerId).NotNull().WithMessage("Choose who will own this workspace.");
    }
}

/// <summary>
/// Archives and restores workspaces and work items, and reassigns ownership (L2-037). Archive is an owner action;
/// System Admin may do it too and is audited (ADR 0011). An archived workspace stays hidden from everyone else.
/// </summary>
public class ArchiveHandler(IApplicationDbContext db, WorkspaceAccessPolicy policy, WorkEligibility eligibility, ProfileRoles profileRoles, TimeProvider time)
{
    public const string NotCityLeadMessage = "Choose someone who can create workspaces in this organization.";

    public Task<Result> ArchiveWorkspaceAsync(Guid workspaceId, CancellationToken cancellationToken = default) =>
        SetWorkspaceArchivedAsync(workspaceId, archive: true, cancellationToken);

    public Task<Result> RestoreWorkspaceAsync(Guid workspaceId, CancellationToken cancellationToken = default) =>
        SetWorkspaceArchivedAsync(workspaceId, archive: false, cancellationToken);

    public Task<Result> ArchiveItemAsync(Guid itemId, CancellationToken cancellationToken = default) =>
        SetItemArchivedAsync(itemId, archive: true, cancellationToken);

    public Task<Result> RestoreItemAsync(Guid itemId, CancellationToken cancellationToken = default) =>
        SetItemArchivedAsync(itemId, archive: false, cancellationToken);

    /// <summary>Archived items whose parent is not archived, newest first: restoring one brings back what was archived with it.</summary>
    public async Task<(Result Result, IReadOnlyList<ArchivedItemDto>? Items)> ArchivedItemsAsync(Guid workspaceId, CancellationToken cancellationToken = default)
    {
        var (_, _, refusal) = await policy.AuthorizeAsync(workspaceId, manage: true, cancellationToken);
        if (refusal is not null)
        {
            return (refusal, null);
        }

        var archived = await db.WorkItems.IgnoreQueryFilters().AsNoTracking()
            .Where(i => i.WorkspaceId == workspaceId && i.IsArchived)
            .ToListAsync(cancellationToken);
        var archivedIds = archived.Select(i => i.Id).ToHashSet();
        var roots = archived.Where(i => i.ParentId is not { } p || !archivedIds.Contains(p)).ToList();
        var byIds = roots.Select(i => i.ArchivedById).OfType<Guid>().Distinct().ToList();
        var names = await db.Profiles.AsNoTracking().Where(p => byIds.Contains(p.Id)).ToDictionaryAsync(p => p.Id, p => p.Name, cancellationToken);
        return (Result.Ok(), [.. roots
            .OrderByDescending(i => i.ArchivedAt)
            .ThenBy(i => i.Title)
            .Select(i => new ArchivedItemDto(
                i.Id,
                i.Kind.ToString(),
                i.Title,
                i.ArchivedAt ?? DateTimeOffset.MinValue,
                i.ArchivedById is { } by ? names.GetValueOrDefault(by) ?? "A former member" : "A former member"))]);
    }

    /// <summary>People who could take the workspace over (<c>workspaces.create</c> holders and Org Leads), for its administrators.</summary>
    public async Task<(Result Result, IReadOnlyList<MemberCandidateDto>? Candidates)> OwnerCandidatesAsync(Guid workspaceId, CancellationToken cancellationToken = default)
    {
        var (workspace, _, refusal) = await AuthorizeAdminAsync(workspaceId, cancellationToken);
        if (refusal is not null)
        {
            return (refusal, null);
        }

        var ids = await eligibility.OwnerCandidatesAsync(workspace.OrganizationId, cancellationToken);
        var leads = await db.Profiles.AsNoTracking()
            .Where(p => !p.IsSuspended && p.Id != workspace.OwnerId && ids.Contains(p.Id))
            .OrderBy(p => p.Name)
            .ToListAsync(cancellationToken);
        var roles = await profileRoles.ForAsync([.. leads.Select(p => p.Id)], [workspace.OrganizationId], cancellationToken);
        return (Result.Ok(), [.. leads.Select(p => new MemberCandidateDto(p.Id, p.Name, [.. roles[p.Id].Select(r => r.Name)]))]);
    }

    /// <summary>The org's Org Lead, the Portfolio Lead or a System Admin gives the workspace to another eligible owner; always audited (L2-146 AC4).</summary>
    public async Task<Result> ReassignOwnerAsync(Guid workspaceId, ReassignOwnerCommand command, CancellationToken cancellationToken = default)
    {
        var (workspace, caller, refusal) = await AuthorizeAdminAsync(workspaceId, cancellationToken);
        if (refusal is not null)
        {
            return refusal;
        }

        var owner = await db.Profiles.SingleOrDefaultAsync(p => p.Id == command.OwnerId, cancellationToken);
        if (owner is null || owner.IsSuspended || !await eligibility.CanOwnAsync(owner.Id, workspace.OrganizationId, cancellationToken))
        {
            return Result.Invalid("OwnerId", NotCityLeadMessage);
        }

        var before = workspace.OwnerId;
        workspace.ReassignOwner(owner, canOwn: true, time.GetUtcNow());
        policy.Audit(caller, "workspace.owner.reassigned", "Workspace", workspace.Id, new { OwnerId = before }, new { workspace.OwnerId }, workspace.OrganizationId);
        await db.SaveChangesAsync(cancellationToken);
        return Result.Ok();
    }

    private async Task<(Workspace Workspace, WorkspaceCaller Caller, Result? Refusal)> AuthorizeAdminAsync(Guid workspaceId, CancellationToken cancellationToken)
    {
        var (workspace, caller) = await policy.LoadAsync(workspaceId, cancellationToken);
        return workspace is null || !caller.CanRead ? (null!, caller, Result.NotFound())
            : !policy.AdministersOrg(workspace.OrganizationId) ? (null!, caller, Result.Forbidden())
            : (workspace, caller, null);
    }

    private async Task<Result> SetWorkspaceArchivedAsync(Guid workspaceId, bool archive, CancellationToken cancellationToken)
    {
        var (workspace, caller, refusal) = await policy.AuthorizeAsync(workspaceId, manage: true, cancellationToken, includeArchived: true);
        if (refusal is not null)
        {
            // Only the owner and System Admin know an archived workspace exists.
            return workspace is { IsArchived: true } ? Result.NotFound() : refusal;
        }

        if (workspace.IsArchived == archive)
        {
            return Result.Conflict(archive ? "This workspace is already archived." : "This workspace isn’t archived.");
        }

        if (archive)
        {
            workspace.Archive();
        }
        else
        {
            workspace.Restore();
        }

        policy.AuditOverride(caller, archive ? "workspace.archived" : "workspace.restored", "Workspace", workspace.Id, new { IsArchived = !archive }, new { workspace.IsArchived });
        await db.SaveChangesAsync(cancellationToken);
        return Result.Ok();
    }

    private async Task<Result> SetItemArchivedAsync(Guid itemId, bool archive, CancellationToken cancellationToken)
    {
        var items = db.WorkItems.IgnoreQueryFilters();
        var item = await items.SingleOrDefaultAsync(i => i.Id == itemId, cancellationToken);
        if (item is null)
        {
            return Result.NotFound();
        }

        var (_, caller, refusal) = await policy.AuthorizeAsync(item.WorkspaceId, manage: true, cancellationToken);
        if (refusal is not null)
        {
            return refusal;
        }

        if (item.IsArchived == archive)
        {
            return Result.Conflict(archive ? "This item is already archived." : "This item isn’t archived.");
        }

        var workspaceItems = await items.Where(i => i.WorkspaceId == item.WorkspaceId).ToListAsync(cancellationToken);
        if (archive)
        {
            item.Archive(workspaceItems, caller.ProfileId, time.GetUtcNow());
        }
        else
        {
            item.Restore(workspaceItems);
        }

        policy.AuditOverride(caller, archive ? "workitem.archived" : "workitem.restored", "WorkItem", item.Id, new { IsArchived = !archive }, new { item.IsArchived });
        await db.SaveChangesAsync(cancellationToken);
        return Result.Ok();
    }
}

/// <summary>
/// When an owner loses the City Lead role, tells every System Admin which of their workspaces needs a new owner
/// (L2-037 AC2). The actor is a System Admin too and is told as well: they are the one who can reassign it.
/// </summary>
/// <summary>
/// When someone loses <c>workspaces.create</c> in an org (D12), tells the org's Org Leads and the Portfolio Lead that
/// each workspace they own there needs a new owner.
/// </summary>
public class WorkspaceCreatorPermissionLostHandler(IApplicationDbContext db, PermissionHolders holders, AgileNotifier notifier)
{
    public async Task HandleAsync(WorkspaceCreatorPermissionLost lost, CancellationToken cancellationToken = default)
    {
        var workspaces = await db.Workspaces.AsNoTracking()
            .Where(w => w.OwnerId == lost.ProfileId && w.OrganizationId == lost.OrganizationId).ToListAsync(cancellationToken);
        if (workspaces.Count == 0)
        {
            return;
        }

        var name = await db.Profiles.Where(p => p.Id == lost.ProfileId).Select(p => p.Name).SingleAsync(cancellationToken);
        var leaders = await holders.LeadersOfAsync(lost.OrganizationId, cancellationToken);
        var active = await db.Profiles.AsNoTracking().Where(p => leaders.Contains(p.Id) && !p.IsSuspended && p.Id != lost.ProfileId)
            .Select(p => p.Id).ToListAsync(cancellationToken);
        foreach (var workspace in workspaces)
        {
            var title = $"{name} can no longer own workspaces but owns {workspace.Name}";
            foreach (var leader in active)
            {
                notifier.Notify(
                    Guid.Empty,
                    leader,
                    NotificationKind.WorkspaceOwnerLostCityLead,
                    title,
                    $"/workspaces/{workspace.Id}/settings",
                    $"{workspace.Name} needs a new owner",
                    $"{title}. A workspace owner must be able to create workspaces in its organization, so choose a new owner.\n\nOpen the workspace settings:",
                    lost.OrganizationId);
            }
        }
    }

    public Task QueueEmailsAsync(CancellationToken cancellationToken = default) => notifier.QueueEmailsAsync(cancellationToken);
}
