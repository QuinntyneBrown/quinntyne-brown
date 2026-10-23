using QuinntyneBrown.Community.Application.Agile;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Application.Profiles;
using QuinntyneBrown.Community.Domain.Admin;
using QuinntyneBrown.Community.Domain.Organizations;
using QuinntyneBrown.Community.Domain.Profiles;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Admin;

/// <param name="Role">A catalogue role key of the org's type, <c>org-lead</c>, <c>portfolio-lead</c> or <c>system-admin</c>.</param>
/// <param name="OrganizationId">The org for catalogue roles and Org Lead; the active org when omitted.</param>
public record AssignRoleCommand(string? Role, Guid? OrganizationId = null);

/// <summary>
/// Grants and removes roles (L2-136, ADR 0033) under <see cref="RoleGrantPolicy"/>: catalogue roles and Org Lead in one
/// org, Portfolio Lead and System Admin on the platform. Audited (L2-041); Org Lead and catalogue grants notify the person.
/// </summary>
public class ChangeRolesHandler(
    IApplicationDbContext db,
    ICurrentUser current,
    RoleGrantPolicy policy,
    ProfileAccess access,
    ProfileRoles profileRoles,
    AccessResolver resolver,
    IAuditLog audit,
    RoleChangeNotifier notifier,
    WorkspaceCreatorPermissionLostHandler creatorLost,
    TimeProvider time)
{
    public const string LastSystemAdminMessage = "There must always be at least one System Admin.";

    public const string ConcurrentSystemAdminChangeMessage = "Someone else changed System Admin roles at the same time. Reload and try again.";

    public const string NotAMemberMessage = "They aren’t a member of this organization. Add them first.";

    public Task<(Result Result, IReadOnlyList<RoleDto>? Roles)> AssignAsync(Guid profileId, AssignRoleCommand command, CancellationToken cancellationToken = default) =>
        ChangeAsync(profileId, command.Role, command.OrganizationId, add: true, cancellationToken);

    public Task<(Result Result, IReadOnlyList<RoleDto>? Roles)> RemoveAsync(Guid profileId, string? role, Guid? organizationId, CancellationToken cancellationToken = default) =>
        ChangeAsync(profileId, role, organizationId, add: false, cancellationToken);

    private async Task<(Result, IReadOnlyList<RoleDto>?)> ChangeAsync(Guid profileId, string? key, Guid? organizationId, bool add, CancellationToken cancellationToken)
    {
        var caller = current.Access;
        if (string.IsNullOrWhiteSpace(key))
        {
            return (Result.Invalid("Role", "Choose a role."), null);
        }

        var profile = await db.Profiles.WhereVisibleTo(db, caller).SingleOrDefaultAsync(p => p.Id == profileId, cancellationToken);
        if (profile is null)
        {
            var mayChange = policy.CanGrantPlatformTiers || caller.Orgs.Values.Any(o => policy.CanChangeRolesIn(o.OrgId));
            return (mayChange ? Result.NotFound() : Result.Forbidden(), null);
        }

        var actor = await access.CallerProfileIdAsync(cancellationToken) ?? Guid.Empty;
        if (key is RoleKeys.SystemAdmin or RoleKeys.PortfolioLead)
        {
            return await ChangePlatformTierAsync(profile, key, actor, add, cancellationToken);
        }

        var orgId = organizationId ?? caller.ActiveOrgId ?? await SoleSharedOrgAsync(profileId, cancellationToken);
        if (orgId is not { } org)
        {
            return caller.Orgs.Values.Any(o => policy.CanChangeRolesIn(o.OrgId))
                ? (Result.Invalid("organization", CallerAccess.ChooseOrganizationMessage), null)
                : (Result.Forbidden(), null);
        }

        if (!caller.Covers(org))
        {
            return (Result.NotFound(), null);
        }

        if (!policy.CanChangeRolesIn(org))
        {
            return (Result.Forbidden(), null);
        }

        var membership = await db.OrgMemberships.SingleOrDefaultAsync(m => m.OrganizationId == org && m.ProfileId == profileId, cancellationToken);
        var before = await profileRoles.ForAsync(profileId, [org], cancellationToken);
        string label;
        if (key == RoleKeys.OrgLead)
        {
            if (!policy.CanGrantOrgLead(org))
            {
                return (Result.Forbidden(), null);
            }

            if (membership is null && add)
            {
                db.OrgMemberships.Add(membership = new OrgMembership(org, profileId, JoinedVia.Added, time.GetUtcNow().UtcDateTime));
            }

            if (membership is null || membership.IsOrgLead == add)
            {
                return (Result.Conflict(add ? "They already hold that role." : "They don’t hold that role."), null);
            }

            membership.SetOrgLead(add);
            label = RoleKeys.NameOf(RoleKeys.OrgLead);
        }
        else
        {
            var typeId = await db.Organizations.Where(o => o.Id == org).Select(o => o.OrgTypeId).SingleAsync(cancellationToken);
            var catalogue = await db.RoleDefinitions.Where(r => r.OrgTypeId == typeId).ToListAsync(cancellationToken);
            var role = catalogue.FirstOrDefault(r => r.Key == key);
            if (role is null)
            {
                return (Result.Invalid("Role", "Choose a role."), null);
            }

            if (!policy.CanGrant(org, role, catalogue))
            {
                return (Result.Forbidden(), null);
            }

            if (membership is null)
            {
                return (Result.Invalid("Role", NotAMemberMessage), null);
            }

            var held = await db.OrgRoleAssignments.SingleOrDefaultAsync(
                a => a.OrganizationId == org && a.ProfileId == profileId && a.RoleDefinitionId == role.Id, cancellationToken);
            if ((held is not null) == add)
            {
                return (Result.Conflict(add ? "They already hold that role." : "They don’t hold that role."), null);
            }

            if (add)
            {
                db.OrgRoleAssignments.Add(new OrgRoleAssignment(org, profileId, role.Id, actor, time.GetUtcNow().UtcDateTime));
            }
            else
            {
                db.OrgRoleAssignments.Remove(held!);
            }

            label = role.Name;
        }

        var hadCreate = !add && (await resolver.ForProfileAsync(profileId, cancellationToken)).Has(org, Permissions.WorkspacesCreate);
        var beforeKeys = Keys(before);
        string[] afterKeys = add ? [.. beforeKeys.Append(key).Order()] : [.. beforeKeys.Where(k => k != key)];
        var portfolioId = caller.Orgs[org].PortfolioId;
        audit.Record(actor, add ? "role.granted" : "role.removed", "Profile", profileId.ToString(),
            new { Roles = beforeKeys }, new { Roles = afterKeys }, org, portfolioId);

        if (policy.NotifiesOwner(org) && actor != profileId)
        {
            var actorName = await db.Profiles.Where(p => p.Id == actor).Select(p => p.Name).SingleOrDefaultAsync(cancellationToken) ?? "An Org Lead";
            var title = add
                ? $"{actorName} added the {label} role to your profile"
                : $"{actorName} removed the {label} role from your profile";
            notifier.Notify(profileId, title, org);
            await notifier.QueueEmailAsync(profileId, title, cancellationToken);
        }

        // The role change, its audit entry, the notification and the email commit together (L2-028, L2-047).
        await db.SaveChangesAsync(cancellationToken);
        if (hadCreate && !(await resolver.ForProfileAsync(profileId, cancellationToken)).Has(org, Permissions.WorkspacesCreate))
        {
            // Read once the change is saved, so the resolver sees it; the "needs a new owner" notices follow it (D12).
            await creatorLost.HandleAsync(new WorkspaceCreatorPermissionLost(profileId, org), cancellationToken);
            await creatorLost.QueueEmailsAsync(cancellationToken);
            await db.SaveChangesAsync(cancellationToken);
        }

        return (Result.Ok(), await profileRoles.ForAsync(profileId, [org], cancellationToken));
    }

    private async Task<(Result, IReadOnlyList<RoleDto>?)> ChangePlatformTierAsync(Profile profile, string key, Guid actor, bool add, CancellationToken cancellationToken)
    {
        if (!policy.CanGrantPlatformTiers)
        {
            return (Result.Forbidden(), null);
        }

        var before = await profileRoles.ForAsync(profile.Id, cancellationToken: cancellationToken);
        if (key == RoleKeys.SystemAdmin)
        {
            if (profile.IsSystemAdmin == add)
            {
                return (Result.Conflict(add ? "They already hold that role." : "They don’t hold that role."), null);
            }

            if (!add)
            {
                // Take the roster lease in a save of its own, so no other removal can count the admins until
                // this one has saved its change; only then is the count safe to trust.
                var roster = await TakeRosterLeaseAsync(cancellationToken);
                if (roster is null)
                {
                    return (Result.Conflict(ConcurrentSystemAdminChangeMessage), null);
                }

                if (await db.Profiles.CountAsync(p => p.IsSystemAdmin, cancellationToken) <= 1)
                {
                    roster.Release();
                    await db.SaveChangesAsync(cancellationToken);
                    return (Result.Conflict(LastSystemAdminMessage), null);
                }

                roster.Release();
            }

            profile.SetSystemAdmin(add);
        }
        else
        {
            var portfolioId = await db.Portfolios.OrderBy(p => p.Name).Select(p => p.Id).FirstAsync(cancellationToken);
            var lead = await db.PortfolioLeads.SingleOrDefaultAsync(l => l.PortfolioId == portfolioId && l.ProfileId == profile.Id, cancellationToken);
            if ((lead is not null) == add)
            {
                return (Result.Conflict(add ? "They already hold that role." : "They don’t hold that role."), null);
            }

            if (add)
            {
                db.PortfolioLeads.Add(new PortfolioLead(portfolioId, profile.Id, actor, time.GetUtcNow().UtcDateTime));
            }
            else
            {
                db.PortfolioLeads.Remove(lead!);
            }
        }

        var beforeKeys = Keys(before);
        string[] afterKeys = add ? [.. beforeKeys.Append(key).Order()] : [.. beforeKeys.Where(k => k != key)];
        audit.Record(actor, add ? "role.granted" : "role.removed", "Profile", profile.Id.ToString(), new { Roles = beforeKeys }, new { Roles = afterKeys });
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), await profileRoles.ForAsync(profile.Id, cancellationToken: cancellationToken));
    }

    /// <summary>The one org the caller covers that the person belongs to, when there is exactly one.</summary>
    private async Task<Guid?> SoleSharedOrgAsync(Guid profileId, CancellationToken cancellationToken)
    {
        var covered = current.Access.Orgs.Keys.ToList();
        var shared = await db.OrgMemberships.Where(m => m.ProfileId == profileId && covered.Contains(m.OrganizationId))
            .Select(m => m.OrganizationId).ToListAsync(cancellationToken);
        return shared.Count == 1 ? shared[0] : null;
    }

    /// <summary>The roster with its lease taken by this request, or null when another removal holds it.</summary>
    private async Task<SystemAdminRoster?> TakeRosterLeaseAsync(CancellationToken cancellationToken)
    {
        var roster = await db.SystemAdminRosters.SingleOrDefaultAsync(r => r.Id == SystemAdminRoster.SingletonId, cancellationToken);
        if (roster is null)
        {
            db.SystemAdminRosters.Add(roster = new SystemAdminRoster());
        }

        if (!roster.TryTake(Guid.NewGuid(), time.GetUtcNow()))
        {
            return null;
        }

        try
        {
            await db.SaveChangesAsync(cancellationToken);
            return roster;
        }
        catch (DbUpdateException)
        {
            // Another removal took the lease between our read and our save.
            return null;
        }
    }

    private static string[] Keys(IEnumerable<RoleDto> roles) => [.. roles.Select(r => r.Key).Order()];
}
