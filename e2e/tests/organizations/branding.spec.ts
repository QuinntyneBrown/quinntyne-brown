// Traces to: L2-149
import { expect, test } from '../../fixtures/app';
import { MockApi } from '../../fixtures/mock-api';
import { ErrorPages } from '../../pages/error-pages.page';
import { OrgBrandingPage } from '../../pages/org-branding.page';
import { PublicEventPage } from '../../pages/public-event.page';

function addPublicEvent(api: MockApi) {
  return api.events.add({ title: 'Toronto Builders Night', visibility: 'Public' });
}

test.describe('Org-addressed public events and branding', () => {
  test('an anonymous visitor sees the org band on the org-addressed page and RSVPs', async ({
    page,
    api,
    axe,
  }) => {
    api.organizations.brand('faithtech-toronto', {
      displayName: 'FaithTech Toronto',
      accent: '#0b6e4f',
      accentForeground: '#ffffff',
    });
    const event = addPublicEvent(api);
    const publicPage = new PublicEventPage(page);

    await publicPage.open(event.id);

    await expect(publicPage.heading).toHaveText('Toronto Builders Night');
    await expect(publicPage.orgBand).toHaveText(/FaithTech Toronto/);
    await expect(publicPage.orgBand).toHaveCSS('background-color', 'rgb(11, 110, 79)');
    await axe.check();
    await publicPage.rsvp('Abby Brooks', 'abby@example.org');
    await expect(publicPage.onTheList).toBeVisible();
  });

  test('the old public address redirects to the org address', async ({ page, api }) => {
    const event = addPublicEvent(api);

    await new PublicEventPage(page).openLegacy(event.id);

    await expect(page).toHaveURL(`/o/faithtech-toronto/events/${event.id}`);
    await expect(new PublicEventPage(page).heading).toHaveText('Toronto Builders Night');
  });

  test('an old slug redirects, and another org’s slug shows the not-found page', async ({
    page,
    api,
  }) => {
    api.organizations.bySlug('faithtech-toronto')!.aliases.push('toronto');
    const event = addPublicEvent(api);
    const publicPage = new PublicEventPage(page);

    await publicPage.open(event.id, 'toronto');
    await expect(page).toHaveURL(`/o/faithtech-toronto/events/${event.id}`);

    await publicPage.open(event.id, 'shelfie');
    await expect(new ErrorPages(page).notFound).toBeVisible();
  });

  test('an Org Lead saves a display name and an accent with enough contrast', async ({
    page,
    api,
    axe,
  }) => {
    const olivia = api.addAccount({
      email: 'olivia@example.org',
      name: 'Olivia Grant',
      roles: ['Volunteer'],
      orgLead: ['faithtech-toronto'],
    });
    const branding = new OrgBrandingPage(page);
    await api.signInAs(olivia, '/o/faithtech-toronto/settings/branding');

    await expect(branding.displayName).toHaveValue('FaithTech Toronto');
    await branding.displayName.fill('FaithTech TO');
    await branding.accent.fill('#0B6E4F');
    await expect(branding.ratio).toContainText('Contrast with white text: 6.');
    await expect(branding.ratio).toContainText('Passes AA');
    await axe.check();
    await branding.save.click();

    await expect(branding.toast).toContainText('Branding saved');
    expect(api.callsTo('PUT', '/api/organizations/org-toronto/branding')[0].body).toEqual({
      displayName: 'FaithTech TO',
      accent: '#0b6e4f',
    });
    await expect(branding.preview).toHaveText(/FaithTech TO/);
  });

  test('an accent without enough contrast is refused with the measured ratio', async ({
    page,
    api,
    axe,
  }) => {
    const olivia = api.addAccount({
      email: 'olivia@example.org',
      roles: ['Volunteer'],
      orgLead: ['faithtech-toronto'],
    });
    const branding = new OrgBrandingPage(page);
    await api.signInAs(olivia, '/o/faithtech-toronto/settings/branding');

    await branding.accent.fill('#777777');
    await expect(branding.ratio).toContainText('Below 4.5:1');
    await branding.save.click();

    await expect
      .poll(() => branding.accentError())
      .toContain("This colour doesn't have enough contrast. Choose a darker or lighter shade.");
    await expect(branding.accent).toHaveAttribute('aria-invalid', 'true');
    await expect(branding.ratio).toContainText('4.47:1');
    await axe.check();
  });

  test('a member without Org Lead sees that branding is for Org Leads', async ({ page, api }) => {
    const ruth = api.addAccount({ email: 'ruth@example.org', roles: ['Volunteer'] });
    await api.signInAs(ruth, '/o/faithtech-toronto/settings/branding');

    await expect(new OrgBrandingPage(page).forbidden).toBeVisible();
  });
});
