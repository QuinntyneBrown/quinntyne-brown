// Traces to: L2-165, L2-166, L2-155 (docs/detailed-designs/integrations/application-events)
import { expect, test } from '../../fixtures/app';
import { MockAccount, MockApi } from '../../fixtures/mock-api';
import { AppShell } from '../../pages/app-shell.page';
import { ApplicationPage } from '../../pages/application.page';
import { ApplicationsPage } from '../../pages/applications.page';
import { BREAKPOINTS } from '../../pages/viewport';

const lead = (api: MockApi) =>
  api.addAccount({
    email: 'quinn@example.org',
    name: 'Quinntyne Brown',
    orgLead: ['faithtech-toronto'],
  });

/** Goodwork with Kwame's request, then Ada's, and a newsletter event, as the mocks' cast. */
function seedGoodwork(api: MockApi) {
  const goodwork = api.integrations.add({ name: 'Goodwork' });
  api.integrations.deliver(goodwork, {
    eventType: 'newsletter.subscribed',
    receivedAt: '2026-10-20T20:05:00Z',
    data: { email: 'mira@example.com', list: 'monthly' },
  });
  api.integrations.deliver(goodwork, {
    receivedAt: '2026-10-21T15:20:00Z',
    data: {
      name: 'Kwame Asante',
      email: 'kwame@harbourcoffee.example',
      message: 'Could Harbour Coffee host a Builders Night in December?',
    },
  });
  api.integrations.deliver(goodwork, {
    receivedAt: '2026-10-21T18:58:00Z',
    occurredAt: '2026-10-21T18:57:30Z',
    data: {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'We’d like to talk about volunteering at the next hackathon.',
      organization: 'Analytical Engines Ltd',
      phone: '+1 416 555 0100',
    },
  });
  return goodwork;
}

