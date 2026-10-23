using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Domain.Events;
using QuinntyneBrown.Community.Domain.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Events;

/// <summary>
/// Who may do what with events, from permission codes (L2-020, L2-022, L2-025, ADR 0033). Before an event is loaded
/// the answers are "in any covered org" (a first 403 gate); once a handler calls <see cref="Focus"/> with the event's
/// org they are for that org only.
/// </summary>
public class EventPermissions(ICurrentUser current, IApplicationDbContext db)
{
    private Guid? _org;

    private CallerAccess Access => current.Access;

    /// <summary>Answers for one org from now on: the org of the event being handled.</summary>
    public void Focus(Guid orgId) => _org = orgId;

    /// <summary>Events of every org the caller covers with events on, whatever the active org (404 otherwise).</summary>
    public IQueryable<Event> Covered(IQueryable<Event> events)
    {
        var orgs = Access.CoveredWith(Features.Events);
        return events.Where(e => orgs.Contains(e.OrganizationId));
    }

    /// <summary>The org a new event is created in.</summary>
    public CreateTarget CreateTarget() => Access.TargetFor(Permissions.EventsManage);

    /// <summary>Holders of <c>events.manage</c> create, edit and cancel events (City Lead and Event Lead in FaithTech).</summary>
    public bool CanManageEvents => Has(Permissions.EventsManage);

    /// <summary>Holders of <c>events.rsvpList</c> see who RSVP'd; everyone else sees the count (L2-022 AC3, AC4).</summary>
    public bool CanSeeRsvpList => Has(Permissions.EventsRsvpList);

    /// <summary>Guest emails are for holders of <c>events.rsvpListEmails</c> (the leads), not Staff (L2-022 AC4).</summary>
    public bool CanSeeGuestEmails => Has(Permissions.EventsRsvpListEmails);

    /// <summary>The RSVP list exports as CSV for whoever sees guest emails (L2-022 AC5).</summary>
    public bool CanExportRsvps => CanSeeGuestEmails;

    /// <summary>Holders of <c>events.checkIn</c> check attendees in, undo, add walk-ins and export (L2-117 AC1).</summary>
    public bool CanCheckIn => Has(Permissions.EventsCheckIn);

    /// <summary>RSVP list readers (Staff) also open the check-in page, read-only (L2-117 AC2).</summary>
    public bool CanViewCheckIn => CanSeeRsvpList || CanCheckIn;

    /// <summary>A check-in by tier right (Org Lead, Portfolio Lead, System Admin) without a role holding it is audited (L2-117 AC5).</summary>
    public bool IsCheckInOverride => _org is { } org && Access.IsOverride(org, Permissions.EventsCheckIn);

    /// <summary>Event management by tier right without a role holding it is audited.</summary>
    public bool IsAdminOverride => _org is { } org && Access.IsOverride(org, Permissions.EventsManage);

    /// <summary>The caller's profile id, or null for an anonymous caller or an unknown account.</summary>
    public Task<Guid?> CallerProfileIdAsync(CancellationToken cancellationToken = default) =>
        current.UserId is { } userId
            ? db.Users.Where(u => u.Id == userId).Select(u => (Guid?)u.ProfileId).SingleOrDefaultAsync(cancellationToken)
            : Task.FromResult<Guid?>(null);

    private bool Has(string permission) =>
        _org is { } org ? Access.Has(org, permission) : Access.CoveredWith(Features.Events).Any(o => Access.Has(o, permission));
}
