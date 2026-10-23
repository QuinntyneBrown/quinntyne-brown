import { Provider, computed, signal } from '@angular/core';

import {
  ACCESS_SERVICE,
  ALL_ORGS,
  AccessService,
  MyAccess,
  MyOrg,
  RoleOption,
} from './access.service';

/** One org's access, for a page's unit tests or a story; the rest of MyOrg is filled in. */
export interface StaticOrg extends Partial<MyOrg> {
  slug?: string;
  permissions?: string[];
}

/**
 * An AccessService answering from fixed data, for unit tests of pages that hide controls by
 * permission. The app always uses HttpAccessService.
 */
export class StaticAccessService implements AccessService {
  private readonly state: ReturnType<typeof signal<MyAccess>>;
  private readonly active: ReturnType<typeof signal<string | null>>;

  readonly access;
  readonly orgs;
  readonly isSystemAdmin;
  readonly activeSlug;
  readonly activeOrg;
  readonly homeOrg;

  constructor(access: MyAccess, active: string | null) {
    this.state = signal(access);
    this.active = signal(active);
    this.access = this.state.asReadonly();
    this.orgs = computed(() => this.state().orgs);
    this.isSystemAdmin = computed(() => this.state().isSystemAdmin);
    this.activeSlug = this.active.asReadonly();
    this.activeOrg = computed(() => this.orgs().find((o) => o.slug === this.active()) ?? null);
    this.homeOrg = computed(
      () => this.activeOrg() ?? (this.orgs().length === 1 ? this.orgs()[0] : null),
    );
  }

  load(): Promise<MyAccess> {
    return Promise.resolve(this.state());
  }

  refresh(): Promise<MyAccess> {
    return this.load();
  }

  setActive(slug: string | null): void {
    this.active.set(slug);
  }

  can(permission: string, org?: string | null): boolean {
    return this.scope(org).some((o) => o.permissions.includes(permission));
  }

  feature(name: string, org?: string | null): boolean {
    return this.scope(org).some((o) => o.features.includes(name));
  }

  shareRoles(org?: string | null): RoleOption[] {
    const found = org ? this.orgs().find((o) => o.slug === org) : this.homeOrg();
    return found?.shareRoles ?? [];
  }

  roleName(key: string, org?: string | null): string {
    const roles = org ? this.shareRoles(org) : this.orgs().flatMap((o) => o.shareRoles);
    return roles.find((r) => r.key === key)?.name ?? key;
  }

  orgsWith(permission: string): MyOrg[] {
    return this.orgs().filter((o) => o.permissions.includes(permission));
  }

  resolve(slug: string): Promise<string | null> {
    return Promise.resolve(this.orgs().some((o) => o.slug === slug) ? slug : null);
  }

  private scope(org?: string | null): MyOrg[] {
    const slug = org === undefined ? this.active() : org;
    if (slug === ALL_ORGS) return this.orgs();
    return this.orgs().filter((o) => o.slug === slug);
  }
}

/**
 * Provides ACCESS_SERVICE with the caller in one org (`faithtech-toronto` unless given), active,
 * holding `permissions` there, with every feature on.
 */
export function provideStaticAccess(
  org: StaticOrg = {},
  options: { isSystemAdmin?: boolean; more?: StaticOrg[] } = {},
): Provider {
  const orgs = [org, ...(options.more ?? [])].map(fullOrg);
  const access: MyAccess = {
    profileId: 'p-caller',
    isSystemAdmin: options.isSystemAdmin ?? false,
    portfolios: [{ id: 'portfolio', name: 'Quinntyne Brown', isLead: false }],
    orgs,
  };
  return {
    provide: ACCESS_SERVICE,
    useFactory: () => new StaticAccessService(access, orgs[0].slug),
  };
}

function fullOrg(org: StaticOrg): MyOrg {
  const slug = org.slug ?? 'faithtech-toronto';
  return {
    id: `org-${slug}`,
    slug,
    name: org.name ?? 'FaithTech Toronto',
    typeName: 'FaithTech City',
    isMember: true,
    isOrgLead: false,
    isPortfolioLead: false,
    canJoinWork: true,
    features: [
      'profiles',
      'notes',
      'contacts',
      'partners',
      'team',
      'events',
      'announcements',
      'invites',
      'resources',
      'agile',
      'reports',
      'integrations',
    ],
    roles: [],
    grantableRoles: [],
    shareRoles: [],
    branding: {
      displayName: org.name ?? 'FaithTech Toronto',
      logoUrl: null,
      accent: null,
      accentForeground: null,
    },
    ...org,
    permissions: org.permissions ?? [],
  };
}
