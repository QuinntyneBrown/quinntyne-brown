// Traces to: L2-168, L2-169, L2-170, L2-171, L2-174, L2-175, L2-176, L2-177, L2-179, L2-180 (docs/detailed-designs/ideas/submit)
import { expect, test } from '../../fixtures/app';
import { AppShell } from '../../pages/app-shell.page';
import { IdeaFormPage } from '../../pages/idea-form.page';
import { SubmitIdeaPage } from '../../pages/submit-idea.page';
import { BREAKPOINTS } from '../../pages/viewport';

test.describe('Submit an idea, signed out', () => {
  // L2-168 AC1, L2-171 AC3, L2-174 AC1: the public page with three steps and an empty preview.
  test('a visitor opens the wizard in the public top bar with three steps', async ({
    page,
    axe,
  }) => {
    const wizard = new SubmitIdeaPage(page);

    await wizard.open();

    await expect(wizard.heading).toBeVisible();
    await expect(wizard.publicSignIn).toBeVisible();
    await expect(wizard.stepHeading).toHaveText('What problem have you noticed?');
    expect(await wizard.railTitles()).toEqual(['The problem', 'Your idea', 'Review']);
    await expect(wizard.railStep('Your idea')).toBeDisabled();
    await expect(wizard.preview).toContainText('Untitled idea');
    await expect(wizard.preview).toContainText('You');
    await expect(wizard.preview).toContainText('Your one-line pitch appears here.');
    await expect(wizard.problemCount).toHaveText('600 characters left');
    await axe.check();
  });

  // L2-168 AC4, L2-171 AC2: below 1024px the label and bar count the same three steps.
  test('on a phone the progress label says 1 of 3', async ({ page, axe }) => {
    await page.setViewportSize(BREAKPOINTS.xs);
    const wizard = new SubmitIdeaPage(page);

    await wizard.open();

    await expect(wizard.progressLabel).toHaveText(/The problem\s*1 of 3/);
    await expect(wizard.preview).toBeHidden();
    await axe.check();
  });

  // L2-169 AC2: the invalid state of the mocks.
  test('Continue with a short problem and no audience shows both problems', async ({
    page,
    axe,
  }) => {
    const wizard = new SubmitIdeaPage(page);
    await wizard.open();

    await wizard.problem.fill('Shelters need volunteers.');
    await wizard.continue.click();

    await expect(wizard.summary).toContainText('Fix 2 problems to continue');
    await expect(wizard.summaryLinks()).toHaveText([
      'Add a little more detail, at least 30 characters',
      'Choose who feels this problem most',
    ]);
    await expect(wizard.summary).toBeFocused();
    expect(await wizard.error(wizard.problem)).toBe(
      'Add a little more detail, at least 30 characters',
    );
    await expect(wizard.problem).toHaveAttribute('aria-invalid', 'true');
    await expect(wizard.problemCount).toHaveText('575 characters left');
    await expect(wizard.stepHeading).toHaveText('What problem have you noticed?');
    await axe.check();
  });

  // L2-168 AC3, L2-170, L2-174 AC2, L2-175, L2-176 AC4, L2-177 AC1/AC3: the whole journey.
  test('a visitor submits ShiftShare and sees the confirmation', async ({ page, api, axe }) => {
    const wizard = new SubmitIdeaPage(page);
    await wizard.open();

    await wizard.answerTheProblem();

    await expect(wizard.stepHeading).toHaveText('What would you build?');
    await expect(wizard.stepHeading).toBeFocused();
    await wizard.continue.click();
    await expect(wizard.summaryLinks()).toHaveText([
      'Name your idea',
      'Add a one-line pitch',
      'Say how it would work',
    ]);
    await wizard.title.fill('ShiftShare');
    await expect(wizard.preview).toContainText('ShiftShare');
    await expect(wizard.titleCount).toHaveText('50 characters left');
    await wizard.pitch.fill(
      'Shift sign-ups for shelter volunteers that fill gaps before they happen.',
    );
    await expect(wizard.preview).toContainText('Shift sign-ups for shelter volunteers');
    await axe.check();
    await wizard.answerYourIdea();

    await expect(wizard.stepHeading).toHaveText('Review and submit');
    await expect(wizard.stepHeading).toBeFocused();
    await expect(wizard.reviewSection('The problem')).toContainText('Nonprofits and shelters');
    await expect(wizard.reviewSection('Your idea')).toContainText('ShiftShare');
    await expect(wizard.reviewSection('How far along is it?')).toHaveCount(0);
    await axe.check();

    // L2-175 AC4: name and email are required for a visitor.
    await wizard.email.fill('hannah.kim@example');
    await wizard.submit.click();
    await expect(wizard.summary).toContainText('Fix 2 problems to submit');
    await expect(wizard.summaryLinks()).toHaveText([
      'Enter your name',
      'Enter an email like name@example.org',
    ]);
    await axe.check();
    expect(api.ideas.submitted).toHaveLength(0);

    await wizard.name.fill('Hannah Kim');
    await wizard.email.fill('hannah.kim@example.org');
    await wizard.submit.click();

    await expect(wizard.success).toBeFocused();
    await expect(wizard.thanks).toHaveText(
      'Thanks, Hannah. ShiftShare was sent. We’ll email you at hannah.kim@example.org if we have questions.',
    );
    await expect(wizard.submitAnother).toBeVisible();
    await axe.check();
    expect(api.ideas.submitted).toEqual([
      expect.objectContaining({
        title: 'ShiftShare',
        audience: 'nonprofits',
        name: 'Hannah Kim',
        email: 'hannah.kim@example.org',
        authorProfileId: null,
        topics: [],
        stage: null,
      }),
    ]);
  });

  // L2-175 AC2, L2-168 AC5: Edit goes back with every answer kept, and Continue returns to Review.
  test('Edit on Review goes back to the step with its answers', async ({ page }) => {
    const wizard = new SubmitIdeaPage(page);
    await wizard.open();
    await wizard.answerTheProblem();
    await wizard.answerYourIdea();

    await wizard.edit('Edit the problem').click();

    await expect(wizard.stepHeading).toHaveText('What problem have you noticed?');
    await expect(wizard.stepHeading).toBeFocused();
    await expect(wizard.problem).toHaveValue(/^Shelter volunteers in Toronto/);
    await expect(wizard.choice(wizard.audience, 'Nonprofits and shelters')).toBeChecked();
    await wizard.continue.click();
    await expect(wizard.title).toHaveValue('ShiftShare');
    await wizard.continue.click();
    await expect(wizard.stepHeading).toHaveText('Review and submit');

    await wizard.railStep('Your idea').click();
    await expect(wizard.stepHeading).toHaveText('What would you build?');
    await wizard.back.click();
    await expect(wizard.stepHeading).toHaveText('What problem have you noticed?');
  });
});

