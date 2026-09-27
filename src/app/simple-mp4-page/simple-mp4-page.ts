import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EvaBackward,
  EvaBuffering,
  EvaControlsContainer,
  EvaDoubleTapSeek,
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

type SampleVideo = {
  id: string;
  label: string;
  src: string;
};

const SAMPLE_VIDEOS: SampleVideo[] = [
  {
    id: 'sample', label: 'Some sample video', src: 'https://cdn.radiantmediatechs.com/rmp/media/samples-for-rmp-site/04052024-lac-de-bimont/04052024-Lac-De-Bimont-360p-avc.mp4'
  },
  { id: 'elephants', label: 'Elephants Dream', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
];

/**
 * Minimal player demo — a single MP4 source with just the essentials:
 * play/pause, seek, volume, a scrub bar, and fullscreen. No streaming,
 * no subtitles, no settings panel — the smallest useful control set.
 *
 * Also demonstrates runtime source switching: `videoSources` is a `computed()`
 * derived from `selectedVideoId`, mirroring the pattern from the GitHub issue where
 * `evaVideoSources` didn't reload the video when a computed source changed at runtime.
 * The "Switch video" buttons below the player exercise that fix directly.
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
    EvaDoubleTapSeek,
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
  protected readonly sampleVideos = SAMPLE_VIDEOS;

  protected readonly selectedVideoId = signal(SAMPLE_VIDEOS[0].id);

  protected readonly videoSources = computed<EvaVideoSource[]>(() => {
    const video = this.sampleVideos.find((v) => v.id === this.selectedVideoId()) ?? this.sampleVideos[0];
    return [{ type: 'video/mp4', src: video.src }];
  });

  protected selectVideo(id: string): void {
    this.selectedVideoId.set(id);
  }
}
