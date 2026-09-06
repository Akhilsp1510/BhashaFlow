/**
 * ============================================================
 * BhashaFlow — Backend Client Bridge
 * ============================================================
 *
 * HOW TO CONNECT YOUR BACKEND (for backend team):
 * ------------------------------------------------
 * 1. Set BASE_URL to your backend WebSocket server URL.
 *    e.g. 'ws://localhost:8000' or 'wss://your-api.onrender.com'
 *
 * 2. The frontend will send messages in this format:
 *    { type: 'transcribe', audio: Base64String, language: 'hi-en' }
 *    { type: 'nlp', text: string }
 *    { type: 'tts', text: string, voice: string }
 *
 * 3. The backend should respond with messages in this format:
 *    { type: 'transcript', text: string, segments: LanguageSegment[] }
 *    { type: 'semantic', intent: string, entities: Record<string,string>, confidence: number }
 *    { type: 'tts_audio', audio: Base64String, ttfaMs: number }
 *    { type: 'error', message: string }
 *
 * 4. If your backend uses REST (not WebSocket), use the HTTP helpers below.
 *
 * 5. Set MOCK_MODE = false when backend is ready. In mock mode,
 *    the frontend runs entirely with simulated data (current state).
 * ============================================================
 */

// ─── Configuration ──────────────────────────────────────────────────────────

/**
 * Set this to your backend server URL.
 * Change 'localhost:8000' to your actual server address.
 */
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'ws://localhost:8000';

/**
 * HTTP REST base URL (if your backend uses REST instead of WebSocket)
 * e.g. 'http://localhost:8000/api' or 'https://your-api.com/api'
 */
const HTTP_BASE_URL = import.meta.env.VITE_BACKEND_HTTP_URL || 'http://localhost:8000/api';

/**
 * Set to true to run entirely in frontend mock mode (no backend needed).
 * Set to false when your backend is ready to connect.
 */
const MOCK_MODE = true;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LanguageSegment {
  text: string;
  language: 'hi' | 'en' | 'mixed';
  isEntity: boolean;
}

export interface TranscriptResult {
  text: string;
  segments: LanguageSegment[];
  confidence: number;
}

export interface SemanticResult {
  intent: string;
  entities: Record<string, string>;
  confidence: number;
  responseMode: 'hindi' | 'english' | 'mirror_mix';
  constraints: string[];
}

export interface TTSResult {
  audioBase64?: string; // base64 encoded audio
  ttfaMs: number;       // time to first audio in ms
}

export interface BackendMessage {
  type: 'transcript' | 'semantic' | 'tts_audio' | 'error' | 'status';
  payload: unknown;
}

// ─── Event Listener Types ─────────────────────────────────────────────────────

type MessageHandler = (message: BackendMessage) => void;
type ConnectionHandler = (connected: boolean) => void;

// ─── Backend Client Class ─────────────────────────────────────────────────────

class BackendClient {
  private ws: WebSocket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isConnected = false;

  // ── Connection ────────────────────────────────────────────────────────────

  /**
   * Connect to the WebSocket backend.
   * Called automatically when needed; you can also call manually.
   */
  connect(): void {
    if (MOCK_MODE) {
      console.info('[BackendClient] MOCK_MODE=true — running without backend');
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      this.ws = new WebSocket(BASE_URL);

      this.ws.onopen = () => {
        this.isConnected = true;
        console.info('[BackendClient] Connected to backend at', BASE_URL);
        this.connectionHandlers.forEach((h) => h(true));
      };

      this.ws.onmessage = (event) => {
        try {
          const msg: BackendMessage = JSON.parse(event.data as string);
          this.messageHandlers.forEach((h) => h(msg));
        } catch {
          console.error('[BackendClient] Failed to parse message:', event.data);
        }
      };

      this.ws.onerror = (err) => {
        console.error('[BackendClient] WebSocket error:', err);
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.connectionHandlers.forEach((h) => h(false));
        console.warn('[BackendClient] Disconnected — retrying in 3s...');
        this.reconnectTimer = setTimeout(() => this.connect(), 3000);
      };
    } catch (err) {
      console.error('[BackendClient] Could not open WebSocket:', err);
    }
  }

  disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
    this.isConnected = false;
  }

  // ── Send Messages ─────────────────────────────────────────────────────────

  private send(data: object): void {
    if (MOCK_MODE) return;
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('[BackendClient] Not connected — message dropped');
    }
  }

  /**
   * Send audio data for transcription.
   * @param audioBase64 - Base64 encoded audio (PCM 16kHz mono)
   * @param language - Hint: 'hi-en' for Hinglish, 'hi', 'en'
   */
  sendAudioForTranscription(audioBase64: string, language = 'hi-en'): void {
    this.send({ type: 'transcribe', audio: audioBase64, language });
  }

  /**
   * Send text for NLP processing (intent, entity extraction).
   * @param text - The user's transcript text
   */
  sendTextForNLP(text: string): void {
    this.send({ type: 'nlp', text });
  }

  /**
   * Request TTS synthesis for agent response.
   * @param text - Text to synthesize (can be Hinglish)
   * @param voice - Voice ID (e.g. 'seraphina', 'mist')
   */
  requestTTS(text: string, voice = 'seraphina'): void {
    this.send({ type: 'tts', text, voice });
  }

  // ── HTTP REST Helpers (if backend uses REST) ──────────────────────────────

  /**
   * POST to a backend REST endpoint.
   * Use this if your backend uses HTTP instead of WebSocket.
   *
   * Example:
   *   const result = await backendClient.post<SemanticResult>('/nlp', { text: 'mera complaint 4812' });
   */
  async post<T>(endpoint: string, body: object): Promise<T> {
    const res = await fetch(`${HTTP_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Backend error: ${res.status} ${res.statusText}`);
    return res.json() as Promise<T>;
  }

  /**
   * GET from a backend REST endpoint.
   */
  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${HTTP_BASE_URL}${endpoint}`);
    if (!res.ok) throw new Error(`Backend error: ${res.status} ${res.statusText}`);
    return res.json() as Promise<T>;
  }

  // ── High-Level API Calls ──────────────────────────────────────────────────

  /**
   * Process user speech through the full pipeline.
   * In MOCK_MODE: returns simulated data immediately.
   * In LIVE_MODE: sends to backend via WebSocket/REST.
   */
  async processUserSpeech(text: string): Promise<SemanticResult | null> {
    if (MOCK_MODE) {
      return {
        intent: 'check_complaint',
        entities: { complaint_id: '4812' },
        confidence: 0.96,
        responseMode: 'mirror_mix',
        constraints: ['DO NOT CLOSE'],
      };
    }
    try {
      // Switch to REST: return await this.post<SemanticResult>('/process', { text });
      this.sendTextForNLP(text);
      return null;
    } catch (err) {
      console.error('[BackendClient] processUserSpeech error:', err);
      return null;
    }
  }

  /**
   * Get agent response text for an intent.
   * In MOCK_MODE: returns simulated response.
   * In LIVE_MODE: calls backend /respond endpoint.
   */
  async getAgentResponse(_intent: string, entities: Record<string, string>): Promise<string | null> {
    if (MOCK_MODE) {
      return `Samajh gaya. Complaint ${entities.complaint_id || ''} open rahega — I'll note the issue is still happening.`;
    }
    try {
      // Switch to REST: const r = await this.post<{ response: string }>('/respond', { intent, entities });
      // return r.response;
      return null;
    } catch (err) {
      console.error('[BackendClient] getAgentResponse error:', err);
      return null;
    }
  }

  // ── Event Subscriptions ───────────────────────────────────────────────────

  /**
   * Subscribe to backend messages. Returns unsubscribe function.
   *
   * Usage:
   *   const unsub = backendClient.onMessage((msg) => {
   *     if (msg.type === 'semantic') { ... }
   *   });
   *   // Later: unsub();
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  /** Subscribe to connection state changes. */
  onConnectionChange(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    return () => this.connectionHandlers.delete(handler);
  }

  get connected(): boolean { return this.isConnected; }
  get mockMode(): boolean { return MOCK_MODE; }
  get serverUrl(): string { return BASE_URL; }
}

// ── Singleton Export ──────────────────────────────────────────────────────────

/**
 * Shared backend client instance.
 * Import anywhere:
 *   import { backendClient } from '../services/backendClient';
 */
export const backendClient = new BackendClient();

export const BACKEND_CONFIG = {
  mockMode: MOCK_MODE,
  wsUrl: BASE_URL,
  httpUrl: HTTP_BASE_URL,
};
