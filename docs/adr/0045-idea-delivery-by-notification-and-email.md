# 0045. Ideas are delivered by notification and email

- Status: Accepted
- Date: 2026-10-24
- Requirements: L1-027, L2-176, L2-179, L2-180
- Designs: `docs/detailed-designs/ideas/submit`
- Prompt: `docs/prompts/ideas-prompt.md` (decision 2)

## Context

The mocks draw no screen to read submitted ideas, but someone has to see them, and the success page promises the submitter an email ("We’ll email you at … if we have questions").

## Decision

- **Reuse the existing pipeline.** The submit handler calls `INotificationPublisher.PublishAsync` with the new kind `NotificationKind.IdeaSubmitted` for every System Admin who is not suspended: an in-app notification "New app idea: {title}" linking to `/admin/ideas`, with no organization label (a platform notice), and an email whose subject repeats the title and whose body holds the whole idea (submitter, signed in or not, the problem, who feels it, name, pitch, how it works and any stored optional answers). The kind is stored as a string, so adding it needs no migration.
- **Confirmation to the submitter.** The handler queues "We got your idea: {title}" through `IEmailQueue` to the visitor's address or the member's account email, thanking them by first name and repeating the title and pitch. It carries no sign-in link and no one else's details.
- **One unit of work.** The idea, the notifications and both kinds of email are saved together (L2-028): if the save fails, nothing is sent, and the page shows its error with the answers kept.

## Consequences

- System Admins cannot turn these emails off; only announcement emails can be (L2-028 AC3).
- The notification links to the Idea form because no ideas list exists; the triage feature will change the link.
