namespace QuinntyneBrown.Community.Domain.Organizations;

/// <summary>
/// An organization (D2): an instance of one Org Type in one portfolio. Every org-owned record carries its id
/// (ADR 0034). Light branding (ADR 0037) is a display name, a logo and an accent colour.
/// </summary>
public class Organization
{
    private Organization() { }

    public Organization(Guid portfolioId, Guid orgTypeId, string name, string slug, Guid? id = null)
    {
        Id = id ?? Guid.NewGuid();
        PortfolioId = portfolioId;
        OrgTypeId = orgTypeId;
        Rename(name);
        Slug = OrgSlug.Normalize(slug);
    }

    public Guid Id { get; private set; }

    public Guid PortfolioId { get; private set; }

    public Guid OrgTypeId { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public string Slug { get; private set; } = string.Empty;

    /// <summary>Shown in the switcher and on public pages; the name when not set.</summary>
    public string? DisplayName { get; private set; }

    public string? LogoBlobName { get; private set; }

    /// <summary>An <c>#rrggbb</c> colour that passed the contrast rule when saved (ADR 0037).</summary>
    public string? AccentColour { get; private set; }

    public DateTime? ArchivedAtUtc { get; private set; }

    public string ShownName => DisplayName ?? Name;

    public void Rename(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        Name = name.Trim();
    }

    /// <summary>Changes the slug and returns the old one, which the caller keeps as an alias.</summary>
    public string ChangeSlug(string slug)
    {
        var old = Slug;
        Slug = OrgSlug.Normalize(slug);
        return old;
    }

    public void SetBranding(string? displayName, string? accentColour)
    {
        DisplayName = string.IsNullOrWhiteSpace(displayName) ? null : displayName.Trim();
        AccentColour = accentColour;
    }

    public void SetLogo(string? blobName) => LogoBlobName = blobName;

    public void Archive(DateTime nowUtc) => ArchivedAtUtc ??= nowUtc;

    public void Restore() => ArchivedAtUtc = null;
}

/// <summary>An org's previous slug, kept so old links redirect (D11).</summary>
public class OrgSlugAlias
{
    private OrgSlugAlias() { }

    public OrgSlugAlias(string slug, Guid organizationId)
    {
        Slug = slug;
        OrganizationId = organizationId;
    }

    public string Slug { get; private set; } = string.Empty;

    public Guid OrganizationId { get; private set; }
}

/// <summary>The slug rule (L2-144 AC7): lower-case <c>a-z</c>, <c>0-9</c> and hyphens, 3 to 40 characters, never <c>all</c>.</summary>
public static class OrgSlug
{
    public const string AllOrgs = "all";

    public static bool IsValid(string? slug) =>
        slug is { Length: >= 3 and <= 40 }
        && slug != AllOrgs
        && slug.All(c => c is >= 'a' and <= 'z' or >= '0' and <= '9' or '-')
        && !slug.StartsWith('-') && !slug.EndsWith('-');

    public static string Normalize(string slug) =>
        IsValid(slug) ? slug : throw new ArgumentException("The slug is not valid.", nameof(slug));
}
