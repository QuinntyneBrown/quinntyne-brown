namespace QuinntyneBrown.Community.Domain.Ideas;

/// <summary>Where an idea stands. Every idea starts New; triage is a follow-up feature (L1-027).</summary>
public enum IdeaStatus
{
    New,
}

/// <summary>The answers to the "How far along is it?" step, all optional (L2-172).</summary>
public record IdeaShape(string? Stage, string? Platform, IReadOnlyList<string> Topics);

/// <summary>The answers to the "Who do you need?" step, all optional (L2-173).</summary>
public record IdeaPeople(IReadOnlyList<string> Skills, string? Involvement, string? Commitment);

/// <summary>
/// One submitted app idea (L2-177), owned by the platform intake's organization (ADR 0044). A signed-in submitter's
/// profile is linked; a visitor's name and email are kept as given.
/// </summary>
public class Idea
{
    private Idea() { }

    public Idea(
        Guid organizationId,
        Guid? authorProfileId,
        string submitterName,
        string submitterEmail,
        string problem,
        string audience,
        string title,
        string pitch,
        string solution,
        IdeaShape? shape,
        IdeaPeople? people,
        DateTimeOffset submittedAt)
    {
        Id = Guid.NewGuid();
        OrganizationId = organizationId;
        AuthorProfileId = authorProfileId;
        SubmitterName = submitterName;
        SubmitterEmail = submitterEmail;
        Problem = problem;
        Audience = audience;
        Title = title;
        Pitch = pitch;
        Solution = solution;
        Stage = shape?.Stage;
        Platform = shape?.Platform;
        Topics = [.. shape?.Topics ?? []];
        Skills = [.. people?.Skills ?? []];
        Involvement = people?.Involvement;
        Commitment = people?.Commitment;
        Status = IdeaStatus.New;
        SubmittedAt = submittedAt;
    }

    public Guid Id { get; private set; }

    public Guid OrganizationId { get; private set; }

    public Guid? AuthorProfileId { get; private set; }

    public string SubmitterName { get; private set; } = string.Empty;

    public string SubmitterEmail { get; private set; } = string.Empty;

    public string Problem { get; private set; } = string.Empty;

    /// <summary>An <see cref="IdeaOptions.Audiences"/> key.</summary>
    public string Audience { get; private set; } = string.Empty;

    public string Title { get; private set; } = string.Empty;

    public string Pitch { get; private set; } = string.Empty;

    public string Solution { get; private set; } = string.Empty;

    public string? Stage { get; private set; }

    public string? Platform { get; private set; }

    public List<string> Topics { get; private set; } = [];

    public List<string> Skills { get; private set; } = [];

    public string? Involvement { get; private set; }

    public string? Commitment { get; private set; }

    public IdeaStatus Status { get; private set; }

    public DateTimeOffset SubmittedAt { get; private set; }
}
