using QuinntyneBrown.Community.Application.Admin;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Profiles;
using QuinntyneBrown.Community.Domain.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Organizations;

public record CrossOrgRoleDto(
    Guid Id, string Key, string Name, string? Description, IReadOnlyList<string> Permissions, bool CanJoinWork,
    string ScopeKind, Guid? ScopeOrgTypeId, IReadOnlyList<Guid> ScopeOrgIds, int HolderCount);

public record CrossOrgScopeRequest(string? Kind, Guid? OrgTypeId, IReadOnlyList<Guid>? OrgIds);

public record CrossOrgRoleRequest(
    string? Key, string? Name, string? Description, IReadOnlyList<string>? Permissions, bool CanJoinWork, CrossOrgScopeRequest? Scope);

public record CrossOrgAssignmentDto(Guid Id, Guid ProfileId, string Name, IReadOnlyList<Guid> NarrowedOrgIds);

public record AssignCrossOrgCommand(Guid ProfileId, IReadOnlyList<Guid>? NarrowedOrgIds);

public record NarrowAssignmentCommand(IReadOnlyList<Guid>? NarrowedOrgIds);

/// <summary>
/// Cross-org roles and their assignments (L2-138 AC7): created, edited, assigned and unassigned by the portfolio's
/// Portfolio Lead or a System Admin, and audited. A holder covers the role's orgs on their next request.
/// </summary>
public class CrossOrgRolesHandler(IApplicationDbContext db, ICurrentUser current, ProfileAccess profiles, IAuditLog audit, TimeProvider time)
{
    private static readonly System.Text.RegularExpressions.Regex KeyPattern = new("^[a-z0-9]+(-[a-z0-9]+)*$");

    public async Task<(Result Result, IReadOnlyList<CrossOrgRoleDto>? Roles)> ListAsync(Guid portfolioId, CancellationToken cancellationToken = default)
    {
        if (PortfolioAccess.Refusal(current.Access, portfolioId) is { } refusal)
        {
            return (refusal, null);
        }

        var roles = await db.CrossOrgRoles.AsNoTracking().Where(r => r.PortfolioId == portfolioId).OrderBy(r => r.Name).ToListAsync(cancellationToken);
        var ids = roles.Select(r => r.Id).ToList();
        var holders = await db.CrossOrgAssignments.AsNoTracking().Where(a => ids.Contains(a.CrossOrgRoleId)).GroupBy(a => a.CrossOrgRoleId)
            .Select(g => new { g.Key, Count = g.Count() }).ToDictionaryAsync(g => g.Key, g => g.Count, cancellationToken);
        return (Result.Ok(), [.. roles.Select(r => Dto(r, holders.GetValueOrDefault(r.Id)))]);
    }

