import React from 'react';
import type { SemanticState } from '../../types';
import {
  Cpu,
  Lock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Repeat,
  Shield,
} from 'lucide-react';

interface UnderstandingViewProps {
  state: SemanticState;
  onConfirmEntity?: (entityId: string) => void;
  onCorrectEntity?: (entityId: string) => void;
  onNavigateToWorkspace?: () => void;
}

export const UnderstandingView: React.FC<UnderstandingViewProps> = ({
  state,
  onConfirmEntity,
  onCorrectEntity,
  onNavigateToWorkspace,
}) => {
  const getResponseModeBadge = (mode: string) => {
    switch (mode) {
      case 'mirror_mix':
        return {
          label: 'MIRROR MIX (Hinglish)',
          bg: 'bg-purple-950/70 border-purple-500/50 text-purple-300',
          desc: 'Replies in natural code-switched Hinglish to match user cadence',
        };
      case 'english':
        return {
          label: 'ENGLISH ONLY',
          bg: 'bg-blue-950/70 border-blue-500/50 text-blue-300',
          desc: 'Replies in standard English per explicit user request',
        };
      case 'hindi':
        return {
          label: 'HINDI ONLY',
          bg: 'bg-amber-950/70 border-amber-500/50 text-amber-300',
          desc: 'Replies in standard Hindi per explicit user request',
        };
      default:
        return {
          label: 'CLARIFY INTENT',
          bg: 'bg-slate-800 border-slate-700 text-slate-300',
          desc: 'Underlying intent requires additional conversational turn',
        };
    }
  };

  const responseMeta = getResponseModeBadge(state.responseMode);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* View Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={22} className="text-emerald-400" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
              WHAT BHASHAFLOW UNDERSTOOD
            </h2>
            <span
              className="badge"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#6EE7B7',
                border: '1px solid rgba(16, 185, 129, 0.4)',
              }}
            >
              SEMANTIC STATE PRESERVATION
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Deterministic invariant extraction: zero-paraphrase entity locking, constraint safeguarding, and language policy planning.
          </p>
        </div>

        {onNavigateToWorkspace && (
          <button
            onClick={onNavigateToWorkspace}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
          >
            ← Return to Voice Workspace
          </button>
        )}
      </div>

      {/* Main Semantic Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '18px',
        }}
      >
        {/* Card 1: Intent & Confidence */}
        <div
          className="card"
          style={{
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Extracted Workflow Intent
            </span>
            <span
              className="badge"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: '#6EE7B7',
              }}
            >
              Confidence: {Math.round((state.intentConfidence || state.confidence) * 100)}%
            </span>
          </div>

          <div>
            <div
              style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#38BDF8',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '-0.01em',
              }}
            >
              {state.intent}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Mapped to synthetic customer service tool: <code>WorkflowEngine.lookupComplaint()</code>
            </p>
          </div>

          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              marginTop: 'auto',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              NORMALIZED SEMANTIC INTENT
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '4px', fontWeight: 600 }}>
              {state.rawNormalizedText || 'Check complaint status and log customer update while maintaining open state'}
            </div>
          </div>
        </div>

        {/* Card 2: Output Language Policy */}
        <div
          className="card"
          style={{
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Response Language Policy
            </span>
            <div className={`badge ${responseMeta.bg}`} style={{ borderWidth: '1px', borderStyle: 'solid' }}>
              {responseMeta.label}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
              {state.responseMode === 'mirror_mix'
                ? 'Mirror Mix Code-Switching'
                : state.responseMode === 'english'
                ? 'English Only Override'
                : 'Hindi Only Override'}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              {responseMeta.desc}
            </p>
          </div>

          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Repeat size={18} className="text-purple-400" />
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              No language dropdown required. Automatically planned from conversational code-mix cadence.
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Protected Workflow Entities (Full Width) */}
      <div
        className="card"
        style={{
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} className="text-emerald-400" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
              PROTECTED WORKFLOW ENTITIES (INVARIANT LOCKS)
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
            Zero-Paraphrase Guarantee
          </span>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          These alphanumeric IDs and negative constraints are extracted with regex guards and locked against LLM rewriting, preventing hallucination or accidental closing of customer tickets.
        </p>

        {state.protectedEntitiesList.length === 0 ? (
          <div
            style={{
              padding: '28px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: '8px',
            }}
          >
            No critical entities detected in current conversational turn.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
            {state.protectedEntitiesList.map((entity) => (
              <div
                key={entity.id}
                style={{
                  padding: '14px 16px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderRadius: '10px',
                  border:
                    entity.status === 'needs_confirmation'
                      ? '1px solid #F59E0B'
                      : '1px solid rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {entity.status === 'needs_confirmation' ? (
                      <AlertTriangle size={18} className="text-amber-400" />
                    ) : (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    )}
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {entity.label} ({entity.category})
                      </div>
                      <div
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: 800,
                          color: entity.status === 'needs_confirmation' ? '#FCD34D' : '#6EE7B7',
                          fontFamily: 'var(--font-mono)',
                          marginTop: '2px',
                        }}
                      >
                        {entity.value}
                      </div>
                    </div>
                  </div>

                  <span
                    className="badge"
                    style={{
                      backgroundColor:
                        entity.status === 'needs_confirmation'
                          ? 'rgba(245, 158, 11, 0.2)'
                          : 'rgba(16, 185, 129, 0.2)',
                      color: entity.status === 'needs_confirmation' ? '#FCD34D' : '#6EE7B7',
                      fontSize: '0.68rem',
                    }}
                  >
                    {entity.status === 'needs_confirmation' ? 'CONFIRMATION NEEDED' : 'PROTECTED (100%)'}
                  </span>
                </div>

                {entity.rawSpoken && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Raw spoken match: <em>"{entity.rawSpoken}"</em>
                  </div>
                )}

                {entity.status === 'needs_confirmation' ? (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button
                      onClick={() => onConfirmEntity?.(entity.id)}
                      className="btn-primary"
                      style={{ fontSize: '0.75rem', padding: '6px 12px', flex: 1 }}
                    >
                      Confirm Value
                    </button>
                    <button
                      onClick={() => onCorrectEntity?.(entity.id)}
                      className="btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '6px 12px', flex: 1, borderColor: '#EF4444', color: '#FCA5A5' }}
                    >
                      Correct Value
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onCorrectEntity?.(entity.id)}
                    style={{
                      alignSelf: 'flex-start',
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Edit or override value
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card 4: Negative Constraints & Context Reason */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '18px',
        }}
      >
        {/* Active Constraints */}
        <div
          className="card"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} className="text-rose-400" />
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active Constraints (Enforced in CRM)
            </h4>
          </div>

          <div>
            {state.constraints.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {state.constraints.map((c, i) => (
                  <span
                    key={i}
                    className="badge"
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      color: '#FCA5A5',
                      border: '1px solid rgba(239, 68, 68, 0.5)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No negative constraints detected</span>
            )}
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 'auto' }}>
            Prevents tickets from closing when the customer specifically utters "don't close it" or "open rakhna".
          </p>
        </div>

        {/* Context Reason */}
        <div
          className="card"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} className="text-amber-400" />
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Context Reason (Root Cause)
            </h4>
          </div>

          <div
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {state.reason || 'None specified'}
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 'auto' }}>
            Stored directly into the CRM audit log without transliteration loss.
          </p>
        </div>
      </div>
    </div>
  );
};
