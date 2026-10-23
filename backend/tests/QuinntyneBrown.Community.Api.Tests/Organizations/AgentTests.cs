// Traces to: L2-154
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using QuinntyneBrown.Community.Api.Tests.Agile;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Domain.Organizations;
using QuinntyneBrown.Community.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Organizations;

/// <summary>Agents are profiles that call the API with scoped, revocable tokens (L2-154, ADR 0036).</summary>
public class AgentTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    public sealed record OrgRef(Guid Id, string Slug, string Name);

    public sealed record Agent(Guid ProfileId, string Name, OrgRef[] Orgs, int TokenCount);

    public sealed record IssuedToken(Guid Id, string Name, string Prefix, OrgRef[] Orgs, DateTimeOffset ExpiresAt, string Token);

    public sealed record AgentToken(Guid Id, string Name, string Prefix, OrgRef[] Orgs, DateTimeOffset ExpiresAt, DateTimeOffset? LastUsedAt, DateTimeOffset? RevokedAt);

    private sealed record Access(AccessOrg[] Orgs);

    private sealed record AccessOrg(string Slug);

    private Task<ProfileClients.Member> PortfolioLeadAsync() =>
        factory.AddMemberAsync($"Quinn Lead {Guid.NewGuid():N}"[..16], p => p.AddRole(SeededRole.PortfolioLead, Guid.Empty, DateTime.UtcNow));

    private async Task<Agent> CreateAgentAsync(HttpClient client, string name)
    {
        var response = await client.PostAsJsonAsync("/api/agents", new { portfolioId = HierarchySeed.PortfolioId, name });
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        return (await response.Content.ReadFromJsonAsync<Agent>())!;
    }

    private Task JoinAsync(Guid profileId, Guid orgId, bool orgLead = false) =>
        factory.WithDbAsync(db =>
        {
            var membership = new OrgMembership(orgId, profileId, JoinedVia.Added, DateTime.UtcNow);
            membership.SetOrgLead(orgLead);
            db.OrgMemberships.Add(membership);
            return db.SaveChangesAsync();
        });

    private HttpClient TokenClient(string token, string? org = null)
    {
        var client = factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        if (org is not null)
        {
            client.DefaultRequestHeaders.Add("X-Org", org);
        }

        return client;
    }

    // AC1
    [Fact]
    public async Task The_portfolio_lead_creates_an_agent_with_no_password_or_email()
    {
        var client = factory.ClientFor(await PortfolioLeadAsync());

        var agent = await CreateAgentAsync(client, "Sprint Bot");

        var stored = await factory.WithDbAsync(db => db.Users.Where(u => u.ProfileId == agent.ProfileId).Select(u => new { u.Email, u.PasswordHash }).SingleAsync());
        Assert.Equal((null, null), (stored.Email, stored.PasswordHash));
        Assert.Equal(Domain.Profiles.ProfileKind.Agent, await factory.WithDbAsync(db => db.Profiles.Where(p => p.Id == agent.ProfileId).Select(p => p.Kind).SingleAsync()));
        var list = (await client.GetFromJsonAsync<Agent[]>($"/api/agents?portfolioId={HierarchySeed.PortfolioId}"))!;
        Assert.Contains(list, a => a.ProfileId == agent.ProfileId && a.Name == "Sprint Bot");
    }

    // AC2, AC3, AC7
    [Fact]
    public async Task A_token_is_shown_once_and_acts_only_in_its_orgs()
    {
        var client = factory.ClientFor(await PortfolioLeadAsync());
        var agent = await CreateAgentAsync(client, "Notes Bot");
        await JoinAsync(agent.ProfileId, OrgClients.Toronto.Id);
        await JoinAsync(agent.ProfileId, OrgClients.Shelfie.Id);

        var response = await client.PostAsJsonAsync($"/api/agents/{agent.ProfileId}/tokens", new { name = "CI", expiresInDays = 30, orgIds = new[] { OrgClients.Toronto.Id } });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var issued = (await response.Content.ReadFromJsonAsync<IssuedToken>())!;
        Assert.StartsWith("ftca_", issued.Token);
        Assert.StartsWith(issued.Prefix, issued.Token["ftca_".Length..]);
        var access = (await TokenClient(issued.Token).GetFromJsonAsync<Access>("/api/me/access"))!;
        Assert.Equal(["faithtech-toronto"], access.Orgs.Select(o => o.Slug));
        Assert.Equal(HttpStatusCode.NotFound, (await TokenClient(issued.Token, "shelfie").GetAsync("/api/notes")).StatusCode);
        var tokens = await client.GetStringAsync($"/api/agents/{agent.ProfileId}/tokens");
        Assert.DoesNotContain(issued.Token, tokens);
        Assert.Contains("\"lastUsedAt\":\"", tokens);
        Assert.True(await factory.WithDbAsync(db => db.AuditEntries.AnyAsync(e => e.Action == "agent.tokenIssued" && e.TargetId == agent.ProfileId.ToString())));
    }

    [Fact]
    public async Task An_expiry_outside_1_to_90_days_or_no_orgs_is_refused()
    {
        var client = factory.ClientFor(await PortfolioLeadAsync());
        var agent = await CreateAgentAsync(client, "Range Bot");

        var tooLong = await client.PostAsJsonAsync($"/api/agents/{agent.ProfileId}/tokens", new { name = "Long", expiresInDays = 91, orgIds = new[] { OrgClients.Toronto.Id } });
        var noOrgs = await client.PostAsJsonAsync($"/api/agents/{agent.ProfileId}/tokens", new { name = "None", expiresInDays = 30, orgIds = Array.Empty<Guid>() });

        Assert.True((await tooLong.Content.ReadFromJsonAsync<ValidationProblemDetails>())!.Errors.ContainsKey("expiresInDays"));
        Assert.True((await noOrgs.Content.ReadFromJsonAsync<ValidationProblemDetails>())!.Errors.ContainsKey("orgIds"));
    }

    // AC2: an Org Lead issues tokens for their own org only.
    [Fact]
    public async Task An_org_lead_issues_a_token_for_their_org_but_not_for_another()
    {
        var agent = await CreateAgentAsync(factory.ClientFor(await PortfolioLeadAsync()), "Lead Bot");
        await JoinAsync(agent.ProfileId, OrgClients.Toronto.Id);
        var olivia = await factory.AddMemberAsync("Olivia Grant", p => p.AddRole(SeededRole.OrgLead, Guid.Empty, DateTime.UtcNow));
        var client = factory.ClientFor(olivia);

        var own = await client.PostAsJsonAsync($"/api/agents/{agent.ProfileId}/tokens", new { name = "Toronto", expiresInDays = 7, orgIds = new[] { OrgClients.Toronto.Id } });
        var other = await client.PostAsJsonAsync($"/api/agents/{agent.ProfileId}/tokens", new { name = "Shelfie", expiresInDays = 7, orgIds = new[] { OrgClients.Shelfie.Id } });

        Assert.Equal(HttpStatusCode.Created, own.StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, other.StatusCode);
    }

    // AC4, AC7
    [Fact]
    public async Task A_revoked_or_expired_token_or_a_suspended_agent_is_refused()
    {
        var client = factory.ClientFor(await PortfolioLeadAsync());
        var agent = await CreateAgentAsync(client, "Old Bot");
        await JoinAsync(agent.ProfileId, OrgClients.Toronto.Id);
        async Task<IssuedToken> IssueAsync(int days) =>
            (await (await client.PostAsJsonAsync($"/api/agents/{agent.ProfileId}/tokens", new { name = $"T{days}", expiresInDays = days, orgIds = new[] { OrgClients.Toronto.Id } })).Content.ReadFromJsonAsync<IssuedToken>())!;
        var revoked = await IssueAsync(30);
        var expiring = await IssueAsync(1);
        var suspended = await IssueAsync(30);

        Assert.Equal(HttpStatusCode.NoContent, (await client.DeleteAsync($"/api/agents/{agent.ProfileId}/tokens/{revoked.Id}")).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await TokenClient(revoked.Token).GetAsync("/api/me/access")).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await TokenClient("ftca_not-a-real-token").GetAsync("/api/me/access")).StatusCode);
        Assert.True(await factory.WithDbAsync(db => db.AuditEntries.AnyAsync(e => e.Action == "agent.tokenRevoked" && e.TargetId == agent.ProfileId.ToString())));

        factory.Time.Advance(TimeSpan.FromDays(2));
        Assert.Equal(HttpStatusCode.Unauthorized, (await TokenClient(expiring.Token).GetAsync("/api/me/access")).StatusCode);

        Assert.Equal(HttpStatusCode.OK, (await TokenClient(suspended.Token).GetAsync("/api/me/access")).StatusCode);
        await factory.WithDbAsync(async db =>
        {
            (await db.Profiles.SingleAsync(p => p.Id == agent.ProfileId)).Suspend("Misbehaving", DateTime.UtcNow);
            return await db.SaveChangesAsync();
        });
        Assert.Equal(HttpStatusCode.Unauthorized, (await TokenClient(suspended.Token).GetAsync("/api/me/access")).StatusCode);
    }

    // AC5: a write made with a token names the agent as actor, and the token and its issuer.
    [Fact]
    public async Task A_write_with_a_token_is_attributed_to_the_agent_and_names_the_token()
    {
        var quinn = await PortfolioLeadAsync();
        var client = factory.ClientFor(quinn);
        var agent = await CreateAgentAsync(client, "Roster Bot");
        await JoinAsync(agent.ProfileId, OrgClients.Toronto.Id, orgLead: true);
        var issued = (await (await client.PostAsJsonAsync($"/api/agents/{agent.ProfileId}/tokens", new { name = "Roster sync", expiresInDays = 30, orgIds = new[] { OrgClients.Toronto.Id } })).Content.ReadFromJsonAsync<IssuedToken>())!;
        var sami = await factory.AddMemberAsync("Sami Shah", joinToronto: false);

        var added = await TokenClient(issued.Token, "faithtech-toronto").PostAsJsonAsync($"/api/organizations/{OrgClients.Toronto.Id}/members", new { email = await factory.EmailOfAsync(sami) });

        Assert.Equal(HttpStatusCode.Created, added.StatusCode);
        var entry = await factory.WithDbAsync(db => db.AuditEntries.SingleAsync(e => e.Action == "member.added" && e.TargetId == sami.ProfileId.ToString()));
        Assert.Equal(agent.ProfileId, entry.ActorId);
        Assert.Contains("Roster sync", entry.Detail);
        Assert.Contains(quinn.ProfileId.ToString(), entry.Detail);
    }
}
