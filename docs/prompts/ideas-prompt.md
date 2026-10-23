# Feature: Finish the Ideas feature (Submit an idea)

## Goal

Build, end to end, **Ideas**: a short wizard where anyone, signed in or not, submits an app idea to the
community, plus a System Admin page that switches two optional steps on or off. Nothing exists yet for this
feature except mocks and the design system: no requirements, detailed design, ADR, estimate or code. **The mocks
are the source of the requirements.** Draft the requirements largely, if not solely, from them.

The mocks (read every state of each, light and dark, phone, tablet and desktop):

- `docs/mocks/pages/submit-idea/`: `default`, `invalid`, `idea`, `review`, `busy`, `error`, `success` (signed out,
  three steps: The problem, Your idea, Review) and `signed-in`, `idea-signed-in`, `shape-signed-in`,
  `people-signed-in`, `review-signed-in` (signed in, with the optional "How far along is it?" and "Who do you
  need?" steps and a live preview).
- `docs/mocks/pages/idea-settings/`: `default`, `saved` (route `/admin/ideas`, System Admin only, two switches).
- Design system: the Wizard page (`docs/design-system/components/wizard.html`) and the choice tiles, public top
  bar, settings-list switch and live-preview card sections already exist. No new component is expected.

What users get:

- A public **Submit an app idea** page. A visitor describes the problem and who feels it, names the idea with a
  one-line pitch and how it works, reviews, and submits. A signed-in member does the same with their profile
  prefilled and, depending on the admin's switches, also answers "How far along is it?" (stage, platform, topics)
  and "Who do you need?" (skills, involvement, time). A live preview shows the idea as it takes shape.
- A confirmation ("Your idea is in") that promises an email, and a **Submit another idea** action.
- A System Admin **Idea form** page with two switches that turn the optional steps on or off.

## Agreed decisions (binding; record each in the requirements and an ADR, do not reopen)

1. **Scope is what the mocks draw.** No screen for leads to browse, review or triage ideas. Name that as a
   follow-up feature in the requirements and the estimate. Submissions are stored so it can list them later.
2. **Delivery.** Every submission notifies System Admin in-app and by email (the full idea in the email) and
   sends the submitter the confirmation email the success page promises. Reuse the existing notification and
   email pipeline; add a `IdeaSubmitted` notification type.
3. **Organization and access.** One platform intake owns every idea, in the portfolio's root organization. The
   anonymous submit endpoint is opted into explicitly, rate limited and validated on the server (ADR for the
   exception to "anonymous sees only public events"). When the caller is signed in, link the idea to their
   profile. The feature has no Org Type feature flag; the two switches are the only configuration. Reading the
   Idea form settings and changing them is System Admin only; anyone else gets 404.
4. **Signed-out identity comes from the mocks.** Read every signed-out state and derive what a visitor must
   give. Where the mocks leave it undecided (for example name and email on Review), add the missing field to the
   mock first and log it as a decision. Never guess in code.
5. **Fix mock drift first.** The signed-in Review step says "3 of 3" while "Where it stands" says "3 of 5", and
   the step order is undefined when an optional step is off. Correct the mocks, then write the rule as an
   acceptance criterion: a signed-in member sees The problem, Your idea, each enabled optional step in order,
   then Review; the rail, the "N of M" label and the progress bar always agree with the enabled steps. A signed-out
   visitor never sees the optional steps, whatever the switches say.
6. **Drafts.** The mocks do not draw resuming a saved draft. Do not build one; keep answers in the page while it
   is open and say so in the requirements.

## Finish the whole feature in one run. Do not stop. (CRITICAL)

- You are authorised to take this feature all the way: requirements, mock fixes, detailed design, estimate, then
  incremental ATDD implementation of every slice, verification, and a pull request.
- Do not pause between phases or slices for approval or wait for "continue". A plan, scaffold, partial
  implementation or list of next steps is not done.
- Keep a progress checklist across context summaries. Fix failed commands at their root cause; never weaken
  tests or silently skip checks.
- Only stop for a genuine external blocker (missing credentials, a repository-layout change beyond the new
  `ideas` feature folders already implied by `AGENTS.md`). Finish all independent work and report the blocker
  precisely.

## Rules (read first, binding)

- Read `AGENTS.md` and every ADR in `docs/adr/`. Preserve the mandated layout and dependency directions. The
  feature is named `ideas` everywhere the layout requires one name (`Domain/Ideas/`, `Application/Ideas/`,
  `frontend/projects/ideas/`, `docs/detailed-designs/ideas/`, `docs/estimates/ideas.md`, `e2e/tests/ideas/`).
  Adding the `ideas` folders to the tree in `AGENTS.md` is part of the same change. Do not build hackathon
  teams, projects or judging.
- Business logic lives in Application handlers and Domain; endpoints only dispatch. The server validates every
  field (lengths, the audience and stage options, the character limits the mocks show) and ignores steps the
  switches turn off. Overrides by System Admin are audited.
- The public marketing application depends only on `components` and `api`; if the public page lives in the
  community app or the marketing app, follow ADR 0018 and decide it in an ADR. Feature libraries depend only on
  `components` and `api`, and never call `HttpClient`.
- Use components from `frontend/projects/components/` and contracts with injection tokens from
  `frontend/projects/api/`. Build the Wizard, choice tiles, public top bar and preview card in `components` if
  they are not there yet, matching the design system. Use CDK Dialog/Overlay, role tokens, labelled controls,
  visible focus and WCAG 2.2 AA. Focus moves to the step heading on each step change.
- Requirements, detailed design and mocks must exist and agree before production behavior changes.
- Backend tests under `backend/tests/` on unique EF in-memory databases; fake email, notifications clock and
  time. No Docker, PostgreSQL, Testcontainers or other external services. Migrations in
  `Infrastructure/Persistence/Migrations`, applied through the Cli, never at API startup.
- Playwright: Chromium only, page objects under `e2e/pages/` own every selector, axe on each screen, the fake
  backend in `e2e/fixtures/` answers every request and an unrouted request fails the test. No architecture,
  naming, structure, banned-API or specification-parsing tests.

## Phase 1: Documentation (mocks, requirements, design, estimate)

Produce these in order, each with the matching skill, before any code:

1. **Mocks** (`writing-html-mocks`): fix the drift in decision 5 and add only what decisions 4 and 6 require; run
   the mocks checker; update `docs/mocks/manifest.json`, `index.html`, the README coverage matrix and the
   `not_applicable` reasons so they match what is drawn.
2. **Requirements** (`writing-requirements`): `L1-027 Ideas (IDEA)` and L2 entries from `L2-168`, drafted from the
   mocks with Given-When-Then criteria covering: public submit, signed-in submit with the profile prefilled, each
   step's validation (the invalid state), the live preview, step count and order for every switch combination,
   review and edit-back, busy and error with answers kept, success and Submit another idea, the notifications and
   emails (System Admin and submitter), anonymous rate limiting, the Idea form switches (default, saved, System
   Admin only) and the follow-up triage feature as out of scope. Each L2 cites the mock states it came from.
3. **Design system** (`extracting-design-systems`): only if a mock fix introduces something new; otherwise record
   that nothing changed.
4. **Screen composition** (`writing-screen-composition`): map the submit pages, the confirmation and the Idea form
   to `components`.
5. **Detailed design** (`writing-design-documents`): `docs/detailed-designs/ideas/` with one design per slice
   group (`submit`, `idea-form`), rendered C4, class and sequence diagrams, the anonymous endpoint and rate limit,
   where the public page is hosted, and the ADRs for decisions 2 and 3.
6. **Estimate** (`estimating-designs`): `docs/estimates/ideas.md`, the README roll-up, `docs/journeys.md`.

## Phase 2: Incremental implementation (ATDD)

Invoke `implementing-incrementally` first. Plan thin vertical slices, each with backend and Playwright
acceptance tests. Agreed order:

1. Idea form settings: System Admin reads and saves the two switches (default on); 404 for everyone else.
2. Signed-out submit, three steps: validation, review and edit-back, success; the idea stored under the platform
   intake; anonymous endpoint with rate limit.
3. Notifications and email: `IdeaSubmitted` to System Admin (in-app and email) and the submitter's confirmation.
4. Signed-in submit: profile prefill, author linked, preview, and the optional steps obeying the switches with the
   exact step count and order rule.
5. Busy and error states keep the answers; Submit another idea resets.
6. Playwright specs with page objects and axe for every screen and state; idempotent seed data in the Cli; the e2e
   fake for every endpoint.

For each slice:
- Write the Given-When-Then criteria, then the acceptance test traced to its requirement.
- Run it and show it fails for the expected reason before writing production code.
- Implement the minimum to pass, refactor while green, run regression checks (backend tests, frontend unit
  tests, lint, Prettier, `build:libs`, build), then commit.
- Do not start the next slice until the checks pass.

After all slices: update `docs/estimates/ideas.md` and the README roll-up to true percent complete; keep mocks,
design system, screen composition and designs aligned with what was built; record the Submit an idea journey
and re-record any journey whose screens changed.

## Done means

- `L1-027` and every L2 entry work end to end and are enforced on the server.
- The step rules, validation, the anonymous rate limit, the System Admin-only settings and both notification
  emails are proven with behavior tests.
- All new and existing backend, frontend unit and Playwright tests pass; lint, format and build are clean.
- The documentation agrees with the code: requirements, mocks, design system, screen composition, designs,
  ADRs, estimates and `AGENTS.md`.
- The work is on a branch with a pull request to `main`, and its checks are green. Fetch and rebase first.
- Only then end the run, with a short summary of what was built, decisions made (with ADR links) and anything
  deferred (the triage feature).
