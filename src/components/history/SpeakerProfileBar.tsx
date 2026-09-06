import React, { useState } from 'react';
import { User, History, ChevronDown, Check, Plus } from 'lucide-react';
import { DEFAULT_SPEAKERS } from '../../services/historyStorage';

interface SpeakerProfileBarProps {
  currentSpeaker: { id: string; name: string };
  onSelectSpeaker: (speaker: { id: string; name: string }) => void;
  onOpenHistory: () => void;
  sessionCount: number;
}

export const SpeakerProfileBar: React.FC<SpeakerProfileBarProps> = ({
  currentSpeaker,
  onSelectSpeaker,
  onOpenHistory,
  sessionCount,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName.trim()) {
      const newSpeaker = {
        id: `speaker_${Date.now().toString().slice(-4)}`,
        name: customName.trim(),
      };
      onSelectSpeaker(newSpeaker);
      setCustomName('');
      setIsAddingCustom(false);
      setDropdownOpen(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '8px 14px',
        backgroundColor: '#0B1120',
        borderRadius: '10px',
        border: '1px solid #1E293B',
        fontSize: '0.8rem',
      }}
    >
      {/* Active Speaker Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#818CF8',
          }}
        >
          <User size={13} />
        </div>

        <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Active Speaker:</span>

        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#F8FAFC',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 6px',
            borderRadius: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <span>{currentSpeaker.name}</span>
          <span style={{ fontSize: '0.7rem', color: '#38BDF8', fontFamily: 'monospace' }}>
            ({currentSpeaker.id})
          </span>
          <ChevronDown size={14} color="#94A3B8" />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              backgroundColor: '#0F172A',
              border: '1px solid #1E293B',
              borderRadius: '8px',
              padding: '6px',
              width: '260px',
              zIndex: 30,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                fontSize: '0.68rem',
                color: '#64748B',
                padding: '4px 8px',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Select Speaker Profile
            </div>

            {DEFAULT_SPEAKERS.map((spk) => {
              const active = spk.id === currentSpeaker.id;
              return (
                <div
                  key={spk.id}
                  onClick={() => {
                    onSelectSpeaker(spk);
                    setDropdownOpen(false);
                  }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    color: active ? '#818CF8' : '#E2E8F0',
                    fontSize: '0.75rem',
                  }}
                >
                  <div>
                    <div>{spk.name}</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B', fontFamily: 'monospace' }}>
                      {spk.id}
                    </div>
                  </div>
                  {active && <Check size={14} />}
                </div>
              );
            })}

            {/* Add Custom Speaker */}
            <div style={{ borderTop: '1px solid #1E293B', marginTop: '6px', paddingTop: '6px' }}>
              {isAddingCustom ? (
                <form onSubmit={handleAddCustom} style={{ display: 'flex', gap: '4px', padding: '2px 4px' }}>
                  <input
                    type="text"
                    placeholder="Enter name..."
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    autoFocus
                    style={{
                      flex: 1,
                      backgroundColor: '#090D1A',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      padding: '4px 6px',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#4F46E5',
                      border: 'none',
                      color: '#FFF',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Add
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingCustom(true)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: '#38BDF8',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Plus size={13} /> + New Custom Speaker ID
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* View History Button */}
      <button
        onClick={onOpenHistory}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 12px',
          backgroundColor: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#A5B4FC',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.75rem',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.25)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.12)')}
      >
        <History size={14} />
        <span>Speaker History</span>
        {sessionCount > 0 && (
          <span
            style={{
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              borderRadius: '999px',
              padding: '1px 6px',
              fontSize: '0.65rem',
              fontWeight: 700,
            }}
          >
            {sessionCount}
          </span>
        )}
      </button>
    </div>
  );
};
