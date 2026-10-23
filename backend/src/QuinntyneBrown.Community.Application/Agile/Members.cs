using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Domain.Agile;
using QuinntyneBrown.Community.Domain.Organizations;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Agile;

public record AddWorkspaceMembersCommand(IReadOnlyList<Guid>? ProfileIds);

public class AddWorkspaceMembersValidator : AbstractValidator<AddWorkspaceMembersCommand>
{
    public AddWorkspaceMembersValidator()
    {
        RuleFor(x => x.ProfileIds).Must(ids => ids is { Count: > 0 }).WithMessage("Choose at least one person.");
    }
}

public record RenameWorkspaceCommand(string? Name);

public class RenameWorkspaceValidator : AbstractValidator<RenameWorkspaceCommand>
{
    public RenameWorkspaceValidator()
    {
        RuleFor(x => x.Name).Cascade(CascadeMode.Stop)
            .Must(name => !string.IsNullOrWhiteSpace(name)).WithMessage("Give the workspace a name your team will recognise.")
            .Must(name => name!.Trim().Length <= CreateWorkspaceValidator.MaxName)
            .WithMessage($"Use {CreateWorkspaceValidator.MaxName} characters or fewer for the name.");
    }
}

public record SwitchMethodCommand(string? Method);

public class SwitchMethodValidator : AbstractValidator<SwitchMethodCommand>
{
    public SwitchMethodValidator()
    {
        RuleFor(x => x.Method)
            .Must(method => Enum.TryParse<WorkspaceMethod>(method, ignoreCase: false, out var m) && Enum.IsDefined(m))
            .WithMessage("Choose Scrum or Kanban.");
    }
}

