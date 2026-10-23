import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Which org a row, result or notice belongs to under "All orgs" (design system: components/org-label).
 * The dot takes the org's accent through the scoped tokens; `portfolio` labels portfolio-wide items.
 */
@Component({
  selector: 'ft-org-label',
  templateUrl: './org-label.component.html',
  styleUrl: './org-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'org-label',
    '[class.org-label--portfolio]': 'portfolio()',
    '[style]': 'accentStyle()',
    '[attr.title]': 'name()',
  },
})
export class OrgLabelComponent {
  readonly name = input.required<string>();
  /** The org's accent pair; the theme's accent when unset. */
  readonly accent = input<string | null>(null);
  readonly accentForeground = input<string | null>(null);
  readonly portfolio = input(false);

  protected readonly accentStyle = computed((): Record<string, string> => {
    const accent = this.accent();
    const foreground = this.accentForeground();
    if (!accent || !foreground) return {};
    return { '--color-org-accent': accent, '--color-org-accent-foreground': foreground };
  });
}
