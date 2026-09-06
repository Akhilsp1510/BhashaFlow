import React, { Component } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[BhashaFlow ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
            minHeight: '200px',
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            textAlign: 'center',
            gap: '12px',
          }}
        >
          <AlertTriangle size={32} color="#EF4444" />
          <p style={{ color: '#FCA5A5', fontWeight: 700, fontSize: '0.95rem' }}>
            Component Error
          </p>
          <p style={{ color: '#64748B', fontSize: '0.8rem', maxWidth: '360px' }}>
            {this.state.error?.message || 'An unexpected error occurred in this component.'}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#FCA5A5',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            <RefreshCw size={14} />
            Retry Component
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
