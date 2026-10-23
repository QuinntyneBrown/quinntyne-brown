import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from '../button/button.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { IconComponent } from '../icon/icon.component';
import { TextFieldComponent } from '../text-field/text-field.component';

/**
 * An application's signing secret (design system: components/secret-field): shown once, read-only, with Copy
 * secret and a warning; as soon as it has been copied it is masked to its prefix and cannot be shown again. With
 * no value it shows only the masked prefix.
 */
@Component({
  selector: 'ft-secret-field',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    FormFieldComponent,
    IconComponent,
    TextFieldComponent,
  ],
  templateUrl: './secret-field.component.html',
  styleUrl: './secret-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecretFieldComponent {
  readonly label = input.required<string>();
  /** The secret, or null once it can no longer be shown. */
  readonly value = input<string | null>(null);
  /** The secret's first characters, shown when masked. */
  readonly prefix = input.required<string>();
  readonly hint = input(
    'Store it in the application’s secret store. We keep it encrypted and never show it again.',
  );
  /** Emits after the secret reached the clipboard. */
  readonly copied = output<void>();

  protected readonly control = new FormControl('', { nonNullable: true });
  protected readonly state = signal<'shown' | 'copied' | 'refused'>('shown');

  constructor() {
    effect(() => this.control.setValue(this.value() ?? ''));
  }

  protected async copy(field: HTMLElement): Promise<void> {
    const secret = this.value();
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret);
      this.state.set('copied');
      this.copied.emit();
    } catch {
      field.querySelector('input')?.select();
      this.state.set('refused');
    }
  }
}
