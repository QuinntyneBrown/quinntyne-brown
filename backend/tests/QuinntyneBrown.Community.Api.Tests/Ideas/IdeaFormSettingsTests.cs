// Traces to: L2-181
using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Ideas;

/// <summary>Both switches are on until a System Admin turns them off (L2-181 AC1).</summary>
public class IdeaFormDefaultsTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    // AC1
    [Fact]
    public async Task A_system_admin_reads_both_switches_on_by_default()
    {
        var admin = await factory.SignedInAsync(SeededRole.SystemAdmin);

        var settings = await admin.GetFromJsonAsync<IdeaClients.Settings>(IdeaClients.SettingsPath);

        Assert.Equal((true, true), (settings!.AskStage, settings.AskPeople));
    }

    // AC4
    [Fact]
    public async Task A_signed_in_member_reads_only_the_two_switches_and_a_visitor_gets_401()
    {
        var member = await factory.SignedInAsync(SeededRole.Volunteer);

        var form = await member.GetFromJsonAsync<IdeaClients.Form>(IdeaClients.FormPath);
        var anonymous = await factory.CreateClient().GetAsync(IdeaClients.FormPath);

        Assert.Equal((true, true), (form!.AskStage, form.AskPeople));
        Assert.Equal(HttpStatusCode.Unauthorized, anonymous.StatusCode);
    }
}

/// <summary>A System Admin saves the switches; the save is audited (L2-181 AC2) and the wizard follows it (L2-171 AC4).</summary>
public class IdeaFormSaveTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    // AC2; L2-171 AC4
    [Fact]
    public async Task A_system_admin_saves_the_switches_and_the_change_is_audited()
    {
        var admin = await factory.SignedInAsync(SeededRole.SystemAdmin);

        var response = await admin.PutAsJsonAsync(IdeaClients.SettingsPath, new { askStage = true, askPeople = false });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var saved = await admin.GetFromJsonAsync<IdeaClients.Settings>(IdeaClients.SettingsPath);
        Assert.Equal((true, false), (saved!.AskStage, saved.AskPeople));
        Assert.NotNull(saved.UpdatedAt);
        var member = await factory.SignedInAsync(SeededRole.Volunteer);
        var form = await member.GetFromJsonAsync<IdeaClients.Form>(IdeaClients.FormPath);
        Assert.Equal((true, false), (form!.AskStage, form.AskPeople));
        var entry = await factory.WithDbAsync(db => db.AuditEntries.AsNoTracking().SingleAsync(e => e.Action == "ideas.formChanged"));
        Assert.Contains("\"AskPeople\":true", entry.BeforeJson);
        Assert.Contains("\"AskPeople\":false", entry.AfterJson);
        Assert.Equal("IdeaIntake", entry.TargetType);
    }

    [Fact]
    public async Task A_save_without_both_values_is_refused()
    {
        var admin = await factory.SignedInAsync(SeededRole.SystemAdmin);

        var response = await admin.PutAsJsonAsync(IdeaClients.SettingsPath, new { askStage = false });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}

/// <summary>Anyone but System Admin is told the Idea form does not exist (L2-181 AC3).</summary>
public class IdeaFormAccessTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    // AC3
    [Theory]
    [InlineData(SeededRole.Volunteer)]
    [InlineData(SeededRole.CityLead)]
    [InlineData(SeededRole.OrgLead)]
    [InlineData(SeededRole.PortfolioLead)]
    [InlineData(SeededRole.Staff)]
    [InlineData(SeededRole.Portfolio)]
    public async Task Everyone_but_system_admin_gets_404(SeededRole role)
    {
        var client = await factory.SignedInAsync(role);

        var read = await client.GetAsync(IdeaClients.SettingsPath);
        var save = await client.PutAsJsonAsync(IdeaClients.SettingsPath, new { askStage = false, askPeople = false });

        Assert.Equal(HttpStatusCode.NotFound, read.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, save.StatusCode);
        var form = await (await factory.SignedInAsync(SeededRole.Volunteer)).GetFromJsonAsync<IdeaClients.Form>(IdeaClients.FormPath);
        Assert.Equal((true, true), (form!.AskStage, form.AskPeople));
    }

    [Fact]
    public async Task A_visitor_gets_401_from_the_settings_endpoints()
    {
        var read = await factory.CreateClient().GetAsync(IdeaClients.SettingsPath);

        Assert.Equal(HttpStatusCode.Unauthorized, read.StatusCode);
    }
}
