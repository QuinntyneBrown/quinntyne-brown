import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type IconTileSize = 'sm' | 'md';

/** A pastel cover colour drawn behind the icon, such as the idea preview's sun or the submitted tick's sage. */
export type IconTileCover = 'sage' | 'rose' | 'sky' | 'sun' | 'lilac' | 'mint' | 'peach';

/**
 * A rounded accent-subtle tile holding one icon, the leading mark of a list row such as a
 * workspace or an invite (design system, list: icon tile). Decorative: the row's text names it.
 */
@Component({
  selector: 'ft-icon-tile',
  imports: [IconComponent],
  templateUrl: './icon-tile.component.html',
  styleUrl: './icon-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    class: 'ft-icon-tile',
    '[class.ft-icon-tile--sm]': 'size() === "sm"',
    '[class.ft-icon-tile--image]': '!!src()',
    '[class.ft-icon-tile--cover]': '!!cover()',
    '[attr.data-cover]': 'cover()',
  },
})
export class IconTileComponent {
  readonly name = input.required<string>();
  readonly size = input<IconTileSize>('md');
  /** An image thumbnail shown in place of the icon, such as an Image resource's (design system, type icon). */
  readonly src = input<string | null>(null);
  /** An emoji shown in place of the icon, such as a note page's icon (design system, list: icon tile). */
  readonly emoji = input<string | null>(null);
  /** A cover colour behind the icon (design system, wizard: preview and success). */
  readonly cover = input<IconTileCover | null>(null);
}
