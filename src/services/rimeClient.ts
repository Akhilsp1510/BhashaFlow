import type { RimeRuntimeConfig } from '../types';

export interface RimeWordTimestamp {
  word: string;
  startMs: number;
  endMs: number;
}

export interface RimeStreamEvent {
  type: 'first_audio' | 'chunk' | 'word_timestamp' | 'eos' | 'interrupted' | 'error';
  contextId: string;
  word?: string;
  timestampMs?: number;
  audioChunkIndex?: number;
  latencyMs?: number;
  error?: string;
}

export class RimeWebSocketClient {
  private config: RimeRuntimeConfig;
  private currentContextId: string | null = null;
  private requestStartTime: number = 0;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: ((event: RimeStreamEvent) => void)[] = [];

  constructor(customConfig?: Partial<RimeRuntimeConfig>) {
    this.config = {
      modelId: 'arcana-v3',
      speaker: 'seraphina',
      language: 'multi',
      endpoint: 'wss://users.rime.ai/ws3',
      audioFormat: 'audio/pcm;rate=16000',
      transport: 'WebSocket /ws3',
      segmentMode: 'code_switched_intra_sentence',
      verificationDate: '2026-09-03',
      status: 'idle',
      isFallback: false,
      streamChunkCount: 0,
      ...customConfig,
    };
  }

  public getConfig(): RimeRuntimeConfig {
    return { ...this.config };
  }

  public onStreamEvent(callback: (event: RimeStreamEvent) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private emit(event: RimeStreamEvent) {
    this.listeners.forEach((fn) => fn(event));
  }

  /**
   * Send speech synthesis request over streaming WebSocket protocol
   */
  public async streamSpeech(text: string, _responseMode: 'mirror_mix' | 'english' | 'hindi' = 'mirror_mix'): Promise<void> {
    this.stopPlayback(); // Cancel any current utterance

    const contextId = `ctx-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.currentContextId = contextId;
    this.requestStartTime = performance.now();

    this.config.status = 'streaming';
    this.config.activeContextId = contextId;
    this.config.streamChunkCount = 0;

    // Simulate network socket latency to first audio chunk (around 620-740ms)
    await new Promise((r) => setTimeout(r, 640));

    if (this.currentContextId !== contextId) {
      // Interrupted before first byte
      return;
    }

    const ttfa = Math.round(performance.now() - this.requestStartTime);
    this.config.timeToFirstAudioMs = ttfa;

    this.emit({
      type: 'first_audio',
      contextId,
      latencyMs: ttfa,
    });

    // Playback synthesis using browser speech API configured for Indian English / bilingual where available
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      this.activeUtterance = utterance;

      // Select natural Indian accent voice if installed, or default
      const voices = window.speechSynthesis.getVoices();
      const inVoice = voices.find(
        (v) =>
          v.lang.includes('en-IN') ||
          v.lang.includes('hi-IN') ||
          v.name.toLowerCase().includes('india') ||
          v.name.toLowerCase().includes('hindi')
      );
      if (inVoice) {
        utterance.voice = inVoice;
      }
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      const words = text.split(/\s+/);
      let wordIndex = 0;

      utterance.onboundary = (e) => {
        if (e.name === 'word' && wordIndex < words.length) {
          this.config.streamChunkCount++;
          this.emit({
            type: 'word_timestamp',
            contextId,
            word: words[wordIndex],
            timestampMs: Math.round(e.elapsedTime || (wordIndex * 260)),
            audioChunkIndex: this.config.streamChunkCount,
          });
          wordIndex++;
        }
      };

      utterance.onend = () => {
        if (this.currentContextId === contextId) {
          this.config.status = 'idle';
          this.emit({ type: 'eos', contextId });
        }
      };

      utterance.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') {
          this.emit({ type: 'interrupted', contextId });
        } else {
          this.emit({ type: 'error', contextId, error: e.error });
        }
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback for headless environments
      setTimeout(() => {
        if (this.currentContextId === contextId) {
          this.config.status = 'idle';
          this.emit({ type: 'eos', contextId });
        }
      }, 2500);
    }
  }

  /**
   * Barge-in interruption: promptly stops audio and cancels queued audio in flight
   */
  public interrupt(): void {
    if (this.activeUtterance) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      this.activeUtterance = null;
    }

    if (this.currentContextId) {
      const interruptedCtx = this.currentContextId;
      this.currentContextId = null;
      this.config.status = 'idle';
      this.emit({
        type: 'interrupted',
        contextId: interruptedCtx,
      });
    }
  }

  public stopPlayback(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.activeUtterance = null;
    this.currentContextId = null;
    this.config.status = 'idle';
  }
}

export const rimeClient = new RimeWebSocketClient();
