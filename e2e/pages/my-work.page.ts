import { Locator, Page } from '@playwright/test';

/** My work at /o/{slug}/my-work (docs/mocks/pages/my-work): items assigned to the caller. */
export class MyWorkPage {
  readonly heading: Locator;
  readonly rows: Locator;
  readonly empty: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.rows = page.getByRole('table', { name: /work assigned to you/i }).locator('tbody tr');
    this.empty = page.getByRole('heading', { name: 'Nothing assigned to you' });
  }

  row(title: string): Locator {
    return this.rows.filter({ has: this.page.getByRole('link', { name: title, exact: true }) });
  }

  /** The cell texts of a row: item, workspace, org and status. */
  cells(title: string): Promise<string[]> {
    return this.row(title)
      .locator('td')
      .evaluateAll((cells) => cells.map((c) => c.textContent?.trim() ?? ''));
  }
}
