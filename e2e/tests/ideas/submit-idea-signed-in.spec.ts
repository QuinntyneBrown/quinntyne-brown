// Traces to: L2-168, L2-171, L2-172, L2-173, L2-174, L2-175, L2-177 (docs/detailed-designs/ideas/submit)
import { expect, test } from '../../fixtures/app';
import { MockApi } from '../../fixtures/mock-api';
import { AppShell } from '../../pages/app-shell.page';
import { SubmitIdeaPage } from '../../pages/submit-idea.page';
import { BREAKPOINTS } from '../../pages/viewport';

const hannah = (api: MockApi) =>
  api.addAccount({
    email: 'hannah.kim@example.org',
    name: 'Hannah Kim',
    roles: ['CommunicationsLead'],
  });

test.describe('Submit an idea, signed in', () => {
  // L2-168 AC2, L2-171 AC1/AC2, L2-174 AC3: the app shell, five steps and the member's name in the preview.
  test('a member gets the app shell, five steps and their name in the preview', async ({
    page,
    api,
    axe,
  }) => {
    const wizard = new SubmitIdeaPage(page);
    await api.signInAs(hannah(api), '/ideas/new');

    await expect(new AppShell(page).bell).toBeVisible();
    await expect(wizard.publicSignIn).toHaveCount(0);
    expect(await wizard.railTitles()).toEqual([
      'The problem',
      'Your idea',
      'How far along is it?',
      'Who do you need?',
      'Review',
    ]);
    await expect(wizard.railStep('How far along is it?')).toContainText('Optional');
    await expect(wizard.preview).toContainText('Hannah Kim');
    await axe.check();
  });

  // L2-172, L2-173, L2-175 AC1/AC5, L2-177 AC2: the whole signed-in journey.
  test('a member answers both optional steps and submits under their own name', async ({
    page,
    api,
    axe,
  }) => {
    const wizard = new SubmitIdeaPage(page);
    await api.signInAs(hannah(api), '/ideas/new');
    await wizard.answerTheProblem();
    await wizard.answerYourIdea();

    await expect(wizard.stepHeading).toHaveText('How far along is it?');
    await expect(wizard.stepHeading).toBeFocused();
    await wizard.choice(wizard.stage, 'Sketches or notes').check();
    await wizard.choice(wizard.platform, 'Both').check();
    for (const topic of ['Community', 'Faith', 'Housing', 'Mental health', 'Volunteering']) {
      await wizard.chip(wizard.topics, topic).click();
    }
    await expect(wizard.chip(wizard.topics, 'Faith')).toHaveAttribute('aria-pressed', 'true');
    await expect(wizard.chip(wizard.topics, 'AI')).toBeDisabled();
    await axe.check();
    await wizard.continue.click();

    await expect(wizard.stepHeading).toHaveText('Who do you need?');
    for (const skill of ['Product Engineer', 'Designer', 'Domain expert']) {
      await wizard.chip(wizard.skills, skill).click();
    }
    await wizard.choice(wizard.involvement, 'I want to lead it').check();
    await wizard.choice(wizard.commitment, 'A few hours a week').check();
    await axe.check();
    await wizard.continue.click();

    await expect(wizard.stepHeading).toHaveText('Review and submit');
    await expect(wizard.reviewSection('How far along is it?')).toContainText('Sketches or notes');
    await expect(wizard.reviewSection('How far along is it?')).toContainText('Mental health');
    await expect(wizard.reviewSection('Who do you need?')).toContainText('A few hours a week');
    await expect(wizard.submittingAs).toHaveText(
      'Submitting as Hannah Kim, hannah.kim@example.org',
    );
    await expect(wizard.name).toHaveCount(0);
    await axe.check();
    await wizard.submit.click();

    await expect(wizard.thanks).toHaveText(
      'Thanks, Hannah. ShiftShare was sent. We’ll email you at hannah.kim@example.org if we have questions.',
    );
    expect(api.ideas.submitted).toEqual([
      expect.objectContaining({
        authorProfileId: 'profile-1',
        name: 'Hannah Kim',
        stage: 'sketches',
        platform: 'both',
        topics: ['Community', 'Faith', 'Housing', 'Mental health', 'Volunteering'],
        skills: ['Product Engineer', 'Designer', 'Domain expert'],
        involvement: 'lead',
        commitment: 'weekly',
      }),
    ]);
  });

  // L2-172 AC3: Skip clears the step and Review says so.
  test('Skip clears the step and Review shows it as skipped', async ({ page, api }) => {
    const wizard = new SubmitIdeaPage(page);
    await api.signInAs(hannah(api), '/ideas/new');
    await wizard.answerTheProblem();
    await wizard.answerYourIdea();
    await wizard.choice(wizard.stage, 'Working prototype').check();

    await wizard.skip.click();

    await expect(wizard.stepHeading).toHaveText('Who do you need?');
    await wizard.skip.click();
    await expect(wizard.reviewSection('How far along is it?')).toContainText('Skipped');
    await expect(wizard.reviewSection('Who do you need?')).toContainText('Skipped');
    await wizard.submit.click();
    await expect(wizard.success).toBeVisible();
    expect(api.ideas.submitted[0]).toEqual(
      expect.objectContaining({ stage: null, topics: [], involvement: null }),
    );
  });

  // L2-171 AC2/AC4: the steps follow the Idea form; the label and the bar count the same steps.
  for (const [askStage, askPeople, titles] of [
    [false, true, ['The problem', 'Your idea', 'Who do you need?', 'Review']],
    [true, false, ['The problem', 'Your idea', 'How far along is it?', 'Review']],
    [false, false, ['The problem', 'Your idea', 'Review']],
  ] as const) {
    test(`with stage ${askStage ? 'on' : 'off'} and people ${askPeople ? 'on' : 'off'} the member gets ${titles.length} steps`, async ({
      page,
      api,
    }) => {
      api.ideas.askStage = askStage;
      api.ideas.askPeople = askPeople;
      const wizard = new SubmitIdeaPage(page);
      await api.signInAs(hannah(api), '/ideas/new');

      expect(await wizard.railTitles()).toEqual([...titles]);
      await page.setViewportSize(BREAKPOINTS.xs);
      await wizard.answerTheProblem();
      await wizard.answerYourIdea();
      await expect(wizard.progressLabel).toHaveText(
        new RegExp(`${titles[2].replace('?', '\\?')}\\s*3 of ${titles.length}`),
      );
    });
  }
});
