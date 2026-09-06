/**
 * Web Audio Engine for Realtime Microphone Capture & Frequency Visualizer
 */

export interface AudioEngineOptions {
  onAudioData?: (frequencyData: Uint8Array, rms: number) => void;
  onStateChange?: (state: 'idle' | 'recording' | 'muted' | 'error') => void;
  /** Called every analysis frame with current RMS energy (0–1). Feed this to SilenceDetector. */
  onRms?: (rms: number) => void;
}

export class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private animationFrameId: number | null = null;
  private isSyntheticPlaying = false;
  private syntheticPhase = 0;

  private onAudioData?: (frequencyData: Uint8Array, rms: number) => void;
  private onStateChange?: (state: 'idle' | 'recording' | 'muted' | 'error') => void;
  private onRms?: (rms: number) => void;

  constructor(options: AudioEngineOptions = {}) {
    this.onAudioData = options.onAudioData;
    this.onStateChange = options.onStateChange;
    this.onRms = options.onRms;
  }

  public async requestMicrophone(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported in this browser environment');
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        },
      });

      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.sourceNode = this.audioCtx.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.analyser);

      this.startAnalysisLoop();
      this.onStateChange?.('recording');
      return true;
    } catch (err) {
      console.warn('Microphone access denied or unavailable, falling back to synthetic audio engine:', err);
      this.onStateChange?.('error');
      return false;
    }
  }

  public startSyntheticWave(amplitudeFactor = 0.6): void {
    this.isSyntheticPlaying = true;
    if (!this.animationFrameId) {
      this.startSyntheticLoop(amplitudeFactor);
    }
  }

  public stopSyntheticWave(): void {
    this.isSyntheticPlaying = false;
  }

  private startSyntheticLoop(amplitudeFactor = 0.6): void {
    const buffer = new Uint8Array(32);
    const loop = () => {
      if (!this.isSyntheticPlaying) {
        // Return gentle decay
        buffer.fill(0);
        this.onAudioData?.(buffer, 0);
        this.animationFrameId = null;
        return;
      }

      this.syntheticPhase += 0.15;
      let sum = 0;
      for (let i = 0; i < 32; i++) {
        // Harmonic wave generation simulating human vocal cords
        const wave =
          Math.sin(this.syntheticPhase + i * 0.4) * 0.5 +
          Math.sin(this.syntheticPhase * 2 + i * 0.8) * 0.3 +
          Math.random() * 0.2;
        const val = Math.max(0, Math.min(255, Math.floor((wave * 0.5 + 0.5) * 200 * amplitudeFactor)));
        buffer[i] = val;
        sum += val * val;
      }
      const rms = Math.sqrt(sum / 32) / 255;
      this.onAudioData?.(buffer, rms);
      this.onRms?.(rms);

      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  private startAnalysisLoop(): void {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const checkAudio = () => {
      if (!this.analyser) return;

      this.analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / dataArray.length) / 255;

      this.onAudioData?.(dataArray, rms);
      this.onRms?.(rms);
      this.animationFrameId = requestAnimationFrame(checkAudio);
    };

    this.animationFrameId = requestAnimationFrame(checkAudio);
  }

  public stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }

    this.isSyntheticPlaying = false;
    this.onStateChange?.('idle');
  }

  public isCapturing(): boolean {
    return !!this.mediaStream && this.mediaStream.active;
  }
}
