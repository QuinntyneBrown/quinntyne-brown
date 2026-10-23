import { expect, test } from '../../../e2e/fixtures/app';
import { WaitingPage } from '../../../e2e/pages/org-members.page';
import { Presenter } from '../presenter';

// Journey: an account that belongs to no organization waits to be added (docs/detailed-designs/organizations, L2-142).
test('waiting-for-an-org', async ({ page, api }) => {
  const show = await Presenter.start(page, 'waiting-for-an-org');
  const waiting = new WaitingPage(page);
  const joel = api.addAccount({ email: 'joel@example.org', name: 'Joel Martins', orgs: [] });

  await show.card(
    'opening',
    'opening',
    ['Waiting to be added', 'Recorded against a local fake API · synthetic people'],
    () => api.signInAs(joel),
  );

  await show.step(
    'waiting',
    async () => {
      await expect(page).toHaveURL('/waiting');
      await expect(waiting.heading).toHaveText('Waiting to be added');
      await expect(page.getByText('Hi Joel, your account is ready.')).toBeVisible();
    },
    { poster: true },
  );

  await show.step('profile', async () => {
    await expect(waiting.profile).toHaveAttribute('href', '/profile/me');
    await expect(page.getByRole('navigation', { name: 'Primary' })).toHaveCount(0);
  });

  await show.step('added', async () => {
    joel.orgs = ['faithtech-toronto'];
    await waiting.checkAgain.click();
    await expect(page).toHaveURL('/o/faithtech-toronto');
  });

  await show.card('closing', 'closing', [
    'Your account is ready before you have an organization',
    'Check again once an Org Lead adds you',
  ]);
  await show.finish();
});
