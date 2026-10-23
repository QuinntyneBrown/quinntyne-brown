using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Domain.Organizations;
using OpenIddict.Abstractions;

namespace QuinntyneBrown.Community.Api.Authentication;

/// <summary>
/// Resolves the signed-in caller's coverage and permissions once per request (ADR 0034), with the active org from
/// the <c>X-Org</c> header, so a role or catalogue change applies at once, even on a token issued before it (L2-135).
/// Role claims in a token are only a hint for clients; the server never authorizes with them. A request whose
/// <c>X-Org</c> names an org the caller does not cover, or one whose type has the route's feature off, is answered 404
/// before it reaches a handler (ADR 0034, ADR 0038).
/// </summary>
public class CurrentAccessMiddleware(RequestDelegate next)
{
    public const string ItemKey = "QuinntyneBrown.CurrentAccess";

    public const string OrgHeader = "X-Org";

    /// <summary>The feature each org-scoped API area belongs to.</summary>
    private static readonly (string Prefix, string Feature)[] FeatureRoutes =
    [
        ("/api/events", Features.Events),
        ("/api/partners", Features.Partners),
        ("/api/contacts", Features.Contacts),
        ("/api/team", Features.Team),
        ("/api/announcements", Features.Announcements),
        ("/api/invites", Features.Invites),
        ("/api/connect/link", Features.Invites),
        ("/api/resources", Features.Resources),
        ("/api/notes", Features.Notes),
        ("/api/workspaces", Features.Agile),
        ("/api/items", Features.Agile),
        ("/api/poker-sessions", Features.Agile),
        ("/api/work", Features.Agile),
        ("/api/reports", Features.Reports),
        ("/api/people", Features.Profiles),
    ];

    public async Task InvokeAsync(HttpContext context, AccessResolver resolver)
    {
        if (context.User.Identity?.IsAuthenticated == true
            && Guid.TryParse(context.User.FindFirst(OpenIddictConstants.Claims.Subject)?.Value, out var userId))
        {
            var header = context.Request.Headers[OrgHeader].ToString();
            var credential = AgentTokenClaims.CredentialOf(context.User);
            var access = await resolver.ResolveAsync(
                userId,
                string.IsNullOrWhiteSpace(header) ? null : header.Trim().ToLowerInvariant(),
                credential?.OrgIds,
                credential?.Id,
                context.RequestAborted);
            context.Items[ItemKey] = access;
            var path = context.Request.Path;
            foreach (var (prefix, feature) in FeatureRoutes)
            {
                if (path.StartsWithSegments(prefix) && access.ActiveOrgUnavailable(feature))
                {
                    context.Response.StatusCode = StatusCodes.Status404NotFound;
                    return;
                }
            }
        }

        await next(context);
    }
}
