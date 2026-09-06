import React from 'react';
import { Radio, ShieldCheck } from 'lucide-react';
import type { VoiceState } from '../../types';

interface HeaderProps {
  activeTab: 'workspace' | 'evaluation' | 'architecture' | 'privacy';
  onSelectTab: (tab: 'workspace' | 'evaluation' | 'architecture' | 'privacy') => void;
  voiceState: VoiceState;
  isRimeActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  voiceState,
  isRimeActive,
}) => {
  return (
    <header
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Top Banner with Hackathon info & Live telemetry */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 24px',
          backgroundColor: '#05070B',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          borderBottom: '1px solid #141B2D',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#FCD34D', fontWeight: 700 }}>IIT KHARAGPUR DATAFORGE × RIME HACKATHON 2026</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>Challenge: Multilingual & Code-Switched Speech</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* LiveKit Transport */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: voiceState !== 'error' ? '#10B981' : '#EF4444',
              }}
            />
            <span>LiveKit WebRTC: <strong>Connected</strong></span>
          </div>

          {/* Rime Arcana v3 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isRimeActive ? '#06B6D4' : '#10B981',
              }}
            />
            <span>Rime TTS: <strong>Arcana V3 (seraphina)</strong></span>
          </div>

          {/* Synthetic Data Guard */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981' }}>
            <ShieldCheck size={12} />
            <span>Synthetic Records Only</span>
          </div>
        </div>
      </div>

      {/* Main Brand & Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Brand - Clickable to return to home/workspace */}
        <div
          onClick={() => onSelectTab('workspace')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectTab('workspace');
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none',
            borderRadius: '10px',
            padding: '4px 8px',
            margin: '-4px -8px',
            transition: 'opacity 0.2s ease, transform 0.1s ease',
          }}
          title="Return to Voice Workspace (Home)"
          className="brand-home-button"
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
            }}
          >
            <Radio size={20} color="#FFFFFF" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.04em', color: '#FFFFFF' }}>
                BHASHAFLOW
              </h1>
              <span
                className="badge"
                style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  color: '#A5B4FC',
                  fontSize: '0.62rem',
                }}
              >
                v1.0 VOICE-NATIVE
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Speak naturally. Mix languages. Keep the meaning.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {[
            { id: 'workspace', label: 'Voice Workspace' },
            { id: 'evaluation', label: 'Evaluation Lab & Baselines' },
            { id: 'architecture', label: 'Architecture & Hard Problems' },
            { id: 'privacy', label: 'Privacy & Governance' },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id as typeof activeTab)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: isSelected ? '1px solid #4F46E5' : '1px solid transparent',
                  backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.15)' : 'transparent',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
