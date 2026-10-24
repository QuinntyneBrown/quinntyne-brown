import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { IconTileComponent, IconTileCover } from '../icon-tile/icon-tile.component';

/**
 * The live preview beside a wizard (design system: wizard, Preview): an icon tile on a cover colour, the title and a
 * caption, and one line of text. Until the title or text is filled it shows the placeholders in muted text.
 */
@Component({
  selector: 'ft-preview-card',
  imports: [CardComponent, IconTileComponent],
  templateUrl: './preview-card.component.html',
  styleUrl: './preview-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewCardComponent {
  /** Names the card for assistive technology, e.g. "Idea preview". */
  readonly label = input.required<string>();
  readonly title = input('');
  readonly caption = input('');
  readonly text = input('');
  readonly placeholderTitle = input('Untitled');
  readonly placeholderText = input('');
  readonly icon = input('idea');
  readonly cover = input<IconTileCover>('sun');

  protected readonly filledTitle = computed(() => this.title().trim());
  protected readonly filledText = computed(() => this.text().trim());
}
