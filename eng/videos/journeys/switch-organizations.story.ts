import { expect, test } from '../../../e2e/fixtures/app';
import { AppShell } from '../../../e2e/pages/app-shell.page';
import { OrgSwitcher } from '../../../e2e/pages/org-switcher.page';
import { Presenter } from '../presenter';

// Journey: switching between the organizations you cover (docs/detailed-designs/organizations, L2-145, L2-147).
test('switch-organizations', async ({ page, api }) => {
  const show = await Presenter.start(page, 'switch-organizations');
  const switcher = new OrgSwitcher(page);
  const nav = new AppShell(page).primaryNav;
  const pat = api.addAccount({
    email: 'pat@example.org',
    name: 'Pat Morgan',
    roles: ['CityLead'],
    orgs: ['faithtech-toronto', 'shelfie'],
    orgRoles: { shelfie: ['engineer'] },
  });

  await show.card(
    'opening',
    'opening',
    ['Switch organizations', 'Recorded against a local fake API · synthetic people'],
    () => api.signInAs(pat, '/o/faithtech-toronto/events'),
  );

  await show.step(
    'current',
    async () => {
      await expect(switcher.button).toHaveAccessibleName('FaithTech Toronto, switch organization');
      await expect(nav.getByRole('link', { name: 'Events' })).toBeVisible();
    },
    { poster: true },
  );

  await show.step('menu', async () => {
    await switcher.open();
    await expect(switcher.option('FaithTech Toronto')).toHaveAttribute('aria-checked', 'true');
    await expect(switcher.option('Shelfie')).toContainText('Startup');
    await expect(switcher.option('All orgs')).toBeVisible();
  });

  await show.step('switch', async () => {
    await switcher.option('Shelfie').click();
    await expect(page).toHaveURL('/o/shelfie');
    await expect(switcher.button).toHaveAccessibleName('Shelfie, switch organization');
    await expect(nav.getByRole('link', { name: 'Events' })).toHaveCount(0);
    await expect(nav.getByRole('link', { name: 'Workspaces' })).toBeVisible();
  });

  await show.step('all-orgs', async () => {
    await switcher.switchTo('All orgs');
    await expect(page).toHaveURL(/\/o\/all/);
    await expect(nav.getByRole('link', { name: 'My work' })).toBeVisible();
  });

  await show.card('closing', 'closing', [
    'One menu for every organization you cover',
    'Navigation follows each organization’s features',
    'All orgs brings the work together',
  ]);
  await show.finish();
});
