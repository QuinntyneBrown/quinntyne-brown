import { Routes } from '@angular/router';

import {
  AgentsPage,
  CrossOrgRolesPage,
  MembersPage,
  OrgBrandingPage,
  OrgTypePage,
  OrgTypesPage,
  OrganizationsPage,
} from './pages';

/** Organization settings under /o/{slug}/settings (L2-143, L2-149, L2-156). */
export const ORG_SETTINGS_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'members' },
  { path: 'members', component: MembersPage },
  { path: 'branding', component: OrgBrandingPage, title: 'Branding' },
];

/** Portfolio administration under /o/{slug}/portfolio (L2-134, L2-137, L2-138, L2-147, L2-154, L2-156). */
export const PORTFOLIO_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'organizations' },
  { path: 'organizations', component: OrganizationsPage, title: 'Organizations' },
  { path: 'org-types', component: OrgTypesPage, title: 'Org Types' },
  { path: 'org-types/:id', component: OrgTypePage, title: 'Org Type' },
  { path: 'org-types/:id/:section', component: OrgTypePage, title: 'Org Type' },
  { path: 'cross-org-roles', component: CrossOrgRolesPage, title: 'Cross-org roles' },
  { path: 'agents', component: AgentsPage, title: 'Agents' },
];
