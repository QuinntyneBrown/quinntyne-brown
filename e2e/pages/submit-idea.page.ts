import { Locator, Page } from '@playwright/test';

/** Submit an app idea, /ideas/new (docs/mocks/pages/submit-idea), signed out or signed in. */
export class SubmitIdeaPage {
  readonly heading: Locator;
  /** The step card's heading, which takes focus on every step change. */
  readonly stepHeading: Locator;
  readonly rail: Locator;
  readonly railSteps: Locator;
  /** "{title} N of M" with the bar, shown below 1024px. */
  readonly progressLabel: Locator;
  readonly summary: Locator;
  readonly continue: Locator;
  readonly back: Locator;
  readonly skip: Locator;
  readonly submit: Locator;
  readonly tryAgain: Locator;
  readonly problem: Locator;
  readonly problemCount: Locator;
  readonly audience: Locator;
  readonly title: Locator;
  readonly titleCount: Locator;
  readonly pitch: Locator;
  readonly solution: Locator;
  readonly stage: Locator;
  readonly platform: Locator;
  readonly topics: Locator;
  readonly skills: Locator;
  readonly involvement: Locator;
  readonly commitment: Locator;
  readonly name: Locator;
  readonly email: Locator;
  readonly submittingAs: Locator;
  readonly failure: Locator;
  readonly preview: Locator;
  readonly success: Locator;
  readonly thanks: Locator;
  readonly submitAnother: Locator;
  readonly publicSignIn: Locator;

  constructor(private readonly page: Page) {
    const main = page.getByRole('main');
    this.heading = page.getByRole('heading', { level: 1, name: 'Submit an app idea' });
    this.stepHeading = main.getByRole('heading', { level: 2 }).first();
    this.rail = main.getByRole('navigation', { name: 'Idea submission steps' });
    this.railSteps = this.rail.getByRole('listitem');
    this.progressLabel = this.rail.locator('.progress__label');
    this.summary = main.getByRole('alert').filter({ hasText: /^Fix \d+ problems? to/ });
    this.continue = main.getByRole('button', { name: 'Continue' });
    this.back = main.getByRole('button', { name: 'Back', exact: true });
    this.skip = main.getByRole('button', { name: 'Skip' });
    this.submit = main.getByRole('button', { name: /^(Submit idea|Submitting…)$/ });
    this.tryAgain = main.getByRole('button', { name: 'Try again' });
    this.problem = main.getByLabel('Describe the problem');
    this.problemCount = this.countOf('Describe the problem');
    this.audience = main.getByRole('radiogroup', { name: 'Who feels this most?' });
    this.title = main.getByLabel('Name your idea');
    this.titleCount = this.countOf('Name your idea');
    this.pitch = main.getByLabel('One-line pitch');
    this.solution = main.getByLabel('How would it work?');
    this.stage = main.getByRole('radiogroup', { name: 'Stage' });
    this.platform = main.getByRole('radiogroup', { name: 'Where would it run?' });
    this.topics = main.getByRole('group', { name: 'Topics (optional)' });
    this.skills = main.getByRole('group', { name: 'Which skills would get this moving?' });
    this.involvement = main.getByRole('radiogroup', { name: 'How do you want to be involved?' });
    this.commitment = main.getByRole('radiogroup', { name: 'How much time can you give?' });
    this.name = main.getByLabel('Your name');
    this.email = main.getByLabel('Email', { exact: true });
    this.submittingAs = main.getByText(/Submitting as /);
    this.failure = main.getByRole('alert').filter({ hasText: 'Idea not submitted' });
    this.preview = main.getByRole('article', { name: 'Idea preview' });
    this.success = page.getByRole('heading', { level: 1, name: 'Your idea is in' });
    this.thanks = main.getByText(/Thanks, .* was sent\./);
    this.submitAnother = main
      .getByRole('link', { name: 'Submit another idea' })
      .or(main.getByRole('button', { name: 'Submit another idea' }));
    this.publicSignIn = page.getByRole('banner').getByRole('link', { name: 'Sign in' });
  }

  /** A field's "N characters left" count. */
  private countOf(label: string): Locator {
    return this.page
      .locator('ft-form-field')
      .filter({ has: this.page.getByLabel(label) })
      .locator('.field__count');
  }

  async open(): Promise<void> {
    await this.page.goto('/ideas/new');
  }

  /** The rail's step titles, without the visually hidden "(done)". */
  async railTitles(): Promise<string[]> {
    return this.railSteps
      .locator('.title')
      .evaluateAll((titles) => titles.map((t) => (t.firstChild?.textContent ?? '').trim()));
  }

  railStep(title: string): Locator {
    return this.rail.getByRole('button', { name: new RegExp(`^\\d* ?${title}`) });
  }

  choice(group: Locator, label: string): Locator {
    return group.getByRole('radio', { name: label, exact: true });
  }

  chip(group: Locator, label: string): Locator {
    return group.getByRole('button', { name: label, exact: true });
  }

  summaryLinks(): Locator {
    return this.summary.getByRole('link');
  }

  reviewSection(heading: string): Locator {
    return this.page.getByRole('region', { name: heading });
  }

  edit(label: string): Locator {
    return this.page.getByRole('button', { name: label });
  }

  /** The inline error under a field, read through the field's aria-describedby. */
  error(field: Locator): Promise<string> {
    return field.evaluate((el) =>
      (el.getAttribute('aria-describedby') ?? '')
        .split(' ')
        .map((id) => document.getElementById(id))
        .filter((n) => n?.classList.contains('error') || n?.tagName === 'FT-INLINE-MESSAGE')
        .map((n) => n!.textContent!.trim())
        .join(' '),
    );
  }

  /** Answers The problem and Your idea with ShiftShare from the mocks. */
  async answerTheProblem(): Promise<void> {
    await this.problem.fill(
      'Shelter volunteers in Toronto still coordinate shifts over group texts, so nights go uncovered and coordinators burn out.',
    );
    await this.choice(this.audience, 'Nonprofits and shelters').check();
    await this.continue.click();
  }

  async answerYourIdea(): Promise<void> {
    await this.title.fill('ShiftShare');
    await this.pitch.fill(
      'Shift sign-ups for shelter volunteers that fill gaps before they happen.',
    );
    await this.solution.fill(
      'Coordinators post open shifts. Volunteers get a text, tap to claim, and see who else is on.\nUncovered shifts ping the backup list 24 hours ahead.',
    );
    await this.continue.click();
  }
}
