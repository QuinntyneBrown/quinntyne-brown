// Traces to: L2-134, L2-137, L2-138, L2-147, L2-156
import { expect, test } from '../../fixtures/app';
import { MockApi } from '../../fixtures/mock-api';
import { AppShell } from '../../pages/app-shell.page';
import { PortfolioDialog, PortfolioPage } from '../../pages/portfolio.page';

function portfolioLead(api: MockApi) {
  return api.addAccount({
    email: 'quinn@example.org',
    name: 'Quinntyne Brown',
    portfolioLead: true,
  });
}

test.describe('Portfolio administration', () => {
  test('the Portfolio Lead creates an org, which is listed, and archives and restores it', async ({
    page,
    api,
    axe,
  }) => {
    const portfolio = new PortfolioPage(page);
    await api.signInAs(portfolioLead(api), '/o/faithtech-toronto/portfolio/organizations');

    await expect(portfolio.row('FaithTech Toronto')).toContainText('FaithTech City');
    await expect(portfolio.row('Shelfie')).toContainText('Startup');
    await axe.check();

    await portfolio.newOrganization.click();
    const create = new PortfolioDialog(page, 'New organization');
    await create.field('Name').fill('FaithTech Ottawa');
    await create.field(/^Slug/).fill('All');
    await create.button('Create organization').click();
    await expect.poll(() => create.errorOf(/^Slug/)).toContain('“all” is reserved');
    await create.field(/^Slug/).fill('faithtech-ottawa');
    await create.field('Org Type').selectOption({ label: 'FaithTech City' });
    await axe.check();
    await create.button('Create organization').click();

    await expect(create.dialog).toBeHidden();
    await expect(portfolio.row('FaithTech Ottawa')).toContainText('/o/faithtech-ottawa');

    await portfolio.button('Archive FaithTech Ottawa').click();
    await new PortfolioDialog(page, 'Archive FaithTech Ottawa?')
      .button('Archive organization')
      .click();
    await expect(portfolio.row('FaithTech Ottawa')).toHaveCount(0);
    await portfolio.archivedTab.click();
    await portfolio.button('Restore FaithTech Ottawa').click();
    await expect(portfolio.toast).toContainText('FaithTech Ottawa was restored');
  });

  test('switching a feature off for an Org Type hides it from that type’s orgs', async ({
    page,
    api,
    axe,
  }) => {
    const portfolio = new PortfolioPage(page);
    await api.signInAs(portfolioLead(api), '/o/faithtech-toronto/portfolio/org-types');

    await expect(portfolio.row('FaithTech City')).toContainText('7 roles');
    await portfolio.link('Startup').click();
    await portfolio.link('Features').click();
    await expect(portfolio.feature('Profiles')).toBeDisabled();
    await expect(portfolio.feature('Resources')).toBeChecked();
    await portfolio.feature('Resources').click();
    await axe.check();
    await portfolio.saveFeatures.click();
    await expect(portfolio.toast).toContainText('Features saved');

    expect(api.callsTo('PUT', '/api/org-types/type-startup/features')[0].body).toEqual({
      enabled: ['invites', 'agile'],
    });
    expect(api.organizations.bySlug('shelfie')!.features).not.toContain('resources');
  });

  test('the Portfolio Lead adds a catalogue role, and a held role cannot be removed', async ({
    page,
    api,
    axe,
  }) => {
    api.addAccount({ email: 'ruth@example.org', name: 'Ruth Alvarez', roles: ['Volunteer'] });
    const portfolio = new PortfolioPage(page);
    await api.signInAs(portfolioLead(api), '/o/faithtech-toronto/portfolio/org-types');
    await portfolio.link('FaithTech City').click();

    await expect(portfolio.role('Volunteer')).toContainText('1 person');
    await portfolio.addRole.click();
    const add = new PortfolioDialog(page, 'Add a role to FaithTech City');
    await add.field('Name').fill('Mentor');
    await add.field(/^Key/).fill('mentor');
    await add.checkbox(/See the People page/).check();
    await axe.check();
    await add.button('Add role').click();
    await expect(add.dialog).toBeHidden();
    await expect(portfolio.role('Mentor')).toBeVisible();
    expect(api.callsTo('POST', '/api/org-types/type-faithtech-city/roles')[0].body).toMatchObject({
      key: 'mentor',
      permissions: ['people.view'],
    });

    await portfolio.button('Remove Volunteer').click();
    const remove = new PortfolioDialog(page, 'Remove Volunteer from FaithTech City?');
    await remove.button('Remove Volunteer').click();
    await expect(remove.refusal).toContainText('Ruth Alvarez');
    await axe.check();
  });

  test('the Portfolio Lead assigns Staff to someone, who then covers the FaithTech City orgs', async ({
    page,
    api,
    axe,
  }) => {
    const ruth = api.addAccount({
      email: 'ruth@example.org',
      name: 'Ruth Alvarez',
      roles: ['Volunteer'],
    });
    const portfolio = new PortfolioPage(page);
    await api.signInAs(portfolioLead(api), '/o/faithtech-toronto/portfolio/cross-org-roles');

    await expect(portfolio.row('Staff')).toContainText('Every FaithTech City org');
    await portfolio.button('Assign Staff').click();
    const assign = new PortfolioDialog(page, 'Assign Staff');
    await assign.field('Person').selectOption({ label: 'Ruth Alvarez' });
    await axe.check();
    await assign.button('Assign Staff').click();

    await expect(portfolio.toast).toContainText('Ruth Alvarez now holds Staff');
    expect(ruth.crossOrg).toContain('staff');
  });

  test('the Portfolio Lead creates an agent, issues a token shown once and revokes it', async ({
    page,
    api,
    axe,
  }) => {
    const portfolio = new PortfolioPage(page);
    await api.signInAs(portfolioLead(api), '/o/faithtech-toronto/portfolio/agents');

    await portfolio.newAgent.click();
    const create = new PortfolioDialog(page, 'New agent');
    await create.field(/^Name/).fill('Sprint Bot');
    await create.button('Create agent').click();
    await expect(portfolio.row('Sprint Bot')).toBeVisible();

    await portfolio.button('Issue a token to Sprint Bot').click();
    const issue = new PortfolioDialog(page, 'Issue a token to Sprint Bot');
    await issue.field(/^Token name/).fill('CI');
    await issue.checkbox(/FaithTech Toronto/).check();
    await issue.button('Issue token').click();
    await expect(issue.token).toHaveValue(/^ftca_/);
    await expect(issue.dialog).toContainText('You won’t see this token again.');
    await axe.check();
    await issue.done.click();

    await expect(portfolio.tokens.filter({ hasText: 'CI' })).toContainText('FaithTech Toronto');
    await portfolio.button('Revoke CI').click();
    await new PortfolioDialog(page, 'Revoke CI?').button('Revoke token').click();
    await expect(portfolio.tokens.filter({ hasText: 'CI' })).toContainText('Revoked');
  });

  test('an Org Lead does not see the Portfolio and is refused it', async ({ page, api }) => {
    const olivia = api.addAccount({
      email: 'olivia@example.org',
      roles: ['Volunteer'],
      orgLead: ['faithtech-toronto'],
    });
    await api.signInAs(olivia, '/o/faithtech-toronto');
    expect(await new AppShell(page).navLabels()).not.toContain('Portfolio');

    const portfolio = new PortfolioPage(page);
    await portfolio.open('organizations');
    await expect(portfolio.forbidden).toBeVisible();
  });

  test('the Portfolio Lead changes an org’s address, and an Org Lead sees it read-only', async ({
    page,
    api,
    axe,
  }) => {
    const portfolio = new PortfolioPage(page);
    await api.signInAs(portfolioLead(api), '/o/faithtech-toronto/settings/general');

    await expect(page.getByRole('main')).toContainText('/o/faithtech-toronto');
    await axe.check();
    await portfolio.button('Edit name and address').click();
    const edit = new PortfolioDialog(page, 'Edit FaithTech Toronto');
    await edit.field(/^Slug/).fill('toronto');
    await edit.button('Save changes').click();

    await expect(page).toHaveURL('/o/toronto/settings/general');
    await expect(page.getByRole('main')).toContainText('faithtech-toronto');
  });

  test('an Org Lead sees the org’s general settings read-only', async ({ page, api }) => {
    const olivia = api.addAccount({
      email: 'olivia@example.org',
      roles: ['Volunteer'],
      orgLead: ['faithtech-toronto'],
    });
    await api.signInAs(olivia, '/o/faithtech-toronto/settings/general');

    await expect(page.getByRole('main')).toContainText('Only the Portfolio Lead changes the name');
    await expect(new PortfolioPage(page).button('Edit name and address')).toHaveCount(0);
  });
});
