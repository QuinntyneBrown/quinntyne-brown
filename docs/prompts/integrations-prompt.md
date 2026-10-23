# Feature: Inbound webhooks and an application events dashboard

## Goal

Applications that QuinntyneBrown.Community reports on can push events to it. The first of these is Goodwork
(goodwork.rocks), a separate .NET site that will stop emailing contact requests and post them here instead.
Each application is registered to exactly one Organization. A Portfolio Lead or Org Lead registers it, and
receives a source ID and a signing secret. The application POSTs signed events to
`POST /api/webhooks/events`. People whose role covers that org see the events on a new Applications
dashboard: a list of applications and, for each one, its events, newest first, with contact requests shown
as name, email, message and received time.

Nothing changes in how existing features work. This feature only receives events; it never calls an
application.

## Facts found in the repo (read before starting)

- The next free ADR number is **0042** (the highest is 0041). Number 0016 is used by two files
  (`0016-home-page-lives-in-the-app-shell.md` and `0016-notifications-announcements-and-search.md`); read both.
- L2 numbering continues at **L2-158**, which is free. The last used number is L2-157.
- Permission codes are `public const string` fields in `backend/src/QuinntyneBrown.Community.Domain/Organizations/Permissions.cs`
  (ADR 0033), in `feature.action` style, and the `FeatureOf` dictionary maps each code to its feature. Feature keys
  are in `Domain/Organizations/Features.cs` (ADR 0038).
- The rate limiter is configured in `Api/Middleware/WebProtectionSetup.cs` (policies `auth` and `guest-rsvp`, plus a
  global limiter). The private-preview gate is `Api/Middleware/PrivatePreview/PrivatePreviewGateMiddleware.cs`.
- ASP.NET Data Protection is already used, for example in `Infrastructure/Email/DataProtectionUnsubscribeTokens.cs`.
- There is no `Application` type in Domain, but `Application` is a namespace in this solution, so the entities are
  named `IntegrationApp` and `IntegrationEvent` in code. The UI label stays "Applications".

## Decisions (agreed in grilling, binding)

- **Secrets**: encrypted at rest with ASP.NET Data Protection through an `IDataProtector` with its own purpose
  string. They are never hashed, because verifying an HMAC needs the raw secret. The ADR records why. A secret is
  shown once, at registration or rotation.
- **Names**: `IntegrationApp` and `IntegrationEvent` in code. "Applications" in the UI.
- **Permissions**: `integrations.view` and `integrations.manage`. Org Lead and Portfolio Lead get both. The Staff and
  Portfolio cross-org roles get view only. Member gets neither.
- **Feature key** `integrations`, on by default for every seeded Org Type. When it is off for an Org Type, its
  endpoints return 404 in that type's orgs.
- **Private-preview gate**: an exact-path exemption for `POST /api/webhooks/events` only, like `/health/live`.
  The HMAC signature then authenticates the request. Record this in ADR 0042.
- **Rate limit**: a fixed window of 60 requests per minute, partitioned by `X-Webhook-Source`, set by
  `RateLimits:WebhookPerMinute`, with `Retry-After` on a 429. There is no per-IP webhook policy; the existing global
  limiter covers floods from unknown sources.
- **Revoke is permanent.** The application's events stay visible. Rotating is the only way back.
- **Events** are kept indefinitely and listed newest first, 25 per page, with "Load more".
- **Duplicates** match on `eventId` within one application only. A duplicate returns 200 and the first payload is
  kept, even if the second payload differs.

## Finish the whole feature in one run. Do not stop. (CRITICAL)

- You are authorised to take this feature all the way: the ICD, mocks, design system, requirements, detailed
  design, estimate, implementation, green tests and a pull request. Go through every phase and every slice in
  one continuous run. Do not pause between phases to report, ask for approval, or wait for "continue".
- Do not end your turn until the "Done means" list at the bottom is fully true. A partial result, a plan, or
  "the next steps would be..." is not done.
- Where `AGENTS.md` says "stop and ask", treat this prompt as the confirmation in advance for everything in
  scope here. That includes adding the `integrations` feature to the folder tree in `AGENTS.md`. Choose the
  simplest option that fits the existing architecture, record it in an ADR in `docs/adr/` (next free number),
  and keep going.
- If `components` lacks something, that is not a reason to stop. Update the design system and the library
  first, then go on.
- When a test, build or command fails, find the root cause and fix it, then go on. Never weaken a test to make
  it pass, and never skip a step quietly.
- Only stop for a real blocker you cannot resolve yourself, such as missing credentials, or an action outside
  this repository that can't be undone, such as production deploys or data changes. If that happens, finish
  everything else first, then report the blocker clearly.
- Keep a todo list so that nothing gets left out after context is summarised.

## Rules (read first, binding)

