// Traces to: L2-134, L2-137, L2-147
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Domain.Organizations;
using QuinntyneBrown.Community.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Organizations;

/// <summary>The Portfolio Lead edits Org Types, their features and role catalogues (L2-134, L2-137, L2-147).</summary>
public class PortfolioAdminTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private static readonly string OrgTypes = $"/api/portfolios/{HierarchySeed.PortfolioId}/org-types";

    public sealed record OrgTypeSummary(Guid Id, string Key, string Name, string[] EnabledFeatures, int RoleCount, int OrgCount);

    public sealed record RoleDefinition(Guid Id, string Key, string Name, string? Description, Guid? ParentRoleId, int SortOrder, string[] Permissions, Guid[] CanGrant, int HolderCount);

    public sealed record PermissionGroup(string Feature, bool Enabled, string[] Codes);

    public sealed record OrgType(Guid Id, string Key, string Name, string[] EnabledFeatures, string[] MemberPermissions, RoleDefinition[] Roles, PermissionGroup[] PermissionCatalogue);

    private sealed record Access(AccessOrg[] Orgs);

    private sealed record AccessOrg(string Slug, string[] Features, string[] Permissions);

    private Task<ProfileClients.Member> PortfolioLeadAsync() =>
        factory.AddMemberAsync($"Quinn Lead {Guid.NewGuid():N}"[..16], p => p.AddRole(SeededRole.PortfolioLead, Guid.Empty, DateTime.UtcNow));

    private async Task<OrgType> NewTypeAsync(HttpClient client, string name)
    {
        var key = $"type-{Guid.NewGuid().ToString("N")[..8]}";
        var response = await client.PostAsJsonAsync(OrgTypes, new { key, name });
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        return (await response.Content.ReadFromJsonAsync<OrgType>())!;
    }

    // L2-134 AC1
    [Fact]
    public async Task The_portfolio_lead_lists_the_seeded_org_types_with_their_roles_features_and_orgs()
    {
        var client = factory.ClientFor(await PortfolioLeadAsync());

        var types = (await client.GetFromJsonAsync<OrgTypeSummary[]>(OrgTypes))!;

        var city = types.Single(t => t.Key == "faithtech-city");
        Assert.Equal("FaithTech City", city.Name);
        Assert.True(city.RoleCount > 0);
        Assert.True(city.OrgCount >= 1);
        Assert.Contains("partners", city.EnabledFeatures);
        Assert.Contains(types, t => t.Name == "Startup");
    }

    // L2-147 AC1, AC2; L2-137 AC1, AC5
    [Fact]
    public async Task Switching_a_feature_off_hides_it_in_every_org_of_the_type_and_is_audited()
    {
        var client = factory.ClientFor(await PortfolioLeadAsync());
        var type = await NewTypeAsync(client, "Ministry");
        await client.PutAsJsonAsync($"/api/org-types/{type.Id}/features", new { enabled = new[] { "partners", "events" } });
        await client.PutAsJsonAsync($"/api/org-types/{type.Id}", new { name = "Ministry", memberPermissions = new[] { "partners.read" } });
        var org = await factory.AddOrgAsync("Ministry North", type.Id);
        var member = await factory.AddMemberOfAsync(org, "Mia Member");
        var memberClient = factory.ClientFor(member, org.Slug);
        Assert.Equal(HttpStatusCode.OK, (await memberClient.GetAsync("/api/partners")).StatusCode);

        var response = await client.PutAsJsonAsync($"/api/org-types/{type.Id}/features", new { enabled = new[] { "events" } });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(["events"], (await response.Content.ReadFromJsonAsync<OrgType>())!.EnabledFeatures);
        Assert.Equal(HttpStatusCode.NotFound, (await memberClient.GetAsync("/api/partners")).StatusCode);
        var access = (await memberClient.GetFromJsonAsync<Access>("/api/me/access"))!;
        Assert.DoesNotContain("partners", access.Orgs.Single(o => o.Slug == org.Slug).Features);
        Assert.Contains("profiles", access.Orgs.Single(o => o.Slug == org.Slug).Features);
        Assert.True(await factory.WithDbAsync(db => db.AuditEntries.AnyAsync(e => e.Action == "orgType.featuresChanged" && e.TargetId == type.Id.ToString())));
    }

    [Fact]
    public async Task An_unknown_feature_is_refused()
    {
        var client = factory.ClientFor(await PortfolioLeadAsync());
        var type = await NewTypeAsync(client, "Studio");

        var response = await client.PutAsJsonAsync($"/api/org-types/{type.Id}/features", new { enabled = new[] { "hackathons" } });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.True((await response.Content.ReadFromJsonAsync<ValidationProblemDetails>())!.Errors.ContainsKey("enabled"));
    }

    // L2-137 AC2
    [Fact]
    public async Task An_org_lead_is_refused_and_another_portfolio_is_not_found()
    {
        var olivia = await factory.AddMemberAsync("Olivia Grant", p => p.AddRole(SeededRole.OrgLead, Guid.Empty, DateTime.UtcNow));
        var client = factory.ClientFor(olivia);

        Assert.Equal(HttpStatusCode.Forbidden, (await client.GetAsync(OrgTypes)).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await client.PutAsJsonAsync($"/api/org-types/{HierarchySeed.FaithTechCityTypeId}/features", new { enabled = Array.Empty<string>() })).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync($"/api/portfolios/{Guid.NewGuid()}/org-types")).StatusCode);
    }

    // L2-134 AC2, AC5
    [Fact]
    public async Task A_catalogue_role_with_an_unknown_permission_a_duplicate_key_or_a_foreign_grant_is_refused()
    {
        var client = factory.ClientFor(await PortfolioLeadAsync());
        var type = await NewTypeAsync(client, "Guild");
        var roles = $"/api/org-types/{type.Id}/roles";
        var created = await client.PostAsJsonAsync(roles, new { key = "maker", name = "Maker", permissions = new[] { "notes.create" }, canGrant = Array.Empty<Guid>() });
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        var cityRole = await factory.WithDbAsync(db => db.RoleDefinitions.Where(r => r.OrgTypeId == HierarchySeed.FaithTechCityTypeId).Select(r => r.Id).FirstAsync());

        async Task<string[]> FieldsAsync(object body)
        {
            var response = await client.PostAsJsonAsync(roles, body);
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            return [.. (await response.Content.ReadFromJsonAsync<ValidationProblemDetails>())!.Errors.Keys];
        }

        Assert.Equal(["permissions"], await FieldsAsync(new { key = "builder", name = "Builder", permissions = new[] { "rockets.launch" }, canGrant = Array.Empty<Guid>() }));
        Assert.Equal(["key"], await FieldsAsync(new { key = "maker", name = "Maker again", permissions = Array.Empty<string>(), canGrant = Array.Empty<Guid>() }));
        Assert.Equal(["canGrant"], await FieldsAsync(new { key = "steward", name = "Steward", permissions = Array.Empty<string>(), canGrant = new[] { cityRole } }));
    }

    // L2-137 AC1, L2-134 AC4: a role's permissions apply at once and nothing comes from its parent.
    [Fact]
    public async Task A_role_change_applies_at_once_and_is_audited_with_before_and_after()
    {
        var client = factory.ClientFor(await PortfolioLeadAsync());
        var type = await NewTypeAsync(client, "Collective");
        await client.PutAsJsonAsync($"/api/org-types/{type.Id}/features", new { enabled = new[] { "partners" } });
        var roles = $"/api/org-types/{type.Id}/roles";
        var lead = (await (await client.PostAsJsonAsync(roles, new { key = "lead", name = "Lead", permissions = new[] { "partners.write" }, canGrant = Array.Empty<Guid>() })).Content.ReadFromJsonAsync<RoleDefinition>())!;
        var helper = (await (await client.PostAsJsonAsync(roles, new { key = "helper", name = "Helper", parentRoleId = lead.Id, permissions = Array.Empty<string>(), canGrant = Array.Empty<Guid>() })).Content.ReadFromJsonAsync<RoleDefinition>())!;
        var org = await factory.AddOrgAsync("Collective East", type.Id);
        var member = await factory.AddMemberOfAsync(org, "Hal Helper");
        await factory.WithDbAsync(db =>
        {
            db.OrgRoleAssignments.Add(new OrgRoleAssignment(org.Id, member.ProfileId, helper.Id, Guid.Empty, DateTime.UtcNow));
            return db.SaveChangesAsync();
        });
        var memberClient = factory.ClientFor(member, org.Slug);
        Assert.DoesNotContain("partners.write", (await memberClient.GetFromJsonAsync<Access>("/api/me/access"))!.Orgs.Single(o => o.Slug == org.Slug).Permissions);

        var response = await client.PutAsJsonAsync($"{roles}/{helper.Id}", new { key = "helper", name = "Helper", parentRoleId = lead.Id, permissions = new[] { "partners.read" }, canGrant = Array.Empty<Guid>() });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("partners.read", (await memberClient.GetFromJsonAsync<Access>("/api/me/access"))!.Orgs.Single(o => o.Slug == org.Slug).Permissions);
        var entry = await factory.WithDbAsync(db => db.AuditEntries.SingleAsync(e => e.Action == "catalogue.roleChanged" && e.TargetId == helper.Id.ToString()));
        Assert.Contains("partners.read", entry.AfterJson);
        Assert.DoesNotContain("partners.read", entry.BeforeJson);
    }

    // L2-137 AC3
    [Fact]
    public async Task A_held_role_cannot_be_removed_and_an_unheld_one_can()
    {
        var client = factory.ClientFor(await PortfolioLeadAsync());
        var type = await NewTypeAsync(client, "Circle");
        var roles = $"/api/org-types/{type.Id}/roles";
        var held = (await (await client.PostAsJsonAsync(roles, new { key = "keeper", name = "Keeper", permissions = Array.Empty<string>(), canGrant = Array.Empty<Guid>() })).Content.ReadFromJsonAsync<RoleDefinition>())!;
        var spare = (await (await client.PostAsJsonAsync(roles, new { key = "spare", name = "Spare", permissions = Array.Empty<string>(), canGrant = new[] { held.Id } })).Content.ReadFromJsonAsync<RoleDefinition>())!;
        var org = await factory.AddOrgAsync("Circle West", type.Id);
        var member = await factory.AddMemberOfAsync(org, "Kim Keeper");
        await factory.WithDbAsync(db =>
        {
            db.OrgRoleAssignments.Add(new OrgRoleAssignment(org.Id, member.ProfileId, held.Id, Guid.Empty, DateTime.UtcNow));
            return db.SaveChangesAsync();
        });

        var refused = await client.DeleteAsync($"{roles}/{held.Id}");
        var removed = await client.DeleteAsync($"{roles}/{spare.Id}");

        Assert.Equal(HttpStatusCode.Conflict, refused.StatusCode);
        var problem = await refused.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("Kim Keeper", problem.GetProperty("holders")[0].GetProperty("name").GetString());
        Assert.Equal(HttpStatusCode.NoContent, removed.StatusCode);
        var after = (await client.GetFromJsonAsync<OrgType>($"/api/org-types/{type.Id}"))!;
        Assert.Equal(["keeper"], after.Roles.Select(r => r.Key));
        Assert.Equal(1, after.Roles.Single().HolderCount);
    }

    [Fact]
    public async Task Roles_are_reordered_and_nested_and_the_editor_hides_disabled_features()
    {
        var client = factory.ClientFor(await PortfolioLeadAsync());
        var type = await NewTypeAsync(client, "Chapter");
        var roles = $"/api/org-types/{type.Id}/roles";
        var a = (await (await client.PostAsJsonAsync(roles, new { key = "a", name = "A", permissions = Array.Empty<string>(), canGrant = Array.Empty<Guid>() })).Content.ReadFromJsonAsync<RoleDefinition>())!;
        var b = (await (await client.PostAsJsonAsync(roles, new { key = "b", name = "B", permissions = Array.Empty<string>(), canGrant = Array.Empty<Guid>() })).Content.ReadFromJsonAsync<RoleDefinition>())!;

        var reordered = await client.PutAsJsonAsync($"{roles}/order", new { items = new object[] { new { roleId = b.Id, parentRoleId = (Guid?)null, sortOrder = 0 }, new { roleId = a.Id, parentRoleId = b.Id, sortOrder = 1 } } });

        Assert.Equal(HttpStatusCode.NoContent, reordered.StatusCode);
        var after = (await client.GetFromJsonAsync<OrgType>($"/api/org-types/{type.Id}"))!;
        Assert.Equal(["b", "a"], after.Roles.Select(r => r.Key));
        Assert.Equal(b.Id, after.Roles.Single(r => r.Key == "a").ParentRoleId);
        Assert.False(after.PermissionCatalogue.Single(g => g.Feature == "partners").Enabled);
        Assert.True(after.PermissionCatalogue.Single(g => g.Feature == "notes").Enabled);
    }
}
