// Traces to: L2-148
import { expect, test } from '../../fixtures/app';
import { ShareNoteDialog } from '../../pages/note.dialogs';
import { NotePage } from '../../pages/note.page';

test.describe('Visibility levels', () => {
  test('Org-wide names the org, and only the Portfolio Lead may share with the whole portfolio', async ({
    page,
    api,
    axe,
  }) => {
    const quinn = api.addAccount({ email: 'quinn@example.org', name: 'Quinntyne Brown', portfolioLead: true });
    const plan = api.notes.add({ title: 'Portfolio values', ownerId: quinn.profileId, blocks: [] });
    await api.signInAs(quinn, `/notes/${plan.id}`);
    const note = new NotePage(page);

    await note.share.click();
    const dialog = new ShareNoteDialog(page, 'Portfolio values');
    await expect(dialog.visibility('OrgWide')).toHaveAccessibleName(/^Everyone in FaithTech Toronto/);
    await dialog.visibility('PortfolioWide').check();
    await axe.check();
    await dialog.save.click();

    await expect(dialog.dialog).toBeHidden();
    expect(api.callsTo('PUT', `/api/notes/${plan.id}/visibility`)[0].body).toMatchObject({
      visibility: 'PortfolioWide',
    });
  });

  test('a City Lead is offered Org-wide but not Portfolio-wide', async ({ page, api }) => {
    const grace = api.addAccount({ email: 'grace@example.org', roles: ['CityLead'] });
    const plan = api.notes.add({ title: 'City plan', ownerId: grace.profileId, blocks: [] });
    await api.signInAs(grace, `/notes/${plan.id}`);

    await new NotePage(page).share.click();
    const dialog = new ShareNoteDialog(page, 'City plan');
    await expect(dialog.visibility('OrgWide')).toBeVisible();
    await expect(dialog.visibility('PortfolioWide')).toHaveCount(0);
  });
});
