namespace QuinntyneBrown.Community.Domain.Profiles;

public class Profile
{
    public const int MaxPhotos = 10;

    private readonly List<ProfilePhoto> _photos = [];
    private readonly List<object> _domainEvents = [];

    private Profile() { }

    /// <param name="joinedAtUtc">When the account was created; set once and never changed (Reports, ADR 0030).</param>
    public Profile(string name, DateTime? joinedAtUtc = null, ProfileKind kind = ProfileKind.Person)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        Id = Guid.NewGuid();
        Name = name;
        JoinedAtUtc = joinedAtUtc;
        Kind = kind;
    }

    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public ProfileKind Kind { get; private set; }

    /// <summary>The built-in platform tier (ADR 0033): anything, anywhere, audited.</summary>
    public bool IsSystemAdmin { get; private set; }

    public IReadOnlyCollection<ProfilePhoto> Photos => _photos;

    /// <summary>Serializes writes to <see cref="Photos"/> across requests.</summary>
    public PhotoLease PhotoLease { get; private set; } = new();

    public string? HomeCity { get; private set; }

    public string? Bio { get; private set; }

    public bool IsSuspended { get; private set; }

    /// <summary>When the account was created; null for profiles created before Reports, which are never "new".</summary>
    public DateTime? JoinedAtUtc { get; private set; }

    public string? SuspendedReason { get; private set; }

    public DateTime? SuspendedAtUtc { get; private set; }

    public bool AnnouncementEmailsOptedOut { get; private set; }

    public IReadOnlyList<object> DomainEvents => _domainEvents;

    public void Update(string name, string? homeCity, string? bio)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        Name = name;
        HomeCity = homeCity;
        Bio = bio;
    }

    public void Suspend(string reason, DateTime nowUtc)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(reason);
        if (IsSuspended)
        {
            throw new InvalidOperationException("The profile is already suspended.");
        }

        IsSuspended = true;
        SuspendedReason = reason;
        SuspendedAtUtc = nowUtc;
    }

    public void Reinstate()
    {
        if (!IsSuspended)
        {
            throw new InvalidOperationException("The profile is not suspended.");
        }

        IsSuspended = false;
        SuspendedReason = null;
        SuspendedAtUtc = null;
    }

    public void SetAnnouncementEmailOptOut(bool optedOut) => AnnouncementEmailsOptedOut = optedOut;

    public void AddPhoto(ProfilePhoto photo)
    {
        if (_photos.Count >= MaxPhotos)
        {
            throw new InvalidOperationException($"A profile holds at most {MaxPhotos} photos.");
        }

        photo.SetFeatured(_photos.Count == 0);
        _photos.Add(photo);
    }

    public void Feature(Guid photoId)
    {
        var featured = FindPhoto(photoId);
        foreach (var photo in _photos)
        {
            photo.SetFeatured(photo == featured);
        }
    }

    public void RemovePhoto(Guid photoId)
    {
        var removed = FindPhoto(photoId);
        _photos.Remove(removed);
        if (removed.IsFeatured && _photos.Count > 0)
        {
            Feature(_photos.MaxBy(p => p.UploadedAt)!.Id);
        }
    }

    public void SetSystemAdmin(bool isSystemAdmin) => IsSystemAdmin = isSystemAdmin;

    public void Raise(object domainEvent) => _domainEvents.Add(domainEvent);

    public void ClearDomainEvents() => _domainEvents.Clear();

    private ProfilePhoto FindPhoto(Guid photoId) =>
        _photos.FirstOrDefault(p => p.Id == photoId)
            ?? throw new InvalidOperationException("The profile has no such photo.");
}
