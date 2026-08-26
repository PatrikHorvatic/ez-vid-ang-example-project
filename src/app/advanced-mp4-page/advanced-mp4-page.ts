import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  EvaActiveChapter,
  EvaApi,
  EvaBackward,
  EvaBuffering,
  EvaChapterList,
  EvaChapterMarker,
  EvaCinemaMode,
  EvaContextMenu,
  EvaContextMenuEvent,
  EvaContextMenuItem,
  EvaControlsContainer,
  EvaControlsDivider,
  EvaDownload,
  EvaDownloadEvent,
  EvaEndedOverlay,
  EvaErrorOverlay,
  EvaForward,
  EvaFullscreen,
  EvaKeyboardShortcutsOverlay,
  EvaLoop,
  EvaMute,
  EvaOverlayPlay,
  EvaPictureInPicture,
  EvaPlaybackSpeed,
  EvaPlayer,
  EvaPlayPause,
  EvaRemotePlayback,
  EvaScreenshot,
  EvaScreenshotEvent,
  EvaScrubBar,
  EvaScrubBarBufferingTime,
  EvaScrubBarCurrentTime,
  EvaSettingsMenuEvent,
  EvaSettingsMenuItem,
  EvaSettingsPanel,
  EvaSubtitleDisplay,
  EvaTimeDisplay,
  EvaTooltip,
  EvaTrack,
  EvaTrackSelector,
  EvaUserInteractionEventsDirective,
  EvaVideoSource,
  EvaVolume,
} from 'ez-vid-ang';

/**
 * Larger feature-set demo — a single MP4 source with subtitles, chapters,
 * a settings panel, keyboard shortcuts, context menu, and persistence.
 * Everything a non-streaming player realistically needs, minus adaptive
 * quality/audio-track switching (which only make sense for HLS/DASH).
 */
@Component({
  selector: 'lt-advanced-mp4-page',
  templateUrl: './advanced-mp4-page.html',
  styleUrl: './advanced-mp4-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EvaActiveChapter,
    EvaBackward,
    EvaBuffering,
    EvaChapterList,
    EvaCinemaMode,
    EvaContextMenu,
    EvaControlsContainer,
    EvaControlsDivider,
    EvaDownload,
    EvaEndedOverlay,
    EvaErrorOverlay,
    EvaForward,
    EvaFullscreen,
    EvaKeyboardShortcutsOverlay,
    EvaLoop,
    EvaMute,
    EvaOverlayPlay,
    EvaPictureInPicture,
    EvaPlaybackSpeed,
    EvaPlayer,
    EvaPlayPause,
    EvaRemotePlayback,
    EvaScreenshot,
    EvaScrubBar,
    EvaScrubBarBufferingTime,
    EvaScrubBarCurrentTime,
    EvaSettingsPanel,
    EvaSubtitleDisplay,
    EvaTimeDisplay,
    EvaTooltip,
    EvaTrackSelector,
    EvaUserInteractionEventsDirective,
    EvaVolume,
    RouterLink,
  ],
})
export class AdvancedMp4Page implements AfterViewInit, OnDestroy {
  private readonly player = viewChild.required<EvaPlayer>('evaVideoPlayer');
  private pipSub: Subscription | null = null;
  private cinemaSub: Subscription | null = null;

  private get api(): EvaApi {
    return this.player().playerMainAPI;
  }

  protected readonly videoSources = signal<EvaVideoSource[]>([
    { type: 'video/mp4', src: 'https://cdn.radiantmediatechs.com/rmp/media/samples-for-rmp-site/04052024-lac-de-bimont/04052024-Lac-De-Bimont-360p-avc.mp4' },
  ]);

  protected readonly videoTracks = signal<EvaTrack[]>([
    { kind: 'subtitles', srclang: 'EN', label: 'English', src: 'subs.vtt' },
    { kind: 'chapters', srclang: 'EN', label: 'Chapters', src: 'chapters.vtt' },
  ]);

  protected readonly chapters = signal<EvaChapterMarker[]>([
    { startTime: 0, endTime: 90, title: 'Intro' },
    { startTime: 90, endTime: 180, title: 'Background & Context' },
    { startTime: 180, endTime: 300, title: 'Main Topic' },
    { startTime: 300, endTime: 420, title: 'Deep Dive' },
    { startTime: 420, endTime: 540, title: 'Examples & Demo' },
    { startTime: 540, endTime: 596, title: 'Conclusion' },
  ]);

  protected readonly isChapterListOpen = signal(false);
  protected readonly isCinemaModeActive = signal(false);

