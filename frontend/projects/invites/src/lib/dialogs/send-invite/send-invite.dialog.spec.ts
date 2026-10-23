import { DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  INVITES_SERVICE,
  InviteDto,
  RoleOption,
  SendInviteRequest,
  StaticOrg,
  provideStaticAccess,
} from '@faithtech-community/api';
import { Observable, Subject, of, throwError } from 'rxjs';

import { SendInviteDialog } from './send-invite.dialog';

const sent: InviteDto = {
  id: 'i1',
  email: 'nate.oyelaran@example.org',
  preassignedRole: 'product-engineer',
  preassignedRoleName: 'Product Engineer',
  status: 'Pending',
  invitedByName: 'Grace Okonkwo',
  createdAt: '2026-10-21T10:00:00Z',
  expiresAt: '2026-11-04T10:00:00Z',
  acceptedAt: null,
  revokedAt: null,
};

const option = (key: string, name: string): RoleOption => ({
  key,
  name,
  description: null,
  isCrossOrg: false,
});
/** A City Lead's grantable roles in the org, in catalogue order, from /api/me/access. */
const CITY_LEAD: StaticOrg = {
  permissions: ['invites.send', 'roles.grant'],
  grantableRoles: [
    option('event-lead', 'Event Lead'),
    option('create-lead', 'Create Lead'),
    option('communications-lead', 'Communications Lead'),
    option('volunteer', 'Volunteer'),
    option('product-engineer', 'Product Engineer'),
    option('attendee', 'Attendee'),
  ],
};

function setup(
  sendInvite: (r: SendInviteRequest) => Observable<InviteDto>,
  caller: StaticOrg = CITY_LEAD,
) {
  const ref = { close: vi.fn(), disableClose: false };
  const service = { sendInvite: vi.fn(sendInvite) };
  TestBed.configureTestingModule({
    providers: [
      { provide: DialogRef, useValue: ref },
      { provide: INVITES_SERVICE, useValue: service },
      provideStaticAccess(caller),
    ],
  });
  const fixture = TestBed.createComponent(SendInviteDialog);
  fixture.detectChanges();
  const host: HTMLElement = fixture.nativeElement;
  const field = <T extends HTMLElement>(selector: string) => host.querySelector<T>(selector)!;
  const set = (selector: string, value: string, event = 'input') => {
    const el = field<HTMLInputElement>(selector);
    el.value = value;
    el.dispatchEvent(new Event(event));
  };
  const send = async () => {
    Array.from(host.querySelectorAll('button'))
      .find((b) => b.textContent?.trim() === 'Send invite')!
      .click();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  return { fixture, host, ref, service, field, set, send };
}

describe('SendInviteDialog', () => {
  it('makes the fields read-only and the role choice disabled while sending, and restores them', async () => {
    const pending = new Subject<InviteDto>();
    const { fixture, host, set } = setup(() => pending);
    set('input[type=email]', 'nate.oyelaran@example.org');
    Array.from(host.querySelectorAll('button'))
      .find((b) => b.textContent?.trim() === 'Send invite')!
      .click();
    fixture.detectChanges();
    expect(host.querySelector<HTMLInputElement>('input[type=email]')!.readOnly).toBe(true);
    expect(host.querySelector('textarea')!.readOnly).toBe(true);
    expect(host.querySelector('select')!.disabled).toBe(true);
    expect(host.querySelector('button[aria-busy="true"]')!.textContent!.trim()).toBe(
      'Sending invite…',
    );

    pending.error(new Error('offline'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(host.querySelector<HTMLInputElement>('input[type=email]')!.readOnly).toBe(false);
    expect(host.querySelector('textarea')!.readOnly).toBe(false);
    expect(host.querySelector('select')!.disabled).toBe(false);
  });

  it('offers only the roles the sender may grant in the org', () => {
    const { host } = setup(() => of(sent));
    const options = Array.from(host.querySelectorAll('select option')).map((o) =>
      o.textContent!.trim(),
    );
    expect(options).toEqual([
      'No role',
      'Event Lead',
      'Create Lead',
      'Communications Lead',
      'Volunteer',
      'Product Engineer',
      'Attendee',
    ]);
    expect(host.textContent).toContain('The invite link lasts 14 days.');
  });

  it('has no role choice for a lead who may not grant roles', () => {
    const { host } = setup(() => of(sent), { permissions: ['invites.send'] });
    expect(host.querySelector('select')).toBeNull();
  });

  it('checks the email before sending', async () => {
    const { host, service, set, send } = setup(() => of(sent));
    set('input[type="email"]', 'nate@');
    await send();
    expect(host.textContent).toContain('Enter an email like name@example.org.');
    expect(service.sendInvite).not.toHaveBeenCalled();
  });

  it('sends the email, role and note and closes with the invite', async () => {
    const { ref, service, set, send } = setup(() => of(sent));
    set('input[type="email"]', ' nate.oyelaran@example.org ');
    set('select', 'product-engineer', 'change');
    set('textarea', 'Loved your demo at Builders Night!');
    await send();
    expect(service.sendInvite).toHaveBeenCalledWith({
      email: 'nate.oyelaran@example.org',
      preassignedRole: 'product-engineer',
      note: 'Loved your demo at Builders Night!',
    });
    expect(ref.close).toHaveBeenCalledWith(sent);
  });

  it('shows the rate-limit message and stays open', async () => {
    const { host, ref, set, send } = setup(() =>
      throwError(
        () =>
          new HttpErrorResponse({
            status: 429,
            error: { detail: 'You’ve sent 50 invites in the last 24 hours. Try again tomorrow.' },
          }),
      ),
    );
    set('input[type="email"]', 'nate@example.org');
    await send();
    expect(ref.close).not.toHaveBeenCalled();
    expect(host.textContent).toContain('You can’t send this invite');
    expect(host.textContent).toContain('You’ve sent 50 invites in the last 24 hours.');
  });

  it('says it didn’t work when Quinntyne Brown can’t be reached', async () => {
    const { host, set, send } = setup(() => throwError(() => new Error('offline')));
    set('input[type="email"]', 'nate@example.org');
    await send();
    expect(host.querySelector('ft-alert')!.textContent).toContain('Invite not sent');
  });
});
