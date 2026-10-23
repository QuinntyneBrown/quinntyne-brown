namespace QuinntyneBrown.Community.Domain.Integrations;

/// <summary>
/// One event an application delivered (L2-161). <see cref="EventId"/> is the publisher's id, unique per application,
/// so a retried delivery is stored once (L2-163). <see cref="DataJson"/> is the envelope's <c>data</c> object as sent.
/// </summary>
public class IntegrationEvent
{
    public const int EventTypeMaxLength = 100;

    private IntegrationEvent() { }

    public IntegrationEvent(
        Guid integrationAppId, Guid organizationId, Guid eventId, string eventType, DateTimeOffset occurredAt, DateTimeOffset receivedAt, string dataJson)
    {
        Id = Guid.NewGuid();
        IntegrationAppId = integrationAppId;
        OrganizationId = organizationId;
        EventId = eventId;
        EventType = eventType;
        OccurredAt = occurredAt;
        ReceivedAt = receivedAt;
        DataJson = dataJson;
    }

    public Guid Id { get; private set; }

    public Guid IntegrationAppId { get; private set; }

    /// <summary>Copied from the application so org-scoped reads need no join.</summary>
    public Guid OrganizationId { get; private set; }

    public Guid EventId { get; private set; }

    public string EventType { get; private set; } = string.Empty;

    public DateTimeOffset OccurredAt { get; private set; }

    public DateTimeOffset ReceivedAt { get; private set; }

    public string DataJson { get; private set; } = "{}";
}
