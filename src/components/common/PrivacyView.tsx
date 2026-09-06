import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <ShieldCheck size={24} className="text-emerald-400" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
            Security, Privacy & Ethics Standards
          </h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          BhashaFlow adheres strictly to the security, data privacy, and secret hygiene guidelines outlined by the IIT Kharagpur DataForge × Rime Hackathon rules.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px',
            marginTop: '20px',
          }}
        >
          <div className="card-elevated" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Lock size={16} className="text-indigo-400" />
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Zero Exposed Secrets</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              API credentials for Rime, LiveKit, and speech models are restricted entirely to server-side environments. No client-side keys or authorization tokens are embedded in frontend bundles or repository code.
            </p>
          </div>

          <div className="card-elevated" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <EyeOff size={16} className="text-emerald-400" />
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>100% Synthetic Support Records</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              All customer names, ticket IDs (e.g., 4812, 8831), amounts, and addresses used in live demos and test fixtures are completely synthetic. Zero real customer PII or financial data is handled.
            </p>
          </div>

          <div className="card-elevated" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FileText size={16} className="text-blue-400" />
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Session-Only Audio Retention</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Audio frames captured via the browser Web Audio API are processed in-memory for streaming feature extraction and visualizer rendering only. Raw user microphone audio is purged immediately upon session disconnect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
