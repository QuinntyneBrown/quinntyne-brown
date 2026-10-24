import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

/** The Idea form as System Admin sees it (docs/detailed-designs/ideas/idea-form, L2-181). */
export interface IdeaFormSettings {
  askStage: boolean;
  askPeople: boolean;
  updatedAt: string | null;
}

/** The two switches a signed-in member's wizard needs to plan its steps (L2-171). */
export interface IdeaForm {
  askStage: boolean;
  askPeople: boolean;
}

/** Contract for the Ideas API. Pages depend on IDEAS_SERVICE, never on HttpIdeasService. */
export interface IdeasService {
  /** GET /api/ideas/form: any signed-in member. */
  form(): Observable<IdeaForm>;
  /** GET /api/admin/ideas/settings: System Admin only; anyone else gets 404. */
  settings(): Observable<IdeaFormSettings>;
  /** PUT /api/admin/ideas/settings: System Admin only, audited. */
  saveSettings(settings: IdeaForm): Observable<IdeaFormSettings>;
}

export const IDEAS_SERVICE = new InjectionToken<IdeasService>('IDEAS_SERVICE');
