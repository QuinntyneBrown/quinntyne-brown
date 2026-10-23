using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Domain.Invites;
using QuinntyneBrown.Community.Domain.Organizations;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace QuinntyneBrown.Community.Application.Invites;

public record SendInviteCommand(string? Email, string? PreassignedRole = null, string? Note = null);

public class SendInviteValidator : AbstractValidator<SendInviteCommand>
{
    public const int MaxNote = 500;

    public SendInviteValidator()
    {
        RuleFor(x => x.Email).Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Enter an email like name@example.org.")
            .EmailAddress().WithMessage("Enter an email like name@example.org.")
            .MaximumLength(256).WithMessage("Use 256 characters or fewer for the email.");
        RuleFor(x => x.Note)
            .Must(note => (note?.Trim().Length ?? 0) <= MaxNote).WithMessage($"Use {MaxNote} characters or fewer for the note.");
    }
}

/// <summary>
/// Sends invites into one org (L2-010, L2-141, ADR 0041) for holders of <c>invites.send</c>, Org Leads and the Portfolio
/// Lead: role limits from the grant chain, verified sender, 50 per 24 hours.
/// </summary>
public class InviteSender(
    IApplicationDbContext db,
    ICurrentUser current,
    RoleGrantPolicy policy,
    IEmailQueue emails,
    IOptions<WebAppOptions> webApp,
    TimeProvider time)
{
    public const int MaxPerDay = 50;
    public const string RateLimitMessage = "You’ve sent 50 invites in the last 24 hours. Try again tomorrow.";

    public bool CanInvite => current.Access.HasAnywhere(Permissions.InvitesSend);

    /// <summary>The orgs in the request's scope whose invites the caller sees and sends.</summary>
    public IReadOnlyList<Guid> Scope =>
        [.. current.Access.ReadScope(Features.Invites).Where(org => current.Access.Has(org, Permissions.InvitesSend))];

    public async Task<(Result Result, InviteDto? Invite)> SendAsync(SendInviteCommand command, CancellationToken cancellationToken = default)
    {
        var target = current.Access.TargetFor(Permissions.InvitesSend);
        if (!target.Allowed)
        {
            return (target.Refusal!, null);
        }

        RoleDefinition? role = null;
        if (!string.IsNullOrEmpty(command.PreassignedRole))
        {
            role = await CatalogueRoleAsync(target.OrgId, command.PreassignedRole, cancellationToken);
            if (role is null)
            {
                return (Result.Invalid("PreassignedRole", "Choose a role from the list."), null);
            }
        }

        var note = string.IsNullOrWhiteSpace(command.Note) ? null : command.Note.Trim();
        return await CreateAsync(target.OrgId, command.Email!.Trim(), role, note, cancellationToken);
    }

    /// <summary>Checks the sender and sends a new invite into the org; shared by send and resend.</summary>
    public async Task<(Result Result, InviteDto? Invite)> CreateAsync(Guid orgId, string address, RoleDefinition? role, string? note, CancellationToken cancellationToken)
    {
        if (!current.Access.Has(orgId, Permissions.InvitesSend))
        {
            return (current.Access.Covers(orgId, Features.Invites) ? Result.Forbidden() : Result.NotFound(), null);
        }

        var sender = await db.Users.Where(u => u.Id == current.UserId)
            .Join(db.Profiles, u => u.ProfileId, p => p.Id, (u, p) => new { p.Id, p.Name, u.EmailConfirmed })
            .SingleOrDefaultAsync(cancellationToken);
        if (sender is null)
        {
            return (Result.Forbidden(), null);
        }

        if (!sender.EmailConfirmed)
        {
            return (Result.Forbidden("Verify your email before sending invites."), null);
        }

        if (role is not null)
        {
            var catalogue = await db.RoleDefinitions.AsNoTracking().Where(r => r.OrgTypeId == role.OrgTypeId).ToListAsync(cancellationToken);
            if (!policy.CanGrant(orgId, role, catalogue))
            {
                return (Result.Forbidden("You can’t give that role."), null);
            }
        }

        var now = time.GetUtcNow();
        if (await db.Invites.CountAsync(i => i.InvitedBy == sender.Id && i.CreatedAt > now.AddHours(-24), cancellationToken) >= MaxPerDay)
        {
            return (Result.TooManyRequests(RateLimitMessage), null);
        }

        var token = InviteTokens.New();
        var invite = new Invite(orgId, address, InviteTokens.Hash(token), role?.Id, sender.Id, now, note);
        db.Invites.Add(invite);

        // The invite and its email are saved together, so neither exists without the other (L2-028, L2-047).
        var org = current.Access.Orgs[orgId].ShownName;
        var asRole = role is not null ? $" as a {role.Name}" : string.Empty;
        var personal = note is null ? string.Empty : $"\n\n“{note}”\n— {sender.Name}";
        emails.Enqueue(new EmailMessage(
            address,
            $"{sender.Name} invited you to {org} on Quinntyne Brown",
            $"{sender.Name} invited you to join {org} on Quinntyne Brown{asRole}.{personal}\n\n" +
            $"Accept the invite:\n\n{webApp.Value.Origin}/accept-invite/{token}\n\n" +
            "This link works once and expires in 14 days."));
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), InviteDto.From(invite, sender.Name, now, role, OrgLabel.Of(current.Access.Orgs, orgId)));
    }

    private async Task<RoleDefinition?> CatalogueRoleAsync(Guid orgId, string key, CancellationToken cancellationToken)
    {
        var typeId = await db.Organizations.Where(o => o.Id == orgId).Select(o => o.OrgTypeId).SingleAsync(cancellationToken);
        return await db.RoleDefinitions.AsNoTracking().SingleOrDefaultAsync(r => r.OrgTypeId == typeId && r.Key == key, cancellationToken);
    }
}
