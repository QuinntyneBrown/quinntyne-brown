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

        // GitHub sign-in for the marketing page (L2-110, ADR 0027): the same browser redirects, with PKCE.
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
        bool? keepSignedIn)
    {
        var state = SignInCorrelation.NewSecret();
        var nonce = SignInCorrelation.NewSecret();
        var authorizationUrl = google.BuildAuthorizationUrl(state, nonce, GoogleRedirectUri(webApp.Value));
        if (authorizationUrl is null)
        {
            return Results.Redirect(GoogleOutcome(marketing.Value, "failed"));
        }

        correlation.Write(context, new SignInCorrelation.Pending(state, nonce, AppPath(returnUrl), keepSignedIn ?? false));
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
            return Results.Redirect(GoogleOutcome(marketing.Value, "failed"));
        }

        var result = await handler.HandleAsync(new GoogleSignInCommand(code, GoogleRedirectUri(webApp.Value), pending.Secret), ct);
        if (!result.Succeeded)
        {
            return Results.Redirect(GoogleOutcome(marketing.Value, result.Error == GoogleSignInError.Suspended ? "suspended" : "failed"));
        }

        await StartSessionAsync(context, result.User!);
        var keep = pending.KeepSignedIn ? "1" : "0";
        return Results.Redirect($"{webApp.Value.Origin}/auth/continue?returnUrl={Uri.EscapeDataString(pending.ReturnUrl)}&keepSignedIn={keep}");
    }

    private static IResult StartGitHubSignIn(
        HttpContext context,
        IGitHubIdentityProvider github,
        GitHubCorrelation correlation,
        IOptions<WebAppOptions> webApp,
        IOptions<MarketingOptions> marketing,
        string? returnUrl,
        bool? keepSignedIn)
    {
        var state = SignInCorrelation.NewSecret();
        var codeVerifier = SignInCorrelation.NewSecret();
        var authorizationUrl = github.BuildAuthorizationUrl(state, codeVerifier, GitHubRedirectUri(webApp.Value));
        if (authorizationUrl is null)
        {
            return Results.Redirect(GitHubOutcome(marketing.Value, "failed"));
        }

        correlation.Write(context, new SignInCorrelation.Pending(state, codeVerifier, AppPath(returnUrl), keepSignedIn ?? false));
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
            return Results.Redirect(GitHubOutcome(marketing.Value, "failed"));
        }

        var result = await handler.HandleAsync(new GitHubSignInCommand(code, GitHubRedirectUri(webApp.Value), pending.Secret), ct);
        if (!result.Succeeded)
        {
            return Results.Redirect(GitHubOutcome(marketing.Value, result.Error == GitHubSignInError.Suspended ? "suspended" : "failed"));
        }

        await StartSessionAsync(context, result.User!);
        var keep = pending.KeepSignedIn ? "1" : "0";
        return Results.Redirect($"{webApp.Value.Origin}/auth/continue?returnUrl={Uri.EscapeDataString(pending.ReturnUrl)}&keepSignedIn={keep}");
    }

    // The API sits behind the community app's origin, so Google returns there.
    private static string GoogleRedirectUri(WebAppOptions webApp) => $"{webApp.Origin}/api/account/google/callback";

    private static string GoogleOutcome(MarketingOptions marketing, string outcome) => $"{marketing.Origin}/?google={outcome}";

    private static string GitHubRedirectUri(WebAppOptions webApp) => $"{webApp.Origin}/api/account/github/callback";

    private static string GitHubOutcome(MarketingOptions marketing, string outcome) => $"{marketing.Origin}/?github={outcome}";

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
