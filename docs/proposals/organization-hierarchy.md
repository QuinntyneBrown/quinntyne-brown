# Proposal: Organization hierarchy

A data-driven hierarchy for QuinntyneBrown.Community: Portfolio, Organizations of configurable types, and role catalogues defined as data rather than code. FaithTech becomes one type of organization among several, and Quinntyne's start-ups (Sweet Hand, Shelfie and others) can run beside it with a much simpler structure.

- Status: signed off 2026-10-23; repository layout and `AGENTS.md` domain rules updated; requirements not yet written
- Date: 2026-10-23
- Next step: run `docs/prompts/organization-hierarchy-prompt.md`, which carries these decisions through ADRs, requirements, mocks, design system, detailed design, estimate and incremental implementation of all four phases.

## Problem

Today the platform has exactly one community. Roles are a fixed C# enum (`Domain/Profiles/Role.cs`): City Lead, Event Lead, Create Lead, Communications Lead, Staff, Volunteer, Product Engineer, Attendee and System Admin. All data is global, with no boundary. Permission rules name these roles directly in `Application/*/*Access.cs` and in `Domain/Team/TeamRoles.cs`.

That works for one FaithTech city. It doesn't work for what the platform is becoming: Quinntyne's home base across several organizations.

- **A second organization can't be added.** A start-up like Shelfie has no City Lead, no partners pipeline and no hackathons. It needs a different structure, and its data must not mix with FaithTech's.
- **Roles can't change without a code change.** Adding a "Prayer Lead" or renaming "Create Lead" means editing an enum, every access class and a migration.
- **There's no cross-organization view.** Quinntyne, his wife and AI agents need to see boards, resources and work across several organizations, and be assigned work in them, without being given lead powers in each one.
- **Staff is hard-wired to FaithTech** even though the platform will host non-FaithTech orgs.

## What we are building

A hierarchy where everything from the Organization down is configuration:

```text
SYSTEM ADMIN                      platform; anything, anywhere; every override audited
  |
PORTFOLIO  (data: one today, many possible)
  |-- PORTFOLIO LEAD              built-in; anything in the portfolio
  |-- CROSS-ORG ROLES             data; e.g. "Portfolio" (read + work), "Staff" (read only)
  |
  |-- ORG TYPE  (data)            e.g. "FaithTech City", "Startup"
  |     |-- enabled features      e.g. events, partners, announcements on or off
  |     |-- role catalogue        e.g. City Lead > Event/Create/Comms Lead > Volunteer, ...
  |
  |-- ORGANIZATION  (data)        e.g. "FaithTech Toronto" (type FaithTech City),
        |                               "Shelfie" (type Startup)
        |-- ORG LEAD              built-in in every org; anything in the org
        |-- catalogue roles       from the org's type
        |-- MEMBER (no role)      built-in; member of the org with no roles
```

Example catalogues:

```text
FaithTech City                         Startup
--------------                         -------
ORG LEAD (built-in)                    ORG LEAD (built-in)
  CITY LEAD                              ENGINEER
    EVENT LEAD / CREATE LEAD /           ADVISOR
    COMMUNICATIONS LEAD                MEMBER (built-in)
      VOLUNTEER / PRODUCT ENGINEER
        ATTENDEE
MEMBER (built-in)
```

The tree drawn in a catalogue is only a display order and a hint for the editor. **Power comes only from each role's permission bundle and its "can grant" list**, never from where it sits in the tree.

## Decisions

Each decision below was taken deliberately. The alternatives are recorded so they don't get reopened by accident.

### D1. Data is org-owned

Every record belongs to exactly one Organization (`OrganizationId`, required): events, RSVPs, check-ins, partners, contacts and their notes, resources, note pages, workspaces and everything inside them, announcements, invites, connect links, notifications that come from org activity, and audit entries for org actions. Members see their org's data. Cross-org roles, the Portfolio Lead and System Admin see across the orgs they cover.

Profiles are the exception: **one person has one global profile** and many org memberships (see D9).

This replaces the domain rule "Data is global with no city boundary". Within one org there is still no sub-unit boundary: everything in FaithTech Toronto is visible to every FaithTech Toronto member, subject to the per-feature rules.

Rejected: org plus sub-unit scoping (City as a boundary inside FaithTech), because cities are modelled as orgs instead (D2). Also rejected: staying global and using org only as a tag, because that gives no security boundary between FaithTech and a start-up.

