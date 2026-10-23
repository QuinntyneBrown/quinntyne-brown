import { ChangeDetectionStrategy, Component, input } from '@angular/core';

let nextId = 0;

/**
 * A marketing page section under the hero (Work, Things I’m building): an accent eyebrow over the
 * section's `<h2>`, then its content. A named region, set off from what comes before by a rule.
 */
@Component({
  selector: 'ft-landing-section',
  templateUrl: './landing-section.component.html',
  styleUrl: './landing-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'region', '[attr.aria-labelledby]': 'headingId' },
})
export class LandingSectionComponent {
  readonly eyebrow = input<string | null>(null);
  readonly heading = input.required<string>();

  protected readonly headingId = `ft-landing-section-${nextId++}`;
}
