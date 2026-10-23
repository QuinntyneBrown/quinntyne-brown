# 0038. Feature flags per Org Type

- Status: Accepted
- Date: 2026-10-23
- Requirements: L2-147, L2-137
- Designs: `docs/detailed-designs/organizations/feature-flags`
- Proposal: `docs/proposals/organization-hierarchy.md` (D13)

## Context

A start-up has no partner pipeline, City Lead or hackathons. Its members should not see those sections, and its data should not be reachable through their endpoints.

## Decision

- `Domain/Organizations/Feature.cs` lists the features: `profiles` and `notes` are **always on**; `contacts`, `partners`, `team`, `events`, `announcements`, `invites`, `resources`, `agile` and `reports` can be switched. Each permission code belongs to one feature (ADR 0033).
- `OrgType.EnabledFeatures` stores the switchable features that are on. There are **no per-org overrides**.
- The access resolver drops a disabled feature's permissions from every holder in orgs of that type, Org Lead and Portfolio Lead included, and `CallerAccess.Covers(org, feature)` is false there. Every handler for a feature asks for its feature with its scope:
  - a by-id request for a record in an org where the feature is off answers **`404`**;
  - a list with `X-Org` naming such an org answers **`404`**; under "All orgs" those orgs are left out;
  - creation in such an org answers `404`.
- The web app hides the section from navigation for the active org (`features` from `/api/me/access`, ADR 0037) and the catalogue editor hides a disabled feature's permissions. Turning a feature off keeps the data; turning it back on shows it again.
- Switching features is a catalogue edit: Portfolio Lead or System Admin only, audited with before and after (ADR 0033).

## Consequences

- "Startup" (seeded with profiles, invites, notes, resources and agile) has no Events, Partners, Contacts, Team, Announcements or Reports sections, and those endpoints answer `404` for its orgs.
- Search and reports skip orgs whose feature is off.
