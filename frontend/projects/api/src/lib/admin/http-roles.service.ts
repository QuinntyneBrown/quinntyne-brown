import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config';
import { HANDLES_FORBIDDEN } from '../errors';
import { RoleRef } from '../shared';
import { RolesService } from './roles.service';

@Injectable()
export class HttpRolesService implements RolesService {
  private readonly http = inject(HttpClient);
  private readonly base = `${inject(API_BASE_URL)}/profiles`;
  // The role dialog shows a refusal itself rather than leaving for the forbidden page.
  private readonly context = new HttpContext().set(HANDLES_FORBIDDEN, true);

  addRole(profileId: string, role: string, organizationId?: string | null): Observable<RoleRef[]> {
    return this.http.post<RoleRef[]>(
      `${this.base}/${encodeURIComponent(profileId)}/roles`,
      organizationId ? { role, organizationId } : { role },
      { context: this.context },
    );
  }

  removeRole(
    profileId: string,
    role: string,
    organizationId?: string | null,
  ): Observable<RoleRef[]> {
    return this.http.delete<RoleRef[]>(
      `${this.base}/${encodeURIComponent(profileId)}/roles/${encodeURIComponent(role)}`,
      {
        context: this.context,
        ...(organizationId ? { params: { organizationId } } : {}),
      },
    );
  }
}
