import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { AlertComponent } from '../alert/alert.component';

/**
 * A self-hosted video with the browser's own controls, a poster and a captions track (off by default)
 * (docs/design-system/components/video-player.html). It never autoplays. When the file cannot
 * play it shows the poster with a message.
 */
@Component({
  selector: 'ft-video-player',
  imports: [AlertComponent],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerComponent {
  readonly src = input.required<string>();
  readonly type = input('video/webm');
  readonly poster = input.required<string>();
  /** Alt text for the poster when it stands in for a video that cannot play. */
  readonly posterAlt = input.required<string>();
  /** WebVTT captions, offered in the browser's controls. */
  readonly captions = input.required<string>();
  /** Whether the captions start switched on; off by default, so the viewer chooses. */
  readonly captionsOn = input(false);
  readonly captionsLanguage = input('en');
  readonly captionsLabel = input('English');
  /** Accessible name of the video, including its length. */
  readonly label = input.required<string>();
  /** The line under the video. */
  readonly caption = input<string | null>(null);

  protected readonly unavailable = signal(false);
}
