import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SkeletonComponent } from '../skeleton';
import { DescriptionListComponent } from './description-list.component';

/**
 * One term and its definition. The value is projected so it can hold links or badges.
 * Set `mono` for an identifier and `multiline` to keep a message's line breaks. Set `missing` for an optional fact with no value: the row stays and reads "Not added".
 * Inside a loading `ft-description-list` the value is a skeleton line.
 */
@Component({
  selector: 'ft-description-list-item',
  imports: [SkeletonComponent],
  templateUrl: './description-list-item.component.html',
  styleUrl: './description-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionListItemComponent {
  private readonly list = inject(DescriptionListComponent, { optional: true });

  readonly label = input.required<string>();
  readonly missing = input(false);
  /** Monospaced value, for identifiers such as a source ID or an event ID. */
  readonly mono = input(false);
  /** Keeps the value's line breaks, for a message someone wrote. */
  readonly multiline = input(false);

  protected readonly loading = computed(() => this.list?.loading() ?? false);
}
