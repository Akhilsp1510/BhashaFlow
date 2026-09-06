import React from 'react';
import { DEMO_PRESETS } from '../../data/evaluationFixtures';
import type { DemoScenarioPreset } from '../../types';
import { Sparkles } from 'lucide-react';

interface DemoScenarioBarProps {
  activePresetId?: string;
  onSelectPreset: (preset: DemoScenarioPreset) => void;
  isRunning: boolean;
}

export const DemoScenarioBar: React.FC<DemoScenarioBarProps> = ({
  activePresetId,
  onSelectPreset,
  isRunning,
}) => {
  return (
    <div
      className="card"
      style={{
        padding: '14px 18px',
        backgroundColor: 'var(--bg-surface-elevated)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        border: '1px solid #2D3D5E',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} className="text-indigo-400" />
          <h4 style={{ fontSize: '0.86rem', fontWeight: 700, letterSpacing: '0.03em' }}>
            HACKATHON DEMO CONTROLLER (1-CLICK TEST RUNNERS)
          </h4>
          <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#A5B4FC' }}>
            Reproducible Evidence Fixtures
          </span>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Label: Recorded / Fixture Scenario
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '10px',
        }}
      >
        {DEMO_PRESETS.map((preset) => {
          const isSelected = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              disabled={isRunning}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.25)' : 'var(--bg-surface-subtle)',
                border: isSelected ? '1px solid #6366F1' : '1px solid var(--border-subtle)',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                opacity: isRunning && !isSelected ? 0.6 : 1,
                transition: 'all 0.15s ease',
              }}
              className="hover:border-indigo-500"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: isSelected ? '#A5B4FC' : 'var(--text-primary)',
                  }}
                >
                  {preset.title}
                </span>
                <span
                  className="badge"
                  style={{
                    fontSize: '0.6rem',
                    backgroundColor: isSelected ? '#4F46E5' : '#1E293B',
                    color: '#FFFFFF',
                  }}
                >
                  {preset.badge}
                </span>
              </div>

              <span
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-secondary)',
                  marginTop: '4px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                "{preset.userInput}"
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
