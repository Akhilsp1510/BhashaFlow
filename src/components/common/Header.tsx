import React from 'react';
import { Radio, ShieldCheck } from 'lucide-react';
import type { VoiceState } from '../../types';

export type NavigationTab =
  | 'overview'
  | 'workspace'
  | 'understanding'
  | 'workflow'
  | 'demo'
  | 'evaluation'
  | 'rime'
  | 'architecture'
  | 'privacy';

interface HeaderProps {
  activeTab: NavigationTab | string;
  onSelectTab: (tab: any) => void;
  voiceState: VoiceState;
  isRimeActive: boolean;
  currentSpeakerName?: string;
  onOpenHistory?: () => void;
  sessionCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  voiceState,
  isRimeActive,
  currentSpeakerName,
  onOpenHistory,
  sessionCount,
}) => {
  const navTabs: { id: NavigationTab; label: string; badge?: string; group: 'product' | 'validation' | 'system' }[] = [
    { id: 'overview', label: 'Overview', group: 'product' },
    { id: 'workspace', label: 'Voice Workspace', badge: 'Live', group: 'product' },
    { id: 'understanding', label: 'Understanding', group: 'product' },
    { id: 'workflow', label: 'Workflow', group: 'product' },
    { id: 'demo', label: 'Demo Tour', badge: '60s', group: 'validation' },
    { id: 'evaluation', label: 'Evaluation Lab & Baselines', group: 'validation' },
    { id: 'rime', label: 'Voice Engine', badge: 'Rime', group: 'system' },
    { id: 'architecture', label: 'Architecture & Hard Problems', group: 'system' },
    { id: 'privacy', label: 'Privacy & Governance', group: 'system' },
  ];

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
          <span>Track: Multilingual & Code-Switched Speech</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* LiveKit WebRTC Transport */}
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
          padding: '12px 24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Brand - Clickable to return to home/workspace */}
        <div
          onClick={() => onSelectTab('overview')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectTab('overview');
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
          title="Return to Product Overview"
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

        {/* Right side: Speaker badge & History toggle */}
        {onOpenHistory && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onOpenHistory}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="Open Conversation History"
            >
              <span>👤 {currentSpeakerName || 'Active Speaker'}</span>
              {typeof sessionCount === 'number' && (
                <span
                  style={{
                    backgroundColor: '#4F46E5',
                    color: '#FFFFFF',
                    borderRadius: '9999px',
                    padding: '1px 6px',
                    fontSize: '0.65rem',
                  }}
                >
                  {sessionCount}
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          borderTop: '1px solid #141B2D',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          backgroundColor: '#070A11',
          gap: '4px',
        }}
        className="nav-tabs-bar"
      >
        {navTabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderBottom: isSelected ? '2px solid #4F46E5' : '2px solid transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className="badge"
                  style={{
                    fontSize: '0.58rem',
                    backgroundColor: isSelected ? '#4F46E5' : '#1E293B',
                    color: isSelected ? '#FFFFFF' : '#94A3B8',
                    padding: '1px 5px',
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
