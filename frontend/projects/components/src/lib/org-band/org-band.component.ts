import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { orgInitials } from '../org-switcher';
import { orgAccentStyle } from '../org-theme';

/**
 * The org band on a public event page and the branding preview (design system: components/org-label): the org's
 * logo or initials and its display name on the accent, set only through the scoped org tokens (L2-149).
 */
@Component({
  selector: 'ft-org-band',
  templateUrl: './org-band.component.html',
  styleUrl: './org-band.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'org-band', '[style]': 'style()' },
})
export class OrgBandComponent {
  readonly name = input.required<string>();
  readonly logoUrl = input<string | null>(null);
  readonly accent = input<string | null>(null);
  readonly accentForeground = input<string | null>(null);
  /** Words after the name, such as "Public event". */
  readonly caption = input('');

  protected readonly initials = computed(() => orgInitials(this.name()));
  protected readonly style = computed(() =>
    orgAccentStyle({ accent: this.accent(), accentForeground: this.accentForeground() }),
  );
}
