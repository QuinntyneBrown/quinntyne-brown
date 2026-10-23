# 0027. GitHub sign-in

- Status: Accepted
- Date: 2026-10-23
- Requirements: L1-001, L2-079, L2-110
- Designs: `docs/detailed-designs/identity/github-sign-in`

## Context

Google sign-in (ADR 0019) is the only external way in. Many builders already have a GitHub account, and ADR 0019 left room for a second provider without changing its linking rule. GitHub is an OAuth 2.0 provider, not an OpenID Connect one: there is no ID token to validate and no nonce. The account rules are the same as Google's: never create a role, refuse suspended accounts with the same message as password sign-in, link to an existing account only by a verified matching email, and keep the client id and secret out of the repository.

## Decision

- **Authorization code flow with PKCE.** `GET /api/account/github/start` creates a random `state` and a PKCE code verifier, stores them with the return URL in a data-protected, `HttpOnly`, `Secure`, `SameSite=Lax` correlation cookie (`ftc.github`, path `/api/account/github`, 10 minutes), and redirects to `https://github.com/login/oauth/authorize` with scope `read:user user:email` and the S256 code challenge. `GET /api/account/github/callback` deletes the cookie, refuses a missing or mismatched `state` (fixed-time comparison), and asks `IGitHubIdentityProvider` to exchange the code with the client secret and the code verifier. The verifier binds the code to the browser that started the sign-in, where Google uses the nonce. Both endpoints sit in the rate-limited `/api/account` group and are anonymous by explicit opt-in.
- **The identity comes from GitHub's API.** `GitHubIdentityProvider` (Infrastructure) posts the code to `https://github.com/login/oauth/access_token`, then reads `GET https://api.github.com/user` (the numeric `id`, `login`, `name`) and `GET https://api.github.com/user/emails` with the access token. The access token is used for those two reads and never stored. The email is the account's **primary** email and its `verified` flag; the stable key is the numeric user id, never the login, which can be renamed.
- **One linking rule for every provider.** The find-by-login, link-by-verified-email, confirm-and-remove-unproven-password and create-with-no-role steps move from `GoogleSignInHandler` into `ExternalAccounts` (Application). `GoogleSignInHandler` and `GitHubSignInHandler` each exchange their code and then call it with their provider name (`Google`, `GitHub`), so the rule cannot drift between them. Suspension uses the shared `AccountStatus.IsSuspendedAsync`.
- **One correlation cookie implementation.** `GoogleCorrelation`'s cookie logic becomes `SignInCorrelation`, with `GoogleCorrelation` and `GitHubCorrelation` naming their cookie, path and data-protection purpose, so a Google cookie never unlocks a GitHub callback.
- **Outcomes return to the right app.** Success signs in the short-lived `ftc.session` cookie and redirects to `<WebApp:Origin>/auth/continue`, as Google does. Failure redirects to `<Marketing:Origin>/?github=failed` or `?github=suspended`; the reason is never more specific than the password path's.
- **No schema change.** The login is an `AspNetUserLogins` row (provider `GitHub`, key = the user id). No migration.
- **Configuration.** `GitHub:ClientId` and `GitHub:ClientSecret` come from configuration or environment variables (`GitHub__ClientId`, `GitHub__ClientSecret`), and in Azure from Key Vault (`github-client-id`, `github-client-secret`) behind `githubSignInEnabled`. When they are missing the start endpoint returns the visitor to the marketing page with `?github=failed`.

## Consequences

- An account may hold both a Google and a GitHub login; each is linked the first time it is used with the account's verified email.
- A GitHub account whose primary email is unverified cannot sign in, even if a secondary email is verified; the person can verify it at GitHub or use another way in.
- The GitHub button on the community app's own sign-in page, and unlinking a provider from Settings, are deferred, as they are for Google.
- The e2e fake plays GitHub too (`github.com` is routed), so the suite never reaches the network.
