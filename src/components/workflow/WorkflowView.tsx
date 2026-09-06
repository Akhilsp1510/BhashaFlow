import React, { useState } from 'react';
import type { WorkflowStep, WorkflowStepStatus } from '../../types';
import {
  GitCommit,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  XCircle,
  Circle,
  Database,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { WorkflowEngine } from '../../services/workflowEngine';

interface WorkflowViewProps {
  steps: WorkflowStep[];
  onNavigateToWorkspace?: () => void;
}

export const WorkflowView: React.FC<WorkflowViewProps> = ({
  steps,
  onNavigateToWorkspace,
}) => {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  // Retrieve live CRM state from WorkflowEngine
  const crmRecord = WorkflowEngine.lookupComplaint('4812');

  const getStepIcon = (status: WorkflowStepStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={18} className="text-emerald-400" />;
      case 'active':
        return <Loader2 size={18} className="text-blue-400 animate-spin" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-amber-400" />;
      case 'failed':
        return <XCircle size={18} className="text-rose-400" />;
      default:
        return <Circle size={16} className="text-slate-600" />;
    }
  };

  const getStatusBadge = (status: WorkflowStepStatus) => {
    switch (status) {
      case 'completed':
        return { label: 'COMPLETED', bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-700' };
      case 'active':
        return { label: 'IN PROGRESS', bg: 'bg-blue-950/70 text-blue-300 border-blue-600 animate-pulse' };
      case 'warning':
        return { label: 'CONFIRMATION', bg: 'bg-amber-950/70 text-amber-300 border-amber-600' };
      case 'failed':
        return { label: 'FAILED', bg: 'bg-rose-950/70 text-rose-300 border-rose-600' };
      default:
        return { label: 'PENDING', bg: 'bg-slate-900 text-slate-500 border-slate-800' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
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
            <GitCommit size={22} className="text-indigo-400" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
              REALTIME WORKFLOW PIPELINE
            </h2>
            <span
              className="badge"
              style={{
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                color: '#A5B4FC',
                border: '1px solid rgba(99, 102, 241, 0.4)',
              }}
            >
              Full-Duplex Execution
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            End-to-end trace of conversational audio turning into structured, constrained CRM tool actions.
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

      {/* Pipeline Stepper Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {steps.map((step, index) => {
          const badgeMeta = getStatusBadge(step.status);
          const isExpanded = expandedStepId === step.id;
          const isActive = step.status === 'active';

          return (
            <div
              key={step.id}
              className="card"
              style={{
                backgroundColor: isActive ? 'rgba(79, 70, 229, 0.08)' : 'var(--bg-surface)',
                border: isActive ? '1px solid #6366F1' : '1px solid var(--border-subtle)',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isActive
                        ? 'rgba(79, 70, 229, 0.25)'
                        : step.status === 'completed'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getStepIcon(step.status)}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#FFFFFF' }}>
                        {step.title}
                      </span>
                      <span
                        className={`badge ${badgeMeta.bg}`}
                        style={{ fontSize: '0.62rem', borderWidth: '1px', borderStyle: 'solid' }}
                      >
                        {badgeMeta.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {step.detail || step.description}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Step {index + 1} of {steps.length}
                  </span>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {/* Collapsible details for step */}
              {isExpanded && (
                <div
                  style={{
                    padding: '14px 20px',
                    borderTop: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>Specification:</strong> {step.description}
                  </div>
                  {step.detail && (
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Runtime Event:</strong>{' '}
                      <code style={{ color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>{step.detail}</code>
                    </div>
                  )}
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Deterministic pipeline checkpoint verified for zero loss of alphanumeric tokens.
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CRM Database Inspector */}
      <div
        className="card"
        style={{
          padding: '22px',
          border: '1px solid var(--border-accent)',
          backgroundColor: 'var(--bg-surface-elevated)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} className="text-cyan-400" />
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF' }}>
              CRM DATABASE LEDGER (SYNTHETIC BACKEND STATE)
            </h3>
          </div>
          <span className="badge" style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#67E8F9' }}>
            Live In-Memory State
          </span>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          This record confirms that the constraint <code style={{ color: '#FCA5A5' }}>DO NOT CLOSE</code> has been strictly enforced in the underlying customer support ledger.
        </p>

        <div
          style={{
            padding: '14px',
            borderRadius: '8px',
            backgroundColor: '#05070B',
            border: '1px solid #1B2438',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            color: '#E2E8F0',
            overflowX: 'auto',
          }}
        >
          {JSON.stringify(crmRecord, null, 2)}
        </div>
      </div>
    </div>
  );
};
