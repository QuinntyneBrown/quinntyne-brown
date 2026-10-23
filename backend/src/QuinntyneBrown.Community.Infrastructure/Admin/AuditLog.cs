using System.Text.Json;
using QuinntyneBrown.Community.Application.Admin;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Domain.Admin;
using QuinntyneBrown.Community.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;

namespace QuinntyneBrown.Community.Infrastructure.Admin;

/// <summary>
/// Adds audit entries to the community database, stamped with UTC time, the caller's IP address, the org and
/// portfolio, and for an agent the token it used (ADR 0036).
/// </summary>
public class AuditLog(CommunityDbContext db, IHttpContextAccessor http, ICurrentUser current, TimeProvider time) : IAuditLog
{
    public void Record(
        Guid actorId, string action, string targetType, string targetId, object? before, object? after,
        Guid? organizationId = null, Guid? portfolioId = null)
    {
        var access = current.Access;
        portfolioId ??= organizationId is { } org && access.Orgs.TryGetValue(org, out var covered)
            ? covered.PortfolioId
            : db.Organizations.Local.FirstOrDefault(o => o.Id == organizationId)?.PortfolioId
                ?? (organizationId is { } id ? db.Organizations.Where(o => o.Id == id).Select(o => (Guid?)o.PortfolioId).FirstOrDefault() : null);
        db.AuditEntries.Add(new AuditEntry(
            actorId,
            action,
            targetType,
            targetId,
            before is null ? null : JsonSerializer.Serialize(before),
            after is null ? null : JsonSerializer.Serialize(after),
            time.GetUtcNow().UtcDateTime,
            http.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            organizationId,
            portfolioId,
            access.CredentialId is { } credential ? AgentDetail(credential) : null));
    }

    private string AgentDetail(Guid credentialId)
    {
        var credential = db.AgentCredentials.Where(c => c.Id == credentialId).Select(c => new { c.Id, c.Name, c.IssuedById }).FirstOrDefault();
        return JsonSerializer.Serialize(new { CredentialId = credentialId, credential?.Name, credential?.IssuedById });
    }
}
