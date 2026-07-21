import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import {
  EvaActiveChapter,
  EvaApi,
  EvaAudioTrackSelector,
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
  EvaHlsDirective,
  EvaKeyboardShortcutsConfiguration,
  EvaKeyboardShortcutsOverlay,
  EvaLoop,
  EvaMute,
  EvaOverlayPlay,
  EvaPictureInPicture,
  EvaPlaybackSpeed,
  EvaPlayer, EvaTooltip,
  EvaPlayPause,
  EvaQualitySelector,
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
  EvaTrack,
  EvaTrackSelector,
  EvaUserInteractionEventsDirective,
  EvaVideoElementConfiguration,
  EvaVideoSource,
  EvaVolume,
} from 'ez-vid-ang';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lt-testing-page',
  templateUrl: './testing-page.html',
  styleUrl: `./testing-page.scss`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    EvaActiveChapter,
    EvaAudioTrackSelector,
    EvaBackward,
    EvaBuffering,
    EvaChapterList, EvaRemotePlayback,
    EvaCinemaMode,
    EvaContextMenu,
    EvaControlsContainer,
    EvaControlsDivider,
    EvaDownload, EvaTooltip,
    EvaEndedOverlay,
    EvaErrorOverlay,
    EvaForward,
    EvaFullscreen,
    EvaHlsDirective,
    EvaKeyboardShortcutsOverlay,
    EvaLoop,
    EvaMute,
    EvaOverlayPlay,
    EvaPictureInPicture,
    EvaPlaybackSpeed,
    EvaPlayer,
    EvaPlayPause,
    EvaQualitySelector,
    EvaScreenshot,
    EvaScrubBar,
    EvaScrubBarBufferingTime,
    EvaScrubBarCurrentTime,
    EvaSettingsPanel,
    EvaSubtitleDisplay,
    EvaTimeDisplay,
    EvaTrackSelector,
    EvaUserInteractionEventsDirective,
    EvaVolume
  ],
})
export class TestingPage implements AfterViewInit, OnInit, OnDestroy {
  private readonly player = viewChild.required<EvaPlayer>('evaVideoPlayer');
  private pipSub: Subscription | null = null;
  private cinemaSub: Subscription | null = null;

  /** Drives the sidebar-collapsing layout — see testing-page.scss `.watch-layout.cinema-active`. */
  protected readonly isCinemaModeActive = signal(false);

  private get api(): EvaApi {
    return this.player().playerMainAPI;
  }

  // ─── Video sources ─────────────────────────────────────────────────────────

  protected readonly videoSources = signal<EvaVideoSource[]>([
    // { type: 'video/mp4', src: '/video-sample.mp4' },
  ]);

  protected readonly vttFile = signal('/thumbnails-hls.vtt');
  // protected readonly hlsSource = signal('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
  // protected readonly hlsSource = signal('https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.mp4/.m3u8');
  // protected readonly hlsSource = signal('https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_adv_example_hevc/master.m3u8');
  protected readonly hlsSource = signal('https://devstreaming-cdn.apple.com/videos/streaming/examples/adv_dv_atmos/main.m3u8');
  // protected readonly hlsSource = signal('https://stream.mux.com/v69RSHhFelSm4701snP22dYz2jICy4E4S/low.m3u8');
  // protected readonly hlsSource = signal('https://test-streams.mux.dev/tos_ismc/main.m3u8');
  // protected readonly hlsSource = signal('https://test-streams.mux.dev/pts_shift/master.m3u8');
  // protected readonly hlsSource = signal('https://test-streams.mux.dev/test_001/stream.m3u8');

  protected readonly videoConfiguration = signal<EvaVideoElementConfiguration>({
    autoplay: false,
    controls: false,
    crossorigin: 'anonymous',
    disablePictureInPicture: false,
    disableRemotePlayback: false,
    loop: false,
    preload: 'auto',
    startingVolume: 0.5,
  });

  protected readonly keyboardConfig = signal<EvaKeyboardShortcutsConfiguration>({
    backwardsKeyOne: 'J',
    forwardKeyOne: 'L',
    backwardsKeyTwo: 'ArrowLeft',
    forwardKeyTwo: 'ArrowRight',
    backwardSeconds: 10,
    forwardSeconds: 10,
  });

  // ─── Tracks & chapters ─────────────────────────────────────────────────────

