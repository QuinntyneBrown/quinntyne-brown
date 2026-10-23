import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '../config';
import { ACCESS_SERVICE, MyAccess, MyOrg } from './access.service';
import { HttpAccessService } from './http-access.service';
import { orgInterceptor } from './org.interceptor';

function org(slug: string, permissions: string[], features: string[]): MyOrg {
  return {
    id: `id-${slug}`,
    slug,
    name: slug,
    typeName: 'FaithTech City',
    isMember: true,
    isOrgLead: false,
    isPortfolioLead: false,
    canJoinWork: true,
    features,
    permissions,
    roles: [],
    grantableRoles: [],
    shareRoles: [],
    branding: { displayName: slug, logoUrl: null, accent: null, accentForeground: null },
  };
}

const access: MyAccess = {
  profileId: 'p1',
  isSystemAdmin: false,
  portfolios: [],
  orgs: [
    org('toronto', ['partners.read', 'events.manage'], ['partners', 'events']),
    org('shelfie', ['workspaces.join'], ['agile']),
  ],
};

describe('HttpAccessService', () => {
  let service: HttpAccessService;
  let controller: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([orgInterceptor])),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: '/api' },
        { provide: ACCESS_SERVICE, useClass: HttpAccessService },
      ],
    });
    service = TestBed.inject(ACCESS_SERVICE) as HttpAccessService;
    controller = TestBed.inject(HttpTestingController);
    const loaded = service.load();
    controller.expectOne('/api/me/access').flush(access);
    await loaded;
  });

  it('loads once and reuses the answer', async () => {
    await service.load();

    controller.verify();
    expect(service.orgs().map((o) => o.slug)).toEqual(['toronto', 'shelfie']);
  });

  it('answers for the active org, a named org, or any org in All orgs', () => {
    service.setActive('toronto');
    expect(service.can('partners.read')).toBe(true);
    expect(service.can('workspaces.join')).toBe(false);
    expect(service.can('workspaces.join', 'shelfie')).toBe(true);
    expect(service.feature('agile')).toBe(false);

    service.setActive('all');
    expect(service.can('workspaces.join')).toBe(true);
    expect(service.feature('events')).toBe(true);
    expect(service.activeOrg()).toBeNull();
  });

  it('knows nothing outside an org page', () => {
    service.setActive(null);

    expect(service.can('partners.read')).toBe(false);
    expect(service.orgsWith('events.manage').map((o) => o.slug)).toEqual(['toronto']);
  });

  it('resolves an old slug to the current one, and an unknown one to null', async () => {
    const found = service.resolve('ft-old');
    controller.expectOne('/api/orgs/resolve/ft-old').flush({ slug: 'toronto' });
    await expect(found).resolves.toBe('toronto');

    const missing = service.resolve('nope');
    controller
      .expectOne('/api/orgs/resolve/nope')
      .flush(null, { status: 404, statusText: 'Not Found' });
    await expect(missing).resolves.toBeNull();
  });

  it('sends the active org with API calls, but not with the caller’s own data', () => {
    const http = TestBed.inject(HttpClient);
    service.setActive('toronto');

    http.get('/api/partners').subscribe();
    http.get('/api/me/access').subscribe();

    expect(controller.expectOne('/api/partners').request.headers.get('X-Org')).toBe('toronto');
    expect(controller.expectOne('/api/me/access').request.headers.has('X-Org')).toBe(false);
  });

  it('reloads the caller’s access after a 403', () => {
    const http = TestBed.inject(HttpClient);

    http.get('/api/partners').subscribe({ error: () => undefined });
    controller.expectOne('/api/partners').flush(null, { status: 403, statusText: 'Forbidden' });

    controller.expectOne('/api/me/access').flush(access);
  });
});
