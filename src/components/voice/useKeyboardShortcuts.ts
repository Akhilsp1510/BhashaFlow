import { useEffect } from 'react';

interface KeyboardShortcutsConfig {
  onToggleMic?: () => void;       // Space bar (when not typing)
  onDiscard?: () => void;         // Escape key
  onSend?: () => void;            // Ctrl+Enter
  onInterrupt?: () => void;       // Ctrl+I
  isEnabled?: boolean;
}

/**
 * Global keyboard shortcuts for BhashaFlow voice workspace.
 *
 * Shortcuts:
 *   Space       — Toggle microphone (only when NOT focused on input)
 *   Escape      — Discard partial transcript / close dialogs
 *   Ctrl+Enter  — Send accumulated transcript
 *   Ctrl+I      — Barge-in interrupt agent speech
 */
export const useKeyboardShortcuts = ({
  onToggleMic,
  onDiscard,
  onSend,
  onInterrupt,
  isEnabled = true,
}: KeyboardShortcutsConfig): void => {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Space — toggle mic (only when not typing)
      if (e.code === 'Space' && !isTyping && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onToggleMic?.();
        return;
      }

      // Escape — discard / close
      if (e.key === 'Escape') {
        e.preventDefault();
        onDiscard?.();
        return;
      }

      // Ctrl+Enter — send
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onSend?.();
        return;
      }

      // Ctrl+I — interrupt
      if (e.key === 'i' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onInterrupt?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnabled, onToggleMic, onDiscard, onSend, onInterrupt]);
};
