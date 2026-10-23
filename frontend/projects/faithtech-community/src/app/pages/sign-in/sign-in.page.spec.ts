// Traces to: L2-131
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AUTH_SERVICE } from '@faithtech-community/api';

import { SignInPage } from './sign-in.page';

type Started = [string | undefined, boolean | undefined, string | undefined];

describe('SignInPage', () => {
  let google: Started[];
  let github: Started[];

  beforeEach(() => {
    google = [];
    github = [];
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AUTH_SERVICE,
          useValue: {
            signInWithGoogle: (url?: string, keep?: boolean, from?: string) =>
              google.push([url, keep, from]),
            signInWithGitHub: (url?: string, keep?: boolean, from?: string) =>
              github.push([url, keep, from]),
          },
        },
      ],
    });
  });

  async function open(inputs: Record<string, string> = {}) {
    const fixture = TestBed.createComponent(SignInPage);
    for (const [name, value] of Object.entries(inputs)) fixture.componentRef.setInput(name, value);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const button = (name: string) =>
      [...el.querySelectorAll('button')].find((b) => b.textContent?.trim() === name)!;
    return { fixture, el, button };
  }

  it('offers Google and GitHub above the fields with an "or" divider', async () => {
    const { el, button } = await open();

    expect(button('Sign in with Google')).toBeTruthy();
    expect(button('Sign in with GitHub')).toBeTruthy();
    expect(el.querySelector('.auth-form__divider')?.textContent?.trim()).toBe('or');
  });

  it.each([
    ['Sign in with Google', () => google, () => github],
    ['Sign in with GitHub', () => github, () => google],
  ])(
    '%s starts that provider from the app and shows only its button busy',
    async (name, mine, other) => {
      const { fixture, button } = await open({ returnUrl: '/events' });

      button(name).click();
      await fixture.whenStable();

      expect(mine()).toEqual([['/events', false, 'app']]);
      expect(other()).toEqual([]);
      expect(button(name).getAttribute('aria-busy')).toBe('true');
    },
  );

  it('passes an interrupted authorization request on so it resumes', async () => {
    const { fixture, button } = await open({ returnUrl: '/connect/authorize?client_id=web' });

    button('Sign in with GitHub').click();
    await fixture.whenStable();

    expect(github).toEqual([['/connect/authorize?client_id=web', false, 'app']]);
  });

  it('starts from home when the return url is not a path on this site', async () => {
    const { fixture, button } = await open({ returnUrl: 'https://evil.example' });

    button('Sign in with Google').click();
    await fixture.whenStable();

    expect(google).toEqual([['/', false, 'app']]);
  });

  it.each([
    ['google', 'failed', 'Google sign-in didn’t finish'],
    ['github', 'failed', 'GitHub sign-in didn’t finish'],
    ['google', 'suspended', 'This account is suspended'],
    ['github', 'suspended', 'This account is suspended'],
  ])(
    'shows how %s sign-in ended (%s) when the visitor comes back',
    async (provider, outcome, text) => {
      const { el } = await open({ [provider]: outcome });

      expect(el.querySelector('ft-alert')?.textContent).toContain(text);
    },
  );
});
