import { expect, test } from '../../../e2e/fixtures/app';
import { PortfolioDialog, PortfolioPage } from '../../../e2e/pages/portfolio.page';
import { Presenter } from '../presenter';

// Journey: cross-org roles such as Staff (docs/detailed-designs/organizations, L2-141).
test('cross-org-roles', async ({ page, api }) => {
  const show = await Presenter.start(page, 'cross-org-roles');
  const portfolio = new PortfolioPage(page);
  const quinn = api.addAccount({
    email: 'quinn@example.org',
    name: 'Quinntyne Brown',
    portfolioLead: true,
  });
  const ruth = api.addAccount({
    email: 'ruth@example.org',
    name: 'Ruth Alvarez',
    roles: ['Volunteer'],
  });

  await show.card(
    'opening',
    'opening',
    ['Cross-org roles', 'Recorded against a local fake API · synthetic people'],
    () => api.signInAs(quinn, '/o/faithtech-toronto/portfolio/cross-org-roles'),
  );

  await show.step(
    'roles',
    async () => {
      await expect(portfolio.row('Staff')).toContainText('Every FaithTech City org');
    },
    { poster: true },
  );

  await show.step('assign', async () => {
    await portfolio.button('Assign Staff').click();
    const assign = new PortfolioDialog(page, 'Assign Staff');
    await assign.field('Person').selectOption({ label: 'Ruth Alvarez' });
    await assign.button('Assign Staff').click();
    await expect(portfolio.toast).toContainText('Ruth Alvarez now holds Staff');
    expect(ruth.crossOrg).toContain('staff');
  });

  await show.card('closing', 'closing', [
    'One role, many organizations',
    'Coverage is a set, a type or the whole portfolio',
  ]);
  await show.finish();
});
