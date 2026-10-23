import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { RoleRef } from '../shared';

/** A member of an org on the members screen (MemberDto, L2-143). */
export interface OrgMemberDto {
  profileId: string;
  name: string;
  photoUrl: string | null;
  /** `Person` or `Agent` (ADR 0036). */
  kind: 'Person' | 'Agent';
  isOrgLead: boolean;
  /** Their roles in this org. */
  roles: RoleRef[];
  joinedAt: string;
  joinedVia: 'Seed' | 'Invite' | 'ConnectLink' | 'Added';
}

/**
 * Contract for the organization endpoints (L2-143, L2-156). Pages depend on ORGANIZATIONS_SERVICE,
 * never on HttpOrganizationsService.
 */
export interface OrganizationsService {
  members(orgId: string, q?: string, includeAgents?: boolean): Observable<OrgMemberDto[]>;
  /** Adds an existing account by email; 404 with a detail when no account uses it. */
  addMember(orgId: string, email: string): Observable<OrgMemberDto>;
  /** Removes the member and their roles there; 409 for the last Org Lead. */
  removeMember(orgId: string, profileId: string): Observable<void>;
  setOrgLead(orgId: string, profileId: string, isLead: boolean): Observable<void>;
}

export const ORGANIZATIONS_SERVICE = new InjectionToken<OrganizationsService>(
  'ORGANIZATIONS_SERVICE',
);
