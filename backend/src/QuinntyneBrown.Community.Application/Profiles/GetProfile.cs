using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Domain.Profiles;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Profiles;

public class GetProfileHandler(IApplicationDbContext db, ICurrentUser current, ProfileAccess access, ProfileRoles profileRoles, IPhotoStorage storage)
{
    /// <summary>
    /// Reads profiles only, so an unlinked private contact is never found (ADR 0003), and only ones the caller may see:
    /// their own, or of someone in an org they cover (L2-140). Roles are those held in the orgs the caller covers.
    /// </summary>
    public async Task<ProfileDto?> HandleAsync(Guid profileId, CancellationToken cancellationToken = default)
    {
        var profile = await db.Profiles.AsNoTracking().WhereVisibleTo(db, current.Access).SingleOrDefaultAsync(p => p.Id == profileId, cancellationToken);
        if (profile is null)
        {
            return null;
        }

        var caller = await access.CallerProfileIdAsync(cancellationToken);
        var orgs = profile.Id == caller || current.Access.IsSystemAdmin ? null : current.Access.Orgs.Keys.ToList();
        var roles = await profileRoles.ForAsync(profile.Id, orgs, cancellationToken);
        return ToDto(profile, profile.Id == caller, access.CanEdit(profile.Id, caller), roles);
    }

    public async Task<ProfileDto?> HandleOwnAsync(CancellationToken cancellationToken = default) =>
        await access.CallerProfileIdAsync(cancellationToken) is { } own ? await HandleAsync(own, cancellationToken) : null;

    private ProfileDto ToDto(Profile profile, bool isOwn, bool canEdit, IReadOnlyList<RoleDto> roles)
    {
        var photos = profile.Photos
            .OrderByDescending(p => p.UploadedAt)
            .Select(p => PhotoDto.From(p, storage))
            .ToList();
        return new ProfileDto(
            profile.Id,
            profile.Name,
            profile.HomeCity,
            profile.Bio,
            photos.FirstOrDefault(p => p.IsFeatured),
            photos,
            roles,
            isOwn,
            canEdit,
            profile.Kind == ProfileKind.Agent);
    }
}
