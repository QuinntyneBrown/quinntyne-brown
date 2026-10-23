import { Locator, Page } from '@playwright/test';

/** The secret field: shown once with Copy secret, then masked to its prefix (design system: secret-field). */
export class SecretField {
  readonly value: Locator;
  readonly copy: Locator;
  readonly masked: Locator;

  constructor(scope: Locator, label: string | RegExp) {
    this.value = scope.getByRole('textbox', { name: label });
    this.copy = scope.getByRole('button', { name: /^(Copy secret|Copied)$/ });
    this.masked = scope.getByRole('status').filter({ hasText: 'Secret copied and hidden' });
  }
}

/** Register application (docs/mocks/dialogs/register-application). */
export class RegisterApplicationDialog {
  readonly dialog: Locator;
  readonly name: Locator;
  readonly submit: Locator;
  readonly cancel: Locator;
  readonly nameError: Locator;
  readonly failed: Locator;
  /** The success state: "{name} is registered". */
  readonly registered: Locator;
  readonly sourceId: Locator;
  readonly copySourceId: Locator;
  readonly secret: SecretField;
  readonly copiedIt: Locator;
  readonly done: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog', {
      name: /^(Register an application|.+ is registered)$/,
    });
    this.name = this.dialog.getByRole('textbox', { name: 'Name' });
    this.submit = this.dialog.getByRole('button', { name: /^(Register|Registering…)$/ });
    this.cancel = this.dialog.getByRole('button', { name: 'Cancel' });
    this.nameError = this.dialog.getByText('Enter a name of 80 characters or fewer.').first();
    this.failed = this.dialog
      .locator('ft-alert')
      .filter({ hasText: 'We couldn’t register the application' });
    this.registered = page.getByRole('dialog', { name: / is registered$/ });
    this.sourceId = this.dialog.getByRole('textbox', { name: 'Source ID' });
    this.copySourceId = this.dialog.getByRole('button', { name: /^(Copy source ID|Copied)$/ });
    this.secret = new SecretField(this.dialog, /^Signing secret for /);
    this.copiedIt = this.dialog.getByRole('button', { name: 'I’ve copied it' });
    this.done = this.dialog.getByRole('button', { name: 'Done' });
  }
}

/** Rotate secret (docs/mocks/dialogs/rotate-secret). */
export class RotateSecretDialog {
  readonly dialog: Locator;
  readonly rotate: Locator;
  readonly cancel: Locator;
  readonly failed: Locator;
  readonly rotated: Locator;
  readonly secret: SecretField;
  readonly previousUntil: Locator;
  readonly copiedIt: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog', { name: /^(Rotate .+’s secret\?|New secret for .+)$/ });
    this.rotate = this.dialog.getByRole('button', { name: /^(Rotate secret|Rotating…)$/ });
    this.cancel = this.dialog.getByRole('button', { name: 'Cancel' });
    this.failed = this.dialog
      .locator('ft-alert')
      .filter({ hasText: 'We couldn’t rotate the secret' });
    this.rotated = page.getByRole('dialog', { name: /^New secret for / });
    this.secret = new SecretField(this.dialog, /^New signing secret for /);
    this.previousUntil = this.dialog.getByText(/^The previous secret works until /);
    this.copiedIt = this.dialog.getByRole('button', { name: /^(I’ve copied it|Done)$/ });
  }
}

/** Revoke application (docs/mocks/dialogs/revoke-application). */
export class RevokeApplicationDialog {
  readonly dialog: Locator;
  readonly revoke: Locator;
  readonly cancel: Locator;
  readonly failed: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog', { name: /^Revoke .+\?$/ });
    this.revoke = this.dialog.getByRole('button', { name: /^(Revoke application|Revoking…)$/ });
    this.cancel = this.dialog.getByRole('button', { name: 'Cancel' });
    this.failed = this.dialog.locator('ft-alert').filter({ hasText: /^We couldn’t revoke / });
  }
}
