using QuinntyneBrown.Community.Application.Integrations;

namespace QuinntyneBrown.Community.Api.Endpoints;

/// <summary>Applications and their events (L2-158 to L2-160, L2-165, L2-166). Requires authentication.</summary>
public static class IntegrationsEndpoints
{
    public static IEndpointRouteBuilder MapIntegrationsEndpoints(this IEndpointRouteBuilder app)
    {
        var apps = app.MapGroup("/api/integrations/apps");

        apps.MapPost("", async (RegisterAppCommand command, IntegrationAppsHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, registered) = await handler.RegisterAsync(command, cancellationToken);
            return result.ToHttp(() => Results.Created($"/api/integrations/apps/{registered!.App.Id}", registered));
        });

        return app;
    }
}
