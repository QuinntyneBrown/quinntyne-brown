# 0036. Agent identities and personal access tokens

- Status: Accepted
- Date: 2026-10-23
- Requirements: L2-154
- Designs: `docs/detailed-designs/organizations/agents`
- Proposal: `docs/proposals/organization-hierarchy.md` (D7)

## Context

AI agents are to read and do work in the orgs they are given, attributed to themselves, with credentials that a Portfolio Lead (or an Org Lead for their own org) can issue, scope, expire and revoke. People sign in with OpenIddict's authorization code flow with PKCE (ADR 0006, ADR 0019); agents have no browser, no password and no email.

Two options were considered:

1. **An OpenIddict client-credentials application per agent.** Tokens would be JWTs with no subject unless a custom handler adds one; revoking a client leaves issued access tokens valid until they expire unless token-entry validation is on; the secret is as long-lived as a token; and an application registration per agent puts the agent's identity in OpenIddict's tables rather than beside its profile.
2. **A hashed personal access token checked by its own authentication scheme.**

## Decision

- Option 2. An **agent** is a `Profile` with `Kind = Agent`, with a `CommunityUser` row that has **no password, no email and no external logins**, so the existing `UserId → ProfileId` path, role checks and audit attribution work unchanged. Password, Google and GitHub sign-in refuse it because it has none of them.
- An **`AgentCredential`** row holds `AgentProfileId`, `Name`, `TokenHash` (SHA-256, unique), `Prefix` (first 8 characters, shown in the list), `IssuedById`, `OrgIds` (the scope: a subset of orgs the issuer leads), `CreatedAt`, `ExpiresAt` (1 to 90 days, default 30), `RevokedAt` and `LastUsedAt`.
- The token is `ftca_` + 32 random bytes, base64url. It is **shown once** when issued and never stored in plain text.
- The `AgentToken` authentication scheme (Api) reads `Authorization: Bearer ftca_…`, hashes the token, and accepts it only if the credential exists, is not revoked or expired, and the agent is not suspended. A policy scheme forwards bearer tokens with that prefix to `AgentToken` and everything else to OpenIddict validation, so endpoints and the fallback "authenticated" policy are unchanged.
- The principal carries the agent's user id and the credential id. `AccessResolver` **intersects** the agent's covered orgs with the credential's `OrgIds`, so a token can never reach further than both its agent's roles and its issuer's choice.
- `LastUsedAt` is updated at most once a minute per credential.
- **Who issues:** the Portfolio Lead for agents in any org of the portfolio, or an Org Lead for an agent whose token is scoped to their own org only. Only the issuer, the Portfolio Lead or System Admin revoke. Issuing and revoking are audited.
- **Attribution:** the actor of every write is the agent's profile; audit entries for writes made with a token also record the credential id and its issuer in `Detail`. Activity feeds show the agent's name with an "Agent" badge.
- Agents hold roles like people: org membership plus catalogue roles, or a cross-org role (usually "Portfolio"). They are **hidden from People search and directory lists by default** (`includeAgents=true` shows them) and appear in pickers with the badge.

## Consequences

- Revocation is immediate, because every request looks the credential up.
- Agents cannot use the web app; they call the API.
- OAuth client credentials for third-party integrations can be added later beside this scheme without changing agents.
