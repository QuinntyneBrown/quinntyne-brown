import { CdkMenu, CdkMenuItemRadio, CdkMenuTrigger } from '@angular/cdk/menu';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { IconComponent } from '../icon/icon.component';

/** One org in the switcher, from the caller's access (ADR 0037). */
export interface OrgSwitcherOption {
  slug: string;
  name: string;
  /** The Org Type's name, shown under the org's name. */
  typeName: string;
  logoUrl?: string | null;
  /** The org's accent and the foreground the server chose for it; both or neither. */
  accent?: string | null;
  accentForeground?: string | null;
}

/** The "All orgs" option's value. */
export const ALL_ORGS_OPTION = 'all';

/** Up to two initials for an org's mark: "FaithTech Toronto" is FT, "Shelfie" is S. */
export function orgInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

/**
 * The active org in the top bar and the menu to switch orgs (design system: components/org-switcher;
 * L2-144, L2-145). With one org it shows that org as text, with no button.
 */
@Component({
  selector: 'ft-org-switcher',
  imports: [CdkMenu, CdkMenuItemRadio, CdkMenuTrigger, IconComponent, NgTemplateOutlet],
  templateUrl: './org-switcher.component.html',
  styleUrl: './org-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgSwitcherComponent {
  /** Every org the person covers, in the order to show. */
  readonly orgs = input<OrgSwitcherOption[]>([]);
  /** The active org's slug, or `all`. */
  readonly active = input.required<string>();
  /** Adds "All orgs" when there are two or more orgs. */
  readonly showAllOrgs = input(true);
  /** The menu header's title. */
  readonly portfolioName = input('');
  /** Follows the org's name in the button's accessible name. */
  readonly label = input('switch organization');
  /** The chosen slug, or `all`. */
  readonly orgChange = output<string>();

  protected readonly allOrgs = ALL_ORGS_OPTION;
  protected readonly initials = orgInitials;
  protected readonly current = computed(
    () => this.orgs().find((o) => o.slug === this.active()) ?? null,
  );
  protected readonly currentName = computed(() =>
    this.active() === ALL_ORGS_OPTION ? 'All orgs' : (this.current()?.name ?? ''),
  );
  protected readonly single = computed(() => this.orgs().length === 1);
  protected readonly caption = computed(() => {
    const n = this.orgs().length;
    return `Portfolio · you cover ${n} ${n === 1 ? 'org' : 'orgs'}`;
  });
  protected readonly positions = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
  ] as const;

  protected choose(slug: string): void {
    if (slug !== this.active()) this.orgChange.emit(slug);
  }

  /** The org's accent pair as the mark's scoped tokens; the theme's accent when unset. */
  protected accentStyle(org: OrgSwitcherOption | null): Record<string, string> {
    return org?.accent && org.accentForeground
      ? {
          '--color-org-accent': org.accent,
          '--color-org-accent-foreground': org.accentForeground,
        }
      : {};
  }
}
