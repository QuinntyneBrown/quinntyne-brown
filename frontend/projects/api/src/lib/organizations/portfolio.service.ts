import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { OrgLabel } from '../shared';

export interface OrgTypeSummaryDto {
  id: string;
  key: string;
  name: string;
  /** The switchable features that are on; profiles and notes are always on. */
  enabledFeatures: string[];
  roleCount: number;
  orgCount: number;
}

export interface RoleDefinitionDto {
  id: string;
  key: string;
  name: string;
  description: string | null;
  /** For display order only; grants nothing (L2-134 AC4). */
  parentRoleId: string | null;
  sortOrder: number;
  permissions: string[];
  canGrant: string[];
  holderCount: number;
}

export interface PermissionGroupDto {
  feature: string;
  enabled: boolean;
  codes: string[];
}

export interface OrgTypeDto {
  id: string;
  key: string;
  name: string;
  enabledFeatures: string[];
  memberPermissions: string[];
  roles: RoleDefinitionDto[];
  permissionCatalogue: PermissionGroupDto[];
}

export interface RoleDefinitionRequest {
  key: string;
  name: string;
  description: string | null;
  parentRoleId: string | null;
  permissions: string[];
  canGrant: string[];
}

/** Someone holding a role that cannot be removed (409 `holders`, L2-137 AC3). */
export interface RoleHolderDto {
  profileId: string;
  name: string;
  org: OrgLabel;
}

export interface OrganizationSummaryDto {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  orgType: { id: string; name: string };
  memberCount: number;
  orgLeads: { profileId: string; name: string }[];
  archivedAt: string | null;
}

export interface OrganizationDto {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  orgType: { id: string; name: string };
  aliases: string[];
  archivedAt: string | null;
}

export type CrossOrgScopeKind = 'Portfolio' | 'OrgType' | 'Orgs';

export interface CrossOrgRoleDto {
  id: string;
  key: string;
  name: string;
  description: string | null;
  permissions: string[];
  canJoinWork: boolean;
  scopeKind: CrossOrgScopeKind;
  scopeOrgTypeId: string | null;
  scopeOrgIds: string[];
  holderCount: number;
}

export interface CrossOrgAssignmentDto {
  id: string;
  profileId: string;
  name: string;
  /** Empty for the role's whole scope. */
  narrowedOrgIds: string[];
}

export interface AgentDto {
  profileId: string;
  name: string;
  photoUrl: string | null;
  orgs: OrgLabel[];
  tokenCount: number;
}

export interface AgentTokenDto {
  id: string;
  name: string;
  prefix: string;
  orgs: OrgLabel[];
  issuedBy: { profileId: string; name: string };
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

/** A token as issued: `token` is shown once and never again (L2-154 AC2). */
export interface IssuedTokenDto {
  id: string;
  name: string;
  prefix: string;
  orgs: OrgLabel[];
  expiresAt: string;
  token: string;
}

/**
 * Contract for the portfolio administration endpoints: Org Types and their catalogues, orgs,
 * cross-org roles and agents (L2-134, L2-137, L2-138, L2-147, L2-154, L2-156). Pages depend on
 * PORTFOLIO_SERVICE, never on HttpPortfolioService.
 */
export interface PortfolioService {
  orgTypes(portfolioId: string): Observable<OrgTypeSummaryDto[]>;
  createOrgType(portfolioId: string, body: { key: string; name: string }): Observable<OrgTypeDto>;
  orgType(id: string): Observable<OrgTypeDto>;
  setFeatures(id: string, enabled: string[]): Observable<OrgTypeDto>;
  createRole(typeId: string, body: RoleDefinitionRequest): Observable<RoleDefinitionDto>;
  updateRole(
    typeId: string,
    roleId: string,
    body: RoleDefinitionRequest,
  ): Observable<RoleDefinitionDto>;
  reorderRoles(
    typeId: string,
    items: { roleId: string; parentRoleId: string | null; sortOrder: number }[],
  ): Observable<void>;
  /** 409 with `holders` while anyone holds the role. */
  removeRole(typeId: string, roleId: string): Observable<void>;

  organizations(portfolioId: string, archived?: boolean): Observable<OrganizationSummaryDto[]>;
  createOrganization(
    portfolioId: string,
    body: { name: string; slug: string; orgTypeId: string },
  ): Observable<OrganizationDto>;
  organization(id: string): Observable<OrganizationDto>;
  updateOrganization(id: string, body: { name: string; slug: string }): Observable<OrganizationDto>;
  archiveOrganization(id: string, archive: boolean): Observable<void>;

  crossOrgRoles(portfolioId: string): Observable<CrossOrgRoleDto[]>;
  assignments(roleId: string): Observable<CrossOrgAssignmentDto[]>;
  assign(
    roleId: string,
    profileId: string,
    narrowedOrgIds: string[],
  ): Observable<CrossOrgAssignmentDto>;
  unassign(roleId: string, assignmentId: string): Observable<void>;

  agents(portfolioId: string): Observable<AgentDto[]>;
  createAgent(portfolioId: string, name: string): Observable<AgentDto>;
  tokens(agentId: string): Observable<AgentTokenDto[]>;
  issueToken(
    agentId: string,
    body: { name: string; expiresInDays: number; orgIds: string[] },
  ): Observable<IssuedTokenDto>;
  revokeToken(agentId: string, tokenId: string): Observable<void>;
}

export const PORTFOLIO_SERVICE = new InjectionToken<PortfolioService>('PORTFOLIO_SERVICE');
