import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Injector, inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { API_BASE_URL } from '../config';
import { ACCESS_SERVICE } from './access.service';
import { OrgContext } from './org-context';

// The caller's own data and the org lookups are not about one org.
const ORGLESS = ['/me', '/account/', '/orgs/'];

/**
 * Sends the org in the URL as `X-Org` with every API request (ADR 0034), and refreshes the
 * caller's access after a 403, since their roles may have changed (ADR 0037).
 */
export const orgInterceptor: HttpInterceptorFn = (req, next) => {
  const base = inject(API_BASE_URL);
  const slug = inject(OrgContext).slug();
  const injector = inject(Injector);
  if (!req.url.startsWith(base)) return next(req);
  const path = req.url.slice(base.length);
  const scoped =
    slug && !ORGLESS.some((p) => path === p || path.startsWith(p.endsWith('/') ? p : `${p}/`));
  return next(scoped ? req.clone({ setHeaders: { 'X-Org': slug } }) : req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 403) {
        void injector
          .get(ACCESS_SERVICE, null)
          ?.refresh()
          .catch(() => undefined);
      }
      return throwError(() => error);
    }),
  );
};
