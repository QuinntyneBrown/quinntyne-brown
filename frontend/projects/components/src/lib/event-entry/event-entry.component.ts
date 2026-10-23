import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  model,
  viewChild,
} from '@angular/core';

import { BadgeComponent } from '../badge/badge.component';
import { IconComponent } from '../icon/icon.component';

/**
 * One event an application sent (design system: components/event-entry): a toggle in a heading
 * with the event's kind, title, meta and, while collapsed, a preview; expanded, it shows the
 * projected body (a description list, or the event's JSON).
 */
@Component({
  selector: 'ft-event-entry',
  imports: [BadgeComponent, IconComponent],
  templateUrl: './event-entry.component.html',
  styleUrl: './event-entry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventEntryComponent {
  readonly kind = input.required<string>();
  readonly kindTone = input<'info' | 'neutral'>('neutral');
  readonly title = input.required<string>();
  /** Set when the title is a machine name, such as an event type. */
  readonly titleMono = input(false);
  readonly meta = input('');
  readonly preview = input('');
  /** An event type with no view of its own: its data as formatted JSON, shown in place of projected content. */
  readonly json = input<string | null>(null);
  readonly expanded = model(false);

  protected readonly bodyId = `ft-event-entry-${nextId++}`;
  private readonly toggleButton = viewChild.required<ElementRef<HTMLButtonElement>>('toggleRef');

  /** Moves focus to the toggle, as after Load more. */
  focus(): void {
    this.toggleButton().nativeElement.focus();
  }

  protected toggle(): void {
    this.expanded.update((open) => !open);
  }
}

let nextId = 0;
