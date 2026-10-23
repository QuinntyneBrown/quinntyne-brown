using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Domain.Organizations;
using QuinntyneBrown.Community.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Organizations;

/// <summary>Orgs beyond the seeded ones, and members of them, written straight to the database.</summary>
public static class OrgClients
{
    public record Org(Guid Id, string Slug, string Name);

    public static readonly Org Toronto = new(HierarchySeed.TorontoId, HierarchySeed.TorontoSlug, "FaithTech Toronto");

    public static readonly Org Shelfie = new(HierarchySeed.ShelfieId, HierarchySeed.ShelfieSlug, "Shelfie");

    /// <summary>A new org of the type (FaithTech City unless given), with a unique slug.</summary>
    public static Task<Org> AddOrgAsync(this CommunityApiFactory factory, string name, Guid? typeId = null) =>
        factory.WithDbAsync(async db =>
        {
            var slug = $"{name.ToLowerInvariant().Replace(' ', '-')}-{Guid.NewGuid().ToString("N")[..6]}";
            var org = new Organization(HierarchySeed.PortfolioId, typeId ?? HierarchySeed.FaithTechCityTypeId, name, slug);
            db.Organizations.Add(org);
            await db.SaveChangesAsync();
            return new Org(org.Id, org.Slug, org.Name);
        });

    /// <summary>A verified member of only <paramref name="org"/>, holding the catalogue roles (or tiers) there.</summary>
    public static async Task<ProfileClients.Member> AddMemberOfAsync(this CommunityApiFactory factory, Org org, string name, params SeededRole[] roles)
    {
        var member = await factory.AddMemberAsync(name, joinToronto: false);
        await factory.WithDbAsync(async db =>
        {
            await SeededRoles.JoinAsync(db, member.ProfileId, org.Id);
            foreach (var role in roles)
            {
                await SeededRoles.GrantAsync(db, member.ProfileId, role, org.Id);
            }

            return 0;
        });
        return member;
    }

    /// <summary>Gives a profile a catalogue role of the Startup type (Engineer or Advisor) in a Startup org.</summary>
    public static Task GrantStartupRoleAsync(this CommunityApiFactory factory, ProfileClients.Member member, Org org, string key) =>
        factory.WithDbAsync(async db =>
        {
            var role = await db.RoleDefinitions.SingleAsync(r => r.OrgTypeId == HierarchySeed.StartupTypeId && r.Key == key);
            db.OrgRoleAssignments.Add(new OrgRoleAssignment(org.Id, member.ProfileId, role.Id, Guid.Empty, DateTime.UtcNow));
            return await db.SaveChangesAsync();
        });

    /// <summary>A cross-org assignment of a seeded cross-org role, narrowed to some orgs when given.</summary>
    public static Task AssignCrossOrgAsync(this CommunityApiFactory factory, ProfileClients.Member member, SeededRole role, params Org[] narrowedTo) =>
        factory.WithDbAsync(async db =>
        {
            db.CrossOrgAssignments.Add(new CrossOrgAssignment(role.Id(), member.ProfileId, narrowedTo.Select(o => o.Id), Guid.Empty, DateTime.UtcNow));
            return await db.SaveChangesAsync();
        });
}
