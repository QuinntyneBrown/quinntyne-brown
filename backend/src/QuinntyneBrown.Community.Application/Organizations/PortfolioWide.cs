namespace QuinntyneBrown.Community.Application.Organizations;

/// <summary>Portfolio-wide resources and note pages (ADR 0039, L2-148).</summary>
public static class PortfolioWide
{
    /// <summary>Only the Portfolio Lead over the item's org, or a System Admin, publishes to the whole portfolio.</summary>
    public static bool MayPublish(CallerAccess access, Guid orgId) => access.IsSystemAdmin || access.IsPortfolioLead(orgId);

    /// <summary>
    /// Every org of the portfolios that <paramref name="scope"/> belongs to: a Portfolio-wide item of any of them is
    /// shown wherever the scope is read.
    /// </summary>
    public static IReadOnlyList<Guid> PortfoliosOf(CallerAccess access, IEnumerable<Guid> scope)
    {
        var ids = scope.ToHashSet();
        return [.. access.Orgs.Values.Where(o => ids.Contains(o.OrgId)).Select(o => o.PortfolioId).Distinct()];
    }
}
