import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  AUTH_SERVICE,
  BROWSER_REDIRECT,
  SignUpFieldErrors,
  signUpFieldErrors,
} from '@faithtech-community/api';
import {
  AlertComponent,
  ButtonComponent,
  CardComponent,
  ClusterComponent,
  ContainerComponent,
  CtaBandComponent,
  EmptyStateComponent,
  LandingHeroComponent,
  LandingSectionComponent,
  LinkComponent,
  ProjectCardComponent,
  SignInCredentials,
  SignInFormComponent,
  SignInFormFailure,
  SignUpDetails,
  SignUpFormComponent,
  VideoPlayerComponent,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

import { COMMUNITY_ORIGIN } from '../community-origin';

/**
 * The marketing page (L2-074), matching docs/mocks/pages/marketing. It collects credentials and
 * hands the session to the community app, which completes PKCE (ADR 0018). It also introduces
 * Quinntyne Brown: profile links and the projects he builds in the open, all static (L2-132).
 */
@Component({
  selector: 'ft-landing-page',
  imports: [
    AlertComponent,
    ButtonComponent,
    CardComponent,
    ClusterComponent,
    ContainerComponent,
    CtaBandComponent,
    EmptyStateComponent,
    LandingHeroComponent,
    LandingSectionComponent,
    LinkComponent,
    ProjectCardComponent,
    SignInFormComponent,
    SignUpFormComponent,
    VideoPlayerComponent,
  ],
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage implements OnInit {
  private readonly router = inject(Router);
  private readonly auth = inject(AUTH_SERVICE);
  private readonly redirect = inject(BROWSER_REDIRECT);
  protected readonly communityOrigin = inject(COMMUNITY_ORIGIN);

  protected readonly linkedInUrl = 'https://www.linkedin.com/in/quinntynebrown';
  protected readonly gitHubUrl = 'https://github.com/QuinntyneBrown';
  /** Served from the marketing app's public/ folder. */
  protected readonly resumeUrl = '/resume/quinntyne-brown-resume.pdf';
  protected readonly projects = [
    {
      name: 'Shelfie',
      repo: 'shelfie',
      language: 'TypeScript · .NET',
      image: 'shelfie',
      description: 'A reading habit tracker for a young reader, with parent rewards.',
    },
    {
      name: 'Saturdaze',
      repo: 'saturdaze',
      language: 'TypeScript · .NET',
      image: 'saturdaze',
      description: 'A weekend planner for a family of four.',
    },
    {
      name: 'TwinkleTune',
      repo: 'TwinkleTune',
      language: 'TypeScript · .NET',
      image: 'twinkletune',
      description: 'A singing buddy for kids. Every song is tuned to their voice.',
    },
    {
      name: 'Fullstack with Claude',
      repo: 'fullstack-with-claude',
      language: 'Python',
      image: 'fullstack-with-claude',
      description: 'A narrated video series on building a full-stack app with Claude.',
    },
    {
      name: 'Loupe',
      repo: 'loupe',
      language: 'C# · TypeScript',
      image: 'loupe',
      description: 'AI critiques for photographers, plus a library of the work that inspires them.',
    },
    {
      name: 'Studio',
      repo: 'quinntyne-brown-studio',
      language: 'C# · TypeScript · Azure',
      image: 'studio',
      description: 'Photography studio platform: galleries, quotes, client albums, prints.',
    },
  ];

  /** The community app page to land on after signing in (`?returnUrl=/events`). */
  readonly returnUrl = input<string>();
  /** Present (`?join`) when the panel shows the sign-up form. */
  readonly join = input<string>();
  /** How Google sign-in ended when the API sent the visitor back (`?google=failed|suspended`). */
  readonly google = input<string>();
  /** How GitHub sign-in ended when the API sent the visitor back (`?github=failed|suspended`). */
  readonly github = input<string>();

  protected readonly joining = computed(() => this.join() !== undefined);
  protected readonly busy = signal(false);
  protected readonly failure = signal<SignInFormFailure | null>(null);
  /** Set once the API has accepted the credentials, while the browser moves to the community app. */
  protected readonly handingOff = signal<{ emailVerified: boolean } | null>(null);
  protected readonly unreachable = signal(false);
  protected readonly serverErrors = signal<SignUpFieldErrors>({});
  protected readonly sentTo = signal<string | null>(null);
  protected readonly googleBusy = signal(false);
  protected readonly githubBusy = signal(false);
  private readonly panelHeading = viewChild<ElementRef<HTMLElement>>('panelHeading');
  private readonly signInForm = viewChild(SignInFormComponent);

  constructor() {
    const injector = inject(Injector);
    // The API's Google outcome arrives once, in the URL the visitor comes back to (ADR 0019).
    effect(() => {
      const outcome = this.google();
      untracked(() => {
        if (outcome === 'suspended') this.failure.set('suspended');
        else if (outcome === 'failed') this.failure.set('google_failed');
      });
    });
    // The same for GitHub (ADR 0032).
    effect(() => {
      const outcome = this.github();
      untracked(() => {
        if (outcome === 'suspended') this.failure.set('suspended');
        else if (outcome === 'failed') this.failure.set('github_failed');
      });
    });
    let first = true;
    // Join now and Sign in switch the panel in place: take the visitor to its heading.
    effect(() => {
      this.joining();
      if (first) {
        first = false;
        return;
      }
      untracked(() => this.failure.set(null));
      afterNextRender(() => this.panelHeading()?.nativeElement.focus(), { injector });
    });
  }

  protected show(form: 'join' | 'sign-in'): void {
    const join = form === 'join' ? '' : null;
    void this.router.navigate([], { queryParams: { join }, queryParamsHandling: 'merge' });
  }

  ngOnInit(): void {
    // A member whose session the community app keeps on this device goes straight there (L2-074 AC6).
    if (this.auth.hasKeptSession()) {
      this.handingOff.set({ emailVerified: true });
      this.redirect(`${this.communityOrigin}${appPath(this.returnUrl())}`);
    }
  }

  /** One flow for "Sign in with Google" and "Sign up with Google": the browser leaves for Google. */
  protected continueWithGoogle(): void {
    if (this.googleBusy()) return;
    this.googleBusy.set(true);
    this.auth.signInWithGoogle(
      appPath(this.returnUrl()),
      this.signInForm()?.keepSignedIn() ?? false,
    );
  }

  /** One flow for "Sign in with GitHub" and "Sign up with GitHub": the browser leaves for GitHub. */
  protected continueWithGitHub(): void {
    if (this.githubBusy()) return;
    this.githubBusy.set(true);
    this.auth.signInWithGitHub(
      appPath(this.returnUrl()),
      this.signInForm()?.keepSignedIn() ?? false,
    );
  }

  /** The project's GitHub repository. */
  protected projectUrl(repo: string): string {
    return `${this.gitHubUrl}/${repo}`;
  }

  protected verifyEmailLink(email: string): string {
    return `${this.communityOrigin}/verify-email?email=${encodeURIComponent(email)}`;
  }

  protected async signUp(request: SignUpDetails): Promise<void> {
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

  protected async signIn({ email, password, keepSignedIn }: SignInCredentials): Promise<void> {
    if (this.busy()) return;
    this.failure.set(null);
    this.busy.set(true);
    try {
      const outcome = await firstValueFrom(this.auth.signInWithPassword(email, password));
      if (!outcome.succeeded) {
        this.failure.set(outcome.error);
        return;
      }
      this.handingOff.set({ emailVerified: outcome.emailVerified });
      this.redirect(this.continueUrl(keepSignedIn));
    } catch {
      this.failure.set('unreachable');
    } finally {
      this.busy.set(false);
    }
  }

  /** The community app's /auth/continue, which starts PKCE against the session just created. */
  private continueUrl(keepSignedIn: boolean): string {
    const query = new URLSearchParams({
      returnUrl: appPath(this.returnUrl()),
      keepSignedIn: keepSignedIn ? '1' : '0',
    });
    return `${this.communityOrigin}/auth/continue?${query}`;
  }
}

/** Only a path inside the community app is carried; anything else lands on home. */
function appPath(url: string | undefined): string {
  return url && url.startsWith('/') && !url.startsWith('//') ? url : '/';
}
