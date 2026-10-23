import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  FEATURE_LABELS,
  Feature,
  OrgTypeDto,
  PERMISSION_LABELS,
  PORTFOLIO_SERVICE,
  RoleDefinitionDto,
} from '@faithtech-community/api';
import {
  AlertComponent,
  ButtonComponent,
  CheckboxComponent,
  CheckboxGroupComponent,
  DialogComponent,
  FormFieldComponent,
  PermissionChecklistComponent,
  PermissionGroup,
  SelectComponent,
  StackComponent,
  TextFieldComponent,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

import { fieldErrors } from '../create-organization';

export interface RoleDefinitionData {
  type: OrgTypeDto;
  /** The role to edit; a new role when absent. */
  role?: RoleDefinitionDto;
}

/**
 * Adds or edits a catalogue role (docs/mocks/pages/org-type, L2-134 AC2, AC5; L2-137 AC4): name,
 * key, description, parent (display only), permissions grouped by the type's enabled features,
 * and the roles it can grant. Closes with the saved role.
 */
@Component({
  selector: 'ft-role-definition-dialog',
  imports: [
    ReactiveFormsModule,
    AlertComponent,
    ButtonComponent,
    CheckboxComponent,
    CheckboxGroupComponent,
    DialogComponent,
    FormFieldComponent,
    PermissionChecklistComponent,
    SelectComponent,
    StackComponent,
    TextFieldComponent,
  ],
  templateUrl: './role-definition.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleDefinitionDialog {
  protected readonly ref = inject<DialogRef<RoleDefinitionDto>>(DialogRef);
  protected readonly data = inject<RoleDefinitionData>(DIALOG_DATA);
  private readonly portfolio = inject(PORTFOLIO_SERVICE);

  private readonly others = this.data.type.roles.filter((r) => r.id !== this.data.role?.id);
  protected readonly parentOptions = this.others.map((r) => ({ value: r.id, label: r.name }));
  protected readonly grantable = this.others;
  /** Only the features that are on; codes of features that are off are kept but hidden. */
  protected readonly groups: PermissionGroup[] = this.data.type.permissionCatalogue
    .filter((g) => g.enabled && g.codes.length)
    .map((g) => ({
      feature: g.feature,
      label: FEATURE_LABELS[g.feature as Feature]?.name ?? g.feature,
      codes: g.codes.map((code) => ({ code, label: PERMISSION_LABELS[code] ?? code })),
    }));
  protected readonly form = inject(NonNullableFormBuilder).group({
    name: [this.data.role?.name ?? ''],
    key: [this.data.role?.key ?? ''],
    description: [this.data.role?.description ?? ''],
    parentRoleId: [this.data.role?.parentRoleId ?? ''],
    permissions: [this.data.role?.permissions ?? ([] as string[])],
    canGrant: [this.data.role?.canGrant ?? ([] as string[])],
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
    const body = {
      key: v.key.trim(),
      name: v.name.trim(),
      description: v.description.trim() || null,
      parentRoleId: v.parentRoleId || null,
      permissions: v.permissions,
      canGrant: v.canGrant,
    };
    try {
      const saved = await firstValueFrom(
        this.data.role
          ? this.portfolio.updateRole(this.data.type.id, this.data.role.id, body)
          : this.portfolio.createRole(this.data.type.id, body),
      );
      this.ref.close(saved);
    } catch (error) {
      this.errors.set(fieldErrors(error));
      this.failed.set(!Object.keys(this.errors()).length);
    } finally {
      this.busy.set(false);
    }
  }
}
