import { Route } from '@playwright/test';

import type { MockAccount, MockProfile } from './mock-api';
import type { MockOrganizations } from './mock-organizations';

/** What the integrations fake reads from the rest of the fake backend. */
export interface IntegrationsContext {
  readonly profiles: Map<string, MockProfile>;
  readonly now: Date;
  /** The orgs and what each caller covers (ADR 0033). */
  readonly organizations: MockOrganizations;
}

/** An application as the fake stores it; the secret is kept only so tests can sign deliveries. */
export interface MockIntegrationApp {
  id: string;
  orgSlug: string;
  name: string;
  sourceId: string;
  secret: string;
  createdAt: string;
  createdById: string;
  rotatedAt: string | null;
  previousSecretExpiresAt: string | null;
  revokedAt: string | null;
  revokedById: string | null;
}

export interface MockIntegrationEvent {
  id: string;
  appId: string;
  eventId: string;
  eventType: string;
  occurredAt: string;
  receivedAt: string;
  data: Record<string, unknown>;
}

const PAGE_SIZE = 25;
const HOUR = 60 * 60 * 1000;
const CONTACT_REQUEST = 'contact-request.created';

let sequence = 0;
const hex = (length: number) =>
  Array.from({ length }, (_, i) => ((sequence * 7 + i * 13) % 16).toString(16)).join('');

/**
 * Plays the integrations endpoints (backend/src/QuinntyneBrown.Community.Api/Endpoints/IntegrationsEndpoints.cs,
 * docs/detailed-designs/integrations): list, get, events, register, rotate and revoke, with the server's coverage
 * and permission rules (`integrations.view`, `integrations.manage`; 404 outside coverage or with the feature off).
 * `deliver` adds an event as an accepted webhook would. Fail a route with `api.on(...)`.
 */
export class MockIntegrations {
  readonly apps: MockIntegrationApp[] = [];
  readonly events: MockIntegrationEvent[] = [];

  constructor(private readonly context: IntegrationsContext) {}

  /** Registers an application directly, as an Org Lead would have (Goodwork in FaithTech Toronto by default). */
  add(app: Partial<MockIntegrationApp> & { name: string }): MockIntegrationApp {
    sequence += 1;
    const full: MockIntegrationApp = {
      id: `app-${sequence}`,
      orgSlug: 'faithtech-toronto',
      sourceId: `src_${hex(32)}`,
      secret: `whsec_${hex(43)}`,
      createdAt: new Date(this.context.now.getTime() - 24 * HOUR).toISOString(),
      createdById: [...this.context.profiles.keys()][0] ?? 'profile-1',
      rotatedAt: null,
      previousSecretExpiresAt: null,
      revokedAt: null,
      revokedById: null,
      ...app,
    };
    this.apps.push(full);
    return full;
  }

  /** Stores an event as POST /api/webhooks/events would after accepting it (L2-161). */
  deliver(
    app: MockIntegrationApp,
    event: Partial<MockIntegrationEvent> & { data: Record<string, unknown> },
  ): MockIntegrationEvent {
    sequence += 1;
    const full: MockIntegrationEvent = {
      id: `event-${sequence}`,
      appId: app.id,
      eventId: `0b1f7c5e-8a43-4f0e-9d0e-${hex(12)}`,
      eventType: CONTACT_REQUEST,
      occurredAt: this.context.now.toISOString(),
      receivedAt: this.context.now.toISOString(),
      ...event,
    };
    this.events.push(full);
    return full;
  }

