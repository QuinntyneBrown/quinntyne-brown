// Traces to: L2-139, L2-147, L2-157
import { expect, test } from '../../fixtures/app';
import { AppShell } from '../../pages/app-shell.page';
import { ErrorPages } from '../../pages/error-pages.page';
import { WorkspacesPage } from '../../pages/workspaces.page';

test.describe('Shelfie, a Startup org', () => {
  test('an Engineer sees only Shelfie’s features, and Toronto and switched-off pages are not found', async ({
    page,
    api,
    axe,
  }) => {
    const amara = api.addAccount({
      email: 'amara@example.org',
      name: 'Amara Osei',
      orgs: ['shelfie'],
      orgRoles: { shelfie: ['engineer'] },
    });
    api.agile.addWorkspace({ name: 'Shelfie app', ownerId: amara.profileId, orgSlug: 'shelfie' });
    const shell = new AppShell(page);
    await api.signInAs(amara, '/');

    await expect(page).toHaveURL(/\/o\/shelfie$/);
    const labels = await shell.navLabels();
    expect(labels).toEqual(expect.arrayContaining(['Home', 'Workspaces', 'Resources', 'Notes']));
    for (const off of ['Events', 'Contacts', 'Partners', 'Team', 'Announcements', 'Reports']) {
      expect(labels).not.toContain(off);
    }
    await axe.check();

    const workspaces = new WorkspacesPage(page);
    await page.goto('/o/shelfie/workspaces');
    await expect(workspaces.link('Shelfie app')).toBeVisible();

    const errors = new ErrorPages(page);
    await page.goto('/o/shelfie/events');
    await expect(errors.notFound).toBeVisible();
    await page.goto('/o/faithtech-toronto');
    await expect(errors.notFound).toBeVisible();
  });

  test('a Toronto City Lead does not see Shelfie or its workspaces', async ({ page, api }) => {
    const grace = api.addAccount({ email: 'grace@example.org', roles: ['CityLead'] });
    const amara = api.addAccount({
      email: 'amara@example.org',
      orgs: ['shelfie'],
      orgRoles: { shelfie: ['engineer'] },
    });
    api.agile.addWorkspace({ name: 'Shelfie app', ownerId: amara.profileId, orgSlug: 'shelfie' });
    await api.signInAs(grace, '/o/faithtech-toronto/workspaces');

    await expect(new WorkspacesPage(page).link('Shelfie app')).toHaveCount(0);
    await page.goto('/o/shelfie');
    await expect(new ErrorPages(page).notFound).toBeVisible();
  });
});
