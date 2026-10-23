namespace QuinntyneBrown.Community.Domain.Organizations;

/// <summary>The top of the hierarchy under the platform (D4): holds Org Types, Organizations and cross-org roles.</summary>
public class Portfolio
{
    private Portfolio() { }

    public Portfolio(string name, string slug, Guid? id = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(slug);
        Id = id ?? Guid.NewGuid();
        Name = name;
        Slug = slug;
    }

    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public string Slug { get; private set; } = string.Empty;
}

/// <summary>The built-in Portfolio Lead tier (D5): anything in the portfolio except other people's private items.</summary>
public class PortfolioLead
{
    private PortfolioLead() { }

    public PortfolioLead(Guid portfolioId, Guid profileId, Guid grantedBy, DateTime grantedAtUtc)
    {
        PortfolioId = portfolioId;
        ProfileId = profileId;
        GrantedBy = grantedBy;
        GrantedAtUtc = grantedAtUtc;
    }

    public Guid PortfolioId { get; private set; }

    public Guid ProfileId { get; private set; }

    public Guid GrantedBy { get; private set; }

    public DateTime GrantedAtUtc { get; private set; }
}
