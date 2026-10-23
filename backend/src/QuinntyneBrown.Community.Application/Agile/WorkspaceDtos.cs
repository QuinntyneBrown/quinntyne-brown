namespace QuinntyneBrown.Community.Application.Agile;

/// <summary>A row on the workspaces page (L2-050).</summary>
public record WorkspaceSummaryDto(
    Guid Id,
    string Name,
    string Method,
    Guid OwnerId,
    string OwnerName,
    bool IsOwner,
    string? ActiveSprintName,
    int MemberCount,
    bool IsArchived,
    bool NeedsNewOwner,
    Organizations.OrgLabel? Organization = null);

/// <summary>A workspace member with the work assigned to them, which a removal unassigns (L2-031 AC8).</summary>
/// <param name="Roles">Role names held in the workspace's org.</param>
/// <param name="IsCrossOrg">Joined through a cross-org role rather than as a member of the org (L2-146 AC2).</param>
public record WorkspaceMemberDto(Guid ProfileId, string Name, IReadOnlyList<string> Roles, bool IsOwner, int AssignedStories, int AssignedTasks, bool IsYou, bool IsCrossOrg = false);

/// <summary>
/// One workspace as the caller may see it. <see cref="Access"/> is Owner, Member, Admin or Staff (ADR 0011);
/// <see cref="CanEdit"/> and <see cref="CanManage"/> tell the web app which controls to show.
/// </summary>
public record WorkspaceDto(
    Guid Id,
    string Name,
    string Method,
    Guid OwnerId,
    string OwnerName,
    IReadOnlyList<WorkspaceMemberDto> Members,
    bool IsArchived,
    string Access,
    bool CanEdit,
    bool CanManage,
    bool NeedsNewOwner,
    Organizations.OrgLabel? Organization = null);

/// <summary>A profile that can join (or own) a workspace of the org; <see cref="IsCrossOrg"/> marks cross-org holders.</summary>
public record MemberCandidateDto(Guid ProfileId, string Name, IReadOnlyList<string> Roles, bool IsCrossOrg = false);
