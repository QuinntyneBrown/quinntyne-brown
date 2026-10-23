import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ACCESS_SERVICE, AUTH_SERVICE } from '@faithtech-community/api';
import {
  ButtonComponent,
  CardComponent,
  ContainerComponent,
  GridComponent,
  LinkComponent,
  PageHeaderComponent,
  SkipLinkComponent,
  StackComponent,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

/**
 * "Waiting to be added" (docs/mocks/pages/waiting, L2-142): a signed-in person who belongs to no
 * org sees their profile and sign out, and no org navigation, until someone adds them.
 */
@Component({
  selector: 'ft-waiting-page',
  imports: [
    ButtonComponent,
    CardComponent,
    ContainerComponent,
    GridComponent,
    LinkComponent,
    PageHeaderComponent,
    SkipLinkComponent,
    StackComponent,
  ],
  templateUrl: './waiting.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitingPage {
  private readonly auth = inject(AUTH_SERVICE);
  private readonly access = inject(ACCESS_SERVICE);
  private readonly router = inject(Router);

  protected readonly user = this.auth.currentUser;
  protected readonly greeting = computed(() => {
    const first = (this.user()?.name ?? '').trim().split(/\s+/)[0];
    return first ? `Hi ${first}, your account is ready.` : 'Your account is ready.';
  });
  protected readonly checking = signal(false);

  /** Reloads access; once someone has added the person, their org's home opens (L2-142 AC4). */
  protected async checkAgain(): Promise<void> {
    this.checking.set(true);
    try {
      const access = await this.access.refresh();
      if (access.orgs.length) await this.router.navigateByUrl('/');
    } finally {
      this.checking.set(false);
    }
  }

  protected async signOut(): Promise<void> {
    await firstValueFrom(this.auth.signOut());
  }
}
