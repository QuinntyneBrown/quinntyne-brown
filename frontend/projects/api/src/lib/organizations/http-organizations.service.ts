import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config';
import { HANDLES_FORBIDDEN } from '../errors';
import { BrandingDto, OrgMemberDto, OrganizationsService } from './organizations.service';

@Injectable()
export class HttpOrganizationsService implements OrganizationsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${inject(API_BASE_URL)}/organizations`;
  // The members screen shows a refusal itself rather than leaving for the forbidden page.
  private readonly context = new HttpContext().set(HANDLES_FORBIDDEN, true);

  members(orgId: string, q = '', includeAgents = false): Observable<OrgMemberDto[]> {
    const params: Record<string, string> = {};
    if (q) params['q'] = q;
    if (includeAgents) params['includeAgents'] = 'true';
    return this.http.get<OrgMemberDto[]>(this.url(orgId), { params, context: this.context });
  }

  addMember(orgId: string, email: string): Observable<OrgMemberDto> {
    return this.http.post<OrgMemberDto>(this.url(orgId), { email }, { context: this.context });
  }

  removeMember(orgId: string, profileId: string): Observable<void> {
    return this.http.delete<void>(`${this.url(orgId)}/${encodeURIComponent(profileId)}`, {
      context: this.context,
    });
  }

  setOrgLead(orgId: string, profileId: string, isLead: boolean): Observable<void> {
    const url = `${this.url(orgId)}/${encodeURIComponent(profileId)}/org-lead`;
    return isLead
      ? this.http.put<void>(url, null, { context: this.context })
      : this.http.delete<void>(url, { context: this.context });
  }

  saveBranding(
    orgId: string,
    branding: { displayName: string; accent: string | null },
  ): Observable<BrandingDto> {
    return this.http.put<BrandingDto>(this.brandingUrl(orgId), branding, { context: this.context });
  }

  uploadLogo(orgId: string, file: File): Observable<BrandingDto> {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.http.put<BrandingDto>(`${this.brandingUrl(orgId)}/logo`, form, {
      context: this.context,
    });
  }

  removeLogo(orgId: string): Observable<void> {
    return this.http.delete<void>(`${this.brandingUrl(orgId)}/logo`, { context: this.context });
  }

  private brandingUrl(orgId: string): string {
    return `${this.base}/${encodeURIComponent(orgId)}/branding`;
  }

  private url(orgId: string): string {
    return `${this.base}/${encodeURIComponent(orgId)}/members`;
  }
}
