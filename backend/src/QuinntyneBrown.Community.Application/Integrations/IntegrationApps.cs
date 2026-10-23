using QuinntyneBrown.Community.Application.Admin;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Application.Profiles;
using QuinntyneBrown.Community.Domain.Integrations;
using QuinntyneBrown.Community.Domain.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Integrations;

public record IntegrationAppDto(
    Guid Id,
    string Name,
    string SourceId,
    string SecretPrefix,
    OrgLabel Organization,
    string Status,
    DateTimeOffset CreatedAt,
    PersonRefDto CreatedBy,
    DateTimeOffset? RotatedAt,
    DateTimeOffset? PreviousSecretExpiresAt,
    DateTimeOffset? RevokedAt,
    PersonRefDto? RevokedBy,
    DateTimeOffset? LastEventAt,
    int EventCount,
    bool CanManage);

/// <summary>The only response that carries the secret, once (L2-158 AC1).</summary>
public record RegisteredAppDto(IntegrationAppDto App, string Secret);

/// <summary>The new secret, once, and when the one rotated out stops working (L2-159 AC1).</summary>
public record RotatedSecretDto(IntegrationAppDto App, string Secret, DateTimeOffset PreviousSecretExpiresAt);

public record RegisterAppCommand(string? Name);

/// <summary>
/// Registers, rotates and revokes applications (L2-158 to L2-160, L2-167). An application is visible where its org is
/// covered with the integrations feature on and the caller holds <c>integrations.view</c>; anything else is 404.
/// Changing one needs <c>integrations.manage</c> (403 otherwise). Every change is audited without the secret.
/// </summary>
public class IntegrationAppsHandler(
    IApplicationDbContext db,
    ICurrentUser current,
    ProfileAccess profiles,
    ISecretProtector protector,
    IAuditLog audit,
    TimeProvider time)
{
    public const string RevokedMessage = "This application is revoked.";

    public async Task<(Result Result, RegisteredAppDto? Registered)> RegisterAsync(RegisterAppCommand command, CancellationToken cancellationToken = default)
    {
        var target = current.Access.TargetFor(Permissions.IntegrationsManage);
        if (!target.Allowed)
        {
            return (target.Refusal!, null);
        }

        var name = command.Name?.Trim() ?? string.Empty;
        if (name.Length is 0 or > IntegrationApp.NameMaxLength)
        {
            return (Result.Invalid("name", "Enter a name of 80 characters or fewer."), null);
        }

        var actor = await profiles.CallerProfileIdAsync(cancellationToken) ?? Guid.Empty;
        var secret = WebhookCredentials.NewSecret();
        var app = new IntegrationApp(
            target.OrgId, name, WebhookCredentials.NewSourceId(), protector.Protect(secret), WebhookCredentials.Prefix(secret), actor, time.GetUtcNow());
        db.IntegrationApps.Add(app);
        audit.Record(actor, "integration.registered", nameof(IntegrationApp), app.Id.ToString(), null, new { app.Name, app.SourceId }, app.OrganizationId);
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), new RegisteredAppDto(await ToDtoAsync(app, cancellationToken), secret));
    }

    private async Task<IntegrationAppDto> ToDtoAsync(IntegrationApp app, CancellationToken cancellationToken) =>
        (await ToDtosAsync([app], cancellationToken))[0];

    private async Task<IReadOnlyList<IntegrationAppDto>> ToDtosAsync(IReadOnlyList<IntegrationApp> apps, CancellationToken cancellationToken)
    {
        var appIds = apps.Select(a => a.Id).ToList();
        var stats = await db.IntegrationEvents.AsNoTracking().Where(e => appIds.Contains(e.IntegrationAppId))
            .GroupBy(e => e.IntegrationAppId)
            .Select(g => new { AppId = g.Key, Count = g.Count(), Last = g.Max(e => e.ReceivedAt) })
            .ToDictionaryAsync(s => s.AppId, cancellationToken);
        var peopleIds = apps.Select(a => a.CreatedById).Concat(apps.Where(a => a.RevokedById is not null).Select(a => a.RevokedById!.Value)).Distinct().ToList();
        var people = await db.Profiles.AsNoTracking().Where(p => peopleIds.Contains(p.Id)).ToDictionaryAsync(p => p.Id, p => p.Name, cancellationToken);
        var orgIds = apps.Select(a => a.OrganizationId).Distinct().ToList();
        var orgs = await db.Organizations.AsNoTracking().Where(o => orgIds.Contains(o.Id))
            .ToDictionaryAsync(o => o.Id, o => new OrgLabel(o.Id, o.Slug, o.DisplayName ?? o.Name), cancellationToken);
        PersonRefDto Person(Guid id) => new(id, people.GetValueOrDefault(id, "Someone"));
        return [.. apps.Select(a => new IntegrationAppDto(
            a.Id, a.Name, a.SourceId, a.SecretPrefix, orgs[a.OrganizationId], a.IsRevoked ? "Revoked" : "Active", a.CreatedAt, Person(a.CreatedById),
            a.RotatedAt, a.PreviousSecretExpiresAt, a.RevokedAt, a.RevokedById is { } by ? Person(by) : null,
            stats.TryGetValue(a.Id, out var s) ? s.Last : null, s?.Count ?? 0,
            current.Access.Has(a.OrganizationId, Permissions.IntegrationsManage)))];
    }
}
