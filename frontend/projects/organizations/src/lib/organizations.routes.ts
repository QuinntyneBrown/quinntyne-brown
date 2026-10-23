import { Routes } from '@angular/router';

import { MembersPage, OrgBrandingPage } from './pages';

/** Organization settings under /o/{slug}/settings (L2-143, L2-149, L2-156). */
export const ORG_SETTINGS_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'members' },
  { path: 'members', component: MembersPage },
  { path: 'branding', component: OrgBrandingPage, title: 'Branding' },
];
