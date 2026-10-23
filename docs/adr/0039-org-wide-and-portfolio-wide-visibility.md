# 0039. Visibility levels: Org-wide and Portfolio-wide

- Status: Accepted
- Date: 2026-10-23
- Requirements: L2-148
- Designs: `docs/detailed-designs/organizations/org-owned-data-and-context`, `docs/detailed-designs/resources`, `docs/detailed-designs/notes`
- Proposal: `docs/proposals/organization-hierarchy.md` (D14)
- Supersedes in part: ADR 0017 (Global visibility), ADR 0025 (Global and Staff rules)

## Context

Resources and note pages were Private, Shared or Global, where Global meant "every signed-in member" of the one community. With several orgs, Global has to mean something narrower, and the Portfolio Lead needs a way to publish documents to every org. Private items must stay the strongest promise: today only the owner and an audited System Admin see them.

## Decision

- Levels are **Private**, **Shared**, **Org-wide** (was Global) and **Portfolio-wide** (new). The stored value `Global` is renamed `OrgWide`; there is no data to migrate (ADR 0040).

| Level | Who sees it |
|---|---|
| Private | The owner; System Admin, audited |
| Shared | The owner, named people who cover the item's org, holders of a named catalogue role **in the item's org**, and holders of a named cross-org role covering the org; live |
| Org-wide | Everyone who covers the item's org (members and covering cross-org roles, Org Lead, Portfolio Lead) |
| Portfolio-wide | Everyone who covers any org in the item's portfolio |

- **Only the Portfolio Lead** (or System Admin) may set Portfolio-wide; anyone else gets `403`. Defaults are unchanged: resources Org-wide, note pages Private.
- Shared audiences store `RoleDefinitionId` or `CrossOrgRoleId` instead of a `Role` value.
- **Private items** (private contacts and their notes, private resources and note pages) are visible only to the owner and to System Admin, audited. The Portfolio Lead, Org Lead and cross-org roles **never** see them, even though they hold every other permission in scope. This check is explicit in `ContactAccess`, `ResourceAccess` and `NoteAccess` and does not go through `CallerAccess.Has`.
- Only the owner edits, shares, archives, restores or transfers, as before; System Admin overrides are audited. The Portfolio Lead and Org Lead read non-private items in scope but do not edit other people's items.

## Consequences

- The visibility picker shows "Org-wide (FaithTech Toronto)" and, for the Portfolio Lead only, "Portfolio-wide".
- A note page's children and backlinks follow the same rule, so a Portfolio-wide parent never reveals a Private child.
