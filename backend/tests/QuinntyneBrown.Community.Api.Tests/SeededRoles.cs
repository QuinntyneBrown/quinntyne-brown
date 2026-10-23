using System.Runtime.CompilerServices;
using QuinntyneBrown.Community.Domain.Organizations;
using QuinntyneBrown.Community.Domain.Profiles;
using QuinntyneBrown.Community.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests;

/// <summary>
/// The roles tests grant, in the vocabulary of the seeded hierarchy (ADR 0033, ADR 0040): the FaithTech City catalogue
/// roles in FaithTech Toronto, the Staff and Portfolio cross-org roles, and the built-in tiers. Granting one writes the
/// same rows the app does, so the server authorizes through the real permission bundles.
/// </summary>
public enum SeededRole
{
    CityLead,
    EventLead,
    CreateLead,
    CommunicationsLead,
    Staff,
    Volunteer,
    ProductEngineer,
    Attendee,
    SystemAdmin,
    OrgLead,
    PortfolioLead,
    Portfolio,
}

public static class SeededRoles
{
    private static readonly ConditionalWeakTable<Profile, List<SeededRole>> Pending = new();

    /// <summary>The role's key in the API: the catalogue key, the cross-org key or the tier key.</summary>
    public static string Key(this SeededRole role) => role switch
    {
        SeededRole.CityLead => "city-lead",
        SeededRole.EventLead => "event-lead",
        SeededRole.CreateLead => "create-lead",
        SeededRole.CommunicationsLead => "communications-lead",
        SeededRole.Volunteer => "volunteer",
        SeededRole.ProductEngineer => "product-engineer",
        SeededRole.Attendee => "attendee",
        SeededRole.Staff => "staff",
        SeededRole.Portfolio => "portfolio",
        SeededRole.SystemAdmin => "system-admin",
        SeededRole.OrgLead => "org-lead",
        SeededRole.PortfolioLead => "portfolio-lead",
        _ => throw new ArgumentOutOfRangeException(nameof(role)),
    };

    /// <summary>The role's display name, as the API labels it.</summary>
    public static string Name(this SeededRole role) => role switch
    {
        SeededRole.Staff => "Staff",
        SeededRole.Portfolio => "Portfolio",
        SeededRole.SystemAdmin => "System Admin",
        SeededRole.OrgLead => "Org Lead",
        SeededRole.PortfolioLead => "Portfolio Lead",
        _ => HierarchySeed.FaithTechCityRoles.Single(r => r.Key == role.Key()).Name,
    };

    /// <summary>The catalogue role's id in the FaithTech City type, or the cross-org role's id.</summary>
    public static Guid Id(this SeededRole role) => role switch
    {
        SeededRole.Staff => HierarchySeed.StaffRoleId,
        SeededRole.Portfolio => HierarchySeed.PortfolioRoleId,
        _ => HierarchySeed.FaithTechCityRoles.Single(r => r.Key == role.Key()).Id,
    };

    /// <summary>Holds the role for a profile being shaped by <c>AddMemberAsync</c>; it is granted once the member is saved.</summary>
    public static void AddRole(this Profile profile, SeededRole role, Guid grantedBy, DateTime grantedAtUtc)
    {
        _ = grantedBy;
        _ = grantedAtUtc;
        Pending.GetOrCreateValue(profile).Add(role);
    }

    internal static IReadOnlyList<SeededRole> TakePending(Profile profile) =>
        Pending.TryGetValue(profile, out var roles) ? roles : [];

    /// <summary>Grants the role in FaithTech Toronto (or on the platform), adding the Toronto membership if needed.</summary>
    public static async Task GrantAsync(CommunityDbContext db, Guid profileId, SeededRole role, Guid? orgId = null)
    {
        var org = orgId ?? HierarchySeed.TorontoId;
        var now = DateTime.UtcNow;
        var membership = await db.OrgMemberships.SingleOrDefaultAsync(m => m.OrganizationId == org && m.ProfileId == profileId)
            ?? db.OrgMemberships.Local.SingleOrDefault(m => m.OrganizationId == org && m.ProfileId == profileId);
        switch (role)
        {
            case SeededRole.SystemAdmin:
                (await db.Profiles.SingleAsync(p => p.Id == profileId)).SetSystemAdmin(true);
                break;
            case SeededRole.PortfolioLead:
                if (!await db.PortfolioLeads.AnyAsync(l => l.ProfileId == profileId))
                {
                    db.PortfolioLeads.Add(new PortfolioLead(HierarchySeed.PortfolioId, profileId, Guid.Empty, now));
                }

                break;
            case SeededRole.Staff or SeededRole.Portfolio:
                if (!await db.CrossOrgAssignments.AnyAsync(a => a.ProfileId == profileId && a.CrossOrgRoleId == role.Id()))
                {
                    db.CrossOrgAssignments.Add(new CrossOrgAssignment(role.Id(), profileId, null, Guid.Empty, now));
                }

                break;
            default:
                if (membership is null)
                {
                    db.OrgMemberships.Add(membership = new OrgMembership(org, profileId, JoinedVia.Seed, now));
                }

                if (role == SeededRole.OrgLead)
                {
                    membership.SetOrgLead(true);
                }
                else if (!await db.OrgRoleAssignments.AnyAsync(a => a.OrganizationId == org && a.ProfileId == profileId && a.RoleDefinitionId == role.Id()))
                {
                    db.OrgRoleAssignments.Add(new OrgRoleAssignment(org, profileId, role.Id(), Guid.Empty, now));
                }

                break;
        }

        await db.SaveChangesAsync();
    }

