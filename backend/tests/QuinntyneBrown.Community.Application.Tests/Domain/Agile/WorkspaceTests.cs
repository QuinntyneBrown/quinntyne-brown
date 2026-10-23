// Traces to: L2-031, L2-037, L2-051
using QuinntyneBrown.Community.Domain.Agile;
using QuinntyneBrown.Community.Domain.Profiles;

namespace QuinntyneBrown.Community.Application.Tests.Domain.Agile;

public class WorkspaceTests
{
    internal static readonly DateTimeOffset Now = new(2026, 10, 21, 12, 0, 0, TimeSpan.Zero);

    internal static readonly Guid Org = Guid.NewGuid();

    internal static Profile ProfileWith() => new("Member");

    internal static Workspace NewWorkspace(WorkspaceMethod method = WorkspaceMethod.Scrum) => new(Org, "Hackathon app", method, Guid.NewGuid());

    [Fact]
    public void The_creator_owns_a_new_workspace()
    {
        var owner = Guid.NewGuid();

        var workspace = new Workspace(Org, "Hackathon app", WorkspaceMethod.Kanban, owner);

        Assert.Equal(("Hackathon app", WorkspaceMethod.Kanban, owner, false, Org), (workspace.Name, workspace.Method, workspace.OwnerId, workspace.IsArchived, workspace.OrganizationId));
        Assert.True(workspace.IsMember(owner));
    }

    [Fact]
    public void A_workspace_needs_a_name()
    {
        Assert.Throws<ArgumentException>(() => new Workspace(Org, " ", WorkspaceMethod.Scrum, Guid.NewGuid()));
    }

    [Fact]
    public void Renaming_needs_a_name()
    {
        var workspace = NewWorkspace();

        workspace.Rename("Community app");
        Assert.Equal("Community app", workspace.Name);

        Assert.Throws<ArgumentException>(() => workspace.Rename(""));
    }

    [Fact]
    public void A_profile_who_may_join_the_orgs_work_can_be_added()
    {
        var workspace = NewWorkspace();
        var profile = ProfileWith();

        workspace.AddMember(profile, eligible: true, Now);

        var member = Assert.Single(workspace.Members);
        Assert.Equal((workspace.Id, profile.Id, Now), (member.WorkspaceId, member.ProfileId, member.AddedAt));
        Assert.True(workspace.IsMember(profile.Id));
    }

    [Fact]
    public void A_profile_who_may_not_join_the_orgs_work_cannot_be_added()
    {
        var workspace = NewWorkspace();

        Assert.Throws<InvalidOperationException>(() => workspace.AddMember(ProfileWith(), eligible: false, Now));
        Assert.Empty(workspace.Members);
    }

    [Fact]
    public void Adding_a_member_twice_is_rejected()
    {
        var workspace = NewWorkspace();
        var profile = ProfileWith();
        workspace.AddMember(profile, eligible: true, Now);

        Assert.Throws<InvalidOperationException>(() => workspace.AddMember(profile, eligible: true, Now));
    }

    [Fact]
    public void Archiving_hides_the_workspace_and_restoring_brings_it_back()
    {
        var workspace = NewWorkspace();

        workspace.Archive();
        Assert.True(workspace.IsArchived);
        Assert.Throws<InvalidOperationException>(() => workspace.Archive());

        workspace.Restore();
        Assert.False(workspace.IsArchived);
        Assert.Throws<InvalidOperationException>(() => workspace.Restore());
    }

    [Fact]
    public void Ownership_can_be_reassigned_to_another_city_lead()
    {
        var workspace = NewWorkspace();
        var newOwner = ProfileWith();

        var formerOwner = workspace.OwnerId;
        workspace.AddMember(newOwner, eligible: true, Now);

        workspace.ReassignOwner(newOwner, canOwn: true, Now);

        Assert.Equal(newOwner.Id, workspace.OwnerId);
        Assert.Equal([formerOwner], workspace.Members.Select(m => m.ProfileId));
    }

    [Fact]
    public void Ownership_cannot_go_to_a_profile_without_the_city_lead_role()
    {
        var workspace = NewWorkspace();
        var owner = workspace.OwnerId;

        Assert.Throws<InvalidOperationException>(() => workspace.ReassignOwner(ProfileWith(), canOwn: false, Now));
        Assert.Equal(owner, workspace.OwnerId);
    }
}
