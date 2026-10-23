import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { AUTH_SERVICE } from '@faithtech-community/api';
import {
  AuthLayoutComponent,
  ButtonComponent,
  CardComponent,
  LinkComponent,
  SignInCredentials,
  SignInFormComponent,
  SignInFormFailure,
  StackComponent,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

/** Sign in with email and password (L2-003), Google or GitHub (L2-131), matching docs/mocks/pages/sign-in. */
@Component({
  selector: 'ft-sign-in-page',
  imports: [
    AuthLayoutComponent,
    ButtonComponent,
    CardComponent,
    StackComponent,
    SignInFormComponent,
    LinkComponent,
  ],
  templateUrl: './sign-in.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPage {
  private readonly auth = inject(AUTH_SERVICE);

  /** Where to go after signing in: an app url, or the identity server's /connect/authorize url. */
  readonly returnUrl = input<string>();
  /** How Google sign-in ended when the API sent the visitor back (`?google=failed|suspended`). */
  readonly google = input<string>();
  /** How GitHub sign-in ended when the API sent the visitor back (`?github=failed|suspended`). */
  readonly github = input<string>();

  protected readonly busy = signal(false);
  protected readonly failure = signal<SignInFormFailure | null>(null);
  protected readonly googleBusy = signal(false);
  protected readonly githubBusy = signal(false);
  private readonly form = viewChild(SignInFormComponent);

  constructor() {
    // The API's outcome arrives once, in the URL the visitor comes back to (L2-131).
    effect(() => {
      const google = this.google();
      const github = this.github();
      untracked(() => {
        if (google === 'suspended' || github === 'suspended') this.failure.set('suspended');
        else if (google === 'failed') this.failure.set('google_failed');
        else if (github === 'failed') this.failure.set('github_failed');
      });
    });
  }

  /** One flow for signing in and signing up with Google: the browser leaves for Google. */
  protected continueWithGoogle(): void {
    if (this.googleBusy()) return;
    this.googleBusy.set(true);
    this.auth.signInWithGoogle(this.landing(), this.form()?.keepSignedIn() ?? false, 'app');
  }

  /** One flow for signing in and signing up with GitHub: the browser leaves for GitHub. */
  protected continueWithGitHub(): void {
    if (this.githubBusy()) return;
    this.githubBusy.set(true);
    this.auth.signInWithGitHub(this.landing(), this.form()?.keepSignedIn() ?? false, 'app');
  }

  /** An app page, or the identity server's interrupted /connect/authorize request, which the API resumes. */
  private landing(): string {
    const returnUrl = this.returnUrl();
    return isAppUrl(returnUrl) ? returnUrl : '/';
  }

  protected async submit({ email, password, keepSignedIn }: SignInCredentials): Promise<void> {
    if (this.busy()) return;
    this.failure.set(null);
    this.busy.set(true);
    try {
      const outcome = await firstValueFrom(this.auth.signInWithPassword(email, password));
      if (!outcome.succeeded) {
        this.failure.set(outcome.error);
        return;
      }
      await this.continue(keepSignedIn);
    } catch {
      this.failure.set('unreachable');
    } finally {
      this.busy.set(false);
    }
  }

  private async continue(keepSignedIn: boolean): Promise<void> {
    const returnUrl = this.returnUrl();
    // The identity server sent us here mid-flow: resume it, the PKCE state is already stored.
    if (returnUrl?.startsWith('/connect/')) {
      window.location.assign(returnUrl);
      return;
    }
    await this.auth.signIn(isAppUrl(returnUrl) ? returnUrl : '/', keepSignedIn);
  }
}

function isAppUrl(url: string | undefined): url is string {
  return !!url && url.startsWith('/') && !url.startsWith('//');
}
