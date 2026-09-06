import React from 'react';
import type { WorkflowStep, WorkflowStepStatus } from '../../types';
import { CheckCircle2, Circle, Loader2, AlertTriangle, XCircle, GitCommit } from 'lucide-react';

interface WorkflowPipelineProps {
  steps: WorkflowStep[];
}

export const WorkflowPipeline: React.FC<WorkflowPipelineProps> = ({ steps }) => {
  const getStepIcon = (status: WorkflowStepStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={16} className="text-emerald-400" />;
      case 'active':
        return <Loader2 size={16} className="text-blue-400 animate-spin" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-400" />;
      case 'failed':
        return <XCircle size={16} className="text-rose-400" />;
      default:
        return <Circle size={14} className="text-slate-600" />;
    }
  };

  const getStatusBadge = (status: WorkflowStepStatus) => {
    switch (status) {
      case 'completed':
        return { label: 'DONE', bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800' };
      case 'active':
        return { label: 'PROCESSING', bg: 'bg-blue-950/60 text-blue-300 border-blue-700 animate-pulse' };
      case 'warning':
        return { label: 'CHECK', bg: 'bg-amber-950/60 text-amber-300 border-amber-700' };
      case 'failed':
        return { label: 'FAILED', bg: 'bg-rose-950/60 text-rose-300 border-rose-700' };
      default:
        return { label: 'WAITING', bg: 'bg-slate-900 text-slate-500 border-slate-800' };
    }
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 18px',
        backgroundColor: 'var(--bg-surface)',
        gap: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitCommit size={18} className="text-blue-400" />
          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, letterSpacing: '0.02em' }}>
            REALTIME WORKFLOW PIPELINE
          </h3>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Full-duplex pipeline execution
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '10px',
        }}
      >
        {steps.map((step) => {
          const badgeMeta = getStatusBadge(step.status);
          const isCurrentActive = step.status === 'active';
          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: isCurrentActive ? 'rgba(79, 70, 229, 0.12)' : 'var(--bg-surface-subtle)',
                border: isCurrentActive ? '1px solid #4F46E5' : '1px solid var(--border-subtle)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ marginTop: '2px' }}>{getStepIcon(step.status)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {step.title}
                  </span>
                  <span
                    className={`badge ${badgeMeta.bg}`}
                    style={{ fontSize: '0.6rem', padding: '1px 6px' }}
                  >
                    {badgeMeta.label}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.3' }}>
                  {step.detail || step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
