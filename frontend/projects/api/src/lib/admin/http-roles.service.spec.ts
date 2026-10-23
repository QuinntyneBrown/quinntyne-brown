import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RoleRef } from '../shared';
import { apiTestProviders } from '../shared/api-test-providers';
import { HttpRolesService } from './http-roles.service';
import { ROLES_SERVICE } from './roles.service';

describe('HttpRolesService', () => {
  let service: HttpRolesService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...apiTestProviders(), { provide: ROLES_SERVICE, useClass: HttpRolesService }],
    });
    service = TestBed.inject(ROLES_SERVICE) as HttpRolesService;
    controller = TestBed.inject(HttpTestingController);
  });

  const volunteer: RoleRef = {
    key: 'volunteer',
    name: 'Volunteer',
    kind: 'catalogue',
    organizationId: 'o1',
    organizationName: 'FaithTech Toronto',
  };

  it('adds a role by key and returns the updated roles', () => {
    let roles: RoleRef[] = [];
    service.addRole('p1', 'volunteer').subscribe((r) => (roles = r));

    const req = controller.expectOne('/api/profiles/p1/roles');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ role: 'volunteer' });
    req.flush([volunteer]);
    expect(roles).toEqual([volunteer]);
  });

  it('names the org when one is given', () => {
    service.addRole('p1', 'volunteer', 'o1').subscribe();

    expect(controller.expectOne('/api/profiles/p1/roles').request.body).toEqual({
      role: 'volunteer',
      organizationId: 'o1',
    });
  });

  it('removes a role in an org', () => {
    service.removeRole('p1', 'volunteer', 'o1').subscribe();

    const req = controller.expectOne('/api/profiles/p1/roles/volunteer?organizationId=o1');
    expect(req.request.method).toBe('DELETE');
    req.flush([]);
  });
});
