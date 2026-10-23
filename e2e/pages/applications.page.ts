import { Locator, Page } from '@playwright/test';

/** Applications, /o/{org}/applications (docs/mocks/pages/applications). */
export class ApplicationsPage {
  readonly heading: Locator;
  readonly register: Locator;
  readonly table: Locator;
  readonly readOnlyNote: Locator;
  readonly loading: Locator;
  readonly empty: Locator;
  readonly error: Locator;
  readonly tryAgain: Locator;
  readonly forbidden: Locator;

  constructor(private readonly page: Page) {
    const main = page.getByRole('main');
    this.heading = page.getByRole('heading', { level: 1 });
    // The header's button; the empty state repeats it.
    this.register = page
      .locator('ft-page-header')
      .getByRole('button', { name: 'Register application' });
    this.table = main.getByRole('table', { name: /^Applications in / });
    this.readOnlyNote = main.getByText(
      'You can read these applications and their events. Org Leads and the Portfolio Lead register, rotate and revoke them.',
    );
    this.loading = page.getByRole('status', { name: 'Loading applications' });
    this.empty = page.getByRole('heading', { name: 'No applications yet' });
    this.error = page.getByRole('heading', { name: 'We couldn’t load applications' });
    this.tryAgain = page.getByRole('button', { name: 'Try again' });
    this.forbidden = page.getByRole('heading', {
      name: 'Applications are for Org Leads and the people who oversee them',
    });
  }

  async open(org = 'faithtech-toronto'): Promise<void> {
    await this.page.goto(`/o/${org}/applications`);
  }

  /** Each body row's cells: Application, Source ID, Status, Last event, Events. */
  async rows(): Promise<string[][]> {
    return this.table
      .getByRole('row')
      .evaluateAll((trs) =>
        trs
          .filter((tr) => !tr.closest('thead'))
          .map((tr) =>
            [...tr.querySelectorAll('th, td')]
              .slice(0, 5)
              .map((c) => (c.textContent ?? '').replace(/\s+/g, ' ').trim()),
          ),
      );
  }

  application(name: string): Locator {
    return this.table.getByRole('link', { name, exact: true });
  }
}
