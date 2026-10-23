using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Contacts;
using QuinntyneBrown.Community.Application.Profiles;
using QuinntyneBrown.Community.Domain.Identity;
using QuinntyneBrown.Community.Domain.Profiles;
using Microsoft.AspNetCore.Identity;

namespace QuinntyneBrown.Community.Application.Identity;

/// <summary>
/// The account rule every external sign-in shares (ADR 0019, ADR 0032): find the account by its provider login,
/// else link it by an email the provider has verified, else create one with no role, a verified email and no
/// password. Callers check the email is verified before they get here.
/// </summary>
public class ExternalAccounts(
    UserManager<CommunityUser> users,
    IApplicationDbContext db,
    ContactSignedUpHandler contactSignedUp,
    TimeProvider time)
{
    public async Task<CommunityUser> FindLinkOrCreateAsync(
        string provider, string subject, string email, string? name, CancellationToken cancellationToken = default) =>
        await users.FindByLoginAsync(provider, subject)
        ?? await LinkByEmailAsync(provider, subject, email, cancellationToken)
        ?? await CreateAsync(provider, subject, email, name, cancellationToken);

    private async Task<CommunityUser?> LinkByEmailAsync(string provider, string subject, string email, CancellationToken cancellationToken)
    {
        var user = await users.FindByEmailAsync(email);
        if (user is null)
        {
            return null;
        }

        Ensure(provider, await users.AddLoginAsync(user, new UserLoginInfo(provider, subject, provider)));
        if (!user.EmailConfirmed)
        {
            // Nobody proved they own this address until now, so whoever chose the password cannot keep it.
            user.EmailConfirmed = true;
            if (await users.HasPasswordAsync(user))
            {
                Ensure(provider, await users.RemovePasswordAsync(user));
            }

            Ensure(provider, await users.UpdateAsync(user));
            await contactSignedUp.HandleAsync(new EmailVerified(user.ProfileId, user.Email!), cancellationToken);
        }

        return user;
    }

    private async Task<CommunityUser> CreateAsync(string provider, string subject, string email, string? name, CancellationToken cancellationToken)
    {
        var profile = new Profile(ProfileName(email, name), time.GetUtcNow().UtcDateTime);
        db.Profiles.Add(profile);
        var user = new CommunityUser { UserName = email, Email = email, EmailConfirmed = true, ProfileId = profile.Id };

        // The user store shares the context, so the profile and the account commit together. No role is granted.
        Ensure(provider, await users.CreateAsync(user));
        Ensure(provider, await users.AddLoginAsync(user, new UserLoginInfo(provider, subject, provider)));
        await contactSignedUp.HandleAsync(new EmailVerified(user.ProfileId, user.Email!), cancellationToken);
        return user;
    }

    /// <summary>The provider's name, held to the profile editor's limit, or the email's local part when it gives none.</summary>
    private static string ProfileName(string email, string? name)
    {
        var trimmed = string.IsNullOrWhiteSpace(name) ? email.Split('@')[0] : name.Trim();
        return trimmed.Length <= UpdateProfileValidator.MaxName ? trimmed : trimmed[..UpdateProfileValidator.MaxName].TrimEnd();
    }

    private static void Ensure(string provider, IdentityResult result)
    {
        if (!result.Succeeded)
        {
            throw new InvalidOperationException($"{provider} sign-in failed: {string.Join(", ", result.Errors.Select(e => e.Code))}");
        }
    }
}
