import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  OnInit,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { RESOURCE_TYPES, RESOURCES_SERVICE, ACCESS_SERVICE } from '@faithtech-community/api';
import {
  CheckboxComponent,
  CheckboxGroupComponent,
  FormFieldComponent,
  PersonOption,
  PersonPickerComponent,
  RadioComponent,
  RadioGroupComponent,
  SelectComponent,
  SelectOption,
  TagInputComponent,
  TagSuggestion,
  TextFieldComponent,
  TextareaComponent,
} from '@faithtech-community/components';
import { firstValueFrom, startWith } from 'rxjs';

import { ResourceDetailsForm } from './resource-details';

/**
 * The fields the add and edit dialogs share (L2-059, L2-061): title, description, type, tags and
 * who can see it, with the people and roles to share with. Batches hide title and type.
 */
@Component({
  selector: 'ft-resource-details',
  imports: [
    ReactiveFormsModule,
    CheckboxComponent,
    CheckboxGroupComponent,
    FormFieldComponent,
    PersonPickerComponent,
    RadioComponent,
    RadioGroupComponent,
    SelectComponent,
    TagInputComponent,
    TextFieldComponent,
    TextareaComponent,
  ],
  templateUrl: './resource-details.component.html',
  styleUrl: './resource-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceDetailsComponent implements OnInit {
  private readonly resources = inject(RESOURCES_SERVICE);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);

  readonly form = input.required<ResourceDetailsForm>();
  readonly errors = input<Partial<Record<string, string>>>({});
  readonly showTitleAndType = input(true);
  /** "Guessed from .pdf — change it if it’s wrong." under the type, for one uploaded file. */
  readonly typeHint = input('');

  private readonly titleField = viewChild<FormFieldComponent>('titleField');
  private readonly typeField = viewChild<FormFieldComponent>('typeField');

  protected readonly typeOptions: SelectOption[] = RESOURCE_TYPES.map((t) => ({
    value: t,
    label: t,
  }));
  /** The org the resource is in, for its share roles; the active org when absent. */
  readonly org = input<string | null>(null);

  private readonly access = inject(ACCESS_SERVICE);
  private readonly orgAccess = computed(() => {
    const slug = this.org();
    return (slug && this.access.orgs().find((o) => o.slug === slug)) || this.access.homeOrg();
  });
  /** "Everyone in FaithTech Toronto", the Org-wide choice (ADR 0039). */
  protected readonly orgName = computed(
    () => this.orgAccess()?.branding.displayName ?? 'this organization',
  );
  /** Only the Portfolio Lead, or a System Admin, publishes to the whole portfolio (L2-148 AC4). */
  protected readonly mayPublishPortfolioWide = computed(
    () => this.access.isSystemAdmin() || !!this.orgAccess()?.isPortfolioLead,
  );
  protected readonly roles = computed(() =>
    this.access.shareRoles(this.org()).map((r) => ({ value: r.key, label: r.name })),
  );
  protected readonly tagSuggestions = signal<TagSuggestion[]>([]);
  protected readonly people = signal<PersonOption[]>([]);
  protected readonly searching = signal(false);

  protected readonly visibility = signal('OrgWide');
  protected readonly titleLength = signal(0);

  ngOnInit(): void {
    const { visibility, title } = this.form().controls;
    visibility.valueChanges
      .pipe(startWith(visibility.value), takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => this.visibility.set(v));
    title.valueChanges
      .pipe(startWith(title.value), takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => this.titleLength.set(v.trim().length));
    void this.searchTags('');
  }

  /** Ids of the fields the error summary links to. */
  fieldId(field: 'title' | 'type'): string | null {
    return (field === 'title' ? this.titleField() : this.typeField())?.controlId() ?? null;
  }

  /** "Change who can see it" opens the edit dialog here (L2-061 AC5). */
  focusVisibility(): void {
    this.host.querySelector<HTMLInputElement>('input[type=radio]:checked')?.focus();
  }

  protected async searchTags(q: string): Promise<void> {
    try {
      this.tagSuggestions.set(await firstValueFrom(this.resources.tags(q)));
    } catch {
      this.tagSuggestions.set([]);
    }
  }

  protected async searchPeople(q: string): Promise<void> {
    if (!q) {
      this.people.set([]);
      return;
    }
    this.searching.set(true);
    try {
      const members = await firstValueFrom(this.resources.members(q));
      this.people.set(
        members.map((m) => ({
          id: m.id,
          name: m.name,
          detail: [m.roles.join(', '), m.city].filter(Boolean).join(' · '),
        })),
      );
    } catch {
      this.people.set([]);
    } finally {
      this.searching.set(false);
    }
  }
}
