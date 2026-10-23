import { Routes } from '@angular/router';

import { ApplicationPage, ApplicationsPage } from './pages';

/** Lazy-loaded by the app shell at /o/:orgSlug/applications (docs/detailed-designs/integrations). */
export const INTEGRATIONS_ROUTES: Routes = [
  { path: '', component: ApplicationsPage },
  { path: ':id', component: ApplicationPage },
];
