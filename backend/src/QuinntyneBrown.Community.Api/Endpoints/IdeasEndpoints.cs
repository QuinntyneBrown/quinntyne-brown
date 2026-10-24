using QuinntyneBrown.Community.Api.Middleware;
using QuinntyneBrown.Community.Application.Ideas;

namespace QuinntyneBrown.Community.Api.Endpoints;

/// <summary>Ideas (L2-168 to L2-181): the Idea form for System Admin and the switches for members' wizards.</summary>
public static class IdeasEndpoints
{
    public static IEndpointRouteBuilder MapIdeasEndpoints(this IEndpointRouteBuilder app)
    {
        // The only anonymous Ideas endpoint: validated by the handler and rate limited (L2-177, L2-178, ADR 0044).
        app.MapPost("/api/ideas", async (SubmitIdeaCommand command, SubmitIdeaHandler handler, CancellationToken cancellationToken) =>
            {
                var (result, idea) = await handler.HandleAsync(command, cancellationToken);
                return result.ToHttp(() => Results.Created($"/api/ideas/{idea!.Id}", idea));
            })
            .AllowAnonymous()
            .RequireRateLimiting(WebProtectionSetup.IdeaSubmitRateLimitPolicy);

        app.MapGet("/api/ideas/form", async (IdeaFormHandler handler, CancellationToken cancellationToken) =>
            Results.Ok(await handler.GetFormAsync(cancellationToken)));

        // Anyone but System Admin gets 404 (L2-181 AC3, ADR 0044).
        var settings = app.MapGroup("/api/admin/ideas/settings");

        settings.MapGet("", async (IdeaFormHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, found) = await handler.GetSettingsAsync(cancellationToken);
            return result.ToHttp(() => Results.Ok(found));
        });

        settings.MapPut("", async (SaveIdeaFormCommand command, IdeaFormHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, saved) = await handler.SaveSettingsAsync(command, cancellationToken);
            return result.ToHttp(() => Results.Ok(saved));
        });

        return app;
    }
}
