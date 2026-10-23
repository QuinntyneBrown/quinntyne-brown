import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HANDLES_FORBIDDEN, HANDLES_SERVER_ERROR } from '../errors';
import { apiTestProviders } from '../shared/api-test-providers';
import { HttpIntegrationsService } from './http-integrations.service';
import { INTEGRATIONS_SERVICE } from './integrations.service';

// Traces to: L2-158, L2-159, L2-160, L2-165, L2-166
describe('HttpIntegrationsService', () => {
  let service: HttpIntegrationsService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...apiTestProviders(),
        { provide: INTEGRATIONS_SERVICE, useClass: HttpIntegrationsService },
      ],
    });
    service = TestBed.inject(INTEGRATIONS_SERVICE) as HttpIntegrationsService;
    controller = TestBed.inject(HttpTestingController);
  });

  it('lists applications, leaving 403 and failures to the page', () => {
    service.list().subscribe();

    const req = controller.expectOne('/api/integrations/apps');
    expect(req.request.method).toBe('GET');
    expect(req.request.context.get(HANDLES_FORBIDDEN)).toBe(true);
    expect(req.request.context.get(HANDLES_SERVER_ERROR)).toBe(true);
    req.flush([]);
  });

  it('gets one application and a page of its events', () => {
    service.get('app-1').subscribe();
    service.events('app-1', 2).subscribe();

    controller.expectOne('/api/integrations/apps/app-1').flush({});
    controller
      .expectOne('/api/integrations/apps/app-1/events?page=2&pageSize=25')
      .flush({ items: [], page: 2, pageSize: 25, totalCount: 0 });
  });

  it('registers, rotates and revokes, leaving refusals and failures to the dialog', () => {
    service.register('Goodwork').subscribe();
    service.rotate('app-1').subscribe();
    service.revoke('app-1').subscribe();

    const register = controller.expectOne('/api/integrations/apps');
    expect(register.request.method).toBe('POST');
    expect(register.request.body).toEqual({ name: 'Goodwork' });
    expect(register.request.context.get(HANDLES_FORBIDDEN)).toBe(true);
    expect(register.request.context.get(HANDLES_SERVER_ERROR)).toBe(true);
    register.flush({});
    const rotate = controller.expectOne('/api/integrations/apps/app-1/rotate');
    expect(rotate.request.method).toBe('POST');
    rotate.flush({});
    const revoke = controller.expectOne('/api/integrations/apps/app-1/revoke');
    expect(revoke.request.method).toBe('POST');
    revoke.flush({});
  });
});
