# Feature: Build the Community Agent (formerly "Faith Tech Agent")

## Goal

Build, end to end, the **Community Agent**: an in-app AI assistant inside QuinntyneBrown.Community that
signed-in members can ask questions in plain language ("What events are coming up in November?", "Find the
FaithTech Toronto pitch deck", "Who on the team is a Product Engineer?", "Summarise my notes from the last
leads meeting") and get answers grounded in the community's own data, with links to the records it used.

The feature was first called **Faith Tech Agent**. That name is retired. Use **Community Agent** everywhere:
UI copy, nav item, requirement titles, design folders, code names, ADRs, seed data and tests. Nothing in the
repository uses the old name today; if any trace turns up during the run, rename it in the same change.

Nothing exists yet for this subsystem: no requirements, mocks, designs, estimate or code. This prompt carries
the decisions below; the run produces the documentation first and then the implementation.

What users get:

- A **Community Agent** panel, opened from a shell button ("Ask the Community Agent") and the keyboard
  shortcut `Ctrl+/` (`Cmd+/` on macOS), plus a full page at `/agent` for longer conversations.
- A chat with streamed answers. Each answer cites the records it used (event, profile, resource, note page,
  announcement, team member, partner, contact) as links that open the real screen.
- Conversation history per member: list, rename, delete. Conversations are private to their owner.
- Suggested starter questions tailored to the member's roles.
- A clear empty state, a busy state while streaming, a stop button, a retry on failure, and a notice that
  answers are AI-generated and may be wrong.

Where it lives after this run:

- Backend: `Domain/Agent/`, `Application/Agent/`, the Claude client and tool adapters in `Infrastructure/Agent/`,
  endpoints in `Api/Endpoints/AgentEndpoints.cs`, one EF migration (conversations and messages) applied by the
  Cli.
- Frontend: `frontend/projects/agent/` (new feature library), `AGENT_SERVICE` and `HttpAgentService` in `api`,
  new design-system components (chat message, citation chip, chat composer, streaming indicator) in
  `components`.
- Docs: `docs/specs/` (`L1-024 Community Agent (AGENT)`, L2 entries from `L2-110`), `docs/mocks/pages/agent`,
  `docs/mocks/dialogs/agent-panel`, `docs/detailed-designs/agent/`, `docs/estimates/agent.md`,
  `docs/screen-composition.md`, a new ADR (`docs/adr/0027-community-agent.md`).
- E2E: `e2e/pages/agent*.ts`, `e2e/fixtures/mock-agent.ts` (fake streamed answers, no real model calls),
  `e2e/tests/agent/`.

Out of scope (do not build): the agent taking actions or writing data (creating events, sending invites,
editing profiles, RSVPs), anonymous or marketing-page access, voice, file upload into the chat, email or
notification delivery of answers, cross-member shared conversations, fine-tuning, and anything for hackathon
teams, projects or judging (v2).

## Agreed decisions (binding; record each in the requirements and the ADR, do not reopen)

| Decision | Agreed | Rejected |
|---|---|---|
| Name | **Community Agent**. "Faith Tech Agent" is retired and must not appear in UI, code or docs. | Faith Tech Agent; FaithTech Assistant. |
| Model | Claude through the Anthropic API, called only from the backend (`Infrastructure/Agent/`) behind an `IAgentModelClient` abstraction. Default model `claude-sonnet-5-5`, configurable. API key from configuration / environment, never in the repo. Load the `claude-api` skill before writing the client. | Calling the model from the browser; a key in source. |
| Who can use it | Every signed-in member with any role, and members with no role. Suspended members cannot. No anonymous access. | Leads only; anonymous visitors. |
| Grounding | Tool use: the agent answers through read-only tools that call existing Application handlers as the **signed-in member** (search, events, profiles, team, resources, notes, announcements, partners, contacts). Every permission rule applies unchanged, including private contacts (creator and System Admin only) and private/shared resources and note pages. | A separate index or vector store; tools running with elevated rights. |
| Writes | Read-only in v1. Tools never change data. | Agent-initiated actions. |
| Staff | Staff may use the agent; it is read-only, so it fits the Staff rule. | Blocking Staff. |
| Citations | Every answer lists the records its tools returned and used, as links to their screens. If no tool returns data, the agent says it does not know. | Free-form answers without sources. |
| History | Conversations and messages are stored per member; only the owner sees them. System Admin cannot read them through the UI. Owner can delete; deletion is hard. Conversations unused for 90 days are purged by a background job. | Admin-readable transcripts; no history. |
| Streaming | Server-sent events from the API to the app; the client can stop a stream. | Polling; WebSockets. |
| Limits | Per-member rate limit (default 30 messages per hour, configurable) with a clear refusal message; max message length 4,000 characters; tool results truncated server-side. | Unlimited use. |
| Audit and privacy | Log usage counts and failures, never message text, in request logs. No member data leaves the backend except to the model provider in the request. Note this in the ADR and `SECURITY.md` if relevant. | Logging prompts and answers. |
| Failure | A model or network failure shows an inline error with Retry; the conversation stays intact. If the API key is missing, the agent shows "The Community Agent is not available right now" and the rest of the app is unaffected. | Crashing the page; hiding the nav item silently. |

## Finish the whole feature in one run. Do not stop. (CRITICAL)

- You are authorised to take this feature all the way: mocks, design system, requirements, detailed design,
  estimate, incremental implementation, green tests and a pull request. Go through every phase and every slice
  in one continuous run. Do not pause between phases to report, ask for approval, or wait for "continue".
- Do not end your turn until the "Done means" list at the bottom is fully true. A partial result, a plan, or
  "the next steps would be..." is not done.
- Where `AGENTS.md` says "stop and ask", treat this prompt as the confirmation in advance for everything in
  scope here. That includes the new `agent` folders: this prompt is the owner's approval to add
  `Domain/Agent/`, `Application/Agent/`, `Infrastructure/Agent/`, `frontend/projects/agent/` and
  `docs/detailed-designs/agent/`. Update the repository layout tree and the v1 feature list in `AGENTS.md`
  first, in the same change, before placing any code there. Choose the simplest option that fits the existing
  architecture, record it (the ADR or the detailed design's open-questions section), and keep going.
- If the `components` library lacks something, that is not a reason to stop. Update the design system and the
  library first, as the project rules require, then go on.
- When a test, build or command fails, find the root cause and fix it, then go on. Never weaken a test to make
  it pass, and never skip a step quietly.
- Only stop for a real blocker you cannot resolve yourself, such as missing credentials, or an action outside
  this repository that can't be undone, such as production deploys or data changes. A missing Anthropic API
  key is not a blocker: every test fakes the model. If a real blocker happens, finish everything else first,
  then report it clearly.
- Keep track of progress (a todo list), so that nothing gets left out after context is summarised.

## Rules (read first, binding)

- Follow `AGENTS.md` exactly, especially:
  - The mandatory repository layout; the feature is named `agent` in `Application/`, `frontend/projects/`,
    `docs/specs/` and `docs/detailed-designs/`.
  - The components library is mandatory: every chat UI piece is built once in `frontend/projects/components/`,
    meets WCAG 2.2 AA (live region for streamed text, focus management, keyboard send and stop) and reads
    tokens by role.
  - The feature library depends only on `components` and `api`; pages never call `HttpClient`; services have a
    contract and an injection token; modal behaviour uses Angular CDK Dialog/Overlay.
  - Business rules and permission checks live in Application handlers; endpoints require authentication; the
    server enforces every permission, never the UI.
  - Backend tests use the EF Core in-memory provider with a unique database per fixture and fake the model
    client, time and external services. No Docker, no real network.
  - Playwright: Chromium only, Page Object Model, axe on every screen, the backend fully faked in
    `e2e/fixtures/` (including the OIDC flow and the streamed agent answers), unrouted requests fail loudly,
    tests start unlocked past the private-preview wall.
  - Migrations only in `Infrastructure/Persistence/Migrations/`, applied by the Cli. Seed data idempotent.
  - No architecture tests.
- Read ADRs 0016 (search), 0026 (private preview) and any ADR on notifications or auth before changing those
  areas.
- If something seems to need more scope, leave it out, note it as deferred, and continue.
- Work through the phases below **in order**, using the skill each phase names.
- Copy the house style of each folder. Read the existing neighbours (for example the Resources and Notes
  docs and code) before you write anything new.

## Phase 1: Mocks (`writing-html-mocks`)

- Add `docs/mocks/pages/agent` (full page) and `docs/mocks/dialogs/agent-panel` (side panel), light and dark,
  at phone, tablet and desktop widths, in these states: empty with starter questions, typing, streaming, answer
  with citations, "I don't know" answer, error with Retry, rate-limited, unavailable (no key), conversation
  list (empty and populated), rename and delete-confirm dialogs.
- Add the shell entry point (button and shortcut hint) to the shell mocks.
- Update `docs/mocks/manifest.json`, `docs/mocks/index.html` and the coverage matrix.

## Phase 2: Design system (`extracting-design-systems`)

- Add pages in `docs/design-system/` for chat message (member and agent), citation chip, chat composer,
  streaming indicator and AI-generated notice. Change tokens only if needed.
- Update `docs/screen-composition.md` (`writing-screen-composition`) for the agent page, panel, dialogs and the
  shell change.

## Phase 3: Requirements (`writing-requirements`)

- Add `L1-024: Community Agent (AGENT)` to `docs/specs/L1.md`.
- Add L2 requirements from `L2-110` in `docs/specs/L2.md` with Given/When/Then criteria covering: opening the
  panel and page; asking and streaming; stopping; citations; "I don't know"; history list, rename, delete and
  90-day purge; permission-scoped answers (a member never sees another lead's private contacts, private or
  unshared resources and note pages through the agent); suspended and anonymous refusals; rate limit and length
  limit; unavailable state; no message text in logs.
- Cross-reference the existing search, resources, notes, contacts and identity requirements instead of
  copying them.

## Phase 4: Detailed design (`writing-design-documents`)

- Add `docs/detailed-designs/agent/` in the house style with C4, class and sequence diagrams: the conversation
  model, the tool catalogue and how each tool maps to an existing Application handler under the caller's
  identity, the model client abstraction, the SSE endpoint, the purge job, rate limiting, configuration and
  failure handling, and the frontend library and `api` service.
- Write `docs/adr/0027-community-agent.md` recording the decisions table, including the rename from Faith Tech
  Agent.
- Update the search and platform designs only where they change.

## Phase 5: Estimate update (`estimating-designs`)

- Add `docs/estimates/agent.md` at 0% and include it in the `docs/estimates/README.md` roll-up. Update it again
  when the work is done.

## Phase 6: Incremental implementation (ATDD)

Invoke `implementing-incrementally` first. Suggested slices (adjust if needed):

1. Shell entry point and empty agent page/panel; ask a question and get a streamed answer from the faked model
   (no tools); unavailable state when no key is configured.
2. Conversation history: persist, list, open, rename, delete; owner-only access.
3. Read-only tools for search, events and profiles/team, with citations; "I don't know" when tools return
   nothing.
4. Tools for resources, notes, announcements, partners and contacts, with permission tests proving private
   contacts and private/shared resources and pages never leak.
5. Stop, retry, rate limit and length limit; suspended and anonymous refusals.
6. 90-day purge job; usage logging without message text.
7. Playwright specs with page objects and axe for every screen and dialog; the e2e fake for every agent
   endpoint including the stream; idempotent seed data in the Cli.

For each slice:

- Write the Given-When-Then criteria, then the acceptance test traced to its requirement.
- Run it and show it fails for the expected reason before writing production code.
- Implement the minimum to pass, refactor while green, run the regression checks (backend tests, frontend unit
  tests, lint, Prettier, `build:libs`, build), then commit.
- Do not start the next slice until the checks pass.

After all slices: update the estimate and roll-up to true percent complete; keep mocks, design system, screen
composition and designs aligned with what was built; re-record any journey whose screens changed (the shell
gains an entry point).

## Done means

- `L1-024` and every new L2 entry work end to end under the name **Community Agent**, enforced on the server,
  with no anonymous access and no write actions.
- Behaviour tests prove that the agent never returns data the member could not see directly, that
  conversations are owner-only, and that limits and failures behave as specified.
- No occurrence of "Faith Tech Agent" remains in the repository except the ADR's note about the rename.
- All new and existing backend, frontend unit and Playwright tests pass; lint, format and build are clean; no
  test calls the real model.
- The documentation agrees with the code: `AGENTS.md` (layout tree and v1 features), requirements, mocks,
  design system, screen composition, designs, ADR and estimates.
- The work is on a branch with a pull request to `main`, and its checks are green. Fetch and rebase first.
- Only then end the run, with a short summary of what was built, the decisions made (with ADR links) and
  anything deferred.
