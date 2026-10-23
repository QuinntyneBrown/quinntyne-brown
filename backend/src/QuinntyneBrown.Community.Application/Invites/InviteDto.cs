using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Domain.Invites;
using QuinntyneBrown.Community.Domain.Organizations;

namespace QuinntyneBrown.Community.Application.Invites;

/// <summary>An invite on the invites page (L2-010 AC4); <see cref="PreassignedRole"/> is the catalogue role's key.</summary>
public record InviteDto(
    Guid Id,
    string Email,
    string? PreassignedRole,
    string Status,
    string InvitedByName,
    DateTimeOffset CreatedAt,
    DateTimeOffset ExpiresAt,
    DateTimeOffset? AcceptedAt,
    DateTimeOffset? RevokedAt,
    string? PreassignedRoleName = null,
    OrgLabel? Organization = null)
{
    public static InviteDto From(Invite invite, string invitedByName, DateTimeOffset now, RoleDefinition? role = null, OrgLabel? organization = null) => new(
        invite.Id,
        invite.Email,
        role?.Key,
        invite.Status(now).ToString(),
        invitedByName,
        invite.CreatedAt,
        invite.ExpiresAt,
        invite.AcceptedAt,
        invite.RevokedAt,
        role?.Name,
        organization);
}
