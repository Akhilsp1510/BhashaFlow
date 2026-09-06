import React, { useState, useRef, useCallback } from 'react';
import { Send, Keyboard, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

interface TextInputFallbackProps {
  onSubmit: (text: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
}

// Quick example queries so users know what to type
const EXAMPLE_QUERIES = [
  'Mera complaint number 4812 check karo, please don\'t close it',
  'Order 7731 ka status kya hai, cancel mat karna',
  'Complaint 4812 abhi bhi open hai, issue resolve nahi hua',
  'Refund kab aayega order 5590 ka?',
  'Mujhe agent se baat karni hai — escalate kar do',
];

/**
 * Text input fallback — lets users type queries when mic is unavailable.
 * Supports Hinglish/English text, example suggestions, keyboard shortcuts.
 */
export const TextInputFallback: React.FC<TextInputFallbackProps> = ({
  onSubmit,
  isDisabled = false,
  placeholder = 'Type your query in Hindi, English, or Hinglish...',
}) => {
  const [text, setText] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    if (!text.trim() || isDisabled) return;
    onSubmit(text.trim());
    setText('');
    textareaRef.current?.focus();
  }, [text, isDisabled, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleExampleClick = (example: string) => {
    setText(example);
    setShowExamples(false);
    textareaRef.current?.focus();
  };

  const charCount = text.length;
  const isOverLimit = charCount > 500;

  return (
    <div
      className="card"
      style={{ padding: '16px 20px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Keyboard size={16} color="var(--accent-indigo)" />
          <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
            Text Input Fallback
          </span>
          <span
            style={{
              fontSize: '0.7rem', padding: '2px 8px', borderRadius: '9999px',
              backgroundColor: 'rgba(99,102,241,0.15)', color: '#818CF8',
              border: '1px solid rgba(99,102,241,0.3)', fontWeight: 600,
            }}
          >
            No Mic Needed
          </span>
        </div>

        {/* Example suggestions toggle */}
        <button
          onClick={() => setShowExamples((prev) => !prev)}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'none', border: '1px solid var(--border-subtle)',
            borderRadius: '8px', padding: '4px 10px',
            color: 'var(--text-secondary)', fontSize: '0.75rem',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <Lightbulb size={12} />
          Examples
          {showExamples ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Example Queries Dropdown */}
      {showExamples && (
        <div
          style={{
            marginBottom: '12px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-surface-elevated)',
          }}
        >
          {EXAMPLE_QUERIES.map((example, i) => (
            <button
              key={i}
              onClick={() => handleExampleClick(example)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '9px 14px',
                background: 'none',
                border: 'none',
                borderBottom: i < EXAMPLE_QUERIES.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem', cursor: 'pointer',
                transition: 'background 0.15s, color 0.15s',
                lineHeight: 1.4,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.08)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <span style={{ color: 'var(--accent-indigo)', marginRight: '6px', fontWeight: 700 }}>→</span>
              {example}
            </button>
          ))}
        </div>
      )}

      {/* Textarea + Send */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <textarea
            ref={textareaRef}
            id="text-fallback-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isDisabled}
            rows={2}
            style={{
              width: '100%',
              padding: '10px 14px',
              backgroundColor: 'var(--bg-surface)',
              border: `1px solid ${isOverLimit ? 'var(--accent-rose)' : 'var(--border-accent)'}`,
              borderRadius: '10px',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              resize: 'none',
              lineHeight: 1.5,
              transition: 'border-color 0.2s',
              opacity: isDisabled ? 0.5 : 1,
            }}
            onFocus={(e) => { if (!isOverLimit) e.target.style.borderColor = 'var(--border-focus)'; }}
            onBlur={(e) => { if (!isOverLimit) e.target.style.borderColor = 'var(--border-accent)'; }}
          />

          {/* Char counter */}
          <span
            style={{
              position: 'absolute', bottom: '8px', right: '10px',
              fontSize: '0.7rem',
              color: isOverLimit ? 'var(--accent-rose)' : 'var(--text-muted)',
            }}
          >
            {charCount}/500
          </span>
        </div>

        {/* Send Button */}
        <button
          id="text-fallback-send"
          onClick={handleSubmit}
          disabled={isDisabled || !text.trim() || isOverLimit}
          title="Send query (Enter)"
          style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '3px',
            width: '54px', height: '64px',
            borderRadius: '12px', border: 'none',
            background: (!text.trim() || isDisabled || isOverLimit)
              ? 'rgba(99,102,241,0.2)'
              : 'linear-gradient(135deg, #6366F1, #4F46E5)',
            color: (!text.trim() || isDisabled || isOverLimit) ? 'rgba(255,255,255,0.3)' : '#fff',
            cursor: (!text.trim() || isDisabled || isOverLimit) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: (!text.trim() || isDisabled || isOverLimit)
              ? 'none'
              : '0 0 20px rgba(99,102,241,0.5)',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (text.trim() && !isDisabled && !isOverLimit) {
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          aria-label="Send text query"
        >
          <Send size={18} />
          <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>SEND</span>
        </button>
      </div>

      {/* Hint */}
      <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '8px' }}>
        Press <kbd style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '1px 5px', fontSize: '0.68rem' }}>Enter</kbd> to send ·
        <kbd style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '1px 5px', fontSize: '0.68rem', margin: '0 2px' }}>Shift+Enter</kbd> for new line
      </p>
    </div>
  );
};
