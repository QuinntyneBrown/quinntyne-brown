// Traces to: L2-149
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using QuinntyneBrown.Community.Api.Tests.Events;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Domain.Events;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Organizations;

/// <summary>Org Leads and the Portfolio Lead brand their org; public event pages carry it (L2-149).</summary>
public class BrandingTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private static string Branding(Guid orgId) => $"/api/organizations/{orgId}/branding";

    public sealed record BrandingDto(string DisplayName, string? LogoUrl, string? Accent, string? AccentForeground, double? ContrastRatio);

    private sealed record Access(AccessOrg[] Orgs);

    private sealed record AccessOrg(string Slug, BrandingDto Branding);

    // AC4: a passing accent is saved with its foreground and shown in the access document.
    [Fact]
    public async Task An_org_lead_saves_a_display_name_and_an_accent_with_enough_contrast()
    {
        var org = await factory.AddOrgAsync("FaithTech Ottawa");
        var lead = await factory.AddMemberOfAsync(org, "Olivia Grant", SeededRole.OrgLead);
        var client = factory.ClientFor(lead, org.Slug);

        var response = await client.PutAsJsonAsync(Branding(org.Id), new { displayName = "FaithTech Ottawa", accent = "#0b5394" });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var saved = (await response.Content.ReadFromJsonAsync<BrandingDto>())!;
        Assert.Equal(("FaithTech Ottawa", "#0b5394", "#ffffff"), (saved.DisplayName, saved.Accent, saved.AccentForeground));
        Assert.True(saved.ContrastRatio >= 4.5);
        var access = (await client.GetFromJsonAsync<Access>("/api/me/access"))!;
        Assert.Equal("#0b5394", access.Orgs.Single(o => o.Slug == org.Slug).Branding.Accent);
    }

    // AC5: an accent that fails with both white and #111111 is refused with the measured ratio.
    [Fact]
    public async Task An_accent_without_enough_contrast_is_refused_with_its_ratio()
    {
        var org = await factory.AddOrgAsync("FaithTech Halifax");
        var lead = await factory.AddMemberOfAsync(org, "Hal Lead", SeededRole.OrgLead);

        var response = await factory.ClientFor(lead, org.Slug).PutAsJsonAsync(Branding(org.Id), new { displayName = "FaithTech Halifax", accent = "#777777" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(
            "This colour doesn't have enough contrast. Choose a darker or lighter shade.",
            problem.GetProperty("errors").GetProperty("accent")[0].GetString());
        Assert.Equal(4.47, problem.GetProperty("contrastRatio").GetDouble());
        Assert.Null(await factory.WithDbAsync(db => db.Organizations.Where(o => o.Id == org.Id).Select(o => o.AccentColour).SingleAsync()));
    }

    [Fact]
    public async Task A_colour_that_is_not_rrggbb_and_an_empty_display_name_are_refused()
    {
        var org = await factory.AddOrgAsync("FaithTech Regina");
        var lead = await factory.AddMemberOfAsync(org, "Reg Lead", SeededRole.OrgLead);

        var response = await factory.ClientFor(lead, org.Slug).PutAsJsonAsync(Branding(org.Id), new { displayName = " ", accent = "red" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = (await response.Content.ReadFromJsonAsync<ValidationProblemDetails>())!;
        Assert.Equal("Enter a colour as #rrggbb.", problem.Errors["accent"].Single());
        Assert.True(problem.Errors.ContainsKey("displayName"));
    }

    [Fact]
    public async Task A_member_without_org_lead_is_refused_and_another_org_is_not_found()
    {
        var org = await factory.AddOrgAsync("FaithTech Calgary");
        var ruth = await factory.AddMemberOfAsync(org, "Ruth Alvarez", SeededRole.Volunteer);
        var body = new { displayName = "Calgary", accent = "#0b5394" };

        var forbidden = await factory.ClientFor(ruth, org.Slug).PutAsJsonAsync(Branding(org.Id), body);
        var other = await factory.ClientFor(ruth, org.Slug).PutAsJsonAsync(Branding(OrgClients.Shelfie.Id), body);

        Assert.Equal(HttpStatusCode.Forbidden, forbidden.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, other.StatusCode);
    }

    [Fact]
    public async Task A_portfolio_lead_brands_any_org_and_the_change_is_audited()
    {
        var org = await factory.AddOrgAsync("FaithTech Victoria");
        var quinn = await factory.AddMemberAsync("Quinn Lead", p => p.AddRole(SeededRole.PortfolioLead, Guid.Empty, DateTime.UtcNow));

        var response = await factory.ClientFor(quinn, org.Slug).PutAsJsonAsync(Branding(org.Id), new { displayName = "Victoria", accent = "#ffd966" });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("#111111", (await response.Content.ReadFromJsonAsync<BrandingDto>())!.AccentForeground);
        Assert.True(await factory.WithDbAsync(db => db.AuditEntries.AnyAsync(e => e.Action == "org.branding" && e.TargetId == org.Id.ToString())));
    }

    [Fact]
    public async Task A_logo_is_stored_and_shown_and_a_file_that_is_not_an_image_or_too_big_is_refused()
    {
        var org = await factory.AddOrgAsync("FaithTech Winnipeg");
        var lead = await factory.AddMemberOfAsync(org, "Win Lead", SeededRole.OrgLead);
        var client = factory.ClientFor(lead, org.Slug);

        var saved = await client.PutAsync($"{Branding(org.Id)}/logo", Logo(TestImages.Png(600, 300), "logo.png"));
        var text = await client.PutAsync($"{Branding(org.Id)}/logo", Logo("not an image"u8.ToArray(), "logo.png"));
        var big = await client.PutAsync($"{Branding(org.Id)}/logo", Logo(new byte[(2 * 1024 * 1024) + 1], "logo.png"));

        Assert.Equal(HttpStatusCode.OK, saved.StatusCode);
        Assert.NotNull((await saved.Content.ReadFromJsonAsync<BrandingDto>())!.LogoUrl);
        Assert.Equal(HttpStatusCode.BadRequest, text.StatusCode);
        Assert.True((await text.Content.ReadFromJsonAsync<ValidationProblemDetails>())!.Errors.ContainsKey("logo"));
        Assert.Equal(HttpStatusCode.BadRequest, big.StatusCode);

        var removed = await client.DeleteAsync($"{Branding(org.Id)}/logo");
        Assert.Equal(HttpStatusCode.NoContent, removed.StatusCode);
        Assert.Null(await factory.WithDbAsync(db => db.Organizations.Where(o => o.Id == org.Id).Select(o => o.LogoBlobName).SingleAsync()));
    }

    // AC1: the public event names its org with the branding the public page applies.
    [Fact]
    public async Task A_public_event_carries_its_orgs_slug_aliases_and_branding()
    {
        var org = await factory.AddOrgAsync("FaithTech Montreal");
        var lead = await factory.AddMemberOfAsync(org, "Mo Lead", SeededRole.OrgLead);
        await factory.ClientFor(lead, org.Slug).PutAsJsonAsync(Branding(org.Id), new { displayName = "FaithTech Montréal", accent = "#0b5394" });
        await factory.WithDbAsync(db =>
        {
            db.OrgSlugAliases.Add(new Domain.Organizations.OrgSlugAlias($"old-{org.Slug}", org.Id));
            return db.SaveChangesAsync();
        });
        var existing = await factory.AddEventAsync("Montréal Builders", TimeSpan.FromDays(7), visibility: EventVisibility.Public, organizationId: org.Id);

        var json = await factory.CreateClient().GetFromJsonAsync<JsonElement>($"/api/public/events/{existing.Id}");

        var organization = json.GetProperty("organization");
        Assert.Equal(org.Slug, organization.GetProperty("slug").GetString());
        Assert.Equal([$"old-{org.Slug}"], organization.GetProperty("aliases").EnumerateArray().Select(a => a.GetString()));
        Assert.Equal("FaithTech Montréal", organization.GetProperty("displayName").GetString());
        Assert.Equal("#0b5394", organization.GetProperty("accent").GetString());
        Assert.Equal("#ffffff", organization.GetProperty("accentForeground").GetString());
    }

    // AC7: an org with events off, or archived, has no public events.
    [Fact]
    public async Task A_public_event_of_an_org_with_events_off_or_archived_is_not_found()
    {
        var shelfie = await factory.AddEventAsync("Shelfie launch", TimeSpan.FromDays(7), visibility: EventVisibility.Public, organizationId: OrgClients.Shelfie.Id);
        var org = await factory.AddOrgAsync("FaithTech Quebec");
        var archived = await factory.AddEventAsync("Quebec night", TimeSpan.FromDays(7), visibility: EventVisibility.Public, organizationId: org.Id);
        await factory.WithDbAsync(async db =>
        {
            (await db.Organizations.SingleAsync(o => o.Id == org.Id)).Archive(DateTime.UtcNow);
            return await db.SaveChangesAsync();
        });

        var anonymous = factory.CreateClient();

        Assert.Equal(HttpStatusCode.NotFound, (await anonymous.GetAsync($"/api/public/events/{shelfie.Id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await anonymous.GetAsync($"/api/public/events/{archived.Id}")).StatusCode);
    }

    private static MultipartFormDataContent Logo(byte[] content, string fileName)
    {
        var file = new ByteArrayContent(content);
        file.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        return new MultipartFormDataContent { { file, "file", fileName } };
    }
}
