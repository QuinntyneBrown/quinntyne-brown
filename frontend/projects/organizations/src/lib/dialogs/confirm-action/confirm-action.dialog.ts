import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { problemDetails } from '@faithtech-community/api';
import { AlertComponent, ButtonComponent, DialogComponent } from '@faithtech-community/components';

export interface ConfirmActionData {
  heading: string;
  description?: string;
  /** What the action does, under the heading. */
  text: string;
  confirmLabel: string;
  /** The alert heading when the server refuses. */
  refusedHeading: string;
  danger?: boolean;
  action: () => Promise<unknown>;
}

/**
 * Confirms a portfolio action, such as archiving an org, removing a catalogue role or revoking
 * a token (docs/mocks/dialogs/remove-catalogue-role, revoke-token). Closes with true once done;
 * a refusal stays in the dialog with the server's reason and, for a held role, its holders.
 */
@Component({
  selector: 'ft-confirm-action-dialog',
  imports: [AlertComponent, ButtonComponent, DialogComponent],
  templateUrl: './confirm-action.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmActionDialog {
  protected readonly ref = inject<DialogRef<boolean>>(DialogRef);
  protected readonly data = inject<ConfirmActionData>(DIALOG_DATA);
  protected readonly busy = signal(false);
  protected readonly refusal = signal<string | null>(null);
  protected readonly holders = signal<string[]>([]);

  protected async confirm(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.refusal.set(null);
    try {
      await this.data.action();
      this.ref.close(true);
    } catch (error) {
      const problem = problemDetails(error) as { detail?: string; holders?: HolderRef[] } | null;
      const refused =
        error instanceof HttpErrorResponse && error.status >= 400 && error.status < 500;
      this.refusal.set(
        refused
          ? (problem?.detail ?? 'You can’t do that.')
          : 'We couldn’t reach Quinntyne Brown. Nothing was changed — try again.',
      );
      this.holders.set((problem?.holders ?? []).map((h) => `${h.name}, ${h.org.name}`));
    } finally {
      this.busy.set(false);
    }
  }
}

interface HolderRef {
  name: string;
  org: { name: string };
}
