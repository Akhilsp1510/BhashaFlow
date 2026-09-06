import React, { useEffect, useState } from 'react';
import { Mic, Send, RotateCcw } from 'lucide-react';

export type PauseDialogState = 'hidden' | 'pause' | 'long_silence';

interface SpeakingPauseDialogProps {
  state: PauseDialogState;
  /** Partial transcript accumulated so far while speaking */
  partialTranscript: string;
  onContinue: () => void;
  onSend: () => void;
  onDiscard: () => void;
}

export const SpeakingPauseDialog: React.FC<SpeakingPauseDialogProps> = ({
  state,
  partialTranscript,
  onContinue,
  onSend,
  onDiscard,
}) => {
  const [visible, setVisible] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    if (state !== 'hidden') {
      setVisible(true);
      requestAnimationFrame(() => setAnimIn(true));
    } else {
      setAnimIn(false);
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [state]);

  if (!visible) return null;

  const isLong = state === 'long_silence';

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: 'rgba(8, 12, 20, 0.88)',
          backdropFilter: 'blur(8px)',
          zIndex: 20,
          transition: 'opacity 0.3s ease',
          opacity: animIn ? 1 : 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Speech paused — choose action"
      >
        {/* Pause indicator dot */}
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: isLong ? '#F59E0B' : '#6366F1',
            boxShadow: isLong
              ? '0 0 16px rgba(245, 158, 11, 0.8)'
              : '0 0 16px rgba(99, 102, 241, 0.8)',
            marginBottom: '14px',
            animation: 'pulse-dot 1.4s ease-in-out infinite',
          }}
        />

        {/* Title */}
        <p
          style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#F1F5F9',
            marginBottom: '6px',
            textAlign: 'center',
            letterSpacing: '0.01em',
          }}
        >
          {isLong ? 'Still there? Kuch bolna hai?' : 'Paused — thoda ruko ya bhejo?'}
        </p>

        {/* Sub-hint */}
        <p
          style={{
            fontSize: '0.75rem',
            color: '#64748B',
            marginBottom: '16px',
            textAlign: 'center',
            lineHeight: '1.4',
          }}
        >
          {isLong
            ? 'Long pause detected — your message is ready to send'
            : 'Silence detected for 1.5s — just continue speaking to resume!'}
        </p>

        {/* Partial transcript preview */}
        {partialTranscript.trim() && (
          <div
            style={{
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '18px',
              maxWidth: '100%',
              width: '100%',
              maxHeight: '70px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <p
              style={{
                fontSize: '0.78rem',
                color: '#A5B4FC',
                lineHeight: '1.5',
                fontStyle: 'italic',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                margin: 0,
              }}
            >
              "{partialTranscript}"
            </p>
            {/* Fade bottom for overflow */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '20px',
                background: 'linear-gradient(transparent, rgba(8,12,20,0.8))',
                borderRadius: '0 0 10px 10px',
                pointerEvents: 'none',
              }}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            width: '100%',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {/* Continue speaking */}
          <button
            onClick={onContinue}
            style={{
              flex: '1 1 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(99, 102, 241, 0.5)',
              backgroundColor: 'rgba(99, 102, 241, 0.12)',
              color: '#A5B4FC',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              letterSpacing: '0.02em',
              minWidth: '110px',
            }}
            title="Keep speaking — no auto-submit"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.22)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
            }}
          >
            <Mic size={13} />
            Continue
          </button>

          {/* Send now */}
          <button
            onClick={onSend}
            style={{
              flex: '1 1 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(16, 185, 129, 0.5)',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              color: '#6EE7B7',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              letterSpacing: '0.02em',
              minWidth: '110px',
            }}
            title="Send this message now"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.22)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
            }}
          >
            <Send size={13} />
            Send
          </button>

          {/* Discard */}
          <button
            onClick={onDiscard}
            style={{
              flex: '0 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 12px',
              borderRadius: '10px',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              color: '#FCA5A5',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              letterSpacing: '0.02em',
            }}
            title="Discard and start over"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.18)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.35)';
            }}
          >
            <RotateCcw size={12} />
            Discard
          </button>
        </div>

        {/* Keyboard hint */}
        <p style={{ fontSize: '0.68rem', color: '#374151', marginTop: '12px', textAlign: 'center' }}>
          💡 Just keep speaking to automatically resume
        </p>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
        }
      `}</style>
    </>
  );
};

export default SpeakingPauseDialog;
