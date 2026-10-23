using QuinntyneBrown.Community.Application.Agile;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Contacts;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Application.Partners;
using QuinntyneBrown.Community.Application.Resources;
using QuinntyneBrown.Community.Domain.Events;
using QuinntyneBrown.Community.Domain.Organizations;
using QuinntyneBrown.Community.Domain.Profiles;
using QuinntyneBrown.Community.Domain.Resources;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Search;

/// <summary>
/// Members of the orgs in the request's scope (L2-140, L2-152); suspended members and agents are never found.
/// </summary>
public class PeopleSearchSource(IApplicationDbContext db, IFullTextSearch text, ICurrentUser current, ProfileRoles profileRoles) : ISearchSource
{
    public SearchResultKind Kind => SearchResultKind.Person;

    public async Task<IReadOnlyList<SearchResultItem>> SearchAsync(string term, Guid caller, int limit, CancellationToken cancellationToken = default)
    {
        var scope = current.Access.ReadScope(Features.Profiles);
        var rows = await text
            .Match(db.Profiles.AsNoTracking().InOrgs(db, scope), term, p => p.Name + " " + (p.HomeCity ?? "") + " " + (p.Bio ?? ""))
            .Where(p => !p.IsSuspended && p.Kind == ProfileKind.Person && db.Users.Any(u => u.ProfileId == p.Id))
            .Take(limit)
            .Select(p => new { p.Id, p.Name, p.HomeCity, p.Bio })
            .ToListAsync(cancellationToken);
        var roles = await profileRoles.ForAsync([.. rows.Select(r => r.Id)], scope, cancellationToken);
        return [.. rows.Select(p => new SearchResultItem(
            p.Id,
            p.Name,
            Snippets.Join(string.Join(", ", roles[p.Id].Where(r => r.Kind == "catalogue").Select(r => r.Name)), p.HomeCity, Snippets.Short(p.Bio)),
            $"/people/{p.Id}"))];
    }
}

/// <summary>Events of the orgs in the request's scope: members-only and public events are both theirs to open.</summary>
public class EventsSearchSource(IApplicationDbContext db, IFullTextSearch text, ICurrentUser current) : ISearchSource
{
    public SearchResultKind Kind => SearchResultKind.Event;

    public async Task<IReadOnlyList<SearchResultItem>> SearchAsync(string term, Guid caller, int limit, CancellationToken cancellationToken = default)
    {
        var scope = current.Access.ReadScope(Features.Events);
        var rows = await text
            .Match(db.Events.AsNoTracking().Where(e => scope.Contains(e.OrganizationId)), term, e => e.Title + " " + e.Description + " " + e.City + " " + (e.Venue ?? ""))
            .Take(limit)
            .Select(e => new { e.Id, e.Title, e.City, e.Venue, e.Format, e.StartsAt, e.Visibility, e.IsCancelled, e.OrganizationId })
            .ToListAsync(cancellationToken);
        return [.. rows.Select(e => new SearchResultItem(
            e.Id,
            e.Title,
            Snippets.Join(e.City, e.Format == EventFormat.Online ? "Online" : e.Venue),
            $"/events/{e.Id}",
            e.StartsAt,
            e.IsCancelled ? "Cancelled" : e.Visibility == EventVisibility.Public ? "Public" : null,
            OrgLabel.Of(current.Access.Orgs, e.OrganizationId)?.Name))];
    }
}

/// <summary>The partner pipeline: lead roles, Staff and System Admin only (L2-017, ADR 0014).</summary>
public class PartnersSearchSource(IApplicationDbContext db, IFullTextSearch text, PartnerAccess access) : ISearchSource
{
    public SearchResultKind Kind => SearchResultKind.Partner;

    public async Task<IReadOnlyList<SearchResultItem>> SearchAsync(string term, Guid caller, int limit, CancellationToken cancellationToken = default)
    {
        if (!access.CanRead)
        {
            return [];
        }

        var scope = access.ReadScope;
        var rows = await text
            // Merged (archived) partners are never found (L2-114 AC4).
            .Match(db.Partners.AsNoTracking().Where(p => p.ArchivedAtUtc == null && scope.Contains(p.OrganizationId)), term,
                p => p.Name + " " + (p.Offering ?? "") + " " + (p.ContactName ?? "") + " " + (p.Notes ?? ""))
            .Take(limit)
            .Select(p => new { p.Id, p.Name, p.ContactName, p.Offering, p.Stage })
            .ToListAsync(cancellationToken);
        return [.. rows.Select(p => new SearchResultItem(
            p.Id, p.Name, Snippets.Join(p.ContactName, p.Offering), $"/partners/{p.Id}", Badge: p.Stage.ToString()))];
    }
}

/// <summary>The caller's own active private contacts, System Admin included (L2-012, ADR 0014).</summary>
public class ContactsSearchSource(IApplicationDbContext db, IFullTextSearch text, ContactAccess access) : ISearchSource
{
    public SearchResultKind Kind => SearchResultKind.Contact;

