import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AUTH_SERVICE, SignUpFieldErrors, signUpFieldErrors } from '@faithtech-community/api';
import {
  AuthLayoutComponent,
  ButtonComponent,
  CardComponent,
  LinkComponent,
  SignUpDetails,
  SignUpFormComponent,
  StackComponent,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

/** Create an account (L2-001), or continue with Google or GitHub (L2-131), matching docs/mocks/pages/sign-up. */
@Component({
  selector: 'ft-sign-up-page',
  imports: [
    AuthLayoutComponent,
    ButtonComponent,
    CardComponent,
    StackComponent,
    SignUpFormComponent,
    LinkComponent,
  ],
  templateUrl: './sign-up.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpPage {
  private readonly auth = inject(AUTH_SERVICE);

  protected readonly busy = signal(false);
  protected readonly unreachable = signal(false);
  protected readonly serverErrors = signal<SignUpFieldErrors>({});
  protected readonly sentTo = signal<string | null>(null);
  protected readonly googleBusy = signal(false);
  protected readonly githubBusy = signal(false);

  /** One flow for signing up and signing in with Google: the browser leaves for Google. */
  protected continueWithGoogle(): void {
    if (this.googleBusy()) return;
    this.googleBusy.set(true);
    this.auth.signInWithGoogle('/', false, 'app');
  }

  /** One flow for signing up and signing in with GitHub: the browser leaves for GitHub. */
  protected continueWithGitHub(): void {
    if (this.githubBusy()) return;
    this.githubBusy.set(true);
    this.auth.signInWithGitHub('/', false, 'app');
  }

  protected verifyEmailLink(email: string): string {
    return `/verify-email?email=${encodeURIComponent(email)}`;
  }

  protected async submit(request: SignUpDetails): Promise<void> {
    if (this.busy()) return;
    this.serverErrors.set({});
    this.unreachable.set(false);
    this.busy.set(true);
    try {
      await firstValueFrom(this.auth.signUp(request));
      this.sentTo.set(request.email);
    } catch (error) {
      const fieldErrors = signUpFieldErrors(error);
      if (fieldErrors) this.serverErrors.set(fieldErrors);
      else this.unreachable.set(true);
    } finally {
      this.busy.set(false);
    }
  }
}
