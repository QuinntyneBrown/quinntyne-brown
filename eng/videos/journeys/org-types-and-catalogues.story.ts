import { expect, test } from '../../../e2e/fixtures/app';
import { PortfolioDialog, PortfolioPage } from '../../../e2e/pages/portfolio.page';
import { Presenter, typeInto } from '../presenter';

// Journey: Org Types, their features and role catalogues (docs/detailed-designs/organizations, L2-138, L2-139).
test('org-types-and-catalogues', async ({ page, api }) => {
  const show = await Presenter.start(page, 'org-types-and-catalogues');
  const portfolio = new PortfolioPage(page);
  const quinn = api.addAccount({
    email: 'quinn@example.org',
    name: 'Quinntyne Brown',
    portfolioLead: true,
  });
  api.addAccount({ email: 'ruth@example.org', name: 'Ruth Alvarez', roles: ['Volunteer'] });

  await show.card(
    'opening',
    'opening',
    ['Org Types, features and roles', 'Recorded against a local fake API · synthetic people'],
    () => api.signInAs(quinn, '/o/faithtech-toronto/portfolio/org-types'),
  );

  await show.step(
    'types',
    async () => {
      await expect(portfolio.row('FaithTech City')).toContainText('7 roles');
    },
    { poster: true },
  );

  await show.step('features', async () => {
    await portfolio.link('Startup').click();
    await portfolio.link('Features').click();
    await expect(portfolio.feature('Profiles')).toBeDisabled();
    await portfolio.feature('Resources').click();
    await portfolio.saveFeatures.click();
    await expect(portfolio.toast).toContainText('Features saved');
  });

  await show.step('catalogue', async () => {
    await page.goto('/o/faithtech-toronto/portfolio/org-types');
    await portfolio.link('FaithTech City').click();
    await expect(portfolio.role('Volunteer')).toContainText('1 person');
  });

  await show.step('add-role', async () => {
    await portfolio.addRole.click();
    const add = new PortfolioDialog(page, 'Add a role to FaithTech City');
    await typeInto(add.field('Name'), 'Mentor');
    await add.field(/^Key/).fill('mentor');
    await add.checkbox(/See the People page/).check();
    await add.button('Add role').click();
    await expect(add.dialog).toBeHidden();
    await expect(portfolio.role('Mentor')).toBeVisible();
  });

  await show.step('held-role', async () => {
    await portfolio.button('Remove Volunteer').click();
    const remove = new PortfolioDialog(page, 'Remove Volunteer from FaithTech City?');
    await remove.button('Remove Volunteer').click();
    await expect(remove.refusal).toContainText('Ruth Alvarez');
  });

  await show.card('closing', 'closing', [
    'Features are switched on per Org Type',
    'Roles are data, bundled from permissions',
    'A role someone holds cannot be removed',
  ]);
  await show.finish();
});
