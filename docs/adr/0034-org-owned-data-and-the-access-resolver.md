# 0034. Org-owned data and the access resolver

- Status: Accepted
- Date: 2026-10-23
- Requirements: L1-025, L2-135, L2-139, L2-140, L2-146, L2-150 to L2-153
- Designs: `docs/detailed-designs/organizations/org-owned-data-and-context`, `docs/detailed-designs/platform/server-authorization`
- Proposal: `docs/proposals/organization-hierarchy.md` (D1, D9, D12, D16, Enforcement)
- Refines: ADR 0004, ADR 0011, ADR 0014

## Context

All data was global: any member saw any event, partner, resource or workspace their role allowed. A second organization must not see the first one's data, and people who cover several orgs (the Portfolio Lead, the "Portfolio" and "Staff" cross-org roles) must see each covered org without being made a member of every one. Every query, search and endpoint must enforce this on the server, and a change to a role must take effect on the next request.

## Decision

### Which records carry an org

- Every **aggregate root** has a required, indexed `OrganizationId`: `Event`, `Partner`, `Contact`, `PendingConnection`, `Resource`, `NotePage`, `Workspace`, `Announcement`, `Invite` and `ConnectLink`.
- **Children belong to their root's org** and carry no column of their own: RSVPs and check-ins (event), partner activities, stage changes and duplicate dismissals (partner), contact notes and photos (contact), resource files and tags (resource), blocks, links, shares and images (note page), work items, sprints, comments and poker sessions (workspace), announcement recipients (announcement). A child is only reached through its root, so the root's check covers it.
- `Notification` and `AuditEntry` have a **nullable** `OrganizationId` (platform actions such as suspending an account have none) and `AuditEntry` a nullable `PortfolioId`.
- **Profiles are global** (one per person). Their visibility is a separate rule (below).

### The access resolver

- `AccessResolver` (Application/Organizations) builds a `CallerAccess` for the signed-in caller from the database: System Admin flag, Portfolio Lead rows, org memberships and Org Lead flags, catalogue role assignments, cross-org assignments (scope resolved live, ADR 0035), each org's type, enabled features and slug. For each covered org it holds the permission set, whether the caller is a member, Org Lead or Portfolio Lead there, and whether they may join work.
- **Cached per request only.** `CurrentAccessMiddleware` (Api, replacing `CurrentRolesMiddleware`) calls the resolver once after authentication and stores the result in `HttpContext.Items`; `ICurrentUser.Access` returns it. Nothing about permissions is cached across requests and tokens carry identity only, so a grant, removal or catalogue edit applies on the caller's next request.
- `CallerAccess` answers: `Covers(org)`, `Covers(org, feature)`, `Has(org, code)`, `HasByRole(org, code)` (granted by a role, not a tier), `IsOrgLead(org)`, `IsPortfolioLead(org)`, `OrgsWith(code)` and `ReadScope(feature)`.

### The active org on API requests

- The web app sends the active org with every API request as the **`X-Org` header**: an org slug, or `all` for the "All orgs" view (ADR 0037). API routes keep their shape (`/api/events`, `/api/partners/{id}`); the org is context, not a path segment, so the 25 endpoint groups and their contracts stay stable.
- A header naming an org the caller does not cover, or that does not exist, makes the request's scope empty: lists return nothing and creation returns `404`, so an org's existence is not revealed.
- Without a header, **reads** cover every org the caller covers (as "All orgs"), and **creation** uses the only org the caller may create in; if there are several, the API answers `400` with "Choose an organization". This keeps integrations and the one-org case simple.
- **By-id requests ignore the header** and use the record's own `OrganizationId`. A record whose org the caller does not cover, or whose feature is off there (ADR 0038), answers `404`. A covered record the caller lacks the permission for answers `403`, as before.

### Query scoping is explicit

- Handlers scope queries with explicit predicates built from `CallerAccess.ReadScope(feature)` (a list of org ids): `db.Events.Where(e => scope.Contains(e.OrganizationId))`. **EF global query filters are not used**: they hide the rule from the handler, are easy to bypass with `IgnoreQueryFilters`, and the scope depends on the feature being read.
- Private-item rules (ADR 0039) stay explicit beside the org predicate in each `*Access` class; no tier but System Admin passes them.

### Profile visibility

- A profile is visible to its owner, to System Admin, and to anyone whose covered orgs include an org the profile is a member of. For a plain member, covered orgs are their own orgs, so this is "you share an org"; for cross-org roles and the Portfolio Lead it is "you cover one of their orgs" (D9). `ProfileVisibility.WhereVisibleTo(access)` is the one predicate used by People, search, pickers, mentions, workspace member pickers and `GET /api/profiles/{id}`; anything else is `404`.

## Consequences

- Every list, search source and report applies the scope predicate; the backend tests seed two orgs and assert `404` across them for every feature.
- Lists and search results carry the record's org (`organization: { id, slug, name }`) so "All orgs" can label rows.
- A per-request resolver costs a handful of indexed queries per request; this is acceptable at the expected scale and keeps revocation immediate. A cross-request cache would need invalidation on every grant and catalogue edit and is deferred.
