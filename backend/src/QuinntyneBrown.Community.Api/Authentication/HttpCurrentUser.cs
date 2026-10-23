using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using OpenIddict.Abstractions;

namespace QuinntyneBrown.Community.Api.Authentication;

public class HttpCurrentUser(IHttpContextAccessor accessor) : ICurrentUser
{
    public Guid? UserId =>
        Guid.TryParse(accessor.HttpContext?.User.FindFirst(OpenIddictConstants.Claims.Subject)?.Value, out var id) ? id : null;

    public bool IsAuthenticated => accessor.HttpContext?.User.Identity?.IsAuthenticated == true;

    /// <summary>The caller's access, resolved from the database by <see cref="CurrentAccessMiddleware"/>; never the token's role claims.</summary>
    public CallerAccess Access =>
        accessor.HttpContext?.Items[CurrentAccessMiddleware.ItemKey] as CallerAccess ?? CallerAccess.Anonymous;
}