  handle(
    route: Route,
    method: string,
    url: URL,
    body: Record<string, unknown>,
    caller: MockAccount | null,
  ): Promise<void> | false {
    if (!url.pathname.startsWith('/api/integrations/apps')) return false;
    if (!caller) return route.fulfill({ status: 401 });
    const header = route.request().headers()['x-org'];
    const byId = /^\/api\/integrations\/apps\/([^/]+)(?:\/(events|rotate|revoke))?$/.exec(
      url.pathname,
    );

    if (url.pathname === '/api/integrations/apps' && method === 'GET') {
      const orgs = this.viewable(caller).filter(
        (slug) => !header || header === 'all' || slug === header,
      );
      if (!orgs.length)
        return route.fulfill({ status: 403, json: { status: 403, title: 'Forbidden' } });
      const apps = this.apps
        .filter((a) => orgs.includes(a.orgSlug))
        .sort((a, b) => a.name.localeCompare(b.name));
      return route.fulfill({ status: 200, json: apps.map((a) => this.dto(a, caller)) });
    }

    if (url.pathname === '/api/integrations/apps' && method === 'POST') {
      // TargetFor: the active org, 403 without integrations.manage there.
      const slug = header && header !== 'all' ? header : this.viewable(caller)[0];
      if (!slug || !this.context.organizations.has(caller, 'integrations.manage', slug)) {
        return route.fulfill({ status: 403, json: { status: 403, title: 'Forbidden' } });
      }
      const name = String(body['name'] ?? '').trim();
      if (!name || name.length > 80) {
        return route.fulfill({
          status: 400,
          json: {
            title: 'One or more validation errors occurred.',
            status: 400,
            errors: { name: ['Enter a name of 80 characters or fewer.'] },
          },
        });
      }
      const app = this.add({
        name,
        orgSlug: slug,
        createdAt: this.context.now.toISOString(),
        createdById: caller.profileId,
      });
      return route.fulfill({
        status: 201,
        json: { app: this.dto(app, caller), secret: app.secret },
      });
    }

    if (!byId) return false;
    const app = this.apps.find(
      (a) => a.id === byId[1] && this.viewable(caller).includes(a.orgSlug),
    );
    if (!app) return route.fulfill({ status: 404, json: { status: 404, title: 'Not Found' } });

    if (method === 'GET' && !byId[2])
      return route.fulfill({ status: 200, json: this.dto(app, caller) });
    if (method === 'GET' && byId[2] === 'events') {
      const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
      const all = this.events
        .filter((e) => e.appId === app.id)
        .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt) || b.id.localeCompare(a.id));
      const items = all
        .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
        .map(({ appId: _, ...e }) => e);
      return route.fulfill({
        status: 200,
        json: { items, page, pageSize: PAGE_SIZE, totalCount: all.length },
      });
    }

    if (method === 'POST' && (byId[2] === 'rotate' || byId[2] === 'revoke')) {
      if (!this.context.organizations.has(caller, 'integrations.manage', app.orgSlug)) {
        return route.fulfill({ status: 403, json: { status: 403, title: 'Forbidden' } });
      }
      if (app.revokedAt) {
        return route.fulfill({
          status: 409,
          json: { status: 409, title: 'Conflict', detail: 'This application is revoked.' },
        });
      }
      const now = this.context.now;
      if (byId[2] === 'revoke') {
        app.revokedAt = now.toISOString();
        app.revokedById = caller.profileId;
        return route.fulfill({ status: 200, json: this.dto(app, caller) });
      }
      sequence += 1;
      app.secret = `whsec_${hex(43)}`;
      app.rotatedAt = now.toISOString();
      app.previousSecretExpiresAt = new Date(now.getTime() + 24 * HOUR).toISOString();
      return route.fulfill({
        status: 200,
        json: {
          app: this.dto(app, caller),
          secret: app.secret,
          previousSecretExpiresAt: app.previousSecretExpiresAt,
        },
      });
    }
    return false;
  }

  /** The orgs (slugs) where the caller holds integrations.view with the feature on. */
  private viewable(caller: MockAccount): string[] {
    return this.context.organizations
      .covered(caller)
      .filter((c) => c.permissions.has('integrations.view'))
      .map((c) => c.org.slug);
  }

  /** IntegrationAppDto: never the secret, only its first 10 characters. */
  private dto(app: MockIntegrationApp, caller: MockAccount) {
    const org = this.context.organizations.bySlug(app.orgSlug)!;
    const events = this.events.filter((e) => e.appId === app.id);
    const person = (id: string | null) =>
      id ? { profileId: id, name: this.context.profiles.get(id)?.name ?? 'Someone' } : null;
    return {
      id: app.id,
      name: app.name,
      sourceId: app.sourceId,
      secretPrefix: app.secret.slice(0, 10),
      organization: { id: org.id, slug: org.slug, name: org.displayName ?? org.name },
      status: app.revokedAt ? 'Revoked' : 'Active',
      createdAt: app.createdAt,
      createdBy: person(app.createdById),
      rotatedAt: app.rotatedAt,
      previousSecretExpiresAt: app.previousSecretExpiresAt,
      revokedAt: app.revokedAt,
      revokedBy: person(app.revokedById),
      lastEventAt: events.length
        ? events
            .map((e) => e.receivedAt)
            .sort()
            .slice(-1)[0]
        : null,
      eventCount: events.length,
      canManage: this.context.organizations.has(caller, 'integrations.manage', app.orgSlug),
    };
  }
}