- Follow `AGENTS.md` exactly, especially:
  - Feature naming: call the feature `integrations` everywhere. That means `Domain/Integrations/`,
    `Application/Integrations/`, `frontend/projects/integrations/`, `docs/detailed-designs/integrations/`,
    `docs/estimates/integrations.md` and `e2e/tests/integrations/`. Add these to the folder tree and the
    naming rule in `AGENTS.md` in the same change.
  - Domain rules: every record belongs to exactly one Organization. The server checks permission codes, never
    role names. Anything outside the caller's coverage returns 404. A feature disabled for an Org Type returns
    404. Overrides go to the audit log.
  - Endpoints require authentication by default. The webhook endpoint is the only anonymous one. Opt it in
    explicitly, and authenticate it by its HMAC signature instead. It passes `PrivatePreviewGateMiddleware`
    (ADR 0026) by the exact-path exemption decided above; record that decision in the ADR.
  - Business rules go in Application handlers. Migrations go only in `Infrastructure/Persistence/Migrations/`
    and are applied by the Cli project.
  - Backend tests are integration tests on the EF Core in-memory provider, with time faked. Use no external
    services.
  - Frontend: compose screens from `components` only. The feature library depends only on `components` and
    `api`. Services are reached through a contract and an `InjectionToken`. Use no inline forms; use CDK
    dialogs. WCAG 2.2 AA.
  - Playwright runs in Chromium only, uses page objects in `e2e/pages/`, and fakes the whole backend in
    `e2e/fixtures/` (with the new endpoints added to the fake). Run axe on every new screen.
  - Write no architecture tests.
- Keep secrets out of the repo. Store signing secrets encrypted at rest (see Decisions). Show a secret once, at
  registration or rotation.
- If something seems to need more scope, leave it out, note it as deferred, and continue.
- Work through the phases below in order, using the skill each phase names. Before writing, read the
  neighbouring files in each folder and copy their style. Read ADRs 0012, 0016 (both files) and 0026 first, and
  the organizations proposal.

## Phase 0: Public ICD (`writing-public-icds`)

- Write the ICD for the inbound webhook under `docs/detailed-designs/integrations/icd/`. External publishers
  such as Goodwork build against it, so define it before anything else.
- The contract to define:
  - The endpoint is `POST /api/webhooks/events`, with a JSON body and HTTPS only.
  - Headers:
    - `X-Webhook-Source`: the source ID.
    - `X-Webhook-Timestamp`: Unix seconds.
    - `X-Webhook-Signature`: `sha256=` followed by the hex HMAC-SHA256 of `timestamp + "." + rawBody`,
      keyed with the source's secret.
  - Envelope: `{ eventId (uuid), eventType, occurredAt (ISO 8601), data }`.
  - Event type v1: `contact-request.created`, with `data` holding `{ name, email, message, organization?,
    phone? }`. Set field limits.
  - Responses:
    - `202` when the event is accepted.
    - `200` when it is a duplicate `eventId`; it is idempotent and not stored twice. Matching is on `eventId`
      within the application only; the first payload is kept.
    - `400` when the body is invalid.
    - `401` for a bad signature, an unknown or revoked source, or a timestamp more than 5 minutes off.
    - `413` when the body is over 64 KB.
    - `429` when the source is rate limited (60 per minute per source), with `Retry-After`.
  - Retry guidance for publishers: retry on 5xx and timeouts with exponential backoff; never retry on 4xx
    except 429.
  - Rotating a secret: the old secret stays valid for 24 hours.
  - Versioning: unknown `eventType` values are accepted and stored as generic events, so publishers can ship
    ahead of the UI.
- Include a C4 context diagram, a sequence diagram and a sample request in C# that Goodwork can copy.

## Phase 1: Mocks (`writing-html-mocks`)

- Add mocks in `docs/mocks/` for the following, in light and dark at phone, tablet and desktop widths:
  - The Applications list: default, empty, loading, error and forbidden.
  - The Register application dialog: default, invalid and busy.
  - The "Copy your secret" success state, shown once.
  - The Rotate secret and Revoke confirmations.
  - The application events page: default, empty, loading and error, with an expanded contact-request card. The
    list is paged 25 at a time with "Load more".
- Add an Applications entry to shell navigation for roles with the permission (ADR 0009).
- Update the mock manifest, gallery and coverage matrix.

## Phase 2: Design system (`extracting-design-systems`)

- Update `docs/design-system/` for anything new. One example is a secret field that can be copied once and
  then shows a masked value. Reuse existing cards, tables, dialogs and badges. Add no new tokens unless a mock
  needs them.
- Update `docs/screen-composition.md` (`writing-screen-composition`) for the new screens and the navigation
  change.

## Phase 3: Requirements (`writing-requirements`)