    public async Task<(Result Result, CrossOrgRoleDto? Role)> CreateAsync(Guid portfolioId, CrossOrgRoleRequest request, CancellationToken cancellationToken = default)
    {
        if (PortfolioAccess.Refusal(current.Access, portfolioId) is { } refusal)
        {
            return (refusal, null);
        }

        var key = request.Key?.Trim() ?? string.Empty;
        if (!KeyPattern.IsMatch(key) || key.Length > 40)
        {
            return (Result.Invalid("key", "Use lower-case letters, numbers and hyphens, up to 40 characters."), null);
        }

        if (await db.CrossOrgRoles.AnyAsync(r => r.PortfolioId == portfolioId && r.Key == key, cancellationToken))
        {
            return (Result.Invalid("key", "Another cross-org role uses that key."), null);
        }

        if (await ValidateAsync(portfolioId, request, cancellationToken) is { } invalid)
        {
            return (invalid, null);
        }

        var role = new CrossOrgRole(portfolioId, key, request.Name!.Trim(), Description(request), request.Permissions ?? [], request.CanJoinWork);
        ApplyScope(role, request.Scope!);
        db.CrossOrgRoles.Add(role);
        await RecordAsync(portfolioId, "crossOrgRole.created", "CrossOrgRole", role.Id.ToString(), null, Snapshot(role), cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), Dto(role, 0));
    }

    public async Task<(Result Result, CrossOrgRoleDto? Role)> UpdateAsync(Guid id, CrossOrgRoleRequest request, CancellationToken cancellationToken = default)
    {
        var (refusal, role) = await FindAsync(id, cancellationToken);
        if (refusal is not null)
        {
            return (refusal, null);
        }

        if (await ValidateAsync(role!.PortfolioId, request, cancellationToken) is { } invalid)
        {
            return (invalid, null);
        }

        var before = Snapshot(role);
        role.Update(request.Name!.Trim(), Description(request), request.CanJoinWork);
        role.SetPermissions(request.Permissions ?? []);
        ApplyScope(role, request.Scope!);
        await RecordAsync(role.PortfolioId, "crossOrgRole.changed", "CrossOrgRole", role.Id.ToString(), before, Snapshot(role), cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), Dto(role, await db.CrossOrgAssignments.CountAsync(a => a.CrossOrgRoleId == id, cancellationToken)));
    }

    public async Task<(Result Result, IReadOnlyList<CrossOrgAssignmentDto>? Assignments)> AssignmentsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var (refusal, _) = await FindAsync(id, cancellationToken);
        if (refusal is not null)
        {
            return (refusal, null);
        }

        var rows = await db.CrossOrgAssignments.AsNoTracking().Where(a => a.CrossOrgRoleId == id)
            .Join(db.Profiles.AsNoTracking(), a => a.ProfileId, p => p.Id, (a, p) => new { Assignment = a, p.Name })
            .OrderBy(x => x.Name).ToListAsync(cancellationToken);
        return (Result.Ok(), [.. rows.Select(x => new CrossOrgAssignmentDto(x.Assignment.Id, x.Assignment.ProfileId, x.Name, x.Assignment.NarrowedOrgIds))]);
    }

    public async Task<(Result Result, CrossOrgAssignmentDto? Assignment)> AssignAsync(Guid id, AssignCrossOrgCommand command, CancellationToken cancellationToken = default)
    {
        var (refusal, role) = await FindAsync(id, cancellationToken);
        if (refusal is not null)
        {
            return (refusal, null);
        }

        var name = await db.Profiles.Where(p => p.Id == command.ProfileId).Select(p => p.Name).SingleOrDefaultAsync(cancellationToken);
        if (name is null)
        {
            return (Result.Invalid("profileId", "Choose someone to assign."), null);
        }

        if (await db.CrossOrgAssignments.AnyAsync(a => a.CrossOrgRoleId == id && a.ProfileId == command.ProfileId, cancellationToken))
        {
            return (Result.Conflict($"{name} already holds {role!.Name}."), null);
        }

        var narrowed = command.NarrowedOrgIds ?? [];
        if (await NarrowingRefusalAsync(role!, narrowed, cancellationToken) is { } invalid)
        {
            return (invalid, null);
        }

        var actor = await profiles.CallerProfileIdAsync(cancellationToken) ?? Guid.Empty;
        var assignment = new CrossOrgAssignment(id, command.ProfileId, narrowed, actor, time.GetUtcNow().UtcDateTime);
        db.CrossOrgAssignments.Add(assignment);
        audit.Record(actor, "crossOrgRole.assigned", "Profile", command.ProfileId.ToString(), null, new { Role = role!.Key, NarrowedOrgIds = narrowed }, null, role.PortfolioId);
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), new CrossOrgAssignmentDto(assignment.Id, command.ProfileId, name, assignment.NarrowedOrgIds));
    }

    public async Task<(Result Result, CrossOrgAssignmentDto? Assignment)> NarrowAsync(Guid id, Guid assignmentId, NarrowAssignmentCommand command, CancellationToken cancellationToken = default)
    {
        var (refusal, role) = await FindAsync(id, cancellationToken);
        if (refusal is not null)
        {
            return (refusal, null);
        }

        var assignment = await db.CrossOrgAssignments.SingleOrDefaultAsync(a => a.Id == assignmentId && a.CrossOrgRoleId == id, cancellationToken);
        if (assignment is null)
        {
            return (Result.NotFound(), null);
        }

        var narrowed = command.NarrowedOrgIds ?? [];
        if (await NarrowingRefusalAsync(role!, narrowed, cancellationToken) is { } invalid)
        {
            return (invalid, null);
        }

        var before = assignment.NarrowedOrgIds.ToList();
        assignment.Narrow(narrowed);
        var actor = await profiles.CallerProfileIdAsync(cancellationToken) ?? Guid.Empty;
        audit.Record(actor, "crossOrgRole.narrowed", "Profile", assignment.ProfileId.ToString(), new { Role = role!.Key, NarrowedOrgIds = before }, new { Role = role.Key, NarrowedOrgIds = narrowed }, null, role.PortfolioId);
        await db.SaveChangesAsync(cancellationToken);
        var name = await db.Profiles.Where(p => p.Id == assignment.ProfileId).Select(p => p.Name).SingleAsync(cancellationToken);
        return (Result.Ok(), new CrossOrgAssignmentDto(assignment.Id, assignment.ProfileId, name, assignment.NarrowedOrgIds));
    }

    public async Task<Result> UnassignAsync(Guid id, Guid assignmentId, CancellationToken cancellationToken = default)
    {
        var (refusal, role) = await FindAsync(id, cancellationToken);
        if (refusal is not null)
        {
            return refusal;
        }

        var assignment = await db.CrossOrgAssignments.SingleOrDefaultAsync(a => a.Id == assignmentId && a.CrossOrgRoleId == id, cancellationToken);
        if (assignment is null)
        {
            return Result.NotFound();
        }

        db.CrossOrgAssignments.Remove(assignment);
        var actor = await profiles.CallerProfileIdAsync(cancellationToken) ?? Guid.Empty;
        audit.Record(actor, "crossOrgRole.unassigned", "Profile", assignment.ProfileId.ToString(), new { Role = role!.Key, assignment.NarrowedOrgIds }, null, null, role.PortfolioId);
        await db.SaveChangesAsync(cancellationToken);
        return Result.Ok();
    }

    private async Task<Result?> ValidateAsync(Guid portfolioId, CrossOrgRoleRequest request, CancellationToken cancellationToken)
    {
        if ((request.Name?.Trim().Length ?? 0) is 0 or > 60)
        {
            return Result.Invalid("name", "Enter a name of 60 characters or fewer.");
        }

        if ((request.Permissions ?? []).Any(p => !Permissions.IsKnown(p)))
        {
            return Result.Invalid("permissions", "Choose permissions from the list.");
        }

        var scope = request.Scope;
        return scope?.Kind switch
        {
            nameof(CrossOrgScopeKind.Portfolio) => null,
            nameof(CrossOrgScopeKind.OrgType) when scope.OrgTypeId is { } typeId
                && await db.OrgTypes.AnyAsync(t => t.Id == typeId && t.PortfolioId == portfolioId, cancellationToken) => null,
            nameof(CrossOrgScopeKind.Orgs) when scope.OrgIds is { Count: > 0 } ids
                && await db.Organizations.CountAsync(o => ids.Contains(o.Id) && o.PortfolioId == portfolioId, cancellationToken) == ids.Distinct().Count() => null,
            _ => Result.Invalid("scope", "Choose the orgs, the Org Type or the whole portfolio."),
        };
    }

    /// <summary>A narrowed assignment names only orgs the role's scope reaches.</summary>
    private async Task<Result?> NarrowingRefusalAsync(CrossOrgRole role, IReadOnlyList<Guid> narrowed, CancellationToken cancellationToken)
    {
        if (narrowed.Count == 0)
        {
            return null;
        }

        var inScope = await db.Organizations.AsNoTracking()
            .Where(o => narrowed.Contains(o.Id) && o.PortfolioId == role.PortfolioId)
            .Select(o => new { o.Id, o.OrgTypeId }).ToListAsync(cancellationToken);
        var ok = inScope.Count == narrowed.Distinct().Count() && inScope.All(o => role.ScopeKind switch
        {
            CrossOrgScopeKind.Portfolio => true,
            CrossOrgScopeKind.OrgType => o.OrgTypeId == role.ScopeOrgTypeId,
            _ => role.ScopeOrgIds.Contains(o.Id),
        });
        return ok ? null : Result.Invalid("narrowedOrgIds", "Choose orgs the role covers.");
    }

    private static void ApplyScope(CrossOrgRole role, CrossOrgScopeRequest scope)
    {
        switch (scope.Kind)
        {
            case nameof(CrossOrgScopeKind.OrgType):
                role.ScopeToOrgType(scope.OrgTypeId!.Value);
                break;
            case nameof(CrossOrgScopeKind.Orgs):
                role.ScopeToOrgs(scope.OrgIds!);
                break;
            default:
                role.ScopeToPortfolio();
                break;
        }
    }

    private static string? Description(CrossOrgRoleRequest request) =>
        string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();

    private static object Snapshot(CrossOrgRole role) =>
        new { role.Key, role.Name, role.Description, role.Permissions, role.CanJoinWork, Scope = role.ScopeKind.ToString(), role.ScopeOrgTypeId, role.ScopeOrgIds };

    private static CrossOrgRoleDto Dto(CrossOrgRole role, int holders) => new(
        role.Id, role.Key, role.Name, role.Description, role.Permissions, role.CanJoinWork, role.ScopeKind.ToString(),
        role.ScopeOrgTypeId, role.ScopeOrgIds, holders);

    private async Task<(Result? Refusal, CrossOrgRole? Role)> FindAsync(Guid id, CancellationToken cancellationToken)
    {
        var role = await db.CrossOrgRoles.SingleOrDefaultAsync(r => r.Id == id, cancellationToken);
        if (role is null)
        {
            return (Result.NotFound(), null);
        }

        return PortfolioAccess.Refusal(current.Access, role.PortfolioId) is { } refusal ? (refusal, null) : (null, role);
    }

    private async Task RecordAsync(Guid portfolioId, string action, string targetType, string targetId, object? before, object? after, CancellationToken cancellationToken)
    {
        var actor = await profiles.CallerProfileIdAsync(cancellationToken) ?? Guid.Empty;
        audit.Record(actor, action, targetType, targetId, before, after, null, portfolioId);
    }
}
