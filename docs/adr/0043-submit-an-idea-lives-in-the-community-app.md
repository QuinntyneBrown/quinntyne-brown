# 0043. Submit an idea lives in the community app

- Status: Accepted
- Date: 2026-10-24
- Requirements: L1-027, L2-168, L2-171, L2-174, L2-181
- Designs: `docs/detailed-designs/ideas/submit`, `docs/detailed-designs/ideas/idea-form`
- Prompt: `docs/prompts/ideas-prompt.md`

## Context

Submit an idea (`docs/mocks/pages/submit-idea`) is a public page at `/ideas/new` that anyone can open. Signed out, it shows the public top bar (the brand and Sign in) and three steps; signed in, it shows the app shell, the member's name and, depending on the Idea form switches, two more steps. The repository has two Angular applications: the community app, which already serves the one other public page (the public event page, behind `PublicShellComponent`), and the marketing application (ADR 0018), which depends only on `components` and `api`, holds no session and cannot read the community app's tokens.

## Decision

- **The page is a route of the community app, in a new feature library `frontend/projects/ideas/`.** The library exports `IDEAS_ROUTES` (the wizard) and `IDEA_FORM_ROUTES` (the System Admin page) through its `public-api.ts`, depends only on `components` and `api`, and never calls `HttpClient`.
- **One address, two shells.** `app.routes.ts` maps `ideas` twice: first under `PublicShellComponent` with a `canMatch` guard (`signedOutMatch`) that matches only when the visitor is not signed in, then inside the authenticated `AppShellComponent`. A visitor who signs in from the page comes back to `/ideas/new` (the public shell's Sign in keeps the address as `returnUrl`).
- **The Idea form is `/admin/ideas`**, a child route of the app shell placed before the `admin` library's routes, so it sits beside Users and Audit log; the Admin section tabs gain "Idea form".
- **Not in the marketing application.** The signed-in variant needs the session, the profile and the app shell, which only the community app has; putting the signed-out variant on the marketing host would split one wizard across two applications and duplicate the hand-off ADR 0018 exists to avoid. The marketing page may link to `/ideas/new` on the community host; nothing else changes there.

## Consequences

- The private-preview wall (ADR 0026) covers the page like every other community page: a visitor unlocks the wall first. The submit endpoint needs no wall exemption.
- `AGENTS.md` lists `frontend/projects/ideas/`, and `docs/detailed-designs/ideas/`, `docs/estimates/ideas.md`, `e2e/tests/ideas/` follow the same-name rule.
- The Wizard, tile choices, review section and preview card are built once in `components`, as the design system defines them.
