import { Routes } from '@angular/router';

import { MembersPage } from './pages';

/** Organization settings under /o/{slug}/settings (L2-143, L2-156). */
export const ORG_SETTINGS_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'members' },
  { path: 'members', component: MembersPage },
];
