using System.Security.Claims;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Identity;
using QuinntyneBrown.Community.Application.Organizations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OpenIddict.Abstractions;

namespace QuinntyneBrown.Community.Api.Endpoints;

public static class MeEndpoints
{
    public static IEndpointRouteBuilder MapMeEndpoints(this IEndpointRouteBuilder app)
    {
        // Name, email and verification come from the database so they stay current for the token's lifetime.
        app.MapGet("/api/me", async (ICurrentUser current, ClaimsPrincipal principal, UserManager<CommunityUser> users, IApplicationDbContext db) =>
        {
            var user = current.UserId is { } id ? await users.FindByIdAsync(id.ToString()) : null;
            var name = user is null
                ? principal.FindFirst(OpenIddictConstants.Claims.Name)?.Value
                : await db.Profiles.Where(p => p.Id == user.ProfileId).Select(p => p.Name).SingleOrDefaultAsync();

            return Results.Ok(new
            {
                Id = current.UserId,
                // The top-bar avatar's colour comes from the profile id, as on every other screen (ADR 0008).
                ProfileId = user?.ProfileId,
                Name = name,
                Email = user?.Email ?? principal.FindFirst(OpenIddictConstants.Claims.Email)?.Value,
                EmailVerified = user?.EmailConfirmed ?? false,
                current.Access.IsSystemAdmin,
            });
        });

        // What the web app may show: covered orgs, their features, branding and the caller's permissions (L2-155, ADR 0037).
        app.MapGet("/api/me/access", async (GetMyAccessHandler handler, CancellationToken cancellationToken) =>
            Results.Ok(await handler.HandleAsync(cancellationToken)));
        return app;
    }
}
