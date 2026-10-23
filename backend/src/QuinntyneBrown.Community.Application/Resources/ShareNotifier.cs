using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Notifications;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Domain.Notifications;
using QuinntyneBrown.Community.Domain.Resources;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Resources;

/// <summary>
/// Tells the people a resource is shared with (L2-061 AC2, AC3): each named member and every current holder of a
/// named role, de-duplicated, without the owner and suspended members. Only recipients the previous audience did not
/// already reach are told. The notifications and emails join the caller's unit of work, so they are saved with the share.
/// </summary>
public class ShareNotifier(IApplicationDbContext db, INotificationPublisher publisher, ShareRoles shareRoles)
{
    /// <summary>Who the resource's audience reaches today; empty unless it is Shared.</summary>
    public async Task<IReadOnlyCollection<Guid>> RecipientsAsync(Resource resource, CancellationToken cancellationToken = default)
    {
        if (resource.Visibility != ResourceVisibility.Shared)
        {
            return [];
        }

        var members = resource.SharedMembers.Select(m => m.ProfileId).ToList();
        var holders = await shareRoles.HoldersAsync(resource.OrganizationId, [.. resource.SharedRoles.Select(r => r.RoleId)], cancellationToken);
        var reached = members.Concat(holders).Distinct().ToList();
        var ids = await (
                from user in db.Users
                join profile in db.Profiles on user.ProfileId equals profile.Id
                where !profile.IsSuspended && profile.Id != resource.OwnerId && reached.Contains(profile.Id)
                select profile.Id)
            .ToListAsync(cancellationToken);
        return ids.ToHashSet();
    }

    public async Task NotifyAsync(IReadOnlyList<Resource> added, Guid actor, CancellationToken cancellationToken = default)
    {
        foreach (var resource in added)
        {
            await NotifyAsync(resource, actor, [], cancellationToken);
        }
    }

    public async Task NotifyAsync(Resource resource, Guid actor, IReadOnlyCollection<Guid> alreadyReached, CancellationToken cancellationToken = default)
    {
        var recipients = (await RecipientsAsync(resource, cancellationToken)).Except(alreadyReached).ToList();
        if (recipients.Count == 0)
        {
            return;
        }

        var owner = await db.Profiles.Where(p => p.Id == resource.OwnerId).Select(p => p.Name).SingleAsync(cancellationToken);
        var names = (await shareRoles.ForOrgAsync(resource.OrganizationId, cancellationToken)).ToDictionary(r => r.Id, r => r.Name);
        var holders = new List<(string Name, IReadOnlyList<Guid> Holders)>();
        foreach (var role in resource.SharedRoles)
        {
            holders.Add((names.GetValueOrDefault(role.RoleId, "a role"), await shareRoles.HoldersAsync(resource.OrganizationId, [role.RoleId], cancellationToken)));
        }

        var title = $"{owner} shared {resource.Title} with you";
        await publisher.PublishAsync(
            recipients,
            NotificationKind.ResourceShared,
            title,
            $"/resources/{resource.Id}",
            actor,
            recipient => new NotificationEmail(title, Body(resource, owner, Via(resource, recipient, holders))),
            cancellationToken,
            resource.OrganizationId);
    }

    private static string Via(Resource resource, Guid recipient, IReadOnlyList<(string Name, IReadOnlyList<Guid> Holders)> roles)
    {
        if (resource.SharedMembers.Any(m => m.ProfileId == recipient))
        {
            return "you";
        }

        var role = roles.First(r => r.Holders.Contains(recipient));
        return $"everyone who has the {role.Name} role, which includes you";
    }

    private static string Body(Resource resource, string owner, string via) =>
        $"A resource was shared with you\n\n{owner} shared “{resource.Title}” ({ResourceDescriptions.What(resource)}) with {via}. "
        + "Open the resource:";
}

public static class ResourceDescriptions
{
    /// <summary>"Document, PDF, 3.1 MB" for a file, "Template, canva.com" for a link.</summary>
    public static string What(Resource resource) => resource.File is { } file
        ? $"{resource.Type}, {file.Extension.ToUpperInvariant()}, {Size(file.Size)}"
        : $"{resource.Type}, {resource.LinkHost}";

    /// <summary>"640 KB" under a megabyte, else "24.6 MB", as the mocks print sizes.</summary>
    public static string Size(long bytes) => bytes < 1024 * 1024
        ? $"{Math.Max(1, (long)Math.Ceiling(bytes / 1024.0))} KB"
        : $"{bytes / (1024.0 * 1024.0):0.0} MB";
}
