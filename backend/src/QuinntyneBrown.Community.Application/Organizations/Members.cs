using QuinntyneBrown.Community.Application.Admin;
using QuinntyneBrown.Community.Application.Agile;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Profiles;
using QuinntyneBrown.Community.Domain.Notifications;
using QuinntyneBrown.Community.Domain.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Organizations;

/// <summary>A member of an org on the members screen (L2-143 AC6).</summary>
public record MemberDto(
    Guid ProfileId, string Name, string? PhotoUrl, string Kind, bool IsOrgLead, IReadOnlyList<RoleDto> Roles, DateTime JoinedAt, string JoinedVia);

/// <summary>The body of <c>POST /api/organizations/{orgId}/members</c>.</summary>
public record AddMemberCommand(string? Email);

/// <summary>
/// Adds and removes an org's members and its Org Leads (L2-143): the org's Org Lead, its Portfolio Lead or a System
/// Admin; anyone else is refused, and an org outside the caller's coverage is not found.
/// </summary>
public class MembersHandler(
    IApplicationDbContext db,
    ICurrentUser current,
    ProfileAccess profiles,
    ProfileRoles profileRoles,
    RoleGrantPolicy policy,
    IAuditLog audit,
    IPhotoStorage storage,
    WorkspaceCreatorPermissionLostHandler creatorLost,
    TimeProvider time)
{
    public const string NoAccountMessage = "No account uses that email. Send an invite instead.";

    public const string AlreadyMemberMessage = "They’re already a member of this organization.";

    public const string LastOrgLeadMessage = "Every organization needs an Org Lead.";

    public async Task<(Result Result, IReadOnlyList<MemberDto>? Members)> ListAsync(Guid orgId, string? q, bool includeAgents, CancellationToken cancellationToken = default)
    {
        if (Refusal(orgId) is { } refusal)
        {
            return (refusal, null);
        }

        var term = q?.Trim().ToLowerInvariant();
        var rows = await db.OrgMemberships.AsNoTracking().Where(m => m.OrganizationId == orgId)
            .Join(db.Profiles.AsNoTracking(), m => m.ProfileId, p => p.Id, (m, p) => new { Membership = m, Profile = p })
            .Where(r => includeAgents || r.Profile.Kind == Domain.Profiles.ProfileKind.Person)
            .Where(r => string.IsNullOrEmpty(term) || r.Profile.Name.ToLower().Contains(term))
            .OrderBy(r => r.Profile.Name)
            .Select(r => new
            {
                r.Membership,
                r.Profile.Id,
                r.Profile.Name,
                r.Profile.Kind,
                Featured = r.Profile.Photos.Where(p => p.IsFeatured).Select(p => p.BlobName).FirstOrDefault(),
            })
            .ToListAsync(cancellationToken);
        var roles = await profileRoles.ForAsync([.. rows.Select(r => r.Id)], [orgId], cancellationToken);
        return (Result.Ok(), [.. rows.Select(r => new MemberDto(
            r.Id, r.Name, r.Featured is { } blob ? storage.GetReadUrl(blob) : null, r.Kind.ToString(), r.Membership.IsOrgLead,
            [.. roles[r.Id].Where(x => x.Kind != "crossOrg")], r.Membership.JoinedAtUtc, r.Membership.JoinedVia.ToString()))]);
    }

    /// <summary>Adds an existing account by its email; the person is told and the org appears in their switcher (AC1, AC2).</summary>
    public async Task<(Result Result, MemberDto? Member)> AddAsync(Guid orgId, AddMemberCommand command, CancellationToken cancellationToken = default)
    {
        if (Refusal(orgId) is { } refusal)
        {
            return (refusal, null);
        }

        var email = command.Email?.Trim().ToUpperInvariant();
        if (string.IsNullOrEmpty(email))
        {
            return (Result.Invalid("Email", "Enter the email of the person to add."), null);
        }

        var profileId = await db.Users.Where(u => u.EmailConfirmed && u.NormalizedEmail == email).Select(u => (Guid?)u.ProfileId).FirstOrDefaultAsync(cancellationToken);
        if (profileId is not { } id)
        {
            return (Result.NotFound(NoAccountMessage), null);
        }

        if (await db.OrgMemberships.AnyAsync(m => m.OrganizationId == orgId && m.ProfileId == id, cancellationToken))
        {
            return (Result.Conflict(AlreadyMemberMessage), null);
        }

        var org = current.Access.Orgs[orgId];
        var actor = await profiles.CallerProfileIdAsync(cancellationToken) ?? Guid.Empty;
        var now = time.GetUtcNow();
        var membership = new OrgMembership(orgId, id, JoinedVia.Added, now.UtcDateTime);
        db.OrgMemberships.Add(membership);
        var actorName = await db.Profiles.Where(p => p.Id == actor).Select(p => p.Name).SingleOrDefaultAsync(cancellationToken) ?? "An Org Lead";
        db.Notifications.Add(new Notification(id, NotificationKind.AddedToOrg, $"{actorName} added you to {org.ShownName}", $"/o/{org.Slug}", now, actor, orgId));
        audit.Record(actor, "member.added", "Profile", id.ToString(), null, new { Organization = org.Slug }, orgId, org.PortfolioId);
        await db.SaveChangesAsync(cancellationToken);
        var (_, members) = await ListAsync(orgId, null, includeAgents: true, cancellationToken);
        return (Result.Ok(), members!.Single(m => m.ProfileId == id));
    }

    /// <summary>
    /// Removes a member with every catalogue role and the Org Lead flag they held there; their records stay with them and
    /// their workspaces there need a new owner (AC3, AC4).
    /// </summary>
    public async Task<Result> RemoveAsync(Guid orgId, Guid profileId, CancellationToken cancellationToken = default)
    {
        if (Refusal(orgId) is { } refusal)
        {
            return refusal;
        }

        var membership = await db.OrgMemberships.SingleOrDefaultAsync(m => m.OrganizationId == orgId && m.ProfileId == profileId, cancellationToken);
        if (membership is null)
        {
            return Result.NotFound();
        }

        if (membership.IsOrgLead && await IsLastOrgLeadAsync(orgId, cancellationToken) && !policy.CanGrantOrgLead(orgId))
        {
            return Result.Conflict(LastOrgLeadMessage);
        }

        var org = current.Access.Orgs[orgId];
        var actor = await profiles.CallerProfileIdAsync(cancellationToken) ?? Guid.Empty;
        var before = await profileRoles.ForAsync(profileId, [orgId], cancellationToken);
        db.OrgRoleAssignments.RemoveRange(await db.OrgRoleAssignments.Where(a => a.OrganizationId == orgId && a.ProfileId == profileId).ToListAsync(cancellationToken));
        db.OrgMemberships.Remove(membership);
        audit.Record(actor, "member.removed", "Profile", profileId.ToString(),
            new { Organization = org.Slug, Roles = before.Select(r => r.Key).Order().ToArray() }, null, orgId, org.PortfolioId);
        await db.SaveChangesAsync(cancellationToken);

        await creatorLost.HandleAsync(new WorkspaceCreatorPermissionLost(profileId, orgId), cancellationToken);
        await creatorLost.QueueEmailsAsync(cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        return Result.Ok();
    }

    /// <summary>Makes or unmakes an Org Lead: the Portfolio Lead or a System Admin only (L2-136 AC2, AC3).</summary>
    public async Task<Result> SetOrgLeadAsync(Guid orgId, Guid profileId, bool isLead, CancellationToken cancellationToken = default)
    {
        if (!current.Access.Covers(orgId))
        {
            return Result.NotFound();
        }

        if (!policy.CanGrantOrgLead(orgId))
        {
            return Result.Forbidden();
        }

        var membership = await db.OrgMemberships.SingleOrDefaultAsync(m => m.OrganizationId == orgId && m.ProfileId == profileId, cancellationToken);
        if (membership is null)
        {
            return Result.NotFound();
        }

        if (membership.IsOrgLead == isLead)
        {
            return Result.Ok();
        }

        var org = current.Access.Orgs[orgId];
        var actor = await profiles.CallerProfileIdAsync(cancellationToken) ?? Guid.Empty;
        membership.SetOrgLead(isLead);
        audit.Record(actor, isLead ? "role.granted" : "role.removed", "Profile", profileId.ToString(),
            null, new { Role = RoleKeys.OrgLead, Organization = org.Slug }, orgId, org.PortfolioId);
        await db.SaveChangesAsync(cancellationToken);
        return Result.Ok();
    }

    private Result? Refusal(Guid orgId) =>
        !current.Access.Covers(orgId) ? Result.NotFound()
        : current.Access.LeadsOrg(orgId) ? null
        : Result.Forbidden();

    private async Task<bool> IsLastOrgLeadAsync(Guid orgId, CancellationToken cancellationToken) =>
        await db.OrgMemberships.CountAsync(m => m.OrganizationId == orgId && m.IsOrgLead, cancellationToken) <= 1;
}
