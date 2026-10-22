using System.Text.Json;
using QuinntyneBrown.Community.Application.Admin;
using QuinntyneBrown.Community.Domain.Admin;
using QuinntyneBrown.Community.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;

namespace QuinntyneBrown.Community.Infrastructure.Admin;

/// <summary>Adds audit entries to the community database, stamped with UTC time and the caller's IP address.</summary>
public class AuditLog(CommunityDbContext db, IHttpContextAccessor http, TimeProvider time) : IAuditLog
{
    public void Record(Guid actorId, string action, string targetType, string targetId, object? before, object? after) =>
        db.AuditEntries.Add(new AuditEntry(
            actorId,
            action,
            targetType,
            targetId,
            before is null ? null : JsonSerializer.Serialize(before),
            after is null ? null : JsonSerializer.Serialize(after),
            time.GetUtcNow().UtcDateTime,
            http.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "unknown"));
}