  protected readonly videoTracks = signal<EvaTrack[]>([
    { kind: 'subtitles', srclang: 'EN', label: 'English', src: 'subs-en.vtt' },
    { kind: 'subtitles', srclang: 'HR', label: 'Croatian', src: 'subs-hr.vtt' },
    { kind: 'chapters', srclang: 'EN', label: 'Chapters', src: 'chapters.vtt' },
  ]);

  protected readonly chapters = signal<EvaChapterMarker[]>([
    { startTime: 0, endTime: 90, title: 'Intro' },
    { startTime: 90, endTime: 180, title: 'Background & Context' },
    { startTime: 180, endTime: 300, title: 'Main Topic' },
    { startTime: 300, endTime: 420, title: 'Deep Dive' },
    { startTime: 420, endTime: 540, title: 'Examples & Demo' },
    { startTime: 540, endTime: 600, title: 'Conclusion' },
  ]);

  protected readonly isChapterListOpen = signal(false);

  protected toggleChapterList(): void {
    this.isChapterListOpen.update((v) => !v);
  }

  // ─── Context menu ──────────────────────────────────────────────────────────

  protected readonly contextMenuItems: EvaContextMenuItem[] = [
    { id: 'copy-url', label: 'Copy video URL' },
    { id: 'copy-time', label: 'Copy URL at current time' },
    { id: 'sep1', label: '', divider: true },
    { id: 'screenshot', label: 'Take screenshot' },
    { id: 'sep2', label: '', divider: true },
    { id: 'about', label: 'About EzVidAng' },
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
        this.api.captureScreenshot().then((result) => {
          if (result?.blob) {
            navigator.clipboard.write([new ClipboardItem({ [result.blob.type]: result.blob })]);
          }
        });
        break;
      case 'about':
        window.open('https://github.com/nicoss01/ez-vid-ang', '_blank');
        break;
    }
  }

  // ─── Download & screenshot handlers ────────────────────────────────────────

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

  // ─── Settings panel ────────────────────────────────────────────────────────

  private isLooping = false;

  protected readonly settingsItems = signal<EvaSettingsMenuItem[]>([
    {
      id: 'speed',
      label: 'Playback speed',
      currentValue: 'Normal',
      options: [
        { id: '0.25', label: '0.25x' },
        { id: '0.5', label: '0.5x' },
        { id: '1', label: 'Normal', selected: true },
        { id: '1.5', label: '1.5x' },
        { id: '2', label: '2x' },
        { id: '4', label: '4x' },
      ],
    },
    { id: 'loop', label: 'Loop', currentValue: 'Off' },
    { id: 'cinema', label: 'Cinema mode', currentValue: 'Off' },
    { id: 'pip', label: 'Picture-in-Picture', currentValue: 'Off' },
    { id: 'screenshot', label: 'Take screenshot' },
    { id: 'shortcuts', label: 'Keyboard shortcuts' },
  ]);

  public ngOnInit(): void {
    // Defer PiP subscription until after view init
  }

  public ngAfterViewInit(): void {
    this.pipSub = this.api.pictureInPictureSubject.subscribe((active) => {
      this.settingsItems.update((items) =>
        items.map((item) =>
          item.id === 'pip' ? { ...item, currentValue: active ? 'On' : 'Off' } : item
        )
      );
    });

    this.cinemaSub = this.api.cinemaModeSubject.subscribe((active) => {
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

      case 'screenshot':
        this.api.captureScreenshot().then((result) => {
          if (result?.blob) {
            const url = URL.createObjectURL(result.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `screenshot-${result.currentTime.toFixed(1)}s.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
        });
        break;

      case 'shortcuts':
        this.api.keyboardShortcutsOverlaySubject.next(true);
        this.api.controlsSelectorComponentActive.next(true);
        break;
    }
  }

  private updateSubMenu(itemId: string, event: EvaSettingsMenuEvent): void {
    this.settingsItems.update((items) =>
      items.map((item) =>
        item.id === itemId
          ? {
            ...item,
            currentValue: event.label,
            options: item.options?.map((opt) => ({
              ...opt,
              selected: opt.id === event.optionId,
            })),
          }
          : item
      )
    );
  }

  private updateToggle(itemId: string, active: boolean): void {
    this.settingsItems.update((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, currentValue: active ? 'On' : 'Off' } : item
      )
    );
  }
}