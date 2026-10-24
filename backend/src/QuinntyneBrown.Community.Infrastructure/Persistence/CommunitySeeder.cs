using System.Text.Json;
using QuinntyneBrown.Community.Application.Identity;
using QuinntyneBrown.Community.Domain.Admin;
using QuinntyneBrown.Community.Domain.Events;
using QuinntyneBrown.Community.Domain.Ideas;
using JoinedVia = QuinntyneBrown.Community.Domain.Organizations.JoinedVia;
using OrgMembership = QuinntyneBrown.Community.Domain.Organizations.OrgMembership;
using PortfolioLead = QuinntyneBrown.Community.Domain.Organizations.PortfolioLead;
using QuinntyneBrown.Community.Domain.Profiles;
using QuinntyneBrown.Community.Domain.Resources;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OpenIddict.Abstractions;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace QuinntyneBrown.Community.Infrastructure.Persistence;

/// <summary>Idempotent seed data: safe to run on every deployment.</summary>
public class CommunitySeeder(IOpenIddictApplicationManager applications, CommunityDbContext db, TimeProvider time)
{
    public const string WebClientId = "web";

    public async Task SeedAsync(string webAppOrigin, CancellationToken cancellationToken = default)
    {
        var descriptor = new OpenIddictApplicationDescriptor
        {
            ClientId = WebClientId,
            ClientType = ClientTypes.Public,
            ConsentType = ConsentTypes.Implicit,
            DisplayName = "Quinntyne Brown web app",
            RedirectUris = { new Uri($"{webAppOrigin}/auth/callback") },
            PostLogoutRedirectUris = { new Uri($"{webAppOrigin}/") },
            Permissions =
            {
                Permissions.Endpoints.Authorization,
                Permissions.Endpoints.Token,
                Permissions.Endpoints.Revocation,
                Permissions.Endpoints.EndSession,
                Permissions.GrantTypes.AuthorizationCode,
                Permissions.GrantTypes.RefreshToken,
                Permissions.ResponseTypes.Code,
                Permissions.Scopes.Email,
                Permissions.Scopes.Profile,
                Permissions.Scopes.Roles,
                Permissions.Prefixes.Scope + Scopes.OfflineAccess,
            },
            Requirements = { Requirements.Features.ProofKeyForCodeExchange },
        };

        var existing = await applications.FindByClientIdAsync(WebClientId, cancellationToken);
        if (existing is null)
        {
            await applications.CreateAsync(descriptor, cancellationToken);
        }
        else
        {
            await applications.UpdateAsync(existing, descriptor, cancellationToken);
        }

        // The concurrency token that guards the last System Admin (ChangeRolesHandler).
        if (!await db.SystemAdminRosters.AnyAsync(r => r.Id == SystemAdminRoster.SingletonId, cancellationToken))
        {
            db.SystemAdminRosters.Add(new SystemAdminRoster());
            await db.SaveChangesAsync(cancellationToken);
        }

        await SeedHierarchyAsync(cancellationToken);
        await SeedStarterResourcesAsync(cancellationToken);
    }

    /// <summary>The portfolio, Org Types and catalogues, orgs and cross-org roles (ADR 0040); each is added once.</summary>
    private async Task SeedHierarchyAsync(CancellationToken cancellationToken)
    {
        if (!await db.Portfolios.AnyAsync(p => p.Id == HierarchySeed.PortfolioId, cancellationToken))
        {
            db.Portfolios.Add(HierarchySeed.Portfolio());
        }

        foreach (var (type, roles) in new[]
                 {
                     (HierarchySeed.FaithTechCity(), HierarchySeed.FaithTechCityRoles),
                     (HierarchySeed.Startup(), HierarchySeed.StartupRoles),
                 })
        {
            if (!await db.OrgTypes.AnyAsync(t => t.Id == type.Id, cancellationToken))
            {
                db.OrgTypes.Add(type);
            }

            var existing = await db.RoleDefinitions.Where(r => r.OrgTypeId == type.Id).Select(r => r.Id).ToListAsync(cancellationToken);
            db.RoleDefinitions.AddRange(HierarchySeed.Catalogue(type.Id, roles).Where(r => !existing.Contains(r.Id)));
        }

        foreach (var org in new[] { HierarchySeed.Toronto(), HierarchySeed.Shelfie() })
        {
            if (!await db.Organizations.AnyAsync(o => o.Id == org.Id, cancellationToken))
            {
                db.Organizations.Add(org);
            }
        }

        foreach (var role in new[] { HierarchySeed.PortfolioRole(), HierarchySeed.StaffRole() })
        {
            if (!await db.CrossOrgRoles.AnyAsync(r => r.Id == role.Id, cancellationToken))
            {
                db.CrossOrgRoles.Add(role);
            }
        }

        // The platform intake owns every idea, in the portfolio's root org; an existing row keeps its switches (ADR 0044).
        if (!await db.IdeaIntakes.AnyAsync(i => i.Id == IdeaIntake.PlatformId, cancellationToken))
        {
            db.IdeaIntakes.Add(new IdeaIntake(HierarchySeed.TorontoId));
        }

        await db.SaveChangesAsync(cancellationToken);
    }

