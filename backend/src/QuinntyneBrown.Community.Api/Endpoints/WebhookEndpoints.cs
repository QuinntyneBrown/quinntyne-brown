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

    public const string UnauthenticatedDetail = "The request could not be authenticated.";

    public static IEndpointRouteBuilder MapWebhookEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost(Path, async (HttpRequest request, ReceiveEventHandler handler, CancellationToken cancellationToken) =>
        {
            var body = await ReadBodyAsync(request, cancellationToken);
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
        .DisableAntiforgery();

        return app;
    }

    private static async Task<ReadOnlyMemory<byte>> ReadBodyAsync(HttpRequest request, CancellationToken cancellationToken)
    {
        using var buffer = new MemoryStream();
        await request.Body.CopyToAsync(buffer, cancellationToken);
        return buffer.ToArray();
    }
}
