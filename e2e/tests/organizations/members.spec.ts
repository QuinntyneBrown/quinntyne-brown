// Traces to: L2-143, L2-142, L2-155
import { test, expect } from '../../fixtures/app';
import { AppShell } from '../../pages/app-shell.page';
import {
  AddMemberDialog,
  OrgMembersPage,
  RemoveMemberDialog,
  WaitingPage,
} from '../../pages/org-members.page';

test.describe('Members of an org', () => {
  test('an Org Lead opens Organization, sees the members with their roles and adds someone by email', async ({
    page,
    api,
    axe,
  }) => {
    const olivia = api.addAccount({
      email: 'olivia@example.org',
      name: 'Olivia Grant',
      orgLead: ['faithtech-toronto'],
    });
    api.addAccount({ email: 'ruth@example.org', name: 'Ruth Alvarez', roles: ['Volunteer'] });
    api.addAccount({ email: 'sami@example.org', name: 'Sami Shah', orgs: [] });
    await api.signInAs(olivia, '/o/faithtech-toronto');

    await new AppShell(page).primaryNav.getByRole('link', { name: 'Organization' }).click();
    const members = new OrgMembersPage(page);
    await expect(page).toHaveURL('/o/faithtech-toronto/settings/members');
    await expect(members.heading).toHaveText('Organization settings');
    await expect(members.row('Ruth Alvarez')).toContainText('Volunteer');
    await expect(members.row('Olivia Grant')).toContainText('Org Lead');
    await axe.check();

    await members.addMember.click();
    const dialog = new AddMemberDialog(page);
    await dialog.email.fill('nobody@example.org');
    await dialog.confirm.click();
    await expect(dialog.emailError).toHaveText(
      'No account uses that email. Send an invite instead.',
    );
    await expect(dialog.invite).toHaveAttribute('href', '/o/faithtech-toronto/invites');
    await axe.check();
    await dialog.email.fill('sami@example.org');
    await dialog.role.selectOption({ label: 'Volunteer' });
    await dialog.confirm.click();

    await expect(dialog.dialog).toBeHidden();
    await expect(members.row('Sami Shah')).toContainText('Volunteer');
    await expect(members.toast).toContainText('Sami Shah is now a member of FaithTech Toronto');
  });

  test('removing a member asks first, and the last Org Lead stays', async ({ page, api }) => {
    const olivia = api.addAccount({
      email: 'olivia@example.org',
      name: 'Olivia Grant',
      orgLead: ['faithtech-toronto'],
    });
    api.addAccount({ email: 'ruth@example.org', name: 'Ruth Alvarez', roles: ['Volunteer'] });
    await api.signInAs(olivia, '/o/faithtech-toronto/settings/members');
    const members = new OrgMembersPage(page);

    await members.remove('Ruth Alvarez').click();
    const dialog = new RemoveMemberDialog(page);
    await expect(dialog.dialog).toContainText('loses every role in FaithTech Toronto');
    await dialog.confirm.click();
    await expect(dialog.dialog).toBeHidden();
    await expect(members.row('Ruth Alvarez')).toHaveCount(0);

    await members.remove('Olivia Grant').click();
    await dialog.confirm.click();
    await expect(dialog.refusal).toContainText('Every organization needs an Org Lead.');
    await dialog.cancel.click();
    await expect(members.row('Olivia Grant')).toHaveCount(1);
  });

  test('people who do not lead the org get no Organization section and are refused', async ({
    page,
    api,
  }) => {
    const grace = api.addAccount({ email: 'grace@example.org', roles: ['CityLead'] });
    await api.signInAs(grace, '/o/faithtech-toronto');
    await expect(
      new AppShell(page).primaryNav.getByRole('link', { name: 'Organization' }),
    ).toHaveCount(0);

    const members = new OrgMembersPage(page);
    await members.open();
    await expect(members.forbidden).toBeVisible();
  });

  test('someone who belongs to no org waits to be added, then lands in the org once added', async ({
    page,
    api,
    axe,
  }) => {
    const joel = api.addAccount({ email: 'joel@example.org', name: 'Joel Martins', orgs: [] });
    await api.signInAs(joel);

    const waiting = new WaitingPage(page);
    await expect(page).toHaveURL('/waiting');
    await expect(waiting.heading).toHaveText('Waiting to be added');
    await expect(page.getByText('Hi Joel, your account is ready.')).toBeVisible();
    await expect(waiting.profile).toHaveAttribute('href', '/profile/me');
    await expect(page.getByRole('navigation', { name: 'Primary' })).toHaveCount(0);
    await axe.check();

    joel.orgs = ['faithtech-toronto'];
    await waiting.checkAgain.click();
    await expect(page).toHaveURL('/o/faithtech-toronto');
  });
});
