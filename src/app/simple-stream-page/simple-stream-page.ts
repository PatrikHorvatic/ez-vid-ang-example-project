import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EvaBuffering,
  EvaControlsContainer,
  EvaFullscreen,
  EvaHlsDirective,
  EvaMute,
  EvaOverlayPlay,
  EvaPlayer,
  EvaPlayPause,
  EvaQualitySelector,
  EvaScrubBar,
  EvaScrubBarBufferingTime,
  EvaTimeDisplay,
  EvaUserInteractionEventsDirective,
  EvaVolume,
} from 'ez-vid-ang';

/**
 * Minimal streaming demo — an adaptive HLS source with just enough controls
 * to show adaptive playback working: play/pause, volume, a buffering-aware
 * scrub bar, quality selection, and fullscreen.
 */
@Component({
  selector: 'lt-simple-stream-page',
  templateUrl: './simple-stream-page.html',
  styleUrl: './simple-stream-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EvaBuffering,
    EvaControlsContainer,
    EvaFullscreen,
    EvaHlsDirective,
    EvaMute,
    EvaOverlayPlay,
    EvaPlayer,
    EvaPlayPause,
    EvaQualitySelector,
    EvaScrubBar,
    EvaScrubBarBufferingTime,
    EvaTimeDisplay,
    EvaUserInteractionEventsDirective,
    EvaVolume,
    RouterLink,
  ],
})
export class SimpleStreamPage {
  protected readonly hlsSource = signal('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
}
