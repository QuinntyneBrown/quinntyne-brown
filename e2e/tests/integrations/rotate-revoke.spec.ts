// Traces to: L2-159, L2-160 (docs/detailed-designs/integrations/manage-applications)
import { expect, test } from '../../fixtures/app';
import { MockApi } from '../../fixtures/mock-api';
import { ApplicationPage } from '../../pages/application.page';
import { RevokeApplicationDialog, RotateSecretDialog } from '../../pages/integration.dialogs';

const lead = (api: MockApi) =>
  api.addAccount({
    email: 'quinn@example.org',
    name: 'Quinntyne Brown',
    orgLead: ['faithtech-toronto'],
  });

function seedGoodwork(api: MockApi) {
  const goodwork = api.integrations.add({ name: 'Goodwork' });
  api.integrations.deliver(goodwork, {
    data: { name: 'Ada Lovelace', email: 'ada@example.com', message: 'Hello.' },
  });
  return goodwork;
}

test.describe('Rotate and revoke', () => {
  // L2-159 AC1, AC5: the new secret is shown once with when the old one stops working.
  test('an Org Lead rotates the secret and sees the new one once', async ({
    page,
    api,
    axe,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const goodwork = seedGoodwork(api);
    const oldPrefix = goodwork.secret.slice(0, 10);
    const application = new ApplicationPage(page);
    const dialog = new RotateSecretDialog(page);
    await api.signInAs(lead(api), `/o/faithtech-toronto/applications/${goodwork.id}`);

    await application.rotate.click();
    await expect(dialog.dialog).toHaveAccessibleName('Rotate Goodwork’s secret?');
    await expect(dialog.dialog).toContainText('keeps working for 24 hours');
    await axe.check();
    await dialog.rotate.click();

    await expect(dialog.rotated).toBeVisible();
    await expect(dialog.secret.value).toHaveValue(goodwork.secret);
    await expect(dialog.previousUntil).toBeVisible();
    expect(api.callsTo('POST', `/api/integrations/apps/${goodwork.id}/rotate`)).toHaveLength(1);
    await axe.check();
    await dialog.secret.copy.click();
    await expect(dialog.secret.masked).toBeVisible();
    await dialog.copiedIt.click();

    await expect(dialog.dialog).toBeHidden();
    await expect(application.maskedSecret).toContainText(`${goodwork.secret.slice(0, 10)}…`);
    expect(goodwork.secret.slice(0, 10)).not.toBe(oldPrefix);
  });

  // L2-159: a failed rotation leaves the secret as it was and says so.
  test('a failed rotation says the current secret still works', async ({ page, api }) => {
    const goodwork = seedGoodwork(api);
    api.on('POST', `/api/integrations/apps/${goodwork.id}/rotate`, (route) =>
      route.fulfill({ status: 500 }),
    );
    const application = new ApplicationPage(page);
    const dialog = new RotateSecretDialog(page);
    await api.signInAs(lead(api), `/o/faithtech-toronto/applications/${goodwork.id}`);

    await application.rotate.click();
    await dialog.rotate.click();

    await expect(dialog.failed).toContainText('The current secret still works.');
  });

  // L2-160 AC1, AC2: revoking is confirmed, permanent, and the events stay.
  test('an Org Lead revokes an application after confirming', async ({ page, api, axe }) => {
    const goodwork = seedGoodwork(api);
    const application = new ApplicationPage(page);
    const dialog = new RevokeApplicationDialog(page);
    await api.signInAs(lead(api), `/o/faithtech-toronto/applications/${goodwork.id}`);

    await application.revoke.click();
    await expect(dialog.dialog).toHaveAccessibleName('Revoke Goodwork?');
    await expect(dialog.dialog).toContainText('You can’t undo this.');
    await axe.check();
    await dialog.revoke.click();

    await expect(dialog.dialog).toBeHidden();
    await expect(application.status).toHaveText('Revoked');
    await expect(application.revokedAlert).toBeVisible();
    await expect(application.rotate).toHaveCount(0);
    await expect(application.revoke).toHaveCount(0);
    await expect(application.entries).toHaveCount(1);
    expect(goodwork.revokedAt).not.toBeNull();
    await axe.check();
  });

  // L2-160: Cancel changes nothing.
  test('cancelling the revoke keeps the application active', async ({ page, api }) => {
    const goodwork = seedGoodwork(api);
    const application = new ApplicationPage(page);
    const dialog = new RevokeApplicationDialog(page);
    await api.signInAs(lead(api), `/o/faithtech-toronto/applications/${goodwork.id}`);

    await application.revoke.click();
    await dialog.cancel.click();

    await expect(dialog.dialog).toBeHidden();
    await expect(application.status).toHaveText('Active');
    expect(api.callsTo('POST', `/api/integrations/apps/${goodwork.id}/revoke`)).toHaveLength(0);
  });

  // L2-159 AC4, L2-160 AC4: Staff read but cannot rotate or revoke.
  test('Staff see no Rotate or Revoke', async ({ page, api }) => {
    const goodwork = seedGoodwork(api);
    const staff = api.addAccount({
      email: 'daniel@example.org',
      name: 'Daniel Reyes',
      roles: ['Staff'],
    });
    const application = new ApplicationPage(page);

    await api.signInAs(staff, `/o/faithtech-toronto/applications/${goodwork.id}`);

    await expect(application.entries).toHaveCount(1);
    await expect(application.rotate).toHaveCount(0);
    await expect(application.revoke).toHaveCount(0);
  });
});
