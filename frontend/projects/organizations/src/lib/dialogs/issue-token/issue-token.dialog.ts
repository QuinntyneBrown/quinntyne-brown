import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AgentDto, IssuedTokenDto, MyOrg, PORTFOLIO_SERVICE } from '@faithtech-community/api';
import {
  AlertComponent,
  ButtonComponent,
  CheckboxComponent,
  CheckboxGroupComponent,
  DialogComponent,
  FormFieldComponent,
  SelectComponent,
  StackComponent,
  TextFieldComponent,
  TokenRevealComponent,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

import { fieldErrors } from '../create-organization';

export interface IssueTokenData {
  agent: AgentDto;
  /** The orgs the caller may name: every org for the Portfolio Lead, its own for an Org Lead. */
  orgs: MyOrg[];
}

const EXPIRIES = [1, 7, 30, 60, 90].map((d) => ({
  value: String(d),
  label: d === 1 ? '1 day' : `${d} days`,
}));

/**
 * Issue a token to an agent (docs/mocks/dialogs/issue-token, L2-154 AC2): a name, an expiry of 1
 * to 90 days and the orgs it may reach. The token is then shown once; closes with it.
 */
@Component({
  selector: 'ft-issue-token-dialog',
  imports: [
    ReactiveFormsModule,
    AlertComponent,
    ButtonComponent,
    CheckboxComponent,
    CheckboxGroupComponent,
    DialogComponent,
    FormFieldComponent,
    SelectComponent,
    StackComponent,
    TextFieldComponent,
    TokenRevealComponent,
  ],
  templateUrl: './issue-token.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueTokenDialog {
  protected readonly ref = inject<DialogRef<IssuedTokenDto>>(DialogRef);
  protected readonly data = inject<IssueTokenData>(DIALOG_DATA);
  private readonly portfolio = inject(PORTFOLIO_SERVICE);

  protected readonly expiries = EXPIRIES;
  protected readonly form = inject(NonNullableFormBuilder).group({
    name: [''],
    expiresInDays: ['30'],
    orgIds: [[] as string[]],
  });
  protected readonly busy = signal(false);
  protected readonly errors = signal<Record<string, string>>({});
  protected readonly failure = signal<string | null>(null);
  protected readonly issued = signal<IssuedTokenDto | null>(null);

  protected async issue(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.errors.set({});
    this.failure.set(null);
    const v = this.form.getRawValue();
    try {
      this.issued.set(
        await firstValueFrom(
          this.portfolio.issueToken(this.data.agent.profileId, {
            name: v.name.trim(),
            expiresInDays: Number(v.expiresInDays),
            orgIds: v.orgIds,
          }),
        ),
      );
    } catch (error) {
      this.errors.set(fieldErrors(error));
      if (!Object.keys(this.errors()).length) {
        this.failure.set(
          error instanceof HttpErrorResponse && error.status === 403
            ? 'You can issue tokens only for orgs you lead.'
            : 'We couldn’t reach Quinntyne Brown. Nothing was changed — try again.',
        );
      }
    } finally {
      this.busy.set(false);
    }
  }
}
