// Traces to: L2-158, L2-165 (docs/detailed-designs/integrations/application-events, manage-applications)
import { expect, test } from '../../fixtures/app';
import { ApplicationsPage } from '../../pages/applications.page';
import { RegisterApplicationDialog } from '../../pages/integration.dialogs';
import { MockApi } from '../../fixtures/mock-api';

const lead = (api: MockApi) =>
  api.addAccount({
    email: 'quinn@example.org',
    name: 'Quinntyne Brown',
    orgLead: ['faithtech-toronto'],
  });

/** Goodwork (active, 1 event) and Volunteer form (old) (revoked), as the mocks' cast. */
function seedApplications(api: MockApi) {
  const goodwork = api.integrations.add({ name: 'Goodwork' });
  api.integrations.deliver(goodwork, {
    data: { name: 'Ada Lovelace', email: 'ada@example.com', message: 'We’d like to volunteer.' },
  });
  api.integrations.add({ name: 'Volunteer form (old)', revokedAt: '2026-10-15T15:00:00Z' });
  return goodwork;
}

test.describe('Applications', () => {
  // L2-165 AC1: Given the Org Lead, when they open Applications, then they see the org's applications.
  test('an Org Lead sees the org’s applications, active and revoked', async ({
    page,
    api,
    axe,
  }) => {
    const goodwork = seedApplications(api);
    const applications = new ApplicationsPage(page);

    await api.signInAs(lead(api), '/o/faithtech-toronto/applications');

    await expect(applications.heading).toHaveText('Applications');
    await expect(applications.register).toBeVisible();
    const rows = await applications.rows();
    expect(rows.map((r) => [r[0], r[2], r[4]])).toEqual([
      ['Goodwork', 'Active', '1'],
      ['Volunteer form (old)', 'Revoked', '0'],
    ]);
    expect(rows[0][1]).toBe(`${goodwork.sourceId.slice(0, 8)}…${goodwork.sourceId.slice(-4)}`);
    await axe.check();
  });

  // L2-158 AC1, AC5: Given the Org Lead, when they register Goodwork, then the source ID and secret show once,
  // and the secret is masked once copied.
  test('an Org Lead registers an application and copies its secret once', async ({
    page,
    api,
    axe,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const applications = new ApplicationsPage(page);
    const dialog = new RegisterApplicationDialog(page);
    await api.signInAs(lead(api), '/o/faithtech-toronto/applications');
    await expect(applications.empty).toBeVisible();

    await applications.register.click();
    await expect(dialog.dialog).toBeVisible();
    await axe.check();
    await dialog.name.fill('Goodwork');
    await dialog.submit.click();

    const app = api.integrations.apps[0];
    await expect(dialog.registered).toHaveAccessibleName('Goodwork is registered');
    await expect(dialog.sourceId).toHaveValue(app.sourceId);
    await expect(dialog.secret.value).toHaveValue(app.secret);
    expect(api.callsTo('POST', '/api/integrations/apps')[0].body).toEqual({ name: 'Goodwork' });
    await axe.check();

    await dialog.secret.copy.click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(app.secret);
    await expect(dialog.secret.masked).toContainText(app.secret.slice(0, 10));
    await expect(dialog.secret.value).toHaveCount(0);
    await expect(page.getByText(app.secret)).toHaveCount(0);
    await dialog.done.click();

    await expect(dialog.dialog).toBeHidden();
    await expect(applications.application('Goodwork')).toBeVisible();
    await expect(page.getByText(app.secret)).toHaveCount(0);
  });

  // L2-158 AC3: Given an empty name, when they register, then the name field shows the error.
  test('an empty name is refused', async ({ page, api, axe }) => {
    const applications = new ApplicationsPage(page);
    const dialog = new RegisterApplicationDialog(page);
    await api.signInAs(lead(api), '/o/faithtech-toronto/applications');

    await applications.register.click();
    await dialog.submit.click();

    await expect(dialog.nameError).toBeVisible();
    await expect(dialog.name).toHaveAttribute('aria-invalid', 'true');
    expect(api.integrations.apps).toHaveLength(0);
    await axe.check();
  });

  // L2-158 AC5: a failed request keeps the name and says so.
  test('a failed registration keeps the dialog open with the name', async ({ page, api }) => {
    api.on('POST', '/api/integrations/apps', (route) => route.fulfill({ status: 500 }));
    const applications = new ApplicationsPage(page);
    const dialog = new RegisterApplicationDialog(page);
    await api.signInAs(lead(api), '/o/faithtech-toronto/applications');

    await applications.register.click();
    await dialog.name.fill('Goodwork');
    await dialog.submit.click();

    await expect(dialog.failed).toBeVisible();
    await expect(dialog.name).toHaveValue('Goodwork');
  });

  // L2-165 AC4: Given Staff, when they open Applications, then they read the list but cannot register.
  test('Staff read the list without Register', async ({ page, api, axe }) => {
    seedApplications(api);
    const staff = api.addAccount({
      email: 'daniel@example.org',
      name: 'Daniel Reyes',
      roles: ['Staff'],
    });
    const applications = new ApplicationsPage(page);

    await api.signInAs(staff, '/o/faithtech-toronto/applications');

    await expect(applications.application('Goodwork')).toBeVisible();
    await expect(applications.readOnlyNote).toBeVisible();
    await expect(applications.register).toHaveCount(0);
    await axe.check();
  });

  // L2-165 AC2: Given a member without integrations.view, when they open Applications, then the forbidden state shows.
  test('a member without the permission sees the forbidden state', async ({ page, api, axe }) => {
    seedApplications(api);
    const jonah = api.addAccount({
      email: 'jonah@example.org',
      name: 'Jonah Bell',
      roles: ['Volunteer'],
    });
    const applications = new ApplicationsPage(page);

    await api.signInAs(jonah, '/o/faithtech-toronto/applications');

    await expect(applications.forbidden).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Applications' })).toBeAttached();
    await axe.check();
  });

  // L2-165 AC5: Given the list fails, when the page loads, then the error state offers Try again.
  test('a failed list offers Try again', async ({ page, api, axe }) => {
    seedApplications(api);
    let failures = 1;
    api.on('GET', '/api/integrations/apps', (route) =>
      failures-- > 0 ? route.fulfill({ status: 500 }) : api.fallback(route),
    );
    const applications = new ApplicationsPage(page);
    await api.signInAs(lead(api), '/o/faithtech-toronto/applications');

    await expect(applications.error).toBeVisible();
    await axe.check();
    await applications.tryAgain.click();

    await expect(applications.application('Goodwork')).toBeVisible();
  });
});
