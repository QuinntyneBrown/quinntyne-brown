using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Application.Profiles;
using QuinntyneBrown.Community.Domain.Invites;
using QuinntyneBrown.Community.Domain.Organizations;
using QuinntyneBrown.Community.Domain.Profiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace QuinntyneBrown.Community.Application.Invites;

/// <summary>Encrypts a connect token so only its owner can be shown it again (ADR 0021).</summary>
public interface IConnectTokenProtector
{
    string Protect(string token);

    string Unprotect(string protectedToken);
}

/// <summary>The caller's connect link, as "My QR code" shows it.</summary>
public record ConnectLinkDto(string Url, OrgLabel? Organization = null);

/// <summary>Who an anonymous visitor is connecting with (L2-082 AC2).</summary>
public record ConnectLookupDto(
    Guid LeadProfileId, string LeadName, string? LeadPhotoUrl, string? LeadCity, string LeadRole, Guid OrganizationId = default, string? OrganizationName = null);

/// <summary>The body of <c>POST /api/connect/lookup</c>: the link's token, kept out of the URL.</summary>
public record ConnectLookupRequest(string? Token);

/// <summary>
/// Issues, shows, replaces and looks up connect links (L2-080 to L2-082, ADR 0041): one per owner per org, for holders
/// of <c>connectLink.own</c>, the Org Lead and the Portfolio Lead.
/// </summary>
public class ConnectLinkHandler(
    IApplicationDbContext db,
    ICurrentUser current,
    IConnectTokenProtector protector,
    IPhotoStorage storage,
    AccessResolver resolver,
    ProfileRoles profileRoles,
    IOptions<WebAppOptions> webApp,
    TimeProvider time)
{
    public bool CanHaveLink => current.Access.HasAnywhere(Permissions.ConnectLinkOwn);

    public async Task<(Result Result, ConnectLinkDto? Link)> GetOrIssueAsync(CancellationToken cancellationToken = default)
    {
        var (refusal, owner, org) = await CallerAsync(cancellationToken);
        if (refusal is not null)
        {
            return (refusal, null);
        }

        var link = await db.ConnectLinks.SingleOrDefaultAsync(l => l.OwnerId == owner && l.OrganizationId == org, cancellationToken);
        if (link is not null)
        {
            return (Result.Ok(), ToDto(protector.Unprotect(link.ProtectedToken), org));
        }

        var token = InviteTokens.New();
        db.ConnectLinks.Add(new ConnectLink(org, owner, InviteTokens.Hash(token), protector.Protect(token), time.GetUtcNow()));
        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), ToDto(token, org));
    }

    /// <summary>Replaces the caller's token in the org; the old link answers as unknown from now on (L2-081 AC3).</summary>
    public async Task<(Result Result, ConnectLinkDto? Link)> ReplaceAsync(CancellationToken cancellationToken = default)
    {
        var (refusal, owner, org) = await CallerAsync(cancellationToken);
        if (refusal is not null)
        {
            return (refusal, null);
        }

        var token = InviteTokens.New();
        var link = await db.ConnectLinks.SingleOrDefaultAsync(l => l.OwnerId == owner && l.OrganizationId == org, cancellationToken);
        if (link is null)
        {
            db.ConnectLinks.Add(new ConnectLink(org, owner, InviteTokens.Hash(token), protector.Protect(token), time.GetUtcNow()));
        }
        else
        {
            link.Replace(InviteTokens.Hash(token), protector.Protect(token), time.GetUtcNow());
        }

        await db.SaveChangesAsync(cancellationToken);
        return (Result.Ok(), ToDto(token, org));
    }

    public async Task<ConnectLookupDto?> LookUpAsync(string token, CancellationToken cancellationToken = default)
    {
        if (await FindLinkAsync(token, cancellationToken) is not { } found)
        {
            return null;
        }

        var (lead, orgId) = found;
        var featured = lead.Photos.FirstOrDefault(p => p.IsFeatured && p.IsStored);
        var roles = await profileRoles.ForAsync(lead.Id, [orgId], cancellationToken);
        var role = roles.FirstOrDefault(r => r.OrganizationId == orgId && r.Kind == "catalogue") ?? roles.FirstOrDefault();
        var org = await db.Organizations.AsNoTracking().SingleAsync(o => o.Id == orgId, cancellationToken);
        return new ConnectLookupDto(
            lead.Id, lead.Name, featured is null ? null : storage.GetReadUrl(featured.BlobName), lead.HomeCity, role?.Name ?? "Member",
            orgId, org.ShownName);
    }

    /// <summary>The link's owner and org while the owner may still have a link there, or null.</summary>
    public async Task<(Guid OwnerId, Guid OrganizationId)?> FindOwnerAsync(string token, CancellationToken cancellationToken = default) =>
        await FindLinkAsync(token, cancellationToken) is { } found ? (found.Owner.Id, found.OrganizationId) : null;

    private async Task<(Profile Owner, Guid OrganizationId)?> FindLinkAsync(string token, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return null;
        }

        var hash = InviteTokens.Hash(token);
        var link = await db.ConnectLinks.AsNoTracking().Where(l => l.TokenHash == hash)
            .Select(l => new { l.OwnerId, l.OrganizationId }).SingleOrDefaultAsync(cancellationToken);
        if (link is null)
        {
            return null;
        }

        // A suspended owner, or one who may no longer own a link in the org, has no working link (ADR 0021, ADR 0041).
        var profile = await db.Profiles.AsNoTracking().SingleOrDefaultAsync(p => p.Id == link.OwnerId, cancellationToken);
        if (profile is not { IsSuspended: false })
        {
            return null;
        }

        var access = await resolver.ForProfileAsync(profile.Id, cancellationToken);
        return access.Has(link.OrganizationId, Permissions.ConnectLinkOwn) ? (profile, link.OrganizationId) : null;
    }

    private async Task<(Result? Refusal, Guid Owner, Guid Org)> CallerAsync(CancellationToken cancellationToken)
    {
        var target = current.Access.TargetFor(Permissions.ConnectLinkOwn);
        if (!target.Allowed)
        {
            return (target.Refusal, Guid.Empty, Guid.Empty);
        }

        var owner = await db.Users.Where(u => u.Id == current.UserId).Select(u => (Guid?)u.ProfileId).SingleOrDefaultAsync(cancellationToken);
        return owner is { } id ? (null, id, target.OrgId) : (Result.Forbidden(), Guid.Empty, Guid.Empty);
    }

    private ConnectLinkDto ToDto(string token, Guid orgId) => new($"{webApp.Value.Origin}/meet/{token}", OrgLabel.Of(current.Access.Orgs, orgId));
}
