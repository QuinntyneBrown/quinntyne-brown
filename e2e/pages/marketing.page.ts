import { Locator, Page } from '@playwright/test';

import { fieldError } from './sign-in.page';

/** The marketing app's own dev server (playwright.config.ts starts it next to the community app). */
export const MARKETING_URL = process.env['E2E_MARKETING_URL'] ?? 'http://localhost:4300';

/** The public marketing page at www.faithtech.community (docs/mocks/pages/marketing). */
export class MarketingPage {
  readonly heading: Locator;
  readonly lead: Locator;
  readonly topBar: Locator;
  readonly topBarJoin: Locator;
  readonly topBarSignIn: Locator;
  readonly callToAction: Locator;
  readonly callToActionJoin: Locator;
  readonly footer: Locator;
  readonly video: Locator;
  readonly transcriptToggle: Locator;
  readonly videoUnavailable: Locator;
  readonly videoPoster: Locator;
  /** The hero panel: the sign-in or sign-up card. */
  readonly panel: Locator;
  readonly signInHeading: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly keepSignedIn: Locator;
  readonly signInButton: Locator;
  readonly alert: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly resetPassword: Locator;
  readonly handOff: Locator;
  readonly joinHeading: Locator;
  readonly panelJoin: Locator;
  readonly panelSignIn: Locator;
  readonly name: Locator;
  readonly createAccount: Locator;
  readonly nameError: Locator;
  readonly checkInbox: Locator;
  readonly sendAgain: Locator;
  readonly signInWithGoogle: Locator;
  readonly signUpWithGoogle: Locator;
  readonly signInWithGitHub: Locator;
  readonly signUpWithGitHub: Locator;
  readonly linkedIn: Locator;
  readonly gitHub: Locator;
  readonly downloadResume: Locator;
  readonly building: Locator;
  readonly projects: Locator;
  readonly allOnGitHub: Locator;
  /** The level-2 headings of the sections under the hero, in page order. */
  readonly sectionHeadings: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', {
      level: 1,
      name: 'Let’s build great products together. Welcome.',
    });
    this.lead = page.getByText(/^I’m Quinntyne Brown — a Christian, a founder who builds/);
    this.topBar = page.getByRole('banner');
    this.topBarJoin = this.topBar.getByRole('button', { name: 'Create a profile' });
    this.topBarSignIn = this.topBar.getByRole('button', { name: 'Sign in' });
    this.callToAction = page.getByRole('region', { name: 'Let’s stay connected.' });
    this.callToActionJoin = this.callToAction.getByRole('button', { name: 'Create a profile' });
    this.footer = page.getByRole('contentinfo');
    this.video = page.locator('video');
    this.transcriptToggle = page.getByText('Read the transcript');
    this.videoUnavailable = page.getByRole('status').filter({
      hasText: 'This video can’t play right now',
    });
    this.videoPoster = page.getByRole('img', { name: /Quinntyne Brown/ });
    this.panel = page.locator('ft-card').filter({ has: page.getByRole('heading', { level: 2 }) });
    this.signInHeading = page.getByRole('heading', { level: 2, name: 'Sign in' });
    this.email = this.panel.getByLabel('Email');
    this.password = this.panel.getByLabel('Password', { exact: true });
    this.keepSignedIn = this.panel.getByRole('switch', {
      name: 'Keep me signed in on this device',
    });
    this.signInButton = this.panel.getByRole('button', { name: /^(Sign in|Signing in…)$/ });
    this.alert = this.panel.locator('ft-alert [role=alert], ft-alert [role=status]');
    this.emailError = fieldError(page, 'Email');
    this.passwordError = fieldError(page, 'Password');
    this.resetPassword = this.panel.getByRole('link', { name: 'Reset password' });
    this.handOff = page.getByRole('heading', { level: 2, name: 'Signing you in…' });
    this.joinHeading = page.getByRole('heading', { level: 2, name: 'Create your profile' });
    this.panelJoin = this.panel.getByRole('button', { name: 'Create a profile' });
    this.panelSignIn = this.panel.getByRole('button', { name: 'Sign in', exact: true });
    this.name = this.panel.getByLabel('Full name');
    this.createAccount = this.panel.getByRole('button', {
      name: /Create account|Creating account/,
    });
    this.nameError = fieldError(page, 'Full name');
    this.checkInbox = page.getByRole('heading', { level: 2, name: 'Check your inbox' });
    this.sendAgain = this.panel.getByRole('link', { name: 'send it again' });
    this.signInWithGoogle = this.panel.getByRole('button', { name: 'Sign in with Google' });
    this.signUpWithGoogle = this.panel.getByRole('button', { name: 'Sign up with Google' });
    this.signInWithGitHub = this.panel.getByRole('button', { name: 'Sign in with GitHub' });
    this.signUpWithGitHub = this.panel.getByRole('button', { name: 'Sign up with GitHub' });
    const main = page.getByRole('main');
    this.linkedIn = main.getByRole('link', { name: 'LinkedIn', exact: true });
    this.gitHub = main.getByRole('link', { name: 'GitHub', exact: true });
    this.downloadResume = main.getByRole('link', { name: 'Download résumé' });
    this.building = page.getByRole('region', {
      name: 'What I’m building in the open. Jump in anywhere.',
    });
    this.projects = this.building.getByRole('listitem');
    this.allOnGitHub = this.building.getByRole('link', { name: 'All on GitHub' });
    this.sectionHeadings = main.locator('h2:not(ft-landing-hero h2)');
  }

  /** Signs in from the hero panel and waits for the API's answer. */
  async signIn(
    email: string,
    password: string,
    options: { keepSignedIn?: boolean } = {},
  ): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    if (options.keepSignedIn) await this.keepSignedIn.check();
    const response = this.page.waitForResponse('**/api/account/sign-in');
    await this.signInButton.click();
    await response;
  }

  /** Fills in and submits the join form in the hero panel. */
  async join(name: string, email: string, password: string): Promise<void> {
    await this.name.fill(name);
    await this.email.fill(email);
    await this.password.fill(password);
    await this.createAccount.click();
  }

  sentTo(email: string): Locator {
    return this.panel.getByText(`We sent a link to ${email}`);
  }

  /** Submits the sign-in form without filling anything in, so no request is made. */
  async submitEmptySignIn(): Promise<void> {
    await this.signInButton.click();
  }

  /** Starts the brochure as a visitor pressing its Play control would. */
  async playVideo(): Promise<void> {
    await this.video.evaluate((v: HTMLVideoElement) => v.play().catch(() => undefined));
  }

  /** What the visitor's browser knows about the brochure: playing state, captions and length. */
  videoState(): Promise<{
    paused: boolean;
    autoplay: boolean;
    muted: boolean;
    controls: boolean;
    poster: string;
    captions: { kind: string; language: string; mode: string }[];
  }> {
    return this.video.evaluate((v: HTMLVideoElement) => ({
      paused: v.paused,
      autoplay: v.autoplay,
      muted: v.muted,
      controls: v.controls,
      poster: v.poster,
      captions: [...v.textTracks].map((t) => ({
        kind: t.kind,
        language: t.language,
        mode: t.mode,
      })),
    }));
  }

  /** The brochure file's length in seconds, read from its metadata. */
  videoDuration(): Promise<number> {
    return this.video.evaluate(
      (v: HTMLVideoElement) =>
        new Promise<number>((resolve, reject) => {
          const probe = document.createElement('video');
          probe.preload = 'metadata';
          probe.onloadedmetadata = () => resolve(probe.duration);
          probe.onerror = () => reject(new Error('The brochure did not load.'));
          probe.src = v.currentSrc || v.src;
        }),
    );
  }

  /** Animations running on the page, which a reduced-motion visitor must not see. */
  runningAnimations(): Promise<number> {
    return this.page.evaluate(
      () => document.getAnimations().filter((a) => a.playState === 'running').length,
    );
  }

  /** Each project card's one link (its name and where it goes), its language and description. */
  async projectCards(): Promise<
    { name: string; href: string; language: string; description: string; links: number }[]
  > {
    return this.projects.evaluateAll((items) =>
      items.map((item) => ({
        name: item.querySelector('a')?.textContent?.trim() ?? '',
        href: item.querySelector('a')?.getAttribute('href') ?? '',
        language: item.querySelector('.project-card__language')?.textContent?.trim() ?? '',
        description: item.querySelector('.project-card__description')?.textContent?.trim() ?? '',
        links: item.querySelectorAll('a').length,
      })),
    );
  }

  /** The English caption file the video's track points at, as the browser would fetch it. */
  async captions(): Promise<string> {
    const src = await this.video.locator('track').getAttribute('src');
    const response = await this.page.request.get(new URL(src ?? '', this.page.url()).href);
    return response.text();
  }

  async open(query = ''): Promise<void> {
    await this.page.goto(`${MARKETING_URL}/${query}`);
  }
}