    /// <summary>Makes the profile a member of the org (FaithTech Toronto by default), as joining through its link would.</summary>
    public static async Task JoinAsync(CommunityDbContext db, Guid profileId, Guid? orgId = null)
    {
        var org = orgId ?? HierarchySeed.TorontoId;
        if (!await db.OrgMemberships.AnyAsync(m => m.OrganizationId == org && m.ProfileId == profileId))
        {
            db.OrgMemberships.Add(new OrgMembership(org, profileId, JoinedVia.Seed, DateTime.UtcNow));
            await db.SaveChangesAsync();
        }
    }

    /// <summary>Whether the profile holds the role now (in FaithTech Toronto for catalogue roles and Org Lead).</summary>
    public static async Task<bool> HoldsAsync(CommunityDbContext db, Guid profileId, SeededRole role) => role switch
    {
        SeededRole.SystemAdmin => await db.Profiles.AnyAsync(p => p.Id == profileId && p.IsSystemAdmin),
        SeededRole.PortfolioLead => await db.PortfolioLeads.AnyAsync(l => l.ProfileId == profileId),
        SeededRole.Staff or SeededRole.Portfolio => await db.CrossOrgAssignments.AnyAsync(a => a.ProfileId == profileId && a.CrossOrgRoleId == role.Id()),
        SeededRole.OrgLead => await db.OrgMemberships.AnyAsync(m => m.ProfileId == profileId && m.OrganizationId == HierarchySeed.TorontoId && m.IsOrgLead),
        _ => await db.OrgRoleAssignments.AnyAsync(a => a.ProfileId == profileId && a.OrganizationId == HierarchySeed.TorontoId && a.RoleDefinitionId == role.Id()),
    };

    /// <summary>Removes the role (in FaithTech Toronto for catalogue roles and Org Lead).</summary>
    public static async Task RevokeAsync(CommunityDbContext db, Guid profileId, SeededRole role)
    {
        switch (role)
        {
            case SeededRole.SystemAdmin:
                (await db.Profiles.SingleAsync(p => p.Id == profileId)).SetSystemAdmin(false);
                break;
            case SeededRole.PortfolioLead:
                db.PortfolioLeads.RemoveRange(db.PortfolioLeads.Where(l => l.ProfileId == profileId));
                break;
            case SeededRole.Staff or SeededRole.Portfolio:
                db.CrossOrgAssignments.RemoveRange(db.CrossOrgAssignments.Where(a => a.ProfileId == profileId && a.CrossOrgRoleId == role.Id()));
                break;
            case SeededRole.OrgLead:
                (await db.OrgMemberships.SingleAsync(m => m.ProfileId == profileId && m.OrganizationId == HierarchySeed.TorontoId)).SetOrgLead(false);
                break;
            default:
                db.OrgRoleAssignments.RemoveRange(db.OrgRoleAssignments.Where(
                    a => a.ProfileId == profileId && a.OrganizationId == HierarchySeed.TorontoId && a.RoleDefinitionId == role.Id()));
                break;
        }

        await db.SaveChangesAsync();
    }

    /// <summary>Every seeded role the profile holds now, in declaration order.</summary>
    public static async Task<IReadOnlyList<SeededRole>> OfAsync(CommunityDbContext db, Guid profileId)
    {
        var held = new List<SeededRole>();
        foreach (var role in Enum.GetValues<SeededRole>())
        {
            if (await HoldsAsync(db, profileId, role))
            {
                held.Add(role);
            }
        }

        return held;
    }

    /// <summary>How many profiles hold the role now.</summary>
    public static Task<int> CountHoldersAsync(CommunityDbContext db, SeededRole role) => role switch
    {
        SeededRole.SystemAdmin => db.Profiles.CountAsync(p => p.IsSystemAdmin),
        _ => db.OrgRoleAssignments.Where(a => a.RoleDefinitionId == role.Id()).Select(a => a.ProfileId).Distinct().CountAsync(),
    };
}


/// <summary>A role as the API returns it in profiles, People and the admin users list.</summary>
public sealed record RoleRef(string Key, string Name, string Kind, Guid? OrganizationId = null, string? OrganizationName = null);
