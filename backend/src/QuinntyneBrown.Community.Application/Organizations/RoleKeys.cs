namespace QuinntyneBrown.Community.Application.Organizations;

/// <summary>The keys of the built-in tiers, beside catalogue and cross-org role keys (ADR 0033).</summary>
public static class RoleKeys
{
    public const string SystemAdmin = "system-admin";
    public const string PortfolioLead = "portfolio-lead";
    public const string OrgLead = "org-lead";

    public static string NameOf(string tierKey) => tierKey switch
    {
        SystemAdmin => "System Admin",
        PortfolioLead => "Portfolio Lead",
        OrgLead => "Org Lead",
        _ => tierKey,
    };
}

/// <summary>A role a person holds, for display: a tier, a catalogue role in an org, or a cross-org role.</summary>
/// <param name="Kind"><c>tier</c>, <c>catalogue</c> or <c>crossOrg</c>.</param>
public record RoleDto(string Key, string Name, string Kind, Guid? OrganizationId = null, string? OrganizationName = null);
