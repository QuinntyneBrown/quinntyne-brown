import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config';
import { HANDLES_FORBIDDEN, HANDLES_SERVER_ERROR } from '../errors';
import { PagedResult } from '../shared';
import {
  INTEGRATION_EVENTS_PAGE_SIZE,
  IntegrationApp,
  IntegrationEvent,
  IntegrationsService,
  RegisteredApp,
  RotatedSecret,
} from './integrations.service';

@Injectable()
export class HttpIntegrationsService implements IntegrationsService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(API_BASE_URL);
  /** The pages and dialogs show their own forbidden, error and failed states (docs/mocks/pages/applications). */
  private readonly own = new HttpContext()
    .set(HANDLES_FORBIDDEN, true)
    .set(HANDLES_SERVER_ERROR, true);

  list(): Observable<IntegrationApp[]> {
    return this.http.get<IntegrationApp[]>(`${this.api}/integrations/apps`, { context: this.own });
  }

  get(id: string): Observable<IntegrationApp> {
    return this.http.get<IntegrationApp>(`${this.api}/integrations/apps/${id}`, {
      context: this.own,
    });
  }

  events(id: string, page: number): Observable<PagedResult<IntegrationEvent>> {
    return this.http.get<PagedResult<IntegrationEvent>>(
      `${this.api}/integrations/apps/${id}/events`,
      {
        params: new HttpParams().set('page', page).set('pageSize', INTEGRATION_EVENTS_PAGE_SIZE),
        context: this.own,
      },
    );
  }

  register(name: string): Observable<RegisteredApp> {
    return this.http.post<RegisteredApp>(
      `${this.api}/integrations/apps`,
      { name },
      { context: this.own },
    );
  }

  rotate(id: string): Observable<RotatedSecret> {
    return this.http.post<RotatedSecret>(`${this.api}/integrations/apps/${id}/rotate`, null, {
      context: this.own,
    });
  }

  revoke(id: string): Observable<IntegrationApp> {
    return this.http.post<IntegrationApp>(`${this.api}/integrations/apps/${id}/revoke`, null, {
      context: this.own,
    });
  }
}
