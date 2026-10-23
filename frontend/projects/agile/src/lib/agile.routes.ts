import { Routes } from '@angular/router';

import {
  BacklogPage,
  BoardPage,
  MyWorkPage,
  PlanningPokerPage,
  WorkItemPage,
  WorkspaceSettingsPage,
  WorkspacesPage,
} from './pages';

export const AGILE_ROUTES: Routes = [
  { path: '', component: WorkspacesPage },
  { path: ':id', pathMatch: 'full', component: BoardPage },
  { path: ':id/backlog', component: BacklogPage },
  { path: ':id/items/:itemId', component: WorkItemPage },
  { path: ':id/poker', component: PlanningPokerPage },
  { path: ':id/settings', component: WorkspaceSettingsPage },
];

/** My work, under /o/{slug}/my-work (L2-145 AC3). */
export const MY_WORK_ROUTES: Routes = [{ path: '', component: MyWorkPage }];
