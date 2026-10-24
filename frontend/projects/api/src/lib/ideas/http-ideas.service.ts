import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config';
import { HANDLES_SERVER_ERROR } from '../errors';
import {
  IdeaForm,
  IdeaFormSettings,
  IdeasService,
  SubmitIdeaRequest,
  SubmittedIdea,
} from './ideas.service';

@Injectable()
export class HttpIdeasService implements IdeasService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(API_BASE_URL);
  /** The pages show their own failures (docs/mocks/pages/idea-settings, submit-idea). */
  private readonly own = new HttpContext().set(HANDLES_SERVER_ERROR, true);

  submit(request: SubmitIdeaRequest): Observable<SubmittedIdea> {
    return this.http.post<SubmittedIdea>(`${this.api}/ideas`, request, { context: this.own });
  }

  form(): Observable<IdeaForm> {
    return this.http.get<IdeaForm>(`${this.api}/ideas/form`, { context: this.own });
  }

  settings(): Observable<IdeaFormSettings> {
    return this.http.get<IdeaFormSettings>(`${this.api}/admin/ideas/settings`, {
      context: this.own,
    });
  }

  saveSettings(settings: IdeaForm): Observable<IdeaFormSettings> {
    return this.http.put<IdeaFormSettings>(`${this.api}/admin/ideas/settings`, settings, {
      context: this.own,
    });
  }
}
