// Traces to: L2-165, L2-166, L2-162
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using QuinntyneBrown.Community.Api.Tests.Organizations;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Domain.Organizations;
using QuinntyneBrown.Community.Infrastructure.Persistence;

namespace QuinntyneBrown.Community.Api.Tests.Integrations;

/// <summary>Applications and their events are read within coverage only; elsewhere they do not exist (L2-165, L2-166).</summary>
public class ListWithinCoverageTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    public sealed record EventItem(Guid Id, Guid EventId, string EventType, DateTimeOffset OccurredAt, DateTimeOffset ReceivedAt, JsonElement Data);

    public sealed record EventPage(EventItem[] Items, int Page, int PageSize, int TotalCount);

    private async Task<HttpClient> ClientAsync(string? org, params SeededRole[] roles) =>
        factory.ClientFor(await factory.AddMemberAsync($"Person {Guid.NewGuid():N}"[..14]), org, roles);

    // L2-165 AC1, AC4
    [Fact]
    public async Task Org_leads_staff_and_portfolio_list_the_orgs_applications_with_their_last_event()
    {
        var registered = await factory.RegisterAsync("Listed site");
        await factory.DeliverAsync(registered.App.SourceId, registered.Secret, IntegrationClients.ContactRequestBody());
        await factory.DeliverAsync(registered.App.SourceId, registered.Secret, IntegrationClients.ContactRequestBody());

        foreach (var (role, canManage) in new[] { (SeededRole.OrgLead, true), (SeededRole.Staff, false), (SeededRole.Portfolio, false) })
        {
            var client = await ClientAsync("faithtech-toronto", role);
            var response = await client.GetAsync("/api/integrations/apps");
            var json = await response.Content.ReadAsStringAsync();
            var apps = JsonSerializer.Deserialize<IntegrationClients.App[]>(json, JsonSerializerOptions.Web)!;

            var listed = Assert.Single(apps, a => a.Id == registered.App.Id);
            Assert.Equal((2, canManage, "Active"), (listed.EventCount, listed.CanManage, listed.Status));
            Assert.Equal(factory.Time.GetUtcNow(), listed.LastEventAt);
            Assert.DoesNotContain(registered.Secret, json);
        }
    }

    // L2-165 AC2
    [Fact]
    public async Task A_member_without_integrations_view_gets_403_for_the_list_and_404_by_id()
    {
        var registered = await factory.RegisterAsync();
        var member = await ClientAsync("faithtech-toronto", SeededRole.Volunteer);

        Assert.Equal(HttpStatusCode.Forbidden, (await member.GetAsync("/api/integrations/apps")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await member.GetAsync($"/api/integrations/apps/{registered.App.Id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await member.GetAsync($"/api/integrations/apps/{registered.App.Id}/events")).StatusCode);
    }

    // L2-165 AC3, L2-166 AC3
    [Fact]
    public async Task Another_orgs_lead_gets_404_and_never_sees_the_application()
    {
        var registered = await factory.RegisterAsync();
        var halifax = await factory.AddOrgAsync("FaithTech Halifax");
        var lead = await factory.AddMemberOfAsync(halifax, "Hannah Halifax", SeededRole.OrgLead);

        Assert.Equal(HttpStatusCode.NotFound, (await factory.ClientFor(lead, "faithtech-toronto").GetAsync("/api/integrations/apps")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await factory.ClientFor(lead).GetAsync($"/api/integrations/apps/{registered.App.Id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await factory.ClientFor(lead).GetAsync($"/api/integrations/apps/{registered.App.Id}/events")).StatusCode);
        Assert.DoesNotContain(registered.App.SourceId, await factory.ClientFor(lead).GetStringAsync("/api/integrations/apps"));
    }

    // L2-165 AC3, L2-166 AC3, L2-162 AC1
    [Fact]
    public async Task With_the_feature_off_for_the_org_type_everything_answers_404_and_the_webhook_401()
    {
        var typeId = await factory.WithDbAsync(async db =>
        {
            var type = new OrgType(HierarchySeed.PortfolioId, $"plain-{Guid.NewGuid():N}"[..14], "Plain", [Features.Events], []);
            db.OrgTypes.Add(type);
            await db.SaveChangesAsync();
            return type.Id;
        });
        var org = await factory.AddOrgAsync("Plain Org", typeId);
        var app = await factory.SeedAppAsync(org.Id);
        var lead = factory.ClientFor(await factory.AddMemberOfAsync(org, "Pat Plain", SeededRole.OrgLead), org.Slug);

        Assert.Equal(HttpStatusCode.NotFound, (await lead.GetAsync("/api/integrations/apps")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await lead.GetAsync($"/api/integrations/apps/{app.Id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await lead.PostAsJsonAsync("/api/integrations/apps", new { name = "Nope" })).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await factory.DeliverAsync(app.SourceId, app.Secret, IntegrationClients.ContactRequestBody())).StatusCode);
    }

    // L2-166 AC1, AC2
    [Fact]
    public async Task Events_are_listed_newest_first_25_at_a_time()
    {
        var registered = await factory.RegisterAsync("Busy site");
        var ids = new List<Guid>();
        for (var i = 0; i < 30; i++)
        {
            factory.Time.Advance(TimeSpan.FromSeconds(1));
            var eventId = Guid.NewGuid();
            ids.Add(eventId);
            await factory.DeliverAsync(registered.App.SourceId, registered.Secret, IntegrationClients.ContactRequestBody(eventId, name: $"Person {i}"));
        }

        var client = await ClientAsync("faithtech-toronto", SeededRole.Staff);
        var first = (await client.GetFromJsonAsync<EventPage>($"/api/integrations/apps/{registered.App.Id}/events?page=1&pageSize=25"))!;
        var second = (await client.GetFromJsonAsync<EventPage>($"/api/integrations/apps/{registered.App.Id}/events?page=2&pageSize=25"))!;

        Assert.Equal((25, 30), (first.Items.Length, first.TotalCount));
        Assert.Equal(5, second.Items.Length);
        Assert.Equal(Enumerable.Reverse(ids), first.Items.Concat(second.Items).Select(e => e.EventId));
        Assert.Equal("Person 29", first.Items[0].Data.GetProperty("name").GetString());
        Assert.Equal(IntegrationClients.ContactRequest, first.Items[0].EventType);
    }

    // L2-166 AC1
    [Fact]
    public async Task One_application_is_read_by_id_with_its_connection_details()
    {
        var registered = await factory.RegisterAsync("Detail site");
        var client = await ClientAsync("faithtech-toronto", SeededRole.Portfolio);

        var app = (await client.GetFromJsonAsync<IntegrationClients.App>($"/api/integrations/apps/{registered.App.Id}"))!;

        Assert.Equal((registered.App.SourceId, registered.App.SecretPrefix, "Detail site"), (app.SourceId, app.SecretPrefix, app.Name));
    }
}
