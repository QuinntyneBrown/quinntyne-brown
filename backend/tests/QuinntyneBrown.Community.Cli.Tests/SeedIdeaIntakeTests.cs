// Traces to: L2-177, L2-181
using QuinntyneBrown.Community.Domain.Ideas;
using QuinntyneBrown.Community.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace QuinntyneBrown.Community.Cli.Tests;

/// <summary>The seed creates the platform intake once, in the root org, and never resets its switches (ADR 0044).</summary>
public class SeedIdeaIntakeTests
{
    private const string Origin = "https://app.faithtech.test";
    private readonly InMemoryDatabaseRoot _root = new();
    private readonly string _name = Guid.NewGuid().ToString();

    [Fact]
    public async Task Seed_creates_one_intake_in_the_root_org_with_both_switches_on()
    {
        Assert.Equal(0, await Run("seed"));
        Assert.Equal(0, await Run("seed"));

        await using var db = Db();
        var intake = Assert.Single(await db.IdeaIntakes.ToListAsync());
        Assert.Equal((IdeaIntake.PlatformId, HierarchySeed.TorontoId, true, true), (intake.Id, intake.OrganizationId, intake.AskStage, intake.AskPeople));
    }

    [Fact]
    public async Task Seeding_again_keeps_the_switches_a_system_admin_saved()
    {
        Assert.Equal(0, await Run("seed"));
        await using (var db = Db())
        {
            (await db.IdeaIntakes.SingleAsync()).SetSteps(false, true, Guid.NewGuid(), DateTimeOffset.UtcNow);
            await db.SaveChangesAsync();
        }

        Assert.Equal(0, await Run("seed"));

        await using var after = Db();
        var intake = await after.IdeaIntakes.SingleAsync();
        Assert.Equal((false, true), (intake.AskStage, intake.AskPeople));
    }

    private Task<int> Run(params string[] args) => CliApp.RunAsync(args, options => options.UseInMemoryDatabase(_name, _root), Origin);

    private CommunityDbContext Db() => new(new DbContextOptionsBuilder<CommunityDbContext>().UseInMemoryDatabase(_name, _root).UseOpenIddict().Options);
}
