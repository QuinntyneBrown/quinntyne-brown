using QuinntyneBrown.Community.Application.Admin;

namespace QuinntyneBrown.Community.Api.Endpoints;

/// <summary>
/// Role assignment on profiles (L2-136): catalogue roles and Org Lead in one org (the body's or the query's
/// <c>organizationId</c>, else the active org), Portfolio Lead and System Admin on the platform. Both routes return the
/// profile's roles in that org after the change.
/// </summary>
public static class RolesEndpoints
{
    public static IEndpointRouteBuilder MapRolesEndpoints(this IEndpointRouteBuilder app)
    {
        var roles = app.MapGroup("/api/profiles/{id:guid}/roles");

        roles.MapPost("", async (Guid id, AssignRoleCommand command, ChangeRolesHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, updated) = await handler.AssignAsync(id, command, cancellationToken);
            return result.ToHttp(() => Results.Ok(updated));
        });

        roles.MapDelete("/{role}", async (Guid id, string role, Guid? organizationId, ChangeRolesHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, updated) = await handler.RemoveAsync(id, role, organizationId, cancellationToken);
            return result.ToHttp(() => Results.Ok(updated));
        });

        return app;
    }
}
