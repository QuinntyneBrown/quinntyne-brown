using QuinntyneBrown.Community.Api.Middleware;
using QuinntyneBrown.Community.Api.Middleware.PrivatePreview;
using QuinntyneBrown.Community.Application.Integrations;

namespace QuinntyneBrown.Community.Api.Endpoints;

/// <summary>
/// The inbound webhook (L2-161 to L2-164, ICD). The only anonymous integrations endpoint: it is authenticated by its
/// HMAC signature, passes the private-preview wall by exact path, and is rate limited per source (ADR 0042).
/// </summary>
public static class WebhookEndpoints
{
    public const string Path = PrivatePreviewGateMiddleware.WebhookPath;

    public const int MaxBodyBytes = 65_536;

    public const string UnauthenticatedDetail = "The request could not be authenticated.";

    public static IEndpointRouteBuilder MapWebhookEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost(Path, async (HttpRequest request, ReceiveEventHandler handler, CancellationToken cancellationToken) =>
        {
            if (request.ContentLength > MaxBodyBytes || await ReadBodyAsync(request, cancellationToken) is not { } body)
            {
                return Results.StatusCode(StatusCodes.Status413PayloadTooLarge);
            }

            var outcome = await handler.HandleAsync(
                new WebhookDelivery(
                    request.Headers["X-Webhook-Source"].ToString(),
                    request.Headers["X-Webhook-Timestamp"].ToString(),
                    request.Headers["X-Webhook-Signature"].ToString(),
                    request.ContentType,
                    body),
                cancellationToken);
            return outcome.Kind switch
            {
                WebhookOutcomeKind.Accepted => Results.Json(new { status = "accepted", eventId = outcome.EventId }, statusCode: StatusCodes.Status202Accepted),
                WebhookOutcomeKind.Duplicate => Results.Json(new { status = "duplicate", eventId = outcome.EventId }),
                WebhookOutcomeKind.Invalid => Results.ValidationProblem(outcome.Errors!.ToDictionary()),
                _ => Results.Problem(UnauthenticatedDetail, statusCode: StatusCodes.Status401Unauthorized),
            };
        })
        .AllowAnonymous()
        .DisableAntiforgery()
        .RequireRateLimiting(WebProtectionSetup.WebhookRateLimitPolicy);

        return app;
    }

    /// <summary>The raw body, or null as soon as it passes <see cref="MaxBodyBytes"/> (L2-162 AC2).</summary>
    private static async Task<byte[]?> ReadBodyAsync(HttpRequest request, CancellationToken cancellationToken)
    {
        using var buffer = new MemoryStream();
        var chunk = new byte[8192];
        int read;
        while ((read = await request.Body.ReadAsync(chunk, cancellationToken)) > 0)
        {
            if (buffer.Length + read > MaxBodyBytes)
            {
                return null;
            }

            buffer.Write(chunk, 0, read);
        }

        return buffer.ToArray();
    }
}
