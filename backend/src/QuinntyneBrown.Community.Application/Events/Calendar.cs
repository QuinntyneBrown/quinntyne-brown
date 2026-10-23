using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Domain.Events;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Events;

/// <summary>An .ics download: the file name and its text.</summary>
public record CalendarFile(string FileName, string Content);

/// <summary>
/// Event calendar files (L2-024). Signed-in members may download any event; anyone may download a public event,
/// whose copy links the public page instead of an online event's joining link. Unknown or hidden events are null.
/// </summary>
public class GetEventCalendarHandler(IApplicationDbContext db, EventPermissions permissions, IIcsCalendarWriter calendar, PublicEventsHandler publicEvents)
{
    public async Task<CalendarFile?> ForMemberAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var e = await permissions.Covered(db.Events.AsNoTracking()).SingleOrDefaultAsync(x => x.Id == id, cancellationToken);
        return e is null ? null : new CalendarFile(EventFileNames.Calendar(e.Title), calendar.Write(e));
    }

    public async Task<CalendarFile?> ForAnyoneAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var e = await publicEvents.FindAsync(id, tracked: false, cancellationToken);
        return e is null
            ? null
            : new CalendarFile(EventFileNames.Calendar(e.Title), calendar.Write(e, await publicEvents.PageUrlAsync(e, cancellationToken)));
    }
}
