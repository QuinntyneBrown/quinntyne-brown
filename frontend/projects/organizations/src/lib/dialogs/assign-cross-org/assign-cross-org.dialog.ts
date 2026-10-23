import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  CrossOrgAssignmentDto,
  CrossOrgRoleDto,
  PEOPLE_SERVICE,
  PORTFOLIO_SERVICE,
  problemDetails,
} from '@faithtech-community/api';
import {
  AlertComponent,
  ButtonComponent,
  DialogComponent,
  FormFieldComponent,
  SelectComponent,
  SelectOption,
  StackComponent,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

export interface AssignCrossOrgData {
  role: CrossOrgRoleDto;
  scope: string;
}

/**
 * Assign a cross-org role to someone (docs/mocks/dialogs/assign-cross-org-role, L2-138 AC7).
 * They cover the role's whole scope; closes with the assignment.
 */
@Component({
  selector: 'ft-assign-cross-org-dialog',
  imports: [
    ReactiveFormsModule,
    AlertComponent,
    ButtonComponent,
    DialogComponent,
    FormFieldComponent,
    SelectComponent,
    StackComponent,
  ],
  templateUrl: './assign-cross-org.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignCrossOrgDialog {
  protected readonly ref = inject<DialogRef<CrossOrgAssignmentDto>>(DialogRef);
  protected readonly data = inject<AssignCrossOrgData>(DIALOG_DATA);
  private readonly portfolio = inject(PORTFOLIO_SERVICE);
  private readonly directory = inject(PEOPLE_SERVICE);

  protected readonly person = new FormControl('', { nonNullable: true });
  protected readonly people = signal<SelectOption[]>([]);
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  protected readonly refusal = signal<string | null>(null);

  constructor() {
    void this.loadPeople();
  }

  protected async assign(): Promise<void> {
    if (this.busy()) return;
    this.error.set('');
    this.refusal.set(null);
    if (!this.person.value) {
      this.error.set('Choose someone to assign.');
      return;
    }
    this.busy.set(true);
    try {
      this.ref.close(
        await firstValueFrom(this.portfolio.assign(this.data.role.id, this.person.value, [])),
      );
    } catch (error) {
      this.refusal.set(
        error instanceof HttpErrorResponse && error.status >= 400 && error.status < 500
          ? (problemDetails(error)?.detail ?? 'They can’t be given this role.')
          : 'We couldn’t reach Quinntyne Brown. Nothing was changed — try again.',
      );
    } finally {
      this.busy.set(false);
    }
  }

  private async loadPeople(): Promise<void> {
    try {
      const page = await firstValueFrom(this.directory.search(''));
      this.people.set(page.items.map((p) => ({ value: p.id, label: p.name })));
    } catch {
      this.refusal.set('We couldn’t load the people of this org. Close and try again.');
    }
  }
}
