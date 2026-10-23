// Traces to: L2-134, L2-157
using QuinntyneBrown.Community.Domain.Organizations;
using QuinntyneBrown.Community.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace QuinntyneBrown.Community.Cli.Tests;

public class SeedHierarchyTests
{
    private const string Origin = "https://app.faithtech.test";
    private readonly InMemoryDatabaseRoot _root = new();
    private readonly string _name = Guid.NewGuid().ToString();

    [Fact]
    public async Task Seed_creates_the_portfolio_types_orgs_and_cross_org_roles_once()
    {
        Assert.Equal(0, await Run("seed"));
        Assert.Equal(0, await Run("seed"));

        await using var db = Db();
        var portfolio = Assert.Single(await db.Portfolios.ToListAsync());
        Assert.Equal("Quinntyne Brown", portfolio.Name);
        var types = await db.OrgTypes.OrderBy(t => t.Name).ToListAsync();
        Assert.Equal(["FaithTech City", "Startup"], types.Select(t => t.Name));
        Assert.Equal(Features.Switchable, types[0].EnabledFeatures);
        Assert.Equal([Features.Invites, Features.Resources, Features.Agile, Features.Integrations], types[1].EnabledFeatures);
        Assert.Equal(
            [("faithtech-toronto", "FaithTech Toronto", HierarchySeed.FaithTechCityTypeId), ("shelfie", "Shelfie", HierarchySeed.StartupTypeId)],
            (await db.Organizations.OrderBy(o => o.Slug).ToListAsync()).Select(o => (o.Slug, o.Name, o.OrgTypeId)));
        Assert.Equal(["Portfolio", "Staff"], (await db.CrossOrgRoles.OrderBy(r => r.Name).ToListAsync()).Select(r => r.Name));
        Assert.Equal(9, await db.RoleDefinitions.CountAsync());
    }

    [Fact]
    public async Task The_faithtech_city_catalogue_reproduces_the_roles_matrix()
    {
        Assert.Equal(0, await Run("seed"));

        await using var db = Db();
        var roles = await db.RoleDefinitions.Where(r => r.OrgTypeId == HierarchySeed.FaithTechCityTypeId).OrderBy(r => r.SortOrder).ToListAsync();
        Assert.Equal(
            ["City Lead", "Event Lead", "Create Lead", "Communications Lead", "Volunteer", "Product Engineer", "Attendee"],
            roles.Select(r => r.Name));
        var byKey = roles.ToDictionary(r => r.Key);
        Assert.Equal(
            ["event-lead", "create-lead", "communications-lead", "volunteer", "product-engineer", "attendee"],
            byKey["city-lead"].CanGrant.Select(id => roles.Single(r => r.Id == id).Key));
        Assert.All(roles.Where(r => r.Key != "city-lead"), r => Assert.Empty(r.CanGrant));
        Assert.Contains(Permissions.WorkspacesCreate, byKey["city-lead"].Permissions);
        Assert.Contains(Permissions.EventsManage, byKey["event-lead"].Permissions);
        Assert.DoesNotContain(Permissions.EventsManage, byKey["create-lead"].Permissions);
        Assert.Contains(Permissions.AnnouncementsSend, byKey["communications-lead"].Permissions);
        Assert.DoesNotContain(Permissions.AnnouncementsSend, byKey["city-lead"].Permissions);
        Assert.Equal([Permissions.WorkspacesJoin, Permissions.TeamMember], byKey["volunteer"].Permissions);
        Assert.Empty(byKey["attendee"].Permissions);
        var staff = await db.CrossOrgRoles.SingleAsync(r => r.Key == "staff");
        Assert.Equal((CrossOrgScopeKind.OrgType, (Guid?)HierarchySeed.FaithTechCityTypeId, false), (staff.ScopeKind, staff.ScopeOrgTypeId, staff.CanJoinWork));
        Assert.DoesNotContain(Permissions.PartnersWrite, staff.Permissions);
    }

    private Task<int> Run(params string[] args) => CliApp.RunAsync(args, options => options.UseInMemoryDatabase(_name, _root), Origin);

    private CommunityDbContext Db() => new(new DbContextOptionsBuilder<CommunityDbContext>().UseInMemoryDatabase(_name, _root).UseOpenIddict().Options);
}
