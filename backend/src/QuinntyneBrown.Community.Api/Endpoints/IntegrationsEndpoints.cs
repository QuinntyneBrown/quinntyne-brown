using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Integrations;

namespace QuinntyneBrown.Community.Api.Endpoints;

/// <summary>Applications and their events (L2-158 to L2-160, L2-165, L2-166). Requires authentication.</summary>
public static class IntegrationsEndpoints
{
    public static IEndpointRouteBuilder MapIntegrationsEndpoints(this IEndpointRouteBuilder app)
    {
        var apps = app.MapGroup("/api/integrations/apps");

        apps.MapGet("", async (IntegrationAppsHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, list) = await handler.ListAsync(cancellationToken);
            return result.ToHttp(() => Results.Ok(list));
        });

        apps.MapGet("/{id:guid}", async (Guid id, IntegrationAppsHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, found) = await handler.GetAsync(id, cancellationToken);
            return result.ToHttp(() => Results.Ok(found));
        });

        apps.MapGet("/{id:guid}/events", async (Guid id, int? page, int? pageSize, IntegrationAppsHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, events) = await handler.ListEventsAsync(id, new PageRequest(page ?? 1, pageSize ?? 25), cancellationToken);
            return result.ToHttp(() => Results.Ok(events));
        });

        apps.MapPost("", async (RegisterAppCommand command, IntegrationAppsHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, registered) = await handler.RegisterAsync(command, cancellationToken);
            return result.ToHttp(() => Results.Created($"/api/integrations/apps/{registered!.App.Id}", registered));
        });

        return app;
    }
}
