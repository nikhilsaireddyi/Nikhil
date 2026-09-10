// Procedural Web Audio API Sound Synthesizer
// 100% synthesized in-browser — Zero external audio files, Zero network latency

let audioCtx: AudioContext | null = null;
let masterAnalyser: AnalyserNode | null = null;
let soundEnabled = false;

// Initialize AudioContext on first user gesture
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function getAudioAnalyser(): AnalyserNode | null {
  if (typeof window === 'undefined') return null;
  const ctx = getAudioContext();
  if (!ctx) return null;
  if (!masterAnalyser) {
    masterAnalyser = ctx.createAnalyser();
    masterAnalyser.fftSize = 64;
    masterAnalyser.smoothingTimeConstant = 0.8;
    masterAnalyser.connect(ctx.destination);
  }
  return masterAnalyser;
}

export function getAudioDestination(): AudioNode | null {
  const ctx = getAudioContext();
  if (!ctx) return null;
  const analyser = getAudioAnalyser();
  return analyser || ctx.destination;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean): boolean {
  soundEnabled = enabled;
  if (soundEnabled) {
    getAudioContext();
  }
  return soundEnabled;
}

export function toggleSound(): boolean {
  return setSoundEnabled(!soundEnabled);
}

// 1. Tactile Micro-Click on Button / Link Hover
export function playHoverTick() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  } catch {
    // Ignore audio errors gracefully
  }
}

// 2. Synaptic Pulse / Layer Explode Chime
export function playSynapticPulse() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.25); // C6

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(659.25, now); // E5
    osc2.frequency.exponentialRampToValueAtTime(1318.5, now + 0.25); // E6

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.3);
    osc2.stop(now + 0.3);
  } catch {
    // Ignore audio errors gracefully
  }
}

// 3. Resonant Overclock Compute Surge
export function playOverclockSurge() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.6);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.5);
    filter.Q.value = 6;

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.65);
  } catch {
    // Ignore audio errors gracefully
  }
}

// 4. Spacetime Gravitational Shockwave Sub-Bass
export function playShockwaveBoom() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  } catch {
    // Ignore audio errors gracefully
  }
}

// 5. Pentatonic Synaptic Tone for Constellation Nodes
const PENTATONIC_SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0];
export function playNodeTone(index = 0) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const freq = PENTATONIC_SCALE[Math.abs(index) % PENTATONIC_SCALE.length];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.18);

    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  } catch {
    // Ignore audio errors
  }
}

// 6. Cyber Mechanical Keystroke for Terminal
export function playTerminalKey() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const randomFreq = 800 + Math.random() * 400;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(randomFreq, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch {
    // Ignore audio errors
  }
}

// 7. Mechanical Aperture / Shutter Blade Click for Vision Mode Switching
export function playApertureClick() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // First click: blade open
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2200, now);
    osc1.frequency.exponentialRampToValueAtTime(800, now + 0.025);
    gain1.gain.setValueAtTime(0.04, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.025);

    // Second click: blade lock
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1400, now + 0.03);
    osc2.frequency.exponentialRampToValueAtTime(450, now + 0.06);
    gain2.gain.setValueAtTime(0.035, now + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.03);
    osc2.stop(now + 0.06);
  } catch {
    // Ignore audio errors
  }
}

// 8. Procedural Cinematic Sci-Fi Ambient Drone (Warm low-frequency pads)
let droneGain: GainNode | null = null;
let droneOsc1: OscillatorNode | null = null;
let droneOsc2: OscillatorNode | null = null;

export function startAmbientDrone() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx || droneGain) return;

  try {
    const now = ctx.currentTime;
    droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.0001, now);
    droneGain.gain.exponentialRampToValueAtTime(0.015, now + 3);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, now);

    droneOsc1 = ctx.createOscillator();
    droneOsc2 = ctx.createOscillator();

    droneOsc1.type = 'sawtooth';
    droneOsc1.frequency.setValueAtTime(55, now); // A1 note

    droneOsc2.type = 'sine';
    droneOsc2.frequency.setValueAtTime(82.4, now); // E2 fifth

    droneOsc1.connect(filter);
    droneOsc2.connect(filter);
    filter.connect(droneGain);
    const dest = getAudioDestination();
    droneGain.connect(dest || ctx.destination);

    droneOsc1.start(now);
    droneOsc2.start(now);
  } catch {
    // Ignore audio errors
  }
}

export function stopAmbientDrone() {
  if (!droneGain) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
    setTimeout(() => {
      droneOsc1?.stop();
      droneOsc2?.stop();
      droneOsc1?.disconnect();
      droneOsc2?.disconnect();
      droneGain?.disconnect();
      droneOsc1 = null;
      droneOsc2 = null;
      droneGain = null;
    }, 1600);
  } catch {
    droneGain = null;
  }
}

// 9. Procedural Supercar Dyno Engine Rev Synthesizer
let engineOsc: OscillatorNode | null = null;
let engineGain: GainNode | null = null;
let engineFilter: BiquadFilterNode | null = null;

export function playEngineRev(rpm: number) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Map RPM (800 - 9000) to fundamental cylinder firing frequency (40Hz to 450Hz)
    const freq = 40 + (rpm / 9000) * 380;

    if (!engineOsc) {
      engineOsc = ctx.createOscillator();
      engineGain = ctx.createGain();
      engineFilter = ctx.createBiquadFilter();

      engineOsc.type = 'sawtooth';
      engineFilter.type = 'lowpass';
      engineFilter.frequency.setValueAtTime(350, now);

      engineOsc.connect(engineFilter);
      engineFilter.connect(engineGain);
      const dest = getAudioDestination();
      engineGain.connect(dest || ctx.destination);

      engineGain.gain.setValueAtTime(0.025, now);
      engineOsc.start(now);
    }

    if (engineOsc && engineFilter && engineGain) {
      engineOsc.frequency.setTargetAtTime(freq, now, 0.05);
      engineFilter.frequency.setTargetAtTime(freq * 3.2, now, 0.05);
      const intensity = 0.015 + (rpm / 9000) * 0.04;
      engineGain.gain.setTargetAtTime(intensity, now, 0.05);
    }
  } catch {
    // Ignore audio errors
  }
}

export function stopEngineSound() {
  if (engineGain) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    engineGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    setTimeout(() => {
      engineOsc?.stop();
      engineOsc?.disconnect();
      engineGain?.disconnect();
      engineOsc = null;
      engineGain = null;
      engineFilter = null;
    }, 350);
  }
}

// 10. Cyber Transmission Dispatch Chirp
export function playTransmissionSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  } catch {
    // Ignore audio errors
  }
}

// 11. Mechanical Keystroke Audio for Cyberpunk Terminal
export function playKeyClick() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800 + Math.random() * 300, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.025);

    gain.gain.setValueAtTime(0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain);
    const dest = getAudioDestination();
    gain.connect(dest || ctx.destination);

    osc.start(now);
    osc.stop(now + 0.025);
  } catch {
    // Ignore audio errors
  }
}

// 12. Sci-Fi Plasma Laser Bolt Fire
export function playLaserFire() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.09);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.09);
    filter.Q.value = 3.0;

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(filter);
    filter.connect(gain);
    const dest = getAudioDestination();
    gain.connect(dest || ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {
    // Ignore audio errors
  }
}
