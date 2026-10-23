 # Feature: Build the organization hierarchy

## Goal

Build, end to end, the **organization hierarchy** agreed in `docs/proposals/organization-hierarchy.md`
(decisions D1 to D17, signed off 2026-10-23). Today QuinntyneBrown.Community has one community, all data is
global, and roles are a fixed enum (`Domain/Profiles/Role.cs`) that about 30 backend files and the frontend check
by name. After this run the platform is:

```text
SYSTEM ADMIN (platform)
  PORTFOLIO            "Quinntyne Brown"; Portfolio Lead built in; cross-org roles (Portfolio, Staff) as data
    ORG TYPE           data: role catalogue + enabled features  ("FaithTech City", "Startup")
    ORGANIZATION       data: "FaithTech Toronto", later "Shelfie"; Org Lead and Member built in
```

What users get:

- Every record belongs to one org. Members see their own org's data. Cross-org roles, the Portfolio Lead and
  System Admin see across the orgs they cover. Anything outside your coverage is a 404.
- Roles are data. The server checks **permission codes** defined in code, never role names. A catalogue role
  is a bundle of permissions plus an explicit "can grant" list, and inherits nothing from its parent.
- The four built-in tiers are System Admin, Portfolio Lead, Org Lead and Member. The "Portfolio" cross-org
  role (read everything except private items, and can be assigned work) and "Staff" (read-only across every
  FaithTech City org) are data.
- One global profile per person with many org memberships. Profiles are visible only to people who share an
  org with them, or whose role covers one of their orgs.
- The app shell has an org switcher. Org pages live under `/o/{orgSlug}/...`, and anyone who covers more than
  one org gets an "All orgs" view (`/o/all/...`, read-only, org-labelled).
- Joining happens only through an org's invite or connect link, or by being added by an Org Lead or Portfolio
  Lead. Someone who signs up without a link sees a "waiting to be added" screen.
- Each Org Type switches features on or off. A disabled feature leaves the navigation and its endpoints
  return 404.
- Resource and note visibility becomes Private, Shared, Org-wide (was Global) or Portfolio-wide (new, set
  only by the Portfolio Lead). Private contacts and private items stay owner-only plus System Admin (audited).
- Public event pages, guest RSVP and `.ics` move to `/o/{orgSlug}/events/{id}`, with light org branding:
  display name, logo and an accent colour that passes AA contrast. Old URLs redirect.
- Admin screens let the Portfolio Lead edit Org Types, catalogues, feature flags, cross-org roles, orgs,
  branding and memberships. Org Leads can read their org's audit log.
- Agents: profiles of kind Agent that sign in with OAuth client credentials or scoped, expiring, revocable
  tokens. They hold roles like people, and their writes are attributed to them.
- A second org, "Shelfie" (type Startup), works end to end and is proven isolated from FaithTech Toronto.

What stays unchanged:

- Inside one org, the per-feature behaviour of contacts, partners, events, announcements, resources, notes,
  workspaces and reports stays the same. The seeded "FaithTech City" catalogue reproduces today's rules
  exactly (the matrix in `docs/roles-and-permissions.txt`).
- The private-preview wall (ADR 0026) stays.
- Sign-in, sign-up and the marketing site stay one shared front door.

Where it lives after this run:

- Backend:
  - `Domain/Organizations/` (Portfolio, OrgType, RoleDefinition, Organization, memberships, assignments,
    CrossOrgRole, AgentCredential, the permission codes)
  - `Application/Organizations/` (access resolver, catalogue, membership, cross-org role, agent and org
    handlers)
  - `OrganizationId` on every org-owned entity
  - every `*Access.cs` rewritten to check permissions
  - a squashed initial migration in `Infrastructure/Persistence/Migrations/`
  - a rewritten `CommunitySeeder`
  - new endpoints under `Api/Endpoints/`
- Frontend:
  - `frontend/projects/organizations/` (new feature library)
  - the org switcher in `components`
  - `ORGANIZATIONS_SERVICE` and its HTTP implementation in `api`
  - org-aware routes in `frontend/projects/faithtech-community/src/app/app.routes.ts` and
    `shell/navigation.ts`
  - permission-based checks replacing role-name checks in `api/src/lib/shared/role.ts` and every feature
    library that uses it
