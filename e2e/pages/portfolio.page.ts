import { Locator, Page } from '@playwright/test';

/**
 * Portfolio administration under /o/{slug}/portfolio (docs/mocks/pages/organizations, org-types,
 * org-type, cross-org-roles, agents): one page object for its tabs, which share a header.
 */
export class PortfolioPage {
  readonly heading: Locator;
  readonly tabs: Locator;
  readonly rows: Locator;
  readonly toast: Locator;
  readonly forbidden: Locator;
  readonly newOrganization: Locator;
  readonly newOrgType: Locator;
  readonly archivedTab: Locator;
  readonly activeTab: Locator;
  readonly addRole: Locator;
  readonly roles: Locator;
  readonly saveFeatures: Locator;
  readonly newAgent: Locator;
  readonly tokens: Locator;

  constructor(private readonly page: Page) {
    const main = page.getByRole('main');
    this.heading = main.getByRole('heading', { level: 1 });
    this.tabs = main.getByRole('navigation', { name: 'Portfolio sections' });
    this.rows = main.getByRole('table').locator('tbody tr');
    this.toast = page.locator('ft-toast').last();
    this.forbidden = main.getByRole('heading', {
      name: 'Only the Portfolio Lead manages the portfolio',
    });
    this.newOrganization = main.getByRole('button', { name: 'New organization' });
    this.newOrgType = main.getByRole('button', { name: 'New Org Type' });
    this.archivedTab = main.getByRole('link', { name: /^Archived/ });
    this.activeTab = main.getByRole('link', { name: /^Active/ });
    this.addRole = main.getByRole('button', { name: 'Add role' });
    this.roles = main.getByRole('list', { name: 'Roles' }).getByRole('listitem');
    this.saveFeatures = main.getByRole('button', { name: 'Save features' });
    this.newAgent = main.getByRole('button', { name: 'New agent' });
    this.tokens = main.getByRole('table', { name: /^Tokens of/ }).locator('tbody tr');
  }

  async open(
    section: 'organizations' | 'org-types' | 'cross-org-roles' | 'agents',
    slug = 'faithtech-toronto',
  ) {
    await this.page.goto(`/o/${slug}/portfolio/${section}`);
  }

  row(text: string): Locator {
    return this.rows.filter({ hasText: text });
  }

  link(name: string): Locator {
    return this.page.getByRole('main').getByRole('link', { name, exact: true });
  }

  button(name: string | RegExp): Locator {
    return this.page.getByRole('main').getByRole('button', { name });
  }

  role(name: string): Locator {
    return this.roles.filter({ hasText: name });
  }

  feature(name: string): Locator {
    return this.page.getByRole('main').getByRole('switch', { name });
  }
}

/** A portfolio dialog (create org, Org Type, role, assign, agent, token, remove), by its heading. */
export class PortfolioDialog {
  readonly dialog: Locator;
  readonly cancel: Locator;
  readonly refusal: Locator;
  readonly token: Locator;
  readonly done: Locator;

  constructor(page: Page, heading: string | RegExp) {
    this.dialog = page.getByRole('dialog', { name: heading });
    this.cancel = this.dialog.getByRole('button', { name: 'Cancel' });
    this.refusal = this.dialog.locator('ft-alert');
    this.token = this.dialog.getByRole('textbox', { name: 'Token' });
    this.done = this.dialog.getByRole('button', { name: 'Done' });
  }

  field(label: string | RegExp): Locator {
    return this.dialog
      .getByRole('textbox', { name: label })
      .or(this.dialog.getByRole('combobox', { name: label }));
  }

  checkbox(name: string | RegExp): Locator {
    return this.dialog.getByRole('checkbox', { name });
  }

  radio(name: string | RegExp): Locator {
    return this.dialog.getByRole('radio', { name });
  }

  button(name: string | RegExp): Locator {
    return this.dialog.getByRole('button', { name });
  }

  /** The inline error of a field, read through its aria-describedby. */
  async errorOf(label: string | RegExp): Promise<string> {
    const ids = (await this.field(label).getAttribute('aria-describedby')) ?? '';
    const texts = await Promise.all(
      ids
        .split(/\s+/)
        .filter(Boolean)
        .map((id) => this.dialog.page().locator(`[id="${id}"]`).innerText()),
    );
    return texts.join(' ');
  }
}
