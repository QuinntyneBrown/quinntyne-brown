namespace QuinntyneBrown.Community.Domain.Organizations;

public enum JoinedVia
{
    Invite,
    ConnectLink,
    Added,
    Seed,
}

/// <summary>A person's membership of one org (D10). <see cref="IsOrgLead"/> is the built-in Org Lead tier (D5).</summary>
public class OrgMembership
{
    private OrgMembership() { }

    public OrgMembership(Guid organizationId, Guid profileId, JoinedVia joinedVia, DateTime joinedAtUtc)
    {
        OrganizationId = organizationId;
        ProfileId = profileId;
        JoinedVia = joinedVia;
        JoinedAtUtc = joinedAtUtc;
    }

    public Guid OrganizationId { get; private set; }

    public Guid ProfileId { get; private set; }

    public JoinedVia JoinedVia { get; private set; }

    public DateTime JoinedAtUtc { get; private set; }

    public bool IsOrgLead { get; private set; }

    public void SetOrgLead(bool isOrgLead) => IsOrgLead = isOrgLead;
}

/// <summary>A catalogue role held by a member in their org (ADR 0033).</summary>
public class OrgRoleAssignment
{
    private OrgRoleAssignment() { }

    public OrgRoleAssignment(Guid organizationId, Guid profileId, Guid roleDefinitionId, Guid grantedBy, DateTime grantedAtUtc)
    {
        OrganizationId = organizationId;
        ProfileId = profileId;
        RoleDefinitionId = roleDefinitionId;
        GrantedBy = grantedBy;
        GrantedAtUtc = grantedAtUtc;
    }

    public Guid OrganizationId { get; private set; }

    public Guid ProfileId { get; private set; }

    public Guid RoleDefinitionId { get; private set; }

    public Guid GrantedBy { get; private set; }

    public DateTime GrantedAtUtc { get; private set; }
}
