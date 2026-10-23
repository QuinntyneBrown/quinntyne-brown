import { Locator, Page } from '@playwright/test';

/** The org switcher in the top bar (design system: components/org-switcher), or the single org's name. */
export class OrgSwitcher {
  /** The menu button, named "{org}, switch organization"; absent for someone who covers one org. */
  readonly button: Locator;
  readonly menu: Locator;
  /** The single org's mark and name, shown as text when there is nothing to switch to. */
  readonly currentOrg: Locator;

  constructor(private readonly page: Page) {
    this.button = page.locator('header').getByRole('button', { name: /switch organization$/ });
    this.menu = page.getByRole('menu', { name: /organization/i });
    this.currentOrg = page.locator('header .org-switcher__current');
  }

  /** The org, or "All orgs", as an option of the open menu. */
  option(name: string): Locator {
    return this.menu.getByRole('menuitemradio', { name: new RegExp(`^${name}`) });
  }

  async open(): Promise<void> {
    await this.button.click();
  }

  async switchTo(name: string): Promise<void> {
    await this.open();
    await this.option(name).click();
  }
}
