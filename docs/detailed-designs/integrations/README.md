# Integrations

## Overview

The `integrations` subsystem lets other applications push events to QuinntyneBrown.Community and shows those events to the people who run the receiving organization. The first publisher is Goodwork (goodwork.rocks), which posts its website's contact requests instead of emailing them.

- **application** — an external site or service registered to exactly one organization (`IntegrationApp` in code, "Applications" in the UI, because `Application` is already a namespace in the solution)
- **source ID** — the application's public identifier, `src_` and 32 lowercase hex characters, sent in `X-Webhook-Source`
- **signing secret** — `whsec_` and 32 random bytes in base64url; shown once, stored encrypted, used to verify each request's HMAC-SHA256 signature
- **event** — one delivery from an application (`IntegrationEvent`), identified by the publisher's `eventId` and typed by `eventType` (`contact-request.created` in version 1)

The feature only receives. It never calls an application, and receiving an event notifies no one (deferred).

The agreed decisions are in [ADR 0042](../../adr/0042-inbound-webhooks-for-integrations.md) and `docs/prompts/integrations-prompt.md`; the requirements are `L1-026` (`docs/specs/L1.md`) and `L2-158` to `L2-167` (`docs/specs/L2.md`); the publisher's contract is the [ICD](icd/README.md).

## Description

| Design | Covers | Requirements |
|--------|--------|--------------|
| [icd](icd/README.md) | The public interface control document for publishers: endpoint, headers, signature, envelope, `contact-request.created`, responses, retries, rotation, versioning, a C# sample | `L2-159` to `L2-164` |
| [manage-applications](manage-applications/README.md) | `IntegrationApp`, register, rotate, revoke, secret encryption, permissions, feature flag, audit | `L2-158`, `L2-159`, `L2-160`, `L2-167` |
| [receive-events](receive-events/README.md) | `POST /api/webhooks/events`: wall exemption, rate limit, size cap, signature, timestamp window, validation, idempotency, `IntegrationEvent` | `L2-161` to `L2-164` |
| [application-events](application-events/README.md) | Listing applications and their events within coverage, navigation, the Angular `api` contract and `integrations` library, the e2e fake | `L2-165`, `L2-166` |

Changes to existing designs: [organizations › feature flags](../organizations/feature-flags/README.md) gains the switchable feature `integrations`; [organizations › hierarchy and permissions](../organizations/hierarchy-and-permissions/README.md) gains `integrations.view` and `integrations.manage`; the shell navigation (ADR 0009, `L2-155` AC3) gains Applications.

## Requirements

The subsystem traces to `L1-026` (Application integrations) and the ten L2 requirements listed per design above.

## Diagrams

Each design holds its own C4 context, container and component diagrams, a class diagram and one sequence diagram per behaviour, as PlantUML sources in `diagrams/` with rendered PNG files beside them.

## Open questions

- **Settled: push, not poll or broker** — HMAC-signed HTTPS push ([ADR 0042](../../adr/0042-inbound-webhooks-for-integrations.md)).
- **Settled: secrets are encrypted, not hashed** — an HMAC needs the raw secret; the Data Protection key ring is persisted in the database so ciphertext survives deployments.
- Wrapping the key ring with Azure Key Vault is deferred hardening.
- Deferred, not built: outbound webhooks, replay, custom views for event types other than contact requests, notifications on arrival, replying to or marking contact requests, un-revoke, retention or purge, a per-address webhook limit and `409` for a duplicate `eventId` with a different payload.
