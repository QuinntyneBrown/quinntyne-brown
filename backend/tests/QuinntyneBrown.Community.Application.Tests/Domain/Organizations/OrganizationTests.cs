// Traces to: L2-134, L2-137, L2-144, L2-147, L2-154
using QuinntyneBrown.Community.Domain.Organizations;

namespace QuinntyneBrown.Community.Application.Tests.Domain.Organizations;

public class OrganizationTests
{
    [Theory]
    [InlineData("faithtech-toronto", true)]
    [InlineData("abc", true)]
    [InlineData("ab", false)]
    [InlineData("all", false)]
    [InlineData("FaithTech", false)]
    [InlineData("faith_tech", false)]
    [InlineData("-toronto", false)]
    [InlineData("toronto-", false)]
    public void A_slug_is_lower_case_letters_digits_and_hyphens_3_to_40_long_and_never_all(string slug, bool valid)
    {
        Assert.Equal(valid, OrgSlug.IsValid(slug));
    }

    [Fact]
    public void Changing_a_slug_returns_the_old_one_to_keep_as_an_alias()
    {
        var org = new Organization(Guid.NewGuid(), Guid.NewGuid(), "FaithTech Toronto", "faithtech-toronto");

        var old = org.ChangeSlug("ft-toronto");

        Assert.Equal(("faithtech-toronto", "ft-toronto"), (old, org.Slug));
        Assert.Throws<ArgumentException>(() => org.ChangeSlug("All"));
    }

    [Fact]
    public void Profiles_and_notes_are_always_on_and_only_switchable_features_are_stored()
    {
        var type = new OrgType(Guid.NewGuid(), "startup", "Startup", [Features.Agile, Features.Notes, Features.Agile], []);

        Assert.Equal([Features.Agile], type.EnabledFeatures);
        Assert.True(type.IsEnabled(Features.Profiles));
        Assert.True(type.IsEnabled(Features.Notes));
        Assert.False(type.IsEnabled(Features.Events));
        Assert.Throws<ArgumentException>(() => type.SetFeatures(["hackathons"]));
    }

    [Fact]
    public void A_role_holds_only_known_permission_codes_and_cannot_be_its_own_parent()
    {
        var role = new RoleDefinition(Guid.NewGuid(), "engineer", "Engineer", null, 0, [Permissions.WorkspacesJoin, Permissions.InvitesSend]);

        Assert.Equal([Permissions.InvitesSend, Permissions.WorkspacesJoin], role.Permissions);
        Assert.Throws<ArgumentException>(() => role.SetPermissions(["events.delete"]));
        Assert.Throws<ArgumentException>(() => role.Update("Engineer", null, role.Id, 0));
    }

    [Fact]
    public void Every_permission_code_belongs_to_a_known_feature()
    {
        Assert.All(Permissions.All, code => Assert.True(Features.IsKnown(Permissions.FeatureOf[code]), code));
    }

    [Fact]
    public void A_cross_org_role_is_scoped_to_the_portfolio_until_narrowed_to_a_type_or_orgs()
    {
        var role = new CrossOrgRole(Guid.NewGuid(), "staff", "Staff", null, [Permissions.PartnersRead], canJoinWork: false);
        var type = Guid.NewGuid();
        var org = Guid.NewGuid();

        Assert.Equal(CrossOrgScopeKind.Portfolio, role.ScopeKind);
        role.ScopeToOrgType(type);
        Assert.Equal((CrossOrgScopeKind.OrgType, (Guid?)type), (role.ScopeKind, role.ScopeOrgTypeId));
        role.ScopeToOrgs([org, org]);
        Assert.Equal((CrossOrgScopeKind.Orgs, (Guid?)null, 1), (role.ScopeKind, role.ScopeOrgTypeId, role.ScopeOrgIds.Count));
    }

    [Fact]
    public void An_agent_token_works_until_it_expires_or_is_revoked_and_records_use_at_most_once_a_minute()
    {
        var now = new DateTimeOffset(2026, 10, 23, 12, 0, 0, TimeSpan.Zero);
        var token = new AgentCredential(Guid.NewGuid(), "Board bot", "hash", "ftca_abc", Guid.NewGuid(), [Guid.NewGuid()], now, now.AddDays(30));

        Assert.True(token.IsUsable(now.AddDays(29)));
        Assert.False(token.IsUsable(now.AddDays(30)));
        Assert.True(token.Touch(now));
        Assert.False(token.Touch(now.AddSeconds(30)));
        Assert.True(token.Touch(now.AddMinutes(2)));
        token.Revoke(now.AddDays(1));
        Assert.False(token.IsUsable(now.AddDays(2)));
    }
}
