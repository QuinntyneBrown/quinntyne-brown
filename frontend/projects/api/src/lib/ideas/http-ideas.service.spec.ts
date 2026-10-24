import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HANDLES_SERVER_ERROR } from '../errors';
import { apiTestProviders } from '../shared/api-test-providers';
import { HttpIdeasService } from './http-ideas.service';
import { IDEAS_SERVICE } from './ideas.service';

// Traces to: L2-171, L2-176, L2-177, L2-181
describe('HttpIdeasService', () => {
  let service: HttpIdeasService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...apiTestProviders(), { provide: IDEAS_SERVICE, useClass: HttpIdeasService }],
    });
    service = TestBed.inject(IDEAS_SERVICE) as HttpIdeasService;
    controller = TestBed.inject(HttpTestingController);
  });

  it('submits an idea, leaving refusals and failures to the page', () => {
    service
      .submit({ problem: 'p', audience: 'families', title: 't', pitch: 'p', solution: 's' })
      .subscribe();

    const req = controller.expectOne('/api/ideas');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      problem: 'p',
      audience: 'families',
      title: 't',
      pitch: 'p',
      solution: 's',
    });
    expect(req.request.context.get(HANDLES_SERVER_ERROR)).toBe(true);
    req.flush({ id: 'idea-1', title: 't', name: 'n', email: 'e' });
  });

  it('reads the switches for the wizard', () => {
    service.form().subscribe();

    const req = controller.expectOne('/api/ideas/form');
    expect(req.request.method).toBe('GET');
    req.flush({ askStage: true, askPeople: true });
  });

  it('reads and saves the Idea form, leaving failures to the page', () => {
    service.settings().subscribe();
    service.saveSettings({ askStage: true, askPeople: false }).subscribe();

    const read = controller.expectOne(
      (r) => r.method === 'GET' && r.url === '/api/admin/ideas/settings',
    );
    expect(read.request.context.get(HANDLES_SERVER_ERROR)).toBe(true);
    read.flush({});
    const save = controller.expectOne(
      (r) => r.method === 'PUT' && r.url === '/api/admin/ideas/settings',
    );
    expect(save.request.body).toEqual({ askStage: true, askPeople: false });
    expect(save.request.context.get(HANDLES_SERVER_ERROR)).toBe(true);
    save.flush({});
  });
});
