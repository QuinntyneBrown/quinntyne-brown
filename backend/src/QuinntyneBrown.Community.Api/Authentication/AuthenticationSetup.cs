using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Infrastructure.Persistence;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Identity;
using OpenIddict.Abstractions;
using OpenIddict.Validation.AspNetCore;

namespace QuinntyneBrown.Community.Api.Authentication;

public static class AuthenticationSetup
{
    public const string DefaultScheme = "Bearer or agent token";

    public static IServiceCollection AddCommunityAuthentication(
        this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment environment)
    {
        services.AddOpenIddict()
            .AddCore(options => options.UseEntityFrameworkCore().UseDbContext<CommunityDbContext>())
            .AddServer(options =>
            {
                options.SetAuthorizationEndpointUris("connect/authorize")
                    .SetTokenEndpointUris("connect/token")
                    .SetRevocationEndpointUris("connect/revoke")
                    .SetEndSessionEndpointUris("connect/logout");

                options.RegisterScopes(
                    OpenIddictConstants.Scopes.OpenId,
                    OpenIddictConstants.Scopes.Email,
                    OpenIddictConstants.Scopes.Profile,
                    OpenIddictConstants.Scopes.Roles,
                    OpenIddictConstants.Scopes.OfflineAccess);
                options.AllowAuthorizationCodeFlow().RequireProofKeyForCodeExchange();
                options.AllowRefreshTokenFlow();
                options.SetAccessTokenLifetime(TimeSpan.FromMinutes(15));
                options.SetRefreshTokenLifetime(TimeSpan.FromDays(14));

                if (environment.IsProduction())
                {
                    options.AddEncryptionCertificate(LoadCertificate(configuration, "Identity:EncryptionCertificate"))
                        .AddSigningCertificate(LoadCertificate(configuration, "Identity:SigningCertificate"));
                }
                else
                {
                    options.AddEphemeralEncryptionKey().AddEphemeralSigningKey();
                }

                options.UseAspNetCore()
                    .EnableAuthorizationEndpointPassthrough()
                    .EnableEndSessionEndpointPassthrough();
            })
            .AddValidation(options =>
            {
                options.UseLocalServer();
                options.EnableTokenEntryValidation();
                options.EnableAuthorizationEntryValidation();
                options.UseAspNetCore();
            });

        // Agent tokens go to their own handler; every other request to OpenIddict validation (ADR 0036).
        services.AddAuthentication(DefaultScheme)
            .AddPolicyScheme(DefaultScheme, DefaultScheme, options => options.ForwardDefaultSelector = context =>
                AgentTokenAuthenticationHandler.Carries(context.Request)
                    ? AgentTokenAuthenticationHandler.SchemeName
                    : OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)
            .AddScheme<Microsoft.AspNetCore.Authentication.AuthenticationSchemeOptions, AgentTokenAuthenticationHandler>(
                AgentTokenAuthenticationHandler.SchemeName, null)
            .AddCookie(IdentityConstants.ApplicationScheme, options =>
            {
                // Short-lived: it only carries a signed-in browser from the sign-in page to /connect/authorize.
                options.Cookie.Name = "ftc.session";
                options.Cookie.HttpOnly = true;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Cookie.SameSite = SameSiteMode.Lax;
                options.ExpireTimeSpan = TimeSpan.FromMinutes(15);
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                };
            });
        services.AddAuthorizationBuilder()
            .SetFallbackPolicy(new Microsoft.AspNetCore.Authorization.AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build());

        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUser, HttpCurrentUser>();
        services.AddSingleton<GoogleCorrelation>();
        services.AddSingleton<GitHubCorrelation>();
        return services;
    }

    // Certificates are supplied as base64-encoded PFX values with an optional password.
    private static X509Certificate2 LoadCertificate(IConfiguration configuration, string key)
    {
        var pfx = configuration[key] ?? throw new InvalidOperationException($"{key} is not configured.");
        return X509CertificateLoader.LoadPkcs12(Convert.FromBase64String(pfx), configuration[$"{key}Password"]);
    }
}
