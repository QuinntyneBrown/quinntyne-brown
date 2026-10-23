using QuinntyneBrown.Community.Application.Admin;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Domain.Partners;
using QuinntyneBrown.Community.Domain.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Partners;

/// <summary>
/// Each org's partner pipeline (L2-017, ADR 0014, ADR 0034): holders of <c>partners.read</c> read it, holders of
/// <c>partners.write</c> change it. Everyone else gets 403; a partner of an org the caller does not cover is 404.
/// </summary>
public class PartnerAccess(IApplicationDbContext db, ICurrentUser current, IAuditLog audit)
{
    private CallerAccess Access => current.Access;

    /// <summary>The orgs whose pipeline a list reads: the request's scope, where the caller holds <c>partners.read</c>.</summary>
    public IReadOnlyList<Guid> ReadScope => [.. Access.ReadScope(Features.Partners).Where(org => Access.Has(org, Permissions.PartnersRead))];

    public bool CanRead => ReadScope.Count > 0;

    public bool CanWrite => Access.ReadScope(Features.Partners).Any(org => Access.Has(org, Permissions.PartnersWrite));

    public bool CanWriteIn(Guid orgId) => Access.Has(orgId, Permissions.PartnersWrite);

    /// <summary>Partners of every org the caller may read, whatever the active org: by-id requests use the record's org.</summary>
    public IQueryable<Partner> Readable(IQueryable<Partner> partners)
    {
        var orgs = Access.CoveredWith(Features.Partners).Where(org => Access.Has(org, Permissions.PartnersRead)).ToList();
        return partners.Where(p => orgs.Contains(p.OrganizationId));
    }

    /// <summary>The org a new partner is added to.</summary>
    public CreateTarget CreateTarget() => Access.TargetFor(Permissions.PartnersWrite);

    /// <summary>Only a System Admin restores a merged partner (L2-115 AC5).</summary>
    public bool CanRestore => Access.IsSystemAdmin;

    public async Task<Guid> CallerProfileIdAsync(CancellationToken cancellationToken = default) =>
        current.UserId is { } userId
            ? await db.Users.Where(u => u.Id == userId).Select(u => u.ProfileId).SingleOrDefaultAsync(cancellationToken)
            : Guid.Empty;

    /// <summary>A change made by tier right (Org Lead, Portfolio Lead, System Admin) without a role holding it is audited.</summary>
    public void AuditAdminWrite(Guid actor, Partner partner, string action, object? before, object? after)
    {
        if (Access.IsOverride(partner.OrganizationId, Permissions.PartnersWrite))
        {
            audit.Record(actor, action, "Partner", partner.Id.ToString(), before, after, partner.OrganizationId);
        }
    }

    /// <summary>Merge and restore are audited whoever performs them (L2-115 AC3, AC4).</summary>
    public void Audit(Guid actor, Partner partner, string action, object? before, object? after) =>
        audit.Record(actor, action, "Partner", partner.Id.ToString(), before, after, partner.OrganizationId);

    /// <summary>The 409 for a write to an archived partner (ADR 0028).</summary>
    public async Task<Result> ArchivedConflictAsync(Partner partner, string instruction, CancellationToken cancellationToken = default)
    {
        var kept = await db.Partners.AsNoTracking().Where(p => p.Id == partner.MergedIntoId).Select(p => p.Name).SingleOrDefaultAsync(cancellationToken);
        return Result.Conflict($"{partner.Name} was merged into {kept ?? "another partner"}. {instruction}");
    }
}
