import { HttpErrorResponse } from '@angular/common/http';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  OnInit,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  AUTH_SERVICE,
  IDEAS_SERVICE,
  problemDetails,
  SubmitIdeaRequest,
  SubmittedIdea,
} from '@faithtech-community/api';
import {
  AlertComponent,
  BadgeComponent,
  ButtonComponent,
  ChipComponent,
  ChipGroupComponent,
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

import {
  AUDIENCES,
  COMMITMENTS,
  INVOLVEMENTS,
  labelOf,
  LIMITS,
  PLATFORMS,
  SKILLS,
  STAGES,
  TOPICS,
} from '../../idea-options';
import { IDEA_STEPS, IdeaStepKey, IdeaSwitches, planIdeaSteps } from '../../idea-steps';

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
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    ChipComponent,
    ChipGroupComponent,
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
export class SubmitIdeaPage implements OnInit {
  private readonly ideas = inject(IDEAS_SERVICE);
  private readonly auth = inject(AUTH_SERVICE);
  private readonly injector = inject(Injector);

  protected readonly audiences = AUDIENCES;
  protected readonly stages = STAGES;
  protected readonly platforms = PLATFORMS;
  protected readonly topicOptions = TOPICS;
  protected readonly skillOptions = SKILLS;
  protected readonly involvements = INVOLVEMENTS;
  protected readonly commitments = COMMITMENTS;
  protected readonly limits = LIMITS;

  protected readonly form = new FormGroup({
    problem: new FormControl('', { nonNullable: true }),
    audience: new FormControl<string | null>(null),
    title: new FormControl('', { nonNullable: true }),
    pitch: new FormControl('', { nonNullable: true }),
    solution: new FormControl('', { nonNullable: true }),
    name: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
    stage: new FormControl<string | null>(null),
    platform: new FormControl<string | null>(null),
    involvement: new FormControl<string | null>(null),
    commitment: new FormControl<string | null>(null),
  });
  /** The chips' choices, kept beside the form: topics (at most five) and skills. */
  protected readonly topics = signal<readonly string[]>([]);
  protected readonly skills = signal<readonly string[]>([]);
  /** Optional steps passed with Skip, whose answers were cleared (L2-172 AC3, L2-173 AC2). */
  protected readonly skipped = signal<ReadonlySet<IdeaStepKey>>(new Set());

  /** A signed-in member submits under their account's name and email (L2-175 AC5, L2-177 AC2). */
  protected readonly signedIn = this.auth.isAuthenticated;
  protected readonly member = computed(() => this.auth.currentUser());
  /** The Idea form switches; the wizard shows once they are known, so the step count never jumps. */
  private readonly switches = signal<IdeaSwitches | null>(null);
  protected readonly ready = signal(!this.auth.isAuthenticated());
  /** Every answer as a signal, for the preview, Review and errors that follow the answers. */
  protected readonly values = toSignal(
    this.form.valueChanges.pipe(map(() => this.form.getRawValue())),
    {
      initialValue: this.form.getRawValue(),
    },
  );

  protected readonly steps = computed(() => planIdeaSteps(this.signedIn(), this.switches()));
  protected readonly wizardSteps = computed(() => this.steps().map((key) => IDEA_STEPS[key]));
  protected readonly index = signal(0);
  protected readonly step = computed(() => this.steps()[this.index()]);
  protected readonly heading = computed(() => IDEA_STEPS[this.step()].heading);

  /** Steps whose Continue (or Submit) was pressed: their errors show and follow the answers. */
  private readonly attempted = signal<ReadonlySet<IdeaStepKey>>(new Set());
  private readonly serverErrors = signal<FieldError[]>([]);
  protected readonly submitted = signal<SubmittedIdea | null>(null);
  /** Submitting: the button is busy and Back is disabled (L2-176 AC1). */
  protected readonly busy = signal(false);
  /** Why the last submit failed; every answer is kept (L2-176 AC2). */
  protected readonly failure = signal<string | null>(null);

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

  async ngOnInit(): Promise<void> {
    if (!this.signedIn()) return;
    try {
      this.switches.set(await firstValueFrom(this.ideas.form()));
    } catch {
      // Without the switches the member answers the required steps only.
      this.switches.set(null);
    } finally {
      this.ready.set(true);
    }
  }

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

  protected label(options: typeof STAGES, value: string | null): string {
    return value ? labelOf(options, value) : 'Not answered';
  }

  /** True when an optional step was skipped or left empty, so Review says "Skipped". */
  protected isSkipped(step: 'stage' | 'people'): boolean {
    const v = this.values();
    const empty =
      step === 'stage'
        ? !v.stage && !v.platform && !this.topics().length
        : !v.involvement && !v.commitment && !this.skills().length;
    return this.skipped().has(step) || empty;
  }

  protected toggle(list: 'topics' | 'skills', value: string, pressed: boolean): void {
    const target = list === 'topics' ? this.topics : this.skills;
    target.update((values) => (pressed ? [...values, value] : values.filter((v) => v !== value)));
  }

  protected topicDisabled(topic: string): boolean {
    return this.topics().length >= LIMITS.topics && !this.topics().includes(topic);
  }

  /** Skip an optional step: its answers are cleared and Review shows it as skipped. */
  protected skip(): void {
    const step = this.step();
    if (step === 'stage') {
      this.form.patchValue({ stage: null, platform: null });
      this.topics.set([]);
    } else if (step === 'people') {
      this.form.patchValue({ involvement: null, commitment: null });
      this.skills.set([]);
    }
    this.skipped.update((set) => new Set(set).add(step));
    this.goTo(this.index() + 1);
  }

  /** Continue, or Submit idea on Review. */
  protected async next(): Promise<void> {
    if (this.busy()) return;
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
    this.skipped.update((set) => {
      const next = new Set(set);
      next.delete(step);
      return next;
    });
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
    this.topics.set([]);
    this.skills.set([]);
    this.skipped.set(new Set());
    this.attempted.set(new Set());
    this.serverErrors.set([]);
    this.failure.set(null);
    this.submitted.set(null);
    this.goTo(0);
  }

  /** A summary link to a radio group focuses its first choice; text fields are focused by the link itself. */
  protected focusError(error: FormError): void {
    if (error.fieldId === 'audience') this.audienceGroup()?.focus();
  }

  private async submit(): Promise<void> {
    this.busy.set(true);
    this.failure.set(null);
    try {
      const idea = await firstValueFrom(this.ideas.submit(this.request()));
      this.submitted.set(idea);
      afterNextRender(() => this.successHeading()?.nativeElement.focus(), {
        injector: this.injector,
      });
    } catch (error) {
      const status = error instanceof HttpErrorResponse ? error.status : 0;
      const fields = status === 400 ? problemDetails(error)?.errors : null;
      if (fields && this.showServerErrors(fields)) return;
      this.failure.set(
        status === 429
          ? 'You’ve sent a lot of ideas in a short time. Try again in a little while.'
          : 'We couldn’t reach the server. Your answers are kept. Try again.',
      );
    } finally {
      this.busy.set(false);
    }
  }

  /** The answers to send: only the steps this person was asked, and a visitor's name and email (L2-177 AC5). */
  private request(): SubmitIdeaRequest {
    const v = this.form.getRawValue();
    const request: SubmitIdeaRequest = {
      problem: v.problem.trim(),
      audience: v.audience ?? '',
      title: v.title.trim(),
      pitch: v.pitch.trim(),
      solution: v.solution.trim(),
    };
    if (this.steps().includes('stage')) {
      Object.assign(request, { stage: v.stage, platform: v.platform, topics: [...this.topics()] });
    }
    if (this.steps().includes('people')) {
      Object.assign(request, {
        skills: [...this.skills()],
        involvement: v.involvement,
        commitment: v.commitment,
      });
    }
    if (!this.signedIn()) Object.assign(request, { name: v.name.trim(), email: v.email.trim() });
    return request;
  }

  /** Each server error goes back to its step and field (L2-176 AC3). */
  private showServerErrors(fields: Record<string, string[]>): boolean {
    const errors = Object.entries(fields)
      .filter(([field]) => field in STEP_OF)
      .map(([field, messages]) => ({ field: field as Field, message: messages[0] }));
    if (!errors.length) return false;
    this.serverErrors.set(errors);
    const first = Math.min(...errors.map((e) => this.steps().indexOf(STEP_OF[e.field])));
    this.index.set(first);
    this.focusSummary();
    return true;
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
    if (step === 'review' && !this.signedIn()) {
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
