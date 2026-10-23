namespace QuinntyneBrown.Community.Domain.Notes;

/// <summary>Who may open a note page (L2-092): its owner, its audience, or every signed-in member. New pages are Private.</summary>
public enum NoteVisibility
{
    Private,
    Shared,
    /// <summary>Everyone who covers the item's org (was Global, ADR 0039).</summary>
    OrgWide,

    /// <summary>Everyone who covers any org of the item's portfolio; set by the Portfolio Lead only.</summary>
    PortfolioWide,
}
