import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { OrganizationDto, PORTFOLIO_SERVICE, problemDetails } from '@faithtech-community/api';
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

/**
 * Rename an org or change its slug (L2-156 AC2, L2-144 AC6): the old slug keeps redirecting.
 * Closes with the saved org.
 */
@Component({
  selector: 'ft-edit-organization-dialog',
  imports: [
    ReactiveFormsModule,
    AlertComponent,
    ButtonComponent,
    DialogComponent,
    FormFieldComponent,
    StackComponent,
    TextFieldComponent,
  ],
  templateUrl: './edit-organization.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditOrganizationDialog {
  protected readonly ref = inject<DialogRef<OrganizationDto>>(DialogRef);
  protected readonly org = inject<OrganizationDto>(DIALOG_DATA);
  private readonly portfolio = inject(PORTFOLIO_SERVICE);

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: [this.org.name],
    slug: [this.org.slug],
  });
  protected readonly busy = signal(false);
  protected readonly errors = signal<Record<string, string>>({});
  protected readonly failed = signal(false);

  protected async save(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.errors.set({});
    this.failed.set(false);
    const v = this.form.getRawValue();
    try {
      this.ref.close(
        await firstValueFrom(
          this.portfolio.updateOrganization(this.org.id, {
            name: v.name.trim(),
            slug: v.slug.trim(),
          }),
        ),
      );
    } catch (error) {
      this.errors.set(fieldErrors(error));
      if (error instanceof HttpErrorResponse && error.status === 409) {
        this.errors.set({
          slug: problemDetails(error)?.detail ?? 'Another organization uses that address.',
        });
      }
      this.failed.set(!Object.keys(this.errors()).length);
    } finally {
      this.busy.set(false);
    }
  }
}
