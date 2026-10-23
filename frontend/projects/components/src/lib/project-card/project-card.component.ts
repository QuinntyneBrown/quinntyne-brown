import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * One project in a grid of projects (marketing page, Things I’m building): a decorative thumbnail,
 * the name as the card's only link, stretched over the card, and the main language. Without an
 * `image` the thumbnail is a tinted tile with the name's initial. Place inside a `<ul>`.
 */
@Component({
  selector: 'ft-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'listitem' },
})
export class ProjectCardComponent {
  readonly name = input.required<string>();
  readonly href = input.required<string>();
  readonly language = input<string | null>(null);
  /** A screenshot served by the app; decorative, since the name says what the project is. */
  readonly image = input<string | null>(null);

  protected readonly initial = computed(() => this.name().charAt(0).toUpperCase());
}
