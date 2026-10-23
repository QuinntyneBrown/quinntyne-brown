using System.Globalization;
using System.Text.Json;
using System.Text.RegularExpressions;
using QuinntyneBrown.Community.Domain.Integrations;

namespace QuinntyneBrown.Community.Application.Integrations;

/// <summary>A valid envelope: the publisher's event id and type, when it happened, and its data object as sent.</summary>
public sealed record WebhookEnvelope(Guid EventId, string EventType, DateTimeOffset OccurredAt, string DataJson);

/// <summary>Reads and checks an envelope against the ICD's rules, collecting errors keyed by field path (L2-162 AC3).</summary>
public static partial class WebhookEnvelopeParser
{
    public static (WebhookEnvelope? Envelope, IReadOnlyDictionary<string, string[]> Errors) Parse(ReadOnlyMemory<byte> body)
    {
        var errors = new Dictionary<string, string[]>();
        JsonDocument document;
        try
        {
            document = JsonDocument.Parse(body);
        }
        catch (JsonException)
        {
            errors["body"] = ["Send one JSON object."];
            return (null, errors);
        }

        using (document)
        {
            var root = document.RootElement;
            if (root.ValueKind != JsonValueKind.Object)
            {
                errors["body"] = ["Send one JSON object."];
                return (null, errors);
            }

            Guid eventId = default;
            if (!root.TryGetProperty("eventId", out var id) || id.ValueKind != JsonValueKind.String || !Guid.TryParse(id.GetString(), out eventId))
            {
                errors["eventId"] = ["Send eventId as a UUID."];
            }

            var eventType = root.TryGetProperty("eventType", out var type) && type.ValueKind == JsonValueKind.String ? type.GetString()! : null;
            if (eventType is null || eventType.Length > IntegrationEvent.EventTypeMaxLength || !EventTypePattern().IsMatch(eventType))
            {
                errors["eventType"] = ["Send eventType as 1 to 100 lowercase letters, digits, dots and hyphens."];
            }

            DateTimeOffset occurredAt = default;
            if (!root.TryGetProperty("occurredAt", out var occurred) || occurred.ValueKind != JsonValueKind.String
                || !TryParseOccurredAt(occurred.GetString()!, out occurredAt))
            {
                errors["occurredAt"] = ["Send occurredAt as an ISO 8601 date and time with an offset."];
            }

            if (!root.TryGetProperty("data", out var data) || data.ValueKind != JsonValueKind.Object)
            {
                errors["data"] = ["Send data as a JSON object."];
                return (null, errors);
            }

            return errors.Count > 0 ? (null, errors) : (new WebhookEnvelope(eventId, eventType!, occurredAt, data.GetRawText()), errors);
        }
    }

    private static bool TryParseOccurredAt(string value, out DateTimeOffset occurredAt)
    {
        occurredAt = default;
        var hasOffset = value.EndsWith('Z') || value.EndsWith('z') || OffsetPattern().IsMatch(value);
        return hasOffset && DateTimeOffset.TryParse(value, CultureInfo.InvariantCulture, DateTimeStyles.None, out occurredAt);
    }

    [GeneratedRegex("^[a-z0-9]+([.-][a-z0-9]+)*$")]
    private static partial Regex EventTypePattern();

    [GeneratedRegex(@"[+-]\d{2}:\d{2}$")]
    private static partial Regex OffsetPattern();
}
