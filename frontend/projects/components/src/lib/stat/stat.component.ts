import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkeletonComponent } from '../skeleton/skeleton.component';

let nextId = 0;

/**
 * `number` (default) for counts; `text` for a value in words, such as a sprint goal or end date;
 * `figure` for a headline figure shown above its label in the accent colour (15+ / years).
 */
export type StatVariant = 'number' | 'text' | 'figure';

/**
 * A label over a large number or short value, such as "Lead" over "4". Values in words take
 * `variant="text"`, a smaller style. While `loading`, the label stays and a skeleton stands in
 * for the value (and for the `context` line, when there is one). A zero count reads "0". Lay a row of stats out with `<ft-cluster gap="8">`.
 */
@Component({
  selector: 'ft-stat',
  imports: [SkeletonComponent],
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'group',
    '[attr.aria-labelledby]': 'labelId',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[class.ft-stat--figure]': 'variant() === "figure"',
  },
})
export class StatComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly variant = input<StatVariant>('number');
  readonly loading = input(false);
  /** A caption under the value saying what it is relative to, such as "+18 in the last 30 days". */
  readonly context = input<string | null>(null);

  protected readonly labelId = `ft-stat-label-${nextId++}`;
}
