using QuinntyneBrown.Community.Domain.Profiles;

namespace QuinntyneBrown.Community.Application.Common;

public interface ICurrentUser
{
    Guid? UserId { get; }

    IReadOnlyCollection<Role> Roles { get; }

    bool IsAuthenticated { get; }

    bool HasRole(Role role);
}
