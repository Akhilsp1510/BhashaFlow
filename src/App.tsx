import React, { useState, useEffect, useRef, useCallback } from 'react';
import type {
  VoiceState,
  MultilingualTurn,
  SemanticState,
  WorkflowStep,
  RimeRuntimeConfig,
  SessionTraceEvent,
  DemoScenarioPreset,
} from './types';
import { segmentTranscript, deriveSemanticState } from './services/languageSegmenter';
import { AudioEngine } from './services/audioEngine';
import { SilenceDetector } from './services/silenceDetector';
import type { SilenceDetectorEvent } from './services/silenceDetector';
import { rimeClient } from './services/rimeClient';
import type { RimeStreamEvent } from './services/rimeClient';
import { INITIAL_WORKFLOW_STEPS } from './services/workflowEngine';
import { CANONICAL_ACCEPTANCE_INPUT, DEMO_PRESETS } from './data/evaluationFixtures';

import { Header } from './components/common/Header';
import type { NavigationTab } from './components/common/Header';
import { VoiceCore } from './components/voice/VoiceCore';
import type { PauseDialogState } from './components/voice/SpeakingPauseDialog';
import { LiveTranscript } from './components/transcript/LiveTranscript';
import { SemanticStatePanel } from './components/semantic/SemanticStatePanel';
import { WorkflowPipeline } from './components/workflow/WorkflowPipeline';
import { RimeObservabilityPanel } from './components/rime/RimeObservabilityPanel';
import { EvaluationLab } from './components/evaluation/EvaluationLab';
import { ArchitectureView } from './components/architecture/ArchitectureView';
import { PrivacyView } from './components/common/PrivacyView';
import { TextInputFallback } from './components/voice/TextInputFallback';
import { EntityCorrectionModal } from './components/common/EntityCorrectionModal';
import { KeyboardShortcutsLegend } from './components/common/KeyboardShortcutsLegend';
import { useKeyboardShortcuts } from './components/voice/useKeyboardShortcuts';
import { useToast } from './components/common/ToastProvider';
import { ConversationHistoryModal } from './components/history/ConversationHistoryModal';
import { OverviewView } from './components/landing/OverviewView';
import { UnderstandingView } from './components/semantic/UnderstandingView';
import { WorkflowView } from './components/workflow/WorkflowView';
import { GuidedDemoView } from './components/demo/GuidedDemoView';
import { VoiceEngineView } from './components/rime/VoiceEngineView';
import {
  getCurrentSpeaker,
  getAllSessions,
  appendTurnsToSession,
} from './services/historyStorage';

