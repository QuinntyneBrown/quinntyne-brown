namespace QuinntyneBrown.Community.Domain.Organizations;

/// <summary>
/// A person no longer holds <c>workspaces.create</c> in an org (they lost a role or left it), so their workspaces
/// there may need a new owner (D12). Replaces the City Lead-specific event.
/// </summary>
public record WorkspaceCreatorPermissionLost(Guid ProfileId, Guid OrganizationId);
