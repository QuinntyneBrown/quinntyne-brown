import { expect, test } from '../../../e2e/fixtures/app';
import { PortfolioDialog, PortfolioPage } from '../../../e2e/pages/portfolio.page';
import { Presenter, typeInto } from '../presenter';

// Journey: the Portfolio Lead manages organizations (docs/detailed-designs/organizations, L2-134, L2-137).
test('portfolio-organizations', async ({ page, api }) => {
  const show = await Presenter.start(page, 'portfolio-organizations');
  const portfolio = new PortfolioPage(page);
  const quinn = api.addAccount({
    email: 'quinn@example.org',
    name: 'Quinntyne Brown',
    portfolioLead: true,
  });

  await show.card(
    'opening',
    'opening',
    [
      'Manage organizations in the portfolio',
      'Recorded against a local fake API · synthetic people',
    ],
    () => api.signInAs(quinn, '/o/faithtech-toronto/portfolio/organizations'),
  );

  await show.step(
    'list',
    async () => {
      await expect(portfolio.row('FaithTech Toronto')).toContainText('FaithTech City');
      await expect(portfolio.row('Shelfie')).toContainText('Startup');
    },
    { poster: true },
  );

  await show.step('create', async () => {
    await portfolio.newOrganization.click();
    const create = new PortfolioDialog(page, 'New organization');
    await typeInto(create.field('Name'), 'FaithTech Ottawa');
    await create.field(/^Slug/).fill('All');
    await create.button('Create organization').click();
    await expect.poll(() => create.errorOf(/^Slug/)).toContain('“all” is reserved');
    await create.field(/^Slug/).fill('faithtech-ottawa');
    await create.field('Org Type').selectOption({ label: 'FaithTech City' });
    await create.button('Create organization').click();
    await expect(create.dialog).toBeHidden();
    await expect(portfolio.row('FaithTech Ottawa')).toContainText('/o/faithtech-ottawa');
  });

  await show.step('archive', async () => {
    await portfolio.button('Archive FaithTech Ottawa').click();
    await new PortfolioDialog(page, 'Archive FaithTech Ottawa?')
      .button('Archive organization')
      .click();
    await expect(portfolio.row('FaithTech Ottawa')).toHaveCount(0);
  });

  await show.step('restore', async () => {
    await portfolio.archivedTab.click();
    await portfolio.button('Restore FaithTech Ottawa').click();
    await expect(portfolio.toast).toContainText('FaithTech Ottawa was restored');
  });

  await show.card('closing', 'closing', [
    'Every organization in one list',
    'New organizations get their own address',
    'Archive and restore, nothing is lost',
  ]);
  await show.finish();
});