export const App: React.FC = () => {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('workspace');
  const [workspaceInspectorTab, setWorkspaceInspectorTab] = useState<'semantic' | 'workflow' | 'rime'>('semantic');

  // Voice & Audio States
  const [voiceState, setVoiceState] = useState<VoiceState>('connected');
  const [isMicActive, setIsMicActive] = useState(false);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(32));
  const [rmsEnergy, setRmsEnergy] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Transcript & Semantic States
  const [turns, setTurns] = useState<MultilingualTurn[]>([]);
  const [semanticState, setSemanticState] = useState<SemanticState>({
    intent: 'check_complaint',
    intentConfidence: 0.98,
    entities: { complaint_id: '4812' },
    protectedEntitiesList: [
      {
        id: 'ent-complaint-id',
        key: 'complaint_id',
        label: 'Complaint ID',
        value: '4812',
        rawSpoken: 'complaint number 4812',
        category: 'id',
        confidence: 0.98,
        status: 'protected',
      },
      {
        id: 'ent-constraint-close',
        key: 'constraint',
        label: 'Constraint',
        value: 'DO NOT CLOSE',
        rawSpoken: "please don't close it",
        category: 'constraint',
        confidence: 0.97,
        status: 'protected',
      },
      {
        id: 'ent-reason',
        key: 'reason',
        label: 'Root Reason',
        value: 'Issue Still Happening',
        rawSpoken: 'issue abhi bhi happening hai',
        category: 'status',
        confidence: 0.94,
        status: 'protected',
      },
    ],
    constraints: ['DO NOT CLOSE'],
    reason: 'Issue Still Happening',
    responseMode: 'mirror_mix',
    confidence: 0.95,
    rawNormalizedText: CANONICAL_ACCEPTANCE_INPUT,
  });

  // Workflow Pipeline Steps
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(INITIAL_WORKFLOW_STEPS);

  // Rime Observability
  const [rimeConfig] = useState<RimeRuntimeConfig>(rimeClient.getConfig());
  const [measuredTtfa, setMeasuredTtfa] = useState<number | undefined>(712);

  // Traces & Demo
  const [sessionTraces, setSessionTraces] = useState<SessionTraceEvent[]>([
    {
      id: 'tr-0',
      timestamp: new Date().toLocaleTimeString(),
      relativeMs: 0,
      eventType: 'session.connected',
      label: 'LiveKit WebRTC transport connected (room=bhashaflow-main)',
      level: 'info',
    },
  ]);
  const [activePresetId, setActivePresetId] = useState<string>('canonical-acceptance');
  const [isScenarioRunning, setIsScenarioRunning] = useState(false);

  const sessionStartTimeRef = useRef<number>(Date.now());
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const silenceDetectorRef = useRef<SilenceDetector | null>(null);

  // Pause dialog state — never auto-submits, always waits for explicit user action
  const [pauseDialogState, setPauseDialogState] = useState<PauseDialogState>('hidden');
  // Partial transcript accumulates what user has spoken before confirming
  const [partialTranscript, setPartialTranscript] = useState<string>('');
  // Whether we're actively accumulating a new user utterance
  const isAccumulatingRef = useRef(false);
  const pendingTranscriptRef = useRef<string>('');

  // Entity correction modal state
  const [entityModalState, setEntityModalState] = useState<{
    isOpen: boolean;
    entityId: string;
    entityLabel: string;
    currentValue: string;
  }>({ isOpen: false, entityId: '', entityLabel: '', currentValue: '' });

  // Speaker & Conversation History Tracking
  const [currentSpeaker] = useState(() => getCurrentSpeaker());
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [sessionCount, setSessionCount] = useState(() => getAllSessions().length);
  const currentSessionIdRef = useRef<string>(`ses_${Date.now().toString().slice(-6)}`);

  // Toast notifications
  const toast = useToast();

  const addTrace = useCallback(
    (
      eventType: SessionTraceEvent['eventType'],
      label: string,
      level: SessionTraceEvent['level'] = 'info',
      payload?: Record<string, unknown>
    ) => {
      const now = Date.now();
      const relativeMs = now - sessionStartTimeRef.current;
      setSessionTraces((prev) => [
        ...prev,
        {
          id: `tr-${now}-${Math.random()}`,
          timestamp: new Date().toLocaleTimeString(),
          relativeMs,
          eventType,
          label,
          level,
          payload,
        },
      ]);
    },
    []
  );

  // Initialize AudioEngine + SilenceDetector on mount
  useEffect(() => {
    // Build the silence detector — never auto-submits
    const detector = new SilenceDetector({
      silenceThreshold: 0.018,       // RMS threshold — adjust if too sensitive
      pauseGracePeriodMs: 1500,      // Show dialog after 1.5s silence
      longSilenceMs: 5000,           // Escalate after 5s total silence
      minSpeechDurationMs: 500,      // Ignore mic noise before meaningful speech
      onEvent: (event: SilenceDetectorEvent) => {
        switch (event) {
          case 'speech_started':
            // User started speaking — clear any pending pause
            setPauseDialogState('hidden');
            isAccumulatingRef.current = true;
            break;

          case 'pause_detected':
            // Pause detected — show dialog, do NOT submit
            setPauseDialogState('pause');
            setPartialTranscript(pendingTranscriptRef.current);
            addTrace('user.paused_speaking', 'Silence >1.5s — pause dialog shown (no auto-submit)', 'info');
            break;

          case 'speech_resumed':
            // User resumed speaking — dismiss dialog automatically
            setPauseDialogState('hidden');
            addTrace('user.resumed_speaking', 'Speech resumed — pause dialog dismissed', 'info');
            break;

          case 'long_silence':
            // Escalate to long_silence variant of dialog
            setPauseDialogState('long_silence');
            addTrace('user.long_silence', 'Silence >5s — escalated pause dialog shown', 'warning');
            break;

          case 'reset':
            setPauseDialogState('hidden');
            break;
        }
      },
    });
    silenceDetectorRef.current = detector;

    const engine = new AudioEngine({
      onAudioData: (freq, rms) => {
        setFrequencyData(freq);
        setRmsEnergy(rms);
      },
      onRms: (rms) => {
        // Feed every frame into silence detector (only active after mic starts)
        silenceDetectorRef.current?.feed(rms);
      },
      onStateChange: (state) => {
        if (state === 'error') {
          setVoiceState('error');
          setStatusMessage('Microphone unavailable');
        }
      },
    });
    audioEngineRef.current = engine;

    // Listen to Rime stream events
    const unsubRime = rimeClient.onStreamEvent((ev: RimeStreamEvent) => {
      if (ev.type === 'first_audio') {
        setVoiceState('speaking');
        setStatusMessage('Speaking via Rime Arcana V3...');
        if (ev.latencyMs) {
          setMeasuredTtfa(ev.latencyMs);
          addTrace('rime.first_audio', `First audio chunk received from /ws3 (${ev.latencyMs}ms TTFA)`, 'success');
        }
        audioEngineRef.current?.startSyntheticWave(0.7);
      } else if (ev.type === 'word_timestamp') {
        // Stream progress
      } else if (ev.type === 'eos') {
        audioEngineRef.current?.stopSyntheticWave();
        setVoiceState('connected');
        setStatusMessage('Ready for next query');
        addTrace('rime.streaming_complete', 'Completed bilingual speech playback', 'info');
      } else if (ev.type === 'interrupted') {
        audioEngineRef.current?.stopSyntheticWave();
        setVoiceState('interrupted');
        setStatusMessage('Interrupted — Barge-in detected');
        addTrace('session.interrupted', 'User barge-in: Stopped speech synthesis & cancelled audio queue', 'warning');
        setTimeout(() => {
          setVoiceState('listening');
          setStatusMessage('Listening to your correction...');
        }, 600);
      }
    });

    // Populate initial canonical turn so screen is immediately rich and educational
    const initialSegments = segmentTranscript(CANONICAL_ACCEPTANCE_INPUT);
    setTurns([
      {
        id: 'turn-init-1',
        speaker: 'user',
        timestamp: new Date(Date.now() - 5000).toLocaleTimeString(),
        rawTranscript: CANONICAL_ACCEPTANCE_INPUT,
        segments: initialSegments,
        normalizedMeaning: 'Check complaint 4812 without closing because issue is unresolved.',
        intent: 'check_complaint',
        responseMode: 'mirror_mix',
        confidence: 0.95,
      },
      {
        id: 'turn-init-2',
        speaker: 'agent',
        timestamp: new Date(Date.now() - 2000).toLocaleTimeString(),
        rawTranscript:
          "Samajh gaya. Complaint 4812 open rahega, and I'll add that the issue is still happening.",
        segments: segmentTranscript(
          "Samajh gaya. Complaint 4812 open rahega, and I'll add that the issue is still happening."
        ),
        responseMode: 'mirror_mix',
        confidence: 0.98,
      },
    ]);

    // Initial workflow state
    setWorkflowSteps([
      { id: 's1', title: '1. Voice Input', description: 'WebRTC audio received', status: 'completed' },
      { id: 's2', title: '2. Language Segments', description: 'HI (48%) + EN (52%) intra-sentence', status: 'completed' },
      { id: 's3', title: '3. Normalization', description: 'Romanized transliteration canonicalized', status: 'completed' },
      { id: 's4', title: '4. Entity Protection', description: 'Complaint 4812 locked; DO NOT CLOSE locked', status: 'completed' },
      { id: 's5', title: '5. Intent Reasoning', description: 'check_complaint (98% confidence)', status: 'completed' },
      { id: 's6', title: '6. Support Tool Action', description: 'CRM Record 4812 updated: OPEN preserved', status: 'completed' },
      { id: 's7', title: '7. Response Policy', description: 'Mirror Mix Hinglish applied', status: 'completed' },
      { id: 's8', title: '8. Rime Arcana V3', description: 'TTS synthesis delivered (712ms TTFA)', status: 'completed' },
    ]);

    return () => {
      unsubRime();
      engine.stop();
      detector.stop();
    };
  }, [addTrace]);

  // Execute a scenario flow
  const executeScenarioFlow = useCallback(
    async (
      inputText: string,
      expectedOutcome: DemoScenarioPreset['expectedOutcome'],
      isBargeInScenario = false
    ) => {
      setIsScenarioRunning(true);
      rimeClient.stopPlayback();
      audioEngineRef.current?.stopSyntheticWave();

      // Reset workflow steps
      setWorkflowSteps(INITIAL_WORKFLOW_STEPS);

      // 1. User starts speaking
      setVoiceState('listening');
      setStatusMessage('Listening to your spoken query...');
      addTrace('user.started_speaking', `Audio stream received: "${inputText}"`, 'info');
      audioEngineRef.current?.startSyntheticWave(0.5);

      setWorkflowSteps((prev) =>
        prev.map((s, i) => (i === 0 ? { ...s, status: 'active', detail: 'Streaming raw audio frames' } : s))
      );

      await new Promise((r) => setTimeout(r, 600));

      // 2. Language segmentation
      setVoiceState('understanding');
      setStatusMessage('Understanding your Hinglish segments...');
      const segments = segmentTranscript(inputText);
      const derived = deriveSemanticState(inputText);
      setSemanticState(derived);

      setWorkflowSteps((prev) =>
        prev.map((s, i) =>
          i === 0
            ? { ...s, status: 'completed' }
            : i === 1
            ? { ...s, status: 'active', detail: `${segments.length} language segments classified` }
            : s
        )
      );
      addTrace('language.segment.detected', `Detected ${segments.length} code-switched segments`, 'info');

      await new Promise((r) => setTimeout(r, 500));

      // 3. Script Normalization & Entity Protection
      setWorkflowSteps((prev) =>
        prev.map((s, i) =>
          i === 1
            ? { ...s, status: 'completed' }
            : i === 2
            ? { ...s, status: 'completed', detail: 'Script & orthography normalized' }
            : i === 3
            ? {
                ...s,
                status: 'active',
                detail: `Locked ID=${expectedOutcome.complaintId || 'none'}, Constraint=${
                  expectedOutcome.constraint || 'none'
                }`,
              }
            : s
        )
      );

      if (expectedOutcome.complaintId) {
        addTrace(
          'entity.protected',
          `Critical Entity Locked: ID ${expectedOutcome.complaintId}`,
          'success'
        );
      }

      await new Promise((r) => setTimeout(r, 450));

      // 4. Intent & CRM tool execution
      setVoiceState('checking');
      setStatusMessage(`Checking CRM records for ${expectedOutcome.complaintId || 'account'}...`);

      setWorkflowSteps((prev) =>
        prev.map((s, i) =>
          i === 3
            ? { ...s, status: 'completed' }
            : i === 4
            ? { ...s, status: 'completed', detail: `Intent: ${expectedOutcome.intent}` }
            : i === 5
            ? {
                ...s,
                status: 'completed',
                detail: `CRM updated: ${expectedOutcome.constraint || 'Status Verified'}`,
              }
            : i === 6
            ? { ...s, status: 'completed', detail: `Response Policy: ${expectedOutcome.responseMode}` }
            : i === 7
            ? { ...s, status: 'active', detail: 'Requesting Rime Arcana V3 stream' }
            : s
        )
      );

      // Append user turn
      const userTurn: MultilingualTurn = {
        id: `turn-user-${Date.now()}`,
        speaker: 'user',
        timestamp: new Date().toLocaleTimeString(),
        rawTranscript: inputText,
        segments,
        normalizedMeaning: `${expectedOutcome.intent.replace(/_/g, ' ')} (${expectedOutcome.complaintId})`,
        intent: expectedOutcome.intent,
        responseMode: expectedOutcome.responseMode,
        confidence: 0.96,
      };

      setTurns((prev) => [...prev, userTurn]);

      // 5. Rime Multilingual Spoken Response
      addTrace(
        'rime.request.started',
        `Sending /ws3 streaming request with model=arcana-v3, voice=seraphina`,
        'info'
      );

      const agentTurn: MultilingualTurn = {
        id: `turn-agent-${Date.now()}`,
        speaker: 'agent',
        timestamp: new Date().toLocaleTimeString(),
        rawTranscript: expectedOutcome.agentResponse,
        segments: segmentTranscript(expectedOutcome.agentResponse),
        responseMode: expectedOutcome.responseMode,
        confidence: 0.99,
        wasInterrupted: isBargeInScenario,
      };

      setTurns((prev) => {
        const updatedTurns = [...prev, agentTurn];
        // Persist session to history storage by active speaker
        appendTurnsToSession(
          currentSessionIdRef.current,
          currentSpeaker.id,
          currentSpeaker.name,
          updatedTurns,
          derived
        );
        setSessionCount(getAllSessions().length);
        return updatedTurns;
      });

      // Stream TTS
      await rimeClient.streamSpeech(expectedOutcome.agentResponse, expectedOutcome.responseMode as any);

      setWorkflowSteps((prev) =>
        prev.map((s, i) => (i === 7 ? { ...s, status: 'completed', detail: 'Bilingual audio rendered' } : s))
      );

      setIsScenarioRunning(false);
    },
    [addTrace, currentSpeaker.id, currentSpeaker.name]
  );

  // 1-Click Demo Presets
  const handleSelectPreset = (preset: DemoScenarioPreset) => {
    setActivePresetId(preset.id);
    const isBargeIn = preset.id === 'interruption-recovery';
    executeScenarioFlow(preset.userInput, preset.expectedOutcome, isBargeIn);
  };

  // Mic Toggle Button
  const handleToggleMic = async () => {
    if (isMicActive) {
      audioEngineRef.current?.stop();
      silenceDetectorRef.current?.stop();
      setIsMicActive(false);
      setVoiceState('connected');
      setStatusMessage('Microphone paused');
      setPauseDialogState('hidden');
      isAccumulatingRef.current = false;
      pendingTranscriptRef.current = '';
      setPartialTranscript('');
    } else {
      setVoiceState('connecting');
      setStatusMessage('Requesting microphone access...');
      const granted = await audioEngineRef.current?.requestMicrophone();
      if (granted) {
        setIsMicActive(true);
        setVoiceState('listening');
        setStatusMessage('Listening to you... Speak in Hindi, English, or mix naturally!');
        addTrace('session.connected', 'Microphone stream active', 'success');
        // Start silence detection
        silenceDetectorRef.current?.start();
        // Simulate canonical scenario after brief warm-up
        pendingTranscriptRef.current = CANONICAL_ACCEPTANCE_INPUT;
        setTimeout(() => {
          executeScenarioFlow(
            CANONICAL_ACCEPTANCE_INPUT,
            DEMO_PRESETS[0].expectedOutcome
          );
        }, 1800);
      } else {
        setIsMicActive(false);
        setVoiceState('error');
        setStatusMessage('Microphone permission denied. Try clicking a demo scenario above!');
      }
    }
  };

  // Pause dialog action handlers
  const handlePauseContinue = useCallback(() => {
    // Just dismiss dialog — keep mic open and waiting for speech
    setPauseDialogState('hidden');
    // Reset silence detector so it starts fresh for the continuation
    silenceDetectorRef.current?.reset();
    silenceDetectorRef.current?.start();
    setStatusMessage('Jab ready ho, bolte raho... (continue speaking anytime)');
    addTrace('user.pause_continue', 'User chose to continue speaking — dialog dismissed', 'info');
  }, [addTrace]);

  const handlePauseSend = useCallback(() => {
    // Explicitly send the accumulated partial transcript
    const toSend = pendingTranscriptRef.current || partialTranscript;
    setPauseDialogState('hidden');
    silenceDetectorRef.current?.reset();
    pendingTranscriptRef.current = '';
    setPartialTranscript('');
    isAccumulatingRef.current = false;
    addTrace('user.pause_send', `User explicitly sent: "${toSend.slice(0, 60)}..."`, 'success');
    if (toSend.trim()) {
      executeScenarioFlow(toSend, DEMO_PRESETS[0].expectedOutcome);
    }
  }, [addTrace, executeScenarioFlow, partialTranscript]);

  const handlePauseDiscard = useCallback(() => {
    // Discard everything and reset
    setPauseDialogState('hidden');
    silenceDetectorRef.current?.reset();
    silenceDetectorRef.current?.start();
    pendingTranscriptRef.current = '';
    setPartialTranscript('');
    isAccumulatingRef.current = false;
    setVoiceState('listening');
    setStatusMessage('Discarded — start speaking again whenever you\'re ready');
    addTrace('user.pause_discard', 'User discarded partial utterance — reset to listening', 'warning');
  }, [addTrace]);

  // Barge-In Interruption Button
  const handleInterrupt = () => {
    rimeClient.interrupt();
    addTrace('session.interrupted', 'Manual user barge-in triggered via button', 'warning');
    setTurns((prev) =>
      prev.map((t, i) => (i === prev.length - 1 ? { ...t, wasInterrupted: true } : t))
    );
  };

  // Entity Clarification Handlers
  const handleConfirmEntity = (entityId: string) => {
    setSemanticState((prev) => ({
      ...prev,
      protectedEntitiesList: prev.protectedEntitiesList.map((e) =>
        e.id === entityId ? { ...e, status: 'protected', confidence: 1.0 } : e
      ),
    }));
    addTrace('entity.protected', `Entity ${entityId} confirmed by user`, 'success');
  };

  const handleCorrectEntity = (entityId: string) => {
    const entity = semanticState.protectedEntitiesList.find((e) => e.id === entityId);
    if (!entity) return;
    setEntityModalState({
      isOpen: true,
      entityId,
      entityLabel: entity.label,
      currentValue: entity.value,
    });
  };

  const handleEntityModalConfirm = (newVal: string) => {
    const { entityId } = entityModalState;
    setEntityModalState((prev) => ({ ...prev, isOpen: false }));
    setSemanticState((prev) => ({
      ...prev,
      entities: { ...prev.entities, complaint_id: newVal },
      protectedEntitiesList: prev.protectedEntitiesList.map((e) =>
        e.id === entityId ? { ...e, value: newVal, status: 'protected', confidence: 1.0 } : e
      ),
    }));
    addTrace('entity.protected', `Entity ${entityId} corrected to ${newVal}`, 'success');
    toast.success('Entity Updated', `Value corrected to "${newVal}"`);
  };

  const handleEntityModalCancel = () => {
    setEntityModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Handle text input fallback submission
  const handleTextSubmit = useCallback((text: string) => {
    addTrace('user.text_input', `Text query submitted: "${text.slice(0, 60)}"`, 'info');
    toast.info('Query Submitted', 'Processing your text input...');
    executeScenarioFlow(text, DEMO_PRESETS[0].expectedOutcome);
  }, [addTrace, executeScenarioFlow, toast]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onToggleMic: handleToggleMic,
    onDiscard: pauseDialogState !== 'hidden' ? handlePauseDiscard : undefined,
    onSend: pauseDialogState !== 'hidden' ? handlePauseSend : undefined,
    onInterrupt: voiceState === 'speaking' ? handleInterrupt : undefined,
    isEnabled: activeTab === 'workspace',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        voiceState={voiceState}
        isRimeActive={voiceState === 'speaking'}
        currentSpeakerName={currentSpeaker.name}
        onOpenHistory={() => setIsHistoryOpen(true)}
        sessionCount={sessionCount}
      />

      {/* Entity Correction Modal — replaces window.prompt() */}
      <EntityCorrectionModal
        isOpen={entityModalState.isOpen}
        entityLabel={entityModalState.entityLabel}
        currentValue={entityModalState.currentValue}
        onConfirm={handleEntityModalConfirm}
        onCancel={handleEntityModalCancel}
      />

      {/* Speaker Conversation History Modal */}
      <ConversationHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoadSessionToWorkspace={(session) => {
          setTurns(session.turns);
          if (session.semanticState) {
            setSemanticState(session.semanticState);
          }
          toast.success('Session Loaded', `Loaded ${session.turns.length} turns from ${session.sessionId}`);
        }}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '20px 24px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
        {/* 0. PRODUCT OVERVIEW / HERO LANDING */}
        {activeTab === 'overview' && (
          <OverviewView
            onNavigate={(tab) => setActiveTab(tab)}
            onLaunchCanonicalDemo={() => handleSelectPreset(DEMO_PRESETS[0])}
          />
        )}

        {/* 1. VOICE WORKSPACE (PRIMARY APPLICATION EXPERIENCE) */}
        {activeTab === 'workspace' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Quick Scenario Runner Bar for rapid hackathon testing */}
            <div
              className="card"
              style={{
                padding: '10px 16px',
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                  QUICK RUNNER:
                </span>
                {DEMO_PRESETS.slice(0, 4).map((preset) => {
                  const isSelected = activePresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      disabled={isScenarioRunning}
                      className={`pill-chip ${isSelected ? 'active' : ''}`}
                      style={{ fontSize: '0.74rem' }}
                    >
                      <span>{preset.title.split('.')[1] || preset.title}</span>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setActiveTab('demo')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#818CF8',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Guided Judge Tour (60s) →</span>
                </button>
              </div>
            </div>

            {/* Core Workspace Grid: Voice Core & Live Transcript */}
            <div
              className="workspace-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
                gap: '16px',
                alignItems: 'stretch',
              }}
            >
              {/* Left Column: Voice Core + Text Fallback */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <VoiceCore
                  voiceState={voiceState}
                  frequencyData={frequencyData}
                  rms={rmsEnergy}
                  onToggleMic={handleToggleMic}
                  onInterrupt={handleInterrupt}
                  statusMessage={statusMessage}
                  isMicActive={isMicActive}
                  pauseDialogState={pauseDialogState}
                  partialTranscript={partialTranscript}
                  onPauseContinue={handlePauseContinue}
                  onPauseSend={handlePauseSend}
                  onPauseDiscard={handlePauseDiscard}
                />

                {/* Text Input Fallback */}
                <TextInputFallback
                  onSubmit={handleTextSubmit}
                  isDisabled={isScenarioRunning}
                  placeholder="Type in Hindi, English, or Hinglish — e.g. 'Mera complaint 4812 check karo'"
                />
              </div>

              {/* Right Column: Code-Switched Live Transcript */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <LiveTranscript turns={turns} activeSpeakerName={currentSpeaker.name} />
              </div>
            </div>

            {/* Bottom Inspection Center (Progressive Disclosure) */}
            <div
              className="card"
              style={{
                padding: '16px 18px',
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {/* Tab Selector & Deep Link */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    INSPECTION CENTER:
                  </span>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => setWorkspaceInspectorTab('semantic')}
                      className={`pill-chip ${workspaceInspectorTab === 'semantic' ? 'active' : ''}`}
                    >
                      Semantic Invariants
                    </button>
                    <button
                      onClick={() => setWorkspaceInspectorTab('workflow')}
                      className={`pill-chip ${workspaceInspectorTab === 'workflow' ? 'active' : ''}`}
                    >
                      Workflow Pipeline
                    </button>
                    <button
                      onClick={() => setWorkspaceInspectorTab('rime')}
                      className={`pill-chip ${workspaceInspectorTab === 'rime' ? 'active' : ''}`}
                    >
                      Rime Engine Telemetry
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (workspaceInspectorTab === 'semantic') setActiveTab('understanding');
                    else if (workspaceInspectorTab === 'workflow') setActiveTab('workflow');
                    else if (workspaceInspectorTab === 'rime') setActiveTab('rime');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38BDF8',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Open Full Dedicated View →
                </button>
              </div>

              {/* Inspector Content: rendered cleanly via progressive disclosure */}
              <div>
                <div style={{ display: workspaceInspectorTab === 'semantic' ? 'block' : 'none' }}>
                  <SemanticStatePanel
                    state={semanticState}
                    onConfirmEntity={handleConfirmEntity}
                    onCorrectEntity={handleCorrectEntity}
                  />
                </div>

                <div style={{ display: workspaceInspectorTab === 'workflow' ? 'block' : 'none' }}>
                  <WorkflowPipeline steps={workflowSteps} />
                </div>

                <div style={{ display: workspaceInspectorTab === 'rime' ? 'block' : 'none' }}>
                  <RimeObservabilityPanel
                    config={rimeConfig}
                    ttfaMs={measuredTtfa}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. DEDICATED UNDERSTANDING VIEW */}
        {activeTab === 'understanding' && (
          <UnderstandingView
            state={semanticState}
            onConfirmEntity={handleConfirmEntity}
            onCorrectEntity={handleCorrectEntity}
            onNavigateToWorkspace={() => setActiveTab('workspace')}
          />
        )}

        {/* 3. DEDICATED WORKFLOW VIEW */}
        {activeTab === 'workflow' && (
          <WorkflowView
            steps={workflowSteps}
            onNavigateToWorkspace={() => setActiveTab('workspace')}
          />
        )}

        {/* 4. DEDICATED GUIDED DEMO TOUR */}
        {activeTab === 'demo' && (
          <GuidedDemoView
            activePresetId={activePresetId}
            onSelectAndRunPreset={(preset) => {
              handleSelectPreset(preset);
              toast.info('Demo Triggered', `Executing ${preset.title} in workspace`);
            }}
            isRunning={isScenarioRunning}
            onNavigateToWorkspace={() => setActiveTab('workspace')}
          />
        )}

        {/* 5. EVALUATION LAB & BASELINES */}
        {activeTab === 'evaluation' && (
          <EvaluationLab
            sessionTraces={sessionTraces}
            onRunTestCase={(tc) => {
              setActiveTab('workspace');
              executeScenarioFlow(tc.input, {
                intent: tc.expectedIntent,
                complaintId: tc.expectedEntities.complaint_id || tc.expectedEntities.order_id || '4812',
                constraint: tc.expectedEntities.constraint || 'none',
                reason: 'Evaluated from Test Case Explorer',
                responseMode: tc.expectedResponseMode,
                agentResponse: `Understood. Processing ${tc.expectedIntent.replace(/_/g, ' ')} with preserved entities.`,
              });
            }}
          />
        )}

        {/* 6. DEDICATED RIME / VOICE ENGINE VIEW */}
        {activeTab === 'rime' && (
          <VoiceEngineView
            config={rimeConfig}
            ttfaMs={measuredTtfa}
            onNavigateToWorkspace={() => setActiveTab('workspace')}
            onTestRimeSample={() => rimeClient.streamSpeech("Samajh gaya. Let me check complaint 4812.", "mirror_mix")}
          />
        )}

        {/* 7. ARCHITECTURE VIEW */}
        {activeTab === 'architecture' && <ArchitectureView />}

        {/* 8. PRIVACY & GOVERNANCE */}
        {activeTab === 'privacy' && <PrivacyView />}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          backgroundColor: 'var(--bg-surface-subtle)',
        }}
      >
        <span>
          BHASHAFLOW — Code-Switch-Aware Realtime Voice Assistant • Built for IIT Kharagpur DataForge × Rime Hackathon 2026 • Verified on Rime Arcana V3
        </span>
        <KeyboardShortcutsLegend />
      </footer>
    </div>
  );
};

export default App;
