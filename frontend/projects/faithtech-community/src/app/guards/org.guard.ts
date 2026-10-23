import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RedirectCommand,
  Router,
  UrlSegment,
  UrlMatchResult,
} from '@angular/router';
import { ACCESS_SERVICE, ALL_ORGS, AUTH_SERVICE } from '@faithtech-community/api';

const LAST_ORG = 'ft-last-org';

/** The app sections that live under /o/{slug} (ADR 0037); old addresses for them redirect. */
export const ORG_SECTIONS = [
  'people',
  'contacts',
  'partners',
  'workspaces',
  'team',
  'events',
  'search',
  'announcements',
  'resources',
  'reports',
  'applications',
  'notes',
  'invites',
  'my-work',
];

/** Loads the caller's access before any member page, so navigation knows what to show. */
export const accessGuard: CanActivateFn = async () => {
  if (!inject(AUTH_SERVICE).isAuthenticated()) return true;
  await inject(ACCESS_SERVICE).load();
  return true;
};

/** The not-found page, keeping the address the person asked for (ADR 0037). */
function notFound(router: Router): RedirectCommand {
  return new RedirectCommand(router.parseUrl('/not-found'), { skipLocationChange: true });
}

/**
 * Makes the org in the URL active, follows an old slug to the org's current one, and answers
 * not found for an org the caller does not cover (L2-145).
 */
export const orgGuard: CanActivateFn = async (route, state) => {
  const access = inject(ACCESS_SERVICE);
  const router = inject(Router);
  await access.load();
  const slug = route.paramMap.get('orgSlug') ?? '';
  const orgs = access.orgs();
  // "All orgs" combines several orgs; someone who covers one is sent to it (L2-145 AC4).
  if (slug === ALL_ORGS && orgs.length === 1) {
    return router.parseUrl(state.url.replace(`/o/${ALL_ORGS}`, `/o/${orgs[0].slug}`));
  }
  if (slug === ALL_ORGS ? orgs.length > 1 : orgs.some((o) => o.slug === slug)) {
    access.setActive(slug);
    if (slug !== ALL_ORGS) remember(slug);
    return true;
  }
  const current = slug === ALL_ORGS ? null : await access.resolve(slug);
  if (current && orgs.some((o) => o.slug === current)) {
    return router.parseUrl(state.url.replace(`/o/${slug}`, `/o/${current}`));
  }
  return notFound(router);
};

/** A section whose feature is off in the org answers not found (ADR 0038). */
export function featureGuard(feature: string): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    const access = inject(ACCESS_SERVICE);
    const slug = route.parent?.paramMap.get('orgSlug') ?? access.activeSlug();
    return access.feature(feature, slug) || notFound(inject(Router));
  };
}

/** Matches an old app address (`/events/…`) so it can move under the active org. */
export function legacySection(segments: UrlSegment[]): UrlMatchResult | null {
  return segments.length > 0 && ORG_SECTIONS.includes(segments[0].path)
    ? { consumed: segments }
    : null;
}

/**
 * Sends an old address, or `/`, to the same page under the active org: the org open now, else
 * the last org opened, else the caller's first org (ADR 0037).
 */
export const orgRedirectGuard: CanActivateFn = async (_route, state) => {
  const access = inject(ACCESS_SERVICE);
  const router = inject(Router);
  await access.load();
  const orgs = access.orgs();
  const slugs = orgs.map((o) => o.slug);
  const active = access.activeSlug();
  const last = recall();
  const slug =
    active && (active === ALL_ORGS || slugs.includes(active))
      ? active
      : last && slugs.includes(last)
        ? last
        : slugs[0];
  // Someone who covers no org waits to be added (L2-142 AC2).
  if (!slug) return router.parseUrl('/waiting');
  // Keep what the link passed along (a page's router state, replaceUrl), so features that still
  // link to old addresses behave as before.
  const extras = router.currentNavigation()?.extras;
  return new RedirectCommand(router.parseUrl(`/o/${slug}${state.url === '/' ? '' : state.url}`), {
    state: extras?.state,
    replaceUrl: extras?.replaceUrl,
  });
};

function remember(slug: string): void {
  try {
    localStorage.setItem(LAST_ORG, slug);
  } catch {
    // Storage can be unavailable; the first org is used instead.
  }
}

function recall(): string | null {
  try {
    return localStorage.getItem(LAST_ORG);
  } catch {
    return null;
  }
}
