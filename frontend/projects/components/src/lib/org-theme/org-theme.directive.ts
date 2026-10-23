import { Directive, computed, input } from '@angular/core';

import { OrgAccent, orgAccentStyle } from './org-theme';

/**
 * Sets the scoped org tokens `--color-org-accent` and `--color-org-accent-foreground` on its host from an org's
 * branding (L2-149 AC6). Components inside read the tokens, never the hex; without an accent the brand tokens apply.
 */
@Directive({
  selector: '[ftOrgTheme]',
  host: { '[style]': 'style()' },
})
export class OrgThemeDirective {
  readonly ftOrgTheme = input<OrgAccent | null | undefined>(null);

  protected readonly style = computed(() => orgAccentStyle(this.ftOrgTheme()));
}
