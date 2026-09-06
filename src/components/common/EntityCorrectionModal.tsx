import React, { useState, useRef, useEffect } from 'react';
import { Edit3, X, Check } from 'lucide-react';

interface EntityCorrectionModalProps {
  isOpen: boolean;
  entityLabel: string;
  currentValue: string;
  onConfirm: (newValue: string) => void;
  onCancel: () => void;
}

/**
 * Replaces the browser's ugly window.prompt() for entity corrections.
 * A polished inline modal that matches the BhashaFlow dark theme.
 */
export const EntityCorrectionModal: React.FC<EntityCorrectionModalProps> = ({
  isOpen,
  entityLabel,
  currentValue,
  onConfirm,
  onCancel,
}) => {
  const [value, setValue] = useState(currentValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(currentValue);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, currentValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) onConfirm(value.trim());
    if (e.key === 'Escape') onCancel();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          animation: 'fadeIn 0.15s ease',
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Correct Entity Value"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1001,
          width: '90%',
          maxWidth: '420px',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-accent)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          animation: 'slideUp 0.2s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Edit3 size={18} color="#818CF8" />
            </div>
            <div>
              <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem' }}>
                Correct Entity
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                {entityLabel}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex', padding: '4px',
            }}
            aria-label="Cancel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px', fontWeight: 600 }}>
            Corrected Value
          </label>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter corrected value..."
            style={{
              width: '100%',
              padding: '10px 14px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-accent)',
              borderRadius: '10px',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--border-focus)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-accent)')}
          />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.73rem', marginTop: '6px' }}>
            Press Enter to confirm · Escape to cancel
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '9px', borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              background: 'transparent', color: 'var(--text-secondary)',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => value.trim() && onConfirm(value.trim())}
            disabled={!value.trim()}
            style={{
              flex: 1, padding: '9px', borderRadius: '10px',
              border: 'none',
              background: value.trim()
                ? 'linear-gradient(135deg, #6366F1, #4F46E5)'
                : 'rgba(99,102,241,0.2)',
              color: value.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
              cursor: value.trim() ? 'pointer' : 'not-allowed',
              fontWeight: 700, fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Check size={16} />
            Confirm
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform: translate(-50%,-48%) } to { opacity:1; transform: translate(-50%,-50%) } }
      `}</style>
    </>
  );
};
