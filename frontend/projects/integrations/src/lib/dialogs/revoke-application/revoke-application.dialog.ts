import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { INTEGRATIONS_SERVICE, IntegrationApp } from '@faithtech-community/api';
import { AlertComponent, ButtonComponent, DialogComponent } from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

/**
 * Revoke an application (docs/mocks/dialogs/revoke-application, L2-160): permanent, so it is
 * confirmed; its events stay. Closes with the revoked application.
 */
@Component({
  selector: 'ft-revoke-application-dialog',
  imports: [AlertComponent, ButtonComponent, DialogComponent],
  templateUrl: './revoke-application.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RevokeApplicationDialog {
  protected readonly ref = inject<DialogRef<IntegrationApp>>(DialogRef);
  protected readonly app = inject<IntegrationApp>(DIALOG_DATA);
  private readonly integrations = inject(INTEGRATIONS_SERVICE);

  protected readonly busy = signal(false);
  protected readonly failed = signal(false);

  protected async revoke(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.failed.set(false);
    try {
      this.ref.close(await firstValueFrom(this.integrations.revoke(this.app.id)));
    } catch {
      this.failed.set(true);
    } finally {
      this.busy.set(false);
    }
  }
}
