namespace QuinntyneBrown.Community.Domain.Resources;

/// <summary>A visibility with, for Shared, the named members and roles (at least one of either).</summary>
public record ResourceAudience
{
    private ResourceAudience(ResourceVisibility visibility, IReadOnlySet<Guid> members, IReadOnlySet<Guid> roles)
    {
        Visibility = visibility;
        Members = members;
        Roles = roles;
    }

    public ResourceVisibility Visibility { get; }

    public IReadOnlySet<Guid> Members { get; }

    public IReadOnlySet<Guid> Roles { get; }

    public static ResourceAudience Private() => new(ResourceVisibility.Private, new HashSet<Guid>(), new HashSet<Guid>());

    public static ResourceAudience OrgWide() => new(ResourceVisibility.OrgWide, new HashSet<Guid>(), new HashSet<Guid>());

    public static ResourceAudience PortfolioWide() => new(ResourceVisibility.PortfolioWide, new HashSet<Guid>(), new HashSet<Guid>());

    public static ResourceAudience Shared(IEnumerable<Guid> members, IEnumerable<Guid> roles)
    {
        var memberSet = members.ToHashSet();
        var roleSet = roles.ToHashSet();
        if (memberSet.Count == 0 && roleSet.Count == 0)
        {
            throw new ArgumentException("A shared resource needs at least one member or role.");
        }

        return new(ResourceVisibility.Shared, memberSet, roleSet);
    }
}
