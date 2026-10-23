using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Domain.Organizations;

namespace QuinntyneBrown.Community.Application.Organizations;

/// <summary>What the caller has in one covered org (ADR 0034).</summary>
/// <param name="RolePermissions">Granted by the Member bundle, catalogue roles and covering cross-org roles.</param>
/// <param name="Permissions">Everything the caller may do there, tiers included; features switched off are dropped.</param>
public sealed record OrgAccess(
    Guid OrgId,
    Guid PortfolioId,
    Guid OrgTypeId,
    string Slug,
    string Name,
    string ShownName,
    string TypeName,
    string? LogoBlobName,
    string? AccentColour,
    bool IsMember,
    bool IsOrgLead,
    bool IsPortfolioLead,
    bool CanJoinWork,
    IReadOnlySet<string> Features,
    IReadOnlySet<string> RolePermissions,
    IReadOnlySet<string> Permissions,
    IReadOnlySet<Guid> RoleIds,
    IReadOnlySet<Guid> CrossOrgRoleIds);

/// <summary>Where a create request lands, or why it cannot (ADR 0034).</summary>
public readonly record struct CreateTarget(Guid OrgId, Result? Refusal)
{
    public bool Allowed => Refusal is null;
}

/// <summary>
/// The caller's coverage and permissions for this request, built once by <see cref="AccessResolver"/> (ADR 0034).
/// Handlers ask it questions; nothing about permissions is cached beyond the request.
/// </summary>
public sealed class CallerAccess
{
    public const string ChooseOrganizationMessage = "Choose an organization.";

    public static CallerAccess Anonymous { get; } = new(null, false, new Dictionary<Guid, OrgAccess>(), new HashSet<Guid>(), null, false, false);

    public CallerAccess(
        Guid? profileId,
        bool isSystemAdmin,
        IReadOnlyDictionary<Guid, OrgAccess> orgs,
        IReadOnlySet<Guid> ledPortfolios,
        Guid? activeOrgId,
        bool allOrgs,
        bool activeOrgMissing,
        bool isAgent = false,
        Guid? credentialId = null)
    {
        ProfileId = profileId;
        IsSystemAdmin = isSystemAdmin;
        Orgs = orgs;
        LedPortfolios = ledPortfolios;
        ActiveOrgId = activeOrgId;
        AllOrgs = allOrgs;
        ActiveOrgMissing = activeOrgMissing;
        IsAgent = isAgent;
        CredentialId = credentialId;
    }

    public Guid? ProfileId { get; }

    public bool IsSystemAdmin { get; }

    /// <summary>Every org the caller covers, by id.</summary>
    public IReadOnlyDictionary<Guid, OrgAccess> Orgs { get; }

    public IReadOnlySet<Guid> LedPortfolios { get; }

    /// <summary>The org named by <c>X-Org</c>, when the caller covers it.</summary>
    public Guid? ActiveOrgId { get; }

    /// <summary><c>X-Org: all</c>, the "All orgs" view.</summary>
    public bool AllOrgs { get; }

    /// <summary><c>X-Org</c> named an org the caller does not cover, or none that exists: the scope is empty.</summary>
    public bool ActiveOrgMissing { get; }

    public bool IsAgent { get; }

    /// <summary>The agent token used for this request, if any (ADR 0036).</summary>
    public Guid? CredentialId { get; }

    public bool Covers(Guid orgId) => Orgs.ContainsKey(orgId);

    public bool Covers(Guid orgId, string feature) => Orgs.TryGetValue(orgId, out var org) && org.Features.Contains(feature);

    public bool Has(Guid orgId, string permission) => Orgs.TryGetValue(orgId, out var org) && org.Permissions.Contains(permission);

    /// <summary>Granted by a role (Member bundle, catalogue or cross-org), not only by a tier; tier-only actions are overrides.</summary>
    public bool HasByRole(Guid orgId, string permission) => Orgs.TryGetValue(orgId, out var org) && org.RolePermissions.Contains(permission);

