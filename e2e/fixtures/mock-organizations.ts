import { Route } from '@playwright/test';

/**
 * The organization hierarchy as the API resolves it (ADR 0033 to 0038, backend
 * Application/Organizations): orgs of a type with enabled features, catalogue roles that bundle
 * permission codes, the built-in tiers, cross-org roles and slug aliases.
 */
export interface MockOrg {
  id: string;
  slug: string;
  name: string;
  typeName: string;
  features: string[];
  /** Old slugs that redirect here (OrgSlugAlias). */
  aliases: string[];
  displayName?: string;
  logoUrl?: string | null;
  accent?: string | null;
  accentForeground?: string | null;
  archived?: boolean;
}

/** WCAG 2.2 contrast, as AccentContrast computes it. */
function ratio(a: string, b: string): number {
  const lum = (hex: string) => {
    const c = (i: number) => {
      const v = parseInt(hex.slice(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * c(1) + 0.7152 * c(3) + 0.0722 * c(5);
  };
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

function foregroundOf(accent: string): string {
  return ratio(accent, '#ffffff') >= ratio(accent, '#111111') ? '#ffffff' : '#111111';
}

function bestRatio(accent: string): number {
  return Math.floor(Math.max(ratio(accent, '#ffffff'), ratio(accent, '#111111')) * 100) / 100;
}

/** The parts of an account the resolver reads; see MockAccount in mock-api.ts. */
export interface OrgMember {
  profileId: string;
  roles: string[];
  orgs?: string[];
  orgRoles?: Record<string, string[]>;
  orgLead?: string[];
  portfolioLead?: boolean;
  crossOrg?: string[];
}

export interface CoveredOrg {
  org: MockOrg;
  isMember: boolean;
  isOrgLead: boolean;
  isPortfolioLead: boolean;
  canJoinWork: boolean;
  permissions: Set<string>;
  /** The caller's catalogue role names there, for the account menu. */
  roleNames: string[];
}

export const TORONTO = 'faithtech-toronto';
export const SHELFIE = 'shelfie';
export const PORTFOLIO_NAME = 'Quinntyne Brown';

const ALL_FEATURES = [
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
];

/** Each code's feature (Permissions.FeatureOf). */
export const FEATURE_OF: Record<string, string> = {
  'people.view': 'profiles',
  'roles.grant': 'profiles',
  'invites.send': 'invites',
  'connectLink.own': 'invites',
  'contacts.private': 'contacts',
  'partners.read': 'partners',
  'partners.write': 'partners',
  'events.manage': 'events',
  'events.rsvpList': 'events',
  'events.rsvpListEmails': 'events',
  'events.checkIn': 'events',
  'announcements.send': 'announcements',
  'resources.create': 'resources',
  'notes.create': 'notes',
  'workspaces.create': 'agile',
  'workspaces.join': 'agile',
  'workspaces.readAll': 'agile',
  'reports.view': 'reports',
  'team.member': 'team',
  'team.lead': 'team',
};

const LEAD = [
  'invites.send',
  'contacts.private',
  'partners.read',
  'partners.write',
  'events.rsvpList',
  'events.rsvpListEmails',
  'events.checkIn',
  'resources.create',
  'workspaces.join',
  'team.member',
  'team.lead',
];

interface CatalogueRole {
  key: string;
  name: string;
  description: string;
  permissions: string[];
  canGrant: string[];
}

/** The seeded catalogues (Infrastructure/Persistence/HierarchySeed.cs), keyed by Org Type. */
const CATALOGUES: Record<string, CatalogueRole[]> = {
  'FaithTech City': [
    {
      key: 'city-lead',
      name: 'City Lead',
      description: 'Leads a city team and manages its roles',
      permissions: [
        ...LEAD,
        'people.view',
        'roles.grant',
        'connectLink.own',
        'events.manage',
        'workspaces.create',
      ],
      canGrant: [
        'event-lead',
        'create-lead',
        'communications-lead',
        'volunteer',
        'product-engineer',
        'attendee',
      ],
    },
    {
      key: 'event-lead',
      name: 'Event Lead',
      description: 'Creates and manages events',
      permissions: [...LEAD, 'events.manage'],
      canGrant: [],
    },
    {
      key: 'create-lead',
      name: 'Create Lead',
      description: 'Runs hackathon builders and projects',
      permissions: [...LEAD],
      canGrant: [],
    },
    {
      key: 'communications-lead',
      name: 'Communications Lead',
      description: 'Sends announcements',
      permissions: [...LEAD, 'announcements.send'],
      canGrant: [],
    },
    {
      key: 'volunteer',
      name: 'Volunteer',
      description: 'Joins the city team',
      permissions: ['workspaces.join', 'team.member'],
      canGrant: [],
    },
    {
      key: 'product-engineer',
      name: 'Product Engineer',
      description: 'Builds at hackathons',
      permissions: [],
      canGrant: [],
    },
    {
      key: 'attendee',
      name: 'Attendee',
      description: 'Comes to events',
      permissions: [],
      canGrant: [],
    },
  ],
  Startup: [
    {
      key: 'engineer',
      name: 'Engineer',
      description: 'Builds the product',
      permissions: ['invites.send', 'resources.create', 'workspaces.create', 'workspaces.join'],
      canGrant: [],
    },
    {
      key: 'advisor',
      name: 'Advisor',
      description: 'Advises the team',
      permissions: ['resources.create', 'workspaces.join'],
      canGrant: [],
    },
  ],
};

/** Every member's bundle (ADR 0033). */
const MEMBER_PERMISSIONS = ['notes.create'];

interface CrossOrgRole {
  key: string;
  name: string;
  permissions: string[];
  /** The Org Type it covers, or every org of the portfolio. */
  typeName: string | null;
  canJoinWork: boolean;
}

/** The seeded cross-org roles (ADR 0035). */
const CROSS_ORG: CrossOrgRole[] = [
  {
    key: 'portfolio',
    name: 'Portfolio',
    permissions: [
      'people.view',
      'partners.read',
      'events.rsvpList',
      'workspaces.readAll',
      'reports.view',
    ],
    typeName: null,
    canJoinWork: true,
  },
  {
    key: 'staff',
    name: 'Staff',
    permissions: [
      'people.view',
      'partners.read',
      'events.rsvpList',
      'workspaces.readAll',
      'reports.view',
      'resources.create',
      'notes.create',
    ],
    typeName: 'FaithTech City',
    canJoinWork: false,
  },
];

/** The old role names the specs give accounts, as the catalogue key in the account's first org. */
const LEGACY_KEYS: Record<string, string> = {
  CityLead: 'city-lead',
  EventLead: 'event-lead',
  CreateLead: 'create-lead',
  CommunicationsLead: 'communications-lead',
  Volunteer: 'volunteer',
  ProductEngineer: 'product-engineer',
  Attendee: 'attendee',
};

/** A role as the API returns it on profiles and the admin users list (RoleDto). */
export interface MockRoleRef {
  key: string;
  name: string;
  kind: 'catalogue' | 'tier' | 'crossOrg';
  organizationId: string | null;
  organizationName: string | null;
}

/** A role the caller may grant, or share with, in an org (RoleOptionDto). */
export interface MockRoleOption {
  key: string;
  name: string;
  description: string | null;
  isCrossOrg: boolean;
}

export class MockOrganizations {
  readonly orgs: MockOrg[] = [
    {
      id: 'org-toronto',
      slug: TORONTO,
      name: 'FaithTech Toronto',
      typeName: 'FaithTech City',
      features: [...ALL_FEATURES],
      aliases: [],
    },
    {
      id: 'org-shelfie',
      slug: SHELFIE,
      name: 'Shelfie',
      typeName: 'Startup',
      features: ['profiles', 'notes', 'invites', 'resources', 'agile'],
      aliases: [],
    },
  ];

  /** Adds an org; FaithTech City orgs get every feature unless `features` says otherwise. */
  add(org: Partial<MockOrg> & { slug: string; name: string }): MockOrg {
    const full: MockOrg = {
      id: `org-${org.slug}`,
      typeName: 'FaithTech City',
      features: org.typeName === 'Startup' ? ['profiles', 'notes'] : [...ALL_FEATURES],
      aliases: [],
      ...org,
    };
    this.orgs.push(full);
    return full;
  }

  bySlug(slug: string): MockOrg | undefined {
    return this.orgs.find((o) => o.slug === slug);
  }

  /** Changes an org's slug and keeps the old one as an alias (ADR 0037). */
  rename(from: string, to: string): void {
    const org = this.bySlug(from)!;
    org.aliases.push(from);
    org.slug = to;
  }

  /** Sets an org's light branding, as its Org Lead would save it (L2-149). */
  brand(
    slug: string,
    branding: Pick<MockOrg, 'displayName' | 'logoUrl' | 'accent' | 'accentForeground'>,
  ): void {
    Object.assign(this.bySlug(slug)!, branding);
  }

  /** The org's branding as BrandingDto, with the accent's best ratio. */
  brandingOf(org: MockOrg) {
    return {
      displayName: org.displayName ?? org.name,
      logoUrl: org.logoUrl ?? null,
      accent: org.accent ?? null,
      accentForeground: org.accentForeground ?? null,
      contrastRatio: org.accent ? bestRatio(org.accent) : null,
    };
  }

  /** SaveBrandingHandler: 1 to 80 characters, #rrggbb, and 4.5:1 with white or #111111. */
  saveBranding(
    org: MockOrg,
    displayName: string,
    accent: string | null,
  ): { status: number; json: unknown } {
    const name = displayName.trim();
    const colour = accent?.trim().toLowerCase() || null;
    const errors: Record<string, string[]> = {};
    if (!name || name.length > 80)
      errors['displayName'] = ['Enter a display name of 80 characters or fewer.'];
    if (colour && !/^#[0-9a-f]{6}$/.test(colour)) errors['accent'] = ['Enter a colour as #rrggbb.'];
    else if (colour && bestRatio(colour) < 4.5) {
      errors['accent'] = [
        "This colour doesn't have enough contrast. Choose a darker or lighter shade.",
      ];
      return { status: 400, json: { status: 400, errors, contrastRatio: bestRatio(colour) } };
    }
    if (Object.keys(errors).length) return { status: 400, json: { status: 400, errors } };
    org.displayName = name;
    org.accent = colour;
    org.accentForeground = colour ? foregroundOf(colour) : null;
    return { status: 200, json: this.brandingOf(org) };
  }

  /** The org a public event shows, or undefined when it is archived or has events off. */
  publicOrg(slug: string) {
    const org = this.bySlug(slug);
    if (!org || org.archived || !org.features.includes('events')) return undefined;
    const branding = this.brandingOf(org);
    return {
      slug: org.slug,
      aliases: [...org.aliases],
      displayName: branding.displayName,
      logoUrl: branding.logoUrl,
      accent: branding.accent,
      accentForeground: branding.accentForeground,
    };
  }

  /** Switches a feature off (or on) for every org of the org's type (ADR 0038). */
  setFeature(slug: string, feature: string, on: boolean): void {
    const typeName = this.bySlug(slug)!.typeName;
    for (const org of this.orgs.filter((o) => o.typeName === typeName)) {
      org.features = on
        ? [...new Set([...org.features, feature])]
        : org.features.filter((f) => f !== feature);
    }
  }

  /** The orgs the account is a member of, in order; the first is where its legacy roles apply. */
  memberships(member: OrgMember): string[] {
    return (member.orgs ?? [TORONTO])
      .map((slug) => this.bySlug(slug)?.slug ?? this.resolve(slug))
      .filter((slug): slug is string => !!slug);
  }

  /** What AccessResolver gives the caller: every covered org with its permission set. */
  covered(member: OrgMember | null): CoveredOrg[] {
    if (!member) return [];
    const isSystemAdmin = member.roles.includes('SystemAdmin');
    const memberOf = this.memberships(member);
    const result: CoveredOrg[] = [];
    for (const org of this.orgs) {
      const catalogue = CATALOGUES[org.typeName] ?? [];
      const isMember = memberOf.includes(org.slug);
      const isOrgLead = isMember && (member.orgLead ?? []).includes(org.slug);
      const isPortfolioLead = !!member.portfolioLead;
      const crossOrg = CROSS_ORG.filter(
        (r) =>
          (member.crossOrg ?? []).includes(r.key) ||
          (r.key === 'staff' && member.roles.includes('Staff')),
      ).filter((r) => r.typeName === null || r.typeName === org.typeName);
      if (!isMember && !isSystemAdmin && !isPortfolioLead && crossOrg.length === 0) continue;

      const keys = isMember ? this.catalogueKeys(member, org.slug, memberOf) : [];
      const roles = catalogue.filter((r) => keys.includes(r.key));
      const codes = new Set<string>();
      if (isSystemAdmin || isPortfolioLead || isOrgLead) {
        Object.keys(FEATURE_OF).forEach((code) => codes.add(code));
      } else {
        if (isMember) MEMBER_PERMISSIONS.forEach((code) => codes.add(code));
        roles.forEach((r) => r.permissions.forEach((code) => codes.add(code)));
        crossOrg.forEach((r) => r.permissions.forEach((code) => codes.add(code)));
      }
      for (const code of [...codes]) {
        if (!org.features.includes(FEATURE_OF[code])) codes.delete(code);
      }
      result.push({
        org,
        isMember,
        isOrgLead,
        isPortfolioLead,
        // Only a cross-org role's CanJoinWork; members join work through workspaces.join.
        canJoinWork: crossOrg.some((r) => r.canJoinWork),
        permissions: codes,
        roleNames: [
          ...(isOrgLead ? ['Org Lead'] : []),
          ...roles.map((r) => r.name),
          ...crossOrg.map((r) => r.name),
        ],
      });
    }
    // Members' own orgs first, then the rest by name, as GetMyAccessHandler orders them.
    return result.sort(
      (a, b) =>
        Number(b.isMember) - Number(a.isMember) ||
        (a.isMember && b.isMember
          ? memberOf.indexOf(a.org.slug) - memberOf.indexOf(b.org.slug)
          : a.org.name.localeCompare(b.org.name)),
    );
  }

  /** Whether the caller holds `code` in the org (by slug), or in any org without one. */
  has(member: OrgMember | null, code: string, slug?: string): boolean {
    return this.covered(member).some(
      (c) => (slug === undefined || c.org.slug === slug) && c.permissions.has(code),
    );
  }

  /** The caller's catalogue role keys in an org: legacy roles apply in the first org. */
  catalogueKeys(member: OrgMember, slug: string, memberOf = this.memberships(member)): string[] {
    const legacy =
      slug === memberOf[0] ? member.roles.map((r) => LEGACY_KEYS[r]).filter(Boolean) : [];
    return [...legacy, ...(member.orgRoles?.[slug] ?? [])];
  }

  /** The person's roles as the API lists them on a profile (ProfileRoles). */
  roleRefs(member: OrgMember): MockRoleRef[] {
    const refs: MockRoleRef[] = [];
    if (member.roles.includes('SystemAdmin')) refs.push(tier('system-admin', 'System Admin'));
    if (member.portfolioLead) refs.push(tier('portfolio-lead', 'Portfolio Lead'));
    for (const slug of this.memberships(member)) {
      const org = this.bySlug(slug)!;
      if ((member.orgLead ?? []).includes(slug)) {
        refs.push({
          ...tier('org-lead', 'Org Lead'),
          organizationId: org.id,
          organizationName: org.name,
        });
      }
      for (const key of this.catalogueKeys(member, slug)) {
        const role = (CATALOGUES[org.typeName] ?? []).find((r) => r.key === key);
        if (role) {
          refs.push({
            key,
            name: role.name,
            kind: 'catalogue',
            organizationId: org.id,
            organizationName: org.name,
          });
        }
      }
    }
    for (const role of CROSS_ORG) {
      if (
        (member.crossOrg ?? []).includes(role.key) ||
        (role.key === 'staff' && member.roles.includes('Staff'))
      ) {
        refs.push({
          key: role.key,
          name: role.name,
          kind: 'crossOrg',
          organizationId: null,
          organizationName: null,
        });
      }
    }
    return refs;
  }

  /** Portfolio-wide is the Portfolio Lead's and System Admin's to set (PortfolioWide.MayPublish). */
  mayPublishPortfolioWide(member: OrgMember): boolean {
    return member.roles.includes('SystemAdmin') || !!member.portfolioLead;
  }

  /** The catalogue roles the caller may grant in the org (RoleGrantPolicy). */
  grantable(member: OrgMember, covered: CoveredOrg): MockRoleOption[] {
    const catalogue = CATALOGUES[covered.org.typeName] ?? [];
    const tier =
      member.roles.includes('SystemAdmin') || covered.isPortfolioLead || covered.isOrgLead;
    if (tier) return catalogue.map(option);
    if (!covered.permissions.has('roles.grant')) return [];
    const held = catalogue.filter((r) =>
      this.catalogueKeys(member, covered.org.slug).includes(r.key),
    );
    const may = new Set(held.flatMap((r) => r.canGrant));
    return catalogue.filter((r) => may.has(r.key)).map(option);
  }

  /** The roles an item in the org may be shared with: its catalogue and the cross-org roles covering it. */
  shareRoles(covered: CoveredOrg): MockRoleOption[] {
    return [
      ...(CATALOGUES[covered.org.typeName] ?? []).map(option),
      ...CROSS_ORG.filter((r) => r.typeName === null || r.typeName === covered.org.typeName).map(
        (r) => ({ key: r.key, name: r.name, description: null, isCrossOrg: true }),
      ),
    ];
  }

  /** The current slug for a slug or one of its aliases (GET /api/orgs/resolve/{slug}). */
  resolve(slug: string): string | undefined {
    return this.orgs.find((o) => o.slug === slug || o.aliases.includes(slug))?.slug;
  }

  /** The route's feature from its path, as CurrentAccessMiddleware's prefix table finds it. */
  featureOf(path: string): string | undefined {
    const prefixes: [string, string][] = [
      ['/api/events', 'events'],
      ['/api/partners', 'partners'],
      ['/api/contacts', 'contacts'],
      ['/api/team', 'team'],
      ['/api/announcements', 'announcements'],
      ['/api/invites', 'invites'],
      ['/api/connect/link', 'invites'],
      ['/api/resources', 'resources'],
      ['/api/notes', 'notes'],
      ['/api/workspaces', 'agile'],
      ['/api/items', 'agile'],
      ['/api/poker-sessions', 'agile'],
      ['/api/work', 'agile'],
      ['/api/reports', 'reports'],
      ['/api/people', 'profiles'],
    ];
    return prefixes.find(([prefix]) => path === prefix || path.startsWith(`${prefix}/`))?.[1];
  }

  /**
   * Answers `404` for an `X-Org` naming an org the caller does not cover, that does not exist or
   * whose type has the route's feature off (ADR 0034); undefined lets the request through.
   */
  gate(route: Route, path: string, header: string | undefined, member: OrgMember | null) {
    if (!header || header === 'all' || !member) return undefined;
    const feature = this.featureOf(path);
    if (!feature) return undefined;
    const covered = this.covered(member).find((c) => c.org.slug === header);
    if (!covered || !covered.org.features.includes(feature)) {
      return route.fulfill({ status: 404, json: { status: 404, title: 'Not Found' } });
    }
    return undefined;
  }

  /** GET /api/me/access (MyAccessDto). */
  access(member: OrgMember | null) {
    const covered = this.covered(member);
    return {
      profileId: member?.profileId ?? null,
      isSystemAdmin: !!member?.roles.includes('SystemAdmin'),
      portfolios: covered.length
        ? [{ id: 'portfolio-1', name: PORTFOLIO_NAME, isLead: !!member?.portfolioLead }]
        : [],
      orgs: covered.map((c) => ({
        id: c.org.id,
        slug: c.org.slug,
        name: c.org.name,
        typeName: c.org.typeName,
        isMember: c.isMember,
        isOrgLead: c.isOrgLead,
        isPortfolioLead: c.isPortfolioLead,
        canJoinWork: c.canJoinWork,
        features: [...c.org.features].sort(),
        permissions: [...c.permissions].sort(),
        roles: c.roleNames,
        grantableRoles: member ? this.grantable(member, c) : [],
        shareRoles: this.shareRoles(c),
        branding: {
          displayName: c.org.displayName ?? c.org.name,
          logoUrl: c.org.logoUrl ?? null,
          accent: c.org.accent ?? null,
          accentForeground: c.org.accentForeground ?? null,
        },
      })),
    };
  }
}

function tier(key: string, name: string): MockRoleRef {
  return { key, name, kind: 'tier', organizationId: null, organizationName: null };
}

function option(role: CatalogueRole): MockRoleOption {
  return { key: role.key, name: role.name, description: role.description, isCrossOrg: false };
}

const LEGACY_NAMES: Record<string, string> = {
  CityLead: 'City Lead',
  EventLead: 'Event Lead',
  CreateLead: 'Create Lead',
  CommunicationsLead: 'Communications Lead',
  Volunteer: 'Volunteer',
  ProductEngineer: 'Product Engineer',
  Attendee: 'Attendee',
  Staff: 'Staff',
  SystemAdmin: 'System Admin',
};

/**
 * The fakes keep the old role names on accounts and records; the API speaks role keys
 * (`city-lead`) and shows role names (`City Lead`). These translate at the edge.
 */
export function roleKeyOf(legacy: string): string {
  return (
    LEGACY_KEYS[legacy] ??
    (legacy === 'Staff' ? 'staff' : legacy === 'SystemAdmin' ? 'system-admin' : legacy)
  );
}

/** A role key, or an old role name, as the old name the fakes store. */
export function legacyRoleOf(key: string): string {
  if (LEGACY_NAMES[key]) return key;
  const found = Object.entries(LEGACY_KEYS).find(([, k]) => k === key)?.[0];
  return found ?? (key === 'staff' ? 'Staff' : key === 'system-admin' ? 'SystemAdmin' : key);
}

/** The name to show for an old role name or a role key. */
export function roleNameOf(role: string): string {
  return LEGACY_NAMES[legacyRoleOf(role)] ?? role;
}
