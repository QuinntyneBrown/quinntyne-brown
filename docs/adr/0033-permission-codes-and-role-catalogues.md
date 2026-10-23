# 0033. Permission codes and data-defined role catalogues

- Status: Accepted
- Date: 2026-10-23
- Requirements: L1-025, L2-134, L2-135, L2-136, L2-137
- Designs: `docs/detailed-designs/organizations/hierarchy-and-permissions`, `docs/detailed-designs/organizations/catalogue-admin`
- Proposal: `docs/proposals/organization-hierarchy.md` (D3, D5, D8)
- Supersedes: the fixed `Role` enum (`Domain/Profiles/Role.cs`), `TeamRoles`, `LeadRoles`, `RoleLabels`, ADR 0005's `assignableRoles` table

## Context

Roles were a fixed enum of nine values, and about 30 backend files and the frontend checked them by name ("City Lead may…", "any lead may…"). The organization hierarchy needs roles that differ per kind of organization (a FaithTech city has a City Lead; a start-up has an Engineer) and that the Portfolio Lead can change without a release. The server must still enforce every rule, and the rules must stay testable.

## Decision

### Permission codes live in code

- `Domain/Organizations/Permissions.cs` defines the closed list of permission codes, each tied to the feature it belongs to (ADR 0038). The server checks codes, never role names.

| Code | Feature | Grants |
|---|---|---|
| `people.view` | profiles | The People page with each person's roles |
| `roles.grant` | profiles | Opening role changes; limited to the role's `CanGrant` list |
| `invites.send` | invites | Sending invites into the org |
| `connectLink.own` | invites | Owning a connect link (QR code) for the org |
| `contacts.private` | contacts | Keeping private contacts in the org (own contacts only) |
| `partners.read` / `partners.write` | partners | Reading / changing the partner pipeline |
| `events.manage` | events | Creating, editing and cancelling events |
| `events.rsvpList` | events | Seeing who RSVP'd and the check-in page (read) |
| `events.rsvpListEmails` | events | Guest emails, RSVP CSV export |
| `events.checkIn` | events | Checking in, undo, walk-ins and the attendance export |
| `announcements.send` | announcements | Sending announcements to the org |
| `resources.create` | resources | Adding resources |
| `notes.create` | notes | Creating note pages |
| `workspaces.create` | agile | Creating and owning workspaces |
| `workspaces.join` | agile | Being added to the org's workspaces |
| `workspaces.readAll` | agile | Reading every workspace of the org |
| `reports.view` | reports | The Reports page for the org |
| `team.member` | team | Being listed on the org's Team page |
| `team.lead` | team | Matching the Team page's "Leads" filter |

- `team.member` and `team.lead` are **markers** rather than powers: the Team page and its Leads filter (L2-019) used `TeamRoles`, which no longer exists. Making them codes keeps the team list data-driven with no second mechanism.
- Adding a code is a code change and a release. Removing one needs a seed or migration that strips it from stored bundles; unknown codes in a stored bundle are ignored by the resolver.

### Roles are data

- `RoleDefinition` (Org Type catalogue row): `Key` (stable, kebab-case, unique per type, for example `city-lead`), `Name`, `Description`, `ParentRoleId` (display and editor hint only, grants nothing), `SortOrder`, `Permissions` (set of codes) and `CanGrant` (set of role ids in the same catalogue).
- An Org Type also has a **Member bundle** (`OrgType.MemberPermissions`): the permissions every member of an org of that type holds with no role. FaithTech City's Member bundle is `notes.create`, which is today's "any member with a verified email may create pages" rule. Today's "No role" member is the built-in Member tier with this bundle.
- A person's permissions in an org are the **union** of the Member bundle (if a member), every catalogue role they hold there, and every cross-org role covering the org (ADR 0035). Nothing is inherited through `ParentRoleId`.

### Built-in tiers are not data

- **System Admin** (`Profile.IsSystemAdmin`), **Portfolio Lead** (`PortfolioLead` row), **Org Lead** (`OrgMembership.IsOrgLead`) and **Member** (`OrgMembership`) are built in. Org Lead, Portfolio Lead and System Admin hold **every permission whose feature is enabled** in the orgs they cover, with one exception that no tier lifts except System Admin: other people's private items (ADR 0039).
- An action a tier allows but no catalogue or cross-org role grants is an **override**. Overrides on other people's items are written to the audit log, as System Admin overrides were before. `CallerAccess.HasByRole(org, code)` and `CallerAccess.Has(org, code)` let a handler tell the two apart.

### Grant chain

```text
System Admin    grants  System Admin, Portfolio Lead (and anything below)
Portfolio Lead  grants  Org Lead, cross-org roles, any catalogue role in its orgs
Org Lead        grants  any catalogue role in its org
Catalogue role  grants  only the roles in its CanGrant list, in its own org, and only with roles.grant
```

- `RoleGrantPolicy` (Application/Organizations) is the one place that answers "may this caller grant role R to person P in org X". A refused grant is `403`; a target outside coverage is `404`.
- Grants by the Portfolio Lead or System Admin are audited; grants by an Org Lead or a catalogue role notify the person, as City Lead grants did (L2-009).
- Removing a catalogue role is refused (`409`, naming the holders) while anyone holds it. Removing a permission from a role takes effect on the next request (ADR 0034).

### The FaithTech City catalogue reproduces today's rules

The seed (ADR 0040) creates City Lead, Event Lead, Create Lead, Communications Lead, Volunteer, Product Engineer and Attendee with bundles that reproduce `docs/roles-and-permissions.txt` before this change. City Lead's `CanGrant` is the other six. Staff becomes a cross-org role (ADR 0035), System Admin a tier.

## Consequences

- `Role`, `ProfileRole`, `TeamRoles`, `LeadRoles`, `RoleLabels` and `CityLeadRoleRemoved` are deleted. `CityLeadRoleRemoved` becomes `WorkspaceCreatorPermissionLost(ProfileId, OrganizationId)`, raised whenever a change leaves an owner without `workspaces.create` in a workspace's org (ADR 0034, D12).
- The web app never decides with role names. It reads the caller's permission codes per org (ADR 0037) only to hide controls; the server stays the authority.
- Tests grant catalogue roles through the same rows the app uses; the API test helper keeps a small vocabulary (`SeededRole.CityLead`, `SeededRole.Staff`, …) that maps to the seeded FaithTech City catalogue and cross-org roles.
