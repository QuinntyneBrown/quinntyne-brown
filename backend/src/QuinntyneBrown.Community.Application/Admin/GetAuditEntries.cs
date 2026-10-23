using System.Text.Json;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Domain.Admin;
using QuinntyneBrown.Community.Application.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Admin;

/// <summary>Filters for the audit log (L2-041 AC2). Category is roles, suspensions, contacts or deletions.</summary>
public record GetAuditEntriesQuery(string? Category = null, Guid? Actor = null, DateTime? From = null, DateTime? To = null, int Page = 1, Guid? Organization = null);

public record AuditEntryDto(
    Guid Id,
    DateTime OccurredAtUtc,
    Guid ActorId,
    string ActorName,
    string Action,
    string TargetType,
    string TargetId,
    string Summary,
    string? Before,
    string? After,
    string IpAddress,
    OrgLabel? Organization = null,
    string? Detail = null);

/// <summary>
/// Reads the audit log, scoped to the reader (L2-153): an Org Lead their orgs' entries, the Portfolio Lead their
/// portfolio's, a System Admin everything. Newest first, the last 90 days unless a range is given.
/// </summary>
public class GetAuditEntriesHandler(IApplicationDbContext db, ICurrentUser current, TimeProvider time)
{
    public const int PageSize = 50;
    public const int MaxExportRows = 10_000;
    public static readonly TimeSpan DefaultRange = TimeSpan.FromDays(90);

    public async Task<PagedResult<AuditEntryDto>?> HandleAsync(GetAuditEntriesQuery query, CancellationToken cancellationToken = default)
    {
        if (!CanRead)
        {
            return null;
        }

        var request = new PageRequest(query.Page, PageSize);
        var filtered = Filter(query);
        var total = await filtered.CountAsync(cancellationToken);
        var entries = await filtered.Skip(request.Skip).Take(request.PageSize).ToListAsync(cancellationToken);
        return new PagedResult<AuditEntryDto>(await ToDtosAsync(entries, cancellationToken), request.Page, request.PageSize, total);
    }

    /// <summary>Every filtered entry, up to <see cref="MaxExportRows"/>, for the CSV export (L2-041 AC5).</summary>
    public async Task<IReadOnlyList<AuditEntryDto>?> HandleAllAsync(GetAuditEntriesQuery query, CancellationToken cancellationToken = default)
    {
        if (!CanRead)
        {
            return null;
        }

        var entries = await Filter(query).Take(MaxExportRows).ToListAsync(cancellationToken);
        return await ToDtosAsync(entries, cancellationToken);
    }

    private bool CanRead => current.Access.IsSystemAdmin || current.Access.LedPortfolios.Count > 0 || current.Access.Orgs.Values.Any(o => o.IsOrgLead);

    private IQueryable<AuditEntry> Filter(GetAuditEntriesQuery query)
    {
        var from = query.From ?? time.GetUtcNow().UtcDateTime - DefaultRange;
        var entries = db.AuditEntries.AsNoTracking().Where(e => e.OccurredAtUtc >= from);
        var access = current.Access;
        if (!access.IsSystemAdmin)
        {
            var portfolios = access.LedPortfolios.ToList();
            var orgs = access.Orgs.Values.Where(o => o.IsOrgLead).Select(o => o.OrgId).ToList();
            entries = entries.Where(e => (e.PortfolioId != null && portfolios.Contains(e.PortfolioId.Value))
                || (e.OrganizationId != null && orgs.Contains(e.OrganizationId.Value)));
        }

        if (query.Organization is { } org)
        {
            entries = entries.Where(e => e.OrganizationId == org);
        }
        if (query.To is { } to)
        {
            entries = entries.Where(e => e.OccurredAtUtc <= to);
        }

        if (query.Actor is { } actor)
        {
            entries = entries.Where(e => e.ActorId == actor);
        }

        entries = query.Category switch
        {
            "roles" => entries.Where(e => e.Action.StartsWith("role.")),
            "suspensions" => entries.Where(e => e.Action == "user.suspended" || e.Action == "user.reinstated"),
            "contacts" => entries.Where(e => e.Action.StartsWith("contact.")),
            "deletions" => entries.Where(e => e.Action.EndsWith(".deleted")),
            _ => entries,
        };
        return entries.OrderByDescending(e => e.OccurredAtUtc).ThenBy(e => e.Id);
    }

