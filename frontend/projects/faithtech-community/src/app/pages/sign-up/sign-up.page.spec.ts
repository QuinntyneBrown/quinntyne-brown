// Traces to: L2-111
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AUTH_SERVICE } from '@faithtech-community/api';

import { SignUpPage } from './sign-up.page';

describe('SignUpPage', () => {
  let started: [string, string | undefined, boolean | undefined, string | undefined][];

  beforeEach(() => {
    started = [];
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AUTH_SERVICE,
          useValue: {
            signInWithGoogle: (url?: string, keep?: boolean, from?: string) =>
              started.push(['google', url, keep, from]),
            signInWithGitHub: (url?: string, keep?: boolean, from?: string) =>
              started.push(['github', url, keep, from]),
          },
        },
      ],
    });
  });

  it.each([
    ['Sign up with Google', 'google'],
    ['Sign up with GitHub', 'github'],
  ])('%s starts that provider from the app', async (name, provider) => {
    const fixture = TestBed.createComponent(SignUpPage);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const button = [...el.querySelectorAll('button')].find((b) => b.textContent?.trim() === name)!;

    button.click();
    await fixture.whenStable();

    expect(started).toEqual([[provider, '/', false, 'app']]);
    expect(el.querySelector('.auth-form__divider')?.textContent?.trim()).toBe('or');
  });
});
