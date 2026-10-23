using QuinntyneBrown.Community.Domain.Organizations;
using static QuinntyneBrown.Community.Domain.Organizations.Permissions;

namespace QuinntyneBrown.Community.Infrastructure.Persistence;

/// <summary>
/// The organization hierarchy the platform starts with (ADR 0040, L2-157), with fixed ids so the seed is idempotent:
/// the portfolio, the FaithTech City and Startup types and catalogues, FaithTech Toronto and Shelfie, and the Portfolio
/// and Staff cross-org roles. The FaithTech City catalogue reproduces the roles matrix from before the hierarchy.
/// </summary>
public static class HierarchySeed
{
    public static readonly Guid PortfolioId = new("0a7e6c41-0000-4000-8000-000000000001");
    public static readonly Guid FaithTechCityTypeId = new("0a7e6c41-0000-4000-8000-000000000010");
    public static readonly Guid StartupTypeId = new("0a7e6c41-0000-4000-8000-000000000020");
    public static readonly Guid TorontoId = new("0a7e6c41-0000-4000-8000-000000000100");
    public static readonly Guid ShelfieId = new("0a7e6c41-0000-4000-8000-000000000200");
    public static readonly Guid PortfolioRoleId = new("0a7e6c41-0000-4000-8000-000000001001");
    public static readonly Guid StaffRoleId = new("0a7e6c41-0000-4000-8000-000000001002");

    public const string TorontoSlug = "faithtech-toronto";
    public const string ShelfieSlug = "shelfie";

    /// <summary>A catalogue role as seeded: its fixed id, key, name, description, parent key and permissions.</summary>
    public record SeededRole(Guid Id, string Key, string Name, string Description, string? Parent, string[] Permissions, string[] CanGrant);

    private static readonly string[] LeadPermissions =
    [
        InvitesSend, ContactsPrivate, PartnersRead, PartnersWrite, EventsRsvpList, EventsRsvpListEmails, EventsCheckIn,
        ResourcesCreate, WorkspacesJoin, TeamMember, TeamLead,
    ];

    public static IReadOnlyList<SeededRole> FaithTechCityRoles { get; } =
    [
        new(new("0a7e6c41-0000-4000-8000-000000000011"), "city-lead", "City Lead", "Leads a city team and manages its roles", null,
            [.. LeadPermissions, PeopleView, RolesGrant, ConnectLinkOwn, EventsManage, WorkspacesCreate],
            ["event-lead", "create-lead", "communications-lead", "volunteer", "product-engineer", "attendee"]),
        new(new("0a7e6c41-0000-4000-8000-000000000012"), "event-lead", "Event Lead", "Creates and manages events", "city-lead",
            [.. LeadPermissions, EventsManage], []),
        new(new("0a7e6c41-0000-4000-8000-000000000013"), "create-lead", "Create Lead", "Runs hackathon builders and projects", "city-lead",
            LeadPermissions, []),
        new(new("0a7e6c41-0000-4000-8000-000000000014"), "communications-lead", "Communications Lead", "Sends announcements", "city-lead",
            [.. LeadPermissions, AnnouncementsSend], []),
        new(new("0a7e6c41-0000-4000-8000-000000000015"), "volunteer", "Volunteer", "Joins the city team", "event-lead",
            [WorkspacesJoin, TeamMember], []),
        new(new("0a7e6c41-0000-4000-8000-000000000016"), "product-engineer", "Product Engineer", "Builds at hackathons", "event-lead",
            [], []),
        new(new("0a7e6c41-0000-4000-8000-000000000017"), "attendee", "Attendee", "Comes to events", "volunteer",
            [], []),
    ];

    public static IReadOnlyList<SeededRole> StartupRoles { get; } =
    [
        new(new("0a7e6c41-0000-4000-8000-000000000021"), "engineer", "Engineer", "Builds the product", null,
            [InvitesSend, ResourcesCreate, WorkspacesCreate, WorkspacesJoin], []),
        new(new("0a7e6c41-0000-4000-8000-000000000022"), "advisor", "Advisor", "Advises the team", null,
            [ResourcesCreate, WorkspacesJoin], []),
    ];

    public static Portfolio Portfolio() => new("Quinntyne Brown", "quinntyne-brown", PortfolioId);

    public static OrgType FaithTechCity() => new(PortfolioId, "faithtech-city", "FaithTech City", Features.Switchable, [NotesCreate], FaithTechCityTypeId);

    public static OrgType Startup() => new(
        PortfolioId, "startup", "Startup", [Features.Invites, Features.Resources, Features.Agile], [NotesCreate], StartupTypeId);

    public static Organization Toronto() => new(PortfolioId, FaithTechCityTypeId, "FaithTech Toronto", TorontoSlug, TorontoId);

    public static Organization Shelfie() => new(PortfolioId, StartupTypeId, "Shelfie", ShelfieSlug, ShelfieId);

    /// <summary>Reads everything in the portfolio except private items, and can be assigned work (ADR 0035).</summary>
    public static CrossOrgRole PortfolioRole() => new(
        PortfolioId, "portfolio", "Portfolio", "Reads every org in the portfolio and can be assigned work",
        [PeopleView, PartnersRead, EventsRsvpList, WorkspacesReadAll, ReportsView], canJoinWork: true, PortfolioRoleId);

    /// <summary>Today's Staff: read nearly everything in every FaithTech City org, write own resources and pages (ADR 0035).</summary>
    public static CrossOrgRole StaffRole()
    {
        var staff = new CrossOrgRole(
            PortfolioId, "staff", "Staff", "Read-only oversight across FaithTech",
            [PeopleView, PartnersRead, EventsRsvpList, WorkspacesReadAll, ReportsView, ResourcesCreate, NotesCreate], canJoinWork: false, StaffRoleId);
        staff.ScopeToOrgType(FaithTechCityTypeId);
        return staff;
    }

    /// <summary>The catalogue as role definitions, with parents and CanGrant lists resolved to ids.</summary>
    public static IReadOnlyList<RoleDefinition> Catalogue(Guid orgTypeId, IReadOnlyList<SeededRole> roles)
    {
        var ids = roles.ToDictionary(r => r.Key, r => r.Id);
        return
        [
            .. roles.Select((r, i) =>
            {
                var role = new RoleDefinition(orgTypeId, r.Key, r.Name, r.Description, i, r.Permissions, r.Parent is null ? null : ids[r.Parent], r.Id);
                role.SetCanGrant(r.CanGrant.Select(k => ids[k]));
                return role;
            }),
        ];
    }
}
