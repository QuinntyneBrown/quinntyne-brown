// Traces to: L2-145, L2-146
import { test, expect } from '../../fixtures/app';
import { MockApi } from '../../fixtures/mock-api';
import { AppShell } from '../../pages/app-shell.page';
import { MyWorkPage } from '../../pages/my-work.page';
import { WorkspacesPage } from '../../pages/workspaces.page';

/** Pat works in FaithTech Toronto and Shelfie, with a workspace and an assigned story in each. */
function patInTwoOrgs(api: MockApi) {
  const pat = api.addAccount({
    email: 'pat@example.org',
    name: 'Pat Morgan',
    roles: ['Volunteer'],
    orgs: ['faithtech-toronto', 'shelfie'],
    orgRoles: { shelfie: ['engineer'] },
  });
  const grace = api.addAccount({
    email: 'grace@example.org',
    name: 'Grace Okonkwo',
    roles: ['CityLead'],
  });
  const amara = api.addAccount({
    email: 'amara@example.org',
    name: 'Amara Osei',
    orgs: ['shelfie'],
    orgRoles: { shelfie: ['engineer'] },
  });
  const toronto = api.agile.addWorkspace({
    name: 'Toronto team',
    ownerId: grace.profileId,
    memberIds: [pat.profileId],
  });
  const shelfie = api.agile.addWorkspace({
    name: 'Shelfie app',
    ownerId: amara.profileId,
    memberIds: [pat.profileId],
    orgSlug: 'shelfie',
  });
  api.agile.addItem({
    workspaceId: toronto.id,
    kind: 'Story',
    title: 'Book the venue',
    status: 'InProgress',
    assigneeId: pat.profileId,
  });
  api.agile.addItem({
    workspaceId: shelfie.id,
    kind: 'Story',
    title: 'Barcode scan for shelf check-in',
    assigneeId: pat.profileId,
  });
  api.agile.addItem({
    workspaceId: shelfie.id,
    kind: 'Story',
    title: 'Someone else’s story',
    assigneeId: amara.profileId,
  });
  return { pat };
}

test.describe('All orgs', () => {
  test('workspaces of every covered org are listed together, each with its org, and nothing is created there', async ({
    page,
    api,
    axe,
  }) => {
    const { pat } = patInTwoOrgs(api);
    await api.signInAs(pat, '/o/all/workspaces');

    const workspaces = new WorkspacesPage(page);
    await expect(workspaces.orgLabel('Toronto team')).toHaveText('FaithTech Toronto');
    await expect(workspaces.orgLabel('Shelfie app')).toHaveText('Shelfie');
    await expect(workspaces.newWorkspace).toHaveCount(0);
    await expect(new AppShell(page).primaryNav.getByRole('link', { name: 'Events' })).toHaveCount(
      0,
    );
    await axe.check();

    await page.goto('/o/shelfie/workspaces');
    await expect(workspaces.link('Shelfie app')).toBeVisible();
    await expect(workspaces.link('Toronto team')).toHaveCount(0);
    await expect(workspaces.orgLabel('Shelfie app')).toHaveCount(0);
  });

  test('My work lists what is assigned to the person in every org, labelled by org', async ({
    page,
    api,
    axe,
  }) => {
    const { pat } = patInTwoOrgs(api);
    await api.signInAs(pat, '/o/all');

    await new AppShell(page).primaryNav.getByRole('link', { name: 'My work' }).click();

    const work = new MyWorkPage(page);
    await expect(page).toHaveURL('/o/all/my-work');
    await expect(work.heading).toHaveText('My work');
    await expect(work.rows).toHaveCount(2);
    expect(await work.cells('Book the venue')).toEqual([
      'Book the venue',
      'Toronto team',
      'FaithTech Toronto',
      'In Progress',
    ]);
    expect(await work.cells('Barcode scan for shelf check-in')).toEqual([
      'Barcode scan for shelf check-in',
      'Shelfie app',
      'Shelfie',
      'To Do',
    ]);
    await axe.check();
  });

  test('someone who covers one org is sent from All orgs to their org', async ({ page, api }) => {
    const grace = api.addAccount({ email: 'grace@example.org', roles: ['CityLead'] });
    await api.signInAs(grace, '/o/faithtech-toronto');

    await page.goto('/o/all/workspaces');

    await expect(page).toHaveURL('/o/faithtech-toronto/workspaces');
    await expect(new AppShell(page).primaryNav.getByRole('link', { name: 'My work' })).toHaveCount(
      0,
    );
  });
});
