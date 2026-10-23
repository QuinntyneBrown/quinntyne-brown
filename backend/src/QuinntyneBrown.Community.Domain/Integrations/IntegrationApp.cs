namespace QuinntyneBrown.Community.Domain.Integrations;

/// <summary>
/// An application that pushes signed events to one organization (L2-158, ADR 0042). Its signing secret is held only
/// as Data Protection ciphertext; after a rotation the previous secret stays valid for <see cref="RotationOverlap"/>.
/// Revoking is permanent.
/// </summary>
public class IntegrationApp
{
    public const int NameMaxLength = 80;

    public static readonly TimeSpan RotationOverlap = TimeSpan.FromHours(24);

    private IntegrationApp() { }

    public IntegrationApp(
        Guid organizationId, string name, string sourceId, string secretCiphertext, string secretPrefix, Guid createdById, DateTimeOffset createdAt)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(sourceId);
        ArgumentException.ThrowIfNullOrWhiteSpace(secretCiphertext);
        Id = Guid.NewGuid();
        OrganizationId = organizationId;
        Name = name;
        SourceId = sourceId;
        SecretCiphertext = secretCiphertext;
        SecretPrefix = secretPrefix;
        CreatedById = createdById;
        CreatedAt = createdAt;
    }

    public Guid Id { get; private set; }

    public Guid OrganizationId { get; private set; }

    public string Name { get; private set; } = string.Empty;

    /// <summary>The public identifier publishers send in <c>X-Webhook-Source</c>.</summary>
    public string SourceId { get; private set; } = string.Empty;

    public string SecretCiphertext { get; private set; } = string.Empty;

    /// <summary>The first characters of the current secret, for display.</summary>
    public string SecretPrefix { get; private set; } = string.Empty;

    public string? PreviousSecretCiphertext { get; private set; }

    public DateTimeOffset? PreviousSecretExpiresAt { get; private set; }

    public Guid CreatedById { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset? RotatedAt { get; private set; }

    public DateTimeOffset? RevokedAt { get; private set; }

    public Guid? RevokedById { get; private set; }

    public bool IsRevoked => RevokedAt is not null;

    /// <summary>The previous secret's ciphertext while it is still valid at <paramref name="now"/>.</summary>
    public string? PreviousSecretAt(DateTimeOffset now) =>
        PreviousSecretExpiresAt > now ? PreviousSecretCiphertext : null;

    /// <summary>Replaces the secret; the one rotated out stays valid for 24 hours, and an older previous one is dropped.</summary>
    public void Rotate(string secretCiphertext, string secretPrefix, DateTimeOffset now)
    {
        if (IsRevoked)
        {
            throw new InvalidOperationException("A revoked application cannot be rotated.");
        }

        PreviousSecretCiphertext = SecretCiphertext;
        PreviousSecretExpiresAt = now + RotationOverlap;
        SecretCiphertext = secretCiphertext;
        SecretPrefix = secretPrefix;
        RotatedAt = now;
    }

    public void Revoke(Guid revokedById, DateTimeOffset now)
    {
        if (IsRevoked)
        {
            throw new InvalidOperationException("The application is already revoked.");
        }

        RevokedAt = now;
        RevokedById = revokedById;
    }
}
