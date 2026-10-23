import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { apiTestProviders } from '../shared/api-test-providers';
import { HttpOrganizationsService } from './http-organizations.service';
import { ORGANIZATIONS_SERVICE } from './organizations.service';

describe('HttpOrganizationsService', () => {
  let service: HttpOrganizationsService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...apiTestProviders(),
        { provide: ORGANIZATIONS_SERVICE, useClass: HttpOrganizationsService },
      ],
    });
    service = TestBed.inject(ORGANIZATIONS_SERVICE) as HttpOrganizationsService;
    controller = TestBed.inject(HttpTestingController);
  });

  it('lists, adds and removes members of an org', () => {
    service.members('o1', 'ruth').subscribe();
    service.addMember('o1', 'sami@example.org').subscribe();
    service.removeMember('o1', 'p2').subscribe();
    service.setOrgLead('o1', 'p3', true).subscribe();

    expect(controller.expectOne('/api/organizations/o1/members?q=ruth').request.method).toBe('GET');
    const add = controller.expectOne((r) => r.method === 'POST');
    expect([add.request.url, add.request.body]).toEqual([
      '/api/organizations/o1/members',
      { email: 'sami@example.org' },
    ]);
    expect(controller.expectOne('/api/organizations/o1/members/p2').request.method).toBe('DELETE');
    expect(controller.expectOne('/api/organizations/o1/members/p3/org-lead').request.method).toBe(
      'PUT',
    );
  });

  it('saves branding, uploads the logo as multipart and removes it', () => {
    service.saveBranding('o1', { displayName: 'Toronto', accent: '#0b6e4f' }).subscribe();
    service.uploadLogo('o1', new File(['x'], 'logo.png', { type: 'image/png' })).subscribe();
    service.removeLogo('o1').subscribe();

    const save = controller.expectOne(
      (r) => r.method === 'PUT' && r.url === '/api/organizations/o1/branding',
    );
    expect(save.request.body).toEqual({ displayName: 'Toronto', accent: '#0b6e4f' });
    const logo = controller.expectOne(
      (r) => r.method === 'PUT' && r.url === '/api/organizations/o1/branding/logo',
    );
    expect((logo.request.body as FormData).get('file')).toBeInstanceOf(File);
    expect(
      controller.expectOne((r) => r.method === 'DELETE' && r.url.endsWith('/branding/logo')),
    ).toBeTruthy();
  });
});
