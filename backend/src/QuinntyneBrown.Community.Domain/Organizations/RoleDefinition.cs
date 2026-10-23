namespace QuinntyneBrown.Community.Domain.Organizations;

/// <summary>
/// A catalogue role of an Org Type (ADR 0033): a bundle of permission codes plus the roles it may grant.
/// <see cref="ParentRoleId"/> only orders the editor's tree; a role inherits nothing from its parent.
/// </summary>
public class RoleDefinition
{
    private RoleDefinition() { }

    public RoleDefinition(Guid orgTypeId, string key, string name, string? description, int sortOrder, IEnumerable<string> permissions, Guid? parentRoleId = null, Guid? id = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        Id = id ?? Guid.NewGuid();
        OrgTypeId = orgTypeId;
        Key = key;
        Update(name, description, parentRoleId, sortOrder);
        SetPermissions(permissions);
    }

    public Guid Id { get; private set; }

    public Guid OrgTypeId { get; private set; }

    public string Key { get; private set; } = string.Empty;

    public string Name { get; private set; } = string.Empty;

    public string? Description { get; private set; }

    public Guid? ParentRoleId { get; private set; }

    public int SortOrder { get; private set; }

    public List<string> Permissions { get; private set; } = [];

    /// <summary>Roles of the same catalogue a holder may grant and remove in their own org (with <c>roles.grant</c>).</summary>
    public List<Guid> CanGrant { get; private set; } = [];

    public void Update(string name, string? description, Guid? parentRoleId, int sortOrder)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        if (parentRoleId == Id)
        {
            throw new ArgumentException("A role cannot be its own parent.", nameof(parentRoleId));
        }

        Name = name;
        Description = description;
        ParentRoleId = parentRoleId;
        SortOrder = sortOrder;
    }

    public void SetPermissions(IEnumerable<string> permissions)
    {
        var list = permissions.Distinct().ToList();
        if (list.FirstOrDefault(p => !Organizations.Permissions.IsKnown(p)) is { } unknown)
        {
            throw new ArgumentException($"Unknown permission {unknown}.", nameof(permissions));
        }

        Permissions = [.. Organizations.Permissions.All.Where(list.Contains)];
    }

    public void SetCanGrant(IEnumerable<Guid> roleIds) => CanGrant = [.. roleIds.Distinct()];
}
