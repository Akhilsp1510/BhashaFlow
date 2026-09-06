// BhashaFlow Core Type Contracts
// Preserves code-switched Hindi-English semantic state, entities, and Rime TTS telemetry

export type SupportedLanguage = 'hi' | 'en' | 'mixed' | 'uncertain';
export type ScriptType = 'devanagari' | 'latin';
export type ResponseMode = 'mirror_mix' | 'english' | 'hindi' | 'clarify';

export interface LanguageSegment {
  id: string;
  text: string;
  language: SupportedLanguage;
  script: ScriptType;
  startMs: number;
  endMs: number;
  confidence: number; // 0 to 1
  isEntity?: boolean;
}

export interface ProtectedEntity {
  id: string;
  key: string;
  label: string;
  value: string;
  rawSpoken: string;
  category: 'id' | 'amount' | 'constraint' | 'name' | 'date' | 'status';
  confidence: number;
  status: 'protected' | 'needs_confirmation' | 'corrected';
  clarificationPrompt?: string;
}

export interface SemanticState {
  intent: string;
  intentConfidence: number;
  entities: Record<string, string>;
  protectedEntitiesList: ProtectedEntity[];
  constraints: string[];
  reason: string;
  responseMode: ResponseMode;
  confidence: number;
  rawNormalizedText: string;
}

export interface MultilingualTurn {
  id: string;
  speaker: 'user' | 'agent';
  timestamp: string;
  rawTranscript: string;
  segments: LanguageSegment[];
  normalizedMeaning?: string;
  intent?: string;
  entities?: Record<string, string>;
  responseMode?: ResponseMode;
  confidence?: number;
  wasInterrupted?: boolean;
  audioDurationMs?: number;
  rimeContextId?: string;
}

export type VoiceState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'listening'
  | 'understanding'
  | 'checking'
  | 'speaking'
  | 'clarifying'
  | 'interrupted'
  | 'error'
  | 'reconnecting';

export interface VoiceStateMeta {
  state: VoiceState;
  label: string;
  subtext: string;
  color: string;
}

export type WorkflowStepStatus = 'idle' | 'pending' | 'active' | 'completed' | 'warning' | 'failed';

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: WorkflowStepStatus;
  timestampMs?: number;
  detail?: string;
}

export interface RimeRuntimeConfig {
  modelId: string;
  speaker: string;
  language: string;
  endpoint: string;
  audioFormat: string;
  transport: string;
  segmentMode: string;
  verificationDate: string;
  status: 'idle' | 'streaming' | 'active' | 'fallback' | 'error';
  isFallback: boolean;
  activeContextId?: string;
  timeToFirstAudioMs?: number;
  streamChunkCount: number;
}

export interface LatencyBreakdown {
  sttMs: number | null;
  languageIdMs: number | null;
  intentReasoningMs: number | null;
  toolExecutionMs: number | null;
  rimeTtsMs: number | null;
  ttfaMs: number | null; // Time To First Audio
  totalMs: number | null;
  isMeasured: boolean;
  measurementCondition: 'measured' | 'fixture_scenario' | 'not_measured';
}

export interface SessionTraceEvent {
  id: string;
  timestamp: string;
  relativeMs: number;
  eventType:
    | 'session.connected'
    | 'session.disconnected'
    | 'user.started_speaking'
    | 'user.stopped_speaking'
    | 'user.paused_speaking'
    | 'user.resumed_speaking'
    | 'user.long_silence'
    | 'user.pause_continue'
    | 'user.pause_send'
    | 'user.pause_discard'
    | 'user.text_input'
    | 'stt.partial'
    | 'stt.final'
    | 'language.segment.detected'
    | 'entity.protected'
    | 'entity.confirmation_required'
    | 'intent.detected'
    | 'tool.executed'
    | 'workflow.updated'
    | 'rime.request.started'
    | 'rime.first_audio'
    | 'rime.streaming_complete'
    | 'session.interrupted'
    | 'session.clarification_requested'
    | 'session.error';
  label: string;
  payload?: Record<string, unknown>;
  level: 'info' | 'success' | 'warning' | 'error';
}

export type TestCaseCategory =
  | 'Monolingual'
  | 'English → Hindi'
  | 'Hindi → English'
  | 'Intra-sentence'
  | 'Phrase-level'
  | 'Multiple switches'
  | 'Romanized Hindi'
  | 'Mixed script'
  | 'Spoken numbers'
  | 'Corrections'
  | 'False starts'
  | 'Noise'
  | 'Fast speech'
  | 'Explicit language change'
  | 'Interruption';

export interface TestCase {
  id: string;
  category: TestCaseCategory;
  input: string;
  expectedIntent: string;
  expectedEntities: Record<string, string>;
  expectedConstraints?: string[];
  expectedResponseMode: ResponseMode;
  actualResult?: {
    intent: string;
    entities: Record<string, string>;
    responseMode: ResponseMode;
    preservedEntitiesMatch: boolean;
    workflowSuccess: boolean;
  };
  status: 'PASS' | 'FAIL' | 'NOT_RUN';
  latencyMs?: number;
  failureReason?: string;
  isStressCase?: boolean;
}

export interface BaselineMetricRow {
  metric: string;
  manualSelection: { value: string; note: string };
  dominantLanguage: { value: string; note: string };
  bhashaFlow: { value: string; note: string };
}

export interface EvaluationSummary {
  totalCases: number;
  completedCases: number;
  passedCases: number;
  failedCases: number;
  taskCompletionRate: number | null;
  entityAccuracy: number | null;
  intentAccuracy: number | null;
  languageAccuracy: number | null;
  switchBoundaryF1: number | null;
  rimeSuccessRate: number | null;
  firstAudioLatencyP50Ms: number | null;
  humanIntelligibilityMos: number | null;
  humanNaturalnessMos: number | null;
  isMeasured: boolean;
}

export interface DemoScenarioPreset {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  userInput: string;
  badge: string;
  expectedOutcome: {
    intent: string;
    complaintId: string;
    constraint: string;
    reason: string;
    responseMode: ResponseMode;
    agentResponse: string;
  };
  stressType?: string;
}
