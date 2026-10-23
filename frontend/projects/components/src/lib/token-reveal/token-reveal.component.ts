import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CopyFieldComponent } from '../copy-field';
import { IconComponent } from '../icon/icon.component';

/**
 * A new agent token, shown once (design system: components/token-reveal): a warning that it
 * won't be shown again and a read-only field with a Copy button.
 */
@Component({
  selector: 'ft-token-reveal',
  imports: [CopyFieldComponent, IconComponent],
  templateUrl: './token-reveal.component.html',
  styleUrl: './token-reveal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenRevealComponent {
  readonly token = input.required<string>();
  readonly help = input('Store it where the agent can read it, such as a secret store.');
}