    /// <summary>Makes the profile a member of FaithTech Toronto, where the demo data lives (ADR 0040); idempotent.</summary>
    private async Task JoinTorontoAsync(Guid profileId, CancellationToken cancellationToken)
    {
        if (!await db.OrgMemberships.AnyAsync(m => m.OrganizationId == HierarchySeed.TorontoId && m.ProfileId == profileId, cancellationToken)
            && !db.OrgMemberships.Local.Any(m => m.OrganizationId == HierarchySeed.TorontoId && m.ProfileId == profileId))
        {
            db.OrgMemberships.Add(new OrgMembership(HierarchySeed.TorontoId, profileId, JoinedVia.Seed, time.GetUtcNow().UtcDateTime));
        }
    }

    public record StarterResource(Guid Id, string Title, string Description, ResourceType Type, string Url, string[] Tags);

    /// <summary>Links every member can use from day one (L2-055); fixed ids keep the seed idempotent.</summary>
    public static readonly IReadOnlyList<StarterResource> StarterResources =
    [
        new(new Guid("6f1d1b8e-3c55-4a43-9a41-3f6f0a9d0001"), "FaithTech brand guidelines", "Logos, colours and type for anything that carries the FaithTech name.",
            ResourceType.Logo, "https://faithtech.com/brand", ["brand", "logo"]),
        new(new Guid("6f1d1b8e-3c55-4a43-9a41-3f6f0a9d0002"), "Starting a FaithTech city", "The playbook for launching a new city team.",
            ResourceType.Training, "https://faithtech.com/start-a-city", ["city-team", "launch", "training"]),
        new(new Guid("6f1d1b8e-3c55-4a43-9a41-3f6f0a9d0003"), "Hackathon planning guide", "How to plan, run and follow up a FaithTech hackathon.",
            ResourceType.Document, "https://faithtech.com/hackathons", ["hackathon", "events"]),
    ];