  protected toggleChapterList(): void {
    this.isChapterListOpen.update(v => !v);
  }

  protected readonly contextMenuItems: EvaContextMenuItem[] = [
    { id: 'copy-url', label: 'Copy video URL' },
    { id: 'copy-time', label: 'Copy URL at current time' },
    { id: 'sep1', label: '', divider: true },
    { id: 'screenshot', label: 'Take screenshot' },
  ];

  protected onContextMenuAction(event: EvaContextMenuEvent): void {
    switch (event.itemId) {
      case 'copy-url':
        navigator.clipboard.writeText(event.currentSrc);
        break;
      case 'copy-time': {
        const url = `${event.currentSrc}#t=${Math.floor(event.currentTime)}`;
        navigator.clipboard.writeText(url);
        break;
      }
      case 'screenshot':
        this.api.captureScreenshot().then(result => {
          if (result?.blob) {
            navigator.clipboard.write([new ClipboardItem({ [result.blob.type]: result.blob })]);
          }
        });
        break;
    }
  }

  protected onDownload(event: EvaDownloadEvent): void {
    const a = document.createElement('a');
    a.href = event.currentSrc;
    a.download = '';
    a.click();
  }

  protected onScreenshot(event: EvaScreenshotEvent): void {
    if (event.dataUrl) {
      const a = document.createElement('a');
      a.href = event.dataUrl;
      a.download = `screenshot-${event.currentTime.toFixed(1)}s.png`;
      a.click();
    }
  }

  protected onRetry(): void {
    console.log('Retry clicked — video reloading');
  }

  protected replay(): void {
    const video = this.api.assignedVideoElement;
    if (!video) { return; }
    video.currentTime = 0;
    video.play().catch(() => { });
  }

  private isLooping = false;

  protected readonly settingsItems = signal<EvaSettingsMenuItem[]>([
    {
      id: 'speed',
      label: 'Playback speed',
      currentValue: 'Normal',
      options: [
        { id: '0.5', label: '0.5x' },
        { id: '1', label: 'Normal', selected: true },
        { id: '1.5', label: '1.5x' },
        { id: '2', label: '2x' },
      ],
    },
    { id: 'loop', label: 'Loop', currentValue: 'Off' },
    { id: 'cinema', label: 'Cinema mode', currentValue: 'Off' },
    { id: 'pip', label: 'Picture-in-Picture', currentValue: 'Off' },
    { id: 'shortcuts', label: 'Keyboard shortcuts' },
  ]);

  public ngAfterViewInit(): void {
    this.pipSub = this.api.pictureInPictureSubject.subscribe(active => {
      this.settingsItems.update(items =>
        items.map(item => item.id === 'pip' ? { ...item, currentValue: active ? 'On' : 'Off' } : item),
      );
    });

    this.cinemaSub = this.api.cinemaModeSubject.subscribe(active => {
      this.isCinemaModeActive.set(active);
      this.updateToggle('cinema', active);
    });
  }

  public ngOnDestroy(): void {
    this.pipSub?.unsubscribe();
    this.cinemaSub?.unsubscribe();
  }

  protected onSettingChanged(event: EvaSettingsMenuEvent): void {
    switch (event.itemId) {
      case 'speed':
        this.api.setPlaybackSpeed(Number(event.optionId));
        this.updateSubMenu('speed', event);
        break;

      case 'loop':
        this.isLooping = !this.isLooping;
        if (this.api.assignedVideoElement) {
          this.api.assignedVideoElement.loop = this.isLooping;
          this.api.loopSubject.next(this.isLooping);
        }
        this.updateToggle('loop', this.isLooping);
        break;

      case 'cinema':
        this.api.cinemaModeSubject.next(!this.isCinemaModeActive());
        break;

      case 'pip':
        this.api.changePictureInPictureStatus();
        break;

      case 'shortcuts':
        this.api.keyboardShortcutsOverlaySubject.next(true);
        this.api.controlsSelectorComponentActive.next(true);
        break;
    }
  }

  private updateSubMenu(itemId: string, event: EvaSettingsMenuEvent): void {
    this.settingsItems.update(items =>
      items.map(item =>
        item.id === itemId
          ? {
            ...item,
            currentValue: event.label,
            options: item.options?.map(opt => ({ ...opt, selected: opt.id === event.optionId })),
          }
          : item,
      ),
    );
  }

  private updateToggle(itemId: string, active: boolean): void {
    this.settingsItems.update(items =>
      items.map(item => item.id === itemId ? { ...item, currentValue: active ? 'On' : 'Off' } : item),
    );
  }
}
