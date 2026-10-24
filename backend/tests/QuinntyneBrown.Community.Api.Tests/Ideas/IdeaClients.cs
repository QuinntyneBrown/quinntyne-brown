using QuinntyneBrown.Community.Api.Tests.Profiles;

namespace QuinntyneBrown.Community.Api.Tests.Ideas;

/// <summary>Callers and payloads for the Ideas endpoints (docs/detailed-designs/ideas).</summary>
public static class IdeaClients
{
    public sealed record Settings(bool AskStage, bool AskPeople, DateTimeOffset? UpdatedAt);

    public sealed record Form(bool AskStage, bool AskPeople);

    public const string SettingsPath = "/api/admin/ideas/settings";

    public const string FormPath = "/api/ideas/form";

    public const string SubmitPath = "/api/ideas";

    /// <summary>A new member of FaithTech Toronto signed in with the given roles.</summary>
    public static async Task<HttpClient> SignedInAsync(this CommunityApiFactory factory, params SeededRole[] roles) =>
        factory.ClientFor(await factory.AddMemberAsync($"Person {Guid.NewGuid():N}"[..14]), "faithtech-toronto", roles);

    public static async Task<(HttpClient Client, ProfileClients.Member Member)> MemberAsync(this CommunityApiFactory factory, string name, params SeededRole[] roles)
    {
        var member = await factory.AddMemberAsync(name);
        return (factory.ClientFor(member, "faithtech-toronto", roles), member);
    }
}

/// <summary>Submission bodies as the wizard posts them.</summary>
public static class IdeaBodies
{
    public sealed record Submitted(Guid Id, string Title, string Name, string Email);

    /// <summary>ShiftShare from the mocks, as a visitor who is not signed in submits it.</summary>
    public static Dictionary<string, object?> Visitor(Action<Dictionary<string, object?>>? change = null)
    {
        var body = new Dictionary<string, object?>
        {
            ["problem"] = "Shelter volunteers in Toronto still coordinate shifts over group texts, so nights go uncovered and coordinators burn out.",
            ["audience"] = "nonprofits",
            ["title"] = "ShiftShare",
            ["pitch"] = "Shift sign-ups for shelter volunteers that fill gaps before they happen.",
            ["solution"] = "Coordinators post open shifts. Volunteers get a text, tap to claim, and see who else is on.\nUncovered shifts ping the backup list 24 hours ahead.",
            ["name"] = "Hannah Kim",
            ["email"] = "hannah.kim@example.org",
        };
        change?.Invoke(body);
        return body;
    }

    /// <summary>The same idea with both optional steps answered, as a signed-in member submits it.</summary>
    public static Dictionary<string, object?> WithOptionalSteps(Action<Dictionary<string, object?>>? change = null) =>
        Visitor(body =>
        {
            body["stage"] = "sketches";
            body["platform"] = "both";
            body["topics"] = new[] { "Community", "Faith", "Housing", "Mental health", "Volunteering" };
            body["skills"] = new[] { "Product Engineer", "Designer", "Domain expert" };
            body["involvement"] = "lead";
            body["commitment"] = "weekly";
            change?.Invoke(body);
        });
}
