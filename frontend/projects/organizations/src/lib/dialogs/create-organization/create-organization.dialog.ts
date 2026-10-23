import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  OrgTypeSummaryDto,
  OrganizationDto,
  PORTFOLIO_SERVICE,
  problemDetails,
} from '@faithtech-community/api';
import {
  AlertComponent,
  ButtonComponent,
  DialogComponent,
  FormFieldComponent,
  SelectComponent,
  StackComponent,
  TextFieldComponent,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

export interface CreateOrganizationData {
  portfolioId: string;
  types: OrgTypeSummaryDto[];
}

/** New organization (docs/mocks/dialogs/create-org, L2-156 AC1); closes with the created org. */
@Component({
  selector: 'ft-create-organization-dialog',
  imports: [
    ReactiveFormsModule,
    AlertComponent,
    ButtonComponent,
    DialogComponent,
    FormFieldComponent,
    SelectComponent,
    StackComponent,
    TextFieldComponent,
  ],
  templateUrl: './create-organization.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrganizationDialog {
  protected readonly ref = inject<DialogRef<OrganizationDto>>(DialogRef);
  protected readonly data = inject<CreateOrganizationData>(DIALOG_DATA);
  private readonly portfolio = inject(PORTFOLIO_SERVICE);

  protected readonly typeOptions = this.data.types.map((t) => ({ value: t.id, label: t.name }));
  protected readonly form = inject(NonNullableFormBuilder).group({
    name: [''],
    slug: [''],
    orgTypeId: [this.data.types[0]?.id ?? ''],
  });
  protected readonly busy = signal(false);
  protected readonly errors = signal<Record<string, string>>({});
  protected readonly failure = signal<string | null>(null);

  protected async create(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.errors.set({});
    this.failure.set(null);
    const v = this.form.getRawValue();
    try {
      const created = await firstValueFrom(
        this.portfolio.createOrganization(this.data.portfolioId, {
          name: v.name.trim(),
          slug: v.slug.trim(),
          orgTypeId: v.orgTypeId,
        }),
      );
      this.ref.close(created);
    } catch (error) {
      this.errors.set(fieldErrors(error));
      if (error instanceof HttpErrorResponse && error.status === 409) {
        this.errors.set({
          slug: problemDetails(error)?.detail ?? 'Another organization uses that address.',
        });
      } else if (!Object.keys(this.errors()).length) {
        this.failure.set('We couldn’t reach Quinntyne Brown. Nothing was changed — try again.');
      }
    } finally {
      this.busy.set(false);
    }
  }
}

/** The first message per field of a 400, by field name. */
export function fieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof HttpErrorResponse) || error.status !== 400) return {};
  const errors = problemDetails(error)?.errors ?? {};
  return Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, v[0] ?? '']));
}
