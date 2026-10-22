namespace QuinntyneBrown.Community.Application.Identity;

public interface IBreachedPasswordChecker
{
    Task<bool> IsBreachedAsync(string password, CancellationToken cancellationToken = default);
}
