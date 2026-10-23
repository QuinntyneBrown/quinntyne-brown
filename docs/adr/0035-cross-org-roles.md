# 0035. Cross-org roles

- Status: Accepted
- Date: 2026-10-23
- Requirements: L2-138, L2-146
- Designs: `docs/detailed-designs/organizations/cross-org-roles`
- Proposal: `docs/proposals/organization-hierarchy.md` (D6, D12)
- Supersedes in part: ADR 0025 (Staff as a global role), ADR 0031 (Reports for the Staff role)

## Context

Staff (FaithTech HQ) read nearly everything across FaithTech but change almost nothing; they were a global role. Quinntyne's wife and his AI agents need to read and be assigned work across several orgs, including non-FaithTech start-ups, without being Org Lead anywhere. Both are "a permission bundle applied to a set of orgs", so one mechanism serves both.

## Decision

- A **cross-org role** belongs to a portfolio and is data: `Name`, `Description`, `Permissions` (codes from ADR 0033), `CanJoinWork`, and a **scope**:
  - `Orgs`: a fixed list of org ids;
  - `OrgType`: every org of one type, **resolved on each request**, so an org created later is covered at once;
  - `Portfolio`: every org of the portfolio, also resolved live.
- A **cross-org assignment** gives a role to one person and may **narrow** it to a subset of the role's orgs (`NarrowedOrgIds`, empty for none). Narrowing never widens: the covered set is the intersection.
- A holder **covers** each org in the resolved set: they read what any member reads there (events, announcements, team, org-wide items, member profiles) plus the role's bundle. They are **not members**: they are not on member lists, do not receive org announcements by default, and hold no catalogue role. Their permissions in a covered org are the union of every covering role's bundle (and any membership they also have).
- `CanJoinWork` lets owners add holders to the covered org's workspaces and assign them work items, as a workspace Member (D12). Without it, a holder can at most read workspaces (`workspaces.readAll`).
- Only the Portfolio Lead (or System Admin) creates, edits and assigns cross-org roles. Every change is audited with before and after values.
- Private items are never covered: a cross-org role cannot see other people's private contacts, resources or note pages, whatever its bundle (ADR 0039).

### Seeded roles

| Role | Scope | Bundle | CanJoinWork |
|---|---|---|---|
| **Portfolio** | Whole portfolio | `people.view`, `partners.read`, `events.rsvpList`, `workspaces.readAll`, `reports.view` | Yes |
| **Staff** | All orgs of type FaithTech City | `people.view`, `partners.read`, `events.rsvpList`, `workspaces.readAll`, `reports.view`, `resources.create`, `notes.create` | No |

Staff's bundle is today's Staff powers exactly: read the pipeline, people, RSVP lists without guest emails, every workspace and reports; write only their own resources and note pages.

## Consequences

- ADR 0025's "Staff reads every non-private page" becomes "a cross-org role covering the org reads its org-wide and role-shared pages". ADR 0031's "Reports for Staff and System Admin" becomes "holders of `reports.view`, for the orgs they cover".
- Shared visibility can name a cross-org role (ADR 0039); holders covering the item's org see it.
- A new FaithTech city is covered by Staff the moment it is created, with no reassignment.
