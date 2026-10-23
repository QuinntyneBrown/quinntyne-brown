using QuinntyneBrown.Community.Application.Admin;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Application.Notifications;
using QuinntyneBrown.Community.Domain.Notes;
using QuinntyneBrown.Community.Domain.Notifications;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Notes;

public record ShareNoteCommand(string? Visibility, IReadOnlyList<Guid>? MemberIds, IReadOnlyList<string>? Roles);

/// <summary>
/// Who can see a page (L2-093): Private, Shared with members and roles, or Global. Only the owner or a System
/// Admin; the new recipients are told in-app and by email in the same save (L2-093 AC5, AC6).
/// </summary>
public class ShareNoteHandler(IApplicationDbContext db, NoteAccess access, NoteViews views, NoteShareNotifier notifier, ShareRoles shareRoles, IAuditLog audit)
{
    public const string AudienceMessage = "Choose at least one person or role, or pick another visibility.";

    public async Task<(Result Result, NotePageDto? Page)> HandleAsync(Guid id, ShareNoteCommand command, CancellationToken cancellationToken = default)
    {
        var caller = await access.CallerAsync(cancellationToken);
        var page = await access.FindAsync(id, caller, cancellationToken);
        if (page is null)
        {
            return (Result.NotFound(), null);
        }

        if (!access.CanChange(page, caller))
        {
            return (Result.Forbidden(), null);
        }

        if (page.IsArchived)
        {
            return (Result.Invalid("Visibility", NoteFields.ArchivedMessage), null);
        }

        if (!Enum.TryParse<NoteVisibility>(command.Visibility, out var visibility) || int.TryParse(command.Visibility, out _) || !Enum.IsDefined(visibility))
        {
            return (Result.Invalid("Visibility", "Choose who can see it."), null);
        }

        var members = visibility == NoteVisibility.Shared ? (command.MemberIds ?? []).Distinct().ToList() : [];
        if (await shareRoles.ResolveAsync(page.OrganizationId, visibility == NoteVisibility.Shared ? command.Roles ?? [] : [], cancellationToken) is not { } roles)
        {
            return (Result.Invalid("Roles", "Choose roles from the list."), null);
        }

        if (members.Count > 0 && await db.Profiles.CountAsync(p => members.Contains(p.Id), cancellationToken) != members.Count)
        {
            return (Result.Invalid("MemberIds", "Choose members who are on Quinntyne Brown."), null);
        }

        if (visibility == NoteVisibility.Shared && members.Count == 0 && roles.Count == 0)
        {
            return (Result.Invalid("Visibility", AudienceMessage), null);
        }

        var reached = await notifier.RecipientsAsync(page, cancellationToken);
        var before = Audience(page);
        page.SetAudience(visibility, members, roles);
        if (access.IsOverride(page, caller))
        {
            audit.Record(caller, "note.shared", nameof(NotePage), page.Id.ToString(), before, Audience(page), page.OrganizationId);
        }

        await notifier.NotifyAsync(page, caller, reached, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), await views.DetailAsync(page, caller, cancellationToken));
    }

    private static object Audience(NotePage page) => new
    {
        Visibility = page.Visibility.ToString(),
        Members = page.SharedMembers.Select(m => m.ProfileId).ToList(),
        Roles = page.SharedRoles.Select(r => r.RoleId).ToList(),
    };
}

/// <summary>
/// Tells the people a page is shared with (L2-093 AC5, AC6): each named member and every current holder of a named
/// role, de-duplicated, without the owner and suspended members, and only those the previous audience did not reach.
/// </summary>
public class NoteShareNotifier(IApplicationDbContext db, INotificationPublisher publisher, ShareRoles shareRoles)
{
    public async Task<IReadOnlyCollection<Guid>> RecipientsAsync(NotePage page, CancellationToken cancellationToken = default)
    {
        if (page.Visibility != NoteVisibility.Shared)
        {
            return [];
        }

        var holders = await shareRoles.HoldersAsync(page.OrganizationId, [.. page.SharedRoles.Select(r => r.RoleId)], cancellationToken);
        var reached = page.SharedMembers.Select(m => m.ProfileId).Concat(holders).Distinct().ToList();
        var ids = await (
                from user in db.Users
                join profile in db.Profiles on user.ProfileId equals profile.Id
                where !profile.IsSuspended && profile.Id != page.OwnerId && reached.Contains(profile.Id)
                select profile.Id)
            .ToListAsync(cancellationToken);
        return ids.ToHashSet();
    }