- Add an L1 entry for application integrations to `docs/specs/L1.md`.
- Add L2 requirements starting at L2-158 in `docs/specs/L2.md`, with Given/When/Then for:
  - Registering an application in an org.
  - Rotating its secret.
  - Revoking it (permanent).
  - Accepting a valid signed event.
  - Rejecting a bad signature, a stale timestamp, a revoked source, an oversized body or an invalid body.
  - Treating a duplicate `eventId` as idempotent.
  - Rate limiting.
  - Listing applications, and listing an application's events, both within coverage only.
  - Returning 404 outside coverage, and when the feature is disabled for the Org Type.
  - Recording audit entries for register, rotate and revoke.
- Add new permission codes `integrations.view` and `integrations.manage` to `Permissions.cs` (with `FeatureOf`),
  the `integrations` feature key to `Features.cs`, and both to the org-type catalogues and seed data as set out in
  Decisions. Cross-reference the organizations and notifications requirements instead of copying them.

## Phase 4: Detailed design (`writing-design-documents`)

- Add `docs/detailed-designs/integrations/` in the house style, linking to the Phase 0 ICD. Cover:
  - The entities: `IntegrationApp` (`OrganizationId`, name, source ID, encrypted secret, previous encrypted secret
    with its expiry, revoked state) and `IntegrationEvent` (`IntegrationAppId`, `EventId` unique per app, type,
    occurred and received times, JSON data).
  - Constant-time signature comparison.
  - Rate limiting with the ASP.NET Core rate limiter, partitioned by source.
  - The handlers, endpoints, Angular `api` contract and token, feature library pages and the e2e fake.
- Record the decisions in ADR 0042: HMAC push rather than polling or a broker; the private-preview exact-path
  exemption for the webhook; and how secrets are stored (Data Protection encryption, not hashing, and why). Update
  the organizations and shell-navigation designs only where they are touched.

## Phase 5: Estimate update (`estimating-designs`)

- Add `docs/estimates/integrations.md` at 0%, and update the root README. Update it again when the work is
  done.

## Phase 6: Incremental implementation (ATDD, `implementing-incrementally`)

- Suggested slices:
  1. An Org Lead registers an application and gets its source ID and secret once (backend, API test).
  2. A signed `contact-request.created` event is accepted and stored. A bad signature, a stale timestamp or an
     unknown source returns 401 (API tests, with time faked).
  3. A duplicate `eventId` returns 200 without a second row. An oversized or invalid body is rejected. The
     source is rate limited.
  4. Applications and events are listed within coverage. Outside coverage, or with the feature disabled, the
     call returns 404 (API tests across roles).
  5. Rotating keeps the old secret valid for 24 hours, then rejects it. Revoking a source makes it return 401.
     Both are audited.
  6. Frontend: the `api` contract, token and HTTP adapter, plus the e2e fake.
  7. The Applications page and register dialog, with the secret shown once (Playwright and axe).
  8. The events page with contact-request cards, plus the navigation entry (Playwright and axe).
  9. Rotate and revoke from the UI (Playwright and axe).
- For each slice:
  - Write the Given-When-Then criteria.
  - Write the acceptance test, traced to its L2 requirement.
  - Run it and show that it fails for the expected reason.
  - Implement the minimum that makes it pass, and refactor while the tests are green.
  - Run the regression checks, then commit.
- Add the EF Core migration through the Cli workflow. Seeding stays idempotent.
- Commit this prompt file (`docs/prompts/integrations-prompt.md`) on the feature branch.
- When everything is green, update the estimate to its true percent complete. Then align the ICD, mocks,
  design system, screen composition and designs with what was built.

## Deferred (do not build)

- Outbound webhooks, replay or re-delivery, and event types other than contact requests getting a custom
  view. Unknown types appear as a generic JSON card only.
- Notifying users (in-app or by email) when an event arrives.
- Replying to a contact request, or changing its status (new, handled).
- Changes to Goodwork itself. It will adopt the ICD in its own repository.
- Un-revoking an application.
- Event retention or purge policy.
- A per-IP rate limit specific to the webhook endpoint.
- Returning 409 when a duplicate `eventId` carries a different payload.

## Done means

- An Org Lead can register Goodwork in an org and copy its secret.
- A signed `contact-request.created` POST appears on that application's events page for everyone whose
  coverage includes the org, and for no one else.
- Every rejection path in the ICD behaves as specified.
- All the new and existing backend, Angular and Playwright tests pass.
- The ICD, specs, designs, mocks, design system, screen composition, estimates and `AGENTS.md` agree with
  the code.
- The work is on a branch with a pull request to `main`, and its checks are green. Fetch and rebase first.
- Only then end the run, with a short summary of what was built, the decisions made and anything deferred.
