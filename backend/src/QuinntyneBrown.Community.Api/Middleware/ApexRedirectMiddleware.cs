using QuinntyneBrown.Community.Application.Common;
using Microsoft.Extensions.Options;

namespace QuinntyneBrown.Community.Api.Middleware;

/// <summary>
/// Sends every request on the apex domain (<c>Marketing:ApexHost</c>, for example <c>quinntynebrown.com</c>) to the
/// marketing page (<c>Marketing:Origin</c>) with the same path and query, permanently (L2-133). It runs before the
/// wall, the exception handler and routing, so nothing else answers on the apex. Unset, it does nothing.
/// </summary>
public sealed class ApexRedirectMiddleware(RequestDelegate next, IOptions<MarketingOptions> marketing)
{
    private readonly string? _apexHost = string.IsNullOrWhiteSpace(marketing.Value.ApexHost) ? null : marketing.Value.ApexHost.Trim();
    private readonly string _origin = marketing.Value.Origin.TrimEnd('/');

    public Task InvokeAsync(HttpContext context)
    {
        if (_apexHost is null || !string.Equals(context.Request.Host.Host, _apexHost, StringComparison.OrdinalIgnoreCase))
        {
            return next(context);
        }

        context.Response.Headers.CacheControl = "public, max-age=3600";
        context.Response.Redirect(_origin + context.Request.Path + context.Request.QueryString, permanent: true);
        return Task.CompletedTask;
    }
}
