# 0042. Inbound webhooks for application integrations

- Status: Accepted
- Date: 2026-10-23
- Requirements: L1-026, L2-158 to L2-167
- Designs: `docs/detailed-designs/integrations` (ICD: `docs/detailed-designs/integrations/icd`)
- Prompt: `docs/prompts/integrations-prompt.md`

## Context

Applications that QuinntyneBrown.Community reports on want to send it events. The first is Goodwork (goodwork.rocks), a separate .NET site that today emails its contact requests and will post them here instead. Each application belongs to one organization (L1-025); the people whose coverage includes that org read its events. Nothing calls an application back.

Three questions needed an answer: how events travel (push, poll or broker), how an anonymous publisher gets past the private-preview wall (ADR 0026) and the "authenticated by default" rule, and how the signing secrets are stored.

## Decision

- **Signed HTTPS push.** Publishers `POST` JSON to `/api/webhooks/events` with `X-Webhook-Source`, `X-Webhook-Timestamp` (Unix seconds) and `X-Webhook-Signature` (`sha256=` and the hex HMAC-SHA256 of `timestamp + "." + rawBody`, keyed with the source's secret). Polling was rejected because every publisher would need an API of its own for us to read, and we would own its schedule and failures; a broker (Service Bus, Event Grid) was rejected because it adds infrastructure, a second identity system and cost for one low-volume publisher, and it still needs a per-publisher credential. HMAC push needs nothing but HTTPS on both sides and is what publishers already know from Stripe and GitHub. The contract is the ICD.
- **Authentication by signature, not by session.** The endpoint is the only anonymous one in the feature (`AllowAnonymous`, opted in explicitly). The handler looks the source up, refuses a revoked source, an archived org or an org whose type has `integrations` off, refuses a timestamp more than 300 seconds from the server's clock (`TimeProvider`), and compares the decoded signature with the expected one using `CryptographicOperations.FixedTimeEquals`. Every refusal is the same `401` problem, so a caller cannot tell an unknown source from a bad signature.
- **Exact-path exemption from the private-preview wall.** `PrivatePreviewGateMiddleware` lets `POST /api/webhooks/events` through, exactly as it lets `GET /health/live` through: method and path must match exactly (no prefix, no other method). A publisher has no browser and cannot unlock the wall, and the signature is a stronger check than the unlock cookie. The exemption opens nothing else: the endpoint answers only signed requests from registered sources, writes only `IntegrationEvent` rows and returns nothing about the product.
- **Secrets encrypted with ASP.NET Data Protection, not hashed.** Verifying an HMAC needs the raw secret, so a one-way hash (as used for agent tokens, ADR 0036, and the wall passphrase, ADR 0026) cannot work. The secret (`whsec_` and 32 random bytes in base64url) is protected by an `IDataProtector` with its own purpose string (`QuinntyneBrown.Community.Integrations.SigningSecret.v1`), so no other protected payload decrypts as one, and stored as ciphertext with its first 10 characters for display. It is returned in plain text exactly once, in the response that creates it (register or rotate).
- **The Data Protection key ring is persisted in the database.** Until now the key ring lived in the container's file system and was lost on every deployment (ADR 0026 noted it was not persisted). That was tolerable for short-lived tokens; it is not for secrets that must decrypt for months. The key ring is now stored in the `DataProtectionKeys` table through `PersistKeysToDbContext<CommunityDbContext>`, with the application name `QuinntyneBrown.Community`, so the API and the Cli share one ring and it survives restarts. Unsubscribe links and connect tokens also stop breaking on deployment as a result.
- **Rotation overlaps by 24 hours.** Rotating moves the current ciphertext to `PreviousSecretCiphertext` with `PreviousSecretExpiresAt = now + 24h` and generates a new secret. Verification tries the current secret, then the previous one while it has not expired. Rotating again inside the window discards the older previous secret.
- **Revocation is permanent.** `RevokedAt` is set once; there is no un-revoke. Events stay.
- **Rate limit per source.** A fixed window of 60 requests a minute partitioned by the `X-Webhook-Source` header (`RateLimits:WebhookPerMinute`), as the named policy `webhook` on the endpoint, answering `429` with `Retry-After` from the limiter's metadata. The global per-address limiter still applies, so floods from unknown sources are bounded per address.
- **Idempotency by `(IntegrationAppId, EventId)`.** A unique index on the pair; the handler checks first and treats a unique-key violation on save as a duplicate, answering `200` and keeping the first payload.
- **Permissions and feature.** `integrations.view` and `integrations.manage` belong to the new switchable feature `integrations` (ADR 0033, ADR 0038), on for both seeded Org Types. Org Lead, Portfolio Lead and System Admin hold both by tier; the seeded Staff and Portfolio cross-org roles hold `integrations.view`; Member holds neither. The migration adds the feature and the permission to the rows the seed created earlier, because the seed only inserts what is missing.

## Consequences

- The database now holds both the ciphertext and the key ring. A copy of the whole database therefore exposes the secrets, while a leaked `IntegrationApps` table, log or API response does not. Wrapping the key ring with Azure Key Vault (`ProtectKeysWithAzureKeyVault`) is the next hardening step and is deferred; it needs a Key Vault key and the container app's identity granted wrap and unwrap.
- Losing the `DataProtectionKeys` rows makes every stored secret unreadable; the fix is to rotate each application's secret. Backups must include the table.
- The ICD is public: changing the envelope or the signing scheme is a breaking change for publishers and needs a new event type name or a new signature prefix.
- Outbound webhooks, replay, notifications on arrival, per-address webhook limits, retention and `409` for a conflicting duplicate are deferred.
