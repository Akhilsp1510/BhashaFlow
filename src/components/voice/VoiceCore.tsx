import React from 'react';
import { Mic, AlertCircle, Radio } from 'lucide-react';
import type { VoiceState } from '../../types';
import { VoiceVisualizer } from './VoiceVisualizer';
import { SpeakingPauseDialog } from './SpeakingPauseDialog';
import type { PauseDialogState } from './SpeakingPauseDialog';

interface VoiceCoreProps {
  voiceState: VoiceState;
  frequencyData: Uint8Array;
  rms: number;
  onToggleMic: () => void;
  onInterrupt: () => void;
  statusMessage?: string;
  isMicActive: boolean;
  // Pause dialog integration
  pauseDialogState: PauseDialogState;
  partialTranscript: string;
  onPauseContinue: () => void;
  onPauseSend: () => void;
  onPauseDiscard: () => void;
}

export const VoiceCore: React.FC<VoiceCoreProps> = ({
  voiceState,
  frequencyData,
  rms,
  onToggleMic,
  onInterrupt,
  statusMessage,
  isMicActive,
  pauseDialogState,
  partialTranscript,
  onPauseContinue,
  onPauseSend,
  onPauseDiscard,
}) => {
  const getStateMeta = () => {
    switch (voiceState) {
      case 'listening':
        return {
          title: 'Listening...',
          sub: 'Bol sakte hain — Hindi, English, or mix naturally',
          color: 'text-emerald-400',
          badgeBg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
          orbClass: 'anim-listening border-emerald-500/60 bg-emerald-950/20',
        };
      case 'understanding':
        return {
          title: 'Understanding your Hinglish...',
          sub: 'Extracting language segments and token boundaries',
          color: 'text-purple-400',
          badgeBg: 'bg-purple-950/80 border-purple-500/50 text-purple-300',
          orbClass: 'anim-pulse-glow border-purple-500/60 bg-purple-950/20',
        };
      case 'checking':
        return {
          title: 'Checking complaint...',
          sub: 'Safeguarding critical entities and querying support tools',
          color: 'text-indigo-400',
          badgeBg: 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300',
          orbClass: 'anim-pulse-glow border-indigo-500/60 bg-indigo-950/20',
        };
      case 'speaking':
        return {
          title: 'Speaking via Rime Arcana V3...',
          sub: 'Streaming bilingual response (Barge-in enabled)',
          color: 'text-blue-400',
          badgeBg: 'bg-blue-950/80 border-blue-500/50 text-blue-300',
          orbClass: 'anim-speaking border-blue-500/60 bg-blue-950/20',
        };
      case 'clarifying':
        return {
          title: 'Need confirmation...',
          sub: 'Entity confidence threshold requires explicit verification',
          color: 'text-amber-400',
          badgeBg: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
          orbClass: 'border-amber-500/80 bg-amber-950/30',
        };
      case 'interrupted':
        return {
          title: 'Interrupted — Speech Cancelled',
          sub: 'Barge-in recognized; flushed obsolete audio queue',
          color: 'text-rose-400',
          badgeBg: 'bg-rose-950/80 border-rose-500/50 text-rose-300',
          orbClass: 'anim-interrupted border-rose-500/80 bg-rose-950/30',
        };
      case 'connecting':
        return {
          title: 'Connecting WebRTC / LiveKit...',
          sub: 'Establishing low-latency full-duplex session',
          color: 'text-cyan-400',
          badgeBg: 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300',
          orbClass: 'border-cyan-500/50',
        };
      case 'error':
        return {
          title: 'Connection Issue',
          sub: 'Microphone permission denied or socket error — Click to retry',
          color: 'text-rose-400',
          badgeBg: 'bg-rose-950/80 border-rose-500/50 text-rose-300',
          orbClass: 'border-rose-500/50',
        };
      default:
        return {
          title: 'Ready to speak',
          sub: 'Hindi, English, or mix both naturally (No dropdown required)',
          color: 'text-slate-300',
          badgeBg: 'bg-slate-800/80 border-slate-700 text-slate-300',
          orbClass: 'border-slate-700 bg-slate-900/30',
        };
    }
  };

  const meta = getStateMeta();
  const isPauseActive = pauseDialogState !== 'hidden';

  // Derive status label for the badge
  const badgeLabel = isPauseActive
    ? pauseDialogState === 'long_silence'
      ? '⏸ Long pause — ready to send'
      : '⏸ Paused — continue or send'
    : statusMessage || meta.title;

  const badgeBg = isPauseActive
    ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
    : meta.badgeBg;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '24px 20px',
        position: 'relative',
      }}
      className="card"
    >
      {/* Realtime Voice State Pill */}
      <div
        className={`badge ${badgeBg}`}
        style={{
          padding: '6px 16px',
          fontSize: '0.8rem',
          borderRadius: '9999px',
          borderWidth: '1px',
          borderStyle: 'solid',
          marginBottom: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
        }}
        role="status"
        aria-live="polite"
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isPauseActive
              ? '#F59E0B'
              : voiceState === 'listening'
              ? '#10B981'
              : voiceState === 'speaking'
              ? '#3B82F6'
              : voiceState === 'interrupted'
              ? '#EF4444'
              : voiceState === 'clarifying'
              ? '#F59E0B'
              : '#6366F1',
            display: 'inline-block',
            boxShadow: '0 0 8px currentColor',
          }}
        />
        <span>{badgeLabel}</span>
      </div>

      {/* Voice Core Orb & Visualizer — wrapped in position:relative for dialog overlay */}
      <div
        style={{
          position: 'relative',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '16px',
          border: '2px solid transparent',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'visible', // allow dialog to expand beyond orb
        }}
        className={isPauseActive ? 'border-amber-500/60 bg-amber-950/20' : meta.orbClass}
      >
        {/* Central Action Button */}
        <button
          onClick={onToggleMic}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            background: isPauseActive
              ? 'linear-gradient(135deg, #D97706 0%, #B45309 100%)'
              : isMicActive
              ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: isPauseActive
              ? '0 0 35px rgba(217, 119, 6, 0.6)'
              : isMicActive
              ? '0 0 35px rgba(16, 185, 129, 0.6)'
              : '0 0 30px rgba(99, 102, 241, 0.4)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          aria-label={isMicActive ? 'Mute microphone' : 'Start speaking'}
          title={isMicActive ? 'Click to stop' : 'Click to start speaking'}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isMicActive ? (
            <Radio size={40} className={isPauseActive ? '' : 'animate-pulse'} />
          ) : (
            <Mic size={40} />
          )}
          <span style={{ fontSize: '0.72rem', fontWeight: 700, marginTop: '6px', letterSpacing: '0.04em' }}>
            {isPauseActive ? 'PAUSED' : isMicActive ? 'LISTENING' : 'START'}
          </span>
        </button>

        {/* Barge-in interrupt button when agent is speaking */}
        {voiceState === 'speaking' && (
          <button
            onClick={onInterrupt}
            style={{
              position: 'absolute',
              bottom: '-12px',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              border: '2px solid #07090E',
              borderRadius: '9999px',
              padding: '4px 12px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 0 14px rgba(239, 68, 68, 0.8)',
            }}
            title="Interrupt agent speech (Barge-in)"
          >
            <AlertCircle size={12} />
            BARGE-IN
          </button>
        )}
      </div>

      {/* Pause Dialog — appears as an overlay card below the orb */}
      {isPauseActive && (
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            position: 'relative',
            marginBottom: '8px',
            borderRadius: '14px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            backgroundColor: 'rgba(120, 53, 15, 0.08)',
            overflow: 'hidden',
            minHeight: '200px',
          }}
        >
          <SpeakingPauseDialog
            state={pauseDialogState}
            partialTranscript={partialTranscript}
            onContinue={onPauseContinue}
            onSend={onPauseSend}
            onDiscard={onPauseDiscard}
          />
        </div>
      )}

      {/* Realtime Waveform Display */}
      <VoiceVisualizer
        frequencyData={frequencyData}
        voiceState={voiceState}
        rms={rms}
        height={54}
      />

      {/* Subtext Guidance */}
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.88rem',
          maxWidth: '440px',
          marginTop: '12px',
          lineHeight: '1.4',
        }}
      >
        {isPauseActive
          ? 'Just start speaking again to resume — or use the buttons above ↑'
          : meta.sub}
      </p>
    </div>
  );
};
