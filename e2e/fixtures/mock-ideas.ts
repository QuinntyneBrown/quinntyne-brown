import { Route } from '@playwright/test';

import type { MockAccount } from './mock-api';

/** What the ideas fake reads from the rest of the fake backend. */
export interface IdeasContext {
  readonly now: Date;
}

/** One `ideas.formChanged` entry, as IdeaFormHandler audits a save. */
export interface MockIdeaFormChange {
  actorId: string;
  before: { askStage: boolean; askPeople: boolean };
  after: { askStage: boolean; askPeople: boolean };
}

/**
 * Plays the Ideas endpoints (backend/src/QuinntyneBrown.Community.Api/Endpoints/IdeasEndpoints.cs,
 * docs/detailed-designs/ideas): the platform intake's switches, read and saved by System Admin only (404 for
 * everyone else) and read by any signed-in member's wizard. Fail a route with `api.on(...)`.
 */
export class MockIdeas {
  /** The Idea form switches: both on until a System Admin turns them off (L2-181 AC1). */
  askStage = true;
  askPeople = true;
  updatedAt: string | null = null;
  readonly formChanges: MockIdeaFormChange[] = [];

  constructor(private readonly context: IdeasContext) {}

  handle(
    route: Route,
    method: string,
    url: URL,
    body: Record<string, unknown>,
    caller: MockAccount | null,
  ): Promise<void> | false {
    if (url.pathname === '/api/ideas/form' && method === 'GET') {
      if (!caller) return route.fulfill({ status: 401 });
      return route.fulfill({ json: { askStage: this.askStage, askPeople: this.askPeople } });
    }
    if (url.pathname === '/api/admin/ideas/settings') {
      if (!caller) return route.fulfill({ status: 401 });
      if (!caller.roles.includes('SystemAdmin')) return route.fulfill({ status: 404 });
      if (method === 'GET') return route.fulfill({ json: this.settings() });
      if (method === 'PUT') return this.save(route, body, caller);
    }
    return false;
  }

  private save(route: Route, body: Record<string, unknown>, caller: MockAccount): Promise<void> {
    const errors: Record<string, string[]> = {};
    if (typeof body['askStage'] !== 'boolean')
      errors['askStage'] = ['Say whether to ask “How far along is it?”.'];
    if (typeof body['askPeople'] !== 'boolean')
      errors['askPeople'] = ['Say whether to ask “Who do you need?”.'];
    if (Object.keys(errors).length) {
      return route.fulfill({ status: 400, json: { status: 400, errors } });
    }
    const before = { askStage: this.askStage, askPeople: this.askPeople };
    this.askStage = body['askStage'] as boolean;
    this.askPeople = body['askPeople'] as boolean;
    this.updatedAt = this.context.now.toISOString();
    this.formChanges.push({
      actorId: caller.profileId,
      before,
      after: { askStage: this.askStage, askPeople: this.askPeople },
    });
    return route.fulfill({ json: this.settings() });
  }

  private settings() {
    return { askStage: this.askStage, askPeople: this.askPeople, updatedAt: this.updatedAt };
  }
}
