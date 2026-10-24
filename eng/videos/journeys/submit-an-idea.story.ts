import { expect, test } from '../../../e2e/fixtures/app';
import { AppShell } from '../../../e2e/pages/app-shell.page';
import { IdeaFormPage } from '../../../e2e/pages/idea-form.page';
import { SubmitIdeaPage } from '../../../e2e/pages/submit-idea.page';
import { Presenter } from '../presenter';

// Journey: submit an app idea (docs/detailed-designs/ideas, L2-168 to L2-181).
test('submit-an-idea', async ({ page, api }) => {
  const show = await Presenter.start(page, 'submit-an-idea');
  const wizard = new SubmitIdeaPage(page);
  const form = new IdeaFormPage(page);
  const hannah = api.addAccount({
    email: 'hannah.kim@example.org',
    name: 'Hannah Kim',
    roles: ['CommunicationsLead'],
  });
  const priya = api.addAccount({
    email: 'priya@example.org',
    name: 'Priya Shah',
    roles: ['SystemAdmin'],
  });

  await show.card(
    'opening',
    'opening',
    ['Submit an app idea', 'Recorded against a local fake API · synthetic people'],
    () => wizard.open(),
  );

  await show.step(
    'the-problem',
    async () => {
      await expect(wizard.stepHeading).toHaveText('What problem have you noticed?');
      await wizard.problem.fill(
        'Shelter volunteers in Toronto still coordinate shifts over group texts, so nights go uncovered and coordinators burn out.',
      );
      await wizard.choice(wizard.audience, 'Nonprofits and shelters').check();
    },
    { poster: true },
  );

  await show.step('your-idea', async () => {
    await wizard.continue.click();
    await wizard.title.fill('ShiftShare');
    await wizard.pitch.fill('Shift sign-ups for shelter volunteers that fill gaps before they happen.');
    await wizard.solution.fill(
      'Coordinators post open shifts. Volunteers get a text, tap to claim, and see who else is on.',
    );
  });

  await show.step('review', async () => {
    await wizard.continue.click();
    await wizard.name.fill('Hannah Kim');
    await wizard.email.fill('hannah.kim@example.org');
    await wizard.submit.click();
    await expect(wizard.success).toBeVisible();
  });

  await show.step('signed-in', async () => {
    await api.signInAs(hannah, '/ideas/new');
    await wizard.answerTheProblem();
    await wizard.answerYourIdea();
    await expect(wizard.stepHeading).toHaveText('How far along is it?');
    await wizard.choice(wizard.stage, 'Sketches or notes').check();
    await wizard.chip(wizard.topics, 'Volunteering').click();
  });

  await show.step('idea-form', async () => {
    await api.signInAs(priya, '/admin/ideas');
    await expect(form.askPeople).toBeChecked();
    await new AppShell(page).bell.click();
  });

  await show.card('closing', 'closing', [
    'Three steps for anyone',
    'Two optional steps for members',
    'Every idea reaches System Admin',
  ]);
  await show.finish();
});
