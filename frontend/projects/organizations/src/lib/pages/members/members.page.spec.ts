// Traces to: L2-143
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ORGANIZATIONS_SERVICE, OrgMemberDto, provideStaticAccess } from '@faithtech-community/api';
import { Observable, of, throwError } from 'rxjs';

import { MembersPage } from './members.page';

const ruth: OrgMemberDto = {
  profileId: 'p2',
  name: 'Ruth Alvarez',
  photoUrl: null,
  kind: 'Person',
  isOrgLead: false,
  roles: [
    {
      key: 'volunteer',
      name: 'Volunteer',
      kind: 'catalogue',
      organizationId: 'org-faithtech-toronto',
      organizationName: 'FaithTech Toronto',
    },
  ],
  joinedAt: '2026-10-18T12:00:00Z',
  joinedVia: 'Invite',
};
const olivia: OrgMemberDto = {
  ...ruth,
  profileId: 'p1',
  name: 'Olivia Grant',
  isOrgLead: true,
  roles: [],
};

async function setup(members: () => Observable<OrgMemberDto[]>) {
  const service = { members: vi.fn(members) };
  TestBed.configureTestingModule({
    providers: [
      { provide: ORGANIZATIONS_SERVICE, useValue: service },
      provideStaticAccess({ isOrgLead: true }),
    ],
  });
  const fixture = TestBed.createComponent(MembersPage);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return { host: fixture.nativeElement as HTMLElement, service };
}

describe('MembersPage', () => {
  it('lists the org’s members with their roles, the Org Lead flag and how they joined', async () => {
    const { host, service } = await setup(() => of([olivia, ruth]));

    expect(service.members).toHaveBeenCalledWith('org-faithtech-toronto', '');
    expect(host.querySelector('caption')!.textContent).toContain('Members of FaithTech Toronto');
    const rows = Array.from(host.querySelectorAll('tbody tr')).map((r) =>
      r.textContent!.replace(/\s+/g, ' '),
    );
    expect(rows[0]).toContain('Org Lead');
    expect(rows[1]).toContain('Volunteer');
    expect(rows[1]).toContain('Invite, Sun 18 Oct');
  });

  it('tells someone the server refuses that only Org Leads manage members', async () => {
    const { host } = await setup(() => throwError(() => new HttpErrorResponse({ status: 403 })));

    expect(host.textContent).toContain('Only Org Leads manage members');
    expect(host.querySelector('table')).toBeNull();
  });
});
