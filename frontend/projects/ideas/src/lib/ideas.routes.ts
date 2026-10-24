import { Routes } from '@angular/router';

import { IdeaFormPage, SubmitIdeaPage } from './pages';

/** Submit an app idea, mounted at /ideas in the public shell or the app shell (ADR 0043). */
export const IDEAS_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'new' },
  { path: 'new', component: SubmitIdeaPage },
];

/** The System Admin's Idea form, mounted at /admin/ideas by the app shell (ADR 0043). */
export const IDEA_FORM_ROUTES: Routes = [{ path: '', component: IdeaFormPage }];
