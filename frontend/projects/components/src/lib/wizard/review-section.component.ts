import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

let nextId = 0;

/** The bordered frame around a wizard's Review sections (design system: wizard, `.review-sections`). */
@Component({
  selector: 'ft-review-sections',
  templateUrl: './review-sections.component.html',
  styleUrl: './review-sections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewSectionsComponent {}

/**
 * One step summarised on Review: its heading, an Edit button that goes back to the step, and the answers projected
 * as content, usually an ft-description-list (design system: wizard, Review).
 */
@Component({
  selector: 'ft-review-section',
  imports: [ButtonComponent],
  templateUrl: './review-section.component.html',
  styleUrl: './review-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewSectionComponent {
  readonly heading = input.required<string>();
  /** The Edit button's accessible name, e.g. "Edit the problem". */
  readonly editLabel = input.required<string>();
  readonly edit = output<void>();

  protected readonly headingId = `ft-review-section-${nextId++}`;
}
