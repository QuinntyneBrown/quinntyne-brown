# Ideas

## Overview

The `ideas` subsystem lets anyone, signed in or not, submit an app idea to the community through a short wizard, and lets System Admin switch two optional steps of that wizard on or off. Every submission notifies System Admin and confirms to the submitter by email. Nothing lists submitted ideas yet: browsing and triage is a follow-up feature.

- **idea** — one submission (`Idea`): the problem and who feels it, the idea's name, pitch and how it works, optional answers, and the submitter
- **platform intake** — the singleton (`IdeaIntake`) that owns every idea, lives in the portfolio's root organization and holds the Idea form switches
- **optional steps** — "How far along is it?" (stage, platform, topics) and "Who do you need?" (skills, involvement, time); shown only to signed-in members, and only when switched on
- **Idea form** — the System Admin page at `/admin/ideas` with the two switches

The agreed decisions are in [ADR 0043](../../adr/0043-submit-an-idea-lives-in-the-community-app.md) (hosting), [ADR 0044](../../adr/0044-ideas-platform-intake-and-anonymous-submit.md) (intake, access, anonymous endpoint, rate limit) and [ADR 0045](../../adr/0045-idea-delivery-by-notification-and-email.md) (delivery), and `docs/prompts/ideas-prompt.md`; the requirements are `L1-027` and `L2-168` to `L2-181`; the mocks are `docs/mocks/pages/submit-idea` and `docs/mocks/pages/idea-settings`.

## Description

| Design | Covers | Requirements |
|--------|--------|--------------|
| [submit](submit/README.md) | The wizard page in both shells, the step rule, each step's validation, the live preview, Review and edit-back, busy/error/success, `POST /api/ideas` (anonymous, validated, rate limited), `Idea`, the `IdeaSubmitted` notification and both emails, the e2e fake | `L2-168` to `L2-180` |
| [idea-form](idea-form/README.md) | `IdeaIntake`, the System Admin settings endpoints and page, `GET /api/ideas/form` for the wizard, audit, the seed | `L2-171`, `L2-181` |

Changes to existing designs: [notifications](../notifications/README.md) gains the kind `IdeaSubmitted`; the Admin section tabs gain Idea form; the `components` library gains the Wizard, tile choices, review section and preview card (`docs/screen-composition.md`).

## Requirements

The subsystem traces to `L1-027` (Ideas) and the fourteen L2 requirements listed per design above.

## Diagrams

Each design holds its own C4 context, container and component diagrams, a class diagram and a sequence diagram per behaviour, as PlantUML sources in `diagrams/` with rendered PNG files beside them.

## Open questions

- **Settled: the page lives in the community app**, in two shells at one address ([ADR 0043](../../adr/0043-submit-an-idea-lives-in-the-community-app.md)).
- **Settled: switches default to on**, replacing the earlier mock note that said off.
- **Settled: no drafts**; answers live only while the page is open.
- Deferred, not built: a screen to browse, review or triage ideas (the follow-up feature), statuses beyond New, replying to a submitter from the app, attachments, and a per-email limit for anonymous submissions.
