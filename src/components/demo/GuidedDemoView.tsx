import React from 'react';
import { DEMO_PRESETS } from '../../data/evaluationFixtures';
import type { DemoScenarioPreset } from '../../types';
import {
  Sparkles,
  Play,
  ArrowRight,
  Radio,
  Volume2,
  Cpu,
} from 'lucide-react';

interface GuidedDemoViewProps {
  activePresetId?: string;
  onSelectAndRunPreset: (preset: DemoScenarioPreset) => void;
  isRunning: boolean;
  onNavigateToWorkspace: () => void;
}

export const GuidedDemoView: React.FC<GuidedDemoViewProps> = ({
  activePresetId,
  onSelectAndRunPreset,
  isRunning,
  onNavigateToWorkspace,
}) => {
  const activePreset = DEMO_PRESETS.find((p) => p.id === activePresetId) || DEMO_PRESETS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          padding: '24px 28px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)',
          border: '1px solid #4F46E5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} className="text-indigo-400" />
            <span className="badge" style={{ backgroundColor: '#312E81', color: '#C7D2FE' }}>
              HACKATHON JUDGE TOUR
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
            60-Second Guided Evaluation Tour
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#CBD5E1', maxWidth: '750px', marginTop: '4px', lineHeight: '1.5' }}>
            Select any real-world code-switching scenario below to watch BhashaFlow tokenize mixed speech, lock critical ticket entities, enforce constraints, and stream natural bilingual voice via Rime Arcana V3.
          </p>
        </div>

        <button
          onClick={onNavigateToWorkspace}
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.85rem' }}
        >
          <span>Open Live Voice Workspace</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Grid of 6 Scenarios */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
          Select a Verification Scenario:
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '14px',
          }}
        >
          {DEMO_PRESETS.map((preset, idx) => {
            const isSelected = activePreset.id === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => onSelectAndRunPreset(preset)}
                className="card"
                style={{
                  padding: '18px 20px',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.18)' : 'var(--bg-surface)',
                  border: isSelected ? '1px solid #6366F1' : '1px solid var(--border-subtle)',
                  boxShadow: isSelected ? '0 0 25px rgba(99, 102, 241, 0.35)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                  opacity: isRunning && !isSelected ? 0.6 : 1,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isSelected ? '#A5B4FC' : 'var(--text-muted)' }}>
                    SCENARIO #{idx + 1}
                  </span>
                  <span
                    className="badge"
                    style={{
                      fontSize: '0.65rem',
                      backgroundColor: isSelected ? '#4F46E5' : 'var(--bg-surface-elevated)',
                      color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                    }}
                  >
                    {preset.badge}
                  </span>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {preset.title}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: '#38BDF8', marginTop: '2px', fontWeight: 600 }}>
                    {preset.subtitle}
                  </div>
                </div>

                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem',
                    color: '#E2E8F0',
                    fontStyle: 'italic',
                  }}
                >
                  "{preset.userInput}"
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {preset.description}
                </p>

                <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 600 }}>
                    {preset.expectedOutcome.responseMode.toUpperCase()} Policy
                  </span>
                  <button
                    disabled={isRunning}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      backgroundColor: isSelected ? '#10B981' : '#4F46E5',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: isRunning ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Play size={12} />
                    Run Scenario
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Inspection Card of Selected Scenario */}
      <div
        className="card"
        style={{
          padding: '24px',
          border: '1px solid var(--border-accent)',
          backgroundColor: 'var(--bg-surface-elevated)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Selected Scenario Deep-Dive
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
              {activePreset.title}
            </h3>
          </div>

          <button
            onClick={() => onSelectAndRunPreset(activePreset)}
            disabled={isRunning}
            className="btn-primary"
            style={{ fontSize: '0.86rem', padding: '10px 18px' }}
          >
            <Play size={16} />
            <span>Execute & Test in Workspace</span>
          </button>
        </div>

        {/* 3-Step Walkthrough Matrix */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px',
          }}
        >
          {/* Step 1: Input & Code-Switching */}
          <div
            style={{
              padding: '14px',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#93C5FD', fontWeight: 700, fontSize: '0.8rem' }}>
              <Radio size={14} />
              <span>1. Spoken Audio Input</span>
            </div>
            <div style={{ fontSize: '0.86rem', color: '#FFFFFF', marginTop: '8px', fontWeight: 600 }}>
              "{activePreset.userInput}"
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Streamed through Web Audio API to language segmenter.
            </div>
          </div>

          {/* Step 2: Semantic Invariant Guard */}
          <div
            style={{
              padding: '14px',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6EE7B7', fontWeight: 700, fontSize: '0.8rem' }}>
              <Cpu size={14} />
              <span>2. Semantic Invariant Lock</span>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', marginTop: '8px' }}>
              Intent: <strong style={{ color: '#38BDF8' }}>{activePreset.expectedOutcome.intent}</strong>
              <br />
              Locked Entity: <strong style={{ color: '#6EE7B7' }}>{activePreset.expectedOutcome.complaintId}</strong>
              <br />
              Constraint: <strong style={{ color: '#FCA5A5' }}>{activePreset.expectedOutcome.constraint || 'None'}</strong>
            </div>
          </div>

          {/* Step 3: Rime Arcana V3 Speech Response */}
          <div
            style={{
              padding: '14px',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FCD34D', fontWeight: 700, fontSize: '0.8rem' }}>
              <Volume2 size={14} />
              <span>3. Rime Spoken Response</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#FCD34D', marginTop: '8px', fontStyle: 'italic', lineHeight: '1.4' }}>
              "{activePreset.expectedOutcome.agentResponse}"
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Arcana V3 single-speaker Hinglish stream (TTFA &lt; 800ms).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
