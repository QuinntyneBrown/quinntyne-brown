namespace QuinntyneBrown.Community.Domain.Contacts;

/// <summary>
/// A person who asked, through a lead's connect link, to become that lead's contact before their email was
/// verified (ADR 0022). Verifying the email turns it into a linked contact.
/// </summary>
public class PendingConnection
{
    private PendingConnection() { }

    public PendingConnection(Guid organizationId, Guid profileId, Guid leadId, DateTimeOffset createdAt)
    {
        Id = Guid.NewGuid();
        OrganizationId = organizationId;
        ProfileId = profileId;
        LeadId = leadId;
        CreatedAt = createdAt;
    }

    public Guid Id { get; private set; }

    /// <summary>The org that owns this record (ADR 0034).</summary>
    public Guid OrganizationId { get; private set; }

    public Guid ProfileId { get; private set; }

    public Guid LeadId { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }
}
