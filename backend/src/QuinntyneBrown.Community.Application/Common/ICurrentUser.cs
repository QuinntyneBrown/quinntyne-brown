using QuinntyneBrown.Community.Application.Organizations;

namespace QuinntyneBrown.Community.Application.Common;

public interface ICurrentUser
{
    Guid? UserId { get; }

    bool IsAuthenticated { get; }

    /// <summary>The caller's coverage and permissions, resolved once for this request (ADR 0034).</summary>
    CallerAccess Access { get; }
}
