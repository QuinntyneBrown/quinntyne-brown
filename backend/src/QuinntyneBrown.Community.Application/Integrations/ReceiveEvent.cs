using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Domain.Integrations;
using QuinntyneBrown.Community.Domain.Organizations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace QuinntyneBrown.Community.Application.Integrations;

/// <summary>One webhook request as received: the three headers, the content type and the raw body.</summary>
public sealed record WebhookDelivery(string? Source, string? Timestamp, string? Signature, string? ContentType, ReadOnlyMemory<byte> Body);

public enum WebhookOutcomeKind
{
    Accepted,
    Duplicate,
    Unauthorized,
    Invalid,
}

public sealed record WebhookOutcome(WebhookOutcomeKind Kind, Guid? EventId = null, IReadOnlyDictionary<string, string[]>? Errors = null)
{
    public static readonly WebhookOutcome Unauthorized = new(WebhookOutcomeKind.Unauthorized);
}

/// <summary>
/// Receives one delivery (L2-161 to L2-163): authenticates it by source, timestamp window and signature, then checks
/// the envelope and stores the event once per application. Every authentication failure is the same outcome, and only
/// its reason is logged, never the body or the signature.
/// </summary>
public partial class ReceiveEventHandler(IApplicationDbContext db, ISecretProtector protector, TimeProvider time, ILogger<ReceiveEventHandler> logger)
{
    public static readonly TimeSpan TimestampTolerance = TimeSpan.FromSeconds(300);

    public async Task<WebhookOutcome> HandleAsync(WebhookDelivery delivery, CancellationToken cancellationToken = default)
    {
        var now = time.GetUtcNow();
        var app = string.IsNullOrEmpty(delivery.Source) || delivery.Source.Length > 100
            ? null
            : await db.IntegrationApps.SingleOrDefaultAsync(a => a.SourceId == delivery.Source, cancellationToken);
        if (app is null)
        {
            return Refuse("unknown source");
        }

        if (app.IsRevoked)
        {
            return Refuse("revoked source");
        }

        var org = await db.Organizations.AsNoTracking().Where(o => o.Id == app.OrganizationId)
            .Join(db.OrgTypes.AsNoTracking(), o => o.OrgTypeId, t => t.Id, (o, t) => new { o.ArchivedAtUtc, t.EnabledFeatures })
            .SingleOrDefaultAsync(cancellationToken);
        if (org is null || org.ArchivedAtUtc is not null || !org.EnabledFeatures.Contains(Features.Integrations))
        {
            return Refuse("org archived or integrations off");
        }

        if (WebhookSignature.ParseTimestamp(delivery.Timestamp) is not { } timestamp || (now - timestamp).Duration() > TimestampTolerance)
        {
            return Refuse("timestamp outside the window");
        }

        if (WebhookSignature.Decode(delivery.Signature) is not { } presented || !Signed(app, presented, delivery, now))
        {
            return Refuse("signature mismatch");
        }

        var (envelope, errors) = WebhookEnvelopeParser.Parse(delivery.Body);
        if (envelope is null)
        {
            return new WebhookOutcome(WebhookOutcomeKind.Invalid, Errors: errors);
        }

        db.IntegrationEvents.Add(new IntegrationEvent(app.Id, app.OrganizationId, envelope.EventId, envelope.EventType, envelope.OccurredAt, now, envelope.DataJson));
        await db.SaveChangesAsync(cancellationToken);
        return new WebhookOutcome(WebhookOutcomeKind.Accepted, envelope.EventId);
    }

    /// <summary>The current secret, then the previous one while it is valid (L2-159 AC1).</summary>
    private bool Signed(IntegrationApp app, byte[] presented, WebhookDelivery delivery, DateTimeOffset now)
    {
        foreach (var ciphertext in new[] { app.SecretCiphertext, app.PreviousSecretAt(now) })
        {
            if (ciphertext is not null && protector.Unprotect(ciphertext) is { } secret
                && WebhookSignature.Matches(presented, secret, delivery.Timestamp!, delivery.Body.Span))
            {
                return true;
            }
        }

        return false;
    }

    private WebhookOutcome Refuse(string reason)
    {
        LogRefused(logger, reason);
        return WebhookOutcome.Unauthorized;
    }

    [LoggerMessage(Level = LogLevel.Information, Message = "Webhook refused: {Reason}")]
    private static partial void LogRefused(ILogger logger, string reason);
}
