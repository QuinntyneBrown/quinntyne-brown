// Traces to: L2-181 (docs/detailed-designs/ideas/idea-form)
import { expect, test } from '../../fixtures/app';
import { MockApi } from '../../fixtures/mock-api';
import { AdminUsersPage } from '../../pages/admin-users.page';
import { AppShell } from '../../pages/app-shell.page';
import { ErrorPages } from '../../pages/error-pages.page';
import { IdeaFormPage } from '../../pages/idea-form.page';

const priya = (api: MockApi) =>
  api.addAccount({ email: 'priya@example.org', name: 'Priya Shah', roles: ['SystemAdmin'] });

test.describe('Idea form', () => {
  // AC1: both switches on until someone turns them off; AC2: save, alert, kept after a reload, audited.
  test('a System Admin turns “Who do you need?” off and saves', async ({ page, api, axe }) => {
    const admin = priya(api);
    const form = new IdeaFormPage(page);
    await api.signInAs(admin, '/admin/ideas');

    await expect(form.heading).toBeVisible();
    await expect(form.breadcrumb).toContainText('Admin');
    await expect(form.hint).toBeVisible();
    await expect(form.askStage).toBeChecked();
    await expect(form.askPeople).toBeChecked();
    await axe.check();

    await form.askPeople.click();
    await form.save.click();

    await expect(form.saved).toBeVisible();
    await axe.check();
    expect(api.ideas.formChanges).toEqual([
      {
        actorId: admin.profileId,
        before: { askStage: true, askPeople: true },
        after: { askStage: true, askPeople: false },
      },
    ]);
    await page.reload();
    await expect(form.askStage).toBeChecked();
    await expect(form.askPeople).not.toBeChecked();
  });

  // AC3: the Admin area's tabs reach the Idea form.
  test('the Admin tabs lead to the Idea form', async ({ page, api }) => {
    const users = new AdminUsersPage(page);
    const form = new IdeaFormPage(page);
    await api.signInAs(priya(api), '/admin/users');

    await form.tab('Idea form').click();

    await expect(page).toHaveURL('/admin/ideas');
    await expect(form.heading).toBeVisible();
    await expect(form.tab('Idea form')).toHaveAttribute('aria-current', 'page');
    await form.tab('Users').click();
    await expect(users.auditLogTab).toBeVisible();
  });

  // AC3: anyone else is told the page does not exist.
  test('a City Lead gets the not-found page', async ({ page, api }) => {
    const lead = api.addAccount({ email: 'grace@example.org', roles: ['CityLead'] });
    await api.signInAs(lead, '/o/faithtech-toronto');

    await new IdeaFormPage(page).open();

    await expect(new ErrorPages(page).notFound).toBeVisible();
  });

  // AC5: a failed save shows the error toast and keeps the switches as they were saved.
  test('a failed save shows the error toast', async ({ page, api }) => {
    const form = new IdeaFormPage(page);
    const shell = new AppShell(page);
    api.on('PUT', '/api/admin/ideas/settings', (route) => route.fulfill({ status: 500 }));
    await api.signInAs(priya(api), '/admin/ideas');

    await form.askStage.click();
    await form.save.click();

    await expect(shell.toasts.filter({ hasText: 'Idea form not saved' })).toBeVisible();
    await expect(form.saved).toBeHidden();
    expect(api.ideas.askStage).toBe(true);
  });
});
