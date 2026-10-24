import { Locator, Page } from '@playwright/test';

/** The Idea form, /admin/ideas (docs/mocks/pages/idea-settings). */
export class IdeaFormPage {
  readonly heading: Locator;
  readonly breadcrumb: Locator;
  readonly adminTabs: Locator;
  readonly askStage: Locator;
  readonly askPeople: Locator;
  readonly hint: Locator;
  readonly save: Locator;
  readonly saved: Locator;

  constructor(private readonly page: Page) {
    const main = page.getByRole('main');
    this.heading = page.getByRole('heading', { level: 1, name: 'Idea form' });
    this.breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
    this.adminTabs = page.getByRole('navigation', { name: 'Admin sections' });
    this.askStage = main.getByRole('switch', { name: 'Ask “How far along is it?”' });
    this.askPeople = main.getByRole('switch', { name: 'Ask “Who do you need?”' });
    this.hint = main.getByText(
      'Signed-in members answer the steps you turn on. Visitors who aren’t signed in always get the three required steps.',
    );
    this.save = main.getByRole('button', { name: 'Save' });
    this.saved = main.getByRole('status').filter({ hasText: 'Idea form saved' });
  }

  async open(): Promise<void> {
    await this.page.goto('/admin/ideas');
  }

  tab(name: string): Locator {
    return this.adminTabs.getByRole('link', { name });
  }
}
