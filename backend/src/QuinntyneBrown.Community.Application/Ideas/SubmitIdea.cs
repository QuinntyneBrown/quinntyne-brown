using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Domain.Ideas;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Ideas;

/// <summary>A submission as the wizard posts it (docs/detailed-designs/ideas/submit). Every field is checked on the server.</summary>
public record SubmitIdeaCommand(
    string? Problem,
    string? Audience,
    string? Title,
    string? Pitch,
    string? Solution,
    string? Stage = null,
    string? Platform = null,
    IReadOnlyList<string>? Topics = null,
    IReadOnlyList<string>? Skills = null,
    string? Involvement = null,
    string? Commitment = null,
    string? Name = null,
    string? Email = null);

/// <summary>What the success page needs (L2-176 AC4).</summary>
public record SubmittedIdeaDto(Guid Id, string Title, string Name, string Email);

/// <summary>The optional steps a submitter is asked, in order (L2-171).</summary>
public record IdeaSteps(bool Stage, bool People)
{
    /// <summary>A visitor who is not signed in never gets the optional steps, whatever the switches say (L2-171 AC3).</summary>
    public static IdeaSteps For(bool signedIn, IdeaIntake intake) =>
        new(signedIn && intake.AskStage, signedIn && intake.AskPeople);
}

/// <summary>
/// The rules of every step (L2-169, L2-170, L2-172, L2-173, L2-175, L2-177 AC4), with the mocks' messages. Name and
/// email are checked only for a visitor; the optional answers only for the steps that count. Internal, because it is
/// built per request with those flags rather than resolved from the container.
/// </summary>
internal sealed class SubmitIdeaValidator : AbstractValidator<SubmitIdeaCommand>
{
    public SubmitIdeaValidator(bool needsContact, IdeaSteps steps)
    {
        RuleFor(x => x.Problem).Cascade(CascadeMode.Stop)
            .Must(v => (v?.Trim().Length ?? 0) >= IdeaOptions.ProblemMinLength).WithMessage("Add a little more detail, at least 30 characters")
            .Must(v => v!.Trim().Length <= IdeaOptions.ProblemMaxLength).WithMessage("Use 600 characters or fewer for the problem");
        RuleFor(x => x.Audience)
            .Must(v => v is not null && IdeaOptions.Audiences.ContainsKey(v)).WithMessage("Choose who feels this problem most");
        Required(x => x.Title, "Name your idea", IdeaOptions.TitleMaxLength, "the name");
        Required(x => x.Pitch, "Add a one-line pitch", IdeaOptions.PitchMaxLength, "the pitch");
        Required(x => x.Solution, "Say how it would work", IdeaOptions.SolutionMaxLength, "how it would work");

        if (steps.Stage)
        {
            OneOf(x => x.Stage, IdeaOptions.Stages);
            OneOf(x => x.Platform, IdeaOptions.Platforms);
            RuleFor(x => x.Topics).Cascade(CascadeMode.Stop)
                .Must(t => t is null || t.All(IdeaOptions.Topics.Contains)).WithMessage("Choose topics from the list")
                .Must(t => t is null || t.Distinct().Count() <= IdeaOptions.MaxTopics).WithMessage("Choose up to 5 topics");
        }

        if (steps.People)
        {
            RuleFor(x => x.Skills)
                .Must(s => s is null || s.All(IdeaOptions.Skills.Contains)).WithMessage("Choose skills from the list");
            OneOf(x => x.Involvement, IdeaOptions.Involvements);
            OneOf(x => x.Commitment, IdeaOptions.Commitments);
        }

        if (needsContact)
        {
            Required(x => x.Name, "Enter your name", IdeaOptions.NameMaxLength, "your name");
            RuleFor(x => x.Email).Cascade(CascadeMode.Stop)
                .Must(e => !string.IsNullOrWhiteSpace(e) && IsEmail(e.Trim())).WithMessage("Enter an email like name@example.org")
                .Must(e => e!.Trim().Length <= IdeaOptions.EmailMaxLength).WithMessage("Use 254 characters or fewer for your email");
        }
    }

    private void Required(System.Linq.Expressions.Expression<Func<SubmitIdeaCommand, string?>> field, string missing, int max, string what) =>
        RuleFor(field).Cascade(CascadeMode.Stop)
            .Must(v => !string.IsNullOrWhiteSpace(v)).WithMessage(missing)
            .Must(v => v!.Trim().Length <= max).WithMessage($"Use {max} characters or fewer for {what}");

    private void OneOf(System.Linq.Expressions.Expression<Func<SubmitIdeaCommand, string?>> field, IReadOnlyDictionary<string, string> options) =>
        RuleFor(field).Must(v => v is null || options.ContainsKey(v)).WithMessage("Choose one of the options");

    // name@domain.tld: one @, a dot in the domain, no spaces (the guest RSVP's rule).
    private static bool IsEmail(string value)
    {
        var at = value.IndexOf('@', StringComparison.Ordinal);
        return at > 0 && at == value.LastIndexOf('@') && value.IndexOf(' ', StringComparison.Ordinal) < 0
            && value.LastIndexOf('.') > at + 1 && !value.EndsWith('.');
    }
}

/// <summary>
/// Stores a submitted idea under the platform intake (L2-177, ADR 0044). The endpoint is anonymous: a visitor gives a
/// name and email, a signed-in member's come from the account and the idea is linked to their profile. Answers to
/// steps the submitter was not asked are ignored.
/// </summary>
public class SubmitIdeaHandler(IApplicationDbContext db, ICurrentUser current, TimeProvider time)
{
    public async Task<(Result Result, SubmittedIdeaDto? Idea)> HandleAsync(SubmitIdeaCommand command, CancellationToken cancellationToken = default)
    {
        var intake = await db.IdeaIntakes.AsNoTracking().SingleOrDefaultAsync(i => i.Id == IdeaIntake.PlatformId, cancellationToken);
        if (intake is null)
        {
            return (Result.NotFound(), null);
        }

        var author = current.UserId is { } userId
            ? await db.Users.Where(u => u.Id == userId)
                .Join(db.Profiles, u => u.ProfileId, p => p.Id, (u, p) => new { p.Id, p.Name, u.Email })
                .SingleOrDefaultAsync(cancellationToken)
            : null;
        var steps = IdeaSteps.For(author is not null, intake);
        var validation = await new SubmitIdeaValidator(author is null, steps).ValidateAsync(command, cancellationToken);
        if (!validation.IsValid)
        {
            return (new Result(ResultStatus.Invalid, validation.Errors
                .GroupBy(e => char.ToLowerInvariant(e.PropertyName[0]) + e.PropertyName[1..])
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray())), null);
        }

        var idea = new Idea(
            intake.OrganizationId,
            author?.Id,
            author?.Name ?? command.Name!.Trim(),
            author?.Email ?? command.Email!.Trim(),
            command.Problem!.Trim(),
            command.Audience!,
            command.Title!.Trim(),
            command.Pitch!.Trim(),
            command.Solution!.Trim(),
            steps.Stage ? new IdeaShape(command.Stage, command.Platform, [.. (command.Topics ?? []).Distinct()]) : null,
            steps.People ? new IdeaPeople([.. (command.Skills ?? []).Distinct()], command.Involvement, command.Commitment) : null,
            time.GetUtcNow());
        db.Ideas.Add(idea);
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), new SubmittedIdeaDto(idea.Id, idea.Title, idea.SubmitterName, idea.SubmitterEmail));
    }
}
