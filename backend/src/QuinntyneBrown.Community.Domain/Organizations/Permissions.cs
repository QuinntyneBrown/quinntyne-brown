namespace QuinntyneBrown.Community.Domain.Organizations;

/// <summary>
/// The permission codes the server checks (ADR 0033). Roles are data bundles of these codes; nothing checks a
/// role's name. Each code belongs to one feature, so a feature switched off for an Org Type grants nothing.
/// </summary>
public static class Permissions
{
    public const string PeopleView = "people.view";
    public const string RolesGrant = "roles.grant";
    public const string InvitesSend = "invites.send";
    public const string ConnectLinkOwn = "connectLink.own";
    public const string ContactsPrivate = "contacts.private";
    public const string PartnersRead = "partners.read";
    public const string PartnersWrite = "partners.write";
    public const string EventsManage = "events.manage";
    public const string EventsRsvpList = "events.rsvpList";
    public const string EventsRsvpListEmails = "events.rsvpListEmails";
    public const string EventsCheckIn = "events.checkIn";
    public const string AnnouncementsSend = "announcements.send";
    public const string ResourcesCreate = "resources.create";
    public const string NotesCreate = "notes.create";
    public const string WorkspacesCreate = "workspaces.create";
    public const string WorkspacesJoin = "workspaces.join";
    public const string WorkspacesReadAll = "workspaces.readAll";
    public const string ReportsView = "reports.view";
    /// <summary>Read the org's applications and their events (L2-165, L2-166).</summary>
    public const string IntegrationsView = "integrations.view";
    /// <summary>Register applications, rotate their secrets and revoke them (L2-158 to L2-160).</summary>
    public const string IntegrationsManage = "integrations.manage";
    /// <summary>A marker: listed on the org's Team page (L2-019).</summary>
    public const string TeamMember = "team.member";
    /// <summary>A marker: matched by the Team page's Leads filter (L2-019).</summary>
    public const string TeamLead = "team.lead";

    /// <summary>Every code with the feature it belongs to, in display order.</summary>
    public static IReadOnlyDictionary<string, string> FeatureOf { get; } = new Dictionary<string, string>
    {
        [PeopleView] = Features.Profiles,
        [RolesGrant] = Features.Profiles,
        [InvitesSend] = Features.Invites,
        [ConnectLinkOwn] = Features.Invites,
        [ContactsPrivate] = Features.Contacts,
        [PartnersRead] = Features.Partners,
        [PartnersWrite] = Features.Partners,
        [EventsManage] = Features.Events,
        [EventsRsvpList] = Features.Events,
        [EventsRsvpListEmails] = Features.Events,
        [EventsCheckIn] = Features.Events,
        [AnnouncementsSend] = Features.Announcements,
        [ResourcesCreate] = Features.Resources,
        [NotesCreate] = Features.Notes,
        [WorkspacesCreate] = Features.Agile,
        [WorkspacesJoin] = Features.Agile,
        [WorkspacesReadAll] = Features.Agile,
        [ReportsView] = Features.Reports,
        [IntegrationsView] = Features.Integrations,
        [IntegrationsManage] = Features.Integrations,
        [TeamMember] = Features.Team,
        [TeamLead] = Features.Team,
    };

    public static IReadOnlyList<string> All { get; } = [.. FeatureOf.Keys];

    public static bool IsKnown(string code) => FeatureOf.ContainsKey(code);
}
