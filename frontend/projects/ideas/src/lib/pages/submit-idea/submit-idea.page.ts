import { HttpErrorResponse } from '@angular/common/http';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IDEAS_SERVICE, problemDetails, SubmittedIdea } from '@faithtech-community/api';
import {
  ButtonComponent,
  DescriptionListComponent,
  DescriptionListItemComponent,
  ErrorSummaryComponent,
  FormError,
  FormFieldComponent,
  IconComponent,
  IconTileComponent,
  PageHeaderComponent,
  PreviewCardComponent,
  RadioComponent,
  RadioGroupComponent,
  ReviewSectionComponent,
  ReviewSectionsComponent,
  StackComponent,
  TextareaComponent,
  TextFieldComponent,
  WizardCardComponent,
  WizardComponent,
} from '@faithtech-community/components';
import { firstValueFrom, map } from 'rxjs';

import { AUDIENCES, labelOf, LIMITS } from '../../idea-options';
import { IDEA_STEPS, IdeaStepKey, planIdeaSteps } from '../../idea-steps';

type Field = 'problem' | 'audience' | 'title' | 'pitch' | 'solution' | 'name' | 'email';

interface FieldError {
  field: Field;
  message: string;
}

/** Where each field is answered, so a server error goes back to its step (L2-176 AC3). */
const STEP_OF: Record<Field, IdeaStepKey> = {
  problem: 'problem',
  audience: 'problem',
  title: 'idea',
  pitch: 'idea',
  solution: 'idea',
  name: 'review',
  email: 'review',
};

/** The visible label of each text field, to find its control id for the summary links. */
const LABELS: Partial<Record<Field, string>> = {
  problem: 'Describe the problem',
  title: 'Name your idea',
  pitch: 'One-line pitch',
  solution: 'How would it work?',
  name: 'Your name',
  email: 'Email',
};

// name@domain.tld: one @, a dot in the domain, no spaces (the server's rule).
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s.]+$/;

/**
 * Submit an app idea at /ideas/new (L2-168 to L2-177, docs/mocks/pages/submit-idea). Answers live only in this page
 * while it is open: there is no saved draft (decision 6). The rules mirror the server's, which has the last word.
 */
