import { expect, test } from '../../../e2e/fixtures/app';
import { PortfolioDialog, PortfolioPage } from '../../../e2e/pages/portfolio.page';
import { Presenter, typeInto } from '../presenter';

// Journey: agents and their scoped tokens (docs/detailed-designs/organizations, L2-150).
test('agents-and-tokens', async ({ page, api }) => {
  const show = await Presenter.start(page, 'agents-and-tokens');
  const portfolio = new PortfolioPage(page);
  const quinn = api.addAccount({
    email: 'quinn@example.org',
    name: 'Quinntyne Brown',
    portfolioLead: true,
  });

  await show.card(
    'opening',
    'opening',
    ['Agents and tokens', 'Recorded against a local fake API · synthetic people'],
    () => api.signInAs(quinn, '/o/faithtech-toronto/portfolio/agents'),
  );

  await show.step(
    'create',
    async () => {
      await portfolio.newAgent.click();
      const create = new PortfolioDialog(page, 'New agent');
      await typeInto(create.field(/^Name/), 'Sprint Bot');
      await create.button('Create agent').click();
      await expect(portfolio.row('Sprint Bot')).toBeVisible();
    },
    { poster: true },
  );

  await show.step('issue', async () => {
    await portfolio.button('Issue a token to Sprint Bot').click();
    const issue = new PortfolioDialog(page, 'Issue a token to Sprint Bot');
    await typeInto(issue.field(/^Token name/), 'CI');
    await issue.checkbox(/FaithTech Toronto/).check();
    await issue.button('Issue token').click();
    await expect(issue.token).toHaveValue(/^ftca_/);
    await expect(issue.dialog).toContainText('You won’t see this token again.');
  });

  await show.step('listed', async () => {
    await new PortfolioDialog(page, 'Issue a token to Sprint Bot').done.click();
    await expect(portfolio.tokens.filter({ hasText: 'CI' })).toContainText('FaithTech Toronto');
  });

  await show.step('revoke', async () => {
    await portfolio.button('Revoke CI').click();
    await new PortfolioDialog(page, 'Revoke CI?').button('Revoke token').click();
    await expect(portfolio.tokens.filter({ hasText: 'CI' })).toContainText('Revoked');
  });

  await show.card('closing', 'closing', [
    'Agents are profiles that hold roles',
    'Tokens are scoped to organizations and shown once',
    'Revoke one and it stops working',
  ]);
  await show.finish();
});