    public async Task<IReadOnlyList<SearchResultItem>> SearchAsync(string term, Guid caller, int limit, CancellationToken cancellationToken = default)
    {
        if (!access.CanKeepContacts || caller == Guid.Empty)
        {
            return [];
        }

        var scope = access.KeepingScope;
        var mine = db.Contacts.AsNoTracking().Where(c => c.OwnerId == caller && c.ArchivedAtUtc == null && scope.Contains(c.OrganizationId));
        var rows = await text
            .Match(mine, term, c => c.Name + " " + (c.Email ?? "") + " " + (c.Organization ?? "") + " " + (c.City ?? ""))
            .Take(limit)
            .Select(c => new { c.Id, c.Name, c.Organization, c.City })
            .ToListAsync(cancellationToken);
        return [.. rows.Select(c => new SearchResultItem(
            c.Id, c.Name, Snippets.Join(c.Organization, c.City), $"/contacts/{c.Id}", Badge: "Private"))];
    }
}

/// <summary>Work items in the workspaces the caller belongs to; Staff and System Admin see every workspace (ADR 0011).</summary>
public class WorkItemsSearchSource(IApplicationDbContext db, IFullTextSearch text, WorkspaceAccessPolicy access) : ISearchSource
{
    public SearchResultKind Kind => SearchResultKind.WorkItem;

    public async Task<IReadOnlyList<SearchResultItem>> SearchAsync(string term, Guid caller, int limit, CancellationToken cancellationToken = default)
    {
        var workspaces = access.Visible(db.Workspaces.AsNoTracking(), caller == Guid.Empty ? null : caller);
        var visible = db.WorkItems.AsNoTracking().Where(i => workspaces.Any(w => w.Id == i.WorkspaceId));
        var rows = await text
            .Match(visible, term, i => i.Title + " " + i.Description)
            .Take(limit)
            .Select(i => new
            {
                i.Id,
                i.WorkspaceId,
                i.Title,
                i.Kind,
                i.Status,
                Workspace = db.Workspaces.Where(w => w.Id == i.WorkspaceId).Select(w => w.Name).FirstOrDefault(),
            })
            .ToListAsync(cancellationToken);
        return [.. rows.Select(i => new SearchResultItem(
            i.Id, i.Title, Snippets.Join(i.Kind.ToString(), i.Workspace, i.Status.ToString()), $"/workspaces/{i.WorkspaceId}/items/{i.Id}"))];
    }
}

/// <summary>Resources the caller may open (L2-065): visibility is the base query (ADR 0017), never archived ones.</summary>
public class ResourcesSearchSource(IApplicationDbContext db, IFullTextSearch text, ResourceAccess access) : ISearchSource
{
    public SearchResultKind Kind => SearchResultKind.Resource;

    public async Task<IReadOnlyList<SearchResultItem>> SearchAsync(string term, Guid caller, int limit, CancellationToken cancellationToken = default)
    {
        var rows = await text
            .Match(access.Visible(db.Resources.AsNoTracking(), caller), term, ListResourcesHandler.Document)
            .Take(limit)
            .Select(r => new
            {
                r.Id,
                r.Title,
                r.Description,
                r.Type,
                r.Visibility,
                r.OwnerId,
                Extension = r.File == null ? null : r.File.Extension,
                FileName = r.File == null ? null : r.File.FileName,
                r.LinkHost,
                Tags = r.Tags.Select(t => t.Tag).ToList(),
                Owner = db.Profiles.Where(p => p.Id == r.OwnerId).Select(p => p.Name).FirstOrDefault(),
                SharedWithCaller = r.SharedMembers.Any(m => m.ProfileId == caller),
                SharedRoleIds = r.SharedRoles.Select(x => x.RoleId).ToList(),
                r.OrganizationId,
            })
            .ToListAsync(cancellationToken);
        return [.. rows.Select(r => new SearchResultItem(
            r.Id,
            r.Title,
            Snippets.Join(r.Type.ToString(), r.Extension?.ToUpperInvariant() ?? r.LinkHost, r.Owner, Why(term, r.Title, r.Tags, r.Description, r.FileName)),
            $"/resources/{r.Id}",
            Badge: r.Visibility switch
            {
                ResourceVisibility.Private => "Private",
                ResourceVisibility.Shared when r.OwnerId != caller
                    && (r.SharedWithCaller || ShareRoles.HeldPerOrg(access.Access).GetValueOrDefault(r.OrganizationId)?.Any(r.SharedRoleIds.Contains) == true) => "Shared with you",
                ResourceVisibility.Shared => "Shared",
                _ => null,
            }))];
    }

    /// <summary>"tagged launch" or "description mentions sponsors"; nothing when the title already shows the match.</summary>
    private static string? Why(string term, string title, IReadOnlyList<string> tags, string? description, string? fileName)
    {
        var word = term.Split(' ', StringSplitOptions.RemoveEmptyEntries)[0];
        bool Has(string? value) => value?.Contains(word, StringComparison.OrdinalIgnoreCase) == true;
        return Has(title) ? null
            : tags.FirstOrDefault(Has) is { } tag ? $"tagged {tag}"
            : Has(description) ? $"description mentions {word}"
            : Has(fileName) ? "file name matches"
            : null;
    }
}
