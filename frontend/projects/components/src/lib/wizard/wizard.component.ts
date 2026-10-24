import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

/** One step of a wizard: its title in the rail, and an optional summary under it ("Optional"). */
export interface WizardStep {
  title: string;
  summary?: string;
}

/**
 * A short form split into steps (design system: components/wizard.html). The rail beside the step card lists the
 * steps from 1024px; below that the "{title} N of M" label and a progress bar take its place, and both always count
 * the same `steps`. Finished steps go back through `stepSelect`; later steps are disabled. The step card is the
 * default content, and an `[ftWizardPreview]` aside shows as a third column from 1280px.
 */
@Component({
  selector: 'ft-wizard',
  imports: [IconComponent],
  templateUrl: './wizard.component.html',
  styleUrl: './wizard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardComponent {
  /** Names the rail's navigation, e.g. "Idea submission steps". */
  readonly label = input.required<string>();
  readonly steps = input.required<readonly WizardStep[]>();
  /** The current step's index, from 0. */
  readonly current = input(0);
  /** Adds the preview column from 1280px. */
  readonly preview = input(false);
  /** A finished step was chosen in the rail. */
  readonly stepSelect = output<number>();

  protected readonly position = computed(() => this.current() + 1);
  protected readonly title = computed(() => this.steps()[this.current()]?.title ?? '');
  protected readonly percent = computed(() =>
    this.steps().length ? Math.round((this.position() / this.steps().length) * 100) : 0,
  );
}
