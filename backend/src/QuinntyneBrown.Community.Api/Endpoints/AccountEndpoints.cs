using System.Security.Claims;
using QuinntyneBrown.Community.Api.Authentication;
using QuinntyneBrown.Community.Api.Middleware;
using QuinntyneBrown.Community.Application.Common;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using QuinntyneBrown.Community.Application.Identity;
using Microsoft.Extensions.Options;

namespace QuinntyneBrown.Community.Api.Endpoints;

public static class AccountEndpoints
{
    public static IEndpointRouteBuilder MapAccountEndpoints(this IEndpointRouteBuilder app)
    {
        var account = app.MapGroup("/api/account").RequireRateLimiting(WebProtectionSetup.AuthRateLimitPolicy);

        account.MapPost("/sign-up", async (SignUpCommand command, SignUpHandler handler, CancellationToken ct) =>
                (await handler.HandleAsync(command, ct)).ToHttp(() => Results.Accepted()))
            .Validate<SignUpCommand>()
            .AllowAnonymous();

        account.MapPost("/verify-email", async (ConfirmEmailCommand command, ConfirmEmailHandler handler) =>
                (await handler.HandleAsync(command)).ToHttp(() => Results.Ok()))
            .Validate<ConfirmEmailCommand>()
            .AllowAnonymous();

        account.MapPost("/resend-verification", async (ResendVerificationCommand command, ResendVerificationHandler handler, CancellationToken ct) =>
                await handler.HandleAsync(command, ct)
                    ? Results.Accepted()
                    : Results.Problem(
                        "Too many verification emails have been requested. Please try again later.",
                        statusCode: StatusCodes.Status429TooManyRequests))
            .Validate<ResendVerificationCommand>()
            .AllowAnonymous();

        account.MapPost("/forgot-password", async (RequestPasswordResetCommand command, RequestPasswordResetHandler handler, CancellationToken ct) =>
                (await handler.HandleAsync(command, ct)).ToHttp(() => Results.Accepted()))
            .Validate<RequestPasswordResetCommand>()
            .AllowAnonymous();

        account.MapPost("/reset-password", async (ResetPasswordCommand command, ResetPasswordHandler handler, CancellationToken ct) =>
                (await handler.HandleAsync(command, ct)).ToHttp(() => Results.Ok()))
            .Validate<ResetPasswordCommand>()
            .AllowAnonymous();

        account.MapPost("/sign-in", SignInAsync).Validate<SignInCommand>().AllowAnonymous();
        account.MapPost("/sign-out", SignOutAsync);

        // Google sign-in for the marketing page (L2-078, ADR 0019): browser redirects, so anonymous by opt-in.
        account.MapGet("/google/start", StartGoogleSignIn).AllowAnonymous();
        account.MapGet("/google/callback", CompleteGoogleSignInAsync).AllowAnonymous();

        // GitHub sign-in for the marketing page (L2-130, ADR 0032): the same browser redirects, with PKCE.
        account.MapGet("/github/start", StartGitHubSignIn).AllowAnonymous();
        account.MapGet("/github/callback", CompleteGitHubSignInAsync).AllowAnonymous();

        return app;
    }

    private static async Task<IResult> SignInAsync(
        SignInCommand command, SignInHandler handler, HttpContext context, CancellationToken ct)
    {
        var result = await handler.HandleAsync(command, ct);
        if (!result.Succeeded)
        {
            var (code, detail) = result.Error switch
            {
                SignInError.LockedOut => ("locked_out", "Too many failed attempts. Try again in 15 minutes."),
                SignInError.Suspended => ("suspended", "Your account is suspended."),
                _ => ("invalid_credentials", "Email or password is incorrect."),
            };
            return Results.Problem(detail, statusCode: StatusCodes.Status400BadRequest,
                extensions: new Dictionary<string, object?> { ["code"] = code });
        }

        var user = result.User!;
        await StartSessionAsync(context, user);
        return Results.Ok(new { EmailVerified = user.EmailConfirmed });
    }

