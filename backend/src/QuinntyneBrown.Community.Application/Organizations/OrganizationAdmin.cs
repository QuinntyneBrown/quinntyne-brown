using QuinntyneBrown.Community.Application.Admin;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Profiles;
using QuinntyneBrown.Community.Domain.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Organizations;

public record OrgTypeRefDto(Guid Id, string Name);

public record PersonRefDto(Guid ProfileId, string Name);

public record OrganizationSummaryDto(
    Guid Id, string Slug, string Name, string DisplayName, OrgTypeRefDto OrgType, int MemberCount, IReadOnlyList<PersonRefDto> OrgLeads, DateTime? ArchivedAt);

public record OrganizationDto(
    Guid Id, string Slug, string Name, string DisplayName, OrgTypeRefDto OrgType, IReadOnlyList<string> Aliases, DateTime? ArchivedAt);

public record CreateOrganizationCommand(string? Name, string? Slug, Guid? OrgTypeId);

public record UpdateOrganizationCommand(string? Name, string? Slug);

/// <summary>
/// Creates, renames, re-slugs, archives and restores a portfolio's orgs (L2-156): its Portfolio Lead or a System
/// Admin. A changed slug is kept as an alias so old links redirect (L2-144 AC6). Every change is audited.
/// </summary>
public class OrganizationAdminHandler(IApplicationDbContext db, ICurrentUser current, ProfileAccess profiles, IAuditLog audit, TimeProvider time)
{
    public const string SlugMessage = "Use 3 to 40 lower-case letters, numbers and hyphens; “all” is reserved.";

    public const string SlugTakenMessage = "Another organization uses that address.";

    public async Task<(Result Result, IReadOnlyList<OrganizationSummaryDto>? Orgs)> ListAsync(Guid portfolioId, bool archived, CancellationToken cancellationToken = default)
    {
        if (PortfolioAccess.Refusal(current.Access, portfolioId) is { } refusal)
        {
            return (refusal, null);
        }

        var orgs = await db.Organizations.AsNoTracking()
            .Where(o => o.PortfolioId == portfolioId && (archived ? o.ArchivedAtUtc != null : o.ArchivedAtUtc == null))
            .OrderBy(o => o.Name).ToListAsync(cancellationToken);
        var ids = orgs.Select(o => o.Id).ToList();
        var types = await db.OrgTypes.AsNoTracking().Where(t => t.PortfolioId == portfolioId).ToDictionaryAsync(t => t.Id, t => t.Name, cancellationToken);
        var members = await db.OrgMemberships.AsNoTracking().Where(m => ids.Contains(m.OrganizationId))
            .Join(db.Profiles.AsNoTracking(), m => m.ProfileId, p => p.Id, (m, p) => new { m.OrganizationId, m.IsOrgLead, p.Id, p.Name, p.Kind })
            .ToListAsync(cancellationToken);
        return (Result.Ok(), [.. orgs.Select(o =>
        {
            var people = members.Where(m => m.OrganizationId == o.Id).ToList();
            return new OrganizationSummaryDto(
                o.Id, o.Slug, o.Name, o.ShownName, new OrgTypeRefDto(o.OrgTypeId, types.GetValueOrDefault(o.OrgTypeId, string.Empty)),
                people.Count(p => p.Kind == Domain.Profiles.ProfileKind.Person),
                [.. people.Where(p => p.IsOrgLead).OrderBy(p => p.Name).Select(p => new PersonRefDto(p.Id, p.Name))],
                o.ArchivedAtUtc);
        })]);
    }