/// <summary>The owner's settings: members, candidates, the name and the method (L2-031 AC2, AC4, AC8, L2-036, L2-051).</summary>
public class WorkspaceSettingsHandler(
    IApplicationDbContext db,
    ICurrentUser current,
    WorkspaceAccessPolicy policy,
    WorkspaceMembership membership,
    WorkEligibility eligibility,
    ProfileRoles profileRoles,
    AgileNotifier notifier)
{
    public async Task<Result> AddMembersAsync(Guid workspaceId, AddWorkspaceMembersCommand command, CancellationToken cancellationToken = default)
    {
        var (workspace, caller, refusal) = await policy.AuthorizeAsync(workspaceId, manage: true, cancellationToken);
        if (refusal is not null)
        {
            return refusal;
        }

        var added = await membership.AddMembersAsync(workspace, caller.ProfileId, command.ProfileIds!, cancellationToken);
        if (added is null)
        {
            return Result.Invalid("ProfileIds", WorkspacesHandler.NotOnTeamMessage);
        }

        policy.AuditOverride(caller, "workspace.member.added", "Workspace", workspace.Id, null, new { ProfileIds = added });
        await notifier.QueueEmailsAsync(cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        return Result.Ok();
    }

    /// <summary>Removes a member; their assigned items in the workspace become unassigned in the same unit of work.</summary>
    public async Task<Result> RemoveMemberAsync(Guid workspaceId, Guid profileId, CancellationToken cancellationToken = default)
    {
        var (workspace, caller, refusal) = await policy.AuthorizeAsync(workspaceId, manage: true, cancellationToken);
        if (refusal is not null)
        {
            return refusal;
        }

        if (profileId == workspace.OwnerId)
        {
            return Result.Conflict("The owner can’t be removed from their workspace.");
        }

        if (!workspace.IsMember(profileId))
        {
            return Result.NotFound();
        }

        var assigned = await db.WorkItems.IgnoreQueryFilters()
            .Where(i => i.WorkspaceId == workspaceId && i.AssigneeId == profileId)
            .ToListAsync(cancellationToken);
        workspace.RemoveMember(profileId, assigned);
        policy.AuditOverride(caller, "workspace.member.removed", "Workspace", workspace.Id, new { ProfileId = profileId }, null);
        await db.SaveChangesAsync(cancellationToken);
        return Result.Ok();
    }

    public async Task<Result> RenameAsync(Guid workspaceId, RenameWorkspaceCommand command, CancellationToken cancellationToken = default)
    {
        var (workspace, caller, refusal) = await policy.AuthorizeAsync(workspaceId, manage: true, cancellationToken);
        if (refusal is not null)
        {
            return refusal;
        }

        var before = workspace.Name;
        workspace.Rename(command.Name!.Trim());
        policy.AuditOverride(caller, "workspace.renamed", "Workspace", workspace.Id, new { Name = before }, new { workspace.Name });
        await db.SaveChangesAsync(cancellationToken);
        return Result.Ok();
    }

    /// <summary>
    /// Switches Scrum and Kanban in one unit of work (L2-036): to Kanban every open sprint closes and items keep
    /// their status; to Scrum every story that is not Done goes to the backlog.
    /// </summary>
    public async Task<Result> SwitchMethodAsync(Guid workspaceId, SwitchMethodCommand command, CancellationToken cancellationToken = default)
    {
        var (workspace, caller, refusal) = await policy.AuthorizeAsync(workspaceId, manage: true, cancellationToken);
        if (refusal is not null)
        {
            return refusal;
        }

        var target = Enum.Parse<WorkspaceMethod>(command.Method!);
        if (target == workspace.Method)
        {
            return Result.Conflict($"This workspace already uses {target}.");
        }

        var before = workspace.Method;
        var sprints = await db.Sprints.Where(s => s.WorkspaceId == workspaceId).ToListAsync(cancellationToken);
        var stories = await db.WorkItems.IgnoreQueryFilters()
            .Where(i => i.WorkspaceId == workspaceId && i.Kind == WorkItemKind.Story)
            .ToListAsync(cancellationToken);
        workspace.SwitchMethod(target, sprints, stories);
        policy.AuditOverride(caller, "workspace.method.switched", "Workspace", workspace.Id, new { Method = before.ToString() }, new { Method = target.ToString() });
        await db.SaveChangesAsync(cancellationToken);
        return Result.Ok();
    }

    /// <summary>
    /// Profiles that can join (L2-146 AC2): members of the workspace's org holding <c>workspaces.join</c> and holders of a
    /// covering cross-org role with <c>CanJoinWork</c>, not in the workspace yet and not suspended. Without a workspace
    /// (the create dialog) it offers the candidates of the org the workspace will be created in, but the caller.
    /// </summary>
    public async Task<(Result Result, IReadOnlyList<MemberCandidateDto>? Candidates)> CandidatesAsync(
        Guid? workspaceId, CancellationToken cancellationToken = default)
    {
        HashSet<Guid> excluded;
        Guid orgId;
        if (workspaceId is { } id)
        {
            var (workspace, _, refusal) = await policy.AuthorizeAsync(id, manage: true, cancellationToken);
            if (refusal is not null)
            {
                return (refusal, null);
            }

            excluded = [.. workspace.Members.Select(m => m.ProfileId), workspace.OwnerId];
            orgId = workspace.OrganizationId;
        }
        else
        {
            var target = current.Access.TargetFor(Permissions.WorkspacesCreate);
            if (!target.Allowed)
            {
                return (target.Refusal!, null);
            }

            excluded = await policy.CallerProfileIdAsync(cancellationToken) is { } me ? [me] : [];
            orgId = target.OrgId;
        }

        var candidates = await eligibility.CandidatesAsync(orgId, cancellationToken);
        var ids = candidates.Select(c => c.ProfileId).Where(c => !excluded.Contains(c)).ToList();
        var profiles = await db.Profiles.AsNoTracking().Where(p => ids.Contains(p.Id) && !p.IsSuspended).OrderBy(p => p.Name).ToListAsync(cancellationToken);
        var roles = await profileRoles.ForAsync(ids, [orgId], cancellationToken);
        return (Result.Ok(), [.. profiles.Select(p => new MemberCandidateDto(
            p.Id, p.Name, [.. roles[p.Id].Select(r => r.Name)], candidates.Any(c => c.ProfileId == p.Id && c.IsCrossOrg)))]);
    }
}
