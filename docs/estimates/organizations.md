# Estimates: organizations

| Design | Effort | Complete | Visual conformance |
|---|---|---|---|
| hierarchy-and-permissions | 8 days | 100% | — |
| org-owned-data-and-context | 10 days | 95% | — |
| membership-and-joining | 6 days | 95% | — |
| cross-org-roles | 5 days | 85% | — |
| catalogue-admin | 8 days | 85% | — |
| feature-flags | 3 days | 100% | — |
| branding-and-public-pages | 5 days | 95% | — |
| agents | 6 days | 85% | — |
| seed | 2 days | 100% | — |

Evidence: backend integration tests under `backend/tests/QuinntyneBrown.Community.Api.Tests/Organizations/` (access, isolation, membership, visibility levels, branding and contrast, Org Types, catalogue, feature flags, orgs, cross-org roles, agent tokens) and the Playwright specs in `e2e/tests/organizations/`.

Not yet done:

- org-owned-data-and-context: the e2e fake carries a record's org for workspaces only; other features' fakes still treat every record as FaithTech Toronto's.
- membership-and-joining: the Org Lead's view of its own org's audit log (`docs/mocks/pages/organization/audit-log`); "Change roles" on the members page opens the person's profile.
- cross-org-roles: the server creates, edits and narrows cross-org roles, but the screens only list and assign them; creating a role, narrowing an assignment and unassigning have no screen yet.
- catalogue-admin: roles are edited in a dialog rather than the mock's side panel (AGENTS.md: no inline forms), reorder is move up and down only (no indent and outdent buttons), and the Member bundle and Org Type name have no screen.
- branding-and-public-pages: the shell header does not yet take the org's accent; the switcher's mark does.
- agents: the Org Lead's Agents tab in org settings, and the "Agent" badge in activity feeds.
- Visual conformance is not graded: the journey videos and their screenshots could not be re-recorded in this environment (see `docs/journeys.md`).
