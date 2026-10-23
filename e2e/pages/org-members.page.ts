import { Locator, Page } from '@playwright/test';

/** Organization settings › Members at /o/{slug}/settings/members (docs/mocks/pages/organization/members). */
export class OrgMembersPage {
  readonly heading: Locator;
  readonly addMember: Locator;
  readonly search: Locator;
  readonly rows: Locator;
  readonly forbidden: Locator;
  readonly toast: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.addMember = page.getByRole('button', { name: 'Add member' });
    this.search = page.getByRole('searchbox', { name: 'Search members' });
    this.rows = page.getByRole('table', { name: /^Members of/ }).locator('tbody tr');
    this.forbidden = page.getByRole('heading', { name: 'Only Org Leads manage members' });
    this.toast = page.locator('ft-toast').last();
  }

  async open(slug = 'faithtech-toronto'): Promise<void> {
    await this.page.goto(`/o/${slug}/settings/members`);
  }

  row(name: string): Locator {
    return this.rows.filter({ hasText: name });
  }

  remove(name: string): Locator {
    return this.page.getByRole('button', { name: new RegExp(`^Remove ${name} from`) });
  }
}

/** The add-member dialog (docs/mocks/dialogs/add-member). */
export class AddMemberDialog {
  readonly dialog: Locator;
  readonly email: Locator;
  readonly role: Locator;
  readonly confirm: Locator;
  readonly emailError: Locator;
  readonly invite: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog', { name: /^Add a member to/ });
    this.email = this.dialog.getByLabel('Email');
    this.role = this.dialog.getByLabel('Role');
    this.confirm = this.dialog.getByRole('button', { name: 'Add member' });
    this.emailError = this.dialog.locator('ft-inline-message');
    this.invite = this.dialog.getByRole('link', { name: 'Send an invite' });
  }
}

/** The remove-member confirmation (docs/mocks/dialogs/remove-member). */
export class RemoveMemberDialog {
  readonly dialog: Locator;
  readonly confirm: Locator;
  readonly cancel: Locator;
  readonly refusal: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog', { name: /^Remove .* from/ });
    this.confirm = this.dialog.getByRole('button', { name: /^Remove / });
    this.cancel = this.dialog.getByRole('button', { name: 'Cancel' });
    this.refusal = this.dialog.locator('ft-alert');
  }
}

/** "Waiting to be added" for someone who belongs to no org (docs/mocks/pages/waiting). */
export class WaitingPage {
  readonly heading: Locator;
  readonly profile: Locator;
  readonly signOut: Locator;
  readonly checkAgain: Locator;

  constructor(page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.profile = page.getByRole('link', { name: 'Your profile' });
    this.signOut = page.getByRole('button', { name: 'Sign out' });
    this.checkAgain = page.getByRole('button', { name: 'Check again' });
  }
}
