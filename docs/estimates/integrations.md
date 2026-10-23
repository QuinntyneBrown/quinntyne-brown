# Estimates: integrations

| Design | Effort | Complete | Visual conformance |
|---|---|---|---|
| icd | 1 day | 100% | — |
| manage-applications | 3 days | 100% | — |
| receive-events | 3 days | 100% | — |
| application-events | 4 days | 95% | — |

Evidence: backend integration tests under `backend/tests/QuinntyneBrown.Community.Api.Tests/Integrations/` (register, receive, duplicates and validation, rate limit, coverage and the feature flag, rotate and revoke, audit) and `PrivatePreview/WebhookExemptionTests.cs`; the Playwright specs in `e2e/tests/integrations/` (Applications, application events and navigation, rotate and revoke, each screen checked with axe); unit specs for `ft-secret-field`, `ft-event-entry` and `HttpIntegrationsService`.

Not yet done:

- application-events: no journey video records the Applications screens yet, so visual conformance is not graded.
- Deferred by design (ADR 0042): wrapping the Data Protection key ring with Azure Key Vault, outbound webhooks, replay, notifications on arrival, replying to or marking contact requests, un-revoke, retention, a per-address webhook limit and `409` for a conflicting duplicate.
