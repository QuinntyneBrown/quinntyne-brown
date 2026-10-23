import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AgentDto, PORTFOLIO_SERVICE } from '@faithtech-community/api';
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

/** New agent (docs/mocks/dialogs/create-agent, L2-154 AC1); closes with the created agent. */
@Component({
  selector: 'ft-create-agent-dialog',
  imports: [
    ReactiveFormsModule,
    AlertComponent,
    ButtonComponent,
    DialogComponent,
    FormFieldComponent,
    StackComponent,
    TextFieldComponent,
  ],
  templateUrl: './create-agent.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAgentDialog {
  protected readonly ref = inject<DialogRef<AgentDto>>(DialogRef);
  private readonly portfolioId = inject<string>(DIALOG_DATA);
  private readonly portfolio = inject(PORTFOLIO_SERVICE);

  protected readonly name = new FormControl('', { nonNullable: true });
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  protected readonly failed = signal(false);

  protected async create(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.failed.set(false);
    try {
      this.ref.close(
        await firstValueFrom(this.portfolio.createAgent(this.portfolioId, this.name.value.trim())),
      );
    } catch (error) {
      this.error.set(fieldErrors(error)['name'] ?? '');
      this.failed.set(!this.error());
    } finally {
      this.busy.set(false);
    }
  }
}
