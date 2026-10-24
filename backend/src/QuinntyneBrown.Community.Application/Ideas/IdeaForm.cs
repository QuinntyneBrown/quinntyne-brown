using QuinntyneBrown.Community.Application.Admin;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Profiles;
using QuinntyneBrown.Community.Domain.Ideas;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Ideas;

/// <summary>The Idea form as System Admin sees it (L2-181).</summary>
public record IdeaFormSettingsDto(bool AskStage, bool AskPeople, DateTimeOffset? UpdatedAt);

/// <summary>Only what the wizard needs to plan its steps (L2-171, L2-181 AC4).</summary>
public record IdeaFormDto(bool AskStage, bool AskPeople);

public record SaveIdeaFormCommand(bool? AskStage, bool? AskPeople);

/// <summary>
/// Reads and changes the platform intake's switches (ADR 0044). Reading or changing them is System Admin only and
/// anyone else is told they do not exist; every save is audited. Signed-in members read the two values.
/// </summary>
public class IdeaFormHandler(IApplicationDbContext db, ICurrentUser current, ProfileAccess access, IAuditLog audit, TimeProvider time)
{
    public async Task<(Result Result, IdeaFormSettingsDto? Settings)> GetSettingsAsync(CancellationToken cancellationToken = default)
    {
        if (!current.Access.IsSystemAdmin
            || await db.IdeaIntakes.AsNoTracking().SingleOrDefaultAsync(i => i.Id == IdeaIntake.PlatformId, cancellationToken) is not { } intake)
        {
            return (Result.NotFound(), null);
        }

        return (Result.Ok(), ToDto(intake));
    }

    public async Task<(Result Result, IdeaFormSettingsDto? Settings)> SaveSettingsAsync(SaveIdeaFormCommand command, CancellationToken cancellationToken = default)
    {
        if (!current.Access.IsSystemAdmin
            || await db.IdeaIntakes.SingleOrDefaultAsync(i => i.Id == IdeaIntake.PlatformId, cancellationToken) is not { } intake)
        {
            return (Result.NotFound(), null);
        }

        var errors = new Dictionary<string, string[]>();
        if (command.AskStage is null)
        {
            errors["askStage"] = ["Say whether to ask “How far along is it?”."];
        }

        if (command.AskPeople is null)
        {
            errors["askPeople"] = ["Say whether to ask “Who do you need?”."];
        }

        if (errors.Count > 0)
        {
            return (new Result(ResultStatus.Invalid, errors), null);
        }

        var actor = await access.CallerProfileIdAsync(cancellationToken) ?? Guid.Empty;
        var before = new { intake.AskStage, intake.AskPeople };
        intake.SetSteps(command.AskStage!.Value, command.AskPeople!.Value, actor, time.GetUtcNow());
        audit.Record(actor, "ideas.formChanged", nameof(IdeaIntake), intake.Id.ToString(), before, new { intake.AskStage, intake.AskPeople }, intake.OrganizationId);
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), ToDto(intake));
    }

    /// <summary>The switches for a signed-in member's wizard; with no intake there are no optional steps.</summary>
    public async Task<IdeaFormDto> GetFormAsync(CancellationToken cancellationToken = default)
    {
        var intake = await db.IdeaIntakes.AsNoTracking().SingleOrDefaultAsync(i => i.Id == IdeaIntake.PlatformId, cancellationToken);
        return intake is null ? new IdeaFormDto(false, false) : new IdeaFormDto(intake.AskStage, intake.AskPeople);
    }

    private static IdeaFormSettingsDto ToDto(IdeaIntake intake) => new(intake.AskStage, intake.AskPeople, intake.UpdatedAt);
}
