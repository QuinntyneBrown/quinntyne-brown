import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  INTEGRATIONS_SERVICE,
  IntegrationApp,
  RotatedSecret,
  problemDetails,
} from '@faithtech-community/api';
import {
  AlertComponent,
  ButtonComponent,
  DialogComponent,
  SecretFieldComponent,
  StackComponent,
  formatTimestamp,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

/** How long the secret rotated out keeps working (ADR 0042). */
const OVERLAP_MS = 24 * 60 * 60 * 1000;

/**
 * Rotate an application's secret (docs/mocks/dialogs/rotate-secret, L2-159): the current secret
 * keeps working for 24 hours; the new one is shown once. Closes with the result.
 */
@Component({
  selector: 'ft-rotate-secret-dialog',
  imports: [AlertComponent, ButtonComponent, DialogComponent, SecretFieldComponent, StackComponent],
  templateUrl: './rotate-secret.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RotateSecretDialog {
  protected readonly ref = inject<DialogRef<RotatedSecret>>(DialogRef);
  protected readonly app = inject<IntegrationApp>(DIALOG_DATA);
  private readonly integrations = inject(INTEGRATIONS_SERVICE);

  protected readonly busy = signal(false);
  protected readonly failure = signal<string | null>(null);
  protected readonly rotated = signal<RotatedSecret | null>(null);
  protected readonly secretCopied = signal(false);
  /** When the current secret would stop working if rotated now. */
  protected readonly until = computed(() =>
    formatTimestamp(new Date(Date.now() + OVERLAP_MS).toISOString()),
  );
  protected readonly previousUntil = computed(() => {
    const rotated = this.rotated();
    return rotated ? formatTimestamp(rotated.previousSecretExpiresAt) : '';
  });

  protected async rotate(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.failure.set(null);
    try {
      this.rotated.set(await firstValueFrom(this.integrations.rotate(this.app.id)));
    } catch (error) {
      this.failure.set(
        error instanceof HttpErrorResponse && error.status === 409
          ? (problemDetails(error)?.detail ?? 'This application is revoked.')
          : 'The current secret still works. Try again.',
      );
    } finally {
      this.busy.set(false);
    }
  }
}
