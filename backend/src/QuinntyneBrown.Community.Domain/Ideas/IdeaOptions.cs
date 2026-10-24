namespace QuinntyneBrown.Community.Domain.Ideas;

/// <summary>
/// The fixed choices and limits of the Submit an idea wizard (docs/detailed-designs/ideas/submit), keyed as the API
/// takes them, with the labels the mocks show. The web app's idea-options.ts and the e2e fake mirror this table.
/// </summary>
public static class IdeaOptions
{
    public const int ProblemMinLength = 30;
    public const int ProblemMaxLength = 600;
    public const int TitleMaxLength = 60;
    public const int PitchMaxLength = 140;
    public const int SolutionMaxLength = 1000;
    public const int NameMaxLength = 100;
    public const int EmailMaxLength = 254;
    public const int MaxTopics = 5;
    public const int KeyMaxLength = 32;

    public static IReadOnlyDictionary<string, string> Audiences { get; } = new Dictionary<string, string>
    {
        ["churches"] = "Churches and ministries",
        ["nonprofits"] = "Nonprofits and shelters",
        ["families"] = "Families",
        ["students"] = "Students and young adults",
        ["newcomers"] = "Newcomers to Canada",
        ["small-business"] = "Small businesses",
    };

    public static IReadOnlyDictionary<string, string> Stages { get; } = new Dictionary<string, string>
    {
        ["idea"] = "Just an idea",
        ["sketches"] = "Sketches or notes",
        ["prototype"] = "Working prototype",
        ["live"] = "Already in use",
    };

    public static IReadOnlyDictionary<string, string> Platforms { get; } = new Dictionary<string, string>
    {
        ["web"] = "Web app",
        ["mobile"] = "Phone app",
        ["both"] = "Both",
        ["unsure"] = "Not sure yet",
    };

    public static IReadOnlyList<string> Topics { get; } =
        ["Accessibility", "AI", "Community", "Education", "Faith", "Housing", "Mental health", "Prayer", "Volunteering"];

    public static IReadOnlyList<string> Skills { get; } =
        ["Product Engineer", "Designer", "Product manager", "Data and AI", "Domain expert", "Marketing and comms"];

    public static IReadOnlyDictionary<string, string> Involvements { get; } = new Dictionary<string, string>
    {
        ["lead"] = "I want to lead it",
        ["contribute"] = "I’ll help build it",
        ["share"] = "I’m sharing it for others",
    };

    public static IReadOnlyDictionary<string, string> Commitments { get; } = new Dictionary<string, string>
    {
        ["monthly"] = "A few hours a month",
        ["weekly"] = "A few hours a week",
        ["part-time"] = "Part-time or more",
    };
}
