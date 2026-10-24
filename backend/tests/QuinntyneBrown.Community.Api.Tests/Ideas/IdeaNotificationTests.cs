// Traces to: L2-179, L2-180
using System.Net;
using System.Net.Http.Json;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Domain.Notifications;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Ideas;

/// <summary>Every idea tells each active System Admin and confirms to its submitter (L2-179, L2-180, ADR 0045).</summary>
public class IdeaNotificationTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private async Task<(ProfileClients.Member Member, string Email)> AdminAsync(string name, bool suspended = false)
    {
        var member = await factory.AddMemberAsync(name, p =>
        {
            p.AddRole(SeededRole.SystemAdmin, Guid.Empty, DateTime.UtcNow);
            if (suspended)
            {
                p.Suspend("Testing", DateTime.UtcNow);
            }
        });
        var email = await factory.WithDbAsync(db => db.Users.Where(u => u.Id == member.UserId).Select(u => u.Email!).SingleAsync());
        return (member, email);
    }

    private async Task<IdeaBodies.Submitted> SubmitAsync(Dictionary<string, object?> body)
    {
        var response = await factory.CreateClient().PostAsJsonAsync(IdeaClients.SubmitPath, body);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        return (await response.Content.ReadFromJsonAsync<IdeaBodies.Submitted>())!;
    }

    // L2-179 AC1
    [Fact]
    public async Task Each_active_system_admin_gets_the_in_app_notification()
    {
        var priya = await AdminAsync("Priya Shah");
        var suspended = await AdminAsync("Former Admin", suspended: true);

        await SubmitAsync(IdeaBodies.Visitor(b => b["title"] = "ShiftShare"));

        var notices = await factory.WithDbAsync(db => db.Notifications.AsNoTracking()
            .Where(n => n.Kind == NotificationKind.IdeaSubmitted)
            .ToListAsync());
        var notice = Assert.Single(notices, n => n.RecipientId == priya.Member.ProfileId);
        Assert.Equal(("New app idea: ShiftShare", "/admin/ideas", (Guid?)null), (notice.Title, notice.LinkPath, notice.OrganizationId));
        Assert.DoesNotContain(notices, n => n.RecipientId == suspended.Member.ProfileId);
    }

    // L2-179 AC2
    [Fact]
    public async Task Each_active_system_admin_is_emailed_the_whole_idea()
    {
        var priya = await AdminAsync("Priya Shah");
        var suspended = await AdminAsync("Former Admin", suspended: true);

        await SubmitAsync(IdeaBodies.Visitor(b => b["title"] = "LanternLine"));

        var email = Assert.Single(await factory.QueuedEmailsToAsync(priya.Email), m => m.Subject == "New app idea: LanternLine");
        Assert.Contains("Hannah Kim (hannah.kim@example.org), not signed in", email.Body);
        Assert.Contains("Shelter volunteers in Toronto still coordinate shifts", email.Body);
        Assert.Contains("Who feels it: Nonprofits and shelters", email.Body);
        Assert.Contains("Pitch: Shift sign-ups for shelter volunteers that fill gaps before they happen.", email.Body);
        Assert.Contains("Uncovered shifts ping the backup list 24 hours ahead.", email.Body);
        Assert.Empty(await factory.QueuedEmailsToAsync(suspended.Email));
    }

    // L2-180 AC1, AC2
    [Fact]
    public async Task The_submitter_gets_a_confirmation_email()
    {
        await SubmitAsync(IdeaBodies.Visitor(b =>
        {
            b["title"] = "HarvestShare";
            b["email"] = "ruth.alvarez@example.org";
            b["name"] = "Ruth Alvarez";
        }));

        var email = Assert.Single(await factory.QueuedEmailsToAsync("ruth.alvarez@example.org"));
        Assert.Equal("We got your idea: HarvestShare", email.Subject);
        Assert.Contains("Thanks, Ruth.", email.Body);
        Assert.Contains("HarvestShare: Shift sign-ups for shelter volunteers that fill gaps before they happen.", email.Body);
        Assert.Contains("We’ll email you if we have questions.", email.Body);
        Assert.DoesNotContain("http", email.Body);
        Assert.DoesNotContain("Hannah", email.Body);
    }
}
