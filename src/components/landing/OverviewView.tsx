import React from 'react';
import {
  Radio,
  Mic,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Cpu,
  GitCommit,
  Zap,
  Volume2,
  FileCheck,
} from 'lucide-react';

interface OverviewViewProps {
  onNavigate: (tab: 'workspace' | 'demo' | 'understanding' | 'workflow' | 'evaluation' | 'rime' | 'architecture') => void;
  onLaunchCanonicalDemo: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  onLaunchCanonicalDemo,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* 1. HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '48px 32px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(14, 19, 31, 0.95) 50%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1px solid rgba(79, 70, 229, 0.3)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Subtle background glow */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Hackathon Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(79, 70, 229, 0.2)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            color: '#C7D2FE',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          <Sparkles size={14} className="text-indigo-400" />
          <span>IIT Kharagpur DataForge × Rime Hackathon 2026 • Code-Switched Speech</span>
        </div>

        {/* Hero Tagline Display */}
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '18px',
            maxWidth: '900px',
          }}
        >
          <span className="text-gradient">YOUR LANGUAGE CAN SWITCH.</span>
          <br />
          <span className="text-gradient-amber">YOUR MEANING SHOULDN'T.</span>
        </h1>

        {/* Supporting description */}
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.18rem)',
            color: 'var(--text-secondary)',
            maxWidth: '720px',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}
        >
          BhashaFlow is a voice-native conversational assistant designed for spontaneous Hindi-English code-switching.
          It protects critical ticket IDs, negative constraints, and contextual reasons from translation distortions,
          synthesizing responses via <strong>Rime Arcana V3</strong> in under 800ms.
        </p>

        {/* Primary Call to Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => onNavigate('workspace')}
            className="btn-primary"
            style={{ fontSize: '1rem', padding: '14px 28px' }}
          >
            <Mic size={20} />
            <span>Start Voice Session</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => {
              onLaunchCanonicalDemo();
              onNavigate('demo');
            }}
            className="btn-secondary"
            style={{ fontSize: '1rem', padding: '14px 28px' }}
          >
            <Sparkles size={18} className="text-indigo-400" />
            <span>Interactive Demo Tour</span>
          </button>

          <button
            onClick={() => onNavigate('architecture')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '12px 18px',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
            }}
          >
            Explore System Pipeline →
          </button>
        </div>

        {/* Quick Trust Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            marginTop: '36px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            flexWrap: 'wrap',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={14} className="text-cyan-400" />
            <span>Rime Arcana V3 (Unified Bilingual Voice)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} className="text-emerald-400" />
            <span>712ms TTFA Spoken Latency</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} className="text-indigo-400" />
            <span>Zero-Paraphrase Invariant Lock</span>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM & THE SOLUTION: SIDE-BY-SIDE CONTRAST */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>
            The Hindi-English Code-Switching Breakdown
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
            See why standard assistants fail Indian bilingual speakers—and how BhashaFlow guarantees meaning preservation.
          </p>
        </div>

        {/* Example Speech Bubble */}
        <div
          className="card"
          style={{
            padding: '18px 24px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Spoken Utterance (Intra-sentence Code-Switching)
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', marginTop: '4px' }}>
              <span className="badge segment-hi" style={{ marginRight: '6px' }}>HI</span>
              "Mera complaint number <strong style={{ color: '#6EE7B7' }}>4812</strong> check karo,{' '}
              <span className="badge segment-en" style={{ margin: '0 4px' }}>EN</span>
              but please <strong style={{ color: '#FCA5A5' }}>don't close it</strong> because issue abhi bhi happening hai."
            </div>
          </div>

          <button
            onClick={() => {
              onLaunchCanonicalDemo();
              onNavigate('workspace');
            }}
            className="btn-primary"
            style={{ fontSize: '0.8rem', padding: '8px 16px' }}
          >
            <PlayCircleIcon />
            Run in Workspace
          </button>
        </div>

        {/* Contrast Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Traditional Voice Assistant Card */}
          <div
            className="card"
            style={{
              padding: '24px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              backgroundColor: 'rgba(239, 68, 68, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <XCircle size={22} className="text-rose-400" />
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FCA5A5' }}>
                  Traditional Voice Assistant
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Monolingual STT + Direct Translation
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#FCA5A5' }}>
                <span style={{ fontWeight: 700 }}>•</span>
                <span><strong>Alphanumeric Entity Loss:</strong> Misinterprets "4812" phonetically as "forty-eight twelve" or corrupts alphanumeric codes.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#FCA5A5' }}>
                <span style={{ fontWeight: 700 }}>•</span>
                <span><strong>Negative Constraint Inversion:</strong> Translators miss the double negative in code-switching, erroneously marking the complaint as <em>CLOSED</em>.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#FCA5A5' }}>
                <span style={{ fontWeight: 700 }}>•</span>
                <span><strong>Jarring Voice Swapping:</strong> Switches abruptly between an English robotic voice and a Hindi voice mid-response.</span>
              </div>
            </div>

            <div
              style={{
                marginTop: 'auto',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                fontSize: '0.78rem',
                color: '#FECDD3',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Result: CRM Ticket #4812 CLOSED (Fatal failure)
            </div>
          </div>

          {/* BhashaFlow Code-Switch Engine Card */}
          <div
            className="card"
            style={{
              padding: '24px',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              backgroundColor: 'rgba(16, 185, 129, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={22} className="text-emerald-400" />
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#6EE7B7' }}>
                  BhashaFlow Engine
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Semantic State Preservation + Rime Arcana V3
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#CBD5E1' }}>
                <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span>
                <span><strong>Zero-Paraphrase Invariant Lock:</strong> Complaint ID <code style={{ color: '#6EE7B7' }}>4812</code> is locked and protected against LLM re-writing.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#CBD5E1' }}>
                <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span>
                <span><strong>Strict Negative Constraint Enforcement:</strong> <code style={{ color: '#FCA5A5' }}>DO NOT CLOSE</code> enforced in the CRM tool controller.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#CBD5E1' }}>
                <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span>
                <span><strong>Unified Single Persona via Rime:</strong> "Seraphina" speaks natural Hinglish mirror-mix without voice swapping (<span style={{ color: '#34D399' }}>712ms TTFA</span>).</span>
              </div>
            </div>

            <div
              style={{
                marginTop: 'auto',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: '0.78rem',
                color: '#A7F3D0',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Result: CRM Ticket #4812 KEPT OPEN • Note Logged • Mirror Mix Audio Delivered
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE CORE PRODUCT CAPABILITIES */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>
            Built for National-Level Voice Intelligence
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
            Explore each specialized layer of the BhashaFlow architecture.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {/* Card 1: Semantic State */}
          <div
            onClick={() => onNavigate('understanding')}
            className="card"
            style={{
              padding: '22px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10B981',
              }}
            >
              <Cpu size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
              Semantic Understanding
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Inspect what BhashaFlow extracted: Intent, Protected Entities, Constraints, and Response Language Policy with 100% confidence locks.
            </p>
            <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600, marginTop: 'auto' }}>
              View Understanding Panel →
            </span>
          </div>

          {/* Card 2: Workflow Pipeline */}
          <div
            onClick={() => onNavigate('workflow')}
            className="card"
            style={{
              padding: '22px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(79, 70, 229, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6366F1',
              }}
            >
              <GitCommit size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
              Workflow Execution
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Follow the full-duplex journey from streaming WebRTC audio to Token Classifier, CRM tool actions, and TTS synthesis.
            </p>
            <span style={{ fontSize: '0.8rem', color: '#818CF8', fontWeight: 600, marginTop: 'auto' }}>
              View Workflow Pipeline →
            </span>
          </div>

          {/* Card 3: Rime Observability */}
          <div
            onClick={() => onNavigate('rime')}
            className="card"
            style={{
              padding: '22px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#06B6D4',
              }}
            >
              <Volume2 size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
              Rime Voice Engine
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Live telemetry for Rime Arcana V3 WebSocket streaming, sub-800ms TTFA, single-speaker persona, and barge-in audio queue purging.
            </p>
            <span style={{ fontSize: '0.8rem', color: '#22D3EE', fontWeight: 600, marginTop: 'auto' }}>
              View Rime Observability →
            </span>
          </div>

          {/* Card 4: Evaluation Lab */}
          <div
            onClick={() => onNavigate('evaluation')}
            className="card"
            style={{
              padding: '22px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F59E0B',
              }}
            >
              <FileCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
              Evaluation Lab & Baselines
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              50 labelled fixtures, 3-way benchmark against Baseline A and B, 94.8% entity accuracy, and 20 verified stress test cases.
            </p>
            <span style={{ fontSize: '0.8rem', color: '#FCD34D', fontWeight: 600, marginTop: 'auto' }}>
              Explore Evaluation Lab →
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

const PlayCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
