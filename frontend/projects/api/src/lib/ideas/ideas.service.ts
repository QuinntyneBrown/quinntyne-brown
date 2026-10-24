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

/** A submission as the wizard posts it (POST /api/ideas). Optional answers only for steps the person was asked. */
export interface SubmitIdeaRequest {
  problem: string;
  audience: string;
  title: string;
  pitch: string;
  solution: string;
  stage?: string | null;
  platform?: string | null;
  topics?: string[];
  skills?: string[];
  involvement?: string | null;
  commitment?: string | null;
  /** A visitor's name and email; a signed-in member's come from their account. */
  name?: string;
  email?: string;
}

/** What the confirmation page shows (L2-176 AC4). */
export interface SubmittedIdea {
  id: string;
  title: string;
  name: string;
  email: string;
}

/** Contract for the Ideas API. Pages depend on IDEAS_SERVICE, never on HttpIdeasService. */
export interface IdeasService {
  /** POST /api/ideas: anyone, signed in or not; validated and rate limited on the server (ADR 0044). */
  submit(request: SubmitIdeaRequest): Observable<SubmittedIdea>;
  /** GET /api/ideas/form: any signed-in member. */
  form(): Observable<IdeaForm>;
  /** GET /api/admin/ideas/settings: System Admin only; anyone else gets 404. */
  settings(): Observable<IdeaFormSettings>;
  /** PUT /api/admin/ideas/settings: System Admin only, audited. */
  saveSettings(settings: IdeaForm): Observable<IdeaFormSettings>;
}

export const IDEAS_SERVICE = new InjectionToken<IdeasService>('IDEAS_SERVICE');
