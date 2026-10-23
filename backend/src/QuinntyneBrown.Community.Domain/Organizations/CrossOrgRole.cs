namespace QuinntyneBrown.Community.Domain.Organizations;

public enum CrossOrgScopeKind
{
    /// <summary>A fixed list of orgs.</summary>
    Orgs,
    /// <summary>Every org of one type, resolved on each request so new orgs are covered at once.</summary>
    OrgType,
    /// <summary>Every org of the portfolio, resolved on each request.</summary>
    Portfolio,
}

/// <summary>A permission bundle applied across a set of orgs of one portfolio (ADR 0035), such as Portfolio or Staff.</summary>
public class CrossOrgRole
{
    private CrossOrgRole() { }

    public CrossOrgRole(Guid portfolioId, string key, string name, string? description, IEnumerable<string> permissions, bool canJoinWork, Guid? id = null)
    {
        Id = id ?? Guid.NewGuid();
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        PortfolioId = portfolioId;
        Key = key;
        Update(name, description, canJoinWork);
        SetPermissions(permissions);
        ScopeToPortfolio();
    }

    public Guid Id { get; private set; }

    public Guid PortfolioId { get; private set; }

    /// <summary>Stable key, unique in the portfolio (for example <c>staff</c>).</summary>
    public string Key { get; private set; } = string.Empty;

    public string Name { get; private set; } = string.Empty;

    public string? Description { get; private set; }

    public List<string> Permissions { get; private set; } = [];

    /// <summary>Whether holders may be added to covered orgs' workspaces and assigned work (D12).</summary>
    public bool CanJoinWork { get; private set; }

    public CrossOrgScopeKind ScopeKind { get; private set; }

    public Guid? ScopeOrgTypeId { get; private set; }

    public List<Guid> ScopeOrgIds { get; private set; } = [];

    public void Update(string name, string? description, bool canJoinWork)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        Name = name.Trim();
        Description = description;
        CanJoinWork = canJoinWork;
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

    public void ScopeToPortfolio()
    {
        ScopeKind = CrossOrgScopeKind.Portfolio;
        ScopeOrgTypeId = null;
        ScopeOrgIds = [];
    }

    public void ScopeToOrgType(Guid orgTypeId)
    {
        ScopeKind = CrossOrgScopeKind.OrgType;
        ScopeOrgTypeId = orgTypeId;
        ScopeOrgIds = [];
    }

    public void ScopeToOrgs(IEnumerable<Guid> orgIds)
    {
        ScopeKind = CrossOrgScopeKind.Orgs;
        ScopeOrgTypeId = null;
        ScopeOrgIds = [.. orgIds.Distinct()];
    }
}

/// <summary>A cross-org role given to one person, optionally narrowed to some of the role's orgs (ADR 0035).</summary>
public class CrossOrgAssignment
{
    private CrossOrgAssignment() { }

    public CrossOrgAssignment(Guid crossOrgRoleId, Guid profileId, IEnumerable<Guid>? narrowedOrgIds, Guid grantedBy, DateTime grantedAtUtc)
    {
        Id = Guid.NewGuid();
        CrossOrgRoleId = crossOrgRoleId;
        ProfileId = profileId;
        Narrow(narrowedOrgIds);
        GrantedBy = grantedBy;
        GrantedAtUtc = grantedAtUtc;
    }

    public Guid Id { get; private set; }

    public Guid CrossOrgRoleId { get; private set; }

    public Guid ProfileId { get; private set; }

    /// <summary>Empty for the role's whole scope; otherwise the covered set is the intersection.</summary>
    public List<Guid> NarrowedOrgIds { get; private set; } = [];

    public Guid GrantedBy { get; private set; }

    public DateTime GrantedAtUtc { get; private set; }

    public void Narrow(IEnumerable<Guid>? orgIds) => NarrowedOrgIds = orgIds is null ? [] : [.. orgIds.Distinct()];
}
