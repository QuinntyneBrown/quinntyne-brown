using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using OpenIddict.Abstractions;

namespace QuinntyneBrown.Community.Api.Middleware;

public static class WebProtectionSetup
{
    public const string WebAppCorsPolicy = "web-app";
    public const string AuthRateLimitPolicy = "auth";
    public const string GuestRsvpRateLimitPolicy = "guest-rsvp";
    public const string WebhookRateLimitPolicy = "webhook";
    public const string IdeaSubmitRateLimitPolicy = "idea-submit";

    public static IServiceCollection AddWebProtections(this IServiceCollection services, IConfiguration configuration)
    {
        // The marketing page (Marketing:Origin) posts credentials from its own origin, so the session cookie
        // the sign-in sets must be allowed through: credentials are allowed for these two origins only.
        var origins = new[] { configuration["WebApp:Origin"] ?? throw new InvalidOperationException("WebApp:Origin is not configured."), configuration["Marketing:Origin"] }
            .Where(origin => !string.IsNullOrWhiteSpace(origin))
            .Cast<string>()
            .ToArray();
        services.AddCors(options => options.AddPolicy(WebAppCorsPolicy, policy => policy
            .WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()));

        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            // 100 requests a minute per signed-in user, or per IP address for anonymous callers. Only an
            // isolated performance environment sets RateLimits:PerMinute (eng/load-test.js); nothing else does.
            var permitLimit = configuration.GetValue("RateLimits:PerMinute", 100);
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    context.User.FindFirst(OpenIddictConstants.Claims.Subject)?.Value is { } userId
                        ? $"user:{userId}"
                        : $"ip:{context.Connection.RemoteIpAddress}",
                    _ => Window(permitLimit)));

            // 20 requests a minute per IP address for sign-in, sign-up, reset and verification.
            var authPermitLimit = configuration.GetValue("RateLimits:AuthPerMinute", 20);
            options.AddPolicy(AuthRateLimitPolicy, context =>
                RateLimitPartition.GetFixedWindowLimiter($"auth:{context.Connection.RemoteIpAddress}", _ => Window(authPermitLimit)));

            // 10 guest RSVPs (and guest cancellations) an hour per IP address (L2-023 AC4).
            var guestPermitLimit = configuration.GetValue("RateLimits:GuestRsvpPerHour", 10);
            options.AddPolicy(GuestRsvpRateLimitPolicy, context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    $"guest-rsvp:{context.Connection.RemoteIpAddress}",
                    _ => new FixedWindowRateLimiterOptions { PermitLimit = guestPermitLimit, Window = TimeSpan.FromHours(1), QueueLimit = 0 }));

            // 60 webhook requests a minute per X-Webhook-Source (L2-164, ADR 0042); unknown or oversized values share one partition.
            var webhookPermitLimit = configuration.GetValue("RateLimits:WebhookPerMinute", 60);
            options.AddPolicy(WebhookRateLimitPolicy, context =>
            {
                var source = context.Request.Headers["X-Webhook-Source"].ToString();
                return RateLimitPartition.GetFixedWindowLimiter(
                    source.Length is > 0 and <= 100 ? $"webhook:{source}" : "webhook:",
                    _ => Window(webhookPermitLimit));
            });

            // 10 ideas an hour per signed-in member, or per IP address for visitors (L2-178, ADR 0044).
            var ideaPermitLimit = configuration.GetValue("RateLimits:IdeaSubmitPerHour", 10);
            options.AddPolicy(IdeaSubmitRateLimitPolicy, context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    context.User.FindFirst(OpenIddictConstants.Claims.Subject)?.Value is { } userId
                        ? $"idea:user:{userId}"
                        : $"idea:ip:{context.Connection.RemoteIpAddress}",
                    _ => new FixedWindowRateLimiterOptions { PermitLimit = ideaPermitLimit, Window = TimeSpan.FromHours(1), QueueLimit = 0 }));

            // A publisher is told when to retry (ICD); other limited responses are unchanged.
            options.OnRejected = (context, _) =>
            {
                if (context.HttpContext.GetEndpoint()?.Metadata.GetMetadata<EnableRateLimitingAttribute>()?.PolicyName == WebhookRateLimitPolicy
                    && context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                {
                    context.HttpContext.Response.Headers.RetryAfter = Math.Max(1, (int)Math.Ceiling(retryAfter.TotalSeconds)).ToString(System.Globalization.CultureInfo.InvariantCulture);
                }

                return ValueTask.CompletedTask;
            };
        });
        return services;
    }

    private static FixedWindowRateLimiterOptions Window(int permitLimit) =>
        new() { PermitLimit = permitLimit, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 };
}
