// Traces to: L2-171, L2-172, L2-173, L2-177, L2-178, L2-179
using System.Net;
using System.Net.Http.Json;
using QuinntyneBrown.Community.Api.Tests.Profiles;
using QuinntyneBrown.Community.Domain.Ideas;
using QuinntyneBrown.Community.Domain.Notifications;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace QuinntyneBrown.Community.Api.Tests.Ideas;

/// <summary>A signed-in member submits under their own name and answers the optional steps that are on (L2-177 AC2/AC5).</summary>
public class SignedInSubmitTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    private async Task<(HttpClient Client, ProfileClients.Member Member, string Email)> SignedInAsync(string name = "Hannah Kim", params SeededRole[] roles)
    {
        var (client, member) = await factory.MemberAsync(name, roles);
        var email = await factory.WithDbAsync(db => db.Users.Where(u => u.Id == member.UserId).Select(u => u.Email!).SingleAsync());
        return (client, member, email);
    }

    private Task<Idea> StoredAsync(Guid id) => factory.WithDbAsync(db => db.Ideas.AsNoTracking().SingleAsync(i => i.Id == id));

    private async Task SetSwitchesAsync(bool askStage, bool askPeople) =>
        await factory.WithDbAsync(async db =>
        {
            (await db.IdeaIntakes.SingleAsync()).SetSteps(askStage, askPeople, Guid.Empty, DateTimeOffset.UtcNow);
            return await db.SaveChangesAsync();
        });

    // L2-177 AC2, L2-172, L2-173: both steps on (the default).
    [Fact]
    public async Task A_member_submits_under_their_own_name_with_both_optional_steps()
    {
        await SetSwitchesAsync(true, true);
        var (client, member, email) = await SignedInAsync();

        var response = await client.PostAsJsonAsync(IdeaClients.SubmitPath, IdeaBodies.WithOptionalSteps(b =>
        {
            b["name"] = "Someone Else";
            b["email"] = "someone@example.org";
        }));

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var submitted = await response.Content.ReadFromJsonAsync<IdeaBodies.Submitted>();
        Assert.Equal(("Hannah Kim", email), (submitted!.Name, submitted.Email));
        var idea = await StoredAsync(submitted.Id);
        Assert.Equal((member.ProfileId, "Hannah Kim", email), (idea.AuthorProfileId!.Value, idea.SubmitterName, idea.SubmitterEmail));
        Assert.Equal(("sketches", "both", "lead", "weekly"), (idea.Stage, idea.Platform, idea.Involvement, idea.Commitment));
        Assert.Equal(["Community", "Faith", "Housing", "Mental health", "Volunteering"], idea.Topics);
        Assert.Equal(["Product Engineer", "Designer", "Domain expert"], idea.Skills);
    }

    // L2-177 AC5, L2-171 AC4: a step that is off is not stored.
    [Fact]
    public async Task Answers_to_a_step_that_is_off_are_ignored()
    {
        await SetSwitchesAsync(false, true);
        var (client, _, _) = await SignedInAsync();

        var response = await client.PostAsJsonAsync(IdeaClients.SubmitPath, IdeaBodies.WithOptionalSteps(b => b["stage"] = "not-a-stage"));

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var idea = await StoredAsync((await response.Content.ReadFromJsonAsync<IdeaBodies.Submitted>())!.Id);
        Assert.Equal((null, null), (idea.Stage, idea.Platform));
        Assert.Empty(idea.Topics);
        Assert.Equal("lead", idea.Involvement);
        await SetSwitchesAsync(true, true);
    }

    // L2-172 AC4, L2-173 AC3: every optional answer may be left out.
    [Fact]
    public async Task Optional_steps_may_be_left_empty()
    {
        await SetSwitchesAsync(true, true);
        var (client, _, _) = await SignedInAsync();

        var response = await client.PostAsJsonAsync(IdeaClients.SubmitPath, IdeaBodies.Visitor(b => { b.Remove("name"); b.Remove("email"); }));

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    // L2-177 AC4, L2-172 AC2
    [Theory]
    [InlineData("stage", "launched")]
    [InlineData("platform", "watch")]
    [InlineData("involvement", "fund")]
    [InlineData("commitment", "daily")]
    [InlineData("topics", "six")]
    [InlineData("topics", "unknown")]
    [InlineData("skills", "unknown")]
    public async Task Optional_answers_outside_their_options_are_refused(string field, string value)
    {
        await SetSwitchesAsync(true, true);
        var (client, _, _) = await SignedInAsync();
        object? answer = (field, value) switch
        {
            ("topics", "six") => new[] { "Accessibility", "AI", "Community", "Education", "Faith", "Housing" },
            ("topics", _) or ("skills", _) => new[] { "Juggling" },
            _ => value,
        };

        var response = await client.PostAsJsonAsync(IdeaClients.SubmitPath, IdeaBodies.WithOptionalSteps(b => b[field] = answer));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.True((await response.Content.ReadFromJsonAsync<ValidationProblemDetails>())!.Errors.ContainsKey(field));
    }

    // L2-179 AC3
    [Fact]
    public async Task A_system_admin_who_submits_is_notified_too()
    {
        var (client, member, _) = await SignedInAsync("Priya Shah", SeededRole.SystemAdmin);

        var response = await client.PostAsJsonAsync(IdeaClients.SubmitPath, IdeaBodies.Visitor(b => b["title"] = "PrayerWall"));

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.True(await factory.WithDbAsync(db => db.Notifications.AnyAsync(n =>
            n.RecipientId == member.ProfileId && n.Kind == NotificationKind.IdeaSubmitted && n.Title == "New app idea: PrayerWall")));
    }

    // L2-178 AC2: the limit follows the account, not the shared address.
    [Fact]
    public async Task A_signed_in_members_limit_is_their_own()
    {
        await using var limited = factory.WithWebHostBuilder(b =>
        {
            b.UseSetting("RateLimits:IdeaSubmitPerHour", "1");
            b.ConfigureServices(s => s.AddAuthentication(TestAuthHandler.SchemeName)
                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(TestAuthHandler.SchemeName, null));
        });
        HttpClient ClientFor(ProfileClients.Member member)
        {
            var client = limited.CreateClient();
            client.DefaultRequestHeaders.Add(TestAuthHandler.Header, $"{member.UserId};");
            return client;
        }

        var first = ClientFor(await factory.AddMemberAsync("First Member"));
        var second = ClientFor(await factory.AddMemberAsync("Second Member"));
        var body = IdeaBodies.Visitor();

        var statuses = new[]
        {
            (await first.PostAsJsonAsync(IdeaClients.SubmitPath, body)).StatusCode,
            (await first.PostAsJsonAsync(IdeaClients.SubmitPath, body)).StatusCode,
            (await second.PostAsJsonAsync(IdeaClients.SubmitPath, body)).StatusCode,
        };

        Assert.Equal([HttpStatusCode.Created, HttpStatusCode.TooManyRequests, HttpStatusCode.Created], statuses);
    }
}
