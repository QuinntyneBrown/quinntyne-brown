using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Agile;

/// <summary>A work item assigned to the caller, with the workspace and org it lives in.</summary>
public record MyWorkItemDto(Guid Id, string Title, string Kind, string Status, Guid WorkspaceId, string WorkspaceName, OrgLabel? Organization);

/// <summary>
/// My work (L2-145 AC3): the open items assigned to the caller in every workspace they can read, in the request's org
/// or, under "All orgs", across every covered org.
/// </summary>
public class MyWorkHandler(IApplicationDbContext db, ICurrentUser current, WorkspaceAccessPolicy policy)
{
    public async Task<IReadOnlyList<MyWorkItemDto>> ListAsync(CancellationToken cancellationToken = default)
    {
        if (await policy.CallerProfileIdAsync(cancellationToken) is not { } caller)
        {
            return [];
        }

        var workspaces = policy.Visible(db.Workspaces.AsNoTracking(), caller).Where(w => !w.IsArchived);
        var rows = await db.WorkItems.AsNoTracking()
            .Where(i => i.AssigneeId == caller && !i.IsArchived)
            .Join(workspaces, i => i.WorkspaceId, w => w.Id, (i, w) => new { Item = i, w.Name, w.OrganizationId })
            .ToListAsync(cancellationToken);
        return [.. rows
            .OrderBy(r => r.Item.IsDone)
            .ThenBy(r => r.Name)
            .ThenBy(r => r.Item.Title)
            .Select(r => new MyWorkItemDto(
                r.Item.Id, r.Item.Title, r.Item.Kind.ToString(), r.Item.Status.ToString(), r.Item.WorkspaceId, r.Name,
                OrgLabel.Of(current.Access.Orgs, r.OrganizationId)))];
    }
}
