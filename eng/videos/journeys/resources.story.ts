import { expect, test } from '../../../e2e/fixtures/app';
import { ResourcePage } from '../../../e2e/pages/resource.page';
import { ResourcesPage } from '../../../e2e/pages/resources.page';
import { Presenter } from '../presenter';

// Journey: finding and opening a resource (docs/detailed-designs/resources/list-and-find, L2-056, L2-060).
test('resources', async ({ page, api }) => {
  const show = await Presenter.start(page, 'resources');
  const resources = new ResourcesPage(page);
  const resource = new ResourcePage(page);
  const grace = api.addAccount({
    email: 'grace@example.org',
    name: 'Grace Okonkwo',
    roles: ['CityLead'],
  });
  const deck = api.resources.add({
    title: 'City launch deck',
    ownerId: grace.profileId,
    type: 'Deck',
    description: 'The deck we use to launch a new FaithTech city.',
    fileName: 'city-launch-deck.pptx',
    size: 25_794_970,
    tags: ['launch', 'city-team'],
  });
  api.resources.add({
    title: 'Judging rubric',
    ownerId: grace.profileId,
    type: 'Template',
    linkUrl: 'https://docs.google.com/d/1',
    tags: ['hackathon'],
  });

  await show.card(
    'opening',
    'opening',
    ['Resources', 'Recorded against a local fake API · synthetic people'],
    () => api.signInAs(grace, '/resources'),
  );

  await show.step(
    'list',
    async () => {
      await expect(resources.heading).toHaveText('Resources');
      await expect(resources.item('City launch deck')).toBeVisible();
      await expect(resources.item('Judging rubric')).toBeVisible();
    },
    { poster: true },
  );

  await show.step('open', async () => {
    await resources.item('City launch deck').getByRole('link').first().click();
    await expect(resource.heading).toHaveText('City launch deck');
    await expect(resource.detail('File')).toContainText('city-launch-deck.pptx');
    await expect(resource.detail('Visibility')).toContainText('Org-wide');
    await expect(resource.detail('Owner')).toContainText('Grace Okonkwo (you)');
  });

  await show.step('owner-actions', async () => {
    await expect(resource.download).toBeVisible();
    await expect(resource.edit).toBeVisible();
    await expect(resource.archive).toBeVisible();
    expect(deck.id).toBeTruthy();
  });

  await show.card('closing', 'closing', [
    'Every resource, in the organization you are in',
    'Details, owner and visibility on one page',
    'Edit, archive and transfer for the owner',
  ]);
  await show.finish();
});
