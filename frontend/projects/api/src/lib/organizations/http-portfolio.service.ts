import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config';
import { HANDLES_FORBIDDEN } from '../errors';
import {
  AgentDto,
  AgentTokenDto,
  CrossOrgAssignmentDto,
  CrossOrgRoleDto,
  IssuedTokenDto,
  OrgTypeDto,
  OrgTypeSummaryDto,
  OrganizationDto,
  OrganizationSummaryDto,
  PortfolioService,
  RoleDefinitionDto,
  RoleDefinitionRequest,
} from './portfolio.service';

@Injectable()
export class HttpPortfolioService implements PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);
  // The portfolio screens show a refusal themselves rather than leaving for the forbidden page.
  private readonly context = new HttpContext().set(HANDLES_FORBIDDEN, true);

  orgTypes(portfolioId: string): Observable<OrgTypeSummaryDto[]> {
    return this.http.get<OrgTypeSummaryDto[]>(
      this.portfolio(portfolioId, 'org-types'),
      this.options(),
    );
  }

  createOrgType(portfolioId: string, body: { key: string; name: string }): Observable<OrgTypeDto> {
    return this.http.post<OrgTypeDto>(
      this.portfolio(portfolioId, 'org-types'),
      body,
      this.options(),
    );
  }

  orgType(id: string): Observable<OrgTypeDto> {
    return this.http.get<OrgTypeDto>(this.type(id), this.options());
  }

  setFeatures(id: string, enabled: string[]): Observable<OrgTypeDto> {
    return this.http.put<OrgTypeDto>(`${this.type(id)}/features`, { enabled }, this.options());
  }

  createRole(typeId: string, body: RoleDefinitionRequest): Observable<RoleDefinitionDto> {
    return this.http.post<RoleDefinitionDto>(`${this.type(typeId)}/roles`, body, this.options());
  }

  updateRole(
    typeId: string,
    roleId: string,
    body: RoleDefinitionRequest,
  ): Observable<RoleDefinitionDto> {
    return this.http.put<RoleDefinitionDto>(
      `${this.type(typeId)}/roles/${encodeURIComponent(roleId)}`,
      body,
      this.options(),
    );
  }

  reorderRoles(
    typeId: string,
    items: { roleId: string; parentRoleId: string | null; sortOrder: number }[],
  ): Observable<void> {
    return this.http.put<void>(`${this.type(typeId)}/roles/order`, { items }, this.options());
  }

  removeRole(typeId: string, roleId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.type(typeId)}/roles/${encodeURIComponent(roleId)}`,
      this.options(),
    );
  }

  organizations(portfolioId: string, archived = false): Observable<OrganizationSummaryDto[]> {
    return this.http.get<OrganizationSummaryDto[]>(this.portfolio(portfolioId, 'organizations'), {
      ...this.options(),
      params: archived ? { archived: 'true' } : {},
    });
  }

  createOrganization(
    portfolioId: string,
    body: { name: string; slug: string; orgTypeId: string },
  ): Observable<OrganizationDto> {
    return this.http.post<OrganizationDto>(
      this.portfolio(portfolioId, 'organizations'),
      body,
      this.options(),
    );
  }

  organization(id: string): Observable<OrganizationDto> {
    return this.http.get<OrganizationDto>(this.org(id), this.options());
  }

  updateOrganization(
    id: string,
    body: { name: string; slug: string },
  ): Observable<OrganizationDto> {
    return this.http.put<OrganizationDto>(this.org(id), body, this.options());
  }

  archiveOrganization(id: string, archive: boolean): Observable<void> {
    return this.http.post<void>(
      `${this.org(id)}/${archive ? 'archive' : 'restore'}`,
      null,
      this.options(),
    );
  }

  crossOrgRoles(portfolioId: string): Observable<CrossOrgRoleDto[]> {
    return this.http.get<CrossOrgRoleDto[]>(
      this.portfolio(portfolioId, 'cross-org-roles'),
      this.options(),
    );
  }

  assignments(roleId: string): Observable<CrossOrgAssignmentDto[]> {
    return this.http.get<CrossOrgAssignmentDto[]>(
      `${this.crossOrg(roleId)}/assignments`,
      this.options(),
    );
  }

  assign(
    roleId: string,
    profileId: string,
    narrowedOrgIds: string[],
  ): Observable<CrossOrgAssignmentDto> {
    return this.http.post<CrossOrgAssignmentDto>(
      `${this.crossOrg(roleId)}/assignments`,
      { profileId, narrowedOrgIds },
      this.options(),
    );
  }

  unassign(roleId: string, assignmentId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.crossOrg(roleId)}/assignments/${encodeURIComponent(assignmentId)}`,
      this.options(),
    );
  }

  agents(portfolioId: string): Observable<AgentDto[]> {
    return this.http.get<AgentDto[]>(`${this.base}/agents`, {
      ...this.options(),
      params: { portfolioId },
    });
  }

  createAgent(portfolioId: string, name: string): Observable<AgentDto> {
    return this.http.post<AgentDto>(`${this.base}/agents`, { portfolioId, name }, this.options());
  }

  tokens(agentId: string): Observable<AgentTokenDto[]> {
    return this.http.get<AgentTokenDto[]>(`${this.agent(agentId)}/tokens`, this.options());
  }

  issueToken(
    agentId: string,
    body: { name: string; expiresInDays: number; orgIds: string[] },
  ): Observable<IssuedTokenDto> {
    return this.http.post<IssuedTokenDto>(`${this.agent(agentId)}/tokens`, body, this.options());
  }

  revokeToken(agentId: string, tokenId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.agent(agentId)}/tokens/${encodeURIComponent(tokenId)}`,
      this.options(),
    );
  }

  private options() {
    return { context: this.context };
  }

  private portfolio(id: string, path: string): string {
    return `${this.base}/portfolios/${encodeURIComponent(id)}/${path}`;
  }

  private type(id: string): string {
    return `${this.base}/org-types/${encodeURIComponent(id)}`;
  }

  private org(id: string): string {
    return `${this.base}/organizations/${encodeURIComponent(id)}`;
  }

  private crossOrg(id: string): string {
    return `${this.base}/cross-org-roles/${encodeURIComponent(id)}`;
  }

  private agent(id: string): string {
    return `${this.base}/agents/${encodeURIComponent(id)}`;
  }
}
