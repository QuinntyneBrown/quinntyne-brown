# 0037. Org-addressed URLs, the org switcher and light branding

- Status: Accepted
- Date: 2026-10-23
- Requirements: L2-144, L2-145, L2-149, L2-155, L2-156
- Designs: `docs/detailed-designs/organizations/org-owned-data-and-context`, `docs/detailed-designs/organizations/branding-and-public-pages`
- Proposal: `docs/proposals/organization-hierarchy.md` (D11, D15)
- Refines: ADR 0009 (shell navigation by role), ADR 0016 (home page in the shell)

## Context

With several orgs, every screen needs an active org, links must be shareable, and the server must validate the org on each request. People who cover several orgs need a combined view. Public event pages must say whose event they are. The web app hid controls by role name (ADR 0009); roles are now data (ADR 0033), so it needs another way to know what the caller may do.

## Decision

### Routes

- Signed-in app pages live under **`/o/{orgSlug}/…`** (for example `/o/faithtech-toronto/events/…`). **`/o/all/…`** is the "All orgs" view for People, Workspaces, My work, Resources, Notes and Search. Home, Events and other pages in "All orgs" show combined, org-labelled lists; anything that creates hides its button there or asks which org.
- **Old URLs redirect.** A guard on the pre-org paths (`/events/…`, `/partners/…`, `/workspaces/…` and every other app section) rewrites them to `/o/{active org}/…`, where the active org is the last org opened, else the caller's first org. Feature libraries keep their relative routes and the shell supplies the prefix; their absolute links pass through the same redirect, so no link breaks.
- **Slugs** are unique platform-wide, lower-case, `a-z`, `0-9` and hyphens, 3 to 40 characters, and `all` is reserved. The Portfolio Lead can change a slug; the old one is kept as an `OrgSlugAlias` row, and the web app follows `GET /api/orgs/resolve/{slug}` (`{ slug }` of the current slug, or `404`) to redirect.
- The web app sends the active slug (or `all`) to the API as `X-Org` (ADR 0034).

### The switcher

- `ft-org-switcher` in `components`: a button in the shell top bar showing the active org's logo or initial and name, opening a CDK menu of covered orgs (with an org-type caption) and "All orgs". It is **hidden when the caller covers one org**. Choosing an org keeps the current section when it exists there (feature on), else goes to the org's home.

### How the web app learns the caller's permissions

- **`GET /api/me/access`** returns the caller's `isSystemAdmin`, `portfolios` (`id`, `name`, `isLead`) and covered `orgs`, each with `id`, `slug`, `name`, `typeName`, `isMember`, `isOrgLead`, `isPortfolioLead`, `canJoinWork`, `features` and `permissions` (the resolved codes), and `branding` (`displayName`, `logoUrl`, `accent`, `accentForeground`). A caller covering no org gets an empty list and the shell shows "Waiting to be added" (L2-142).
- `api` exposes `ACCESS_SERVICE` (`AccessService` contract, `HttpAccessService`). It loads after sign-in, **refreshes on org switch and after any `403`**, and offers `can(code, org?)`, `feature(name, org?)` and `active()` signals. Navigation and pages use it **only to hide controls**; the server stays the authority.
- `api/src/lib/shared/role.ts` loses `ROLES`, `assignableRoles` and `isLead`. Role names shown in the UI come from the API (`{ key, name }`).

### Light branding

- An org has `DisplayName` (defaults to its name), `LogoBlobName` (in blob storage, served through the photo storage abstraction, ADR 0002) and `AccentColour` (`#rrggbb`, optional).
- The accent is applied only as a **scoped token pair**: `--color-org-accent` and `--color-org-accent-foreground`, set on the shell header and public event page. Components read the tokens, never the hex. The accent is used only as a fill behind its foreground (the switcher's mark, the public page's band), never as text on a surface.
- Saving is **refused** (`400`, field `accent`) unless the contrast ratio between the accent and its foreground is at least **4.5:1** (WCAG 2.2 AA for text). The foreground is white or `#111111`, whichever contrasts more; the server computes it and returns it, so the client never guesses.

### Public event pages

- The public page is **`/o/{orgSlug}/events/{id}`** outside the auth guard, with the org's display name, logo and accent. `GET /api/public/events/{id}` (ids are global) now returns `organization` (`slug`, `displayName`, `logoUrl`, `accent`, `accentForeground`). The page answers not found if the slug is neither the event's org's slug nor one of its aliases, and redirects an alias to the current slug.
- The old `/public/events/{id}` route loads the event and **redirects** to `/o/{slug}/events/{id}`. Guest RSVP, cancel and `.ics` keep their API endpoints.
- Sign-in, sign-up and the marketing site stay one shared front door.

## Consequences

- Org-aware links can be shared; pasting one for an org the viewer does not cover shows the not-found page.
- e2e page objects navigate to `/o/{slug}/…`; the fake answers `/api/me/access` and `X-Org`.
- Per-org domains, themes and fonts are out of scope.
