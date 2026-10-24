import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {
  ButtonComponent,
  ContainerComponent,
  SkipLinkComponent,
  TopBarComponent,
} from '@faithtech-community/components';
import { filter, map } from 'rxjs';

/**
 * The chrome around pages anyone may open without signing in, such as a public event (L2-023): the brand and
 * Sign in, which returns to the members' view of the same page (docs/mocks/pages/public-event).
 */
@Component({
  selector: 'ft-public-shell',
  imports: [RouterOutlet, ButtonComponent, ContainerComponent, SkipLinkComponent, TopBarComponent],
  templateUrl: './public-shell.component.html',
  styleUrl: './public-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicShellComponent {
  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  /**
   * /o/{slug}/events/{id} signs in to the same address, which members see as the event page (L2-149); so does
   * /ideas/new, which members see in the app shell (ADR 0043).
   */
  protected readonly signInHref = computed(() => {
    const page = /^(\/o\/[^/?#]+\/events\/[^/?#]+|\/ideas\/new)/.exec(this.url())?.[0];
    return page ? `/sign-in?returnUrl=${encodeURIComponent(page)}` : '/sign-in';
  });
}
