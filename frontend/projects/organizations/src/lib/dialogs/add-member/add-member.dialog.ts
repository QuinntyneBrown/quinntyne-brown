import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MyOrg,
  ORGANIZATIONS_SERVICE,
  OrgMemberDto,
  ROLES_SERVICE,
  problemDetails,
} from '@faithtech-community/api';
import {
  AlertComponent,
  ButtonComponent,
  DialogComponent,
  FormFieldComponent,
  LinkComponent,
  SelectComponent,
  SelectOption,
  StackComponent,
  TextFieldComponent,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Adds an existing account to the org by email, with an optional role the caller may grant there
 * (docs/mocks/dialogs/add-member, L2-143 AC1, AC2). Closes with the new member.
 */
@Component({
  selector: 'ft-add-member-dialog',
  imports: [
    ReactiveFormsModule,
    AlertComponent,
    ButtonComponent,
    DialogComponent,
    FormFieldComponent,
    LinkComponent,
    SelectComponent,
    StackComponent,
    TextFieldComponent,
  ],
  templateUrl: './add-member.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddMemberDialog {
  protected readonly ref = inject<DialogRef<OrgMemberDto>>(DialogRef);
  protected readonly org = inject<MyOrg>(DIALOG_DATA);
  private readonly organizations = inject(ORGANIZATIONS_SERVICE);
  private readonly roles = inject(ROLES_SERVICE);

  protected readonly form = inject(NonNullableFormBuilder).group({ email: [''], role: [''] });
  protected readonly roleOptions: SelectOption[] = [
    { value: '', label: 'No role (Member)' },
    ...this.org.grantableRoles.map((r) => ({ value: r.key, label: r.name })),
  ];
  protected readonly busy = signal(false);
  protected readonly failed = signal(false);
  protected readonly emailError = signal('');
  /** The email has no account, so an invite is the way in. */
  protected readonly needsInvite = signal(false);

  protected async add(): Promise<void> {
    if (this.busy()) return;
    const { email, role } = this.form.getRawValue();
    const address = email.trim();
    this.needsInvite.set(false);
    this.emailError.set(EMAIL.test(address) ? '' : 'Enter an email like name@example.org.');
    if (this.emailError()) return;
    this.busy.set(true);
    this.failed.set(false);
    try {
      const added = await firstValueFrom(this.organizations.addMember(this.org.id, address));
      const roles = role
        ? await firstValueFrom(this.roles.addRole(added.profileId, role, this.org.id))
        : added.roles;
      this.ref.close({ ...added, roles: roles.filter((r) => r.organizationId === this.org.id) });
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status >= 400 && error.status < 500) {
        this.needsInvite.set(error.status === 404);
        this.emailError.set(problemDetails(error)?.detail ?? 'Check the email and try again.');
      } else {
        this.failed.set(true);
      }
    } finally {
      this.busy.set(false);
    }
  }
}