test.describe('Application events', () => {
  // L2-166 AC1, AC2: the connection details and the events newest first; a contact request expands to its fields,
  // another type shows its JSON.
  test('an Org Lead reads an application’s events, newest first', async ({ page, api, axe }) => {
    const goodwork = seedGoodwork(api);
    const applications = new ApplicationsPage(page);
    const application = new ApplicationPage(page);
    await api.signInAs(lead(api), '/o/faithtech-toronto/applications');

    await applications.application('Goodwork').click();

    await expect(page).toHaveURL(`/o/faithtech-toronto/applications/${goodwork.id}`);
    await expect(application.heading).toHaveText('Goodwork');
    await expect(application.status).toHaveText('Active');
    await expect(application.connection).toContainText(goodwork.sourceId);
    await expect(application.maskedSecret).toContainText(`${goodwork.secret.slice(0, 10)}…`);
    await expect(application.entries).toHaveCount(3);
    await expect(application.entries.nth(0)).toContainText('Ada Lovelace');
    await expect(application.entries.nth(0)).toContainText('ada@example.com');
    await expect(application.entries.nth(1)).toContainText('Kwame Asante');
    await expect(application.entries.nth(2)).toContainText('newsletter.subscribed');
    await expect(application.count).toHaveText('Showing all 3 events');
    await axe.check();

    await application.entry('Ada Lovelace').click();
    await expect(application.entry('Ada Lovelace')).toHaveAttribute('aria-expanded', 'true');
    expect(await application.fields('Ada Lovelace')).toMatchObject({
      Name: 'Ada Lovelace',
      Email: 'ada@example.com',
      Organization: 'Analytical Engines Ltd',
      Phone: '+1 416 555 0100',
      Message: 'We’d like to talk about volunteering at the next hackathon.',
    });
    await expect(page.getByRole('link', { name: 'ada@example.com' })).toHaveAttribute(
      'href',
      'mailto:ada@example.com',
    );
    await application.entry('newsletter.subscribed').click();
    await expect(page.getByRole('main').locator('pre')).toContainText('"list": "monthly"');
    await axe.check();
  });

  // L2-166 AC1: 25 at a time with Load more; focus moves to the first new entry.
  test('events come 25 at a time with Load more', async ({ page, api, axe }) => {
    const busy = api.integrations.add({ name: 'Busy site' });
    for (let i = 0; i < 30; i++) {
      api.integrations.deliver(busy, {
        receivedAt: new Date(Date.UTC(2026, 9, 21, 12, i)).toISOString(),
        data: { name: `Person ${i}`, email: `p${i}@example.com`, message: 'Hello.' },
      });
    }
    const application = new ApplicationPage(page);
    await api.signInAs(lead(api), `/o/faithtech-toronto/applications/${busy.id}`);

    await expect(application.entries).toHaveCount(25);
    await expect(application.entries.first()).toContainText('Person 29');
    await expect(application.count).toHaveText('Showing 25 of 30 events');
    await application.loadMore.click();

    await expect(application.entries).toHaveCount(30);
    await expect(application.entries.last()).toContainText('Person 0');
    await expect(application.loadMore).toHaveCount(0);
    await expect(application.entry('Person 4')).toBeFocused();
    await axe.check();
  });

  // L2-166 AC4: a new application has no events yet.
  test('an application with no events says so', async ({ page, api, axe }) => {
    const quiet = api.integrations.add({ name: 'Goodwork' });
    const application = new ApplicationPage(page);

    await api.signInAs(lead(api), `/o/faithtech-toronto/applications/${quiet.id}`);

    await expect(application.noEvents).toBeVisible();
    await axe.check();
  });

  // L2-166 AC3: an application outside the caller's coverage looks missing.
  test('an application in an org the caller does not cover is not found', async ({
    page,
    api,
    axe,
  }) => {
    api.organizations.add({ slug: 'faithtech-halifax', name: 'FaithTech Halifax' });
    const halifax = api.integrations.add({ name: 'Halifax site', orgSlug: 'faithtech-halifax' });
    const application = new ApplicationPage(page);

    await api.signInAs(lead(api), `/o/faithtech-toronto/applications/${halifax.id}`);

    await expect(application.notFound).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go to Applications' })).toBeVisible();
    await axe.check();
  });

  // L2-166 AC4: a failed load offers Try again.
  test('a failed load offers Try again', async ({ page, api, axe }) => {
    const goodwork = seedGoodwork(api);
    let failures = 1;
    api.on('GET', `/api/integrations/apps/${goodwork.id}/events`, (route) =>
      failures-- > 0 ? route.fulfill({ status: 500 }) : api.fallback(route),
    );
    const application = new ApplicationPage(page);
    await api.signInAs(lead(api), `/o/faithtech-toronto/applications/${goodwork.id}`);

    await expect(application.error).toBeVisible();
    await axe.check();
    await application.tryAgain.click();

    await expect(application.entries).toHaveCount(3);
  });

  // L2-165, L2-155 AC3: Applications is in the navigation for holders of integrations.view only,
  // a secondary section reached through More on a tablet.
  const menus: [string, Partial<MockAccount>, boolean][] = [
    ['the Org Lead', { orgLead: ['faithtech-toronto'] }, true],
    ['Staff', { roles: ['Staff'] }, true],
    ['a Volunteer', { roles: ['Volunteer'] }, false],
  ];
  for (const [who, account, shown] of menus) {
    test(`Applications is ${shown ? '' : 'not '}in the menu for ${who}`, async ({ page, api }) => {
      const shell = new AppShell(page);
      await page.setViewportSize(BREAKPOINTS.md);
      await api.signInAs(api.addAccount({ email: 'someone@example.org', ...account }));

      await shell.moreLink.click();

      await expect(shell.drawerLink('Applications')).toHaveCount(shown ? 1 : 0);
      if (shown) {
        await shell.drawerLink('Applications').click();
        await expect(page).toHaveURL('/o/faithtech-toronto/applications');
      }
    });
  }
});
