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
    public const string ContactRequestCreated = "contact-request.created";

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

            if (eventType == ContactRequestCreated)
            {
                CheckContactRequest(data, errors);
            }

            return errors.Count > 0 ? (null, errors) : (new WebhookEnvelope(eventId, eventType!, occurredAt, data.GetRawText()), errors);
        }
    }

    /// <summary>The ICD's version 1 limits for a contact request; other fields in data are kept but not checked.</summary>
    private static void CheckContactRequest(JsonElement data, Dictionary<string, string[]> errors)
    {
        Text(data, "name", required: true, 200, "Send name as 1 to 200 characters.", errors);
        var email = Text(data, "email", required: true, 254, "Send email as a valid address of at most 254 characters.", errors);
        if (email is not null && !LooksLikeEmail(email))
        {
            errors["data.email"] = ["Send email as a valid address of at most 254 characters."];
        }

        Text(data, "message", required: true, 5000, "Send message as 1 to 5,000 characters.", errors);
        Text(data, "organization", required: false, 200, "Send organization as at most 200 characters, or leave it out.", errors);
        Text(data, "phone", required: false, 40, "Send phone as at most 40 characters, or leave it out.", errors);
    }

    /// <summary>The trimmed text of a string field, recording an error when it is missing, empty or too long.</summary>
    private static string? Text(JsonElement data, string field, bool required, int max, string message, Dictionary<string, string[]> errors)
    {
        var present = data.TryGetProperty(field, out var value) && value.ValueKind != JsonValueKind.Null;
        if (!present)
        {
            if (required)
            {
                errors[$"data.{field}"] = [message];
            }

            return null;
        }

        var text = value.ValueKind == JsonValueKind.String ? value.GetString()!.Trim() : null;
        if (text is null || text.Length > max || (required && text.Length == 0))
        {
            errors[$"data.{field}"] = [message];
            return null;
        }

        return text;
    }

    /// <summary>One @ with something either side and no whitespace, as the sign-up form's check.</summary>
    private static bool LooksLikeEmail(string email)
    {
        var at = email.IndexOf('@');
        return at > 0 && at == email.LastIndexOf('@') && at < email.Length - 1 && !email.Any(char.IsWhiteSpace);
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
