import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** A feature's permissions in the checklist; a group whose feature is off is not shown. */
export interface PermissionGroup {
  feature: string;
  label: string;
  codes: { code: string; label: string }[];
}

let nextId = 0;

/**
 * Permission codes grouped by feature, each with its plain-language label and its code
 * (design system: components/permission-checklist). Its value is the chosen codes; codes not
 * shown (a feature that is off) are kept as they were.
 */
@Component({
  selector: 'ft-permission-checklist',
  templateUrl: './permission-checklist.component.html',
  styleUrl: './permission-checklist.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PermissionChecklistComponent),
      multi: true,
    },
  ],
})
export class PermissionChecklistComponent implements ControlValueAccessor {
  readonly groups = input.required<PermissionGroup[]>();
  readonly legend = input('Permissions');

  protected readonly uid = `ft-permission-checklist-${nextId++}`;
  protected readonly value = signal<readonly string[]>([]);
  protected readonly disabled = signal(false);
  protected readonly counts = computed(() =>
    this.groups().map(
      (g) => `${g.codes.filter((c) => this.value().includes(c.code)).length} of ${g.codes.length}`,
    ),
  );

  private onChange: (value: string[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected checked(code: string): boolean {
    return this.value().includes(code);
  }

  protected toggle(code: string, event: Event): void {
    const on = (event.target as HTMLInputElement).checked;
    const next = on ? [...this.value(), code] : this.value().filter((c) => c !== code);
    this.value.set(next);
    this.onChange([...next]);
    this.onTouched();
  }

  writeValue(value: string[] | null): void {
    this.value.set(value ?? []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
