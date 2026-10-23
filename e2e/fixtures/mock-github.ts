import { Route } from '@playwright/test';

import type { MockAccount, MockApi } from './mock-api';

/** The GitHub account the visitor authorizes at GitHub; null when they cancel. */
export interface MockGitHubAccount {
  /** The account's primary email. */
  email: string;
  name: string | null;
  login: string;
  emailVerified: boolean;
}

const MARKETING = 'http://localhost:4300';
const COMMUNITY = 'http://localhost:4200';
const AUTHORIZE = 'https://github.com/login/oauth/authorize';

/** A browser redirect that keeps every hop inside the fake (see mock-google.ts). */
function redirect(route: Route, location: string) {
  return route.fulfill({
    status: 200,
    contentType: 'text/html',
    body: `<!doctype html><title>Redirecting</title><script>location.replace(${JSON.stringify(location)})</script>`,
  });
}

/**
 * Plays GitHub and the API's GitHub endpoints (AccountEndpoints, GitHubSignInHandler; ADR 0032) so the
 * marketing page's real redirects run without the network: start sends the browser to "GitHub" with
 * the state and an S256 challenge, which returns to the callback, which applies the server's rules
 * and lands in the community app or back on the marketing page with ?github=failed|suspended.
 */
export class MockGitHub {
  /** Who authorizes at GitHub. Set it before pressing the button; null plays "Cancel". */
  account: MockGitHubAccount | null = null;
  /** Every authorization URL the start endpoint sent the browser to. */
  readonly authorizeUrls: string[] = [];
  private pending: {
    state: string;
    returnUrl: string;
    keepSignedIn: string;
    fromApp: boolean;
  } | null = null;

  constructor(
    private readonly api: MockApi,
    private readonly signIn: (account: MockAccount) => void,
  ) {}

  /** GET /api/account/github/start */
  start(route: Route, url: URL) {
    const returnUrl = url.searchParams.get('returnUrl') ?? '/';
    this.pending = {
      state: `state-${Date.now()}`,
      returnUrl: returnUrl.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/',
      keepSignedIn: url.searchParams.get('keepSignedIn') === 'true' ? '1' : '0',
      fromApp: url.searchParams.get('from') === 'app',
    };
    const github = new URL(AUTHORIZE);
    github.searchParams.set('client_id', 'github-client-id');
    github.searchParams.set('redirect_uri', `${COMMUNITY}/api/account/github/callback`);
    github.searchParams.set('scope', 'read:user user:email');
    github.searchParams.set('state', this.pending.state);
    github.searchParams.set('code_challenge', 'challenge-of-the-verifier-in-the-cookie');
    github.searchParams.set('code_challenge_method', 'S256');
    this.authorizeUrls.push(github.toString());
    return redirect(route, github.toString());
  }

  /** github.com: authorize, then back to the callback with a code or an error. */
  authorize(route: Route) {
    const url = new URL(route.request().url());
    const back = new URL(url.searchParams.get('redirect_uri')!);
    back.searchParams.set('state', url.searchParams.get('state') ?? '');
    if (this.account) back.searchParams.set('code', 'github-code');
    else back.searchParams.set('error', 'access_denied');
    return redirect(route, back.toString());
  }

  /** GET /api/account/github/callback */
  callback(route: Route, url: URL) {
    const pending = this.pending;
    this.pending = null;
    const github = this.account;
    // Back where the sign-in started (L2-131): the community app's /sign-in, else the marketing page.
    const failed = (outcome: string) =>
      redirect(
        route,
        pending?.fromApp
          ? `${COMMUNITY}/sign-in?github=${outcome}&returnUrl=${encodeURIComponent(pending.returnUrl)}`
          : `${MARKETING}/?github=${outcome}`,
      );
    if (!pending || url.searchParams.get('state') !== pending.state || !github) {
      return failed('failed');
    }
    if (!github.emailVerified) return failed('failed');
    const account =
      this.api.accounts.get(github.email.toLowerCase()) ??
      this.api.addAccount({
        email: github.email,
        name: github.name ?? github.login,
        verified: true,
        roles: [],
      });
    account.verified = true;
    if (account.suspended) return failed('suspended');
    this.signIn(account);
    // An interrupted authorization request resumes, as after a password sign-in.
    if (pending.returnUrl.startsWith('/connect/')) {
      return redirect(route, `${COMMUNITY}${pending.returnUrl}`);
    }
    const query = new URLSearchParams({
      returnUrl: pending.returnUrl,
      keepSignedIn: pending.keepSignedIn,
    });
    return redirect(route, `${COMMUNITY}/auth/continue?${query}`);
  }
}
