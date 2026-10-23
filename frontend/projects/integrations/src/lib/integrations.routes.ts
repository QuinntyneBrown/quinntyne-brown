import { Routes } from '@angular/router';

import { ApplicationsPage } from './pages';

/** Lazy-loaded by the app shell at /o/:orgSlug/applications (docs/detailed-designs/integrations). */
export const INTEGRATIONS_ROUTES: Routes = [{ path: '', component: ApplicationsPage }];
