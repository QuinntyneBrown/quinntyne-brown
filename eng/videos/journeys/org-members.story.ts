import { expect, test } from '../../../e2e/fixtures/app';
import { AppShell } from '../../../e2e/pages/app-shell.page';
import {
  AddMemberDialog,
  OrgMembersPage,
  RemoveMemberDialog,
} from '../../../e2e/pages/org-members.page';
import { Presenter, typeInto } from '../presenter';

// Journey: an Org Lead manages the members of the org (docs/detailed-designs/organizations, L2-143).
test('org-members', async ({ page, api }) => {
  const show = await Presenter.start(page, 'org-members');
  const members = new OrgMembersPage(page);
  const olivia = api.addAccount({
    email: 'olivia@example.org',
    name: 'Olivia Grant',
    orgLead: ['faithtech-toronto'],
  });
  api.addAccount({ email: 'ruth@example.org', name: 'Ruth Alvarez', roles: ['Volunteer'] });
  api.addAccount({ email: 'sami@example.org', name: 'Sami Shah', orgs: [] });

  await show.card(
    'opening',
    'opening',
    ['Members of an organization', 'Recorded against a local fake API · synthetic people'],
    () => api.signInAs(olivia, '/o/faithtech-toronto'),
  );

  await show.step(
    'members',
    async () => {
      await new AppShell(page).primaryNav.getByRole('link', { name: 'Organization' }).click();
      await expect(page).toHaveURL('/o/faithtech-toronto/settings/members');
      await expect(members.row('Ruth Alvarez')).toContainText('Volunteer');
      await expect(members.row('Olivia Grant')).toContainText('Org Lead');
    },
    { poster: true },
  );

  await show.step('add-unknown', async () => {
    await members.addMember.click();
    const dialog = new AddMemberDialog(page);
    await typeInto(dialog.email, 'nobody@example.org');
    await dialog.confirm.click();
    await expect(dialog.emailError).toHaveText(
      'No account uses that email. Send an invite instead.',
    );
  });

  await show.step('add', async () => {
    const dialog = new AddMemberDialog(page);
    await dialog.email.fill('sami@example.org');
    await dialog.role.selectOption({ label: 'Volunteer' });
    await dialog.confirm.click();
    await expect(dialog.dialog).toBeHidden();
    await expect(members.row('Sami Shah')).toContainText('Volunteer');
  });

  await show.step('remove', async () => {
    await members.remove('Ruth Alvarez').click();
    const dialog = new RemoveMemberDialog(page);
    await expect(dialog.dialog).toContainText('loses every role in FaithTech Toronto');
    await dialog.confirm.click();
    await expect(members.row('Ruth Alvarez')).toHaveCount(0);
  });

  await show.step('last-lead', async () => {
    await members.remove('Olivia Grant').click();
    const dialog = new RemoveMemberDialog(page);
    await dialog.confirm.click();
    await expect(dialog.refusal).toContainText('Every organization needs an Org Lead.');
    await dialog.cancel.click();
  });

  await show.card('closing', 'closing', [
    'See who belongs and what they can do',
    'Add people who already have an account',
    'Remove them, but never the last Org Lead',
  ]);
  await show.finish();
});
