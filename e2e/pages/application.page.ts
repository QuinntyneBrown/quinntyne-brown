import { Locator, Page } from '@playwright/test';

/** One application's page with its events, /o/{org}/applications/{id} (docs/mocks/pages/application). */
export class ApplicationPage {
  readonly heading: Locator;
  readonly status: Locator;
  readonly breadcrumb: Locator;
  readonly connection: Locator;
  readonly maskedSecret: Locator;
  readonly rotate: Locator;
  readonly revoke: Locator;
  readonly revokedAlert: Locator;
  readonly entries: Locator;
  readonly count: Locator;
  readonly loadMore: Locator;
  readonly loading: Locator;
  readonly noEvents: Locator;
  readonly error: Locator;
  readonly tryAgain: Locator;
  readonly notFound: Locator;

  constructor(private readonly page: Page) {
    const main = page.getByRole('main');
    this.heading = page.getByRole('heading', { level: 1 });
    this.status = page.locator('ft-page-header ft-badge');
    this.breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
    this.connection = main.getByRole('region', { name: 'Connection' });
    this.maskedSecret = this.connection.getByRole('status');
    this.rotate = main.getByRole('button', { name: 'Rotate secret' });
    this.revoke = main.getByRole('button', { name: 'Revoke', exact: true });
    this.revokedAlert = main.locator('ft-alert').filter({ hasText: 'This application is revoked' });
    this.entries = main.getByRole('list', { name: 'Events' }).getByRole('listitem');
    this.count = main.getByText(/^Showing (all )?\d+ (of \d+ )?events?$/);
    this.loadMore = main.getByRole('button', { name: /^(Load more|Loading…)$/ });
    this.loading = page.getByRole('status', { name: 'Loading events' });
    this.noEvents = page.getByRole('heading', { name: 'No events yet' });
    this.error = page.getByRole('heading', { name: 'We couldn’t load events' });
    this.tryAgain = page.getByRole('button', { name: 'Try again' });
    this.notFound = page.getByRole('heading', { name: 'We couldn’t find that application' });
  }

  async open(id: string, org = 'faithtech-toronto'): Promise<void> {
    await this.page.goto(`/o/${org}/applications/${id}`);
  }

  /** The toggle of the entry whose title includes `title` (a person's name or an event type). */
  entry(title: string): Locator {
    return this.page.getByRole('main').getByRole('button', { name: new RegExp(title) });
  }

  /** The expanded body of the entry, as label → value pairs. */
  async fields(title: string): Promise<Record<string, string>> {
    const id = await this.entry(title).getAttribute('aria-controls');
    const body = this.page.locator(`[id="${id}"]`);
    const pairs = await body
      .locator('dt')
      .evaluateAll((dts) =>
        dts.map((dt) => [
          (dt.textContent ?? '').trim(),
          (dt.nextElementSibling?.textContent ?? '').replace(/\s+/g, ' ').trim(),
        ]),
      );
    return Object.fromEntries(pairs);
  }

  /** The JSON shown for an event type with no view of its own. */
  json(title: string): Locator {
    return this.page
      .getByRole('main')
      .locator('pre')
      .filter({ hasText: title })
      .or(this.page.getByRole('main').locator('pre'));
  }
}
