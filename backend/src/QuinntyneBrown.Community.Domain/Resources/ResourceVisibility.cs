namespace QuinntyneBrown.Community.Domain.Resources;

/// <summary>Who may open a resource (L2-060): its owner, its audience, or every signed-in member.</summary>
public enum ResourceVisibility
{
    Private,
    Shared,
    /// <summary>Everyone who covers the item's org (was Global, ADR 0039).</summary>
    OrgWide,

    /// <summary>Everyone who covers any org of the item's portfolio; set by the Portfolio Lead only.</summary>
    PortfolioWide,
}
