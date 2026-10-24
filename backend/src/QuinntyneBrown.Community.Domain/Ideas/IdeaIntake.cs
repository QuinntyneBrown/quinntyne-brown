namespace QuinntyneBrown.Community.Domain.Ideas;

/// <summary>
/// The platform intake (ADR 0044): the one row that owns every idea, in the portfolio's root organization, and holds
/// the Idea form switches for the two optional steps (L2-171, L2-181). Both are on until a System Admin turns them off.
/// </summary>
public class IdeaIntake
{
    /// <summary>The intake's fixed id, so the seed can create it idempotently.</summary>
    public static readonly Guid PlatformId = new("0a7e6c41-0000-4000-8000-000000010001");

    private IdeaIntake() { }

    public IdeaIntake(Guid organizationId, Guid? id = null)
    {
        Id = id ?? PlatformId;
        OrganizationId = organizationId;
    }

    public Guid Id { get; private set; }

    /// <summary>The org every idea belongs to: the portfolio's root organization.</summary>
    public Guid OrganizationId { get; private set; }

    /// <summary>Signed-in members are asked "How far along is it?".</summary>
    public bool AskStage { get; private set; } = true;

    /// <summary>Signed-in members are asked "Who do you need?".</summary>
    public bool AskPeople { get; private set; } = true;

    public DateTimeOffset? UpdatedAt { get; private set; }

    public Guid? UpdatedByProfileId { get; private set; }

    public void SetSteps(bool askStage, bool askPeople, Guid by, DateTimeOffset at)
    {
        AskStage = askStage;
        AskPeople = askPeople;
        UpdatedByProfileId = by;
        UpdatedAt = at;
    }
}
