import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  MyOrg,
  ORGANIZATIONS_SERVICE,
  OrgMemberDto,
  problemDetails,
} from '@faithtech-community/api';
import { AlertComponent, ButtonComponent, DialogComponent } from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

export interface RemoveMemberData {
  org: MyOrg;
  member: OrgMemberDto;
}

/**
 * Confirms removing a member from the org (docs/mocks/dialogs/remove-member, L2-143 AC3, AC4).
 * Closes with true once removed; a refusal, such as the last Org Lead, stays in the dialog.
 */
@Component({
  selector: 'ft-remove-member-dialog',
  imports: [AlertComponent, ButtonComponent, DialogComponent],
  templateUrl: './remove-member.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveMemberDialog {
  protected readonly ref = inject<DialogRef<boolean>>(DialogRef);
  protected readonly data = inject<RemoveMemberData>(DIALOG_DATA);
  private readonly organizations = inject(ORGANIZATIONS_SERVICE);

  protected readonly orgName = this.data.org.branding.displayName;
  protected readonly firstName = this.data.member.name.split(/\s+/)[0];
  protected readonly busy = signal(false);
  protected readonly refusal = signal<string | null>(null);

  protected async remove(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.refusal.set(null);
    try {
      await firstValueFrom(
        this.organizations.removeMember(this.data.org.id, this.data.member.profileId),
      );
      this.ref.close(true);
    } catch (error) {
      this.refusal.set(
        error instanceof HttpErrorResponse && error.status >= 400 && error.status < 500
          ? (problemDetails(error)?.detail ?? 'You can’t remove this member.')
          : 'We couldn’t reach Quinntyne Brown. Nothing was changed — try again.',
      );
    } finally {
      this.busy.set(false);
    }
  }
}