@Component({
  selector: 'ft-submit-idea-page',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    DescriptionListComponent,
    DescriptionListItemComponent,
    ErrorSummaryComponent,
    FormFieldComponent,
    IconComponent,
    IconTileComponent,
    PageHeaderComponent,
    PreviewCardComponent,
    RadioComponent,
    RadioGroupComponent,
    ReviewSectionComponent,
    ReviewSectionsComponent,
    StackComponent,
    TextareaComponent,
    TextFieldComponent,
    WizardCardComponent,
    WizardComponent,
  ],
  templateUrl: './submit-idea.page.html',
  styleUrl: './submit-idea.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitIdeaPage {
  private readonly ideas = inject(IDEAS_SERVICE);
  private readonly injector = inject(Injector);

  protected readonly audiences = AUDIENCES;
  protected readonly limits = LIMITS;

  protected readonly form = new FormGroup({
    problem: new FormControl('', { nonNullable: true }),
    audience: new FormControl<string | null>(null),
    title: new FormControl('', { nonNullable: true }),
    pitch: new FormControl('', { nonNullable: true }),
    solution: new FormControl('', { nonNullable: true }),
    name: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
  });
  /** Every answer as a signal, for the preview, Review and errors that follow the answers. */
  protected readonly values = toSignal(
    this.form.valueChanges.pipe(map(() => this.form.getRawValue())),
    {
      initialValue: this.form.getRawValue(),
    },
  );

  protected readonly steps = computed(() => planIdeaSteps(false, null));
  protected readonly wizardSteps = computed(() => this.steps().map((key) => IDEA_STEPS[key]));
  protected readonly index = signal(0);
  protected readonly step = computed(() => this.steps()[this.index()]);
  protected readonly heading = computed(() => IDEA_STEPS[this.step()].heading);

  /** Steps whose Continue (or Submit) was pressed: their errors show and follow the answers. */
  private readonly attempted = signal<ReadonlySet<IdeaStepKey>>(new Set());
  private readonly serverErrors = signal<FieldError[]>([]);
  protected readonly submitted = signal<SubmittedIdea | null>(null);

  protected readonly errors = computed<FieldError[]>(() => {
    const step = this.step();
    const server = this.serverErrors().filter((e) => STEP_OF[e.field] === step);
    if (server.length) return server;
    return this.attempted().has(step) ? this.validate(step, this.values()) : [];
  });
  protected readonly summary = computed<FormError[]>(() =>
    this.errors().map((e) => ({ message: e.message, fieldId: this.fieldId(e.field) })),
  );

  protected readonly firstName = computed(
    () => this.submitted()?.name.trim().split(/\s+/)[0] ?? '',
  );

  private readonly card = viewChild(WizardCardComponent);
  private readonly successHeading = viewChild<ElementRef<HTMLElement>>('successHeading');
  private readonly fields = viewChildren(FormFieldComponent);
  private readonly audienceGroup = viewChild<RadioGroupComponent>('audienceGroup');
  private readonly summaryBox = viewChild(ErrorSummaryComponent);

  protected error(field: Field): string {
    return this.errors().find((e) => e.field === field)?.message ?? '';
  }

  protected audienceLabel(): string {
    return labelOf(AUDIENCES, this.values().audience);
  }

  /** Continue, or Submit idea on Review. */
  protected async next(): Promise<void> {
    const step = this.step();
    this.serverErrors.update((errors) => errors.filter((e) => STEP_OF[e.field] !== step));
    this.attempted.update((set) => new Set(set).add(step));
    if (this.validate(step, this.form.getRawValue()).length) {
      this.focusSummary();
      return;
    }
    if (step === 'review') {
      await this.submit();
      return;
    }
    this.goTo(this.index() + 1);
  }

  protected back(): void {
    this.goTo(this.index() - 1);
  }

  protected edit(step: IdeaStepKey): void {
    this.goTo(this.steps().indexOf(step));
  }

  protected goTo(index: number): void {
    this.index.set(index);
    afterNextRender(() => this.card()?.focusHeading(), { injector: this.injector });
  }

  /** Submit another idea: back to the first step with every answer cleared (L2-176 AC5). */
  protected startAgain(): void {
    this.form.reset();
    this.attempted.set(new Set());
    this.serverErrors.set([]);
    this.submitted.set(null);
    this.goTo(0);
  }

  /** A summary link to a radio group focuses its first choice; text fields are focused by the link itself. */
  protected focusError(error: FormError): void {
    if (error.fieldId === 'audience') this.audienceGroup()?.focus();
  }

  private async submit(): Promise<void> {
    const v = this.form.getRawValue();
    try {
      const idea = await firstValueFrom(
        this.ideas.submit({
          problem: v.problem.trim(),
          audience: v.audience ?? '',
          title: v.title.trim(),
          pitch: v.pitch.trim(),
          solution: v.solution.trim(),
          name: v.name.trim(),
          email: v.email.trim(),
        }),
      );
      this.submitted.set(idea);
      afterNextRender(() => this.successHeading()?.nativeElement.focus(), {
        injector: this.injector,
      });
    } catch (error) {
      const fields =
        error instanceof HttpErrorResponse && error.status === 400
          ? problemDetails(error)?.errors
          : null;
      if (fields) this.showServerErrors(fields);
    }
  }

  /** Each server error goes back to its step and field (L2-176 AC3). */
  private showServerErrors(fields: Record<string, string[]>): void {
    const errors = Object.entries(fields)
      .filter(([field]) => field in STEP_OF)
      .map(([field, messages]) => ({ field: field as Field, message: messages[0] }));
    if (!errors.length) return;
    this.serverErrors.set(errors);
    const first = Math.min(...errors.map((e) => this.steps().indexOf(STEP_OF[e.field])));
    this.index.set(first);
    this.focusSummary();
  }

  private focusSummary(): void {
    afterNextRender(() => this.summaryBox()?.focus(), { injector: this.injector });
  }

  private validate(step: IdeaStepKey, v: ReturnType<typeof this.form.getRawValue>): FieldError[] {
    const errors: FieldError[] = [];
    const require = (field: Field, missing: string, max: number, what: string) => {
      const value = (v[field] ?? '').trim();
      if (!value) errors.push({ field, message: missing });
      else if (value.length > max)
        errors.push({ field, message: `Use ${max} characters or fewer for ${what}` });
    };
    if (step === 'problem') {
      const problem = v.problem.trim();
      if (problem.length < LIMITS.problemMin)
        errors.push({
          field: 'problem',
          message: 'Add a little more detail, at least 30 characters',
        });
      else if (problem.length > LIMITS.problem)
        errors.push({ field: 'problem', message: 'Use 600 characters or fewer for the problem' });
      if (!v.audience)
        errors.push({ field: 'audience', message: 'Choose who feels this problem most' });
    }
    if (step === 'idea') {
      require('title', 'Name your idea', LIMITS.title, 'the name');
      require('pitch', 'Add a one-line pitch', LIMITS.pitch, 'the pitch');
      require('solution', 'Say how it would work', LIMITS.solution, 'how it would work');
    }
    if (step === 'review') {
      require('name', 'Enter your name', LIMITS.name, 'your name');
      const email = v.email.trim();
      if (!EMAIL.test(email) || email.length > LIMITS.email)
        errors.push({ field: 'email', message: 'Enter an email like name@example.org' });
    }
    return errors;
  }

  private fieldId(field: Field): string {
    const label = LABELS[field];
    return (
      (label &&
        this.fields()
          .find((f) => f.label() === label)
          ?.controlId()) ||
      field
    );
  }
}
