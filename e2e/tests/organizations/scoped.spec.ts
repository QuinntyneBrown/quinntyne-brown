// Traces to: L2-150, L2-151, L2-152, L2-153
import { expect, test } from '../../fixtures/app';
import { AnnouncementsPage } from '../../pages/announcements.page';
import { AppShell } from '../../pages/app-shell.page';
import { AuditLogPage } from '../../pages/audit-log.page';
import { ComposeAnnouncementPage } from '../../pages/compose-announcement.page';
import { ReportsPage } from '../../pages/reports.page';

test.describe('Org-scoped announcements, reports, notifications and audit', () => {
  test('a Portfolio Lead sends to everyone in the portfolio and the list labels it Portfolio', async ({
    page,
    api,
    axe,
  }) => {
    const quinn = api.addAccount({
      email: 'quinn@example.org',
      name: 'Quinntyne Brown',
      portfolioLead: true,
    });
    const compose = new ComposeAnnouncementPage(page);
    await api.signInAs(quinn, '/announcements/new');

    await compose.chooseAudience('Everyone in the portfolio');
    await compose.write('Portfolio retreat', 'Every org is invited.');
    await axe.check();
    await compose.send.click();
    await expect(compose.sent).toContainText('Sent to');

    const list = new AnnouncementsPage(page);
    await list.goto();
    await expect(list.orgLabel('Portfolio retreat')).toHaveText(/Portfolio/);
    await axe.check();
  });

  test('a Communications Lead is not offered the portfolio audience', async ({ page, api }) => {
    const hannah = api.addAccount({ email: 'hannah@example.org', roles: ['CommunicationsLead'] });
    const compose = new ComposeAnnouncementPage(page);
    await api.signInAs(hannah, '/announcements/new');

    await expect(compose.heading).toBeVisible();
    await expect(compose.audience('Everyone in the portfolio')).toHaveCount(0);
  });

  test('Staff covering two cities filter reports by organization', async ({ page, api, axe }) => {
    api.organizations.add({ slug: 'faithtech-ottawa', name: 'FaithTech Ottawa' });
    const staff = api.addAccount({ email: 'staff@example.org', roles: ['Staff'] });
    const reports = new ReportsPage(page);
    await api.signInAs(staff, '/reports');

    await expect(reports.organization).toBeVisible();
    await axe.check();
    await reports.organization.selectOption({ label: 'FaithTech Ottawa' });
    await reports.apply.click();

    await expect(page).toHaveURL(/org=faithtech-ottawa/);
  });

  test('a person in two orgs sees which org a notification comes from', async ({
    page,
    api,
    axe,
  }) => {
    const pat = api.addAccount({
      email: 'pat@example.org',
      name: 'Pat Okafor',
      roles: ['Volunteer'],
      orgs: ['faithtech-toronto', 'shelfie'],
    });
    api.addNotification({
      recipientId: pat.profileId,
      title: 'Sprint 4 starts Monday',
      organization: { id: 'org-shelfie', slug: 'shelfie', name: 'Shelfie' },
    });
    const shell = new AppShell(page);
    await api.signInAs(pat, '/');

    await shell.bell.click();
    await expect(shell.panelNotice('Sprint 4 starts Monday')).toBeVisible();
    await expect(shell.panelOrgLabels).toHaveText(['Shelfie']);
    await axe.check();
  });

  test('the audit log shows which org each entry belongs to', async ({ page, api, axe }) => {
    const admin = api.addAccount({ email: 'admin@example.org', roles: ['SystemAdmin'] });
    api.addAuditEntry({ action: 'role.granted', summary: 'Granted Volunteer to Ruth Alvarez' });
    const audit = new AuditLogPage(page);
    await api.signInAs(admin, '/admin/audit-log');

    await expect(audit.rows).toHaveCount(1);
    expect(await audit.columns()).toContain('Org');
    await axe.check();
  });
});
