using QuinntyneBrown.Community.Application.Identity;

namespace QuinntyneBrown.Community.Api.Tests.Fakes;

public class FakeBreachedPasswordChecker : IBreachedPasswordChecker
{
    public const string BreachedPassword = "correcthorsebatterystaple";

    public Task<bool> IsBreachedAsync(string password, CancellationToken cancellationToken = default) =>
        Task.FromResult(password == BreachedPassword);
}
