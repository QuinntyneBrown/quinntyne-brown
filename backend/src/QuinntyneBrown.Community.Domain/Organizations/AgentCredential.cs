namespace QuinntyneBrown.Community.Domain.Organizations;

/// <summary>
/// A personal access token an agent calls the API with (ADR 0036). Only its SHA-256 hash is stored; the token is
/// shown once. It is limited to <see cref="OrgIds"/>, expires, can be revoked, and records its last use.
/// </summary>
public class AgentCredential
{
    public const int MaxDays = 90;
    public const int DefaultDays = 30;

    private AgentCredential() { }

    public AgentCredential(Guid agentProfileId, string name, string tokenHash, string prefix, Guid issuedById, IEnumerable<Guid> orgIds, DateTimeOffset createdAt, DateTimeOffset expiresAt)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        Id = Guid.NewGuid();
        AgentProfileId = agentProfileId;
        Name = name.Trim();
        TokenHash = tokenHash;
        Prefix = prefix;
        IssuedById = issuedById;
        OrgIds = [.. orgIds.Distinct()];
        CreatedAt = createdAt;
        ExpiresAt = expiresAt;
    }

    public Guid Id { get; private set; }

    public Guid AgentProfileId { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public string TokenHash { get; private set; } = string.Empty;

    /// <summary>The token's first characters, shown in the list so a person can tell tokens apart.</summary>
    public string Prefix { get; private set; } = string.Empty;

    public Guid IssuedById { get; private set; }

    public List<Guid> OrgIds { get; private set; } = [];

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset ExpiresAt { get; private set; }

    public DateTimeOffset? RevokedAt { get; private set; }

    public DateTimeOffset? LastUsedAt { get; private set; }

    public bool IsUsable(DateTimeOffset now) => RevokedAt is null && now < ExpiresAt;

    public void Revoke(DateTimeOffset now) => RevokedAt ??= now;

    /// <summary>Records a use at most once a minute, so busy agents do not write on every request.</summary>
    public bool Touch(DateTimeOffset now)
    {
        if (LastUsedAt is { } last && now - last < TimeSpan.FromMinutes(1))
        {
            return false;
        }

        LastUsedAt = now;
        return true;
    }
}
