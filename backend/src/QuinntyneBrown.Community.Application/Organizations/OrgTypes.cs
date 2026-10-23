using QuinntyneBrown.Community.Application.Admin;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Profiles;
using QuinntyneBrown.Community.Domain.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Organizations;

public record OrgTypeSummaryDto(Guid Id, string Key, string Name, IReadOnlyList<string> EnabledFeatures, int RoleCount, int OrgCount);

public record RoleDefinitionDto(
    Guid Id, string Key, string Name, string? Description, Guid? ParentRoleId, int SortOrder,
    IReadOnlyList<string> Permissions, IReadOnlyList<Guid> CanGrant, int HolderCount);

/// <summary>A feature's permission codes in the catalogue editor; a disabled feature's codes grant nothing (L2-137 AC4).</summary>
public record PermissionGroupDto(string Feature, bool Enabled, IReadOnlyList<string> Codes);

public record OrgTypeDto(
    Guid Id, string Key, string Name, IReadOnlyList<string> EnabledFeatures, IReadOnlyList<string> MemberPermissions,
    IReadOnlyList<RoleDefinitionDto> Roles, IReadOnlyList<PermissionGroupDto> PermissionCatalogue);

public record CreateOrgTypeCommand(string? Key, string? Name);

public record UpdateOrgTypeCommand(string? Name, IReadOnlyList<string>? MemberPermissions);

public record SetFeaturesCommand(IReadOnlyList<string>? Enabled);

public record RoleDefinitionRequest(
    string? Key, string? Name, string? Description, Guid? ParentRoleId, IReadOnlyList<string>? Permissions, IReadOnlyList<Guid>? CanGrant);

public record RoleOrderItem(Guid RoleId, Guid? ParentRoleId, int SortOrder);

public record ReorderRolesCommand(IReadOnlyList<RoleOrderItem>? Items);

/// <summary>Someone holding a role that cannot be removed while they do (L2-137 AC3).</summary>
public record RoleHolderDto(Guid ProfileId, string Name, OrgLabel Org);

/// <summary>
/// Org Types, their features and their role catalogues (L2-134, L2-137, L2-147), for the portfolio's Portfolio Lead
/// or a System Admin. Every change is audited with its before and after values and applies to every org of the type
/// on the next request, since access is resolved from data each time (ADR 0033).
/// </summary>
public class OrgTypesHandler(IApplicationDbContext db, ICurrentUser current, ProfileAccess profiles, IAuditLog audit)
{
    private static readonly System.Text.RegularExpressions.Regex KeyPattern = new("^[a-z0-9]+(-[a-z0-9]+)*$");

    public async Task<(Result Result, IReadOnlyList<OrgTypeSummaryDto>? Types)> ListAsync(Guid portfolioId, CancellationToken cancellationToken = default)
    {
        if (PortfolioAccess.Refusal(current.Access, portfolioId) is { } refusal)
        {
            return (refusal, null);
        }

        var types = await db.OrgTypes.AsNoTracking().Where(t => t.PortfolioId == portfolioId).OrderBy(t => t.Name).ToListAsync(cancellationToken);
        var ids = types.Select(t => t.Id).ToList();
        var roleCounts = await db.RoleDefinitions.AsNoTracking().Where(r => ids.Contains(r.OrgTypeId)).GroupBy(r => r.OrgTypeId)
            .Select(g => new { g.Key, Count = g.Count() }).ToDictionaryAsync(g => g.Key, g => g.Count, cancellationToken);
        var orgCounts = await db.Organizations.AsNoTracking().Where(o => ids.Contains(o.OrgTypeId) && o.ArchivedAtUtc == null).GroupBy(o => o.OrgTypeId)
            .Select(g => new { g.Key, Count = g.Count() }).ToDictionaryAsync(g => g.Key, g => g.Count, cancellationToken);
        return (Result.Ok(), [.. types.Select(t => new OrgTypeSummaryDto(
            t.Id, t.Key, t.Name, t.EnabledFeatures, roleCounts.GetValueOrDefault(t.Id), orgCounts.GetValueOrDefault(t.Id)))]);
    }