    public async Task NotifyAsync(NotePage page, Guid actor, IReadOnlyCollection<Guid> alreadyReached, CancellationToken cancellationToken = default)
    {
        var recipients = (await RecipientsAsync(page, cancellationToken)).Except(alreadyReached).ToList();
        if (recipients.Count == 0)
        {
            return;
        }

        var owner = await db.Profiles.Where(p => p.Id == page.OwnerId).Select(p => p.Name).SingleAsync(cancellationToken);
        var title = NoteRefs.TitleOf(page.Title);
        var names = (await shareRoles.ForOrgAsync(page.OrganizationId, cancellationToken)).ToDictionary(r => r.Id, r => r.Name);
        var holders = new List<(string Name, IReadOnlyList<Guid> Holders)>();
        foreach (var role in page.SharedRoles)
        {
            holders.Add((names.GetValueOrDefault(role.RoleId, "a role"), await shareRoles.HoldersAsync(page.OrganizationId, [role.RoleId], cancellationToken)));
        }

        var heading = $"{owner} shared {title} with you";
        await publisher.PublishAsync(
            recipients,
            NotificationKind.NotePageShared,
            heading,
            $"/notes/{page.Id}",
            actor,
            recipient => new NotificationEmail(heading, Body(owner, title, Via(page, recipient, holders))),
            cancellationToken,
            page.OrganizationId);
    }

    private static string Via(NotePage page, Guid recipient, IReadOnlyList<(string Name, IReadOnlyList<Guid> Holders)> roles)
    {
        if (page.SharedMembers.Any(m => m.ProfileId == recipient))
        {
            return "you";
        }

        var role = roles.First(r => r.Holders.Contains(recipient));
        return $"everyone who has the {role.Name} role, which includes you";
    }

    private static string Body(string owner, string title, string via) =>
        $"A page was shared with you\n\n{owner} shared “{title}” with {via}. Open the page:";
}

/// <summary>The share picker (L2-093 AC2): members by name, never suspended ones.</summary>
public class NoteMembersHandler(IApplicationDbContext db, ICurrentUser current, ProfileRoles profileRoles)
{
    public const int Limit = 10;

    public async Task<IReadOnlyList<NoteMemberDto>> HandleAsync(string? q, CancellationToken cancellationToken = default)
    {
        var members = from user in db.Users.AsNoTracking()
                      join profile in db.Profiles.AsNoTracking().WhereVisibleTo(db, current.Access) on user.ProfileId equals profile.Id
                      where !profile.IsSuspended && profile.Kind == Domain.Profiles.ProfileKind.Person
                      select profile;
        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = q.Trim().ToLower();
            members = members.Where(p => p.Name.ToLower().Contains(term));
        }

        var rows = await members.OrderBy(p => p.Name).ThenBy(p => p.Id).Take(Limit)
            .Select(p => new { p.Id, p.Name, p.HomeCity })
            .ToListAsync(cancellationToken);
        var roles = await profileRoles.ForAsync([.. rows.Select(r => r.Id)], current.Access.Orgs.Keys.ToList(), cancellationToken);
        return [.. rows.Select(r => new NoteMemberDto(r.Id, r.Name, r.HomeCity, [.. roles[r.Id].Select(x => x.Name)]))];
    }
}

public record NoteMemberDto(Guid Id, string Name, string? City, IReadOnlyList<string> Roles);
