using System.Linq.Expressions;
using QuinntyneBrown.Community.Application.Common;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Organizations;

/// <summary>A role an item can be shared with: a catalogue role of the item's org or a cross-org role covering it.</summary>
public record ShareRole(Guid Id, string Key, string Name, bool IsCrossOrg);

/// <summary>
/// The roles resources, note pages and announcements can name in an org (ADR 0039), who holds them, and the query
/// predicate that matches the caller's roles per org (a role key held in another org never matches, L2-148 AC5).
/// </summary>
public class ShareRoles(IApplicationDbContext db)
{
    /// <summary>The org's catalogue roles, in catalogue order, then the portfolio's cross-org roles covering the org.</summary>
    public async Task<IReadOnlyList<ShareRole>> ForOrgAsync(Guid orgId, CancellationToken cancellationToken = default)
    {
        var org = await db.Organizations.AsNoTracking().SingleOrDefaultAsync(o => o.Id == orgId, cancellationToken);
        if (org is null)
        {
            return [];
        }

        var catalogue = await db.RoleDefinitions.AsNoTracking().Where(r => r.OrgTypeId == org.OrgTypeId)
            .OrderBy(r => r.SortOrder).ThenBy(r => r.Name).ToListAsync(cancellationToken);
        var crossOrg = await db.CrossOrgRoles.AsNoTracking().Where(r => r.PortfolioId == org.PortfolioId).OrderBy(r => r.Name).ToListAsync(cancellationToken);
        var everyAssignment = new CrossOrgAssignmentStub();
        return
        [
            .. catalogue.Select(r => new ShareRole(r.Id, r.Key, r.Name, false)),
            .. crossOrg.Where(r => AccessResolver.CrossOrgCovers(r, everyAssignment.Value, org)).Select(r => new ShareRole(r.Id, r.Key, r.Name, true)),
        ];
    }

    /// <summary>Resolves role keys against the org's shareable roles; null when one is not offered there.</summary>
    public async Task<IReadOnlyList<Guid>?> ResolveAsync(Guid orgId, IEnumerable<string> keys, CancellationToken cancellationToken = default)
    {
        var offered = await ForOrgAsync(orgId, cancellationToken);
        var ids = new List<Guid>();
        foreach (var key in keys.Distinct())
        {
            if (offered.FirstOrDefault(r => r.Key == key) is not { } role)
            {
                return null;
            }

            ids.Add(role.Id);
        }

        return ids;
    }

    /// <summary>Profiles who hold any of the roles in the org: members with the catalogue role, holders of a covering cross-org role.</summary>
    public async Task<IReadOnlyList<Guid>> HoldersAsync(Guid orgId, IReadOnlyCollection<Guid> roleIds, CancellationToken cancellationToken = default)
    {
        if (roleIds.Count == 0)
        {
            return [];
        }

        var ids = roleIds.ToList();
        var members = await db.OrgRoleAssignments.AsNoTracking().Where(a => a.OrganizationId == orgId && ids.Contains(a.RoleDefinitionId))
            .Select(a => a.ProfileId).ToListAsync(cancellationToken);
        var org = await db.Organizations.AsNoTracking().SingleAsync(o => o.Id == orgId, cancellationToken);
        var roles = await db.CrossOrgRoles.AsNoTracking().Where(r => ids.Contains(r.Id)).ToDictionaryAsync(r => r.Id, cancellationToken);
        var crossIds = roles.Keys.ToList();
        var assignments = await db.CrossOrgAssignments.AsNoTracking().Where(a => crossIds.Contains(a.CrossOrgRoleId)).ToListAsync(cancellationToken);
        var crossOrg = assignments.Where(a => AccessResolver.CrossOrgCovers(roles[a.CrossOrgRoleId], a, org)).Select(a => a.ProfileId);
        return [.. members.Concat(crossOrg).Distinct()];
    }

    /// <summary>The caller's role ids per covered org (catalogue roles held there and cross-org roles covering it).</summary>
    public static IReadOnlyDictionary<Guid, List<Guid>> HeldPerOrg(CallerAccess access) =>
        access.Orgs.Values.ToDictionary(o => o.OrgId, o => o.RoleIds.Concat(o.CrossOrgRoleIds).ToList());

    /// <summary>
    /// A predicate true for items whose org is one of the caller's and whose shared roles include a role the caller holds
    /// in that org. Built as one OR per org so it stays a single translatable query.
    /// </summary>
    public static Expression<Func<T, bool>> HeldIn<T>(
        CallerAccess access, Expression<Func<T, Guid>> orgOf, Expression<Func<T, IEnumerable<Guid>>> sharedRoleIds)
    {
        var item = Expression.Parameter(typeof(T), "item");
        Expression body = Expression.Constant(false);
        foreach (var (orgId, roleIds) in HeldPerOrg(access).Where(p => p.Value.Count > 0))
        {
            var org = Replace(orgOf, item);
            var shared = Replace(sharedRoleIds, item);
            Expression<Func<Guid, bool>> contains = id => roleIds.Contains(id);
            var any = Expression.Call(typeof(Enumerable), nameof(Enumerable.Any), [typeof(Guid)], shared, contains);
            var match = Expression.AndAlso(Expression.Equal(org, Expression.Constant(orgId)), any);
            body = Expression.OrElse(body, match);
        }

        return Expression.Lambda<Func<T, bool>>(body, item);
    }

    /// <summary>Either predicate, as one expression.</summary>
    public static Expression<Func<T, bool>> Or<T>(Expression<Func<T, bool>> left, Expression<Func<T, bool>> right)
    {
        var item = Expression.Parameter(typeof(T), "item");
        return Expression.Lambda<Func<T, bool>>(Expression.OrElse(Replace(left, item), Replace(right, item)), item);
    }

    /// <summary>Both predicates, as one expression.</summary>
    public static Expression<Func<T, bool>> And<T>(Expression<Func<T, bool>> left, Expression<Func<T, bool>> right)
    {
        var item = Expression.Parameter(typeof(T), "item");
        return Expression.Lambda<Func<T, bool>>(Expression.AndAlso(Replace(left, item), Replace(right, item)), item);
    }

    private static Expression Replace<T, TResult>(Expression<Func<T, TResult>> lambda, ParameterExpression item) =>
        new ParameterReplacer(lambda.Parameters[0], item).Visit(lambda.Body);

    private sealed class ParameterReplacer(ParameterExpression from, ParameterExpression to) : ExpressionVisitor
    {
        protected override Expression VisitParameter(ParameterExpression node) => node == from ? to : base.VisitParameter(node);
    }

    /// <summary>An assignment with no narrowing, to ask whether a role's own scope covers an org.</summary>
    private sealed class CrossOrgAssignmentStub
    {
        public Domain.Organizations.CrossOrgAssignment Value { get; } = new(Guid.Empty, Guid.Empty, null, Guid.Empty, DateTime.UnixEpoch);
    }
}
