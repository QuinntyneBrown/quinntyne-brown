import { Route } from '@playwright/test';

import { CatalogueRole, MockOrganizations, OrgMember } from './mock-organizations';

/** The portfolio the specs run in (HierarchySeed.PortfolioId). */
export const PORTFOLIO_ID = 'portfolio-1';

const SWITCHABLE = [
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
];

const FEATURE_OF_CODE: Record<string, string> = {
  'people.view': 'profiles',
  'roles.grant': 'profiles',
  'notes.create': 'notes',
  'contacts.private': 'contacts',
  'partners.read': 'partners',
  'partners.write': 'partners',
  'team.member': 'team',
  'team.lead': 'team',
  'events.manage': 'events',
  'events.rsvpList': 'events',
  'events.rsvpListEmails': 'events',
  'events.checkIn': 'events',
  'announcements.send': 'announcements',
  'invites.send': 'invites',
  'connectLink.own': 'invites',
  'resources.create': 'resources',
  'workspaces.create': 'agile',
  'workspaces.join': 'agile',
  'workspaces.readAll': 'agile',
  'reports.view': 'reports',
  'integrations.view': 'integrations',
  'integrations.manage': 'integrations',
};

const FEATURES = ['profiles', 'notes', ...SWITCHABLE];

/** A person as the portfolio fake reads them (MockAccount). */
export interface PortfolioMember extends OrgMember {
  name: string;
}

interface MockAgent {
  profileId: string;
  name: string;
}

interface MockToken {
  id: string;
  agentId: string;
  name: string;
  prefix: string;
  token: string;
  orgIds: string[];
  issuedById: string;
  createdAt: string;
  expiresAt: string;
  revokedAt: string | null;
}

const slugOf = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

/**
 * The portfolio administration endpoints (OrganizationsEndpoints): Org Types, features and
 * catalogues, orgs, cross-org roles and agents. Only the Portfolio Lead and System Admin pass;
 * anyone covering an org of the portfolio gets 403, anyone else 404.
 */
export class MockPortfolio {
  readonly agents: MockAgent[] = [];
  readonly tokens: MockToken[] = [];
  /** Types the specs create; the seeded ones come from the orgs' type names. */
  private readonly extraTypes: string[] = [];

  constructor(
    private readonly organizations: () => MockOrganizations,
    private readonly people: () => PortfolioMember[],
    private readonly now: () => Date,
  ) {}

  /** Answers a portfolio request, or returns null for a path that is not one. */
  handle(
    route: Route,
    method: string,
    path: string,
    url: URL,
    body: Record<string, unknown>,
    caller: PortfolioMember | null,
  ): Promise<void> | null {
    const match = (pattern: RegExp) => pattern.exec(path);
    const portfolio = match(
      /^\/api\/portfolios\/([^/]+)\/(org-types|organizations|cross-org-roles)$/,
    );
    const type = match(/^\/api\/org-types\/([^/]+)(\/features|\/roles(?:\/([^/]+))?)?$/);
    const org = match(/^\/api\/organizations\/([^/]+)(\/archive|\/restore)?$/);
    const crossOrg = match(/^\/api\/cross-org-roles\/([^/]+)\/assignments(?:\/([^/]+))?$/);
    const agent = match(/^\/api\/agents(?:\/([^/]+)\/tokens(?:\/([^/]+))?)?$/);
    if (!portfolio && !type && !org && !crossOrg && !agent) return null;
    if (!caller) return route.fulfill({ status: 401 });
    // An Org Lead reads their own org's settings (OrganizationAdminHandler.GetAsync).
    const leadsOrg =
      !!org &&
      !org[2] &&
      method === 'GET' &&
      this.organizations()
        .covered(caller)
        .some((c) => c.org.id === org[1] && c.isOrgLead);
    const refusal = leadsOrg ? null : this.refusal(caller);
    if (refusal && !(agent && this.leadsAny(caller))) return route.fulfill({ status: refusal });

    if (portfolio) return this.portfolio(route, method, portfolio[2], url, body, caller);
    if (type) return this.type(route, method, type[1], type[2], type[3], body);
    if (org) return this.organization(route, method, org[1], org[2], body);
    if (crossOrg) return this.crossOrg(route, method, crossOrg[1], crossOrg[2], body);
    return this.agent(route, method, agent![1], agent![2], body, caller);
  }

