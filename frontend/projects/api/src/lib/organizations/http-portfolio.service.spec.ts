import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { apiTestProviders } from '../shared/api-test-providers';
import { HttpPortfolioService } from './http-portfolio.service';
import { PORTFOLIO_SERVICE } from './portfolio.service';

describe('HttpPortfolioService', () => {
  let service: HttpPortfolioService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...apiTestProviders(),
        { provide: PORTFOLIO_SERVICE, useClass: HttpPortfolioService },
      ],
    });
    service = TestBed.inject(PORTFOLIO_SERVICE) as HttpPortfolioService;
    controller = TestBed.inject(HttpTestingController);
  });

  it('calls the Org Type, catalogue and feature endpoints', () => {
    service.orgTypes('p1').subscribe();
    service.setFeatures('t1', ['events']).subscribe();
    service.reorderRoles('t1', []).subscribe();
    service.removeRole('t1', 'r1').subscribe();

    expect(controller.expectOne('/api/portfolios/p1/org-types').request.method).toBe('GET');
    expect(controller.expectOne('/api/org-types/t1/features').request.body).toEqual({
      enabled: ['events'],
    });
    expect(controller.expectOne('/api/org-types/t1/roles/order').request.body).toEqual({
      items: [],
    });
    expect(controller.expectOne('/api/org-types/t1/roles/r1').request.method).toBe('DELETE');
  });

  it('calls the organization, cross-org role and agent endpoints', () => {
    service.organizations('p1', true).subscribe();
    service.archiveOrganization('o1', false).subscribe();
    service.assign('c1', 'pr1', []).subscribe();
    service.agents('p1').subscribe();
    service.issueToken('a1', { name: 'CI', expiresInDays: 30, orgIds: ['o1'] }).subscribe();

    expect(controller.expectOne('/api/portfolios/p1/organizations?archived=true')).toBeTruthy();
    expect(controller.expectOne('/api/organizations/o1/restore').request.method).toBe('POST');
    expect(controller.expectOne('/api/cross-org-roles/c1/assignments').request.body).toEqual({
      profileId: 'pr1',
      narrowedOrgIds: [],
    });
    expect(controller.expectOne('/api/agents?portfolioId=p1')).toBeTruthy();
    expect(controller.expectOne('/api/agents/a1/tokens').request.method).toBe('POST');
  });
});
