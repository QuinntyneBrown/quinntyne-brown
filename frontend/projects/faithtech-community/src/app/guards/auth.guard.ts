import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { ACCESS_SERVICE, AUTH_SERVICE } from '@faithtech-community/api';

/** Sends a signed-out visitor to sign in, remembering the page they asked for (L2-003 AC1). */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AUTH_SERVICE);
  return auth.isAuthenticated()
    ? true
    : inject(Router).createUrlTree(['/sign-in'], { queryParams: { returnUrl: state.url } });
};

/**
 * The anonymous public event page answers /o/{slug}/events/{id} unless the visitor is signed in and covers the org;
 * then the members' event page does (L2-149, ADR 0037).
 */
export const publicEventMatch: CanMatchFn = async (_route, segments) => {
  if (segments[2]?.path !== 'events' || segments.length !== 4) return false;
  if (!inject(AUTH_SERVICE).isAuthenticated()) return true;
  const access = inject(ACCESS_SERVICE);
  try {
    await access.load();
  } catch {
    return true;
  }
  const slug = segments[1]?.path;
  return !access.orgs().some((o) => o.slug === slug);
};
