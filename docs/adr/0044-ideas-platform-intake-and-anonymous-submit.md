# 0044. Ideas: one platform intake and an anonymous, rate-limited submit

- Status: Accepted
- Date: 2026-10-24
- Requirements: L1-027, L2-171, L2-177, L2-178, L2-181
- Designs: `docs/detailed-designs/ideas/submit`, `docs/detailed-designs/ideas/idea-form`
- Prompt: `docs/prompts/ideas-prompt.md` (decision 3)

## Context

Every record belongs to exactly one organization (L1-025, ADR 0034), but an idea is submitted to the platform, not to one city or startup, and often by someone who belongs to no org or is not signed in at all. Until now the only content anonymous visitors could reach was public events (`AGENTS.md`, "Public events are the only content anonymous visitors see"); the only anonymous write was the guest RSVP, and the signed webhook (ADR 0042).

## Decision

- **One platform intake.** A singleton `IdeaIntake` row (fixed id) owns every idea and holds the two Idea form switches, `AskStage` and `AskPeople`, both on by default. Its `OrganizationId` is the portfolio's root organization: the first organization the seed creates (FaithTech Toronto, `HierarchySeed.TorontoId`). The seed creates the row idempotently; moving the intake is a data change, not a code change. Every `Idea` carries the intake's `OrganizationId`, so ideas obey the "one org per record" rule and the follow-up triage feature can scope them with the access resolver.
- **No Org Type feature flag.** Ideas are a platform feature, so there is no `ideas` entry in `Features.Switchable`; the two switches are the only configuration.
- **System Admin only, everything else 404.** Reading or changing the switches (`GET`/`PUT /api/admin/ideas/settings`) checks `CallerAccess.IsSystemAdmin` in the handler and answers 404 to anyone else, as anything outside a caller's coverage does. Changing them is audited as `ideas.formChanged` with the before and after values. Signed-in members read only the two booleans the wizard needs from `GET /api/ideas/form`.
- **The anonymous exception.** `POST /api/ideas` is opted into anonymous access explicitly with `AllowAnonymous()`, and is the only anonymous Ideas endpoint. This is a deliberate exception to "anonymous sees only public events": it lets a visitor *write* an idea and returns only that idea's id, title, name and email; it never reads or lists anything. The handler validates every field on the server (lengths, the fixed option lists, at most five topics) and requires a name and email from a caller who is not signed in. When the caller is signed in, the idea is linked to their profile and its name and email come from the account, never the body. Fields of a step the switches turn off, and every optional field from a caller who is not signed in, are ignored and not stored.
- **Rate limit.** The named policy `idea-submit` is a fixed one-hour window of `RateLimits:IdeaSubmitPerHour` (default 10), partitioned by the signed-in user's id, otherwise by the caller's IP address, answering 429. The global per-user or per-address limiter still applies.

## Consequences

- Ideas are visible to no one through the API yet; System Admin learns of each one by notification and email (ADR 0045). Browsing and triage is a follow-up feature that will read `Ideas` by the intake's org.
- `AGENTS.md` names the submit endpoint as an explicit anonymous opt-in next to public events.
- A deployment that forgets the Cli seed has no intake row; submitting then answers 404 and the Idea form is empty, which the seed fixes.
