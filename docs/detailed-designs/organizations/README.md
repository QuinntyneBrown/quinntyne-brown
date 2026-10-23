# Organizations

## Overview

The `organizations` subsystem turns QuinntyneBrown.Community from one community into a portfolio of organizations of configurable types. System Admin, Portfolio Lead, Org Lead and Member are built-in tiers; Org Types, role catalogues, enabled features, organizations and cross-org roles are data. The server checks permission codes defined in code, resolved from the database on every request, and every record belongs to exactly one org.

The agreed decisions are in `docs/proposals/organization-hierarchy.md` and ADRs 0033 to 0041; the requirements are `L1-025` (`docs/specs/L1.md`) and `L2-134` to `L2-157` (`docs/specs/L2.md`). `docs/roles-and-permissions.txt` is the plain-language guide.

## Description

| Design | Covers | Requirements | ADRs |
|--------|--------|--------------|------|
| [hierarchy-and-permissions](hierarchy-and-permissions/README.md) | Data model, permission code list, `AccessResolver` and `CallerAccess` contract, grant chain and role endpoints | `L2-134`, `L2-135`, `L2-136` | [0033](../../adr/0033-permission-codes-and-role-catalogues.md), [0034](../../adr/0034-org-owned-data-and-the-access-resolver.md) |
| [org-owned-data-and-context](org-owned-data-and-context/README.md) | `OrganizationId` on roots, `X-Org`, query scoping, profile visibility, visibility levels, reports, announcements, notifications, search and audit scoping, `GET /api/me/access`, slug routing, redirects, switcher, "All orgs" | `L2-139`, `L2-140`, `L2-144`, `L2-145`, `L2-148`, `L2-150` to `L2-153`, `L2-155` | [0034](../../adr/0034-org-owned-data-and-the-access-resolver.md), [0037](../../adr/0037-org-addressed-urls-switcher-and-branding.md), [0039](../../adr/0039-org-wide-and-portfolio-wide-visibility.md) |
| [membership-and-joining](membership-and-joining/README.md) | Org-bound invites and connect links, "Waiting to be added", adding and removing members, Org Lead flag | `L2-141`, `L2-142`, `L2-143` | [0041](../../adr/0041-org-bound-invites-and-connect-links.md) |
| [cross-org-roles](cross-org-roles/README.md) | Cross-org roles, live scope, narrowing, `CanJoinWork`, workspaces in one org and owner reassignment | `L2-138`, `L2-146` | [0035](../../adr/0035-cross-org-roles.md) |
| [feature-flags](feature-flags/README.md) | Enabled features per Org Type, `404` for disabled features | `L2-147` | [0038](../../adr/0038-feature-flags-per-org-type.md) |
| [catalogue-admin](catalogue-admin/README.md) | Org Types, catalogue editor, organizations, slugs, archive | `L2-137`, `L2-156` | [0033](../../adr/0033-permission-codes-and-role-catalogues.md) |
| [branding-and-public-pages](branding-and-public-pages/README.md) | Display name, logo, accent with contrast check, org-addressed public event pages | `L2-149` | [0037](../../adr/0037-org-addressed-urls-switcher-and-branding.md) |
| [agents](agents/README.md) | Agent profiles, `ftca_` personal access tokens, `AgentToken` scheme, attribution | `L2-154` | [0036](../../adr/0036-agent-identities-and-tokens.md) |
| [seed](seed/README.md) | Squashed migration, reset and idempotent seed, `grant-admin` | `L2-157` | [0040](../../adr/0040-reset-and-reseed.md) |

Existing designs that these change carry a short "Organization hierarchy" note pointing here: [server authorization](../platform/server-authorization/README.md), [assign roles](../admin/assign-roles/README.md), [audit log](../admin/audit-log/README.md), the invites, agile, resources, notes, events, reports, search, announcements, notifications, profiles, contacts, partners and team designs.

## Requirements

The subsystem traces to `L1-025` (Organizations) and the twenty-four L2 requirements listed per design above. Each design lists its L2 requirements with their acceptance criteria.

## Diagrams

Each design holds its own C4 context, container and component diagrams, a class diagram and one sequence diagram per behaviour, as PlantUML sources in `diagrams/` with rendered PNG files beside them.

## Open questions

Three details left open by the proposal are settled:

- **Agent authentication** — a hashed personal access token (`ftca_…`) checked by its own `AgentToken` authentication scheme, not an OpenIddict client-credentials application per agent ([ADR 0036](../../adr/0036-agent-identities-and-tokens.md), [agents](agents/README.md)).
- **Resolver caching and scoping** — `AccessResolver` runs once per request and is cached for that request only; handlers scope queries with explicit predicates, not EF Core global query filters ([ADR 0034](../../adr/0034-org-owned-data-and-the-access-resolver.md)).
- **How the web app learns permissions** — `GET /api/me/access`, loaded after sign-in and refreshed on org switch and after any `403` ([ADR 0037](../../adr/0037-org-addressed-urls-switcher-and-branding.md)).
