import React, { useState } from 'react';
import type { MultilingualTurn } from '../../types';
import { Languages, AlertOctagon, Download, Sparkles } from 'lucide-react';

interface LiveTranscriptProps {
  turns: MultilingualTurn[];
  onClear?: () => void;
  activeSpeakerName?: string;
}

export const LiveTranscript: React.FC<LiveTranscriptProps> = ({ turns, activeSpeakerName }) => {
  const [segmentationActive, setSegmentationActive] = useState(true);
  const [showConfidence, setShowConfidence] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(true);

  const getLanguageTagClass = (lang: string, isEntity?: boolean) => {
    if (isEntity) return 'segment-entity';
    switch (lang) {
      case 'hi':
        return 'segment-hi';
      case 'en':
        return 'segment-en';
      case 'mixed':
        return 'segment-mixed';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getLanguageLabel = (lang: string, isEntity?: boolean) => {
    if (isEntity) return 'ENTITY';
    switch (lang) {
      case 'hi':
        return 'HI';
      case 'en':
        return 'EN';
      case 'mixed':
        return 'MIX';
      default:
        return '?';
    }
  };

  const exportTranscript = () => {
    const dataStr = JSON.stringify(turns, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bhashaflow-transcript-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '560px',
      }}
    >
      {/* Header & Feature Toggles */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          backgroundColor: 'var(--bg-surface-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Languages size={18} className="text-indigo-400" />
          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, letterSpacing: '0.02em' }}>
            CODE-SWITCHED LIVE TRANSCRIPT
          </h3>
          <span className="badge" style={{ backgroundColor: '#1E293B', color: '#94A3B8' }}>
            {turns.length} Turns
          </span>
        </div>

        {/* Legend & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Legend Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '6px' }}>
            <span className="badge segment-hi" style={{ fontSize: '0.65rem' }}>HI: Hindi</span>
            <span className="badge segment-en" style={{ fontSize: '0.65rem' }}>EN: English</span>
            <span className="badge segment-mixed" style={{ fontSize: '0.65rem' }}>MIX: Code-Mix</span>
            <span className="badge segment-entity" style={{ fontSize: '0.65rem' }}>PROTECTED ID</span>
          </div>

          <button
            onClick={() => setSegmentationActive(!segmentationActive)}
            style={{
              padding: '4px 8px',
              fontSize: '0.72rem',
              fontWeight: 600,
              backgroundColor: segmentationActive ? '#312E81' : '#1E293B',
              color: segmentationActive ? '#C7D2FE' : '#94A3B8',
              border: '1px solid',
              borderColor: segmentationActive ? '#4F46E5' : '#334155',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Segments: {segmentationActive ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setShowConfidence(!showConfidence)}
            style={{
              padding: '4px 8px',
              fontSize: '0.72rem',
              fontWeight: 600,
              backgroundColor: showConfidence ? '#064E3B' : '#1E293B',
              color: showConfidence ? '#A7F3D0' : '#94A3B8',
              border: '1px solid',
              borderColor: showConfidence ? '#10B981' : '#334155',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Confidence
          </button>

          <button
            onClick={() => setShowTimestamps(!showTimestamps)}
            style={{
              padding: '4px 8px',
              fontSize: '0.72rem',
              fontWeight: 600,
              backgroundColor: showTimestamps ? '#1E1B4B' : '#1E293B',
              color: showTimestamps ? '#C7D2FE' : '#94A3B8',
              border: '1px solid',
              borderColor: showTimestamps ? '#6366F1' : '#334155',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Timestamps: {showTimestamps ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={exportTranscript}
            style={{
              padding: '4px 8px',
              fontSize: '0.72rem',
              backgroundColor: '#1E293B',
              color: '#CBD5E1',
              border: '1px solid #334155',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Export JSON Trace"
          >
            <Download size={12} />
            Export
          </button>
        </div>
      </div>

      {/* Transcript Turn Stream */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
        aria-live="polite"
      >
        {turns.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: '32px 16px',
            }}
          >
            <Sparkles size={28} style={{ color: '#4F46E5', marginBottom: '10px' }} />
            <p style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              No speech captured yet
            </p>
            <p style={{ fontSize: '0.8rem', maxWidth: '340px', marginTop: '4px' }}>
              Press START or run a fixture demo to see realtime multilingual token parsing and entity protection in action.
            </p>
          </div>
        ) : (
          turns.map((turn) => {
            const isUser = turn.speaker === 'user';
            return (
              <div
                key={turn.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  borderLeft: `3px solid ${isUser ? '#4F46E5' : '#06B6D4'}`,
                  paddingLeft: '12px',
                  marginBottom: '4px',
                }}
              >
                {/* Turn Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: isUser ? '#818CF8' : '#38BDF8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {isUser ? (activeSpeakerName ? `${activeSpeakerName} (Bilingual Speaker)` : 'User (Bilingual Speaker)') : 'BhashaFlow (Rime Arcana V3)'}
                  </span>

                  {showTimestamps && (
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {turn.timestamp}
                    </span>
                  )}

                  {turn.wasInterrupted && (
                    <span
                      className="badge"
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        color: '#FCA5A5',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        fontSize: '0.65rem',
                      }}
                    >
                      <AlertOctagon size={10} />
                      INTERRUPTED MID-SENTENCE
                    </span>
                  )}
                </div>

                {/* Turn Content */}
                <div style={{ fontSize: '0.94rem', lineHeight: '1.6' }}>
                  {segmentationActive && turn.segments && turn.segments.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                      {turn.segments.map((seg) => (
                        <span
                          key={seg.id}
                          className={getLanguageTagClass(seg.language, seg.isEntity)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '0.88rem',
                          }}
                          title={`Language: ${seg.language.toUpperCase()} | Script: ${seg.script} | Confidence: ${Math.round(
                            seg.confidence * 100
                          )}%`}
                        >
                          <span
                            style={{
                              fontSize: '0.62rem',
                              opacity: 0.75,
                              fontWeight: 800,
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            [{getLanguageLabel(seg.language, seg.isEntity)}]
                          </span>
                          <span>{seg.text}</span>
                          {showConfidence && (
                            <span style={{ fontSize: '0.6rem', opacity: 0.65 }}>
                              {Math.round(seg.confidence * 100)}%
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-primary)' }}>{turn.rawTranscript}</p>
                  )}
                </div>

                {/* Normalized / Meaning Subtext if available */}
                {turn.normalizedMeaning && isUser && (
                  <div
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      marginTop: '2px',
                    }}
                  >
                    <span style={{ color: '#94A3B8', fontWeight: 600 }}>Normalized Intent Meaning: </span>
                    {turn.normalizedMeaning}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
