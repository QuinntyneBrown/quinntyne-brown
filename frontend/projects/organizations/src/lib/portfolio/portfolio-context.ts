import { computed, inject } from '@angular/core';
import { ACCESS_SERVICE } from '@faithtech-community/api';

/** The sections of the Portfolio screens, in tab order. */
export type PortfolioSection = 'organizations' | 'org-types' | 'cross-org-roles' | 'agents';

/**
 * The portfolio the caller administers and the active org's address, for the Portfolio screens
 * (L2-134, L2-156). Only the Portfolio Lead and System Admins may use them; the server decides.
 */
export function portfolioContext() {
  const access = inject(ACCESS_SERVICE);
  const portfolio = computed(() => {
    const portfolios = access.access()?.portfolios ?? [];
    return portfolios.find((p) => p.isLead) ?? portfolios[0] ?? null;
  });
  return {
    access,
    portfolio,
    allowed: computed(() => access.isSystemAdmin() || !!portfolio()?.isLead),
    base: computed(() => `/o/${access.activeSlug() ?? ''}/portfolio`),
  };
}
