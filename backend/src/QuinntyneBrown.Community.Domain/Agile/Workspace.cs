using QuinntyneBrown.Community.Domain.Profiles;

namespace QuinntyneBrown.Community.Domain.Agile;

public class Workspace
{
    private readonly List<WorkspaceMember> _members = [];

    private Workspace() { }

    public Workspace(Guid organizationId, string name, WorkspaceMethod method, Guid ownerId)
    {
        Id = Guid.NewGuid();
        OrganizationId = organizationId;
        Rename(name);
        Method = method;
        OwnerId = ownerId;
    }

    public Guid Id { get; private set; }

    /// <summary>The org that owns this record (ADR 0034).</summary>
    public Guid OrganizationId { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public WorkspaceMethod Method { get; private set; }

    public Guid OwnerId { get; private set; }

    public bool IsArchived { get; private set; }

    public IReadOnlyCollection<WorkspaceMember> Members => _members;

    public void Rename(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        Name = name;
    }

    public bool IsMember(Guid profileId) => profileId == OwnerId || _members.Any(m => m.ProfileId == profileId);

    /// <param name="eligible">Whether the profile may join the workspace's org's work (D12), decided by the caller.</param>
    public void AddMember(Profile profile, bool eligible, DateTimeOffset now)
    {
        if (!eligible)
        {
            throw new InvalidOperationException("Only a profile who may join the org's workspaces can be added.");
        }

        if (IsMember(profile.Id))
        {
            throw new InvalidOperationException("The profile is already a member of the workspace.");
        }

        _members.Add(new WorkspaceMember(Id, profile.Id, now));
    }

    public void RemoveMember(Guid profileId, IEnumerable<WorkItem> items)
    {
        var member = _members.FirstOrDefault(m => m.ProfileId == profileId)
            ?? throw new InvalidOperationException("The profile is not a removable member of the workspace.");

        _members.Remove(member);
        foreach (var item in items.Where(i => i.WorkspaceId == Id && i.AssigneeId == profileId))
        {
            item.Unassign();
        }
    }

    public void StartSprint(Sprint sprint, IEnumerable<Sprint> sprints, IEnumerable<WorkItem> stories)
    {
        if (Method != WorkspaceMethod.Scrum)
        {
            throw new InvalidOperationException("Sprints run only in a Scrum workspace.");
        }

        if (sprint.WorkspaceId != Id || sprint.State != SprintState.Planned)
        {
            throw new InvalidOperationException("Only a planned sprint of this workspace can start.");
        }

        var storyList = stories.ToList();
        foreach (var active in sprints.Where(s => s.WorkspaceId == Id && s.State == SprintState.Active))
        {
            active.Close(storyList);
        }

        sprint.Start();
    }

    public void SwitchMethod(WorkspaceMethod target, IEnumerable<Sprint> sprints, IEnumerable<WorkItem> stories)
    {
        if (target == Method)
        {
            throw new InvalidOperationException($"The workspace already uses {target}.");
        }

        var storyList = stories.Where(s => s.WorkspaceId == Id).ToList();
        if (target == WorkspaceMethod.Kanban)
        {
            foreach (var open in sprints.Where(s => s.WorkspaceId == Id && s.State != SprintState.Closed))
            {
                open.Close(storyList);
            }
        }
        else
        {
            foreach (var story in storyList.Where(s => s.Kind == WorkItemKind.Story && s.Status != WorkItemStatus.Done))
            {
                story.ReturnToBacklog();
            }
        }

        Method = target;
    }

    public void Archive()
    {
        if (IsArchived)
        {
            throw new InvalidOperationException("The workspace is already archived.");
        }

        IsArchived = true;
    }

    public void Restore()
    {
        if (!IsArchived)
        {
            throw new InvalidOperationException("The workspace is not archived.");
        }

        IsArchived = false;
    }

    /// <summary>
    /// Gives the workspace to someone who may own one in its org (L2-037 AC2, L2-146 AC4). The former owner stays on
    /// as a member, even if no longer eligible, so they keep their work; the new owner is no longer listed as a member.
    /// </summary>
    /// <param name="canOwn">Whether the new owner holds <c>workspaces.create</c> or leads the org, decided by the caller.</param>
    public void ReassignOwner(Profile newOwner, bool canOwn, DateTimeOffset now)
    {
        if (!canOwn)
        {
            throw new InvalidOperationException("A workspace owner must be able to create workspaces in its org.");
        }

        if (newOwner.Id == OwnerId)
        {
            return;
        }

        _members.RemoveAll(m => m.ProfileId == newOwner.Id);
        _members.Add(new WorkspaceMember(Id, OwnerId, now));
        OwnerId = newOwner.Id;
    }
}