- Docs:
  - `docs/specs/`: `L1-025 Organizations (ORG)`, L2 entries from `L2-133`
  - `docs/mocks/`
  - `docs/design-system/`
  - `docs/screen-composition.md`
  - `docs/detailed-designs/organizations/`, plus updates to `admin`, `platform/server-authorization`,
    `invites`, `agile`, `resources`, `notes`, `events`, `reports` and `search`
  - ADRs from `0033`
  - `docs/estimates/organizations.md`
  - `docs/roles-and-permissions.txt` rewritten
- E2E:
  - `e2e/pages/` for the new screens
  - `e2e/fixtures/mock-organizations.ts`, with orgs, memberships, permissions and agents added to the fake
    in `e2e/fixtures/mock-api.ts`
  - `e2e/tests/organizations/`

Out of scope (do not build):

- sub-units inside an org
- org-local roles added by an Org Lead
- per-org feature overrides
- per-org domains or themes beyond light branding
- discoverable orgs and request-to-join
- multi-org or portfolio-owned workspaces
- data migration of existing records (there is no production data)
- v2 hackathon teams, projects and judging

## Agreed decisions (binding; do not reopen)

The full text, with every rejected alternative, is in `docs/proposals/organization-hierarchy.md`. Read it
first. Summary:

| # | Decision |
|---|---|
| D1 | Every record has a required `OrganizationId`. No boundary below the org. Profiles are global. |
| D2 | An Org Type holds a role catalogue and enabled features. Each org is an instance of one type. A FaithTech city is an org of type "FaithTech City". |
| D3 | Permission codes live in code. A RoleDefinition (Key, Name, Description, ParentRoleId as a display hint only, SortOrder, Permissions, CanGrant) is data. Several roles give the union of their permissions. |
| D4 | `Portfolio` is a real table. One is seeded ("Quinntyne Brown"), and more are possible without redesign. |
| D5 | Built-in tiers: System Admin (platform), Portfolio Lead (one portfolio), Org Lead (every org), Member (org member with no role). Portfolio Lead and Org Lead can do anything in scope except other people's private items. Their overrides on other people's items are audited. |
| D6 | A cross-org role is data: Name, Permissions, CanJoinWork, and a Scope of a list of orgs, all orgs of a type, or the whole portfolio. An assignment can narrow it. Seeded: **Portfolio** (whole portfolio, read everything except private items, CanJoinWork) and **Staff** (all FaithTech City orgs, today's Staff powers). |
| D7 | Agents are profiles with `Kind = Agent`: no password or email sign-in, and they authenticate with OAuth client credentials or a scoped token issued by a Portfolio Lead (or an Org Lead for their own org). Tokens expire, can be revoked and record their last use. Agents hold roles like people, their writes are audited as the agent with the issuer, they're hidden from People search by default and carry an "Agent" badge. |
| D8 | Only the Portfolio Lead or System Admin edits Org Types, catalogues, feature flags and cross-org roles, and every edit is audited before and after. Grant chain: System Admin grants System Admin and Portfolio Lead. Portfolio Lead grants Org Lead, cross-org roles and any role in its orgs. Org Lead grants any catalogue role in its org. A catalogue role grants only its CanGrant list. Removing a catalogue role that someone holds is refused. Permission changes take effect on the next request. |
| D9 | You can see a profile if it's yours, you share an org, a cross-org role you hold covers one of their orgs, you're the Portfolio Lead over one of their orgs, or you're System Admin. Search, People, pickers and mentions all follow this. |
| D10 | Invites and connect links belong to one org, and joining through one grants membership plus any pre-assigned role (within CanGrant). Connect links stay one per person per org, never expire and can be replaced. Link-less sign-ups belong to no org and see "waiting to be added". Org Leads and Portfolio Leads can add existing profiles. Leaving an org removes its roles, and owned records stay in the org. |
| D11 | Active org in the URL, `/o/{orgSlug}/...`, validated by the server. Switcher in the shell, hidden for single-org members. "All orgs" (`/o/all/...`) is a read and assigned-work view, and creating anything needs one org. Slugs are unique and lower-case, the Portfolio Lead can change them, and old slugs redirect. |
| D12 | A workspace belongs to one org. Created by `workspaces.create` holders, the Org Lead or the Portfolio Lead. Members: org members with `workspaces.join`, plus covering cross-org roles with CanJoinWork. Readable by `workspaces.readAll` holders. "Needs a new owner" goes to the Org Lead and Portfolio Lead, either of whom can reassign it. In-workspace levels are unchanged, and "Admin" now means Org Lead, Portfolio Lead or System Admin. |
| D13 | Feature flags per Org Type. `profiles` and `notes` are always on. `contacts`, `partners`, `team`, `events`, `announcements`, `invites`, `resources`, `agile` and `reports` can be toggled. A disabled feature is hidden from navigation and returns 404, and its permissions are hidden in the catalogue editor. |
| D14 | Private contacts and their notes, and private resources and note pages, are visible to the owner and System Admin only (audited). Visibility levels: Private, Shared (people, org roles, covering cross-org roles), Org-wide (was Global), and Portfolio-wide (set only by the Portfolio Lead). Defaults are unchanged: resources Org-wide, note pages Private. |
| D15 | Public events at `/o/{orgSlug}/events/{id}`, with old URLs redirecting. An org has a display name, a logo in blob storage and an accent colour applied as a scoped token (for example `--color-org-accent`) that must pass WCAG 2.2 AA, otherwise saving it is refused. One shared front door. Anonymous visitors see public events only. |
| D16 | Reports, announcements, notifications, search and the audit log are scoped to the viewer's coverage, with an org label or filter. The Portfolio Lead can send portfolio-wide announcements. Org Leads read their org's audit log, the Portfolio Lead reads the portfolio's, and System Admin reads everything. |
| D17 | No data is preserved. Squash the migrations into a new initial migration. `Cli reset` and `Cli seed` (idempotent) create the portfolio, the "FaithTech City" type (every feature, catalogue and permissions matching today), the "Startup" type (profiles, invites, notes, resources and agile; Engineer and Advisor), FaithTech Toronto, the Portfolio and Staff cross-org roles, Quinntyne as System Admin, Portfolio Lead and Toronto Org Lead, and today's demo data re-homed into Toronto. Delete `Role`, `TeamRoles`, `LeadRoles`, `RoleLabels` and `CityLeadRoleRemoved`, which becomes a "lost `workspaces.create` in org X" event. |

Initial permission codes, from today's rules (finalise them in the detailed design):

- `people.view`
- `roles.grant`
- `invites.send`
- `connectLink.own`
- `contacts.private`
- `partners.read`, `partners.write`
- `events.manage`, `events.rsvpList`, `events.rsvpListEmails`, `events.checkIn`
- `announcements.send`
- `resources.create`
- `notes.create`
- `workspaces.create`, `workspaces.join`, `workspaces.readAll`
- `reports.view`

Details for you to settle during design, each recorded in an ADR:

1. Agent authentication: an OpenIddict client-credentials client per agent, or a hashed personal access token
   checked by its own scheme. Choose the one that fits the existing OpenIddict setup, and keep it scoped and
   revocable.
2. How the access resolver is cached within a request, and how queries apply org coverage. Prefer explicit
   `WhereCoveredBy(caller)` query extensions over EF global query filters unless the filters are clearly safer.
   Either way, private-item rules stay explicit.
3. How the frontend learns the caller's permissions: an endpoint returning covered orgs and per-org
   permission codes, refreshed on org switch and after a 403. The frontend uses them only to hide controls.

## Finish the whole feature in one run. Do not stop. (CRITICAL)

- You are authorised to take this feature all the way, across all four delivery phases: ADRs, requirements,
  mocks, design system, screen composition, detailed designs, estimate, incremental ATDD implementation of
  every slice, verification, and a pull request. Go through every phase and every slice in one continuous run.
  Don't pause between phases to report, ask for approval, or wait for "continue".
- Don't end your turn until the "Done means" list at the bottom is fully true. A partial result, a plan, or
  "the next steps would be..." is not done.
- The repository-layout change for `organizations` is already approved and recorded in `AGENTS.md`. Where
  `AGENTS.md` says "stop and ask", treat this prompt as the confirmation in advance for everything in scope
  here. Choose the simplest option that fits the existing architecture, record it (an ADR or the detailed
  design's open-questions section), and keep going.
- If `components` lacks something (the org switcher, a permission checklist, a scope picker, a colour field
  with a contrast check, a token list), that isn't a reason to stop. Update the mocks, the design system and
  the library first, as the project rules require, then go on.
- When a test, build or command fails, find the root cause and fix it, then go on. Never weaken a test to make
  it pass, and never skip a step quietly. Existing tests that encode the old global or role-name model are
  rewritten to assert the same behaviour through the new model, not deleted.
- Only stop for a real blocker you can't resolve yourself, such as missing credentials, or an action outside
  this repository that can't be undone (production deploys, Azure resources, real data). If that happens,
  finish everything else first, then report the blocker clearly.
- Keep track of progress in a todo list, so nothing gets left out after context is summarised. This is a
  large run.

## Rules (read first, binding)

- Follow `AGENTS.md` exactly, especially:
  - the mandatory repository layout
  - the components library being mandatory (CRITICAL)
  - feature libraries depending only on `components` and `api`
  - no `HttpClient` in pages
  - no inline forms (CDK Dialog or a screen)
  - design tokens read by role
  - WCAG 2.2 AA
  - business logic in Application handlers and Domain, never endpoints
  - migrations only in `Infrastructure/Persistence/Migrations/`, applied by the Cli, never at API startup
  - idempotent seed
  - endpoints authenticated by default
  - `PrivatePreviewGateMiddleware` kept ahead of routing, authentication and static files
  - secrets out of the repo
- Read every ADR in `docs/adr/`. ADR 0021 (connect links), 0025 (notes access and Staff) and 0031 (reports)
  are superseded in part. Write the superseding ADRs and mark the old ones.
- The feature is named `organizations` everywhere the layout needs one name (see `AGENTS.md`). Add the new
  library to `build:libs` and `test` in `frontend/package.json`.
- Every query, search result and endpoint enforces org coverage and permissions on the server. A record
  outside coverage, or a disabled feature, returns 404. A covered but unpermitted write returns 403. Never
  rely on the UI.
- Backend tests live under `backend/tests/`, on uniquely named EF in-memory databases. Fake blob storage,
  email, time, breached-password checks and token issuance. No Docker, PostgreSQL, Testcontainers or other
  external services.
- Playwright:
  - Chromium only.
  - Page objects under `e2e/pages/` own every selector.
  - axe checks on every screen.
  - The fake backend in `e2e/fixtures/` answers every request, including orgs, permissions, slugs and
    branding, and an unrouted request fails the test.
  - Tests sign in through the fixture as a role in an org (extend `MockAccount` and `signInAs` in
    `e2e/fixtures/mock-api.ts` with org memberships, Org Lead, Portfolio Lead, cross-org roles and agents).
  - Every test runs as the owner who has unlocked the private-preview wall.
  - `webServer` starts only the Angular app.
- No architecture, naming, structure, banned-API or specification-parsing tests.
- Copy the house style of each folder. Read the existing neighbours before you write anything new. If
  something seems to need more scope, leave it out, note it as deferred, and continue.

## Phase 1: Decisions (ADRs)

Write ADRs from `0033` in the style of `docs/adr/`:

- permission codes and data-defined role catalogues (D3, D8)
- org-owned data and the access resolver (D1, D16, the caching and query decision)
- cross-org roles (D6)
- agent identities and authentication (D7, the client-credentials or token decision)
- org-addressed URLs, the switcher and light branding (D11, D15)
- feature flags per Org Type (D13)
- visibility levels Org-wide and Portfolio-wide (D14)
- the reset-and-reseed approach (D17)

Mark ADRs 0021, 0025 and 0031 "superseded in part by" the new ones.

## Phase 2: Requirements (`writing-requirements`)

- Add `L1-025 Organizations (ORG)` to `docs/specs/L1.md`. Add L2 entries from `L2-133` in `docs/specs/L2.md`,
  with Given-When-Then acceptance criteria covering:
  - portfolio, Org Types, catalogues and permission bundles
  - grant rules and refusals
  - cross-org roles and scope (including a new org of a type being covered automatically)
  - org-owned data and 404 isolation
  - profile visibility
  - joining by invite or connect link, link-less sign-up, adding and removing members
  - the switcher, slugs and redirects, "All orgs"
  - workspace ownership and reassignment
  - feature flags
  - visibility levels and private-item privacy against the Portfolio Lead and Org Lead
  - public event URLs and branding contrast refusal
  - scoped reports, announcements (including portfolio-wide), notifications, search and audit logs
  - agents, tokens, revocation and attribution
  - the seed
- Amend the L1 and L2 entries that today say "global", name fixed roles, or describe Staff, City Lead or
  System Admin powers. Cross-reference them instead of copying.
- Rewrite `docs/roles-and-permissions.txt` for the new hierarchy, keeping its plain-language style. Keep the
  `AGENTS.md` domain rules in step. Remove the "until a phase lands" transition note once everything is
  built.

## Phase 3: Mocks (`writing-html-mocks`)

For every state, light and dark, at phone, tablet and desktop widths:

- **Shell:** org switcher (single org with no switcher, several orgs, "All orgs", long names, keyboard and
  screen-reader states) and org branding in the header.
- **"Waiting to be added"** page.
- **"All orgs" views:** org-labelled lists for People, Workspaces, My work, Resources and Notes.
- **`pages/organizations`:** org list for the Portfolio Lead (default, empty, archived).
- **`pages/organization`:** settings, branding (valid colour, failing-contrast refusal), members (add,
  remove, roles), audit log for Org Lead.
- **`pages/org-types`** and **`pages/org-type`:** catalogue editor (role tree, permission checklist grouped
  by feature, CanGrant, ordering, refusal to remove a held role, disabled-feature permissions hidden) and
  feature flags.
- **`pages/cross-org-roles`:** list, editor with a scope picker (orgs, type, portfolio), assignments with
  narrowing.
- **`pages/agents`:** list, create agent, issue token (shown once), revoke, last used.
- **Dialogs:** add member, change org roles, create org, create Org Type, create cross-org role, assign
  cross-org role, reassign workspace owner (Org Lead), issue token, revoke token.
- **Changed screens:** People (only shared-org profiles), invites and connect QR (org shown), workspace
  member picker (cross-org members marked), resource and note visibility pickers (Org-wide, Portfolio-wide),
  public event page under an org slug with branding, announcement composer (portfolio-wide option), reports
  org filter, search org labels, notification org labels, Agent badge.

Update `docs/mocks/manifest.json`, `index.html` and the coverage matrix.

## Phase 4: Design system (`extracting-design-systems`)

- Add every new component the mocks introduce, with all states and tokens: org switcher, permission
  checklist, scope picker, role tree, colour field with contrast check, token reveal, org label/badge,
  Agent badge.
- Add the scoped org accent token (`--color-org-accent` and its foreground pair) and document its AA rule.
- Update `docs/screen-composition.md` (`writing-screen-composition`) for every new and changed screen.

## Phase 5: Detailed design (`writing-design-documents`)

- Add `docs/detailed-designs/organizations/` in the house style, with rendered C4, class and sequence
  diagrams, one design per slice group:
  - `hierarchy-and-permissions`
  - `org-owned-data-and-context`
  - `membership-and-joining`
  - `cross-org-roles`
  - `feature-flags`
  - `catalogue-admin`
  - `branding-and-public-pages`
  - `agents`
  - `seed`
- Cover the data model in the proposal's "Data model (sketch)", the access resolver contract, the permission
  code list, query scoping, the frontend permissions endpoint, slug routing and redirects, and the agent
  authentication flow.
- Update the existing designs this touches, only where needed:
  - `platform/server-authorization`
  - `admin/assign-roles`, `admin/audit-log`
  - `invites`
  - `agile`
  - `resources`, `notes`
  - `events`
  - `reports`, `search`, `announcements`, `notifications`
  - `profiles`
  - `contacts`, `partners`
  - `team`
- Record the three open details in the ADRs from Phase 1.

## Phase 6: Estimate (`estimating-designs`)

Add `docs/estimates/organizations.md` at 0%, update the README roll-up, and update `docs/journeys.md` where
journeys change.

## Phase 7: Incremental implementation (ATDD)

Invoke `implementing-incrementally` first. Plan thin vertical slices, each with backend integration tests and,
where there's a visible change, Playwright acceptance tests. Suggested order, adjustable:

1. **Hierarchy and permission engine.** Domain types, permission codes, squashed migration, rewritten seed,
   access resolver. Rewrite every `*Access.cs`, `EventPermissions`, `RoleAssignmentPolicy`, `ConnectLinks`,
   `SendInvite`, `SendAnnouncement`, `ListTeam`, `ListPeople` and `Agile/*` to check permissions. Delete
   `Role`, `TeamRoles`, `LeadRoles`, `RoleLabels` and `CityLeadRoleRemoved`. Prove that the existing
   behaviour tests still pass with only FaithTech Toronto seeded.
2. **Org ownership of data.** `OrganizationId` on every entity, coverage-scoped queries, 404 isolation
   between two seeded orgs for every feature.
3. **Profile visibility by shared org,** across People, search, pickers and mentions.
4. **Frontend permissions endpoint and switcher.** Replace role-name checks in `api/src/lib/shared/role.ts`
   and the feature libraries with permission checks. `/o/{orgSlug}` routes, slug redirects, switcher, single-org
   behaviour.
5. **"All orgs" views** and My work across orgs.
6. **Joining:** org-bound invites and connect links, link-less sign-up and "waiting to be added", adding and
   removing members.
7. **Workspaces per org,** cross-org members, Org Lead reassignment.
8. **Visibility levels** Org-wide and Portfolio-wide for resources and notes. Private-item privacy against the
   Portfolio Lead and Org Lead.
9. **Scoped reports, announcements** (including portfolio-wide), **notifications and audit logs.**
10. **Public event URLs and org branding** with the contrast refusal.
11. **Feature flags per Org Type.**
12. **Admin UI:** orgs and branding, Org Types and catalogue editor, cross-org roles and assignments, with
    audit.
13. **Second org:** seed and prove "Shelfie" (Startup) end to end, isolated from FaithTech Toronto.
14. **Agents:** agent profiles, credentials or tokens, admin screen, revocation, attribution, hidden from
    People.

For each slice:

- Write the Given-When-Then criteria.
- Write the acceptance test, traced to its L2 requirement.
- Run it and show that it fails for the expected reason.
- Implement the minimum that makes it pass, and refactor while the tests are green.
- Update the e2e fake in the same slice as any API change.
- Run the regression checks (`dotnet test` in `backend/`; `npm test`, `npm run lint`,
  `npm run format:check`, `npm run build:libs` and `npm run build` in `frontend/`; the Playwright suite in
  `e2e/`), then commit.
- Don't start the next slice until the checks pass.

When all slices are green:

- Update `docs/estimates/organizations.md` and the README roll-up to true percent complete.
- Keep the mocks, design system, screen composition, designs, specs, ADRs, `AGENTS.md` and
  `docs/roles-and-permissions.txt` aligned with what was built.
- Re-record every journey in `docs/videos/journeys/` whose screens changed
  (`pwsh eng/videos/Record-JourneyVideos.ps1`). The shell gains the switcher and URLs gain the org slug.

## Done means

- A Portfolio Lead can create an Org Type with its own catalogue and features, create orgs of it, grant
  roles, and assign cross-org roles.
- Members of FaithTech Toronto and Shelfie can't see each other's data or profiles: the server returns 404.
- The Portfolio role sees and works across its orgs but never sees private items.
- Staff covers every FaithTech City org read-only.
- Agents act only within their scoped, revocable credentials, and are attributed in the audit log.
- Within FaithTech Toronto, every pre-existing behaviour works as before, now driven by catalogue data.
- Permission and grant refusals, 404 isolation, feature-flag 404s, private-item privacy, contrast refusal
  and audit entries are proven with behaviour tests.
- All new and existing backend, frontend unit and Playwright tests pass. Lint, format and build are clean.
- The documentation agrees with the code: proposal, ADRs, specs, mocks, design system, screen composition,
  designs, estimates, `AGENTS.md`, `docs/roles-and-permissions.txt` and journeys.
- The work is on a branch with a pull request to `main`, and its checks are green. Fetch and rebase first.
- Only then end the run, with a short summary of what was built, the decisions made (with ADR links) and
  anything deferred.
