using QuinntyneBrown.Community.Application.Admin;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Profiles;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Organizations;

/// <summary>An org's light branding (ADR 0037); <see cref="ContrastRatio"/> is the accent's best ratio, when there is one.</summary>
public record BrandingDto(string DisplayName, string? LogoUrl, string? Accent, string? AccentForeground, double? ContrastRatio);

/// <summary>The body of <c>PUT /api/organizations/{orgId}/branding</c>.</summary>
public record SaveBrandingCommand(string? DisplayName, string? Accent);

/// <summary>A logo upload: the file as the browser sent it.</summary>
public record UploadLogoCommand(Stream Content, string FileName, long Length);

/// <summary>
/// Saves an org's display name, accent and logo (L2-149 AC4, AC5): the org's Org Lead, its Portfolio Lead or a System
/// Admin; anyone else is refused, and an org outside the caller's coverage is not found. An accent is a fill behind
/// white or <c>#111111</c> and is refused unless one of them reaches 4.5:1.
/// </summary>
public class BrandingHandler(
    IApplicationDbContext db,
    ICurrentUser current,
    ProfileAccess profiles,
    IAuditLog audit,
    IImageProcessor images,
    IPhotoStorage storage)
{
    public const int MaxLogoBytes = 2 * 1024 * 1024;

    public const int LogoEdge = 256;

    public const string ColourMessage = "Enter a colour as #rrggbb.";

    public const string ContrastMessage = "This colour doesn't have enough contrast. Choose a darker or lighter shade.";

    public async Task<(Result Result, BrandingDto? Branding)> SaveAsync(Guid orgId, SaveBrandingCommand command, CancellationToken cancellationToken = default)
    {
        if (Refusal(orgId) is { } refusal)
        {
            return (refusal, null);
        }

        var errors = new Dictionary<string, string[]>();
        var displayName = command.DisplayName?.Trim();
        if (string.IsNullOrEmpty(displayName) || displayName.Length > 80)
        {
            errors["displayName"] = ["Enter a display name of 80 characters or fewer."];
        }

        var accent = string.IsNullOrWhiteSpace(command.Accent) ? null : command.Accent.Trim().ToLowerInvariant();
        if (accent is not null && !AccentContrast.IsColour(accent))
        {
            errors["accent"] = [ColourMessage];
        }
        else if (accent is not null && !AccentContrast.Passes(accent))
        {
            errors["accent"] = [ContrastMessage];
            return (new Result(ResultStatus.Invalid, errors, Extensions: new Dictionary<string, object?> { ["contrastRatio"] = AccentContrast.BestRatio(accent) }), null);
        }

        if (errors.Count > 0)
        {
            return (new Result(ResultStatus.Invalid, errors), null);
        }

        var org = await db.Organizations.SingleAsync(o => o.Id == orgId, cancellationToken);
        var before = new { org.DisplayName, Accent = org.AccentColour };
        org.SetBranding(displayName, accent);
        await AuditAsync(orgId, before, new { org.DisplayName, Accent = org.AccentColour }, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), Dto(org));
    }

    /// <summary>Stores a PNG, JPEG or WebP of at most 2 MB, fitted inside 256 px, replacing the previous logo.</summary>
    public async Task<(Result Result, BrandingDto? Branding)> UploadLogoAsync(Guid orgId, UploadLogoCommand command, CancellationToken cancellationToken = default)
    {
        if (Refusal(orgId) is { } refusal)
        {
            return (refusal, null);
        }

        if (command.Length > MaxLogoBytes)
        {
            return (Result.Invalid("logo", "Logos can be up to 2 MB — try a smaller one."), null);
        }

        var extension = Path.GetExtension(command.FileName).ToLowerInvariant();
        if (extension is not (".png" or ".jpg" or ".jpeg" or ".webp"))
        {
            return (Result.Invalid("logo", "Choose a PNG, JPEG or WebP image."), null);
        }

        var processed = await images.ProcessAsync(command.Content, command.FileName, cancellationToken);
        if (processed.Image is not { } image)
        {
            return (Result.Invalid("logo", "Choose a PNG, JPEG or WebP image."), null);
        }

        using var source = new MemoryStream(image.Content);
        var logo = await images.ThumbnailAsync(source, LogoEdge, cancellationToken);
        if (logo is null)
        {
            return (Result.Invalid("logo", "Choose a PNG, JPEG or WebP image."), null);
        }

        var org = await db.Organizations.SingleAsync(o => o.Id == orgId, cancellationToken);
        var previous = org.LogoBlobName;
        var blob = $"organizations/{orgId}/{Guid.NewGuid()}.png";
        await storage.SaveAsync(blob, logo, "image/png", cancellationToken);
        org.SetLogo(blob);
        await AuditAsync(orgId, new { Logo = previous }, new { Logo = blob }, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        if (previous is not null)
        {
            await storage.DeleteAsync(previous, cancellationToken);
        }

        return (Result.Ok(), Dto(org));
    }

    public async Task<Result> DeleteLogoAsync(Guid orgId, CancellationToken cancellationToken = default)
    {
        if (Refusal(orgId) is { } refusal)
        {
            return refusal;
        }

        var org = await db.Organizations.SingleAsync(o => o.Id == orgId, cancellationToken);
        if (org.LogoBlobName is not { } previous)
        {
            return Result.Ok();
        }

        org.SetLogo(null);
        await AuditAsync(orgId, new { Logo = previous }, new { Logo = (string?)null }, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        await storage.DeleteAsync(previous, cancellationToken);
        return Result.Ok();
    }

    private BrandingDto Dto(Domain.Organizations.Organization org) => new(
        org.ShownName,
        org.LogoBlobName is { } logo ? storage.GetReadUrl(logo) : null,
        org.AccentColour,
        org.AccentColour is { } accent ? AccentContrast.ForegroundFor(accent) : null,
        org.AccentColour is { } colour ? AccentContrast.BestRatio(colour) : null);

    // Overrides by a Portfolio Lead or System Admin go to the audit log; an Org Lead branding their own org does not.
    private async Task AuditAsync(Guid orgId, object before, object after, CancellationToken cancellationToken)
    {
        if (current.Access.IsOrgLead(orgId) && !current.Access.IsPortfolioLead(orgId) && !current.Access.IsSystemAdmin)
        {
            return;
        }

        var org = current.Access.Orgs[orgId];
        var actor = await profiles.CallerProfileIdAsync(cancellationToken) ?? Guid.Empty;
        audit.Record(actor, "org.branding", "Organization", orgId.ToString(), before, after, orgId, org.PortfolioId);
    }

    private Result? Refusal(Guid orgId) =>
        !current.Access.Covers(orgId) ? Result.NotFound()
        : current.Access.LeadsOrg(orgId) ? null
        : Result.Forbidden();
}
