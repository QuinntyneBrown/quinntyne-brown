import { Routes } from '@angular/router';

import { IdeaFormPage } from './pages';

/** The System Admin's Idea form, mounted at /admin/ideas by the app shell (ADR 0043). */
export const IDEA_FORM_ROUTES: Routes = [{ path: '', component: IdeaFormPage }];
