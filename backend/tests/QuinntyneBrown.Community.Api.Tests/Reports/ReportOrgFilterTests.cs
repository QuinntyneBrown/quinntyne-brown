// Traces to: L2-150
using System.Net;
using QuinntyneBrown.Community.Api.Tests.Organizations;

namespace QuinntyneBrown.Community.Api.Tests.Reports;

/// <summary>Reports cover the orgs where the caller holds reports.view, with an org filter for them (L2-150).</summary>
public class ReportOrgFilterTests
{
    [Fact]
    public async Task Staff_see_every_faithtech_city_org_and_may_narrow_to_one()
    {
        await using var factory = await ReportClients.NewFactoryAsync();
        var ottawa = await factory.AddOrgAsync("FaithTech Ottawa");
        await factory.AddReportEventAsync("Toronto gathering", ReportClients.Now.AddDays(-3));
        await factory.AddReportEventAsync("Ottawa gathering", ReportClients.Now.AddDays(-2), "Ottawa", organizationId: ottawa.Id);
        var staff = await factory.StaffAsync();

        var all = await staff.ReportAsync();
        var one = await staff.ReportAsync($"?organization={ottawa.Id}");

        Assert.Contains(all.Organizations, o => o.Id == ottawa.Id);
        Assert.Contains(all.Organizations, o => o.Id == OrgClients.Toronto.Id);
        Assert.DoesNotContain(all.Organizations, o => o.Id == OrgClients.Shelfie.Id);
        Assert.Equal(["Ottawa gathering", "Toronto gathering"], all.Events.Select(e => e.Title).Order());
        Assert.Equal(["Ottawa gathering"], one.Events.Select(e => e.Title));
    }

    [Fact]
    public async Task An_org_outside_the_callers_reports_is_not_found()
    {
        await using var factory = await ReportClients.NewFactoryAsync();
        var staff = await factory.StaffAsync();

        var response = await staff.GetAsync($"/api/reports?organization={OrgClients.Shelfie.Id}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
