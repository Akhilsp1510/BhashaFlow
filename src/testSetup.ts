import '@testing-library/jest-dom';

// Web Audio API mock for jsdom
class MockAudioContext {
  state = 'running';
  resume = vi.fn().mockResolvedValue(undefined);
  close = vi.fn().mockResolvedValue(undefined);
  createAnalyser = vi.fn().mockReturnValue({
    fftSize: 64,
    smoothingTimeConstant: 0.8,
    frequencyBinCount: 32,
    getByteFrequencyData: vi.fn(),
  });
  createMediaStreamSource = vi.fn().mockReturnValue({
    connect: vi.fn(),
    disconnect: vi.fn(),
  });
}

(window as unknown as { AudioContext: typeof MockAudioContext }).AudioContext = MockAudioContext;

// SpeechSynthesis mock for jsdom
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    getVoices: vi.fn().mockReturnValue([]),
  },
  writable: true,
});

// MediaDevices mock
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      active: true,
      getTracks: vi.fn().mockReturnValue([{ stop: vi.fn() }]),
    }),
  },
  writable: true,
});
