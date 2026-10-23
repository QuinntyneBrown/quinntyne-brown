using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Notifications;
using QuinntyneBrown.Community.Domain.Announcements;
using QuinntyneBrown.Community.Domain.Notifications;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Domain.Organizations;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace QuinntyneBrown.Community.Application.Announcements;

/// <summary>
/// Who an announcement goes to: <c>Everyone</c> in the org, <c>Roles</c> (one or more catalogue role keys of the org),
/// one event's <c>EventRsvps</c>, or <c>Portfolio</c>: every member of every org of the portfolio (L2-151).
/// </summary>
public record AudienceRequest(string? Kind, IReadOnlyList<string>? Roles = null, Guid? EventId = null);

/// <summary>A new announcement (L2-029). "Also send by email" is on unless turned off.</summary>
public record SendAnnouncementCommand(string? Subject, string? Body, AudienceRequest? Audience, bool AlsoEmail = true);

public record AnnouncementSent(Guid Id, int RecipientCount, int EmailCount);

public static class AnnouncementRules
{
    public const int MaxSubject = 200;
    public const int MaxBody = 5000;
    public const string SubjectMessage = "Add a subject so people know what it’s about.";
    public const string BodyMessage = "Write a message of at least one sentence.";
    public const string RolesMessage = "Choose at least one role.";
    public const string EventMessage = "Choose an event.";
    public const string PortfolioMessage = "Only the Portfolio Lead can send to everyone in the portfolio.";
}

public class AudienceRequestValidator : AbstractValidator<AudienceRequest>
{
    public AudienceRequestValidator()
    {
        RuleFor(x => x.Kind)
            .Must(k => Enum.TryParse<AudienceKind>(k, out _) && !int.TryParse(k, out _))
            .WithMessage("Choose who to send it to.");
        When(x => x.Kind == nameof(AudienceKind.Roles), () =>
        {
            RuleFor(x => x.Roles).Cascade(CascadeMode.Stop)
                .Must(r => r is { Count: > 0 }).WithMessage(AnnouncementRules.RolesMessage)
                .Must(r => r!.All(k => !string.IsNullOrWhiteSpace(k))).WithMessage(AnnouncementRules.RolesMessage);
        });
        When(x => x.Kind == nameof(AudienceKind.EventRsvps), () =>
            RuleFor(x => x.EventId).NotNull().WithMessage(AnnouncementRules.EventMessage));
    }
}

public class SendAnnouncementValidator : AbstractValidator<SendAnnouncementCommand>
{
    public SendAnnouncementValidator()
    {
        RuleFor(x => x.Subject).Cascade(CascadeMode.Stop)
            .Must(s => !string.IsNullOrWhiteSpace(s)).WithMessage(AnnouncementRules.SubjectMessage)
            .Must(s => s!.Trim().Length <= AnnouncementRules.MaxSubject)
            .WithMessage($"Use {AnnouncementRules.MaxSubject} characters or fewer for the subject.");
        RuleFor(x => x.Body).Cascade(CascadeMode.Stop)
            .Must(b => !string.IsNullOrWhiteSpace(b)).WithMessage(AnnouncementRules.BodyMessage)
            .Must(b => b!.Trim().Length <= AnnouncementRules.MaxBody)
            .WithMessage($"Use {AnnouncementRules.MaxBody} characters or fewer for the message.");
        RuleFor(x => x.Audience).NotNull().WithMessage("Choose who to send it to.").SetValidator(new AudienceRequestValidator()!);
    }
}

/// <summary>
/// Holders of <c>announcements.send</c> (the Communications Lead, the Org Lead) send announcements to their org; only
/// the Portfolio Lead sends portfolio-wide; everyone else gets 403 (L2-029 AC3, L2-151).
/// </summary>
public class AnnouncementAccess(ICurrentUser current)
{
    public bool CanSend => current.Access.HasAnywhere(Permissions.AnnouncementsSend);

    /// <summary>The org an announcement is sent from.</summary>
    public CreateTarget Target() => current.Access.TargetFor(Permissions.AnnouncementsSend);

    public bool CanSendPortfolioWide(Guid orgId) => current.Access.IsSystemAdmin || current.Access.IsPortfolioLead(orgId);
}

/// <summary>
/// Resolves an audience to the members who receive it: members of the org (or of every org of its portfolio) with an
/// account who are not suspended (ADR 0016). Guests who RSVP'd have no account, so an RSVP audience counts members only.
/// </summary>
public class AudienceResolver(IApplicationDbContext db, ShareRoles shareRoles)
{
    public async Task<List<Guid>> RecipientIdsAsync(AnnouncementAudience audience, Guid orgId, CancellationToken cancellationToken = default)
    {
        var orgIds = new List<Guid> { orgId };
        if (audience.Kind == AudienceKind.Portfolio)
        {
            var portfolio = await db.Organizations.Where(o => o.Id == orgId).Select(o => o.PortfolioId).SingleAsync(cancellationToken);
            orgIds = await db.Organizations.Where(o => o.PortfolioId == portfolio && o.ArchivedAtUtc == null).Select(o => o.Id).ToListAsync(cancellationToken);
        }

        var members = from user in db.Users
                      join profile in db.Profiles on user.ProfileId equals profile.Id
                      where !profile.IsSuspended && db.OrgMemberships.Any(m => m.ProfileId == profile.Id && orgIds.Contains(m.OrganizationId))
                      select profile;
        switch (audience.Kind)
        {
            case AudienceKind.Roles:
                var holders = await shareRoles.HoldersAsync(orgId, [.. audience.Roles], cancellationToken);
                members = members.Where(p => holders.Contains(p.Id));
                break;
            case AudienceKind.EventRsvps:
                members = members.Where(p => db.Events.Where(e => e.Id == audience.EventId).SelectMany(e => e.Rsvps).Any(r => r.ProfileId == p.Id));
                break;
        }

        return await members.Select(p => p.Id).Distinct().ToListAsync(cancellationToken);
    }

