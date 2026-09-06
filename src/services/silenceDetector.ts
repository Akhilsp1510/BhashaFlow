/**
 * SilenceDetector — Smart pause detection for continuous speech input.
 *
 * Strategy (based on VAD research for conversational AI):
 *  - Track rolling RMS energy over a 300ms window.
 *  - If RMS drops below `silenceThreshold` for `pauseGracePeriodMs`, emit "pause_detected".
 *  - The caller decides what to do (show dialog, wait, etc.).
 *  - If speech resumes before confirmation, emit "speech_resumed" — cancel the dialog.
 *  - The detector NEVER auto-submits; it only signals state changes.
 *
 * This prevents the frustrating "cut off mid-sentence" problem for Hinglish users
 * who naturally take intra-sentence pauses between code-switched segments.
 */

export type SilenceDetectorEvent =
  | 'speech_started'     // RMS crosses above threshold — user is speaking
  | 'pause_detected'     // Silence held for pauseGracePeriodMs — show "Continue?" dialog
  | 'speech_resumed'     // User speaks again after a pause — dismiss dialog
  | 'long_silence'       // Silence held for longSilenceMs — user probably done, escalate dialog
  | 'reset';             // Detector cleared (mic stopped / new session)

export interface SilenceDetectorOptions {
  /** RMS value (0–1) below which audio is considered silence. Default: 0.015 */
  silenceThreshold?: number;
  /** How long (ms) silence must be held before emitting "pause_detected". Default: 1500ms */
  pauseGracePeriodMs?: number;
  /** How long (ms) of sustained silence before escalating to "long_silence". Default: 4000ms */
  longSilenceMs?: number;
  /** Minimum speech duration (ms) required before pause detection activates. Default: 400ms */
  minSpeechDurationMs?: number;
  /** Called when detector emits an event */
  onEvent: (event: SilenceDetectorEvent) => void;
}

export class SilenceDetector {
  private threshold: number;
  private pauseGraceMs: number;
  private longSilenceMs: number;
  private minSpeechMs: number;
  private onEvent: (event: SilenceDetectorEvent) => void;

  // Timing state
  private silenceStartTime: number | null = null;
  private speechStartTime: number | null = null;
  private pauseTimerId: ReturnType<typeof setTimeout> | null = null;
  private longSilenceTimerId: ReturnType<typeof setTimeout> | null = null;
  private hasSpeechStarted = false;
  private isPaused = false;
  private isLongSilence = false;
  private isActive = false;

  // Rolling average to smooth out brief micro-silences between words
  private rmsWindow: number[] = [];
  private readonly WINDOW_FRAMES = 8; // ~8 animation frames ≈ 130ms at 60fps

  constructor(options: SilenceDetectorOptions) {
    this.threshold = options.silenceThreshold ?? 0.015;
    this.pauseGraceMs = options.pauseGracePeriodMs ?? 1500;
    this.longSilenceMs = options.longSilenceMs ?? 4000;
    this.minSpeechMs = options.minSpeechDurationMs ?? 400;
    this.onEvent = options.onEvent;
  }

  /** Feed each audio frame's RMS value here (called from AudioEngine's analysis loop) */
  public feed(rms: number): void {
    if (!this.isActive) return;

    // Rolling average over last N frames
    this.rmsWindow.push(rms);
    if (this.rmsWindow.length > this.WINDOW_FRAMES) this.rmsWindow.shift();
    const avgRms = this.rmsWindow.reduce((a, b) => a + b, 0) / this.rmsWindow.length;

    const isSpeaking = avgRms > this.threshold;

    if (isSpeaking) {
      this._onSpeechFrame();
    } else {
      this._onSilenceFrame();
    }
  }

  private _onSpeechFrame(): void {
    // Cancel any pending silence timers immediately
    this._clearSilenceTimers();

    if (!this.hasSpeechStarted) {
      this.hasSpeechStarted = true;
      this.speechStartTime = Date.now();
      this.onEvent('speech_started');
    } else if (this.isPaused || this.isLongSilence) {
      // User resumed speaking after a pause
      this.isPaused = false;
      this.isLongSilence = false;
      this.silenceStartTime = null;
      this.onEvent('speech_resumed');
    }
  }

  private _onSilenceFrame(): void {
    if (!this.hasSpeechStarted) return; // Wait for initial speech before tracking silence

    const speechDuration = this.speechStartTime ? Date.now() - this.speechStartTime : 0;
    if (speechDuration < this.minSpeechMs) return; // Ignore micro-noise before meaningful speech

    if (this.silenceStartTime === null) {
      this.silenceStartTime = Date.now();
      this._schedulePauseDetection();
    }
  }

  private _schedulePauseDetection(): void {
    if (this.pauseTimerId !== null || this.isPaused) return;

    this.pauseTimerId = setTimeout(() => {
      if (!this.hasSpeechStarted) return;
      this.isPaused = true;
      this.onEvent('pause_detected');

      // Schedule long-silence escalation
      if (!this.longSilenceTimerId && !this.isLongSilence) {
        this.longSilenceTimerId = setTimeout(() => {
          if (this.isPaused && !this.isLongSilence) {
            this.isLongSilence = true;
            this.onEvent('long_silence');
          }
          this.longSilenceTimerId = null;
        }, this.longSilenceMs - this.pauseGraceMs);
      }

      this.pauseTimerId = null;
    }, this.pauseGraceMs);
  }

  private _clearSilenceTimers(): void {
    if (this.pauseTimerId !== null) {
      clearTimeout(this.pauseTimerId);
      this.pauseTimerId = null;
    }
    if (this.silenceStartTime !== null) {
      this.silenceStartTime = null;
    }
  }

  /** Call when mic starts — begins detection */
  public start(): void {
    this.isActive = true;
    this.reset();
  }

  /** Call when mic is stopped or session ends */
  public stop(): void {
    this.isActive = false;
    this._clearSilenceTimers();
    if (this.longSilenceTimerId !== null) {
      clearTimeout(this.longSilenceTimerId);
      this.longSilenceTimerId = null;
    }
    this.onEvent('reset');
  }

  /** Resets all state but keeps detector active */
  public reset(): void {
    this._clearSilenceTimers();
    if (this.longSilenceTimerId !== null) {
      clearTimeout(this.longSilenceTimerId);
      this.longSilenceTimerId = null;
    }
    this.hasSpeechStarted = false;
    this.isPaused = false;
    this.isLongSilence = false;
    this.silenceStartTime = null;
    this.speechStartTime = null;
    this.rmsWindow = [];
  }

  /** Get current silence detector state */
  public getState(): { isPaused: boolean; isLongSilence: boolean; hasSpeech: boolean } {
    return {
      isPaused: this.isPaused,
      isLongSilence: this.isLongSilence,
      hasSpeech: this.hasSpeechStarted,
    };
  }
}
