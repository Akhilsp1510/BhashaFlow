import React from 'react';
import type { SemanticState } from '../../types';
import { Cpu, Lock, CheckCircle, AlertTriangle } from 'lucide-react';

interface SemanticStatePanelProps {
  state: SemanticState;
  onConfirmEntity?: (entityId: string) => void;
  onCorrectEntity?: (entityId: string) => void;
}

export const SemanticStatePanel: React.FC<SemanticStatePanelProps> = ({
  state,
  onConfirmEntity,
  onCorrectEntity,
}) => {
  const getResponseModeBadge = (mode: string) => {
    switch (mode) {
      case 'mirror_mix':
        return {
          label: 'MIRROR MIX (Hinglish)',
          bg: 'bg-purple-950/70 border-purple-500/50 text-purple-300',
        };
      case 'english':
        return {
          label: 'ENGLISH ONLY',
          bg: 'bg-blue-950/70 border-blue-500/50 text-blue-300',
        };
      case 'hindi':
        return {
          label: 'HINDI ONLY',
          bg: 'bg-amber-950/70 border-amber-500/50 text-amber-300',
        };
      default:
        return {
          label: 'CLARIFY INTENT',
          bg: 'bg-slate-800 border-slate-700 text-slate-300',
        };
    }
  };

  const responseMeta = getResponseModeBadge(state.responseMode);

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        padding: '18px',
        backgroundColor: 'var(--bg-surface)',
      }}
    >
      {/* Title & State Indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} className="text-emerald-400" />
          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, letterSpacing: '0.02em' }}>
            SEMANTIC STATE PRESERVATION
          </h3>
        </div>
        <span
          className="badge"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: '#6EE7B7',
            border: '1px solid rgba(16, 185, 129, 0.4)',
          }}
        >
          Confidence: {Math.round(state.confidence * 100)}%
        </span>
      </div>

      {/* Grid of Semantic Properties */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
        }}
      >
        {/* Intent */}
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            WORKFLOW INTENT
          </div>
          <div
            style={{
              fontSize: '0.92rem',
              fontWeight: 700,
              color: '#38BDF8',
              fontFamily: 'var(--font-mono)',
              marginTop: '4px',
            }}
          >
            {state.intent}
          </div>
        </div>

        {/* Response Mode Policy */}
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            RESPONSE LANGUAGE POLICY
          </div>
          <div
            className={`badge ${responseMeta.bg}`}
            style={{
              marginTop: '4px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            {responseMeta.label}
          </div>
        </div>
      </div>

      {/* Protected Entities Container */}
      <div
        style={{
          padding: '12px 14px',
          backgroundColor: 'var(--bg-surface-subtle)',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={14} className="text-emerald-400" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              PROTECTED WORKFLOW ENTITIES
            </span>
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            Zero-paraphrase locked
          </span>
        </div>

        {state.protectedEntitiesList.length === 0 ? (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No critical entities detected in current turn.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {state.protectedEntitiesList.map((entity) => (
              <div
                key={entity.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderRadius: '6px',
                  border:
                    entity.status === 'needs_confirmation'
                      ? '1px solid #F59E0B'
                      : '1px solid rgba(16, 185, 129, 0.4)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {entity.status === 'needs_confirmation' ? (
                    <AlertTriangle size={16} className="text-amber-400" />
                  ) : (
                    <CheckCircle size={16} className="text-emerald-400" />
                  )}
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {entity.label}
                    </div>
                    <div
                      style={{
                        fontSize: '0.94rem',
                        fontWeight: 700,
                        color: entity.status === 'needs_confirmation' ? '#FCD34D' : '#6EE7B7',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {entity.value}
                    </div>
                  </div>
                </div>

                {entity.status === 'needs_confirmation' ? (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => onConfirmEntity?.(entity.id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#10B981',
                        color: '#07090E',
                        fontWeight: 700,
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => onCorrectEntity?.(entity.id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                      }}
                    >
                      Correct
                    </button>
                  </div>
                ) : (
                  <span
                    className="badge"
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      color: '#6EE7B7',
                      fontSize: '0.68rem',
                    }}
                  >
                    PROTECTED (100%)
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invariant Constraints & Reason */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
        }}
      >
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            ACTIVE CONSTRAINTS
          </div>
          <div style={{ marginTop: '4px' }}>
            {state.constraints.length > 0 ? (
              state.constraints.map((c, i) => (
                <span
                  key={i}
                  className="badge"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    color: '#FCA5A5',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  {c}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None specified</span>
            )}
          </div>
        </div>

        <div
          style={{
            padding: '10px 14px',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            CONTEXT REASON
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '4px', fontWeight: 600 }}>
            {state.reason}
          </div>
        </div>
      </div>
    </div>
  );
};