    /// <summary>Allowed only through Org Lead, Portfolio Lead or System Admin: audited on other people's items (D5).</summary>
    public bool IsOverride(Guid orgId, string permission) => Has(orgId, permission) && !HasByRole(orgId, permission);

    public bool IsMember(Guid orgId) => Orgs.TryGetValue(orgId, out var org) && org.IsMember;

    public bool IsOrgLead(Guid orgId) => Orgs.TryGetValue(orgId, out var org) && org.IsOrgLead;

    public bool IsPortfolioLead(Guid orgId) => Orgs.TryGetValue(orgId, out var org) && org.IsPortfolioLead;

    /// <summary>Org Lead, Portfolio Lead or System Admin in the org: the workspace "Admin" and the org's administrators.</summary>
    public bool LeadsOrg(Guid orgId) => IsSystemAdmin ? Covers(orgId) : IsOrgLead(orgId) || IsPortfolioLead(orgId);

    public bool CanJoinWork(Guid orgId) => Orgs.TryGetValue(orgId, out var org) && org.CanJoinWork;

    public bool HasAnywhere(string permission) => Orgs.Values.Any(o => o.Permissions.Contains(permission));

    public IReadOnlyList<Guid> OrgsWith(string permission) => [.. Orgs.Values.Where(o => o.Permissions.Contains(permission)).Select(o => o.OrgId)];

    /// <summary>Every covered org with the feature on, whatever <c>X-Org</c> says: the scope of by-id requests (ADR 0034).</summary>
    public IReadOnlyList<Guid> CoveredWith(string feature) => [.. Orgs.Values.Where(o => o.Features.Contains(feature)).Select(o => o.OrgId)];

    /// <summary>
    /// The orgs a list reads from: the active org when <c>X-Org</c> names one (if the feature is on there), every
    /// covered org with the feature otherwise, and none when <c>X-Org</c> named an org the caller does not cover.
    /// </summary>
    public IReadOnlyList<Guid> ReadScope(string feature)
    {
        if (ActiveOrgMissing)
        {
            return [];
        }

        if (ActiveOrgId is { } active)
        {
            return Covers(active, feature) ? [active] : [];
        }

        return [.. Orgs.Values.Where(o => o.Features.Contains(feature)).Select(o => o.OrgId)];
    }

    /// <summary>True when <c>X-Org</c> names an org that is missing, uncovered or has the feature off: lists answer 404.</summary>
    public bool ActiveOrgUnavailable(string feature) =>
        ActiveOrgMissing || (ActiveOrgId is { } active && !Covers(active, feature));

    /// <summary>
    /// The org a create request lands in (ADR 0034): the active org when named; otherwise the only org where the
    /// caller holds <paramref name="permission"/>, preferring orgs they are a member of. 404 outside coverage or
    /// for a feature switched off, 403 without the permission, 400 when the org is ambiguous.
    /// </summary>
    public CreateTarget TargetFor(string permission)
    {
        var feature = Domain.Organizations.Permissions.FeatureOf[permission];
        if (ActiveOrgMissing || (ActiveOrgId is { } missing && !Covers(missing, feature)))
        {
            return new(Guid.Empty, Result.NotFound());
        }

        if (ActiveOrgId is { } active)
        {
            return Has(active, permission) ? new(active, null) : new(Guid.Empty, Result.Forbidden());
        }

        var candidates = OrgsWith(permission);
        if (candidates.Count > 1)
        {
            var mine = candidates.Where(IsMember).ToList();
            candidates = mine.Count > 0 ? mine : candidates;
        }

        return candidates.Count switch
        {
            0 => new(Guid.Empty, Result.Forbidden()),
            1 => new(candidates[0], null),
            _ => new(Guid.Empty, Result.Invalid("organization", ChooseOrganizationMessage)),
        };
    }
}
