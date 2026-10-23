using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Domain.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Organizations;

public record ResolvedSlugDto(string Slug);

/// <summary>
/// Follows a slug, or an old one kept as an alias, to the org's current slug (L2-145, ADR 0037). An org the caller
/// does not cover answers as if it did not exist.
/// </summary>
public class ResolveOrgSlugHandler(IApplicationDbContext db, ICurrentUser current)
{
    public async Task<ResolvedSlugDto?> HandleAsync(string slug, CancellationToken cancellationToken = default)
    {
        if (!OrgSlug.IsValid(slug))
        {
            return null;
        }

        var wanted = slug;
        var orgId = await db.Organizations.AsNoTracking().Where(o => o.Slug == wanted).Select(o => (Guid?)o.Id).SingleOrDefaultAsync(cancellationToken)
            ?? await db.OrgSlugAliases.AsNoTracking().Where(a => a.Slug == wanted).Select(a => (Guid?)a.OrganizationId).SingleOrDefaultAsync(cancellationToken);
        return orgId is { } id && current.Access.Orgs.TryGetValue(id, out var org) ? new ResolvedSlugDto(org.Slug) : null;
    }
}