test.describe('Idea delivery', () => {
  // L2-179 AC1, L2-180 AC1: System Admin hears about the idea in the bell and the submitter is confirmed by email.
  test('a System Admin sees the new idea in the bell and opens the Idea form', async ({
    page,
    api,
  }) => {
    const priya = api.addAccount({
      email: 'priya@example.org',
      name: 'Priya Shah',
      roles: ['SystemAdmin'],
    });
    const wizard = new SubmitIdeaPage(page);
    const shell = new AppShell(page);
    await wizard.open();
    await wizard.answerTheProblem();
    await wizard.answerYourIdea();
    await wizard.name.fill('Hannah Kim');
    await wizard.email.fill('hannah.kim@example.org');
    await wizard.submit.click();
    await expect(wizard.success).toBeVisible();

    expect(api.ideas.emails).toEqual([
      { to: 'priya@example.org', subject: 'New app idea: ShiftShare' },
      { to: 'hannah.kim@example.org', subject: 'We got your idea: ShiftShare' },
    ]);
    await api.signInAs(priya, '/o/faithtech-toronto');
    await shell.bell.click();
    await shell.panelNotice('New app idea: ShiftShare').click();

    await expect(page).toHaveURL('/admin/ideas');
    await expect(new IdeaFormPage(page).heading).toBeVisible();
  });
});
