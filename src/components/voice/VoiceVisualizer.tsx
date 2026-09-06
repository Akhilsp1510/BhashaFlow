import React, { useEffect, useRef } from 'react';
import type { VoiceState } from '../../types';

interface VoiceVisualizerProps {
  frequencyData: Uint8Array;
  rms: number;
  voiceState: VoiceState;
  height?: number;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  frequencyData,
  rms,
  voiceState,
  height = 90,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const barCount = 36;
      const barWidth = 4;
      const gap = (width - barCount * barWidth) / (barCount - 1);
      const centerY = canvas.height / 2;

      // Determine palette based on voice state
      let color1 = '#4F46E5';
      let color2 = '#06B6D4';

      if (voiceState === 'listening') {
        color1 = '#10B981';
        color2 = '#34D399';
      } else if (voiceState === 'speaking') {
        color1 = '#3B82F6';
        color2 = '#818CF8';
      } else if (voiceState === 'understanding' || voiceState === 'checking') {
        color1 = '#8B5CF6';
        color2 = '#C084FC';
      } else if (voiceState === 'interrupted') {
        color1 = '#EF4444';
        color2 = '#F87171';
      } else if (voiceState === 'clarifying') {
        color1 = '#F59E0B';
        color2 = '#FCD34D';
      }

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + gap);
        // Map frequency data or generate subtle ambient wave
        const dataIndex = Math.floor((i / barCount) * (frequencyData.length || 32));
        const rawVal = frequencyData[dataIndex] || 0;
        
        let amplitude = (rawVal / 255) * (canvas.height * 0.85);

        // Ambient idle breathing if no audio signal
        if (amplitude < 4) {
          const t = Date.now() / 350;
          amplitude = Math.sin(t + i * 0.3) * 5 + 8;
        }

        // Add RMS energy punch
        amplitude = amplitude * (1 + rms * 1.5);
        amplitude = Math.min(amplitude, canvas.height * 0.95);

        const gradient = ctx.createLinearGradient(0, centerY - amplitude / 2, 0, centerY + amplitude / 2);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, centerY - amplitude / 2, barWidth, Math.max(4, amplitude), 3);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [frequencyData, rms, voiceState]);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <canvas
        ref={canvasRef}
        width={360}
        height={height}
        style={{
          width: '100%',
          maxWidth: '380px',
          height: `${height}px`,
        }}
        aria-label="Realtime voice frequency visualizer"
      />
    </div>
  );
};
