// Traces to: L2-053, L2-009
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  PEOPLE_SERVICE,
  PagedResult,
  PersonSummary,
  ROLES_SERVICE,
  RoleOption,
  RoleRef,
  StaticOrg,
  provideStaticAccess,
} from '@faithtech-community/api';
import { DialogService, RoleDialogData } from '@faithtech-community/components';
import { Observable, of, throwError } from 'rxjs';

import { PeoplePage } from './people.page';

const ORG = 'org-faithtech-toronto';
const role = (key: string, name: string): RoleRef => ({
  key,
  name,
  kind: 'catalogue',
  organizationId: ORG,
  organizationName: 'FaithTech Toronto',
});
const option = (key: string, name: string): RoleOption => ({
  key,
  name,
  description: null,
  isCrossOrg: false,
});
/** What a City Lead may grant in the org, as /api/me/access says (RoleGrantPolicy). */
const CITY_LEAD: StaticOrg = {
  permissions: ['roles.grant', 'people.view', 'invites.send'],
  grantableRoles: [
    option('event-lead', 'Event Lead'),
    option('create-lead', 'Create Lead'),
    option('communications-lead', 'Communications Lead'),
    option('volunteer', 'Volunteer'),
    option('product-engineer', 'Product Engineer'),
    option('attendee', 'Attendee'),
  ],
};
const STAFF: StaticOrg = { permissions: ['people.view', 'reports.view'] };

function person(overrides: Partial<PersonSummary>): PersonSummary {
  return {
    id: 'p1',
    name: 'Grace Okonkwo',
    homeCity: 'Toronto',
    photoUrl: null,
    roles: [role('city-lead', 'City Lead')],
    ...overrides,
  };
}

const grace = person({});
const marcus = person({
  id: 'p2',
  name: 'Marcus Lee',
  roles: [role('event-lead', 'Event Lead')],
  photoUrl: 'https://photos.example/marcus.jpg',
});
const leah = person({ id: 'p3', name: 'Leah Thompson', roles: [] });

function page(items: PersonSummary[], totalCount = items.length): PagedResult<PersonSummary> {
  return { items, page: 1, pageSize: 25, totalCount };
}

async function setup(
  search: (term: string, page?: number) => Observable<PagedResult<PersonSummary>>,
  caller: StaticOrg = CITY_LEAD,
  isSystemAdmin = false,
) {
  const service = { search: vi.fn(search) };
  const roles = {
    addRole: vi.fn((_id: string, key: string) =>
      of<RoleRef[]>([role('event-lead', 'Event Lead'), role(key, 'Volunteer')]),
    ),
    removeRole: vi.fn(() => of<RoleRef[]>([])),
  };
  let opened: RoleDialogData | null = null;
  const dialogs = {
    open: vi.fn((_c: unknown, config: { data: RoleDialogData }) => {
      opened = config.data;
      return { closed: of(undefined) };
    }),
  };
  TestBed.configureTestingModule({
    providers: [
      { provide: PEOPLE_SERVICE, useValue: service },
      { provide: ROLES_SERVICE, useValue: roles },
      provideStaticAccess(caller, { isSystemAdmin }),
      { provide: DialogService, useValue: dialogs },
    ],
  });
  const fixture = TestBed.createComponent(PeoplePage);
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  await settle();
  const host = fixture.nativeElement as HTMLElement;
  const rows = () => Array.from(host.querySelectorAll('tbody tr'));
  const row = (name: string) => rows().find((r) => r.textContent?.includes(name))!;
  const button = (scope: Element, name: string) =>
    Array.from(scope.querySelectorAll('button, a')).find(
      (b) => b.textContent?.replace(/\s+/g, ' ').trim() === name,
    ) as HTMLElement | undefined;
  const searchFor = async (term: string) => {
    const input = host.querySelector('input[type="search"]') as HTMLInputElement;
    input.value = term;
    input.dispatchEvent(new Event('input'));
    host.querySelector('form')!.dispatchEvent(new Event('submit'));
    await settle();
  };
  return {
    fixture,
    host,
    service,
    roles,
    dialogs,
    rows,
    row,
    button,
    searchFor,
    settle,
    opened: () => opened!,
  };
}

