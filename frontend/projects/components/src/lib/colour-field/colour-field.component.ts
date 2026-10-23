import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

import { BadgeComponent } from '../badge';
import {
  ACCENT_DARK,
  ACCENT_LIGHT,
  ACCENT_MINIMUM_RATIO,
  accentForeground,
  contrastRatio,
  formatRatio,
  isHexColour,
  orgAccentStyle,
} from '../org-theme';
import { TextFieldComponent } from '../text-field';

/**
 * An org accent colour with a live contrast check (design system: components/colour-field). Place it inside
 * ft-form-field for the label, help and error. The swatch mirrors the hex field and is skipped by Tab; the preview
 * shows "Aa {previewText}" on the accent and its foreground, white or #111111, whichever contrasts more.
 */
@Component({
  selector: 'ft-colour-field',
  imports: [ReactiveFormsModule, BadgeComponent, TextFieldComponent],
  templateUrl: './colour-field.component.html',
  styleUrl: './colour-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColourFieldComponent),
      multi: true,
    },
  ],
})
export class ColourFieldComponent implements ControlValueAccessor {
  /** The text on the preview, usually the org's display name. */
  readonly previewText = input('');

  protected readonly hex = new FormControl('', { nonNullable: true });
  protected readonly value = signal('');

  protected readonly colour = computed(() => {
    const v = this.value().trim().toLowerCase();
    return isHexColour(v) ? v : null;
  });
  protected readonly foreground = computed(() => {
    const c = this.colour();
    return c ? accentForeground(c) : null;
  });
  protected readonly ratio = computed(() => {
    const c = this.colour();
    return c ? contrastRatio(c, this.foreground()!) : null;
  });
  protected readonly passes = computed(() => (this.ratio() ?? 0) >= ACCENT_MINIMUM_RATIO);
  protected readonly ratioText = computed(() => {
    const c = this.colour();
    if (!c) return '';
    const dark = this.foreground() === ACCENT_DARK;
    const named = dark ? `near-black (${ACCENT_DARK})` : 'white';
    const text = `Contrast with ${named} text: ${formatRatio(this.ratio()!)}:1`;
    if (this.passes()) return text;
    const other = contrastRatio(c, dark ? ACCENT_LIGHT : ACCENT_DARK);
    return `${text} · ${formatRatio(other)}:1 with ${dark ? 'white' : 'near-black'}`;
  });
  protected readonly previewStyle = computed(() =>
    orgAccentStyle({ accent: this.colour(), accentForeground: this.foreground() }),
  );

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    this.hex.valueChanges.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe((v) => {
      this.value.set(v);
      this.onChange(v);
    });
  }

  protected pick(event: Event): void {
    this.hex.setValue((event.target as HTMLInputElement).value.toUpperCase());
    this.onTouched();
  }

  writeValue(value: string | null): void {
    const v = (value ?? '').toUpperCase();
    this.value.set(v);
    this.hex.setValue(v, { emitEvent: false });
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    if (disabled) this.hex.disable({ emitEvent: false });
    else this.hex.enable({ emitEvent: false });
  }
}