    /// <summary>Adds the starter links once, owned by the first System Admin; until there is one, nothing is added.</summary>
    private async Task SeedStarterResourcesAsync(CancellationToken cancellationToken)
    {
        var owner = await db.Profiles.Where(p => p.IsSystemAdmin).OrderBy(p => p.Id).Select(p => (Guid?)p.Id)
            .FirstOrDefaultAsync(cancellationToken);
        if (owner is not { } ownerId)
        {
            return;
        }

        var ids = StarterResources.Select(r => r.Id).ToList();
        var existing = await db.Resources.Where(r => ids.Contains(r.Id)).Select(r => r.Id).ToListAsync(cancellationToken);
        foreach (var starter in StarterResources.Where(r => !existing.Contains(r.Id)))
        {
            var resource = Resource.ForLink(HierarchySeed.TorontoId, starter.Title, starter.Description, starter.Type, ownerId, new Uri(starter.Url), time.GetUtcNow(), starter.Id);
            resource.SetOwner(ownerId, "System Admin");
            resource.SetTags(starter.Tags);
            resource.SetAudience(ResourceAudience.OrgWide());
            db.Resources.Add(resource);
        }

        await db.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Creates a verified System Admin with the given password for local development only, so there is always an
    /// account to sign in with. Idempotent: an existing account with the email is left as it is.
    /// </summary>
    public async Task SeedDevAccountAsync(string email, string password, CancellationToken cancellationToken = default)
    {
        var normalized = email.Trim().ToUpperInvariant();
        if (!await db.Users.AnyAsync(u => u.NormalizedEmail == normalized, cancellationToken))
        {
            var profile = new Profile("Quinntyne Brown", time.GetUtcNow().UtcDateTime);
            var user = new CommunityUser
            {
                Id = Guid.NewGuid(),
                UserName = email.Trim(),
                NormalizedUserName = normalized,
                Email = email.Trim(),
                NormalizedEmail = normalized,
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString("N"),
                ProfileId = profile.Id,
            };
            user.PasswordHash = new PasswordHasher<CommunityUser>().HashPassword(user, password);
            db.Profiles.Add(profile);
            db.Users.Add(user);
            await db.SaveChangesAsync(cancellationToken);
        }

        await GrantSystemAdminAsync(email, cancellationToken);
    }

    public const int MaxLoadTestUsers = 1000;

    /// <summary>A reserved top-level domain (RFC 2606): mail to it can never reach a real person.</summary>
    public const string LoadTestDomain = "loadtest.invalid";

    /// <summary>
    /// Creates verified members load-001@loadtest.invalid onwards, with no role, for the isolated
    /// performance environment (eng/load-test.js). Idempotent: existing load-test members are kept.
    /// Returns how many were created.
    /// </summary>
    public async Task<int> SeedLoadTestUsersAsync(int count, string password, CancellationToken cancellationToken = default)
    {
        var hasher = new PasswordHasher<CommunityUser>();
        var created = 0;
        for (var i = 1; i <= count; i++)
        {
            var email = $"load-{i:000}@{LoadTestDomain}";
            var normalized = email.ToUpperInvariant();
            if (await db.Users.AnyAsync(u => u.NormalizedEmail == normalized, cancellationToken))
            {
                continue;
            }

            // Join times spread over the last 18 months, so the Reports load test exercises the month chart.
            var profile = new Profile($"Load Tester {i:000}", time.GetUtcNow().UtcDateTime.AddDays(-(i * 540 / count)));
            var user = new CommunityUser
            {
                Id = Guid.NewGuid(),
                UserName = email,
                NormalizedUserName = normalized,
                Email = email,
                NormalizedEmail = normalized,
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString("N"),
                ProfileId = profile.Id,
            };
            user.PasswordHash = hasher.HashPassword(user, password);
            db.Profiles.Add(profile);
            db.Users.Add(user);
            await JoinTorontoAsync(profile.Id, cancellationToken);
            created++;
        }

        await db.SaveChangesAsync(cancellationToken);
        return created;
    }

    /// <summary>The name and title prefix of the records seed-report-records creates, so they are easy to find.</summary>
    public const string ReportRecordPrefix = "Report load ";

    public const int MaxReportMembers = 100_000;

    private static readonly string[] ReportCities = ["Austin", "Calgary", "Halifax", "Toronto", "Vancouver", "Winnipeg"];

    /// <summary>
    /// The Reports volume for the isolated performance environment (L2-129 AC1, eng/load-test.js): verified members
    /// "Report load member 00001" onwards (report-00001@loadtest.invalid, with no password) across six cities, joined
    /// over the last 18 months; one event for every ten members, from 335 days ago to 30 days ahead, every twentieth
    /// cancelled; and 50 member RSVPs on each, 40 of them checked in once the event has started. Idempotent: existing
    /// records are kept. Returns how many members were created.
    /// </summary>
    public async Task<int> SeedReportRecordsAsync(int members, CancellationToken cancellationToken = default)
    {
        var now = time.GetUtcNow();
        var existing = (await db.Profiles.Where(p => p.Name.StartsWith(ReportRecordPrefix)).Select(p => p.Name).ToListAsync(cancellationToken))
            .ToHashSet();
        var created = 0;
        for (var i = 1; i <= members; i++)
        {
            var name = $"{ReportRecordPrefix}member {i:00000}";
            if (existing.Contains(name))
            {
                continue;
            }

            var email = $"report-{i:00000}@{LoadTestDomain}";
            var profile = new Profile(name, now.UtcDateTime.AddDays(-(i * 540L / members)));
            profile.Update(name, ReportCities[i % ReportCities.Length], null);
            db.Profiles.Add(profile);
            db.Users.Add(new CommunityUser
            {
                Id = Guid.NewGuid(),
                UserName = email,
                NormalizedUserName = email.ToUpperInvariant(),
                Email = email,
                NormalizedEmail = email.ToUpperInvariant(),
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString("N"),
                ProfileId = profile.Id,
            });
            db.OrgMemberships.Add(new OrgMembership(HierarchySeed.TorontoId, profile.Id, JoinedVia.Seed, now.UtcDateTime));
            created++;
            if (created % 1000 == 0)
            {
                await db.SaveChangesAsync(cancellationToken);
                db.ChangeTracker.Clear();
            }
        }

        await db.SaveChangesAsync(cancellationToken);
        db.ChangeTracker.Clear();

        var titles = (await db.Events.Where(e => e.Title.StartsWith(ReportRecordPrefix)).Select(e => e.Title).ToListAsync(cancellationToken))
            .ToHashSet();
        var events = members / 10;
        for (var i = 1; i <= events; i++)
        {
            var title = $"{ReportRecordPrefix}event {i:00000}";
            if (titles.Contains(title))
            {
                continue;
            }

            var starts = now.AddDays(30 - (i * 365.0 / events));
            var e = new Event(
                HierarchySeed.TorontoId, title, "A Reports load-test evening.", EventType.Gathering, starts, starts.AddHours(2), ReportCities[i % ReportCities.Length],
                EventFormat.InPerson, "Load venue", null, null, EventVisibility.MembersOnly, Guid.Empty);
            var rsvps = Enumerable.Range(0, 50).Select(r => e.Rsvp(Guid.NewGuid(), starts.AddDays(-7).AddMinutes(r))).ToList();
            if (starts <= now)
            {
                foreach (var rsvp in rsvps.Take(40))
                {
                    e.CheckIn(rsvp.Id, Guid.Empty, starts);
                }
            }

            if (i % 20 == 0)
            {
                e.Cancel("Load-test cancellation");
            }

            db.Events.Add(e);
            if (i % 100 == 0)
            {
                await db.SaveChangesAsync(cancellationToken);
                db.ChangeTracker.Clear();
            }
        }

        await db.SaveChangesAsync(cancellationToken);
        return created;
    }

    public const int MaxSearchRecords = 1_000_000;

    /// <summary>The title prefix of the events seed-search-records creates, so they are easy to find and remove.</summary>
    public const string SearchRecordPrefix = "Load search event ";

    private static readonly string[] SearchWords =
        ["shelter", "hackathon", "builders", "prayer", "planning", "mentoring", "students", "design", "data", "health"];

    /// <summary>
    /// Creates members-only events "Load search event 000001" onwards with varied words, so the performance
    /// environment holds 100,000 indexed records for the search load test (L2-026 AC5, eng/load-test.js).
    /// Idempotent: existing ones are kept. Returns how many were created.
    /// </summary>
    public async Task<int> SeedSearchRecordsAsync(int count, CancellationToken cancellationToken = default)
    {
        var existing = (await db.Events.Where(e => e.Title.StartsWith(SearchRecordPrefix)).Select(e => e.Title).ToListAsync(cancellationToken))
            .ToHashSet();
        var starts = time.GetUtcNow().AddDays(30);
        var created = 0;
        for (var i = 1; i <= count; i++)
        {
            var title = $"{SearchRecordPrefix}{i:000000}";
            if (existing.Contains(title))
            {
                continue;
            }

            var words = $"{SearchWords[i % SearchWords.Length]} {SearchWords[i / SearchWords.Length % SearchWords.Length]}";
            db.Events.Add(new Event(
                HierarchySeed.TorontoId, title, $"A {words} evening.", EventType.Gathering, starts, starts.AddHours(2), $"City {i % 50:00}",
                EventFormat.InPerson, "Load venue", null, null, EventVisibility.MembersOnly, Guid.Empty));
            created++;
            if (created % 1000 == 0)
            {
                await db.SaveChangesAsync(cancellationToken);
                db.ChangeTracker.Clear();
            }
        }

        await db.SaveChangesAsync(cancellationToken);
        return created;
    }

    /// <summary>
    /// Makes an existing account System Admin, Portfolio Lead of "Quinntyne Brown" and Org Lead of FaithTech Toronto, so a
    /// new deployment has its first administrator (L2-009 AC6, L2-157 AC3). Idempotent; the grant is audited with the
    /// command line as its source. Returns false for an unknown email.
    /// </summary>
    public async Task<bool> GrantSystemAdminAsync(string email, CancellationToken cancellationToken = default)
    {
        var normalized = email.Trim().ToUpperInvariant();
        var profileId = await db.Users.Where(u => u.NormalizedEmail == normalized).Select(u => (Guid?)u.ProfileId).SingleOrDefaultAsync(cancellationToken);
        if (profileId is not { } id)
        {
            return false;
        }

        await SeedHierarchyAsync(cancellationToken);
        var profile = await db.Profiles.SingleAsync(p => p.Id == id, cancellationToken);
        var now = time.GetUtcNow().UtcDateTime;
        var granted = new List<string>();
        if (!profile.IsSystemAdmin)
        {
            profile.SetSystemAdmin(true);
            granted.Add("system-admin");
        }

        if (!await db.PortfolioLeads.AnyAsync(l => l.PortfolioId == HierarchySeed.PortfolioId && l.ProfileId == id, cancellationToken))
        {
            db.PortfolioLeads.Add(new PortfolioLead(HierarchySeed.PortfolioId, id, Guid.Empty, now));
            granted.Add("portfolio-lead");
        }

        var membership = await db.OrgMemberships.SingleOrDefaultAsync(m => m.OrganizationId == HierarchySeed.TorontoId && m.ProfileId == id, cancellationToken);
        if (membership is null)
        {
            db.OrgMemberships.Add(membership = new OrgMembership(HierarchySeed.TorontoId, id, JoinedVia.Seed, now));
        }

        if (!membership.IsOrgLead)
        {
            membership.SetOrgLead(true);
            granted.Add("org-lead");
        }

        if (granted.Count > 0)
        {
            db.AuditEntries.Add(new AuditEntry(
                Guid.Empty, "role.granted", "Profile", id.ToString(),
                JsonSerializer.Serialize(new { Roles = Array.Empty<string>() }), JsonSerializer.Serialize(new { Roles = granted.Order().ToArray() }),
                now, "cli", HierarchySeed.TorontoId, HierarchySeed.PortfolioId));
        }

        await db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
