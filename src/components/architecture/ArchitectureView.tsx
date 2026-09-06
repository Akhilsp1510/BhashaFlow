import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ArchitectureNode {
  id: string;
  title: string;
  subtitle: string;
  tech: string;
  description: string;
  hardProblemSolved: string;
}

export const ArchitectureView: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string>('node-entity');

  const nodes: ArchitectureNode[] = [
    {
      id: 'node-client',
      title: '1. Browser Client',
      subtitle: 'Audio Capture & Barge-In',
      tech: 'Web Audio API + AudioWorklet',
      description:
        'Continuous 16kHz audio capture with echo cancellation and local energy VAD for instant barge-in detection.',
      hardProblemSolved:
        'Prevents client audio clipping and enables immediate local cancellation of queued agent speech.',
    },
    {
      id: 'node-livekit',
      title: '2. LiveKit Realtime Transport',
      subtitle: 'WebRTC Full-Duplex Bridge',
      tech: 'LiveKit Agents Python SDK',
      description:
        'Manages bidirectionally streamed audio tracks and real-time control events over low-latency WebRTC.',
      hardProblemSolved:
        'Sub-50ms network transport with seamless reconnection and packet loss resilience.',
    },
    {
      id: 'node-stt',
      title: '3. Streaming Multilingual STT',
      subtitle: 'Code-Mixed Acoustic Model',
      tech: 'Streaming STT / Sarvam / Nova-3',
      description:
        'Generates low-latency transcript chunks with partial word-level timing and code-mixed confidence tags.',
      hardProblemSolved:
        'Recognizes English loanwords pronounced with Indian accents without dropping sentence context.',
    },
    {
      id: 'node-lang',
      title: '4. Language & Switch Layer',
      subtitle: 'Intra-Sentence Segmentation',
      tech: 'Token-level Classifier & Debouncer',
      description:
        'Labels each word as HI, EN, or MIX. Applies 2-3 word debouncing so stray loanwords do not flap system language state.',
      hardProblemSolved:
        'Solves the "switch flap" problem where "Okay" or "Theek hai" flips the entire conversation mode.',
    },
    {
      id: 'node-entity',
      title: '5. Entity Protection & Invariant Schema',
      subtitle: 'Zero-Paraphrase Invariant Lock',
      tech: 'Deterministic Regex & Schema Guard',
      description:
        'Extracts critical IDs (4812, ORD98765), amounts (₹2499), and negative constraints ("DO NOT CLOSE"). Locks them against LLM rewriting.',
      hardProblemSolved:
        'Eliminates the #1 customer support failure mode: LLMs hallucinating or "simplifying" critical ticket numbers.',
    },
    {
      id: 'node-intent',
      title: '6. Support Tool Controller',
      subtitle: 'Synthetic CRM Execution',
      tech: 'FastAPI / In-Memory Event Ledger',
      description:
        'Executes exact customer service actions (check complaint status, append notes) while enforcing preserved constraints.',
      hardProblemSolved:
        'Guarantees that a user saying "don\'t close it" results in a confirmed OPEN status in CRM.',
    },
    {
      id: 'node-policy',
      title: '7. Response Language Policy',
      subtitle: 'Deliberate Output Planner',
      tech: 'Mirror Mix / English / Hindi Rules',
      description:
        'Determines whether agent should reply in natural Hinglish (Mirror Mix) or switch to pure English/Hindi per explicit user directive.',
      hardProblemSolved:
        'Removes rigid language dropdowns while respecting dynamic requests ("English mein explain karo").',
    },
    {
      id: 'node-rime',
      title: '8. Rime Arcana V3 Multilingual TTS',
      subtitle: 'Single-Speaker Code-Switching Voice',
      tech: 'Rime WebSocket /ws3 Protocol',
      description:
        'Streams natural spoken audio with word timestamps. One unified speaker persona ("Seraphina") speaks both Hindi and English fluidly.',
      hardProblemSolved:
        'Eliminates voice swapping! Basic models need two different voices; Arcana V3 speaks Hinglish naturally without awkward pauses.',
    },
  ];

  const activeNode = nodes.find((n) => n.id === activeNodeId) || nodes[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Differentiation Headline Card */}
      <div
        className="card"
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
          border: '1px solid #4F46E5',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={20} className="text-indigo-400" />
          <span className="badge" style={{ backgroundColor: '#312E81', color: '#C7D2FE' }}>
            CORE ENGINEERING DIFFERENTIATION
          </span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
          "We don't just transcribe what you said. We preserve what you meant."
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#CBD5E1', maxWidth: '780px', lineHeight: '1.5' }}>
          Traditional voice assistants force users into monolingual modes or collapse speech into generic translations, losing numbers and negative constraints. BhashaFlow maintains an invariant code-switched semantic state throughout the entire pipeline.
        </p>

        {/* Contrast Diagram */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px',
            marginTop: '20px',
          }}
        >
          <div
            style={{
              padding: '14px',
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F87171', marginBottom: '6px' }}>
              TRADITIONAL PIPELINE (FRAGILE)
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              Speech → Dominant STT → Machine Translation → Generic LLM → TTS Swap
            </div>
            <div style={{ fontSize: '0.72rem', color: '#EF4444', marginTop: '6px' }}>
              ✗ Drops negative constraints ("mat karna")<br />
              ✗ Distorts alphanumeric IDs (4812 → 48-1-2 / dropped)<br />
              ✗ Pauses to switch between English and Hindi voice models
            </div>
          </div>

          <div
            style={{
              padding: '14px',
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.4)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34D399', marginBottom: '6px' }}>
              BHASHAFLOW ARCHITECTURE (PRESERVATIVE)
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6EE7B7', fontFamily: 'var(--font-mono)' }}>
              Speech → Language Segments → Entity Guard → Schema Intent → Rime Arcana V3
            </div>
            <div style={{ fontSize: '0.72rem', color: '#10B981', marginTop: '6px' }}>
              ✓ Preserves raw transcript + language tags<br />
              ✓ Locks critical entities with zero-hallucination guard<br />
              ✓ Seamless bilingual single-voice synthesis via Rime Arcana V3
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Pipeline Nodes */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>
          End-to-End System Pipeline (Click Node to Inspect)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '18px' }}>
          {nodes.map((n) => {
            const isSelected = n.id === activeNodeId;
            return (
              <button
                key={n.id}
                onClick={() => setActiveNodeId(n.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-surface-subtle)',
                  border: isSelected ? '1px solid #6366F1' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isSelected ? '#A5B4FC' : 'var(--text-primary)' }}>
                  {n.title}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {n.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Node Deep Dive */}
        <div
          style={{
            padding: '16px 18px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-accent)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#38BDF8' }}>
                {activeNode.title}: {activeNode.subtitle}
              </h4>
              <span className="badge" style={{ backgroundColor: '#1E293B', color: '#94A3B8', marginTop: '4px' }}>
                Technology: {activeNode.tech}
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5', marginBottom: '10px' }}>
            {activeNode.description}
          </p>

          <div
            style={{
              padding: '8px 12px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '6px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontSize: '0.78rem',
              color: '#A7F3D0',
            }}
          >
            <strong>Hard Voice Engineering Contribution: </strong>
            {activeNode.hardProblemSolved}
          </div>
        </div>
      </div>
    </div>
  );
};
