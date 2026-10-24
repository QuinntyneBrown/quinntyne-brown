using System.Text;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Notifications;
using QuinntyneBrown.Community.Domain.Ideas;

namespace QuinntyneBrown.Community.Application.Ideas;

/// <summary>The two emails every idea sends (L2-179 AC2, L2-180, ADR 0045), in plain text with the options' labels.</summary>
public static class IdeaEmails
{
    /// <summary>To each System Admin: the whole idea. The notification publisher appends the link to the Idea form.</summary>
    public static NotificationEmail ForAdmin(Idea idea)
    {
        var body = new StringBuilder()
            .AppendLine($"{idea.SubmitterName} ({idea.SubmitterEmail}), {(idea.AuthorProfileId is null ? "not signed in" : "signed in")}, submitted an app idea.")
            .AppendLine()
            .AppendLine("The problem")
            .AppendLine(idea.Problem)
            .AppendLine($"Who feels it: {Label(IdeaOptions.Audiences, idea.Audience)}")
            .AppendLine()
            .AppendLine("The idea")
            .AppendLine($"Name: {idea.Title}")
            .AppendLine($"Pitch: {idea.Pitch}")
            .AppendLine("How it works:")
            .AppendLine(idea.Solution);
        if (idea.Stage is not null || idea.Platform is not null || idea.Topics.Count > 0)
        {
            body.AppendLine()
                .AppendLine("How far along is it?")
                .AppendLine($"Stage: {Label(IdeaOptions.Stages, idea.Stage)}")
                .AppendLine($"Where it would run: {Label(IdeaOptions.Platforms, idea.Platform)}")
                .AppendLine($"Topics: {List(idea.Topics)}");
        }

        if (idea.Skills.Count > 0 || idea.Involvement is not null || idea.Commitment is not null)
        {
            body.AppendLine()
                .AppendLine("Who do they need?")
                .AppendLine($"Skills: {List(idea.Skills)}")
                .AppendLine($"Involvement: {Label(IdeaOptions.Involvements, idea.Involvement)}")
                .AppendLine($"Time: {Label(IdeaOptions.Commitments, idea.Commitment)}");
        }

        return new NotificationEmail($"New app idea: {idea.Title}", body.ToString().TrimEnd());
    }

    /// <summary>To the submitter: thanks, the title and pitch, and the promise the success page makes. No links.</summary>
    public static EmailMessage Confirmation(Idea idea)
    {
        var firstName = idea.SubmitterName.Split(' ', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? idea.SubmitterName;
        var body = $"""
            Thanks, {firstName}.

            Your app idea is in:

            {idea.Title}: {idea.Pitch}

            We’ll email you if we have questions.
            """;
        return new EmailMessage(idea.SubmitterEmail, $"We got your idea: {idea.Title}", body);
    }

    private static string Label(IReadOnlyDictionary<string, string> options, string? key) =>
        key is null ? "Not answered" : options.GetValueOrDefault(key, key);

    private static string List(IReadOnlyList<string> values) => values.Count == 0 ? "Not answered" : string.Join(", ", values);
}
