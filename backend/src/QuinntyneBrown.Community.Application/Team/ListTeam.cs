using System.Text;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Application.Profiles;
using QuinntyneBrown.Community.Domain.Organizations;
using QuinntyneBrown.Community.Domain.Profiles;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Team;

public enum TeamRoleFilter
{
    Leads,
    Volunteers,
}

/// <summary>
/// Optional filters and paging. The city is a filter on home city, never a permission boundary (ADR 0007).
/// <c>After</c> is the previous page's <see cref="TeamListDto.Next"/>.
/// </summary>
public record ListTeamQuery(TeamRoleFilter? Role = null, string? City = null, string? After = null, int? PageSize = null);

/// <summary>
/// Derives each org's team from current roles on every request, so role changes show at once (L2-019): members whose
/// catalogue roles grant <c>team.member</c>, with <c>team.lead</c> for the Leads filter and the rest for Volunteers.
/// Filters and the name order run in the database before paging, and pages hold at most
/// <see cref="PageRequest.MaxPageSize"/> members (L2-046 AC3, ADR 0015).
/// </summary>
public class ListTeamHandler(IApplicationDbContext db, ICurrentUser current, ProfileRoles profileRoles, IPhotoStorage storage)
{
    public const int DefaultPageSize = 50;

    /// <summary><c>X-Org</c> names an org the caller does not cover or without the team feature: 404.</summary>
    public bool Unavailable => current.Access.ActiveOrgUnavailable(Features.Team);

    /// <summary>The page, or null when <see cref="ListTeamQuery.After"/> is not a continuation this list gave out.</summary>
    public async Task<TeamListDto?> HandleAsync(ListTeamQuery query, CancellationToken cancellationToken = default)
    {
        var cursor = TeamCursor.Parse(query.After);
        if (query.After is not null && cursor is null)
        {
            return null;
        }

        var scope = current.Access.ReadScope(Features.Team).ToList();
        var catalogue = await db.RoleDefinitions.AsNoTracking().ToListAsync(cancellationToken);
        var teamRoles = catalogue.Where(r => r.Permissions.Contains(Permissions.TeamMember)).Select(r => r.Id).ToList();
        var leads = catalogue.Where(r => r.Permissions.Contains(Permissions.TeamLead)).Select(r => r.Id).ToList();
        var volunteers = teamRoles.Except(leads).ToList();
        var assignments = db.OrgRoleAssignments.Where(a => scope.Contains(a.OrganizationId));
        var team = db.Profiles.AsNoTracking().Where(p => assignments.Any(a => a.ProfileId == p.Id && teamRoles.Contains(a.RoleDefinitionId)));

        var matching = query.Role switch
        {
            TeamRoleFilter.Leads => team.Where(p => assignments.Any(a => a.ProfileId == p.Id && leads.Contains(a.RoleDefinitionId))),
            TeamRoleFilter.Volunteers => team.Where(p => assignments.Any(a => a.ProfileId == p.Id && volunteers.Contains(a.RoleDefinitionId))),
            _ => team,
        };
        var city = query.City?.Trim().ToLower();
        if (!string.IsNullOrEmpty(city))
        {
            matching = matching.Where(p => p.HomeCity != null && p.HomeCity.Trim().ToLower() == city);
        }

        var total = await matching.CountAsync(cancellationToken);
        var page = matching;
        if (cursor is { } c)
        {
            page = page.Where(p => string.Compare(p.Name.ToLower(), c.Name) > 0
                || (p.Name.ToLower() == c.Name && p.Id.CompareTo(c.Id) > 0));
        }

        var size = Math.Clamp(query.PageSize ?? DefaultPageSize, 1, PageRequest.MaxPageSize);
        var rows = await page
            .OrderBy(p => p.Name.ToLower())
            .ThenBy(p => p.Id)
            .Take(size + 1)
            .ToListAsync(cancellationToken);
        var members = rows.Take(size).ToList();
        var next = rows.Count > size ? new TeamCursor(members[^1].Name.ToLower(), members[^1].Id).ToString() : null;

        // Every team member's city, whatever the filters and the page, so the city select keeps its options.
        var cities = (await team.Select(p => p.HomeCity).Where(h => h != null).Distinct().ToListAsync(cancellationToken))
            .Select(h => h!.Trim())
            .Where(h => h.Length > 0)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Order(StringComparer.OrdinalIgnoreCase)
            .ToList();
        var roles = await profileRoles.ForAsync([.. members.Select(m => m.Id)], scope, cancellationToken);
        return new TeamListDto([.. members.Select(m => ToDto(m, roles[m.Id]))], cities, next, total);
    }

    private TeamMemberDto ToDto(Profile profile, IReadOnlyList<RoleDto> roles) => new(
        profile.Id,
        profile.Name,
        profile.HomeCity,
        profile.Photos.FirstOrDefault(p => p.IsFeatured) is { } featured ? storage.GetReadUrl(featured.BlobName) : null,
        [.. roles.Where(r => r.Kind == "catalogue").Select(r => r.Name)]);
}

/// <summary>The position after the last member of a page: their lower-cased name and profile id.</summary>
public readonly record struct TeamCursor(string Name, Guid Id)
{
    public override string ToString() =>
        $"{Id:N}.{Convert.ToBase64String(Encoding.UTF8.GetBytes(Name)).TrimEnd('=').Replace('+', '-').Replace('/', '_')}";

    public static TeamCursor? Parse(string? value)
    {
        var dot = value?.IndexOf('.') ?? -1;
        if (value is null || dot < 0 || !Guid.TryParseExact(value[..dot], "N", out var id))
        {
            return null;
        }

        var encoded = value[(dot + 1)..].Replace('-', '+').Replace('_', '/');
        encoded = encoded.PadRight(encoded.Length + ((4 - (encoded.Length % 4)) % 4), '=');
        try
        {
            return new TeamCursor(Encoding.UTF8.GetString(Convert.FromBase64String(encoded)), id);
        }
        catch (FormatException)
        {
            return null;
        }
    }
}
