using QuinntyneBrown.Community.Domain.Profiles;

namespace QuinntyneBrown.Community.Domain.Invites;

public class Invite
{
    public static readonly TimeSpan Lifetime = TimeSpan.FromDays(14);

    private Invite() { }

    public Invite(Guid organizationId, string email, string tokenHash, Guid? preassignedRoleId, Guid invitedBy, DateTimeOffset createdAt, string? note = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(email);
        ArgumentException.ThrowIfNullOrWhiteSpace(tokenHash);
        Id = Guid.NewGuid();
        OrganizationId = organizationId;
        Email = email;
        TokenHash = tokenHash;
        PreassignedRoleId = preassignedRoleId;
        InvitedBy = invitedBy;
        CreatedAt = createdAt;
        ExpiresAt = createdAt + Lifetime;
        Note = note;
    }

    public Guid Id { get; private set; }

    /// <summary>The org that owns this record (ADR 0034).</summary>
    public Guid OrganizationId { get; private set; }

    public string Email { get; private set; } = string.Empty;

    public string TokenHash { get; private set; } = string.Empty;

    /// <summary>A catalogue role of the invite's org, granted on acceptance (ADR 0041).</summary>
    public Guid? PreassignedRoleId { get; private set; }

    public Guid InvitedBy { get; private set; }

    /// <summary>The inviter's optional personal note, repeated when the invite is resent.</summary>
    public string? Note { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset ExpiresAt { get; private set; }

    public DateTimeOffset? AcceptedAt { get; private set; }

    public Guid? AcceptedBy { get; private set; }

    public DateTimeOffset? RevokedAt { get; private set; }

    public InviteStatus Status(DateTimeOffset now) =>
        RevokedAt is not null ? InviteStatus.Revoked
        : AcceptedAt is not null ? InviteStatus.Accepted
        : now >= ExpiresAt ? InviteStatus.Expired
        : InviteStatus.Pending;

    public void MarkAccepted(Guid by, DateTimeOffset now)
    {
        EnsurePending(now);
        AcceptedBy = by;
        AcceptedAt = now;
    }

    public void Revoke(DateTimeOffset now)
    {
        EnsurePending(now);
        RevokedAt = now;
    }

    private void EnsurePending(DateTimeOffset now)
    {
        var status = Status(now);
        if (status != InviteStatus.Pending)
        {
            throw new InvalidOperationException($"The invite is {status.ToString().ToLowerInvariant()}.");
        }
    }
}
