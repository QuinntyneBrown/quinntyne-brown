// Traces to: L2-135, L2-139, L2-149
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Domain.Organizations;

namespace QuinntyneBrown.Community.Application.Tests.Organizations;

public class CallerAccessTests
{
    private static OrgAccess Org(bool member, params string[] permissions) => new(
        Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), $"org-{Guid.NewGuid():N}"[..12], "Org", "Org", "FaithTech City", null, null,
        member, false, false, false, Features.All.ToHashSet(), permissions.ToHashSet(), permissions.ToHashSet(), new HashSet<Guid>(), new HashSet<Guid>());

    private static CallerAccess Access(Guid? active, params OrgAccess[] orgs) =>
        new(Guid.NewGuid(), false, orgs.ToDictionary(o => o.OrgId), new HashSet<Guid>(), active, false, false);

    [Fact]
    public void Creation_lands_in_the_only_org_where_the_caller_holds_the_permission()
    {
        var toronto = Org(true, Permissions.EventsManage);
        var halifax = Org(true);

        var target = Access(null, toronto, halifax).TargetFor(Permissions.EventsManage);

        Assert.Equal((true, toronto.OrgId), (target.Allowed, target.OrgId));
    }

    [Fact]
    public void Creation_prefers_the_callers_own_org_and_is_ambiguous_between_two_of_them()
    {
        var mine = Org(true, Permissions.ResourcesCreate);
        var covered = Org(false, Permissions.ResourcesCreate);
        var other = Org(true, Permissions.ResourcesCreate);

        Assert.Equal(mine.OrgId, Access(null, mine, covered).TargetFor(Permissions.ResourcesCreate).OrgId);
        var ambiguous = Access(null, mine, other).TargetFor(Permissions.ResourcesCreate);
        Assert.Equal(ResultStatus.Invalid, ambiguous.Refusal!.Status);
    }

    [Fact]
    public void Creation_in_the_active_org_is_403_without_the_permission_and_404_outside_coverage()
    {
        var toronto = Org(true);

        Assert.Equal(ResultStatus.Forbidden, Access(toronto.OrgId, toronto).TargetFor(Permissions.EventsManage).Refusal!.Status);
        var missing = new CallerAccess(Guid.NewGuid(), false, new Dictionary<Guid, OrgAccess>(), new HashSet<Guid>(), null, false, activeOrgMissing: true);
        Assert.Equal(ResultStatus.NotFound, missing.TargetFor(Permissions.EventsManage).Refusal!.Status);
    }

    [Fact]
    public void Lists_read_the_active_org_or_every_covered_org()
    {
        var toronto = Org(true);
        var halifax = Org(false);

        Assert.Equal([toronto.OrgId], Access(toronto.OrgId, toronto, halifax).ReadScope(Features.Events));
        Assert.Equal(2, Access(null, toronto, halifax).ReadScope(Features.Events).Count);
    }

    [Theory]
    [InlineData("#0b6e4f", true, "#ffffff")]
    [InlineData("#f2b134", true, "#111111")]
    [InlineData("#1f8a70", false, "#111111")]
    public void An_accent_passes_with_4_5_to_1_against_the_better_of_white_and_near_black(string accent, bool passes, string foreground)
    {
        Assert.Equal((passes, foreground), (AccentContrast.Passes(accent), AccentContrast.ForegroundFor(accent)));
    }
}
