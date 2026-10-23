# 0041. Org-bound invites and connect links

- Status: Accepted
- Date: 2026-10-23
- Requirements: L2-141, L2-142, L2-143
- Designs: `docs/detailed-designs/organizations/membership-and-joining`, `docs/detailed-designs/invites`
- Proposal: `docs/proposals/organization-hierarchy.md` (D10)
- Supersedes in part: ADR 0006 (invites), ADR 0021 (connect links)

## Context

Invites (ADR 0006) and connect links (ADR 0021) let people join the one community. With orgs, joining must put a person into a specific org, and only through that org's links or its leads, so a FaithTech attendee never lands in a start-up by accident.

## Decision

- **Invites** carry an `OrganizationId`. Holders of `invites.send` invite into an org where they hold it; Org Leads and the Portfolio Lead into any org they lead. A pre-assigned role is a `RoleDefinitionId` from that org's catalogue, limited by the inviter's grant rights (ADR 0033). Accepting makes the person a **member** of the org (`JoinedVia = Invite`) and grants the role. An existing account that accepts an invite to another org joins it too.
- **Connect links** carry an `OrganizationId` and are **one per owner per org** (unique `OwnerId, OrganizationId`). Holders of `connectLink.own`, the org's Org Lead and the Portfolio Lead may own one; the rest of ADR 0021 stands (reusable, never expires, replaceable, hashed and protected token, grants no role). The lookup shows the org's display name. Signing up through a link makes the person a member of that org (`JoinedVia = ConnectLink`) when they verify their email, together with the pending contact link (ADR 0022). An owner who loses the right to own a link in that org makes it answer as unknown, as before.
- **Sign-up without a link** creates a profile with **no membership**. The caller covers no org, so `/api/me/access` returns no orgs and the shell shows **"Waiting to be added"**: their own profile, public events and sign-out, nothing else. Google and GitHub sign-up behave the same.
- **Adding and removing:** an Org Lead (their org) or the Portfolio Lead (any org of the portfolio) adds an existing profile they can find by email (`POST /api/organizations/{id}/members`), and removes a member. Removal and leaving delete the person's catalogue roles and Org Lead flag in that org; records they own stay in the org with their owner (D17), and workspaces they owned go through owner reassignment (ADR 0034, D12). The last Org Lead of an org cannot be removed by an Org Lead (`409`); the Portfolio Lead can.
- Adding, removing and role changes in an org are audited when done by the Portfolio Lead or System Admin, and notify the person.

## Consequences

- ADR 0021's "City Leads and System Admins own a link" becomes "`connectLink.own` holders, the Org Lead and the Portfolio Lead, per org".
- A person can belong to several orgs; each membership has its own roles.
