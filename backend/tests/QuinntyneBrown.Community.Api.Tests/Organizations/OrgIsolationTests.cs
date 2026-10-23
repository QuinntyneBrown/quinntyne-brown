// Traces to: L2-139, L2-135
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Api.Tests.Resources;

namespace QuinntyneBrown.Community.Api.Tests.Organizations;

/// <summary>Every record belongs to one org; nothing in an org the caller does not cover can be found (ADR 0034).</summary>
public class OrgIsolationTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private static readonly DateTimeOffset Start = new(2027, 3, 4, 23, 0, 0, TimeSpan.Zero);

    private record Ids(Guid Event, Guid Partner, Guid Contact, Guid Resource, Guid Note, Guid Workspace);

    /// <summary>A FaithTech city other than Toronto, with one of everything made by its City Lead and Communications Lead.</summary>
    private async Task<(OrgClients.Org Halifax, Ids Ids)> HalifaxWithRecordsAsync()
    {
        var halifax = await factory.AddOrgAsync("FaithTech Halifax");
        var lead = await factory.AddMemberOfAsync(halifax, "Hannah Halifax", SeededRole.CityLead, SeededRole.CommunicationsLead);
        var client = factory.ClientFor(lead);
        var created = new List<Guid>();
        foreach (var (path, body) in new (string, object)[]
                 {
                     ("/api/events", new { title = "Halifax Builders Night", description = "Build.", type = "BuildersNight", startsAt = Start, endsAt = Start.AddHours(2), city = "Halifax", format = "InPerson", venue = "The Hub", visibility = "MembersOnly" }),
                     ("/api/partners", PartnerClientsBody()),
                     ("/api/contacts", new { Name = "Private Halifax", Email = "p@halifax.example", City = "Halifax" }),
                     ("/api/notes", new { Title = "Halifax notes" }),
                     ("/api/workspaces", new { Name = "Halifax team", Method = "Kanban" }),
                 })
        {
            var response = await client.PostAsJsonAsync(path, body);
            Assert.True(response.IsSuccessStatusCode, $"{path}: {response.StatusCode} {await response.Content.ReadAsStringAsync()}");
            created.Add((await response.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("id").GetGuid());
        }

        var resource = await factory.ClientFor(lead).UploadAsync(ResourceClients.Deck());
        resource.EnsureSuccessStatusCode();
        var resourceId = (await resource.Content.ReadFromJsonAsync<JsonElement[]>())![0].GetProperty("id").GetGuid();
        var announcement = await client.PostAsJsonAsync("/api/announcements", new { Subject = "Halifax only", Body = "Hi Halifax.", AlsoEmail = false, Audience = new { Kind = "Everyone" } });
        announcement.EnsureSuccessStatusCode();
        return (halifax, new Ids(created[0], created[1], created[2], resourceId, created[3], created[4]));
    }

    private static object PartnerClientsBody() => new { Name = "Halifax Church", Website = "halifax.example", Stage = "Lead" };

    [Fact]
    public async Task A_member_of_another_org_gets_404_for_every_record_by_id()
    {
        var (_, ids) = await HalifaxWithRecordsAsync();
        // A Toronto member holding every lead role, so only the org boundary can refuse.
        var toronto = await factory.AddMemberAsync("Grace Okonkwo");
        var client = factory.ClientFor(toronto, SeededRole.CityLead, SeededRole.EventLead, SeededRole.CommunicationsLead);

        foreach (var path in new[]
                 {
                     $"/api/events/{ids.Event}", $"/api/events/{ids.Event}/check-in", $"/api/partners/{ids.Partner}",
                     $"/api/partners/{ids.Partner}/activities", $"/api/contacts/{ids.Contact}", $"/api/resources/{ids.Resource}",
                     $"/api/notes/{ids.Note}", $"/api/workspaces/{ids.Workspace}",
                 })
        {
            Assert.True(HttpStatusCode.NotFound == (await client.GetAsync(path)).StatusCode, path);
        }

        Assert.Equal(HttpStatusCode.NotFound, (await client.PostAsync($"/api/events/{ids.Event}/rsvps", null)).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await client.PutAsJsonAsync($"/api/partners/{ids.Partner}", PartnerClientsBody())).StatusCode);
    }

    [Fact]
    public async Task Lists_and_search_hold_only_records_of_the_orgs_the_caller_covers()
    {
        var (_, _) = await HalifaxWithRecordsAsync();
        var toronto = await factory.AddMemberAsync("Grace Okonkwo");
        var client = factory.ClientFor(toronto, SeededRole.CityLead, SeededRole.EventLead);

        Assert.DoesNotContain("Halifax Builders Night", await client.GetStringAsync("/api/events"));
        Assert.DoesNotContain("Halifax Church", await client.GetStringAsync("/api/partners"));
        Assert.DoesNotContain("Halifax notes", await client.GetStringAsync("/api/notes"));
        Assert.DoesNotContain("Halifax team", await client.GetStringAsync("/api/workspaces"));
        Assert.DoesNotContain("Halifax only", await client.GetStringAsync("/api/announcements"));
        Assert.DoesNotContain("Hannah Halifax", await client.GetStringAsync("/api/team"));
        Assert.DoesNotContain("Halifax", await client.GetStringAsync("/api/search?q=Halifax"));
    }

    [Fact]
    public async Task Records_carry_their_org_and_the_org_lead_reads_them()
    {
        var (halifax, ids) = await HalifaxWithRecordsAsync();
        var orgLead = await factory.AddMemberOfAsync(halifax, "Olivia Halifax", SeededRole.OrgLead);

        var events = await factory.ClientFor(orgLead).GetFromJsonAsync<JsonElement>("/api/events");

        var row = events.GetProperty("events").EnumerateArray().Single(e => e.GetProperty("id").GetGuid() == ids.Event);
        Assert.Equal(halifax.Slug, row.GetProperty("organization").GetProperty("slug").GetString());
        Assert.Equal(HttpStatusCode.OK, (await factory.ClientFor(orgLead).GetAsync($"/api/partners/{ids.Partner}")).StatusCode);
    }

    [Fact]
    public async Task An_x_org_header_for_an_uncovered_or_unknown_org_finds_nothing_and_creates_nothing()
    {
        var (halifax, _) = await HalifaxWithRecordsAsync();
        var toronto = await factory.AddMemberAsync("Grace Okonkwo");

        foreach (var slug in new[] { halifax.Slug, "no-such-org" })
        {
            var client = factory.ClientFor(toronto, slug, SeededRole.CityLead);
            Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync("/api/events")).StatusCode);
            Assert.Equal(HttpStatusCode.NotFound, (await client.PostAsJsonAsync("/api/partners", PartnerClientsBody())).StatusCode);
        }
    }

    [Fact]
    public async Task Creating_without_naming_an_org_when_the_caller_may_create_in_several_is_400()
    {
        var halifax = await factory.AddOrgAsync("FaithTech Halifax");
        var lead = await factory.AddMemberAsync("Grace Okonkwo", p => p.AddRole(SeededRole.CityLead, Guid.Empty, DateTime.UtcNow));
        await factory.WithDbAsync(async db =>
        {
            await SeededRoles.JoinAsync(db, lead.ProfileId, halifax.Id);
            await SeededRoles.GrantAsync(db, lead.ProfileId, SeededRole.CityLead, halifax.Id);
            return 0;
        });

        var ambiguous = await factory.ClientFor(lead).PostAsJsonAsync("/api/partners", PartnerClientsBody());
        var named = await factory.ClientFor(lead, halifax.Slug).PostAsJsonAsync("/api/partners", PartnerClientsBody());

        Assert.Equal(HttpStatusCode.BadRequest, ambiguous.StatusCode);
        Assert.Contains("Choose an organization.", await ambiguous.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.Created, named.StatusCode);
        Assert.Equal(halifax.Slug, (await named.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("organization").GetProperty("slug").GetString());
    }
}
