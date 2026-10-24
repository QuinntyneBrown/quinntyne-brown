// Traces to: L2-177, L2-169, L2-170, L2-175
using System.Net;
using System.Net.Http.Json;
using QuinntyneBrown.Community.Domain.Ideas;
using QuinntyneBrown.Community.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Api.Tests.Ideas;

/// <summary>A visitor who is not signed in submits an idea to the platform intake (L2-177, ADR 0044).</summary>
public class SubmitIdeaTests(CommunityApiFactory factory) : IClassFixture<CommunityApiFactory>
{
    // L2-177 AC1, AC3
    [Fact]
    public async Task A_visitor_submits_an_idea_and_it_is_stored_under_the_platform_intake()
    {
        var response = await factory.CreateClient().PostAsJsonAsync(IdeaClients.SubmitPath, IdeaBodies.Visitor());

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var submitted = await response.Content.ReadFromJsonAsync<IdeaBodies.Submitted>();
        Assert.Equal(("ShiftShare", "Hannah Kim", "hannah.kim@example.org"), (submitted!.Title, submitted.Name, submitted.Email));
        var idea = await factory.WithDbAsync(db => db.Ideas.AsNoTracking().SingleAsync(i => i.Id == submitted.Id));
        Assert.Equal(HierarchySeed.TorontoId, idea.OrganizationId);
        Assert.Null(idea.AuthorProfileId);
        Assert.Equal(IdeaStatus.New, idea.Status);
        Assert.Equal(factory.Time.GetUtcNow(), idea.SubmittedAt);
        Assert.Equal(("nonprofits", "Hannah Kim", "hannah.kim@example.org"), (idea.Audience, idea.SubmitterName, idea.SubmitterEmail));
        Assert.StartsWith("Coordinators post open shifts.", idea.Solution);
    }

    // L2-177 AC5: a visitor never answers the optional steps, whatever they send.
    [Fact]
    public async Task A_visitors_optional_answers_are_ignored()
    {
        var response = await factory.CreateClient().PostAsJsonAsync(IdeaClients.SubmitPath, IdeaBodies.WithOptionalSteps());

        var submitted = await response.Content.ReadFromJsonAsync<IdeaBodies.Submitted>();
        var idea = await factory.WithDbAsync(db => db.Ideas.AsNoTracking().SingleAsync(i => i.Id == submitted!.Id));
        Assert.Equal((null, null, null, null), (idea.Stage, idea.Platform, idea.Involvement, idea.Commitment));
        Assert.Empty(idea.Topics);
        Assert.Empty(idea.Skills);
    }

    // L2-177 AC3, L2-175 AC3/AC4
    [Theory]
    [InlineData("name", null, "Enter your name")]
    [InlineData("name", "   ", "Enter your name")]
    [InlineData("email", null, "Enter an email like name@example.org")]
    [InlineData("email", "hannah.kim@example", "Enter an email like name@example.org")]
    public async Task A_visitor_must_give_a_name_and_a_valid_email(string field, string? value, string message)
    {
        await AssertRefusedAsync(IdeaBodies.Visitor(b => b[field] = value), field, message);
    }

    // L2-177 AC4, L2-169 AC2, L2-170 AC2
    [Theory]
    [InlineData("problem", "Shelters need volunteers.", "Add a little more detail, at least 30 characters")]
    [InlineData("problem", null, "Add a little more detail, at least 30 characters")]
    [InlineData("audience", null, "Choose who feels this problem most")]
    [InlineData("audience", "everyone", "Choose who feels this problem most")]
    [InlineData("title", "", "Name your idea")]
    [InlineData("pitch", null, "Add a one-line pitch")]
    [InlineData("solution", "  ", "Say how it would work")]
    public async Task Missing_or_invalid_answers_are_refused(string field, string? value, string message)
    {
        await AssertRefusedAsync(IdeaBodies.Visitor(b => b[field] = value), field, message);
    }

    // L2-177 AC4: the character limits the mocks show.
    [Theory]
    [InlineData("problem", 601)]
    [InlineData("title", 61)]
    [InlineData("pitch", 141)]
    [InlineData("solution", 1001)]
    [InlineData("name", 101)]
    public async Task Answers_over_their_limit_are_refused(string field, int length)
    {
        var response = await factory.CreateClient().PostAsJsonAsync(IdeaClients.SubmitPath, IdeaBodies.Visitor(b => b[field] = new string('a', length)));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.True((await response.Content.ReadFromJsonAsync<ValidationProblemDetails>())!.Errors.ContainsKey(field));
    }

    [Fact]
    public async Task Answers_at_their_limit_are_accepted()
    {
        var body = IdeaBodies.Visitor(b =>
        {
            b["problem"] = new string('p', 600);
            b["title"] = new string('t', 60);
            b["pitch"] = new string('i', 140);
            b["solution"] = new string('s', 1000);
            b["name"] = new string('n', 100);
        });

        var response = await factory.CreateClient().PostAsJsonAsync(IdeaClients.SubmitPath, body);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    private async Task AssertRefusedAsync(Dictionary<string, object?> body, string field, string message)
    {
        var before = await factory.WithDbAsync(db => db.Ideas.CountAsync());

        var response = await factory.CreateClient().PostAsJsonAsync(IdeaClients.SubmitPath, body);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.Equal([message], problem!.Errors[field]);
        Assert.Equal(before, await factory.WithDbAsync(db => db.Ideas.CountAsync()));
    }
}
