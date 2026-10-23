// Traces to: L2-144, L2-145, L2-147, L2-155
import { test, expect } from '../../fixtures/app';
import { AppShell } from '../../pages/app-shell.page';
import { OrgSwitcher } from '../../pages/org-switcher.page';

test.describe('The org in the URL and the switcher', () => {
  test('a member of one org lands under its slug and sees no switcher', async ({
    page,
    api,
    axe,
  }) => {
    const grace = api.addAccount({ email: 'grace@example.org', roles: ['CityLead'] });

    await api.signInAs(grace, '/o/faithtech-toronto');

    const switcher = new OrgSwitcher(page);
    await expect(switcher.button).toHaveCount(0);
    await expect(switcher.currentOrg).toHaveText(/FaithTech Toronto/);
    await expect(
      new AppShell(page).primaryNav.getByRole('link', { name: 'Partners' }),
    ).toHaveAttribute('href', '/o/faithtech-toronto/partners');
    await axe.check();
  });

  test('an old address redirects to the same page under the active org', async ({ page, api }) => {
    const grace = api.addAccount({ email: 'grace@example.org', roles: ['CityLead'] });
    await api.signInAs(grace, '/o/faithtech-toronto');

    await page.goto('/partners');

    await expect(page).toHaveURL('/o/faithtech-toronto/partners');
  });

  test('someone who covers several orgs switches between them and the navigation follows each org’s features', async ({
    page,
    api,
    axe,
  }) => {
    const pat = api.addAccount({
      email: 'pat@example.org',
      roles: ['CityLead'],
      orgs: ['faithtech-toronto', 'shelfie'],
      orgRoles: { shelfie: ['engineer'] },
    });
    await api.signInAs(pat, '/o/faithtech-toronto/events');
    const switcher = new OrgSwitcher(page);
    const nav = new AppShell(page).primaryNav;
    await expect(switcher.button).toHaveAccessibleName('FaithTech Toronto, switch organization');
    await expect(nav.getByRole('link', { name: 'Events' })).toBeVisible();

    await switcher.open();
    await expect(switcher.option('FaithTech Toronto')).toHaveAttribute('aria-checked', 'true');
    await expect(switcher.option('Shelfie')).toContainText('Startup');
    await expect(switcher.option('All orgs')).toBeVisible();
    await axe.check();
    await switcher.option('Shelfie').click();

    // Shelfie (Startup) has no events, so the switch opens its home and Events leaves the menu (L2-147 AC1).
    await expect(page).toHaveURL('/o/shelfie');
    await expect(switcher.button).toHaveAccessibleName('Shelfie, switch organization');
    await expect(nav.getByRole('link', { name: 'Events' })).toHaveCount(0);
    await expect(nav.getByRole('link', { name: 'Workspaces' })).toBeVisible();
  });

  test('an org the person does not cover shows the not-found page', async ({ page, api }) => {
    const grace = api.addAccount({ email: 'grace@example.org', roles: ['CityLead'] });
    await api.signInAs(grace, '/o/faithtech-toronto');

    await page.goto('/o/shelfie/events');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      /not found|can’t find|doesn’t exist/i,
    );
  });

  test('an old slug redirects to the org’s new one', async ({ page, api }) => {
    api.organizations.rename('faithtech-toronto', 'ft-toronto');
    const grace = api.addAccount({
      email: 'grace@example.org',
      roles: ['CityLead'],
      orgs: ['ft-toronto'],
    });
    await api.signInAs(grace, '/o/ft-toronto');

    await page.goto('/o/faithtech-toronto/partners');

    await expect(page).toHaveURL('/o/ft-toronto/partners');
  });

  test('sections show only for people whose permissions open them', async ({ page, api }) => {
    const ruth = api.addAccount({ email: 'ruth@example.org', roles: ['Volunteer'] });
    await api.signInAs(ruth, '/o/faithtech-toronto');

    const nav = new AppShell(page).primaryNav;
    await expect(nav.getByRole('link', { name: 'Workspaces' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Partners' })).toHaveCount(0);
    await expect(nav.getByRole('link', { name: 'Reports' })).toHaveCount(0);
  });
});
