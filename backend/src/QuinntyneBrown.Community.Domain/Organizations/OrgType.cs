namespace QuinntyneBrown.Community.Domain.Organizations;

/// <summary>
/// A kind of organization (D2): its role catalogue, the permissions every member holds with no role, and the
/// features its orgs may use (ADR 0038). Editing it changes every org of the type at once.
/// </summary>
public class OrgType
{
    private OrgType() { }

    public OrgType(Guid portfolioId, string key, string name, IEnumerable<string> enabledFeatures, IEnumerable<string> memberPermissions, Guid? id = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        Id = id ?? Guid.NewGuid();
        PortfolioId = portfolioId;
        Key = key;
        Name = name;
        SetFeatures(enabledFeatures);
        SetMemberPermissions(memberPermissions);
    }

    public Guid Id { get; private set; }

    public Guid PortfolioId { get; private set; }

    public string Key { get; private set; } = string.Empty;

    public string Name { get; private set; } = string.Empty;

    /// <summary>The switchable features that are on; <see cref="Features.AlwaysOn"/> are never stored.</summary>
    public List<string> EnabledFeatures { get; private set; } = [];

    /// <summary>The built-in Member tier's bundle for orgs of this type (ADR 0033).</summary>
    public List<string> MemberPermissions { get; private set; } = [];

    public bool IsEnabled(string feature) => Features.AlwaysOn.Contains(feature) || EnabledFeatures.Contains(feature);

    public void Rename(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        Name = name;
    }

    public void SetFeatures(IEnumerable<string> features)
    {
        var list = features.Distinct().ToList();
        if (list.FirstOrDefault(f => !Features.IsKnown(f)) is { } unknown)
        {
            throw new ArgumentException($"Unknown feature {unknown}.", nameof(features));
        }

        EnabledFeatures = [.. Features.Switchable.Where(list.Contains)];
    }

    public void SetMemberPermissions(IEnumerable<string> permissions)
    {
        var list = permissions.Distinct().ToList();
        if (list.FirstOrDefault(p => !Permissions.IsKnown(p)) is { } unknown)
        {
            throw new ArgumentException($"Unknown permission {unknown}.", nameof(permissions));
        }

        MemberPermissions = [.. Permissions.All.Where(list.Contains)];
    }
}
