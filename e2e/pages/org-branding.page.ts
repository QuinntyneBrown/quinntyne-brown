import { Locator, Page } from '@playwright/test';

/** Organization settings › Branding at /o/{slug}/settings/branding (docs/mocks/pages/organization/branding). */
export class OrgBrandingPage {
  readonly heading: Locator;
  readonly displayName: Locator;
  readonly accent: Locator;
  readonly ratio: Locator;
  readonly logo: Locator;
  readonly removeLogo: Locator;
  readonly preview: Locator;
  readonly save: Locator;
  readonly toast: Locator;
  readonly forbidden: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.displayName = page.getByRole('textbox', { name: 'Display name' });
    this.accent = page.getByRole('textbox', { name: /^Accent colour/ });
    this.ratio = page.locator('.colour-field__ratio');
    this.logo = page.getByLabel(/^(Upload|Replace) logo/);
    this.removeLogo = page.getByRole('button', { name: 'Remove logo' });
    this.preview = page.locator('ft-org-band');
    this.save = page.getByRole('button', { name: 'Save changes' });
    this.toast = page.locator('ft-toast').last();
    this.forbidden = page.getByRole('heading', { name: 'Only Org Leads change branding' });
  }

  async open(slug = 'faithtech-toronto'): Promise<void> {
    await this.page.goto(`/o/${slug}/settings/branding`);
  }

  /** The inline error under the accent field, read through its aria-describedby. */
  async accentError(): Promise<string> {
    const ids = (await this.accent.getAttribute('aria-describedby')) ?? '';
    const texts = await Promise.all(
      ids
        .split(/\s+/)
        .filter(Boolean)
        .map((id) => this.page.locator(`[id="${id}"]`).innerText()),
    );
    return texts.join(' ');
  }
}
