import React, { useState } from 'react';
import { Keyboard, X } from 'lucide-react';

const shortcuts = [
  { keys: ['Space'], description: 'Toggle microphone on/off', context: 'When not typing' },
  { keys: ['Esc'], description: 'Discard partial transcript / close dialogs', context: 'Any time' },
  { keys: ['Ctrl', 'Enter'], description: 'Send accumulated transcript', context: 'Any time' },
  { keys: ['Ctrl', 'I'], description: 'Interrupt agent speech (Barge-in)', context: 'While agent speaking' },
  { keys: ['Enter'], description: 'Send text query', context: 'Text input focused' },
  { keys: ['Shift', 'Enter'], description: 'New line in text input', context: 'Text input focused' },
];

/**
 * Floating keyboard shortcuts legend.
 * Small button that expands into a quick reference card.
 */
export const KeyboardShortcutsLegend: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        title="Keyboard shortcuts"
        aria-label="Show keyboard shortcuts"
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '6px 12px',
          color: 'var(--text-muted)',
          fontSize: '0.75rem',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-accent)';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.color = 'var(--text-muted)';
        }}
      >
        <Keyboard size={13} />
        Shortcuts
      </button>

      {/* Shortcuts panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 998 }}
          />

          {/* Panel */}
          <div
            style={{
              position: 'fixed',
              bottom: '80px',
              right: '24px',
              zIndex: 999,
              width: '340px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-accent)',
              borderRadius: '14px',
              boxShadow: '0 16px 60px rgba(0,0,0,0.5)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Keyboard size={15} color="var(--accent-indigo)" />
                <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                  Keyboard Shortcuts
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Shortcuts list */}
            <div style={{ padding: '8px' }}>
              {shortcuts.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 10px',
                    borderRadius: '8px',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '2px' }}>
                      {s.description}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{s.context}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0, marginLeft: '12px' }}>
                    {s.keys.map((key, ki) => (
                      <React.Fragment key={ki}>
                        <kbd style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          padding: '3px 7px',
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border-accent)',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-mono)',
                          boxShadow: '0 2px 0 var(--border-accent)',
                          whiteSpace: 'nowrap',
                          fontWeight: 600,
                        }}>
                          {key}
                        </kbd>
                        {ki < s.keys.length - 1 && (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', alignSelf: 'center' }}>+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};
