namespace QuinntyneBrown.Community.Application.Organizations;

/// <summary>The org a record belongs to, shown as a label on lists under "All orgs" (ADR 0034).</summary>
public record OrgLabel(Guid Id, string Slug, string Name)
{
    public static OrgLabel? Of(IReadOnlyDictionary<Guid, OrgAccess> orgs, Guid orgId) =>
        orgs.TryGetValue(orgId, out var org) ? new OrgLabel(org.OrgId, org.Slug, org.ShownName) : null;
}
