// Traces to: L2-146 AC2
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TestBed } from '@angular/core/testing';
import { AGILE_SERVICE } from '@faithtech-community/api';
import { of } from 'rxjs';

import { AddWorkspaceMembersDialog } from './add-workspace-members.dialog';

describe('AddWorkspaceMembersDialog cross-org candidates', () => {
  it('marks people who are offered through a cross-org role', async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: { close: vi.fn() } },
        { provide: DIALOG_DATA, useValue: { id: 'w1', name: 'Shelfie app' } },
        {
          provide: AGILE_SERVICE,
          useValue: {
            listMemberCandidates: () =>
              of([
                { profileId: 'p1', name: 'Isaac Mwangi', roles: ['Portfolio'], isCrossOrg: true },
                { profileId: 'p2', name: 'Amara Osei', roles: ['Engineer'] },
              ]),
          },
        },
      ],
    });
    const fixture = TestBed.createComponent(AddWorkspaceMembersDialog);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Portfolio, Cross-org');
    expect(text).not.toContain('Engineer, Cross-org');
  });
});
