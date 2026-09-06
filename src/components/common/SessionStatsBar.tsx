import React from 'react';
import { MessageSquare, Globe, Zap, Clock } from 'lucide-react';
import type { MultilingualTurn } from '../../types';

interface SessionStatsBarProps {
  turns: MultilingualTurn[];
  ttfaMs?: number;
  sessionStartMs: number;
}

/**
 * Live session statistics bar — shows turn count, language distribution,
 * latency, and elapsed time. Updates in real-time as conversation progresses.
 */
export const SessionStatsBar: React.FC<SessionStatsBarProps> = ({
  turns,
  ttfaMs,
  sessionStartMs,
}) => {
  const userTurns = turns.filter((t) => t.speaker === 'user');
  const agentTurns = turns.filter((t) => t.speaker === 'agent');

  // Calculate language distribution from all user turns
  let hiTokens = 0;
  let enTokens = 0;
  userTurns.forEach((t) => {
    t.segments?.forEach((seg) => {
      const words = seg.text.split(/\s+/).filter(Boolean).length;
      if (seg.language === 'hi') hiTokens += words;
      else enTokens += words;
    });
  });
  const totalTokens = hiTokens + enTokens;
  const hiPct = totalTokens > 0 ? Math.round((hiTokens / totalTokens) * 100) : 48;
  const enPct = 100 - hiPct;

  // Elapsed session time
  const elapsedSec = Math.floor((Date.now() - sessionStartMs) / 1000);
  const elapsedStr = elapsedSec < 60
    ? `${elapsedSec}s`
    : `${Math.floor(elapsedSec / 60)}m ${elapsedSec % 60}s`;

  const stats = [
    {
      icon: <MessageSquare size={14} color="var(--accent-indigo)" />,
      label: 'Turns',
      value: turns.length.toString(),
      sub: `${userTurns.length}U · ${agentTurns.length}A`,
      color: 'var(--accent-indigo)',
    },
    {
      icon: <Globe size={14} color="var(--accent-amber)" />,
      label: 'Language Mix',
      value: `HI ${hiPct}%`,
      sub: `EN ${enPct}%`,
      color: 'var(--accent-amber)',
    },
    {
      icon: <Zap size={14} color="var(--accent-emerald)" />,
      label: 'Rime TTFA',
      value: ttfaMs ? `${ttfaMs}ms` : '—',
      sub: ttfaMs && ttfaMs < 800 ? '< 800ms ✓' : 'pending',
      color: ttfaMs && ttfaMs < 800 ? 'var(--accent-emerald)' : 'var(--text-muted)',
    },
    {
      icon: <Clock size={14} color="var(--accent-cyan)" />,
      label: 'Session Time',
      value: elapsedStr,
      sub: 'elapsed',
      color: 'var(--accent-cyan)',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1px',
        backgroundColor: 'var(--border-subtle)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            {stat.icon}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {stat.label}
            </span>
          </div>
          <span style={{ color: stat.color, fontWeight: 800, fontSize: '1.05rem', fontFamily: 'var(--font-mono)' }}>
            {stat.value}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
            {stat.sub}
          </span>
        </div>
      ))}
    </div>
  );
};
