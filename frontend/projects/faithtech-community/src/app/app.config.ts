import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { AUTH_SERVICE, provideApi } from '@faithtech-community/api';
import { ThemeService } from '@faithtech-community/components';

import { sessionHintDomain } from '../environments/session-hint-domain';
import { routes } from './app.routes';
import { OrgRouteReuseStrategy } from './org-route-reuse';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: RouteReuseStrategy, useClass: OrgRouteReuseStrategy },
    // The API and the identity server share the web app's origin (a reverse proxy in front of both).
    provideApi('/api', { sessionHintDomain }),
    // Resume a stored session before the first navigation so guards see it.
    provideAppInitializer(() => inject(AUTH_SERVICE).restoreSession()),
    // Apply the theme saved on this device (Settings > Appearance) before the first page paints.
    provideAppInitializer(() => {
      inject(ThemeService);
    }),
  ],
};
