namespace QuinntyneBrown.Community.Domain.Resources;

public class ResourceTag
{
    private ResourceTag() { }

    public ResourceTag(Guid resourceId, string tag)
    {
        ResourceId = resourceId;
        Tag = tag;
    }

    public Guid ResourceId { get; private set; }

    public string Tag { get; private set; } = string.Empty;
}

/// <summary>A member named in a Shared resource's audience.</summary>
public class ResourceShareMember
{
    private ResourceShareMember() { }

    public ResourceShareMember(Guid resourceId, Guid profileId)
    {
        ResourceId = resourceId;
        ProfileId = profileId;
    }

    public Guid ResourceId { get; private set; }

    public Guid ProfileId { get; private set; }
}

/// <summary>
/// A role named in a Shared resource's audience: a catalogue role of the resource's org or a cross-org role covering
/// it (ADR 0039). Whoever holds it at request time may open the resource (ADR 0017).
/// </summary>
public class ResourceShareRole
{
    private ResourceShareRole() { }

    public ResourceShareRole(Guid resourceId, Guid roleId)
    {
        ResourceId = resourceId;
        RoleId = roleId;
    }

    public Guid ResourceId { get; private set; }

    /// <summary>A <c>RoleDefinition</c> or <c>CrossOrgRole</c> id.</summary>
    public Guid RoleId { get; private set; }
}
