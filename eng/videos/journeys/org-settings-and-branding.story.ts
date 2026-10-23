import { expect, test } from '../../../e2e/fixtures/app';
import { OrgBrandingPage } from '../../../e2e/pages/org-branding.page';
import { Presenter, typeInto } from '../presenter';

// Journey: an Org Lead sets the organization's display name and accent (docs/detailed-designs/organizations, L2-149).
test('org-settings-and-branding', async ({ page, api }) => {
  const show = await Presenter.start(page, 'org-settings-and-branding');
  const branding = new OrgBrandingPage(page);
  const olivia = api.addAccount({
    email: 'olivia@example.org',
    name: 'Olivia Grant',
    roles: ['Volunteer'],
    orgLead: ['faithtech-toronto'],
  });

  await show.card(
    'opening',
    'opening',
    ['Organization settings and branding', 'Recorded against a local fake API · synthetic people'],
    () => api.signInAs(olivia, '/o/faithtech-toronto/settings/general'),
  );

  await show.step(
    'general',
    async () => {
      await expect(page.getByRole('main')).toContainText('/o/faithtech-toronto');
      await expect(page.getByRole('main')).toContainText(
        'Only the Portfolio Lead changes the name',
      );
    },
    { poster: true },
  );

  await show.step('branding', async () => {
    await branding.open();
    await expect(branding.displayName).toHaveValue('FaithTech Toronto');
  });

  await show.step('save', async () => {
    await typeInto(branding.displayName, 'FaithTech TO');
    await branding.accent.fill('#0B6E4F');
    await expect(branding.ratio).toContainText('Passes AA');
    await branding.save.click();
    await expect(branding.toast).toContainText('Branding saved');
    await expect(branding.preview).toHaveText(/FaithTech TO/);
  });

  await show.step('low-contrast', async () => {
    await branding.accent.fill('#777777');
    await expect(branding.ratio).toContainText('Below 4.5:1');
    await branding.save.click();
    await expect(branding.accent).toHaveAttribute('aria-invalid', 'true');
    await expect(branding.ratio).toContainText('4.47:1');
  });

  await show.card('closing', 'closing', [
    'The name and address belong to the Portfolio Lead',
    'Branding belongs to the Org Lead',
    'Every accent is checked for contrast',
  ]);
  await show.finish();
});