    /// <summary>A new type starts with profiles and notes on, an empty catalogue and an empty Member bundle.</summary>
    public async Task<(Result Result, OrgTypeDto? Type)> CreateAsync(Guid portfolioId, CreateOrgTypeCommand command, CancellationToken cancellationToken = default)
    {
        if (PortfolioAccess.Refusal(current.Access, portfolioId) is { } refusal)
        {
            return (refusal, null);
        }

        var key = command.Key?.Trim() ?? string.Empty;
        var name = command.Name?.Trim() ?? string.Empty;
        if (!KeyPattern.IsMatch(key) || key.Length > 40)
        {
            return (Result.Invalid("key", "Use lower-case letters, numbers and hyphens, up to 40 characters."), null);
        }

        if (name.Length is 0 or > 60)
        {
            return (Result.Invalid("name", "Enter a name of 60 characters or fewer."), null);
        }

        if (await db.OrgTypes.AnyAsync(t => t.PortfolioId == portfolioId && t.Key == key, cancellationToken))
        {
            return (Result.Conflict("Another Org Type uses that key."), null);
        }

        var type = new OrgType(portfolioId, key, name, [], []);
        db.OrgTypes.Add(type);
        await RecordAsync(portfolioId, "orgType.created", "OrgType", type.Id, null, new { type.Key, type.Name }, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), await DtoAsync(type, cancellationToken));
    }

    public async Task<(Result Result, OrgTypeDto? Type)> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var (refusal, type) = await FindAsync(id, tracked: false, cancellationToken);
        return refusal is not null ? (refusal, null) : (Result.Ok(), await DtoAsync(type!, cancellationToken));
    }

    public async Task<(Result Result, OrgTypeDto? Type)> UpdateAsync(Guid id, UpdateOrgTypeCommand command, CancellationToken cancellationToken = default)
    {
        var (refusal, type) = await FindAsync(id, tracked: true, cancellationToken);
        if (refusal is not null)
        {
            return (refusal, null);
        }

        var name = command.Name?.Trim() ?? string.Empty;
        if (name.Length is 0 or > 60)
        {
            return (Result.Invalid("name", "Enter a name of 60 characters or fewer."), null);
        }

        var permissions = command.MemberPermissions ?? [];
        if (permissions.Any(p => !Permissions.IsKnown(p)))
        {
            return (Result.Invalid("memberPermissions", "Choose permissions from the list."), null);
        }

        var before = new { type!.Name, type.MemberPermissions };
        type.Rename(name);
        type.SetMemberPermissions(permissions);
        await RecordAsync(type.PortfolioId, "orgType.changed", "OrgType", type.Id, before, new { type.Name, type.MemberPermissions }, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), await DtoAsync(type, cancellationToken));
    }

    /// <summary>Profiles and notes are always on and never stored; an unknown feature is refused (L2-147 AC4).</summary>
    public async Task<(Result Result, OrgTypeDto? Type)> SetFeaturesAsync(Guid id, SetFeaturesCommand command, CancellationToken cancellationToken = default)
    {
        var (refusal, type) = await FindAsync(id, tracked: true, cancellationToken);
        if (refusal is not null)
        {
            return (refusal, null);
        }

        var enabled = command.Enabled ?? [];
        if (enabled.FirstOrDefault(f => !Features.IsKnown(f)) is { } unknown)
        {
            return (Result.Invalid("enabled", $"“{unknown}” is not a feature."), null);
        }

        var before = type!.EnabledFeatures.ToList();
        type.SetFeatures(enabled);
        await RecordAsync(type.PortfolioId, "orgType.featuresChanged", "OrgType", type.Id, new { Enabled = before }, new { Enabled = type.EnabledFeatures }, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), await DtoAsync(type, cancellationToken));
    }

    public async Task<(Result Result, RoleDefinitionDto? Role)> CreateRoleAsync(Guid typeId, RoleDefinitionRequest request, CancellationToken cancellationToken = default)
    {
        var (refusal, type) = await FindAsync(typeId, tracked: false, cancellationToken);
        if (refusal is not null)
        {
            return (refusal, null);
        }

        var catalogue = await db.RoleDefinitions.Where(r => r.OrgTypeId == typeId).ToListAsync(cancellationToken);
        if (Validate(request, catalogue, null) is { } invalid)
        {
            return (invalid, null);
        }

        var role = new RoleDefinition(typeId, request.Key!.Trim(), request.Name!.Trim(), Description(request), catalogue.Count, request.Permissions ?? [], request.ParentRoleId);
        role.SetCanGrant(request.CanGrant ?? []);
        db.RoleDefinitions.Add(role);
        await RecordAsync(type!.PortfolioId, "catalogue.roleCreated", "RoleDefinition", role.Id, null, Snapshot(role), cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), Dto(role, 0));
    }

    public async Task<(Result Result, RoleDefinitionDto? Role)> UpdateRoleAsync(Guid typeId, Guid roleId, RoleDefinitionRequest request, CancellationToken cancellationToken = default)
    {
        var (refusal, type) = await FindAsync(typeId, tracked: false, cancellationToken);
        if (refusal is not null)
        {
            return (refusal, null);
        }

        var catalogue = await db.RoleDefinitions.Where(r => r.OrgTypeId == typeId).ToListAsync(cancellationToken);
        if (catalogue.SingleOrDefault(r => r.Id == roleId) is not { } role)
        {
            return (Result.NotFound(), null);
        }

        if (Validate(request, catalogue, role) is { } invalid)
        {
            return (invalid, null);
        }

        var before = Snapshot(role);
        role.Update(request.Name!.Trim(), Description(request), request.ParentRoleId, role.SortOrder);
        role.SetPermissions(request.Permissions ?? []);
        role.SetCanGrant(request.CanGrant ?? []);
        await RecordAsync(type!.PortfolioId, "catalogue.roleChanged", "RoleDefinition", role.Id, before, Snapshot(role), cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        var holders = await db.OrgRoleAssignments.CountAsync(a => a.RoleDefinitionId == role.Id, cancellationToken);
        return (Result.Ok(), Dto(role, holders));
    }

    /// <summary>Saves the role tree's order and nesting from the keyboard reorder controls.</summary>
    public async Task<Result> ReorderAsync(Guid typeId, ReorderRolesCommand command, CancellationToken cancellationToken = default)
    {
        var (refusal, type) = await FindAsync(typeId, tracked: false, cancellationToken);
        if (refusal is not null)
        {
            return refusal;
        }

        var catalogue = await db.RoleDefinitions.Where(r => r.OrgTypeId == typeId).ToListAsync(cancellationToken);
        var items = command.Items ?? [];
        var ids = catalogue.Select(r => r.Id).ToHashSet();
        if (items.Any(i => !ids.Contains(i.RoleId) || (i.ParentRoleId is { } p && (!ids.Contains(p) || p == i.RoleId))))
        {
            return Result.Invalid("items", "Every role and parent must belong to this Org Type.");
        }

        var parents = catalogue.ToDictionary(r => r.Id, r => r.ParentRoleId);
        foreach (var item in items)
        {
            parents[item.RoleId] = item.ParentRoleId;
        }

        if (parents.Keys.Any(id => HasCycle(id, parents)))
        {
            return Result.Invalid("items", "A role cannot sit under itself.");
        }

        var before = catalogue.Select(r => new { r.Key, r.ParentRoleId, r.SortOrder }).ToList();
        foreach (var item in items)
        {
            var role = catalogue.Single(r => r.Id == item.RoleId);
            role.Update(role.Name, role.Description, item.ParentRoleId, item.SortOrder);
        }

        await RecordAsync(type!.PortfolioId, "catalogue.rolesReordered", "OrgType", typeId, before,
            catalogue.Select(r => new { r.Key, r.ParentRoleId, r.SortOrder }).ToList(), cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        return Result.Ok();
    }

    /// <summary>Refused with the holders while anyone holds the role; otherwise also dropped from other roles' CanGrant.</summary>
    public async Task<Result> DeleteRoleAsync(Guid typeId, Guid roleId, CancellationToken cancellationToken = default)
    {
        var (refusal, type) = await FindAsync(typeId, tracked: false, cancellationToken);
        if (refusal is not null)
        {
            return refusal;
        }

        var catalogue = await db.RoleDefinitions.Where(r => r.OrgTypeId == typeId).ToListAsync(cancellationToken);
        if (catalogue.SingleOrDefault(r => r.Id == roleId) is not { } role)
        {
            return Result.NotFound();
        }

        var holders = await db.OrgRoleAssignments.AsNoTracking().Where(a => a.RoleDefinitionId == roleId)
            .Join(db.Profiles.AsNoTracking(), a => a.ProfileId, p => p.Id, (a, p) => new { a.OrganizationId, p.Id, p.Name })
            .Join(db.Organizations.AsNoTracking(), x => x.OrganizationId, o => o.Id, (x, o) => new RoleHolderDto(x.Id, x.Name, new OrgLabel(o.Id, o.Slug, o.DisplayName ?? o.Name)))
            .ToListAsync(cancellationToken);
        if (holders.Count > 0)
        {
            return Result.Conflict(
                $"{role.Name} is held by {holders.Count} {(holders.Count == 1 ? "person" : "people")}. Remove it from them first.",
                new Dictionary<string, object?> { ["holders"] = holders });
        }

        foreach (var other in catalogue.Where(r => r.CanGrant.Contains(roleId)))
        {
            other.SetCanGrant(other.CanGrant.Where(id => id != roleId));
        }

        foreach (var child in catalogue.Where(r => r.ParentRoleId == roleId))
        {
            child.Update(child.Name, child.Description, role.ParentRoleId, child.SortOrder);
        }

        db.RoleDefinitions.Remove(role);
        await RecordAsync(type!.PortfolioId, "catalogue.roleRemoved", "RoleDefinition", role.Id, Snapshot(role), null, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        return Result.Ok();
    }

    private static Result? Validate(RoleDefinitionRequest request, IReadOnlyList<RoleDefinition> catalogue, RoleDefinition? existing)
    {
        var key = request.Key?.Trim() ?? string.Empty;
        if (!KeyPattern.IsMatch(key) || key.Length > 40)
        {
            return Result.Invalid("key", "Use lower-case letters, numbers and hyphens, up to 40 characters.");
        }

        if (existing is null && catalogue.Any(r => r.Key == key))
        {
            return Result.Invalid("key", "Another role in this Org Type uses that key.");
        }

        if (existing is not null && key != existing.Key)
        {
            return Result.Invalid("key", "A role's key cannot change.");
        }

        if ((request.Name?.Trim().Length ?? 0) is 0 or > 60)
        {
            return Result.Invalid("name", "Enter a name of 60 characters or fewer.");
        }

        if ((request.Permissions ?? []).Any(p => !Permissions.IsKnown(p)))
        {
            return Result.Invalid("permissions", "Choose permissions from the list.");
        }

        var ids = catalogue.Select(r => r.Id).ToHashSet();
        if (request.ParentRoleId is { } parent && (!ids.Contains(parent) || parent == existing?.Id))
        {
            return Result.Invalid("parentRoleId", "Choose a parent from this Org Type's roles.");
        }

        if (existing is not null && request.ParentRoleId is not null)
        {
            var parents = catalogue.ToDictionary(r => r.Id, r => r.ParentRoleId);
            parents[existing.Id] = request.ParentRoleId;
            if (HasCycle(existing.Id, parents))
            {
                return Result.Invalid("parentRoleId", "A role cannot sit under itself.");
            }
        }

        if ((request.CanGrant ?? []).Any(id => !ids.Contains(id)))
        {
            return Result.Invalid("canGrant", "A role can grant only roles of its own Org Type.");
        }

        return null;
    }

    private static bool HasCycle(Guid id, IReadOnlyDictionary<Guid, Guid?> parents)
    {
        var seen = new HashSet<Guid>();
        for (Guid? at = id; at is { } current; at = parents.GetValueOrDefault(current))
        {
            if (!seen.Add(current))
            {
                return true;
            }
        }

        return false;
    }

    private static string? Description(RoleDefinitionRequest request) =>
        string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();

    private static object Snapshot(RoleDefinition role) =>
        new { role.Key, role.Name, role.Description, role.ParentRoleId, role.Permissions, role.CanGrant };

    private static RoleDefinitionDto Dto(RoleDefinition role, int holders) => new(
        role.Id, role.Key, role.Name, role.Description, role.ParentRoleId, role.SortOrder, role.Permissions, role.CanGrant, holders);

    private async Task<(Result? Refusal, OrgType? Type)> FindAsync(Guid id, bool tracked, CancellationToken cancellationToken)
    {
        var types = tracked ? db.OrgTypes : db.OrgTypes.AsNoTracking();
        var type = await types.SingleOrDefaultAsync(t => t.Id == id, cancellationToken);
        if (type is null)
        {
            return (Result.NotFound(), null);
        }

        return PortfolioAccess.Refusal(current.Access, type.PortfolioId) is { } refusal ? (refusal, null) : (null, type);
    }

    private async Task<OrgTypeDto> DtoAsync(OrgType type, CancellationToken cancellationToken)
    {
        var roles = await db.RoleDefinitions.AsNoTracking().Where(r => r.OrgTypeId == type.Id).ToListAsync(cancellationToken);
        var ids = roles.Select(r => r.Id).ToList();
        var holders = await db.OrgRoleAssignments.AsNoTracking().Where(a => ids.Contains(a.RoleDefinitionId)).GroupBy(a => a.RoleDefinitionId)
            .Select(g => new { g.Key, Count = g.Count() }).ToDictionaryAsync(g => g.Key, g => g.Count, cancellationToken);
        var catalogue = Features.All.Select(f => new PermissionGroupDto(
            f, type.IsEnabled(f), [.. Permissions.All.Where(code => Permissions.FeatureOf[code] == f)])).ToList();
        return new OrgTypeDto(
            type.Id, type.Key, type.Name, type.EnabledFeatures, type.MemberPermissions,
            [.. roles.OrderBy(r => r.SortOrder).ThenBy(r => r.Name).Select(r => Dto(r, holders.GetValueOrDefault(r.Id)))], catalogue);
    }

    private async Task RecordAsync(Guid portfolioId, string action, string targetType, Guid targetId, object? before, object? after, CancellationToken cancellationToken)
    {
        var actor = await profiles.CallerProfileIdAsync(cancellationToken) ?? Guid.Empty;
        audit.Record(actor, action, targetType, targetId.ToString(), before, after, null, portfolioId);
    }
}
