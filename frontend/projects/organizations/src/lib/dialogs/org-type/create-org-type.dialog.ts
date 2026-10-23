import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { OrgTypeDto, PORTFOLIO_SERVICE } from '@faithtech-community/api';
import {
  AlertComponent,
  ButtonComponent,
  DialogComponent,
  FormFieldComponent,
  StackComponent,
  TextFieldComponent,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

import { fieldErrors } from '../create-organization';

/** New Org Type (docs/mocks/dialogs/create-org-type, L2-134); closes with the created type. */
@Component({
  selector: 'ft-create-org-type-dialog',
  imports: [
    ReactiveFormsModule,
    AlertComponent,
    ButtonComponent,
    DialogComponent,
    FormFieldComponent,
    StackComponent,
    TextFieldComponent,
  ],
  templateUrl: './create-org-type.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrgTypeDialog {
  protected readonly ref = inject<DialogRef<OrgTypeDto>>(DialogRef);
  private readonly portfolioId = inject<string>(DIALOG_DATA);
  private readonly portfolio = inject(PORTFOLIO_SERVICE);

  protected readonly form = inject(NonNullableFormBuilder).group({ name: [''], key: [''] });
  protected readonly busy = signal(false);
  protected readonly errors = signal<Record<string, string>>({});
  protected readonly failed = signal(false);

  protected async create(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.errors.set({});
    this.failed.set(false);
    const v = this.form.getRawValue();
    try {
      this.ref.close(
        await firstValueFrom(
          this.portfolio.createOrgType(this.portfolioId, {
            name: v.name.trim(),
            key: v.key.trim(),
          }),
        ),
      );
    } catch (error) {
      this.errors.set(fieldErrors(error));
      this.failed.set(!Object.keys(this.errors()).length);
    } finally {
      this.busy.set(false);
    }
  }
}
