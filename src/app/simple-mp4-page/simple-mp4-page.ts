import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EvaBackward,
  EvaBuffering,
  EvaControlsContainer,
  EvaForward,
  EvaFullscreen,
  EvaMute,
  EvaOverlayPlay,
  EvaPlayer,
  EvaPlayPause,
  EvaScrubBar,
  EvaTimeDisplay,
  EvaUserInteractionEventsDirective,
  EvaVideoSource,
  EvaVolume,
} from 'ez-vid-ang';

/**
 * Minimal player demo — a single MP4 source with just the essentials:
 * play/pause, seek, volume, a scrub bar, and fullscreen. No streaming,
 * no subtitles, no settings panel — the smallest useful control set.
 */
@Component({
  selector: 'lt-simple-mp4-page',
  templateUrl: './simple-mp4-page.html',
  styleUrl: './simple-mp4-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EvaBackward,
    EvaBuffering,
    EvaControlsContainer,
    EvaForward,
    EvaFullscreen,
    EvaMute,
    EvaOverlayPlay,
    EvaPlayer,
    EvaPlayPause,
    EvaScrubBar,
    EvaTimeDisplay,
    EvaUserInteractionEventsDirective,
    EvaVolume,
    RouterLink,
  ],
})
export class SimpleMp4Page {
  protected readonly videoSources = signal<EvaVideoSource[]>([
    { type: 'video/mp4', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  ]);
}