    /// <summary>The domain audience for a validated request in the org, or a refusal (unknown event or role).</summary>
    public async Task<(AnnouncementAudience? Audience, Result? Refusal)> FromRequestAsync(AudienceRequest request, Guid orgId, CancellationToken cancellationToken = default)
    {
        var kind = Enum.Parse<AudienceKind>(request.Kind!);
        switch (kind)
        {
            case AudienceKind.Everyone:
                return (AnnouncementAudience.Everyone(), null);
            case AudienceKind.Portfolio:
                return (AnnouncementAudience.Portfolio(), null);
            case AudienceKind.Roles:
                var roles = await shareRoles.ResolveAsync(orgId, request.Roles!, cancellationToken);
                return roles is null
                    ? (null, Result.Invalid("Audience.Roles", AnnouncementRules.RolesMessage))
                    : (AnnouncementAudience.ForRoles([.. roles]), null);
            default:
                return await db.Events.AnyAsync(e => e.Id == request.EventId && e.OrganizationId == orgId, cancellationToken)
                    ? (AnnouncementAudience.ForEventRsvps(request.EventId!.Value), null)
                    : (null, Result.Invalid("Audience.EventId", AnnouncementRules.EventMessage));
        }
    }
}

/// <summary>
/// Previews the recipient count and sends announcements (L2-029). Each recipient gets an in-app notification and,
/// with "Also send by email" on and unless they opted out, an email, all saved with the announcement in one save.
/// </summary>
public class SendAnnouncementHandler(
    IApplicationDbContext db,
    ICurrentUser current,
    AnnouncementAccess access,
    AudienceResolver audiences,
    INotificationPublisher publisher,
    IUnsubscribeTokens unsubscribe,
    IOptions<WebAppOptions> webApp,
    TimeProvider time)
{
    public const string LinkPath = "/announcements";

    public async Task<(Result Result, int Count)> CountAsync(AudienceRequest request, CancellationToken cancellationToken = default)
    {
        var target = access.Target();
        if (!target.Allowed)
        {
            return (target.Refusal!, 0);
        }

        if (request.Kind == nameof(AudienceKind.Portfolio) && !access.CanSendPortfolioWide(target.OrgId))
        {
            return (Result.Forbidden(AnnouncementRules.PortfolioMessage), 0);
        }

        var (audience, refusal) = await audiences.FromRequestAsync(request, target.OrgId, cancellationToken);
        return audience is null
            ? (refusal! with { Errors = refusal.Errors?.ToDictionary(e => e.Key.Replace("Audience.", string.Empty), e => e.Value) }, 0)
            : (Result.Ok(), (await audiences.RecipientIdsAsync(audience, target.OrgId, cancellationToken)).Count);
    }

    public async Task<(Result Result, AnnouncementSent? Sent)> SendAsync(SendAnnouncementCommand command, CancellationToken cancellationToken = default)
    {
        var target = access.Target();
        if (!target.Allowed)
        {
            return (target.Refusal!, null);
        }

        if (current.UserId is not { } userId)
        {
            return (Result.Forbidden(), null);
        }

        if (command.Audience!.Kind == nameof(AudienceKind.Portfolio) && !access.CanSendPortfolioWide(target.OrgId))
        {
            return (Result.Forbidden(AnnouncementRules.PortfolioMessage), null);
        }

        var (audience, refusal) = await audiences.FromRequestAsync(command.Audience!, target.OrgId, cancellationToken);
        if (audience is null)
        {
            return (refusal!, null);
        }

        var sender = await db.Users.Where(u => u.Id == userId).Select(u => u.ProfileId).SingleAsync(cancellationToken);
        var subject = command.Subject!.Trim();
        var body = command.Body!.Trim();
        var recipients = await audiences.RecipientIdsAsync(audience, target.OrgId, cancellationToken);

        var announcement = new Announcement(target.OrgId, subject, body, audience, sender, time.GetUtcNow(), command.AlsoEmail);
        announcement.AddRecipients(recipients);
        db.Announcements.Add(announcement);
        var emails = await publisher.PublishAsync(
            recipients,
            NotificationKind.Announcement,
            subject,
            LinkPath,
            sender,
            command.AlsoEmail ? recipient => new NotificationEmail(subject, EmailBody(body, recipient)) : null,
            cancellationToken,
            target.OrgId);
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), new AnnouncementSent(announcement.Id, recipients.Count, emails));
    }

    /// <summary>The message with each recipient's own unsubscribe link (L2-030 AC3).</summary>
    private string EmailBody(string body, Guid recipient) =>
        $"{body}\n\nUnsubscribe from announcement emails (no sign-in needed): "
        + $"{webApp.Value.Origin}/unsubscribe?token={Uri.EscapeDataString(unsubscribe.Issue(recipient))}";
}
