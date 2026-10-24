import { Route } from '@playwright/test';

import type { MockAccount } from './mock-api';
import type { MockNotifications } from './mock-notifications';

/** What the ideas fake reads from the rest of the fake backend. */
export interface IdeasContext {
  readonly now: Date;
  readonly accounts: Map<string, MockAccount>;
  readonly notifications: MockNotifications;
}

/** An idea as the fake stores it (Idea in backend/src/QuinntyneBrown.Community.Domain/Ideas/Idea.cs). */
export interface MockIdea {
  id: string;
  authorProfileId: string | null;
  name: string;
  email: string;
  problem: string;
  audience: string;
  title: string;
  pitch: string;
  solution: string;
  stage: string | null;
  platform: string | null;
  topics: string[];
  skills: string[];
  involvement: string | null;
  commitment: string | null;
  submittedAt: string;
}

/** The option keys and lists of IdeaOptions.cs. */
export const IDEA_OPTIONS = {
  audiences: ['churches', 'nonprofits', 'families', 'students', 'newcomers', 'small-business'],
  stages: ['idea', 'sketches', 'prototype', 'live'],
  platforms: ['web', 'mobile', 'both', 'unsure'],
  topics: [
    'Accessibility',
    'AI',
    'Community',
    'Education',
    'Faith',
    'Housing',
    'Mental health',
    'Prayer',
    'Volunteering',
  ],
  skills: [
    'Product Engineer',
    'Designer',
    'Product manager',
    'Data and AI',
    'Domain expert',
    'Marketing and comms',
  ],
  involvements: ['lead', 'contribute', 'share'],
  commitments: ['monthly', 'weekly', 'part-time'],
};

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
  readonly submitted: MockIdea[] = [];
  /** The emails SubmitIdeaHandler queues: one to each active System Admin, then the submitter's confirmation. */
  readonly emails: { to: string; subject: string }[] = [];
  /** RateLimits:IdeaSubmitPerHour: submissions over it answer 429 (L2-178). */
  limitPerHour = 10;

  constructor(private readonly context: IdeasContext) {}

  handle(
    route: Route,
    method: string,
    url: URL,
    body: Record<string, unknown>,
    caller: MockAccount | null,
  ): Promise<void> | false {
    if (url.pathname === '/api/ideas' && method === 'POST') return this.submit(route, body, caller);
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

  /** POST /api/ideas: the server's rules (SubmitIdeaValidator) and storage (SubmitIdeaHandler). */
  private submit(
    route: Route,
    body: Record<string, unknown>,
    caller: MockAccount | null,
  ): Promise<void> {
    if (this.submitted.length >= this.limitPerHour) {
      return route.fulfill({ status: 429, json: { status: 429, title: 'Too Many Requests' } });
    }
    const text = (key: string) =>
      typeof body[key] === 'string' ? (body[key] as string).trim() : '';
    const key = (k: string) => (typeof body[k] === 'string' ? (body[k] as string) : null);
    const list = (k: string) => (Array.isArray(body[k]) ? [...new Set(body[k] as string[])] : []);
    const askStage = !!caller && this.askStage;
    const askPeople = !!caller && this.askPeople;
    const errors: Record<string, string[]> = {};
    const fail = (field: string, message: string) => (errors[field] = [message]);
    if (text('problem').length < 30)
      fail('problem', 'Add a little more detail, at least 30 characters');
    else if (text('problem').length > 600)
      fail('problem', 'Use 600 characters or fewer for the problem');
    if (!IDEA_OPTIONS.audiences.includes(key('audience') ?? ''))
      fail('audience', 'Choose who feels this problem most');
    const required: [string, string, number, string][] = [
      ['title', 'Name your idea', 60, 'the name'],
      ['pitch', 'Add a one-line pitch', 140, 'the pitch'],
      ['solution', 'Say how it would work', 1000, 'how it would work'],
    ];
    if (!caller) required.push(['name', 'Enter your name', 100, 'your name']);
    for (const [field, missing, max, what] of required) {
      if (!text(field)) fail(field, missing);
      else if (text(field).length > max) fail(field, `Use ${max} characters or fewer for ${what}`);
    }
    if (!caller && !/^[^@\s]+@[^@\s]+\.[^@\s.]+$/.test(text('email'))) {
      fail('email', 'Enter an email like name@example.org');
    }
    const oneOf = (field: string, options: string[]) => {
      if (key(field) !== null && !options.includes(key(field)!))
        fail(field, 'Choose one of the options');
    };
    if (askStage) {
      oneOf('stage', IDEA_OPTIONS.stages);
      oneOf('platform', IDEA_OPTIONS.platforms);
      if (list('topics').some((t) => !IDEA_OPTIONS.topics.includes(t)))
        fail('topics', 'Choose topics from the list');
      else if (list('topics').length > 5) fail('topics', 'Choose up to 5 topics');
    }
    if (askPeople) {
      if (list('skills').some((t) => !IDEA_OPTIONS.skills.includes(t)))
        fail('skills', 'Choose skills from the list');
      oneOf('involvement', IDEA_OPTIONS.involvements);
      oneOf('commitment', IDEA_OPTIONS.commitments);
    }
    if (Object.keys(errors).length) {
      return route.fulfill({
        status: 400,
        json: { status: 400, title: 'One or more validation errors occurred.', errors },
      });
    }
    const idea: MockIdea = {
      id: `idea-${this.submitted.length + 1}`,
      authorProfileId: caller?.profileId ?? null,
      name: caller?.name ?? text('name'),
      email: caller?.email ?? text('email'),
      problem: text('problem'),
      audience: key('audience')!,
      title: text('title'),
      pitch: text('pitch'),
      solution: text('solution'),
      stage: askStage ? key('stage') : null,
      platform: askStage ? key('platform') : null,
      topics: askStage ? list('topics') : [],
      skills: askPeople ? list('skills') : [],
      involvement: askPeople ? key('involvement') : null,
      commitment: askPeople ? key('commitment') : null,
      submittedAt: this.context.now.toISOString(),
    };
    this.submitted.push(idea);
    // Every active System Admin is told in the app and by email; the submitter is confirmed (L2-179, L2-180).
    for (const admin of [...this.context.accounts.values()].filter(
      (a) => a.roles.includes('SystemAdmin') && !a.suspended,
    )) {
      this.context.notifications.add({
        recipientId: admin.profileId,
        kind: 'IdeaSubmitted',
        title: `New app idea: ${idea.title}`,
        linkPath: '/admin/ideas',
        actorId: idea.authorProfileId,
        actorName: caller?.name ?? null,
      });
      this.emails.push({ to: admin.email, subject: `New app idea: ${idea.title}` });
    }
    this.emails.push({ to: idea.email, subject: `We got your idea: ${idea.title}` });
    return route.fulfill({
      status: 201,
      json: { id: idea.id, title: idea.title, name: idea.name, email: idea.email },
    });
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
