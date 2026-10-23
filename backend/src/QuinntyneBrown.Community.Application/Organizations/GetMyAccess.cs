using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Profiles;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Organizations;

/// <summary>An org's light branding (ADR 0037): the accent comes with the foreground the server chose for it.</summary>
public record OrgBrandingDto(string DisplayName, string? LogoUrl, string? Accent, string? AccentForeground);

/// <summary>A role the caller may grant in the org, or share an item with there.</summary>
public record RoleOptionDto(string Key, string Name, string? Description, bool IsCrossOrg);

/// <summary>One covered org as the web app needs it to build navigation and hide controls (L2-155).</summary>
public record MyOrgDto(
    Guid Id,
    string Slug,
    string Name,
    string TypeName,
    bool IsMember,
    bool IsOrgLead,
    bool IsPortfolioLead,
    bool CanJoinWork,
    IReadOnlyList<string> Features,
    IReadOnlyList<string> Permissions,
    IReadOnlyList<RoleOptionDto> GrantableRoles,
    IReadOnlyList<RoleOptionDto> ShareRoles,
    OrgBrandingDto Branding);

public record MyPortfolioDto(Guid Id, string Name, bool IsLead);

public record MyAccessDto(Guid? ProfileId, bool IsSystemAdmin, IReadOnlyList<MyPortfolioDto> Portfolios, IReadOnlyList<MyOrgDto> Orgs);

/// <summary>
/// The caller's access for the web app (L2-155, ADR 0037). It only hides controls; the server checks every request.
/// An empty org list means the person is waiting to be added (L2-142).
/// </summary>
public class GetMyAccessHandler(IApplicationDbContext db, ICurrentUser current, RoleGrantPolicy policy, ShareRoles shareRoles, IPhotoStorage storage)
{
    public async Task<MyAccessDto> HandleAsync(CancellationToken cancellationToken = default)
    {
        var access = current.Access;
        var portfolioIds = access.Orgs.Values.Select(o => o.PortfolioId).Concat(access.LedPortfolios).Distinct().ToList();
        var portfolios = await db.Portfolios.AsNoTracking().Where(p => portfolioIds.Contains(p.Id)).OrderBy(p => p.Name).ToListAsync(cancellationToken);
        var catalogues = (await db.RoleDefinitions.AsNoTracking().ToListAsync(cancellationToken))
            .GroupBy(r => r.OrgTypeId).ToDictionary(g => g.Key, g => g.OrderBy(r => r.SortOrder).ToList());
        var orgs = new List<MyOrgDto>();
        foreach (var o in access.Orgs.Values.OrderBy(o => !o.IsMember).ThenBy(o => o.ShownName))
        {
            var catalogue = catalogues.GetValueOrDefault(o.OrgTypeId) ?? [];
            var grantable = policy.CanChangeRolesIn(o.OrgId)
                ? catalogue.Where(r => policy.CanGrant(o.OrgId, r, catalogue)).Select(r => new RoleOptionDto(r.Key, r.Name, r.Description, false)).ToList()
                : [];
            var share = (await shareRoles.ForOrgAsync(o.OrgId, cancellationToken))
                .Select(r => new RoleOptionDto(r.Key, r.Name, catalogue.FirstOrDefault(c => c.Id == r.Id)?.Description, r.IsCrossOrg)).ToList();
            orgs.Add(new MyOrgDto(
                o.OrgId,
                o.Slug,
                o.Name,
                o.TypeName,
                o.IsMember,
                o.IsOrgLead,
                o.IsPortfolioLead,
                o.CanJoinWork,
                [.. o.Features.Order()],
                [.. o.Permissions.Order()],
                grantable,
                share,
                Branding(o, storage)));
        }

        return new MyAccessDto(
            access.ProfileId,
            access.IsSystemAdmin,
            [.. portfolios.Select(p => new MyPortfolioDto(p.Id, p.Name, access.LedPortfolios.Contains(p.Id)))],
            orgs);
    }

    public static OrgBrandingDto Branding(OrgAccess org, IPhotoStorage storage) => new(
        org.ShownName,
        org.LogoBlobName is { } logo ? storage.GetReadUrl(logo) : null,
        org.AccentColour,
        org.AccentColour is { } accent ? AccentContrast.ForegroundFor(accent) : null);
}