### D2. Org structure is a role catalogue per Org Type

An **Org Type** belongs to a Portfolio and defines:

- a **role catalogue**: the roles available in orgs of that type
- **enabled features** (D13)

An **Organization** is an instance of exactly one type. A FaithTech city is an org: "FaithTech Toronto" has type "FaithTech City". A new city is a new org row of the same type and inherits the same catalogue automatically. "City" is part of the name and the type, not a data level.

Rejected: org units inside an org (City, Chapter as records), because data isn't scoped below the org, so units would add structure without a boundary. Also rejected: a catalogue per org with no type, because every FaithTech city would drift apart.

### D3. Permissions live in code; roles are data bundles of them

The server checks **permissions**, never role names. The code defines a fixed, versioned list of permission codes. A **RoleDefinition** is a data row holding:

| Field | Meaning |
|---|---|
| `Key`, `Name`, `Description` | Stable key (e.g. `city-lead`), display name, help text |
| `ParentRoleId` | Display and editor hint only; grants **no** inherited power |
| `SortOrder` | Display order |
| `Permissions` | Set of permission codes from the code-defined list |
| `CanGrant` | Explicit set of other roles in the same catalogue this role may grant and remove |

A profile holding several roles has the **union** of their permissions, which is the golden rule from today.

Initial permission codes, derived from today's rules (final list in the Phase 1 detailed design):