describe('PeoplePage', () => {
  it('lists members with a profile link, photo, role badges and city', async () => {
    const { host, row, service } = await setup(() => of(page([grace, marcus, leah])));

    expect(service.search).toHaveBeenCalledWith('', 1);
    expect(host.querySelector('h1')!.textContent).toContain('People and roles');
    expect(host.querySelector('caption')!.textContent).toContain('Members and their roles');
    const link = row('Marcus Lee').querySelector('a')!;
    expect(link.getAttribute('href')).toBe('/people/p2');
    expect(row('Marcus Lee').querySelector('img')!.getAttribute('src')).toBe(
      'https://photos.example/marcus.jpg',
    );
    expect(row('Marcus Lee').textContent).toContain('Event Lead');
    expect(row('Marcus Lee').textContent).toContain('Toronto');
    expect(row('Leah Thompson').textContent).toContain('No role yet');
  });

  it('gives a City Lead the actions their grantable roles allow on each row', async () => {
    const { host, row, button } = await setup(() => of(page([grace, marcus, leah])));

    expect(host.textContent).toContain(
      'You can add or remove the Event Lead, Create Lead, Communications Lead, Volunteer, Product Engineer and Attendee roles.',
    );
    expect(button(host, 'Invite someone')!.getAttribute('href')).toBe('/invites');
    expect(button(row('Marcus Lee'), 'Add role to Marcus Lee')).toBeDefined();
    expect(button(row('Marcus Lee'), 'Remove a role from Marcus Lee')).toBeDefined();
    expect(row('Marcus Lee').textContent).not.toContain('Only an Org Lead or above can change');
    expect(button(row('Grace Okonkwo'), 'Add role to Grace Okonkwo')).toBeDefined();
    expect(button(row('Grace Okonkwo'), 'Remove a role from Grace Okonkwo')).toBeUndefined();
    expect(row('Grace Okonkwo').textContent).toContain('Only an Org Lead or above can change');
    expect(button(row('Leah Thompson'), 'Remove a role from Leah Thompson')).toBeUndefined();
  });

  it('lets a System Admin change every role', async () => {
    const admin: StaticOrg = {
      ...CITY_LEAD,
      grantableRoles: [option('city-lead', 'City Lead'), ...CITY_LEAD.grantableRoles!],
    };
    const { host, row, button } = await setup(() => of(page([grace])), admin, true);

    expect(host.textContent).toContain('As System Admin you can assign any role');
    expect(button(row('Grace Okonkwo'), 'Remove a role from Grace Okonkwo')).toBeDefined();
    expect(row('Grace Okonkwo').textContent).not.toContain('Only an Org Lead or above can change');
  });

  it('shows Staff the list read-only', async () => {
    const { host, row, button } = await setup(() => of(page([grace, marcus])), STAFF);

    expect(host.textContent).toContain('Read-only for Staff.');
    expect(button(host, 'Invite someone')).toBeUndefined();
    expect(row('Marcus Lee').querySelectorAll('button')).toHaveLength(0);
    expect(row('Grace Okonkwo').textContent).not.toContain('Only an Org Lead or above can change');
  });

  it('adds a role from a row and updates its badges without a reload', async () => {
    const { row, button, roles, opened, settle, service } = await setup(() => of(page([marcus])));

    button(row('Marcus Lee'), 'Add role to Marcus Lee')!.click();
    const data = opened();
    expect(data.mode).toBe('add');
    expect(data.name).toBe('Marcus Lee');
    expect(data.options.map((o) => o.value)).not.toContain('city-lead');
    expect(data.options.map((o) => o.value)).not.toContain('event-lead');
    expect(await data.submit('volunteer')).toBeNull();
    await settle();

    expect(roles.addRole).toHaveBeenCalledWith('p2', 'volunteer', ORG);
    expect(row('Marcus Lee').textContent).toContain('Volunteer');
    expect(service.search).toHaveBeenCalledTimes(1);
  });

  it('removes a role from a row', async () => {
    const { row, button, roles, opened, settle } = await setup(() => of(page([marcus])));

    button(row('Marcus Lee'), 'Remove a role from Marcus Lee')!.click();
    expect(opened().mode).toBe('remove');
    expect(opened().options.map((o) => o.value)).toEqual(['event-lead']);
    await opened().submit('event-lead');
    await settle();

    expect(roles.removeRole).toHaveBeenCalledWith('p2', 'event-lead', ORG);
    expect(row('Marcus Lee').textContent).toContain('No role yet');
  });

  it('searches by the submitted term and offers an invite when no one matches', async () => {
    const { host, service, searchFor, button } = await setup((term) =>
      of(page(term ? [] : [grace])),
    );

    await searchFor(' xavier ');

    expect(service.search).toHaveBeenLastCalledWith('xavier', 1);
    expect(host.textContent).toContain('No one matches “xavier”');
    expect(host.textContent).toContain('They may not have joined yet.');
    expect(
      button(host.querySelector('ft-empty-state')!, 'Invite someone')!.getAttribute('href'),
    ).toBe('/invites');
  });

  it('shows more people a page at a time', async () => {
    const more = Array.from({ length: 25 }, (_, i) => person({ id: `m${i}`, name: `Member ${i}` }));
    const { host, service, button, rows, settle } = await setup((_t, p) =>
      of(p === 2 ? { ...page([leah], 26), page: 2 } : page(more, 26)),
    );

    expect(rows()).toHaveLength(25);
    button(host, 'Show more people')!.click();
    await settle();

    expect(service.search).toHaveBeenLastCalledWith('', 2);
    expect(rows()).toHaveLength(26);
    expect(button(host, 'Show more people')).toBeUndefined();
  });

  it('shows an error with a retry that loads again', async () => {
    let fail = true;
    const { host, button, settle, rows } = await setup(() =>
      fail ? throwError(() => new HttpErrorResponse({ status: 0 })) : of(page([grace])),
    );

    expect(host.textContent).toContain('We couldn’t load people');
    fail = false;
    button(host, 'Try again')!.click();
    await settle();

    expect(rows()).toHaveLength(1);
  });

  it('shows the forbidden page when the server refuses', async () => {
    const { host, button } = await setup(
      () => throwError(() => new HttpErrorResponse({ status: 403 })),
      { permissions: ['workspaces.join'] },
    );

    expect(host.querySelector('h1')!.textContent).toContain('People and roles');
    expect(host.textContent).toContain('Only City Leads manage roles');
    expect(host.textContent).toContain(
      'Ask your City Lead if someone needs a role added or removed.',
    );
    expect(button(host, 'Back to home')!.getAttribute('href')).toBe('/');
    expect(host.querySelector('input[type="search"]')).toBeNull();
  });
});
