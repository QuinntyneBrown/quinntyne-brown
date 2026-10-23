using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Resources;

/// <summary>A member a resource can be shared with or handed to: name, roles and city (L2-061 AC1, L2-064 AC3).</summary>
public record ResourceMemberDto(Guid Id, string Name, string? City, IReadOnlyList<string> Roles);

/// <summary>
/// The people picker for sharing (contributors only) and the new-owner picker for a transfer (System Admin only,
/// listing only members who can own resources). Suspended members are never offered.
/// </summary>
public class ResourceMembersHandler(IApplicationDbContext db, ResourceAccess access, ICurrentUser current, ProfileRoles profileRoles, ResourceOwners resourceOwners)
{
    public const int Limit = 10;

    /// <summary>How many name matches are checked for the right to own resources before the first 10 are kept.</summary>
    public const int OwnerScanLimit = 200;

    public async Task<IReadOnlyList<ResourceMemberDto>?> ShareCandidatesAsync(string? q, CancellationToken cancellationToken = default) =>
        access.CanContribute ? await FindAsync(q, ownersOnly: false, cancellationToken) : null;

    public async Task<IReadOnlyList<ResourceMemberDto>?> OwnerCandidatesAsync(string? q, CancellationToken cancellationToken = default) =>
        access.IsSystemAdmin ? await FindAsync(q, ownersOnly: true, cancellationToken) : null;

    private async Task<IReadOnlyList<ResourceMemberDto>> FindAsync(string? q, bool ownersOnly, CancellationToken cancellationToken)
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

        var rows = await members.OrderBy(p => p.Name).ThenBy(p => p.Id).Take(ownersOnly ? OwnerScanLimit : Limit)
            .Select(p => new { p.Id, p.Name, p.HomeCity })
            .ToListAsync(cancellationToken);
        if (ownersOnly)
        {
            // Owners can own resources in one of the scope's orgs, by a role, a cross-org role or a tier (L2-064 AC3).
            var orgs = current.Access.ReadScope(Domain.Organizations.Features.Resources);
            var owners = new List<Guid>();
            foreach (var row in rows)
            {
                foreach (var org in orgs)
                {
                    if (await resourceOwners.OwnerRoleAsync(row.Id, org, cancellationToken) is not null)
                    {
                        owners.Add(row.Id);
                        break;
                    }
                }
            }

            rows = [.. rows.Where(r => owners.Contains(r.Id)).Take(Limit)];
        }
        var roles = await profileRoles.ForAsync([.. rows.Select(r => r.Id)], current.Access.Orgs.Keys.ToList(), cancellationToken);
        return [.. rows.Select(r => new ResourceMemberDto(r.Id, r.Name, r.HomeCity, [.. roles[r.Id].Select(x => x.Name)]))];
    }
}
