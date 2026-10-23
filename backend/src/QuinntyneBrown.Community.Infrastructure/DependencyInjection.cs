using Azure.Storage.Blobs;
using QuinntyneBrown.Community.Application.Admin;
using QuinntyneBrown.Community.Application.Announcements;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Events;
using QuinntyneBrown.Community.Application.Identity;
using QuinntyneBrown.Community.Application.Invites;
using QuinntyneBrown.Community.Application.Notifications;
using QuinntyneBrown.Community.Application.PrivatePreview;
using QuinntyneBrown.Community.Application.Profiles;
using QuinntyneBrown.Community.Application.Resources;
using QuinntyneBrown.Community.Application.Search;
using QuinntyneBrown.Community.Infrastructure.Admin;
using QuinntyneBrown.Community.Infrastructure.Calendar;
using QuinntyneBrown.Community.Infrastructure.Email;
using QuinntyneBrown.Community.Infrastructure.Identity;
using QuinntyneBrown.Community.Infrastructure.Invites;
using QuinntyneBrown.Community.Infrastructure.Persistence;
using QuinntyneBrown.Community.Infrastructure.PrivatePreview;
using QuinntyneBrown.Community.Infrastructure.Search;
using QuinntyneBrown.Community.Infrastructure.Storage;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;

namespace QuinntyneBrown.Community.Infrastructure;

public static class DependencyInjection
{
    public const string ReadyTag = "ready";

    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<CommunityDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("Community"));
            options.UseOpenIddict();
        });
        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<CommunityDbContext>());

        services.AddIdentityCore<CommunityUser>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.Password.RequiredLength = PasswordRules.MinimumLength;
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Tokens.EmailConfirmationTokenProvider = EmailConfirmationTokenProvider<CommunityUser>.Name;
                options.Tokens.PasswordResetTokenProvider = PasswordResetTokenProvider<CommunityUser>.Name;
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
                options.Lockout.AllowedForNewUsers = true;
            })
            .AddEntityFrameworkStores<CommunityDbContext>()
            .AddTokenProvider<EmailConfirmationTokenProvider<CommunityUser>>(EmailConfirmationTokenProvider<CommunityUser>.Name)
            .AddTokenProvider<PasswordResetTokenProvider<CommunityUser>>(PasswordResetTokenProvider<CommunityUser>.Name);
        services.AddDataProtection();
        services.AddSingleton<IPassphraseHasher, Pbkdf2PassphraseHasher>();
        services.AddSingleton<IUnlockTokens, HmacUnlockTokens>();
        services.TryAddSingleton(TimeProvider.System);

        services.AddHttpClient<IBreachedPasswordChecker, HibpBreachedPasswordChecker>(client =>
        {
            client.BaseAddress = new Uri("https://api.pwnedpasswords.com/");
            client.Timeout = TimeSpan.FromSeconds(3);
            client.DefaultRequestHeaders.Add("Add-Padding", "true");
        });
        // Google sign-in (ADR 0019): Google's signing keys come from its discovery document, refreshed by the manager.
        services.Configure<GoogleOptions>(configuration.GetSection(GoogleOptions.Section));
        services.AddSingleton<IConfigurationManager<OpenIdConnectConfiguration>>(_ =>
            new ConfigurationManager<OpenIdConnectConfiguration>(
                GoogleIdTokenValidator.DiscoveryDocument,
                new OpenIdConnectConfigurationRetriever(),
                new HttpDocumentRetriever { RequireHttps = true }));
        services.AddSingleton<GoogleIdTokenValidator>();
        services.AddHttpClient<IGoogleIdentityProvider, GoogleIdentityProvider>(client => client.Timeout = TimeSpan.FromSeconds(10));
        // GitHub sign-in (ADR 0027): OAuth 2.0 with PKCE; the person is read from GitHub's API.
        services.Configure<GitHubOptions>(configuration.GetSection(GitHubOptions.Section));
        services.AddHttpClient<IGitHubIdentityProvider, GitHubIdentityProvider>(client => client.Timeout = TimeSpan.FromSeconds(10));
        services.AddScoped<IVerificationResendLog, VerificationResendLog>();
        services.AddScoped<ITokenRevocation, TokenRevocation>();
        services.Configure<SmtpOptions>(configuration.GetSection(SmtpOptions.Section));
        services.AddScoped<OutboxEmailQueue>();
        services.AddScoped<IEmailQueue>(sp => sp.GetRequiredService<OutboxEmailQueue>());
        services.AddScoped<IEmailSender, OutboxEmailSender>();
        services.AddScoped<IEmailTransport, SmtpEmailTransport>();
        services.AddScoped<EmailOutboxDispatcher>();
        services.AddSingleton<IUnsubscribeTokens, DataProtectionUnsubscribeTokens>();
        services.AddSingleton<IConnectTokenProtector, DataProtectionConnectTokens>();
        services.AddHostedService<EmailOutboxWorker>();

        services.AddSingleton(_ => new BlobServiceClient(configuration.GetConnectionString("Blobs")));
        services.AddSingleton<IPhotoStorage, AzureBlobPhotoStorage>();
        services.AddSingleton<IImageProcessor, SkiaImageProcessor>();
        services.AddHostedService<PhotoStorageRetryWorker>();
        services.AddSingleton<IFileStorage, AzureBlobFileStorage>();
        services.AddHostedService<ResourceMaintenanceWorker>();

        services.AddHttpContextAccessor();
        services.AddScoped<IAuditLog, AuditLog>();
        services.AddSingleton<IIcsCalendarWriter, IcsCalendarWriter>();

        services.AddSingleton<IFullTextSearch, PostgresFullTextSearch>();

        services.AddScoped<CommunitySeeder>();

        services.AddHealthChecks()
            .AddDbContextCheck<CommunityDbContext>("database", tags: [ReadyTag])
            .AddCheck<BlobStorageHealthCheck>("blobs", tags: [ReadyTag]);
        return services;
    }
}
