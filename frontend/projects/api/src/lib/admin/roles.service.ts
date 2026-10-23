import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { RoleRef } from '../shared';

/**
 * Contract for role assignment (L2-009). Pages depend on ROLES_SERVICE, never on HttpRolesService.
 * Both calls return the profile's new role set. The server answers 403 for a role the caller may not
 * change and 409 for a role already held, one not held, or the last System Admin.
 */
export interface RolesService {
  /**
   * Grants a role by key: a catalogue role or Org Lead in `organizationId` (the active org when
   * null), or System Admin and Portfolio Lead on the platform. Answers the person's roles there.
   */
  addRole(profileId: string, role: string, organizationId?: string | null): Observable<RoleRef[]>;
  removeRole(
    profileId: string,
    role: string,
    organizationId?: string | null,
  ): Observable<RoleRef[]>;
}

export const ROLES_SERVICE = new InjectionToken<RolesService>('ROLES_SERVICE');