| Code | Today held by |
|---|---|
| `people.view` | City Lead, Staff, System Admin |
| `roles.grant` | City Lead (limited by `CanGrant`) |
| `invites.send` | All four leads |
| `connectLink.own` | City Lead |
| `contacts.private` | All four leads (own contacts only) |
| `partners.read` | All four leads, Staff |
| `partners.write` | All four leads |
| `events.manage` | City Lead, Event Lead |
| `events.rsvpList` | All four leads (with guest emails), Staff (without emails) |
| `events.rsvpListEmails` | All four leads |
| `events.checkIn` | All four leads |
| `announcements.send` | Communications Lead |
| `resources.create` | All four leads, Staff |
| `notes.create` | Any member with a verified email |
| `workspaces.create` | City Lead |
| `workspaces.join` | All four leads, Volunteer (today's "team") |
| `workspaces.readAll` | Staff |
| `reports.view` | Staff |

Rejected: permissions inherited from the parent role, because it's implicit and easy to grant too much by moving a node. Also rejected: fully dynamic rules (resource + action + condition as data), because they're hard to secure, test and reason about.

### D4. Many portfolios are possible; one exists today

`Portfolio` is a real table and every Org Type and Organization has a `PortfolioId`. One portfolio is seeded: **"Quinntyne Brown"**. A second portfolio needs no redesign. Profiles are platform-wide and a person can belong to orgs in different portfolios.

Rejected: an implicit single portfolio, which would make Portfolio Lead and System Admin indistinguishable. Also rejected: hard multi-tenancy with separate domains, branding and profile stores per portfolio, which isn't needed.

### D5. Four built-in tiers; everything else is data

| Tier | Built-in? | Scope | Powers | Granted by |
|---|---|---|---|---|
| **System Admin** | Yes | Platform | Anything, anywhere. Every action on someone else's item is audited. Only tier that can open another person's private items (audited). | System Admin |
| **Portfolio Lead** | Yes | One portfolio | Anything in every org of the portfolio except other people's private items: create and edit orgs, org types, catalogues, cross-org roles and feature flags; grant any role in any of its orgs; own workspaces and a connect link in any of its orgs. Overrides on other people's items are audited. | System Admin |
| **Cross-org role** | Mechanism built-in; roles are data | A set of orgs in one portfolio | The role's permission bundle, in each covered org (D6) | Portfolio Lead |
| **Org Lead** | Yes, exists in every org | One org | Anything in that org except other people's private items: grant any role in the org's catalogue, own workspaces and a connect link, invite, and reassign workspaces whose owner lost `workspaces.create`. Overrides on other people's items are audited. | Portfolio Lead, System Admin |
| *Catalogue roles* | No (Org Type data) | One org | Their permission bundle; grant per `CanGrant` | Org Lead, Portfolio Lead, or any role whose `CanGrant` includes them |
| **Member** | Yes | One org | Signed-in member of the org with no roles (today's "No role") | Joining through an org link (D10) |

Quinntyne holds System Admin and Portfolio Lead. In day-to-day use he works as Portfolio Lead, and the System Admin tier is used deliberately and audited.

Rejected: Org Lead as just another catalogue role, because the platform must be able to rely on every org having a top role for reassignment, recovery and grants.

### D6. Cross-org roles: "Portfolio" and "Staff" are the same mechanism

A **cross-org role** is defined at the portfolio level, in data:

| Field | Meaning |
|---|---|
| `Name` | e.g. "Portfolio", "Staff" |
| `Permissions` | Permission bundle from the same code list |
| `Scope` | One of: a list of specific orgs; **all orgs of an Org Type** (new orgs of that type are covered automatically); the **whole portfolio** |
| `CanJoinWork` | Whether holders may be added to workspaces and assigned work items in covered orgs |

The same role can be assigned to many people. An assignment may narrow the scope further (e.g. "Portfolio, but only Shelfie and Sweet Hand").

Seeded cross-org roles:

- **Portfolio** (Quinntyne's wife, agents): scope is the whole portfolio, or the orgs chosen per assignment. Reads everything in covered orgs (profiles, partners, events and RSVP lists, workspaces, org-wide and role-shared resources and notes, reports), **except** other people's private contacts and private notes or resources. `CanJoinWork = true`: can be added to any covered org's workspaces and assigned work, taking part as a workspace Member. It can't manage org data: no events, partners, roles, invites or announcements.
- **Staff** (FaithTech HQ): scope is all orgs of type "FaithTech City". Today's Staff powers exactly: read nearly everything and write only their own resources and note pages. `CanJoinWork = false`. Never sees private contacts.

Rejected: Staff as a catalogue role granted city by city, and Staff as a fixed platform-wide role, because neither fits once non-FaithTech orgs exist.

### D7. Agents are first-class service members

An **agent** is a profile flagged `Kind = Agent`:

- It has no password, no email sign-in and no Google or GitHub link.
- It authenticates with **OAuth client credentials or a scoped API token** issued by a Portfolio Lead (or an Org Lead for an agent limited to their org). Tokens are scoped to the agent's assignments, expire, can be revoked, and are listed on an admin screen with their last use.
- It holds role assignments exactly like a person (usually the "Portfolio" cross-org role or a catalogue role), so the same permission checks apply.
- Every write it makes is attributed to the agent in the audit log and activity feeds, with the issuer recorded.
- It can be assigned work items. It's hidden from People search and directory lists by default, and shown with an "Agent" badge where it does appear.

Rejected: agents acting on a delegated user token, which blurs who did what. Also rejected: deferring agents entirely, though they ship in the last phase (see Phases).

### D8. Catalogues are edited by the Portfolio Lead

Org Types, their catalogues, feature flags and cross-org roles belong to the portfolio and are edited only by the **Portfolio Lead** (or System Admin). A change to the "FaithTech City" type applies to every FaithTech city org at once. Org Leads use the catalogue but can't change it. Every catalogue edit is audit-logged with before and after values.

Grant chain:

```text
System Admin    grants  System Admin, Portfolio Lead (and anything below)
Portfolio Lead  grants  Org Lead, cross-org roles, any catalogue role in its orgs
Org Lead        grants  any catalogue role in its org
Catalogue role  grants  only the roles in its CanGrant list, only in its own org
```

Removing a role from a catalogue is refused while anyone holds it. The editor shows who holds it so they can be moved first. Removing a permission from a role takes effect on the next request; there are no cached long-lived grants (see "Enforcement").

Rejected: Org Leads adding org-local roles on top of the type, which can be revisited later. Also rejected: changing catalogues through seed data only.

### D9. Profiles are visible only to people who share an org

You can see a profile if **any** of these is true:

- you're the same person
- you and they are members of at least one common org
- a cross-org role you hold covers at least one of their orgs
- you're the Portfolio Lead of a portfolio containing one of their orgs
- you're System Admin

Search, the People page, people pickers, mentions and workspace member pickers all follow this rule on the server. Profiles are never visible to anonymous visitors (unchanged). A FaithTech attendee can't discover a Shelfie engineer.

Rejected: global profile visibility (today) and portfolio-wide visibility.

### D10. Membership only through an org link

- **Invites and connect links belong to one org.** Accepting one makes the person a member of that org, with any pre-assigned role (the inviter's `CanGrant` limits still apply, as today).
- Holders of `invites.send` invite into their own org. Org Leads and Portfolio Leads can invite into any org they lead.
- **Connect links** are owned by a holder of `connectLink.own`, by an Org Lead or by the Portfolio Lead, one per person per org, and still never expire and can be replaced.
- Someone who signs up **without** a link is a member of no org. They see a "waiting to be added" screen, their own profile and public events, and nothing else until an Org Lead or Portfolio Lead adds them.
- An Org Lead or Portfolio Lead can add an existing profile to an org directly.
- Leaving or being removed from an org removes every role held in it. Records they own in that org stay in the org (D17).

Rejected: a default org that every link-less sign-up joins, and discoverable orgs with request-to-join (possible later).

### D11. Active-org context: switcher plus "All orgs"

- The app shell gets an **org switcher**. The active org lives in the URL: `/o/{orgSlug}/...` (e.g. `/o/faithtech-toronto/events`), so links are shareable and the server validates the org on every request.
- Lists, search and creation default to the active org.
- People who belong to or cover more than one org get an **"All orgs"** view (`/o/all/...`). It shows combined lists with an org label on every row, for reading and for assigned work (My work across orgs). Creating anything always requires a single org, so "All orgs" hides create buttons or asks which org.
- A member of exactly one org never sees the switcher.
- `orgSlug` is unique platform-wide, lower-case and URL-safe, and can be changed by the Portfolio Lead (old slugs redirect).

Rejected: always-combined lists with no switcher, and a strict one-org-at-a-time view even for Portfolio users.

### D12. Workspaces belong to one org

- A workspace has one `OrganizationId`.
- **Create:** holders of `workspaces.create` in that org (City Lead in FaithTech), the Org Lead and the Portfolio Lead. The creator is the owner, as today.
- **Members:** members of that org whose roles include `workspaces.join`, **plus** anyone whose cross-org role covers that org and has `CanJoinWork`. This is how cross-org work happens: Quinntyne's wife or an agent joins the Shelfie board and the FaithTech Toronto board separately, and sees both under "All orgs".
- **Read all:** holders of `workspaces.readAll` (Staff) for covered orgs, plus Org Lead, Portfolio Lead and System Admin.
- **Owner reassignment:** if the owner loses `workspaces.create` in that org (or leaves it), the **Org Lead** and Portfolio Lead are notified that it "needs a new owner" (today it's only System Admins) and either can reassign it. The old owner stays a member if still eligible.
- The in-workspace levels (Owner, Admin, Member, read-only, Outsider) stay as today. "Admin" becomes Org Lead, Portfolio Lead and System Admin.

Rejected: multi-org workspaces, and portfolio-owned workspaces (Quinntyne can create a workspace in a dedicated org if he wants a portfolio-level board).

### D13. Feature flags per Org Type

Each Org Type has a list of enabled features: `profiles` and `notes` are always on; `contacts`, `partners`, `team`, `events`, `announcements`, `invites`, `resources`, `agile` and `reports` can each be switched on or off.

- A disabled feature disappears from navigation in that org, and its endpoints return **404** for that org.
- The catalogue editor hides permissions belonging to disabled features.
- "FaithTech City" has every feature on. A typical "Startup" type has profiles, invites, notes, resources and agile.
- There are no per-org overrides in this proposal. They can be added later without a data-model change.

### D14. Private stays private; "Global" becomes "Org-wide"

- **Private contacts and their notes**, and **private resources and note pages**, are visible only to their owner and to **System Admin** (audited). The Portfolio Lead, Org Lead and cross-org roles never see them. This keeps today's strongest privacy promise.
- Resource and note **visibility** becomes:

| Level | Who |
|---|---|
| Private | Owner (and System Admin, audited) |
| Shared | Owner + named people + everyone holding a named **role in the item's org** (or a named cross-org role covering the org); live as today |
| **Org-wide** (was Global) | Every member of the item's org, plus cross-org roles covering it |
| **Portfolio-wide** (new) | Every member of any org in the portfolio. Only the Portfolio Lead can set it, for cross-org documents. |

- Defaults are unchanged: new resources are Org-wide and new note pages are Private.
- Only the owner edits, shares, archives or restores, as today. Overrides by the Portfolio Lead or Org Lead on non-private items are audited.

### D15. Public pages are org-addressed with light branding

- Public event pages, guest RSVP and `.ics` move to `/o/{orgSlug}/events/{id}` (public) on the app domain. Existing public event URLs redirect.
- Each Organization carries **light branding data**: display name, logo (blob storage) and accent colour. It's shown on the org's public pages and in the switcher. The colour is applied through design tokens (a scoped token override such as `--color-org-accent`), never as raw hex in components, and must pass WCAG 2.2 AA contrast. Saving a colour that fails is refused.
- Sign-in, sign-up and the marketing site stay a single shared, portfolio-level front door. There are no per-org domains.
- Anonymous visitors still see only public events, and still nothing else.

### D16. Everything else follows the viewer's coverage

- **Reports:** `reports.view` holders see reports for the orgs they cover, with an org filter. The Portfolio Lead and System Admin see all.
- **Announcements:** sent within one org to that org's members (or a role audience within it), using today's email opt-out. The Portfolio Lead can send a portfolio-wide announcement.
- **Notifications:** carry their org and appear in the bell with an org label. Preferences stay per person.
- **Search:** scoped to the active org, or to every covered org under "All orgs", with the same server-side permission filtering.
- **Audit log:** every entry records the org (if any) and the portfolio. Org Leads can read their org's audit log, the Portfolio Lead can read the portfolio's, and System Admin can read everything.
- **"Not found":** anything outside your coverage returns 404, as today, including whole orgs you're not part of.

### D17. No data migration: reset and reseed

There's no production data yet, so **no data needs to be preserved**.

- EF Core migrations are squashed into a new initial migration that includes the hierarchy tables and a required `OrganizationId` on every org-owned table.
- `Cli reset` + `Cli seed` produce the new world. The seed is idempotent, as today, and creates:
  - Portfolio **"Quinntyne Brown"**
  - Org Type **"FaithTech City"**: all features on; catalogue = City Lead, Event Lead, Create Lead, Communications Lead, Volunteer, Product Engineer, Attendee, with permissions and `CanGrant` lists that reproduce today's rules exactly (City Lead grants the other six)
  - Org Type **"Startup"**: profiles, invites, notes, resources and agile on; catalogue = Engineer, Advisor
  - Org **"FaithTech Toronto"** (type FaithTech City)
  - Cross-org roles **"Portfolio"** (whole portfolio, `CanJoinWork`) and **"Staff"** (all FaithTech City orgs, read-only)
  - Quinntyne as System Admin, Portfolio Lead and Org Lead of FaithTech Toronto
  - existing seeded demo people and data re-homed into FaithTech Toronto
- The `Role` enum, `TeamRoles` and `CityLeadRoleRemoved` are deleted, not kept for compatibility. `CityLeadRoleRemoved` becomes a general "lost permission `workspaces.create` in org X" event.
- Leaving or being removed from an org: records they own (contacts, resources, notes, workspaces) stay in the org and keep their owner. Workspace ownership goes through D12 reassignment.

## Data model (sketch)

```text
Portfolio            (Id, Name, Slug)
PortfolioLead        (PortfolioId, ProfileId)
OrgType              (Id, PortfolioId, Key, Name, EnabledFeatures[])
RoleDefinition       (Id, OrgTypeId, Key, Name, Description, ParentRoleId?, SortOrder,
                      Permissions[], CanGrant[RoleDefinitionId])
Organization         (Id, PortfolioId, OrgTypeId, Name, Slug, LogoBlob?, AccentColour?,
                      ArchivedAt?)
OrgMembership        (OrganizationId, ProfileId, JoinedAt, JoinedVia)
OrgLead              (OrganizationId, ProfileId)
OrgRoleAssignment    (OrganizationId, ProfileId, RoleDefinitionId, GrantedBy, GrantedAt)
CrossOrgRole         (Id, PortfolioId, Name, Permissions[], CanJoinWork,
                      ScopeKind {Orgs | OrgType | Portfolio}, ScopeOrgTypeId?, ScopeOrgIds[])
CrossOrgAssignment   (CrossOrgRoleId, ProfileId, NarrowedOrgIds[]?, GrantedBy, GrantedAt)
Profile              (+ Kind {Person | Agent}, + IsSystemAdmin)
AgentCredential      (Id, AgentProfileId, IssuedBy, Scopes, ExpiresAt, RevokedAt?, LastUsedAt?)

Every org-owned entity: + OrganizationId (required, indexed)
```

## Enforcement

- One Application service, the **access resolver**, answers two questions per request: *which orgs does this caller cover?* and *which permissions does the caller have in org X?* It combines System Admin, Portfolio Lead, Org Lead, org role assignments and cross-org assignments, minus disabled features.
- Every `*Access.cs` class is rewritten to ask for permissions (`HasPermission(orgId, Permissions.EventsManage)`), never role names.
- Every query filters by covered orgs **on the server**. For the active-org routes, the API validates that the caller covers `{orgSlug}`, and otherwise returns 404.
- Permissions are resolved from the database per request (cached per request only), so a role change or catalogue edit takes effect immediately. Tokens carry identity, not roles.
- `PrivatePreviewGateMiddleware` stays ahead of everything (ADR 0026). It's unaffected.
- Backend integration tests cover, per phase: org isolation (a member of org A gets 404 for org B's data), grant limits (`CanGrant`, Org Lead, Portfolio Lead), cross-org scope (including "all orgs of a type" picking up a new org), private-item privacy against the Portfolio Lead and Org Lead, feature flags returning 404, and agent token scope. The e2e fake backend gains orgs, the switcher and these permission failures in the same change as each API change.

## Repository layout (approved)

`AGENTS.md` mandates the folder tree, and this work needs a new feature name. Proposed: **`organizations`**, which is `Domain/Organizations/`, `Application/Organizations/` (portfolio, org types, catalogues, memberships, cross-org roles, agents, access resolver), `frontend/projects/organizations/` (org switcher data, admin screens for types and catalogues, membership), `docs/specs/`, `docs/detailed-designs/organizations/`, `docs/estimates/organizations.md` and `e2e/tests/organizations/`. The switcher component itself goes in `components`. The tree in `AGENTS.md` must be updated with explicit approval before any code goes there.

Documents that change when this is agreed:

- `AGENTS.md` "Domain rules": data is org-owned. Roles are data. System Admin, Portfolio Lead, Org Lead and Member are built-in. Staff is a cross-org role.
- `decisions.txt` does not exist in the repository; this proposal is the decision record.
- `docs/roles-and-permissions.txt`: rewrite around the new hierarchy.
- New ADRs:
  - permission codes and data-defined roles (D3)
  - org-owned data and the access resolver (D1, Enforcement)
  - cross-org roles (D6)
  - agent identities (D7)
  - org-addressed URLs (D11, D15)
- ADR 0021 (connect links), 0025 (notes access and Staff) and 0031 (reports) are superseded in part.

## Phases

The original plan was behaviour-preserving phases, but data preservation isn't required (D17), so each phase may reset the database.

1. **Hierarchy and permission engine.** Portfolio, Org Type, catalogue, Organization, memberships, Org Lead, Portfolio Lead, cross-org roles, and the access resolver. Every `*Access.cs` rewritten to use permission checks. Squashed migration and new seed. With only FaithTech Toronto seeded, users see no visible change: today's rules are reproduced as data.
2. **Org-owned data and org context.** `OrganizationId` on every record. Org-scoped queries, search, notifications, announcements and reports. Profile visibility by shared org (D9). `/o/{orgSlug}` routes, the switcher and "All orgs". Org-addressed public event pages with branding. Invites and connect links joining an org, and the "waiting to be added" screen.
3. **Admin UI.** Screens for Org Types, catalogue editor (permissions, `CanGrant`, ordering), feature flags, cross-org roles and assignments, org creation and branding, and membership management. Org-level audit log for Org Leads.
4. **Second org and agents.** Create a Startup org (e.g. Shelfie) end to end, and prove isolation from FaithTech. Agent profiles, client-credential tokens, the token admin screen and agent attribution in audit and activity.

Each phase gets its own specs, detailed design, mocks and acceptance tests before code, per `AGENTS.md`.

## Out of scope

- Sub-units inside an org (e.g. teams or chapters as data boundaries)
- Org-local roles added by an Org Lead on top of the type
- Per-org feature overrides
- Per-org custom domains and themes beyond light branding
- Discoverable orgs and request-to-join
- Multi-org workspaces
- v2 hackathon teams, projects and judging (unchanged)
