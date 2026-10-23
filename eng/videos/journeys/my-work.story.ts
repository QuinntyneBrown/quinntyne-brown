import { expect, test } from '../../../e2e/fixtures/app';
import { AppShell } from '../../../e2e/pages/app-shell.page';
import { MyWorkPage } from '../../../e2e/pages/my-work.page';
import { Presenter } from '../presenter';

// Journey: My work lists what is assigned to you across organizations (docs/detailed-designs/organizations, L2-146).
test('my-work', async ({ page, api }) => {
  const show = await Presenter.start(page, 'my-work');
  const work = new MyWorkPage(page);
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

  await show.card(
    'opening',
    'opening',
    ['My work', 'Recorded against a local fake API · synthetic people'],
    () => api.signInAs(pat, '/o/all'),
  );

  await show.step('open', async () => {
    await new AppShell(page).primaryNav.getByRole('link', { name: 'My work' }).click();
    await expect(page).toHaveURL('/o/all/my-work');
    await expect(work.heading).toHaveText('My work');
  });

  await show.step(
    'list',
    async () => {
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
    },
    { poster: true },
  );

  await show.card('closing', 'closing', [
    'Everything assigned to you, in one list',
    'Labelled by workspace and organization',
  ]);
  await show.finish();
});