    /// <summary>The short-lived cookie that carries a signed-in browser to /connect/authorize.</summary>
    private static Task StartSessionAsync(HttpContext context, CommunityUser user)
    {
        var identity = new ClaimsIdentity(IdentityConstants.ApplicationScheme);
        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()));
        return context.SignInAsync(IdentityConstants.ApplicationScheme, new ClaimsPrincipal(identity));
    }

    private static IResult StartGoogleSignIn(
        HttpContext context,
        IGoogleIdentityProvider google,
        GoogleCorrelation correlation,
        IOptions<WebAppOptions> webApp,
        IOptions<MarketingOptions> marketing,
        string? returnUrl,
        bool? keepSignedIn,
        string? from)
    {
        var pending = NewPending(returnUrl, keepSignedIn, from);
        var authorizationUrl = google.BuildAuthorizationUrl(pending.State, pending.Secret, RedirectUri(webApp.Value, "google"));
        if (authorizationUrl is null)
        {
            return Results.Redirect(Outcome(webApp.Value, marketing.Value, "google", pending, "failed"));
        }

        correlation.Write(context, pending);
        return Results.Redirect(authorizationUrl);
    }

    private static async Task<IResult> CompleteGoogleSignInAsync(
        HttpContext context,
        GoogleSignInHandler handler,
        GoogleCorrelation correlation,
        IOptions<WebAppOptions> webApp,
        IOptions<MarketingOptions> marketing,
        string? code,
        string? state,
        CancellationToken ct)
    {
        var pending = correlation.ReadAndClear(context);
        if (pending is null || string.IsNullOrEmpty(code) || !SignInCorrelation.StateMatches(pending, state))
        {
            return Results.Redirect(Outcome(webApp.Value, marketing.Value, "google", pending, "failed"));
        }

        var result = await handler.HandleAsync(new GoogleSignInCommand(code, RedirectUri(webApp.Value, "google"), pending.Secret), ct);
        if (!result.Succeeded)
        {
            return Results.Redirect(Outcome(webApp.Value, marketing.Value, "google", pending, result.Error == GoogleSignInError.Suspended ? "suspended" : "failed"));
        }

        await StartSessionAsync(context, result.User!);
        return Results.Redirect(Landing(webApp.Value, pending));
    }

    private static IResult StartGitHubSignIn(
        HttpContext context,
        IGitHubIdentityProvider github,
        GitHubCorrelation correlation,
        IOptions<WebAppOptions> webApp,
        IOptions<MarketingOptions> marketing,
        string? returnUrl,
        bool? keepSignedIn,
        string? from)
    {
        var pending = NewPending(returnUrl, keepSignedIn, from);
        var authorizationUrl = github.BuildAuthorizationUrl(pending.State, pending.Secret, RedirectUri(webApp.Value, "github"));
        if (authorizationUrl is null)
        {
            return Results.Redirect(Outcome(webApp.Value, marketing.Value, "github", pending, "failed"));
        }

        correlation.Write(context, pending);
        return Results.Redirect(authorizationUrl);
    }

    private static async Task<IResult> CompleteGitHubSignInAsync(
        HttpContext context,
        GitHubSignInHandler handler,
        GitHubCorrelation correlation,
        IOptions<WebAppOptions> webApp,
        IOptions<MarketingOptions> marketing,
        string? code,
        string? state,
        CancellationToken ct)
    {
        var pending = correlation.ReadAndClear(context);
        if (pending is null || string.IsNullOrEmpty(code) || !SignInCorrelation.StateMatches(pending, state))
        {
            return Results.Redirect(Outcome(webApp.Value, marketing.Value, "github", pending, "failed"));
        }

        var result = await handler.HandleAsync(new GitHubSignInCommand(code, RedirectUri(webApp.Value, "github"), pending.Secret), ct);
        if (!result.Succeeded)
        {
            return Results.Redirect(Outcome(webApp.Value, marketing.Value, "github", pending, result.Error == GitHubSignInError.Suspended ? "suspended" : "failed"));
        }

        await StartSessionAsync(context, result.User!);
        return Results.Redirect(Landing(webApp.Value, pending));
    }

    /// <summary>A new state and secret (Google's nonce, GitHub's code verifier) with where the sign-in started and lands.</summary>
    private static SignInCorrelation.Pending NewPending(string? returnUrl, bool? keepSignedIn, string? from) =>
        new(SignInCorrelation.NewSecret(), SignInCorrelation.NewSecret(), AppPath(returnUrl), keepSignedIn ?? false, from == "app");

    // The API sits behind the community app's origin, so the provider returns there.
    private static string RedirectUri(WebAppOptions webApp, string provider) => $"{webApp.Origin}/api/account/{provider}/callback";

    /// <summary>
    /// Where a failed external sign-in returns: the community app's sign-in page when it started there (L2-131), else
    /// the marketing page. Without a readable cookie nobody knows where it started, so the marketing page.
    /// </summary>
    private static string Outcome(WebAppOptions webApp, MarketingOptions marketing, string provider, SignInCorrelation.Pending? pending, string outcome) =>
        pending is { FromApp: true }
            ? $"{webApp.Origin}/sign-in?{provider}={outcome}&returnUrl={Uri.EscapeDataString(pending.ReturnUrl)}"
            : $"{marketing.Origin}/?{provider}={outcome}";

    /// <summary>
    /// Where a signed-in browser goes: an interrupted /connect/authorize request resumes, as after a password sign-in
    /// (L2-131 AC2); anything else starts PKCE in the community app (ADR 0018).
    /// </summary>
    private static string Landing(WebAppOptions webApp, SignInCorrelation.Pending pending) =>
        pending.ReturnUrl.StartsWith("/connect/", StringComparison.Ordinal)
            ? $"{webApp.Origin}{pending.ReturnUrl}"
            : $"{webApp.Origin}/auth/continue?returnUrl={Uri.EscapeDataString(pending.ReturnUrl)}&keepSignedIn={(pending.KeepSignedIn ? "1" : "0")}";

    /// <summary>Only a path inside the community app is kept; anything else lands on home.</summary>
    private static string AppPath(string? url) =>
        url is not null && url.StartsWith('/') && !url.StartsWith("//") && !url.StartsWith("/\\") ? url : "/";

    private static async Task<IResult> SignOutAsync(ICurrentUser user, ITokenRevocation revocation, HttpContext context, CancellationToken ct)
    {
        await revocation.RevokeAllAsync(user.UserId!.Value, ct);
        await context.SignOutAsync(IdentityConstants.ApplicationScheme);
        return Results.NoContent();
    }
}