  private refusal(caller: PortfolioMember): number | null {
    if (caller.portfolioLead || caller.roles.includes('SystemAdmin')) return null;
    return this.organizations().covered(caller).length ? 403 : 404;
  }

  private leadsAny(caller: PortfolioMember): boolean {
    return this.organizations()
      .covered(caller)
      .some((c) => c.isOrgLead);
  }

  private orgs() {
    return this.organizations().orgs;
  }

  private typeNames(): string[] {
    return [...new Set([...Object.keys(this.organizations().catalogues), ...this.extraTypes])];
  }

  private typeId(name: string): string {
    return `type-${slugOf(name)}`;
  }

  private typeName(id: string): string | undefined {
    return this.typeNames().find((n) => this.typeId(n) === id);
  }

  private features(name: string): string[] {
    const org = this.orgs().find((o) => o.typeName === name);
    return org ? org.features.filter((f) => SWITCHABLE.includes(f)) : [];
  }

  private holders(typeName: string, key: string) {
    const organizations = this.organizations();
    return this.people().flatMap((person) =>
      organizations
        .memberships(person)
        .map((slug) => organizations.bySlug(slug)!)
        .filter(
          (o) =>
            o.typeName === typeName && organizations.catalogueKeys(person, o.slug).includes(key),
        )
        .map((o) => ({
          profileId: person.profileId,
          name: person.name,
          org: { id: o.id, slug: o.slug, name: o.name },
        })),
    );
  }

  private roleDto(typeName: string, role: CatalogueRole, index: number) {
    return {
      id: `role-${role.key}`,
      key: role.key,
      name: role.name,
      description: role.description || null,
      parentRoleId: null,
      sortOrder: index,
      permissions: role.permissions,
      canGrant: role.canGrant.map((k) => `role-${k}`),
      holderCount: this.holders(typeName, role.key).length,
    };
  }

  private typeDto(name: string) {
    const enabled = this.features(name);
    const roles = this.organizations().catalogues[name] ?? [];
    return {
      id: this.typeId(name),
      key: slugOf(name),
      name,
      enabledFeatures: enabled,
      memberPermissions: ['notes.create'],
      roles: roles.map((r, i) => this.roleDto(name, r, i)),
      permissionCatalogue: FEATURES.map((feature) => ({
        feature,
        enabled: feature === 'profiles' || feature === 'notes' || enabled.includes(feature),
        codes: Object.keys(FEATURE_OF_CODE).filter((c) => FEATURE_OF_CODE[c] === feature),
      })),
    };
  }

  private orgSummary(org: ReturnType<MockPortfolio['orgs']>[number]) {
    const organizations = this.organizations();
    const members = this.people().filter((p) => organizations.memberships(p).includes(org.slug));
    return {
      id: org.id,
      slug: org.slug,
      name: org.name,
      displayName: org.displayName ?? org.name,
      orgType: { id: this.typeId(org.typeName), name: org.typeName },
      memberCount: members.length,
      orgLeads: members
        .filter((p) => (p.orgLead ?? []).includes(org.slug))
        .map((p) => ({ profileId: p.profileId, name: p.name })),
      archivedAt: org.archived ? this.now().toISOString() : null,
    };
  }

