import { HttpErrorResponse } from '@angular/common/http';
import {
  AccessService,
  MyOrg,
  RoleRef,
  RolesService,
  TierKey,
  problemDetails,
} from '@faithtech-community/api';
import {
  DialogService,
  RoleDialogComponent,
  RoleDialogData,
  RoleOption,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

/** The member whose roles change. */
export interface RoleTarget {
  id: string;
  name: string;
  roles: RoleRef[];
}

export type RoleMode = 'add' | 'remove';

/** A role the caller may grant or remove, in the org or on the platform (ADR 0033). */
interface Grantable extends RoleOption {
  /** True for System Admin and Portfolio Lead, which belong to no org. */
  platform: boolean;
}

/**
 * The roles the caller may grant in the org: its grantable catalogue roles, Org Lead for the
 * Portfolio Lead and System Admin, and the platform tiers for System Admin (RoleGrantPolicy).
 */
function grantable(access: AccessService, org: MyOrg | null): Grantable[] {
  const roles: Grantable[] = (org?.grantableRoles ?? []).map((r) => ({
    value: r.key,
    label: r.name,
    description: r.description ?? undefined,
    platform: false,
  }));
  if (org && (access.isSystemAdmin() || org.isPortfolioLead)) {
    roles.unshift({
      value: TierKey.OrgLead,
      label: 'Org Lead',
      description: 'Leads this organization and grants any of its roles',
      platform: false,
    });
  }
  if (access.isSystemAdmin()) {
    roles.push(
      {
        value: TierKey.PortfolioLead,
        label: 'Portfolio Lead',
        description: 'Runs the portfolio: its orgs, types and cross-org roles',
        platform: true,
      },
      {
        value: TierKey.SystemAdmin,
        label: 'System Admin',
        description: 'Full administration and the audit log',
        platform: true,
      },
    );
  }
  return roles;
}

/** Whether the target holds the role in the org, or on the platform for a tier. */
function holds(target: RoleTarget, role: Grantable, org: MyOrg | null): boolean {
  return target.roles.some(
    (r) => r.key === role.value && (role.platform || r.organizationId === org?.id),
  );
}

/** Roles the caller may add in the org: grantable and not yet held (L2-136). */
export function addableRoles(access: AccessService, org: MyOrg | null, target: RoleTarget) {
  return grantable(access, org).filter((r) => !holds(target, r, org));
}

/** Held roles the caller may remove in the org (L2-136). */
export function removableRoles(access: AccessService, org: MyOrg | null, target: RoleTarget) {
  return grantable(access, org).filter((r) => holds(target, r, org));
}

/** Whether the caller may change roles in the org at all. */
export function managesRoles(access: AccessService, org: MyOrg | null): boolean {
  return grantable(access, org).length > 0;
}

/**
 * Whether the target holds a role in the org that the caller may not change here. Cross-org
 * roles are assigned by a Portfolio Lead on the cross-org roles screen (ADR 0035), so they lock
 * the row for anyone below that.
 */
export function holdsLockedRole(access: AccessService, org: MyOrg | null, target: RoleTarget) {
  const mine = grantable(access, org).map((r) => r.value);
  const assignsCrossOrg = access.isSystemAdmin() || !!org?.isPortfolioLead;
  return target.roles.some((r) =>
    r.kind === 'crossOrg'
      ? !assignsCrossOrg
      : (r.organizationId === null || r.organizationId === org?.id) && !mine.includes(r.key),
  );
}

/** "City Lead · FaithTech Toronto" for a role in an org other than the active one. */
export function roleLabel(role: RoleRef, org: MyOrg | null): string {
  return role.organizationName && role.organizationId !== org?.id
    ? `${role.name} · ${role.organizationName}`
    : role.name;
}

/**
 * Opens the shared role dialog (ADR 0005) for the profile and people pages, for the org the
 * caller is in. `changed` receives the person's roles once the server has answered, so the
 * screen updates without a reload (L2-009 AC5).
 */
export function openRoleDialog(
  dialogs: DialogService,
  rolesService: RolesService,
  access: AccessService,
  org: MyOrg | null,
  target: RoleTarget,
  mode: RoleMode,
  changed: (roles: RoleRef[]) => void,
): void {
  const roles =
    mode === 'add' ? addableRoles(access, org, target) : removableRoles(access, org, target);
  const held = target.roles.map((r) => roleLabel(r, org));
  const data: RoleDialogData = {
    mode,
    name: target.name,
    description:
      mode === 'add'
        ? `${target.name} ${held.length ? `holds ${held.join(', ')}` : 'has no role yet'}. People can hold several roles at once.`
        : `${target.name} stays a member and keeps any other roles. The change is recorded in the audit log.`,
    options: roles.map(({ value, label, description }) => ({ value, label, description })),
    caption:
      mode === 'add' && !access.isSystemAdmin()
        ? 'Org Lead and the platform roles are granted by a Portfolio Lead or System Admin.'
        : undefined,
    submit: (role) => {
      const platform = roles.find((r) => r.value === role)?.platform ?? false;
      return changeRole(
        rolesService,
        target,
        mode,
        role,
        platform ? null : (org?.id ?? null),
        changed,
      );
    },
  };
  dialogs.open(RoleDialogComponent, { data });
}

/** Resolves to null once `changed` has the new roles, or to the server's refusal. */
async function changeRole(
  rolesService: RolesService,
  target: RoleTarget,
  mode: RoleMode,
  role: string,
  orgId: string | null,
  changed: (roles: RoleRef[]) => void,
): Promise<string | null> {
  try {
    const call =
      mode === 'add'
        ? rolesService.addRole(target.id, role, orgId)
        : rolesService.removeRole(target.id, role, orgId);
    const answer = await firstValueFrom(call);
    // An org change answers that org's roles; the person's roles in other orgs stay as they were.
    const elsewhere = orgId
      ? target.roles.filter((r) => r.organizationId !== null && r.organizationId !== orgId)
      : [];
    changed([...answer, ...elsewhere]);
    return null;
  } catch (error) {
    if (error instanceof HttpErrorResponse && (error.status === 403 || error.status === 409)) {
      return problemDetails(error)?.detail ?? 'You can’t make that change.';
    }
    throw error;
  }
}
