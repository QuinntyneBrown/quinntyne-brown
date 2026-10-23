import { InjectionToken, Signal } from '@angular/core';

/** The "All orgs" view's slug in URLs and the `X-Org` header (ADR 0037). */
export const ALL_ORGS = 'all';

/** An org's light branding; the server picks the foreground that contrasts with the accent. */
export interface OrgBranding {
  displayName: string;
  logoUrl: string | null;
  accent: string | null;
  accentForeground: string | null;
}

/** A role the caller may grant in an org, or share an item with there (RoleOptionDto). */
export interface RoleOption {
  key: string;
  name: string;
  description: string | null;
  isCrossOrg: boolean;
}

/** One org the caller covers, with what they may do there (MyOrgDto). */
export interface MyOrg {
  id: string;
  slug: string;
  name: string;
  /** The Org Type's name, shown as the org's caption. */
  typeName: string;
  isMember: boolean;
  isOrgLead: boolean;
  isPortfolioLead: boolean;
  canJoinWork: boolean;
  features: string[];
  /** The resolved permission codes (ADR 0033). */
  permissions: string[];
  /** The caller's role names there, for the account menu. */
  roles: string[];
  grantableRoles: RoleOption[];
  shareRoles: RoleOption[];
  branding: OrgBranding;
}

export interface MyPortfolio {
  id: string;
  name: string;
  isLead: boolean;
}

/** GET /api/me/access (L2-155): an empty `orgs` means the person is waiting to be added. */
export interface MyAccess {
  profileId: string | null;
  isSystemAdmin: boolean;
  portfolios: MyPortfolio[];
  orgs: MyOrg[];
}

/**
 * What the caller may do, per org (ADR 0037). Navigation and pages use it only to hide controls;
 * the server checks every request. Pages depend on ACCESS_SERVICE, never on HttpAccessService.
 */
export interface AccessService {
  /** Null until loaded. */
  readonly access: Signal<MyAccess | null>;
  readonly orgs: Signal<MyOrg[]>;
  readonly isSystemAdmin: Signal<boolean>;
  /** The org in the URL: a slug, `all`, or null outside an org page. */
  readonly activeSlug: Signal<string | null>;
  /** The active org; null in "All orgs" and outside an org page. */
  readonly activeOrg: Signal<MyOrg | null>;
  /** The org that new things go to: the active org, or the only covered org. */
  readonly homeOrg: Signal<MyOrg | null>;

  /** Loads the caller's access once; later calls reuse it until `refresh`. */
  load(): Promise<MyAccess>;
  /** Reloads after an org switch, a 403 or a change to the caller's roles. */
  refresh(): Promise<MyAccess>;
  /** Sets the org in the URL; the API calls that follow send it as `X-Org`. */
  setActive(slug: string | null): void;
  /**
   * Whether the caller holds `permission` in `org` (a slug), in the active org when omitted, or
   * in any covered org in "All orgs".
   */
  can(permission: string, org?: string | null): boolean;
  /** Whether `feature` is on in `org`, the active org when omitted, or in any org in "All orgs". */
  feature(name: string, org?: string | null): boolean;
  /**
   * The roles an item in `org` (a slug) may be shared with: its catalogue and the cross-org roles
   * covering it; the active or only org's when omitted.
   */
  shareRoles(org?: string | null): RoleOption[];
  /** A role key's name in `org`, or the key when the caller does not know it. */
  roleName(key: string, org?: string | null): string;
  /** The covered orgs where the caller holds `permission`. */
  orgsWith(permission: string): MyOrg[];
  /** The current slug for a slug or an old one, or null when no org has it. */
  resolve(slug: string): Promise<string | null>;
}

export const ACCESS_SERVICE = new InjectionToken<AccessService>('ACCESS_SERVICE');