    private async Task<IReadOnlyList<AuditEntryDto>> ToDtosAsync(List<AuditEntry> entries, CancellationToken cancellationToken)
    {
        var profileIds = entries.Select(e => e.ActorId)
            .Concat(entries.Where(e => e.TargetType == "Profile").Select(e => Guid.TryParse(e.TargetId, out var id) ? id : Guid.Empty))
            .Distinct()
            .ToList();
        var names = await db.Profiles.AsNoTracking()
            .Where(p => profileIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id, p => p.Name, cancellationToken);

        var roleNames = (await db.RoleDefinitions.AsNoTracking().Select(r => new { r.Key, r.Name }).ToListAsync(cancellationToken))
            .Concat(await db.CrossOrgRoles.AsNoTracking().Select(r => new { r.Key, r.Name }).ToListAsync(cancellationToken))
            .GroupBy(r => r.Key).ToDictionary(g => g.Key, g => g.First().Name);
        var orgs = await db.Organizations.AsNoTracking().ToDictionaryAsync(o => o.Id, cancellationToken);

        // Guid.Empty is the command line, e.g. the first System Admin grant.
        string NameOf(Guid id) => id == Guid.Empty ? "System" : names.GetValueOrDefault(id, "Unknown member");
        string TargetName(AuditEntry e) =>
            e.TargetType == "Profile" && Guid.TryParse(e.TargetId, out var id) ? NameOf(id) : $"{e.TargetType} {e.TargetId}";

        return [.. entries.Select(e => new AuditEntryDto(
            e.Id, e.OccurredAtUtc, e.ActorId, NameOf(e.ActorId), e.Action, e.TargetType, e.TargetId,
            Summarize(e, TargetName(e), roleNames), e.BeforeJson, e.AfterJson, e.IpAddress,
            e.OrganizationId is { } o && orgs.TryGetValue(o, out var org) ? new OrgLabel(org.Id, org.Slug, org.ShownName) : null,
            e.Detail))];
    }

    private static string Summarize(AuditEntry entry, string target, IReadOnlyDictionary<string, string> roleNames) => entry.Action switch
    {
        "role.granted" => $"Granted {ChangedRoles(entry.AfterJson, entry.BeforeJson, roleNames)} to {target}",
        "role.removed" => $"Removed {ChangedRoles(entry.BeforeJson, entry.AfterJson, roleNames)} from {target}",
        "user.suspended" => $"Suspended {target} — reason: {Read(entry.AfterJson, "Reason")}",
        "user.reinstated" => $"Reinstated {target}",
        "profile.updated" => $"Edited the profile of {target}",
        "profile.photo.uploaded" => $"Uploaded a photo to the profile of {target}",
        "profile.photo.described" => $"Changed a photo description on the profile of {target}",
        "profile.photo.featured" => $"Featured a photo on the profile of {target}",
        "profile.photo.deleted" => $"Deleted a photo from the profile of {target}",
        "contact.viewed" => $"Opened {Read(entry.AfterJson, "Name")}, another lead’s private contact",
        "contact.updated" => $"Edited {Read(entry.AfterJson, "Name")}, another lead’s private contact",
        "contact.notes-viewed" => $"Read the notes on {Read(entry.AfterJson, "Name")}, another lead’s private contact",
        "contact.note-added" => $"Added a note to {Read(entry.AfterJson, "Name")}, another lead’s private contact",
        "contact.archived" => $"Archived {Read(entry.AfterJson, "Name")}, another lead’s private contact",
        "contact.restored" => $"Restored {Read(entry.AfterJson, "Name")}, another lead’s private contact",
        "contact.linked" => $"Linked {Read(entry.AfterJson, "Name")}, another lead’s private contact, to a profile",
        "contact.deleted" => $"Deleted {Read(entry.AfterJson, "Name")}, another lead’s private contact",
        _ => $"{entry.Action} on {target}",
    };

    // Roles present in one snapshot and missing from the other, as labels.
    private static string ChangedRoles(string? withRole, string? withoutRole, IReadOnlyDictionary<string, string> roleNames)
    {
        var changed = RolesIn(withRole).Except(RolesIn(withoutRole)).ToList();
        return changed.Count == 0 ? "a role" : string.Join(", ", changed.Select(r => roleNames.GetValueOrDefault(r) ?? RoleKeys.NameOf(r)));
    }

    private static IEnumerable<string> RolesIn(string? json)
    {
        if (json is null)
        {
            return [];
        }

        using var document = JsonDocument.Parse(json);
        return document.RootElement.TryGetProperty("Roles", out var roles) && roles.ValueKind == JsonValueKind.Array
            ? [.. roles.EnumerateArray().Select(r => r.GetString() ?? string.Empty)]
            : [];
    }

    private static string Read(string? json, string property)
    {
        if (json is null)
        {
            return string.Empty;
        }

        using var document = JsonDocument.Parse(json);
        return document.RootElement.TryGetProperty(property, out var value) ? value.GetString() ?? string.Empty : string.Empty;
    }
}
