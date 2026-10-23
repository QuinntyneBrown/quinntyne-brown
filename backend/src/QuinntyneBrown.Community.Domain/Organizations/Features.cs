namespace QuinntyneBrown.Community.Domain.Organizations;

/// <summary>
/// The features an Org Type can switch (ADR 0038). <see cref="Profiles"/> and <see cref="Notes"/> are always on;
/// the rest are on only when the org's type lists them.
/// </summary>
public static class Features
{
    public const string Profiles = "profiles";
    public const string Notes = "notes";
    public const string Contacts = "contacts";
    public const string Partners = "partners";
    public const string Team = "team";
    public const string Events = "events";
    public const string Announcements = "announcements";
    public const string Invites = "invites";
    public const string Resources = "resources";
    public const string Agile = "agile";
    public const string Reports = "reports";
    /// <summary>Application integrations: inbound webhooks and the Applications screens (ADR 0042).</summary>
    public const string Integrations = "integrations";

    public static IReadOnlyList<string> AlwaysOn { get; } = [Profiles, Notes];

    public static IReadOnlyList<string> Switchable { get; } =
        [Contacts, Partners, Team, Events, Announcements, Invites, Resources, Agile, Reports, Integrations];

    public static IReadOnlyList<string> All { get; } = [.. AlwaysOn, .. Switchable];

    public static bool IsKnown(string feature) => All.Contains(feature);
}
