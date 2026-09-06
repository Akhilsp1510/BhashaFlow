import React, { useState, useEffect } from 'react';
import { History, User, Trash2, Download, Search, ChevronRight, X } from 'lucide-react';
import {
  getAllSessions,
  deleteSession,
  clearAllHistory,
  exportHistoryJSON,
  type ConversationSession,
} from '../../services/historyStorage';

interface ConversationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSessionToWorkspace?: (session: ConversationSession) => void;
}

export const ConversationHistoryModal: React.FC<ConversationHistoryModalProps> = ({
  isOpen,
  onClose,
  onLoadSessionToWorkspace,
}) => {
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ConversationSession | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpeaker, setFilterSpeaker] = useState<string>('ALL');

  useEffect(() => {
    if (isOpen) {
      const all = getAllSessions();
      setSessions(all);
      setSelectedSession(all.length > 0 ? all[0] : null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const speakers = Array.from(new Set(sessions.map((s) => s.speakerName)));

  const filteredSessions = sessions.filter((s) => {
    const matchesSpeaker = filterSpeaker === 'ALL' || s.speakerName === filterSpeaker;
    const matchesSearch =
      searchQuery.trim() === '' ||
      s.sessionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.speakerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.intent && s.intent.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.turns.some((t) => t.rawTranscript.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSpeaker && matchesSearch;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this session record?')) {
      deleteSession(id);
      const updated = sessions.filter((s) => s.sessionId !== id);
      setSessions(updated);
      if (selectedSession?.sessionId === id) {
        setSelectedSession(updated.length > 0 ? updated[0] : null);
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all recorded voice history?')) {
      clearAllHistory();
      setSessions([]);
      setSelectedSession(null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          height: '80vh',
          backgroundColor: '#0F172A',
          border: '1px solid #1E293B',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#0A0F1D',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: '#818CF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <History size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                Voice Conversation History
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0 }}>
                Tracked sessions & turns by Speaker ID (Stored locally)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={exportHistoryJSON}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38BDF8',
                borderRadius: '6px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              <Download size={14} /> Export All
            </button>
            {sessions.length > 0 && (
              <button
                onClick={handleClearAll}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#F87171',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                <Trash2 size={14} /> Clear
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid #1E293B',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            backgroundColor: '#0F172A',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#090D1A',
              border: '1px solid #1E293B',
              borderRadius: '8px',
              padding: '6px 12px',
              gap: '8px',
            }}
          >
            <Search size={15} color="#64748B" />
            <input
              type="text"
              placeholder="Search by ID, speaker, intent, or spoken transcript..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: '#F8FAFC',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
          </div>

          {speakers.length > 1 && (
            <select
              value={filterSpeaker}
              onChange={(e) => setFilterSpeaker(e.target.value)}
              style={{
                backgroundColor: '#090D1A',
                border: '1px solid #1E293B',
                color: '#E2E8F0',
                fontSize: '0.8rem',
                borderRadius: '8px',
                padding: '6px 12px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Speakers</option>
              {speakers.map((spk) => (
                <option key={spk} value={spk}>
                  {spk}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Main Content: Split List and Details */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left: Session List */}
          <div
            style={{
              width: '360px',
              borderRight: '1px solid #1E293B',
              overflowY: 'auto',
              backgroundColor: '#0B1120',
            }}
          >
            {filteredSessions.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: '#64748B' }}>
                <p style={{ fontSize: '0.85rem' }}>No conversation sessions found.</p>
                <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                  Speak with the mic or trigger test scenarios to record turns!
                </p>
              </div>
            ) : (
              filteredSessions.map((session) => {
                const isSelected = selectedSession?.sessionId === session.sessionId;
                return (
                  <div
                    key={session.sessionId}
                    onClick={() => setSelectedSession(session)}
                    style={{
                      padding: '14px 16px',
                      borderBottom: '1px solid #141D2E',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                      borderLeft: isSelected ? '3px solid #6366F1' : '3px solid transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontFamily: 'monospace',
                          color: '#38BDF8',
                          fontWeight: 600,
                        }}
                      >
                        {session.sessionId}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                        {new Date(session.startedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                      <User size={13} color="#94A3B8" />
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#E2E8F0' }}>
                        {session.speakerName}
                      </span>
                    </div>

                    {session.intent && (
                      <div style={{ marginTop: '4px' }}>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            color: '#34D399',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                          }}
                        >
                          intent: {session.intent}
                        </span>
                      </div>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '8px',
                      }}
                    >
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {session.turns.length} {session.turns.length === 1 ? 'turn' : 'turns'}
                      </span>
                      <button
                        onClick={(e) => handleDelete(session.sessionId, e)}
                        title="Delete session"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748B',
                          cursor: 'pointer',
                          padding: '2px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Detailed Session View */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              backgroundColor: '#090D1A',
            }}
          >
            {selectedSession ? (
              <div>
                {/* Session Header Card */}
                <div
                  style={{
                    backgroundColor: '#0F172A',
                    border: '1px solid #1E293B',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38BDF8', fontFamily: 'monospace' }}>
                          {selectedSession.sessionId}
                        </span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            backgroundColor: 'rgba(99, 102, 241, 0.2)',
                            color: '#A5B4FC',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            fontWeight: 600,
                          }}
                        >
                          Speaker: {selectedSession.speakerName} ({selectedSession.speakerId})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
                        Started: {new Date(selectedSession.startedAt).toLocaleString()}
                      </div>
                    </div>

                    {onLoadSessionToWorkspace && (
                      <button
                        onClick={() => {
                          onLoadSessionToWorkspace(selectedSession);
                          onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          backgroundColor: '#4F46E5',
                          border: 'none',
                          color: '#FFFFFF',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        Load to Workspace <ChevronRight size={14} />
                      </button>
                    )}
                  </div>

                  {/* Entities & Constraints Snapshot */}
                  {selectedSession.semanticState && (
                    <div
                      style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid #1E293B',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8', width: '100%', marginBottom: '2px' }}>
                        Preserved Entities:
                      </div>
                      {Object.entries(selectedSession.semanticState.entities || {}).map(([k, v]) => (
                        <span
                          key={k}
                          style={{
                            fontSize: '0.7rem',
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            color: '#34D399',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                          }}
                        >
                          {k}: {v}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Turns List */}
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#E2E8F0', marginBottom: '12px' }}>
                  Conversation Turns ({selectedSession.turns.length})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedSession.turns.map((turn, idx) => {
                    const isUser = turn.speaker === 'user';
                    return (
                      <div
                        key={turn.id || idx}
                        style={{
                          backgroundColor: isUser ? '#101B33' : '#0B1527',
                          border: `1px solid ${isUser ? '#1E3A8A' : '#1E293B'}`,
                          borderRadius: '10px',
                          padding: '12px 16px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: isUser ? '#60A5FA' : '#34D399',
                            }}
                          >
                            {isUser ? selectedSession.speakerName : 'BhashaFlow (Rime Arcana V3)'}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{turn.timestamp}</span>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#F1F5F9', margin: '4px 0', lineHeight: 1.5 }}>
                          {turn.rawTranscript}
                        </p>

                        {turn.normalizedMeaning && (
                          <div
                            style={{
                              fontSize: '0.72rem',
                              color: '#94A3B8',
                              marginTop: '6px',
                              borderLeft: '2px solid #6366F1',
                              paddingLeft: '8px',
                            }}
                          >
                            Meaning: {turn.normalizedMeaning}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748B' }}>
                Select a session on the left to view turns and preserved entities.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
