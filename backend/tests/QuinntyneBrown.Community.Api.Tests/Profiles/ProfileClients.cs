using System.Runtime.CompilerServices;
using QuinntyneBrown.Community.Application.Identity;
using QuinntyneBrown.Community.Domain.Organizations;
using QuinntyneBrown.Community.Domain.Profiles;
using QuinntyneBrown.Community.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace QuinntyneBrown.Community.Api.Tests.Profiles;

/// <summary>Members with real accounts and profiles, and clients signed in as them.</summary>
public static class ProfileClients
{
    public record Member(Guid UserId, Guid ProfileId);

    /// <summary>
    /// A verified member of FaithTech Toronto (the seeded org every test shares), unless <paramref name="joinToronto"/>
    /// is false, with any roles <paramref name="shape"/> adds granted there.
    /// </summary>
    public static async Task<Member> AddMemberAsync(
        this CommunityApiFactory factory, string name, Action<Profile>? shape = null, bool joinToronto = true)
    {
        return await factory.WithDbAsync(async db =>
        {
            var profile = new Profile(name);
            shape?.Invoke(profile);
            var email = $"{Guid.NewGuid():N}@example.org";
            var user = new CommunityUser
            {
                Id = Guid.NewGuid(),
                UserName = email,
                Email = email,
                NormalizedEmail = email.ToUpperInvariant(),
                NormalizedUserName = email.ToUpperInvariant(),
                EmailConfirmed = true,
                ProfileId = profile.Id,
            };
            db.Profiles.Add(profile);
            db.Users.Add(user);
            if (joinToronto)
            {
                db.OrgMemberships.Add(new OrgMembership(HierarchySeed.TorontoId, profile.Id, JoinedVia.Seed, DateTime.UtcNow));
            }

            await db.SaveChangesAsync();
            foreach (var role in SeededRoles.TakePending(profile))
            {
                await SeededRoles.GrantAsync(db, profile.Id, role);
            }

            return new Member(user.Id, profile.Id);
        });
    }

    // One test-auth server per fixture: building a server per client made every test pay for a host start.
    private static readonly ConditionalWeakTable<CommunityApiFactory, WebApplicationFactory<Program>> TestAuthServers = new();

    /// <summary>
    /// A client authenticated as the member, who holds the given roles: they are granted in FaithTech Toronto (or on
    /// the platform), because the server authorizes with the member's current roles, not the token's.
    /// </summary>
    /// <param name="org">An org slug sent as <c>X-Org</c>, as the web app does for the active org.</param>
    public static HttpClient ClientFor(this CommunityApiFactory factory, Member member, params SeededRole[] roles) =>
        factory.ClientFor(member, null, roles);

    public static HttpClient ClientFor(this CommunityApiFactory factory, Member member, string? org, params SeededRole[] roles)
    {
        if (roles.Length > 0)
        {
            // The in-memory provider completes synchronously, so this cannot deadlock.
            factory.WithDbAsync(async db =>
            {
                foreach (var role in roles)
                {
                    await SeededRoles.GrantAsync(db, member.ProfileId, role);
                }

                return 0;
            }).GetAwaiter().GetResult();
        }

        var server = TestAuthServers.GetValue(factory, f => f.WithWebHostBuilder(b => b.ConfigureServices(s => s
            .AddAuthentication(TestAuthHandler.SchemeName)
            .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(TestAuthHandler.SchemeName, null))));
        var client = server.CreateClient();
        client.DefaultRequestHeaders.Add(TestAuthHandler.Header, $"{member.UserId};{string.Join(',', roles)}");
        if (org is not null)
        {
            client.DefaultRequestHeaders.Add("X-Org", org);
        }

        return client;
    }
}