    public async Task<(Result Result, OrganizationDto? Org)> CreateAsync(Guid portfolioId, CreateOrganizationCommand command, CancellationToken cancellationToken = default)
    {
        if (PortfolioAccess.Refusal(current.Access, portfolioId) is { } refusal)
        {
            return (refusal, null);
        }

        var name = command.Name?.Trim() ?? string.Empty;
        if (name.Length is 0 or > 80)
        {
            return (Result.Invalid("name", "Enter a name of 80 characters or fewer."), null);
        }

        if (await SlugRefusalAsync(command.Slug, null, cancellationToken) is { } slugRefusal)
        {
            return (slugRefusal, null);
        }

        if (command.OrgTypeId is not { } typeId || !await db.OrgTypes.AnyAsync(t => t.Id == typeId && t.PortfolioId == portfolioId, cancellationToken))
        {
            return (Result.Invalid("orgTypeId", "Choose an Org Type."), null);
        }

        var org = new Organization(portfolioId, typeId, name, command.Slug!.Trim());
        db.Organizations.Add(org);
        await RecordAsync(org, "organization.created", null, new { org.Name, org.Slug, OrgTypeId = typeId }, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), await DtoAsync(org, cancellationToken));
    }

    /// <summary>The settings view: the Org Lead, the Portfolio Lead and System Admin.</summary>
    public async Task<(Result Result, OrganizationDto? Org)> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var org = await db.Organizations.AsNoTracking().SingleOrDefaultAsync(o => o.Id == id, cancellationToken);
        if (org is null || (!current.Access.Covers(id) && PortfolioAccess.Refusal(current.Access, org.PortfolioId) is not null))
        {
            return (Result.NotFound(), null);
        }

        if (!current.Access.LeadsOrg(id) && PortfolioAccess.Refusal(current.Access, org.PortfolioId) is not null)
        {
            return (Result.Forbidden(), null);
        }

        return (Result.Ok(), await DtoAsync(org, cancellationToken));
    }

    /// <summary>Name and slug: the Portfolio Lead or System Admin; an Org Lead is refused (L2-156 AC4).</summary>
    public async Task<(Result Result, OrganizationDto? Org)> UpdateAsync(Guid id, UpdateOrganizationCommand command, CancellationToken cancellationToken = default)
    {
        var (refusal, org) = await FindAsync(id, cancellationToken);
        if (refusal is not null)
        {
            return (refusal, null);
        }

        var name = command.Name?.Trim() ?? string.Empty;
        if (name.Length is 0 or > 80)
        {
            return (Result.Invalid("name", "Enter a name of 80 characters or fewer."), null);
        }

        var slug = command.Slug?.Trim() ?? string.Empty;
        if (slug != org!.Slug && await SlugRefusalAsync(slug, org.Id, cancellationToken) is { } slugRefusal)
        {
            return (slugRefusal, null);
        }

        var before = new { org.Name, org.Slug };
        org.Rename(name);
        if (slug != org.Slug)
        {
            var old = org.ChangeSlug(slug);
            db.OrgSlugAliases.RemoveRange(await db.OrgSlugAliases.Where(a => a.Slug == slug).ToListAsync(cancellationToken));
            db.OrgSlugAliases.Add(new OrgSlugAlias(old, org.Id));
        }

        await RecordAsync(org, "organization.changed", before, new { org.Name, org.Slug }, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), await DtoAsync(org, cancellationToken));
    }

    public async Task<Result> ArchiveAsync(Guid id, bool archive, CancellationToken cancellationToken = default)
    {
        var (refusal, org) = await FindAsync(id, cancellationToken);
        if (refusal is not null)
        {
            return refusal;
        }

        if (archive)
        {
            org!.Archive(time.GetUtcNow().UtcDateTime);
        }
        else
        {
            org!.Restore();
        }

        await RecordAsync(org, archive ? "organization.archived" : "organization.restored", null, new { org.Slug }, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        return Result.Ok();
    }

    private async Task<Result?> SlugRefusalAsync(string? slug, Guid? orgId, CancellationToken cancellationToken)
    {
        var value = slug?.Trim() ?? string.Empty;
        if (!OrgSlug.IsValid(value))
        {
            return Result.Invalid("slug", SlugMessage);
        }

        // An org may take back one of its own old slugs.
        var taken = await db.Organizations.AnyAsync(o => o.Slug == value && o.Id != orgId, cancellationToken)
            || await db.OrgSlugAliases.AnyAsync(a => a.Slug == value && a.OrganizationId != orgId, cancellationToken);
        return taken ? Result.Conflict(SlugTakenMessage) : null;
    }

    // Archived orgs are outside everyone's coverage, so the portfolio decides who may act on them.
    private async Task<(Result? Refusal, Organization? Org)> FindAsync(Guid id, CancellationToken cancellationToken)
    {
        var org = await db.Organizations.SingleOrDefaultAsync(o => o.Id == id, cancellationToken);
        if (org is null)
        {
            return (Result.NotFound(), null);
        }

        return PortfolioAccess.Refusal(current.Access, org.PortfolioId) is { } refusal
            ? (refusal.Status == ResultStatus.Forbidden && !current.Access.Covers(id) ? Result.NotFound() : refusal, null)
            : (null, org);
    }

    private async Task<OrganizationDto> DtoAsync(Organization org, CancellationToken cancellationToken)
    {
        var type = await db.OrgTypes.AsNoTracking().Where(t => t.Id == org.OrgTypeId).Select(t => t.Name).SingleAsync(cancellationToken);
        var aliases = await db.OrgSlugAliases.AsNoTracking().Where(a => a.OrganizationId == org.Id).Select(a => a.Slug).OrderBy(a => a).ToListAsync(cancellationToken);
        return new OrganizationDto(org.Id, org.Slug, org.Name, org.ShownName, new OrgTypeRefDto(org.OrgTypeId, type), aliases, org.ArchivedAtUtc);
    }

    private async Task RecordAsync(Organization org, string action, object? before, object? after, CancellationToken cancellationToken)
    {
        var actor = await profiles.CallerProfileIdAsync(cancellationToken) ?? Guid.Empty;
        audit.Record(actor, action, "Organization", org.Id.ToString(), before, after, org.Id, org.PortfolioId);
    }
}