  private portfolio(
    route: Route,
    method: string,
    section: string,
    url: URL,
    body: Record<string, unknown>,
    caller: PortfolioMember,
  ): Promise<void> {
    if (section === 'org-types' && method === 'GET') {
      return route.fulfill({
        json: this.typeNames().map((name) => {
          const dto = this.typeDto(name);
          return {
            id: dto.id,
            key: dto.key,
            name,
            enabledFeatures: dto.enabledFeatures,
            roleCount: dto.roles.length,
            orgCount: this.orgs().filter((o) => o.typeName === name && !o.archived).length,
          };
        }),
      });
    }
    if (section === 'org-types' && method === 'POST') {
      const name = String(body['name'] ?? '').trim();
      this.extraTypes.push(name);
      this.organizations().catalogues[name] = [];
      return route.fulfill({ status: 201, json: this.typeDto(name) });
    }
    if (section === 'organizations' && method === 'GET') {
      const archived = url.searchParams.get('archived') === 'true';
      return route.fulfill({
        json: this.orgs()
          .filter((o) => !!o.archived === archived)
          .map((o) => this.orgSummary(o)),
      });
    }
    if (section === 'organizations' && method === 'POST') {
      const name = String(body['name'] ?? '').trim();
      const slug = String(body['slug'] ?? '').trim();
      if (!name)
        return route.fulfill({
          status: 400,
          json: { errors: { name: ['Enter a name of 80 characters or fewer.'] } },
        });
      if (
        !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) ||
        slug.length < 3 ||
        slug.length > 40 ||
        slug === 'all'
      ) {
        return route.fulfill({
          status: 400,
          json: {
            errors: {
              slug: ['Use 3 to 40 lower-case letters, numbers and hyphens; “all” is reserved.'],
            },
          },
        });
      }
      if (this.orgs().some((o) => o.slug === slug || o.aliases.includes(slug))) {
        return route.fulfill({
          status: 409,
          json: { detail: 'Another organization uses that address.' },
        });
      }
      const typeName = this.typeName(String(body['orgTypeId'] ?? ''));
      if (!typeName)
        return route.fulfill({
          status: 400,
          json: { errors: { orgTypeId: ['Choose an Org Type.'] } },
        });
      const sibling = this.orgs().find((o) => o.typeName === typeName);
      const created = this.organizations().add({
        slug,
        name,
        typeName,
        ...(sibling ? { features: [...sibling.features] } : {}),
      });
      void caller;
      return route.fulfill({ status: 201, json: { ...this.orgSummary(created), aliases: [] } });
    }
    if (section === 'cross-org-roles' && method === 'GET') {
      return route.fulfill({
        json: this.organizations().crossOrgRoles.map((r) => ({
          id: `xrole-${r.key}`,
          key: r.key,
          name: r.name,
          description: null,
          permissions: r.permissions,
          canJoinWork: r.canJoinWork,
          scopeKind: r.typeName ? 'OrgType' : 'Portfolio',
          scopeOrgTypeId: r.typeName ? this.typeId(r.typeName) : null,
          scopeOrgIds: [],
          holderCount: this.assignees(r.key).length,
        })),
      });
    }
    return route.fulfill({ status: 405 });
  }

  private assignees(key: string): PortfolioMember[] {
    return this.people().filter(
      (p) => (p.crossOrg ?? []).includes(key) || (key === 'staff' && p.roles.includes('Staff')),
    );
  }

  private type(
    route: Route,
    method: string,
    id: string,
    sub: string | undefined,
    roleId: string | undefined,
    body: Record<string, unknown>,
  ): Promise<void> {
    const name = this.typeName(id);
    if (!name) return route.fulfill({ status: 404 });
    const catalogue = this.organizations().catalogues[name];
    if (!sub && method === 'GET') return route.fulfill({ json: this.typeDto(name) });
    if (sub === '/features' && method === 'PUT') {
      const enabled = (body['enabled'] as string[]) ?? [];
      if (enabled.some((f) => !FEATURES.includes(f))) {
        return route.fulfill({
          status: 400,
          json: { errors: { enabled: ['That is not a feature.'] } },
        });
      }
      for (const org of this.orgs().filter((o) => o.typeName === name)) {
        org.features = ['profiles', 'notes', ...SWITCHABLE.filter((f) => enabled.includes(f))];
      }
      return route.fulfill({ json: this.typeDto(name) });
    }
    if (sub === '/roles' && method === 'POST') {
      const key = String(body['key'] ?? '').trim();
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(key)) {
        return route.fulfill({
          status: 400,
          json: {
            errors: { key: ['Use lower-case letters, numbers and hyphens, up to 40 characters.'] },
          },
        });
      }
      if (catalogue.some((r) => r.key === key)) {
        return route.fulfill({
          status: 400,
          json: { errors: { key: ['Another role in this Org Type uses that key.'] } },
        });
      }
      const role: CatalogueRole = {
        key,
        name: String(body['name'] ?? '').trim(),
        description: String(body['description'] ?? ''),
        permissions: (body['permissions'] as string[]) ?? [],
        canGrant: ((body['canGrant'] as string[]) ?? []).map((r) => r.replace(/^role-/, '')),
      };
      catalogue.push(role);
      return route.fulfill({ status: 201, json: this.roleDto(name, role, catalogue.length - 1) });
    }
    const role = catalogue.find((r) => `role-${r.key}` === roleId);
    if (sub?.startsWith('/roles/') && roleId === 'order' && method === 'PUT') {
      const items = (body['items'] as { roleId: string; sortOrder: number }[]) ?? [];
      catalogue.sort(
        (a, b) =>
          (items.find((i) => i.roleId === `role-${a.key}`)?.sortOrder ?? 0) -
          (items.find((i) => i.roleId === `role-${b.key}`)?.sortOrder ?? 0),
      );
      return route.fulfill({ status: 204 });
    }
    if (!role) return route.fulfill({ status: 404 });
    if (method === 'PUT') {
      role.name = String(body['name'] ?? role.name).trim();
      role.description = String(body['description'] ?? '');
      role.permissions = (body['permissions'] as string[]) ?? [];
      role.canGrant = ((body['canGrant'] as string[]) ?? []).map((r) => r.replace(/^role-/, ''));
      return route.fulfill({ json: this.roleDto(name, role, catalogue.indexOf(role)) });
    }
    if (method === 'DELETE') {
      const holders = this.holders(name, role.key);
      if (holders.length) {
        return route.fulfill({
          status: 409,
          json: {
            detail: `${role.name} is held by ${holders.length} ${holders.length === 1 ? 'person' : 'people'}. Remove it from them first.`,
            holders,
          },
        });
      }
      catalogue.splice(catalogue.indexOf(role), 1);
      for (const other of catalogue) other.canGrant = other.canGrant.filter((k) => k !== role.key);
      return route.fulfill({ status: 204 });
    }
    return route.fulfill({ status: 405 });
  }

  private organization(
    route: Route,
    method: string,
    id: string,
    action: string | undefined,
    body: Record<string, unknown>,
  ): Promise<void> {
    const org = this.orgs().find((o) => o.id === id);
    if (!org) return route.fulfill({ status: 404 });
    if (action && method === 'POST') {
      org.archived = action === '/archive';
      return route.fulfill({ status: 204 });
    }
    if (method === 'GET')
      return route.fulfill({ json: { ...this.orgSummary(org), aliases: org.aliases } });
    if (method === 'PUT') {
      const slug = String(body['slug'] ?? org.slug).trim();
      org.name = String(body['name'] ?? org.name).trim();
      if (slug !== org.slug) this.organizations().rename(org.slug, slug);
      return route.fulfill({ json: { ...this.orgSummary(org), aliases: org.aliases } });
    }
    return route.fulfill({ status: 405 });
  }

  private crossOrg(
    route: Route,
    method: string,
    roleId: string,
    assignmentId: string | undefined,
    body: Record<string, unknown>,
  ): Promise<void> {
    const role = this.organizations().crossOrgRoles.find((r) => `xrole-${r.key}` === roleId);
    if (!role) return route.fulfill({ status: 404 });
    const dto = (p: PortfolioMember) => ({
      id: `${role.key}-${p.profileId}`,
      profileId: p.profileId,
      name: p.name,
      narrowedOrgIds: [],
    });
    if (method === 'GET') return route.fulfill({ json: this.assignees(role.key).map(dto) });
    if (method === 'POST') {
      const person = this.people().find((p) => p.profileId === body['profileId']);
      if (!person)
        return route.fulfill({
          status: 400,
          json: { errors: { profileId: ['Choose someone to assign.'] } },
        });
      if (this.assignees(role.key).includes(person)) {
        return route.fulfill({
          status: 409,
          json: { detail: `${person.name} already holds ${role.name}.` },
        });
      }
      person.crossOrg = [...(person.crossOrg ?? []), role.key];
      return route.fulfill({ status: 201, json: dto(person) });
    }
    if (method === 'DELETE') {
      const person = this.assignees(role.key).find(
        (p) => `${role.key}-${p.profileId}` === assignmentId,
      );
      if (!person) return route.fulfill({ status: 404 });
      person.crossOrg = (person.crossOrg ?? []).filter((k) => k !== role.key);
      return route.fulfill({ status: 204 });
    }
    return route.fulfill({ status: 405 });
  }

  private agent(
    route: Route,
    method: string,
    agentId: string | undefined,
    tokenId: string | undefined,
    body: Record<string, unknown>,
    caller: PortfolioMember,
  ): Promise<void> {
    const label = (id: string) => {
      const o = this.orgs().find((x) => x.id === id)!;
      return { id: o.id, slug: o.slug, name: o.displayName ?? o.name };
    };
    const usable = (t: MockToken) => !t.revokedAt && new Date(t.expiresAt) > this.now();
    if (!agentId && method === 'GET') {
      return route.fulfill({
        json: this.agents.map((a) => ({
          profileId: a.profileId,
          name: a.name,
          photoUrl: null,
          orgs: [],
          tokenCount: this.tokens.filter((t) => t.agentId === a.profileId && usable(t)).length,
        })),
      });
    }
    if (!agentId && method === 'POST') {
      const name = String(body['name'] ?? '').trim();
      if (!name)
        return route.fulfill({
          status: 400,
          json: { errors: { name: ['Enter a name of 80 characters or fewer.'] } },
        });
      const created = { profileId: `agent-${this.agents.length + 1}`, name };
      this.agents.push(created);
      return route.fulfill({
        status: 201,
        json: { ...created, photoUrl: null, orgs: [], tokenCount: 0 },
      });
    }
    if (!this.agents.some((a) => a.profileId === agentId)) return route.fulfill({ status: 404 });
    const tokenDto = (t: MockToken) => ({
      id: t.id,
      name: t.name,
      prefix: t.prefix,
      orgs: t.orgIds.map(label),
      issuedBy: { profileId: t.issuedById, name: 'Quinntyne Brown' },
      createdAt: t.createdAt,
      expiresAt: t.expiresAt,
      lastUsedAt: null,
      revokedAt: t.revokedAt,
    });
    if (!tokenId && method === 'GET') {
      return route.fulfill({
        json: this.tokens.filter((t) => t.agentId === agentId).map(tokenDto),
      });
    }
    if (!tokenId && method === 'POST') {
      const days = Number(body['expiresInDays'] ?? 30);
      const orgIds = (body['orgIds'] as string[]) ?? [];
      const errors: Record<string, string[]> = {};
      if (!String(body['name'] ?? '').trim())
        errors['name'] = ['Enter a name of 80 characters or fewer.'];
      if (!(days >= 1 && days <= 90))
        errors['expiresInDays'] = ['Choose an expiry of 1 to 90 days.'];
      if (!orgIds.length) errors['orgIds'] = ['Choose at least one organization.'];
      if (Object.keys(errors).length) return route.fulfill({ status: 400, json: { errors } });
      const n = this.tokens.length + 1;
      const secret = `secret${n}abcdefghijklmnopqrstuvwxyz0123456789`;
      const token: MockToken = {
        id: `token-${n}`,
        agentId: agentId!,
        name: String(body['name']).trim(),
        prefix: secret.slice(0, 8),
        token: `ftca_${secret}`,
        orgIds,
        issuedById: caller.profileId,
        createdAt: this.now().toISOString(),
        expiresAt: new Date(this.now().getTime() + days * 86_400_000).toISOString(),
        revokedAt: null,
      };
      this.tokens.push(token);
      return route.fulfill({
        status: 201,
        json: {
          id: token.id,
          name: token.name,
          prefix: token.prefix,
          orgs: orgIds.map(label),
          expiresAt: token.expiresAt,
          token: token.token,
        },
      });
    }
    const token = this.tokens.find((t) => t.id === tokenId && t.agentId === agentId);
    if (!token) return route.fulfill({ status: 404 });
    if (method === 'DELETE') {
      token.revokedAt = this.now().toISOString();
      return route.fulfill({ status: 204 });
    }
    return route.fulfill({ status: 405 });
  }
}
