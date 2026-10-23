# Server authorization

## Overview

QuinntyneBrown.Community enforces every permission on the server. The UI may hide controls, but no data reaches a caller that the server has not authorized. This design describes the shared authorization mechanism that every feature endpoint and handler uses.

- **fallback policy** — ASP.NET Core authorization policy applied to every endpoint that does not opt out, requiring an authenticated caller
- **anonymous endpoint** — endpoint explicitly marked with `AllowAnonymous`; `L2-042` lists the permitted set
- **permission filter** — predicate added to an EF Core query so that the database returns only rows the caller may see
- **existence hiding** — answering 404 rather than 403 for a resource the caller may not see

The domain rules in `AGENTS.md` define what each caller may see. Every record belongs to one organization, and a caller sees the orgs they cover. The server checks permission codes resolved per org, never role names ([ADR 0033](../../../adr/0033-permission-codes-and-role-catalogues.md), [ADR 0034](../../../adr/0034-org-owned-data-and-the-access-resolver.md)). Private contacts and their notes, and private resources and note pages, belong to their owner and to System Admin only; profiles are visible only to people who share or cover one of the person's orgs. The organization rules are designed in [hierarchy and permissions](../../organizations/hierarchy-and-permissions/README.md) and [org-owned data and context](../../organizations/org-owned-data-and-context/README.md).

## Description

- **Fallback authorization policy** — configured in `Program.cs` with `RequireAuthenticatedUser()`, so every endpoint answers 401 to an unauthenticated call by default.
- **`AllowAnonymous` endpoints** — public events, guest RSVP, sign-up, sign-in, password reset, verification, invite acceptance and announcement unsubscribe. No other endpoint carries the marker.
- **Private preview wall** — while `PrivatePreview:Enabled` is on, `PrivatePreviewGateMiddleware` refuses every request without a valid unlock before routing and authentication run, so even the `AllowAnonymous` endpoints above (public events, guest RSVP, sign-up, sign-in) are reachable only past the wall. The wall adds a gate in front; it changes none of the rules in this design, which apply unchanged once the visitor has unlocked (`L2-101` AC4, `docs/detailed-designs/platform/private-preview-wall`, ADR 0026).
- **`ICurrentUser`** — Application abstraction exposing `UserId`, `ProfileId`, `IsAuthenticated`, `Access` (a `CallerAccess`) and `ActiveOrg`. `HttpCurrentUser` in the Api project takes `UserId` from the validated principal's subject: an OpenIddict access token for people, or an `ftca_` token through the `AgentToken` scheme for agents ([agents](../../organizations/agents/README.md)). It takes `Access` from **`CurrentAccessMiddleware`** (replacing `CurrentRolesMiddleware`), which runs right after authentication and builds the caller's `CallerAccess` through `AccessResolver` once per request, and `ActiveOrg` from the `X-Org` header.
- **Permission freshness policy** — tokens carry identity only, and the server never authorizes with claims inside a token. Every request resolves the caller's System Admin flag, Portfolio Lead rows, memberships, catalogue roles and cross-org roles from the database, cached for that request only. A removed role, a catalogue edit or a revoked agent token stops working on the very next call, even with an old access token. An added role works at once. `GET /api/me/access` returns the resolved permissions per org, and the web app reloads them after sign-in, on org switch and after any `403`. Grant limits, last-admin protection, notifications and auditing are unchanged (`L2-042` AC4, `L2-135` AC3).
- **`IPermissionFilters`** — Application service with query extensions such as `VisibleContacts(ICurrentUser)` and `VisibleWorkItems(ICurrentUser)` that compose `IQueryable` predicates, so list, search and export filters run in SQL. Each predicate starts with the org scope from `OrgScope.Read(feature)` (`WHERE OrganizationId IN scope`) and adds the feature's own rules; profiles use `ProfileVisibility.WhereVisibleTo`. EF Core global query filters are not used.
- **`AuthorizationRules`** — write checks ask `CallerAccess.Has(org, code)` for the record's org; grants go through `RoleGrantPolicy`. A read-only caller such as a Staff cross-org role holder simply lacks the write codes.
- **`NotFoundOrForbidden` convention** — handlers that load by ID through a permission filter return `Result.NotFound` when the filtered query finds nothing, when the record's org is not covered, or when its feature is off for the org's type; endpoints map it to 404. A covered record the caller lacks the permission for is `Result.Forbidden` (403).
- **`ResultMapper`** — Api helper that maps `Result` states to HTTP: `NotFound` → 404, `Forbidden` → 403 (used only for actions on resources the caller may see), `Invalid` → 400.

## Requirements

The feature realizes the following level-2 (L2) requirements. Each L2 requirement refines a level-1 (L1) requirement, cited by identifier.

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-042` | `L1-015` | Authorization on the server |

### Acceptance criteria

**`L2-042` — Authorization on the server**

1. Given any API endpoint, when it is called without authentication, then the response is 401, except for the endpoints explicitly marked anonymous: public events, guest RSVP, sign-up, sign-in, password reset, verification, invite acceptance and announcement unsubscribe.
2. Given a resource the caller is not permitted to see, when it is requested by ID, then the response is 404, not 403, so that its existence is not revealed.
3. Given a list, search or export, when it is built, then the permission filters are applied in the database query, not after loading the data.
4. Given a role added to or removed from a user, when that user next calls the API, including with an access or refresh token issued before the change, then the server authorizes with the profile's current roles, and `/api/me` reports them.

## Diagrams

### System context

Every caller, signed in or anonymous, reaches QuinntyneBrown.Community data only through API checks.

![C4 system context for server authorization](diagrams/c4-context.png)

### Containers

The web app hides controls by role, but the Community API decides; the Community database returns only rows the API query permits.

![C4 container view for server authorization](diagrams/c4-container.png)

### Components

The fallback policy rejects unauthenticated calls before any endpoint runs. Handlers read `ICurrentUser` and apply `IPermissionFilters` inside the query, and `ResultMapper` turns results into status codes.

![C4 component view for server authorization](diagrams/c4-component.png)

### Class structure

`HttpCurrentUser` realizes `ICurrentUser`. `IPermissionFilters` and `AuthorizationRules` depend on it, and `ResultMapper` maps `ResultStatus` to HTTP.

![Class diagram for server authorization](diagrams/class-structure.png)

### Behaviour — authorize a request

An unauthenticated call stops at 401. An authenticated request by ID for an invisible resource returns 404, and list queries apply filters in SQL (`L2-042`).

![Sequence diagram for authorize a request](diagrams/sequence-authorize-request.png)

## Open questions

- **Settled: the access resolver is cached per request and queries are scoped explicitly** ([ADR 0034](../../../adr/0034-org-owned-data-and-the-access-resolver.md)). Nothing about permissions is cached across requests; handlers write the org predicate themselves instead of relying on EF Core global query filters, which hide the rule and are bypassed by `IgnoreQueryFilters`.
- **Settled: agents authenticate with a hashed personal access token** through the `AgentToken` scheme; a policy scheme forwards `Bearer ftca_…` to it and every other bearer token to OpenIddict validation, so the fallback policy and the `AllowAnonymous` list are unchanged ([ADR 0036](../../../adr/0036-agent-identities-and-tokens.md)).
- **Settled: the web app learns permissions from `GET /api/me/access`**, refreshed on org switch and after any `403`, and uses them only to hide controls ([ADR 0037](../../../adr/0037-org-addressed-urls-switcher-and-branding.md)).
- The anonymous public event endpoint keeps its `AllowAnonymous` marker and adds the event's org branding to its response ([branding and public pages](../../organizations/branding-and-public-pages/README.md)).
