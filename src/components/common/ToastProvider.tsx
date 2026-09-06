import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms, 0 = never auto-dismiss
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string) =>
    showToast({ type: 'success', title, message, duration: 3500 }), [showToast]);
  const error = useCallback((title: string, message?: string) =>
    showToast({ type: 'error', title, message, duration: 5000 }), [showToast]);
  const warning = useCallback((title: string, message?: string) =>
    showToast({ type: 'warning', title, message, duration: 4000 }), [showToast]);
  const info = useCallback((title: string, message?: string) =>
    showToast({ type: 'info', title, message, duration: 3000 }), [showToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

const NOOP = () => {};
const FALLBACK_TOAST: ToastContextValue = {
  toasts: [],
  showToast: NOOP,
  dismissToast: NOOP,
  success: NOOP,
  error: NOOP,
  warning: NOOP,
  info: NOOP,
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return FALLBACK_TOAST;
  }
  return ctx;
};

// ─── Individual Toast Item ────────────────────────────────────────────────────

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} color="#10B981" />,
  error: <XCircle size={18} color="#EF4444" />,
  warning: <AlertTriangle size={18} color="#F59E0B" />,
  info: <Info size={18} color="#3B82F6" />,
};

const COLORS: Record<ToastType, { border: string; bg: string; title: string }> = {
  success: { border: 'rgba(16,185,129,0.4)', bg: 'rgba(16,185,129,0.08)', title: '#6EE7B7' },
  error:   { border: 'rgba(239,68,68,0.4)',  bg: 'rgba(239,68,68,0.08)',  title: '#FCA5A5' },
  warning: { border: 'rgba(245,158,11,0.4)', bg: 'rgba(245,158,11,0.08)', title: '#FCD34D' },
  info:    { border: 'rgba(59,130,246,0.4)', bg: 'rgba(59,130,246,0.08)', title: '#93C5FD' },
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const [exiting, setExiting] = useState(false);
  const colors = COLORS[toast.type];

  useEffect(() => {
    if (!toast.duration) return;
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, toast.duration);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 16px',
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.bg,
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        minWidth: '280px',
        maxWidth: '380px',
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'translateX(20px)' : 'translateX(0)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        cursor: 'default',
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '1px' }}>{ICONS[toast.type]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: colors.title, fontWeight: 700, fontSize: '0.85rem', marginBottom: toast.message ? '3px' : 0 }}>
          {toast.title}
        </p>
        {toast.message && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.4 }}>
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={handleDismiss}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', padding: '2px', flexShrink: 0,
          display: 'flex', alignItems: 'center',
        }}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};

// ─── Container ────────────────────────────────────────────────────────────────

const ToastContainer: React.FC<{ toasts: Toast[]; onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};
