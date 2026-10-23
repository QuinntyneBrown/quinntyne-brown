using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Domain.Organizations;
using QuinntyneBrown.Community.Domain.Profiles;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Profiles;

/// <summary>A member as the people directory lists them (L2-053). The email is matched, never returned.</summary>
public record PersonSummary(Guid Id, string Name, string? HomeCity, string? PhotoUrl, IReadOnlyList<RoleDto> Roles, bool IsAgent = false);

/// <summary>
/// The people directory for holders of <c>people.view</c> (L2-053, L2-140): members of the orgs in the request's scope
/// where the caller holds it, never anyone else. Not the System Admin users search: it returns no email or account
/// status, so a City Lead gains no administrative data. Agents are left out unless asked for (L2-154 AC6).
/// </summary>
public class ListPeopleHandler(IApplicationDbContext db, ICurrentUser current, ProfileRoles profileRoles, IPhotoStorage storage)
{
    public const int PageSize = 25;

    private IReadOnlyList<Guid> Scope =>
        [.. current.Access.ReadScope(Features.Profiles).Where(org => current.Access.Has(org, Permissions.PeopleView))];

    public bool CanBrowse => Scope.Count > 0;

    /// <summary>A page of members by name, or null when the caller may not browse people.</summary>
    public async Task<PagedResult<PersonSummary>?> HandleAsync(string? term, int page, CancellationToken cancellationToken = default, bool includeAgents = false)
    {
        if (!CanBrowse)
        {
            return null;
        }

        var scope = Scope;
        var people = from user in db.Users.AsNoTracking()
                     join profile in db.Profiles.AsNoTracking().InOrgs(db, scope) on user.ProfileId equals profile.Id
                     where includeAgents || profile.Kind == ProfileKind.Person
                     select new { user, profile };
        if (!string.IsNullOrWhiteSpace(term))
        {
            var lowered = term.Trim().ToLower();
            people = people.Where(a => a.profile.Name.ToLower().Contains(lowered) || a.user.Email!.ToLower().Contains(lowered));
        }

        var request = new PageRequest(page, PageSize);
        var total = await people.CountAsync(cancellationToken);
        var rows = await people
            .OrderBy(a => a.profile.Name).ThenBy(a => a.profile.Id)
            .Skip(request.Skip).Take(request.PageSize)
            .Select(a => new
            {
                a.profile.Id,
                a.profile.Name,
                a.profile.HomeCity,
                Featured = a.profile.Photos.Where(p => p.IsFeatured).Select(p => p.BlobName).FirstOrDefault(),
                a.profile.Kind,
            })
            .ToListAsync(cancellationToken);
        var roles = await profileRoles.ForAsync([.. rows.Select(r => r.Id)], scope, cancellationToken);

        var items = rows.Select(r => new PersonSummary(
            r.Id,
            r.Name,
            r.HomeCity,
            r.Featured is null ? null : storage.GetReadUrl(r.Featured),
            roles[r.Id],
            r.Kind == ProfileKind.Agent)).ToList();
        return new PagedResult<PersonSummary>(items, request.Page, request.PageSize, total);
    }
}
