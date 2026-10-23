namespace QuinntyneBrown.Community.Domain.Announcements;

public class AnnouncementAudience
{
    private AnnouncementAudience() { }

    private AnnouncementAudience(AudienceKind kind, IEnumerable<Guid> roles, Guid? eventId)
    {
        Kind = kind;
        Roles = roles.ToHashSet();
        EventId = eventId;
    }

    public AudienceKind Kind { get; private set; }

    /// <summary>Catalogue role ids of the announcement's org.</summary>
    public IReadOnlySet<Guid> Roles { get; private set; } = new HashSet<Guid>();

    public Guid? EventId { get; private set; }

    public static AnnouncementAudience Everyone() => new(AudienceKind.Everyone, [], null);

    public static AnnouncementAudience ForRoles(params Guid[] roles)
    {
        if (roles.Length == 0)
        {
            throw new ArgumentException("A role audience needs at least one role.", nameof(roles));
        }

        return new(AudienceKind.Roles, roles, null);
    }

    public static AnnouncementAudience ForEventRsvps(Guid eventId) => new(AudienceKind.EventRsvps, [], eventId);

    /// <summary>Every member of every org of the announcement's portfolio; only the Portfolio Lead sends it (L2-151).</summary>
    public static AnnouncementAudience Portfolio() => new(AudienceKind.Portfolio, [], null);
}
