import { DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  ACCESS_SERVICE,
  INTEGRATIONS_SERVICE,
  RegisteredApp,
  problemDetails,
} from '@faithtech-community/api';
import {
  AlertComponent,
  ButtonComponent,
  CopyFieldComponent,
  DialogComponent,
  FormFieldComponent,
  SecretFieldComponent,
  StackComponent,
  TextFieldComponent,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

const NAME_ERROR = 'Enter a name of 80 characters or fewer.';

/**
 * Register an application (docs/mocks/dialogs/register-application, L2-158): a name in the active
 * org, then its source ID and its secret, shown once and masked once copied. Closes with the result.
 */
@Component({
  selector: 'ft-register-application-dialog',
  imports: [
    ReactiveFormsModule,
    AlertComponent,
    ButtonComponent,
    CopyFieldComponent,
    DialogComponent,
    FormFieldComponent,
    SecretFieldComponent,
    StackComponent,
    TextFieldComponent,
  ],
  templateUrl: './register-application.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterApplicationDialog {
  protected readonly ref = inject<DialogRef<RegisteredApp>>(DialogRef);
  private readonly integrations = inject(INTEGRATIONS_SERVICE);
  private readonly access = inject(ACCESS_SERVICE);

  protected readonly form = inject(NonNullableFormBuilder).group({ name: [''] });
  protected readonly orgName = computed(
    () => this.access.activeOrg()?.branding.displayName ?? 'your org',
  );
  protected readonly busy = signal(false);
  protected readonly nameError = signal('');
  protected readonly failure = signal<string | null>(null);
  protected readonly registered = signal<RegisteredApp | null>(null);
  protected readonly secretCopied = signal(false);

  protected async register(): Promise<void> {
    if (this.busy()) return;
    this.nameError.set('');
    this.failure.set(null);
    const name = this.form.getRawValue().name.trim();
    if (!name || name.length > 80) {
      this.nameError.set(NAME_ERROR);
      return;
    }
    this.busy.set(true);
    try {
      this.registered.set(await firstValueFrom(this.integrations.register(name)));
    } catch (error) {
      const errors = error instanceof HttpErrorResponse ? problemDetails(error)?.errors : null;
      if (errors?.['name']?.length) {
        this.nameError.set(errors['name'][0]);
      } else {
        this.failure.set(
          error instanceof HttpErrorResponse && error.status === 403
            ? 'Only Org Leads and the Portfolio Lead register applications.'
            : 'Nothing was saved. Try again.',
        );
      }
    } finally {
      this.busy.set(false);
    }
  }
}
