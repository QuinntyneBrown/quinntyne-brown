# Estimates: ideas

| Design | Effort | Complete | Visual conformance |
|---|---|---|---|
| submit | 9 days | 95% | A- |
| idea-form | 2 days | 100% | A- |

Evidence: backend integration tests under `backend/tests/QuinntyneBrown.Community.Api.Tests/Ideas/` (Idea form defaults, save and audit, 404 for every other role; visitor submit, every field's validation and limits, optional answers ignored for visitors and for steps that are off; signed-in submit under the account's name; option validation; per-address and per-account rate limits; System Admin notification and email; submitter confirmation), `Platform/ServerAuthorizationTests.cs` (the explicit anonymous opt-in) and `Cli.Tests/SeedIdeaIntakeTests.cs`; the Playwright specs in `e2e/tests/ideas/` (signed out and signed in, every switch combination, invalid, Review and Edit, busy, error, 429, server refusal, success, Submit another, the bell, the Idea form, each screen checked with axe); unit specs for `ft-wizard`, `ft-wizard-card`, `ft-review-section`, `ft-preview-card`, the tile radios, `planIdeaSteps`, `IdeaFormPage` and `HttpIdeasService`. Visual conformance is graded from `docs/videos/journeys/submit-an-idea/screenshots/`.

Not yet done:

- submit: the narrated Submit an app idea video is not recorded; its story and narration are written (`eng/videos/journeys/submit-an-idea.story.ts`), and recording needs `pwsh` and `speech.platform.bing.com`. The review sections use the stacked description list rather than the mock's two-column facts.
- Follow-up feature, not part of this estimate: a screen for leads or System Admins to browse, review and triage submitted ideas (L1-027 out of scope).
