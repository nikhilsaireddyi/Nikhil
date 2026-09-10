'use client';

import { useState, useEffect, useRef } from 'react';
import { centralScroll } from '@/motion/scroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Cpu, Zap, ChevronUp, ChevronDown, Layers, Activity, Volume2, VolumeX, Compass } from 'lucide-react';
import { isSoundEnabled, toggleSound, playSynapticPulse, startAmbientDrone, stopAmbientDrone, playHoverTick } from '@/lib/sound';
import { AudioSpectrumVisualizer } from '@/components/ui/AudioSpectrumVisualizer';
import type { BgVehicleMode } from '@/components/motion/BackgroundAtmosphere';

export function AutomotiveTelemetryHUD() {
  const [tflops, setTflops] = useState<number>(14.2);
  const [freq, setFreq] = useState<number>(3.2);
  const [tensorLayer, setTensorLayer] = useState<string>('L1');
  const [latency, setLatency] = useState<number>(0.8);
  const [singularityPct, setSingularityPct] = useState<number>(0);
  const [minimized, setMinimized] = useState<boolean>(false);
  const [soundActive, setSoundActive] = useState<boolean>(() => isSoundEnabled());
  const [vehicleMode, setVehicleMode] = useState<BgVehicleMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-bg-vehicle') as BgVehicleMode | null;
      if (saved && (saved === 'spaceship' || saved === 'supra' || saved === 'escort')) {
        return saved;
      }
    }
    return 'escort';
  });

  const handleVehicleChange = (mode: BgVehicleMode) => {
    playHoverTick();
    setVehicleMode(mode);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('set-bg-vehicle', { detail: mode }));
      try {
        localStorage.setItem('portfolio-bg-vehicle', mode);
      } catch {}
    }
  };

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundActive(newState);
    if (newState) {
      playSynapticPulse();
      startAmbientDrone();
    } else {
      stopAmbientDrone();
    }
  };


  const reducedMotion = useReducedMotion();
  const currentSpeed = useRef<number>(14.2);
  const targetSpeed = useRef<number>(14.2);

  useEffect(() => {
    if (reducedMotion) return;

    const unsubscribe = centralScroll.subscribe((payload) => {
      // Map scroll velocity to simulated compute burst (14.2 TFLOPS idle -> up to 240+ PFLOPS burst)
      const absVelocity = Math.abs(payload.velocity);
      const burstCompute = 14.2 + Math.min(absVelocity * 38, 225.8);
      targetSpeed.current = burstCompute;
      setSingularityPct(Math.round(payload.progress * 100));

      // Tensor Layer progression based on scroll progress
      if (payload.progress < 0.25) {
        setTensorLayer('L1');
      } else if (payload.progress < 0.5) {
        setTensorLayer('L2');
      } else if (payload.progress < 0.75) {
        setTensorLayer('L3');
      } else {
        setTensorLayer('AI');
      }
    });

    let animId: number;

    const loop = () => {
      // Smooth interpolation for compute metrics
      currentSpeed.current += (targetSpeed.current - currentSpeed.current) * 0.12;
      const tf = Number(currentSpeed.current.toFixed(1));
      setTflops(tf);

      // Synaptic Frequency & Latency dynamics
      const simulatedFreq = Number((2.8 + (currentSpeed.current / 240) * 2.0).toFixed(2));
      setFreq(simulatedFreq);

      const simulatedLatency = Number(Math.max(0.4, 1.2 - (currentSpeed.current / 240) * 0.7).toFixed(2));
      setLatency(simulatedLatency);

      // Natural decay towards baseline idle (14.2 TFLOPS)
      targetSpeed.current = 14.2 + (targetSpeed.current - 14.2) * 0.94;

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      unsubscribe();
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  const getFreqColor = () => {
    if (freq > 4.4) return 'from-[#FFB703] to-[#FF007F]';
    if (freq > 3.8) return 'from-[#C7FF4A] to-[#FFB703]';
    if (freq > 3.2) return 'from-[#00F0FF] to-[#C7FF4A]';
    return 'from-[#7928CA] to-[#00F0FF]';
  };

  return (
    <aside
      aria-label="AI Neural Compute Telemetry HUD"
      className="hidden md:block fixed bottom-6 right-6 z-40 select-none font-mono"
    >
      <div className="border border-[rgba(242,240,234,0.14)] bg-[#0A0B10]/95 backdrop-blur-2xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-xl transition-all duration-300 w-72 hover:border-[#00F0FF]/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)]">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[rgba(242,240,234,0.08)] pb-2.5 mb-2.5 text-[10px] text-[#8E8E8E]">
          <div className="flex items-center gap-2 text-[#00F0FF]">
            <Cpu size={13} className="animate-pulse text-[#00F0FF]" />
            <span className="font-bold tracking-widest text-[#F2F0EA]">AI NEURAL COMPUTE</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleSoundToggle}
              className={`flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded border transition-colors ${
                soundActive
                  ? 'border-[#00F0FF] text-[#00F0FF] bg-[#00F0FF]/10 shadow-[0_0_8px_rgba(0,240,255,0.3)]'
                  : 'border-[rgba(242,240,234,0.1)] text-[#8E8E8E] hover:text-[#F2F0EA]'
              }`}
              title={soundActive ? 'Mute Procedural Sound' : 'Enable Procedural Sound'}
              aria-label={soundActive ? 'Mute Procedural Sound' : 'Enable Procedural Sound'}
            >
              {soundActive ? <Volume2 size={11} /> : <VolumeX size={11} />}
              <span>{soundActive ? 'AUDIO ON' : 'MUTED'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMinimized(!minimized)}
              className="text-[#8E8E8E] hover:text-[#00F0FF] transition-colors"
              aria-label={minimized ? 'Expand Telemetry' : 'Minimize Telemetry'}
            >
              {minimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {!minimized && (
          <>
            {/* TFLOPS & Layer Section */}
            <div className="flex items-baseline justify-between my-2">
              <div>
                <span className="text-3xl font-sans font-black text-[#F2F0EA] tracking-tighter drop-shadow-[0_0_12px_rgba(0,240,255,0.3)]">
                  {tflops > 100 ? `${(tflops / 10).toFixed(1)}` : tflops.toFixed(1)}
                </span>
                <span className="text-[10px] text-[#00F0FF] font-bold ml-1.5">
                  {tflops > 100 ? 'PFLOPS' : 'TFLOPS'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-[10px] text-[#8E8E8E]">LAYER</div>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border font-bold text-xs shadow-md transition-colors ${
                    tensorLayer === 'AI'
                      ? 'border-[#C7FF4A] text-[#070707] bg-gradient-to-tr from-[#C7FF4A] to-[#00F0FF] shadow-[0_0_15px_#C7FF4A]'
                      : 'border-[#7928CA]/60 text-[#00F0FF] bg-[#14151B] shadow-[0_0_10px_rgba(121,40,202,0.3)]'
                  }`}
                >
                  {tensorLayer}
                </div>
              </div>
            </div>

            {/* Dynamic Synaptic Frequency Bar */}
            <div className="space-y-1 mb-2.5">
              <div className="flex justify-between text-[9px]">
                <span className="text-[#8E8E8E]">SYNAPSE FREQ: <span className="text-[#F2F0EA] font-bold">{freq} GHz</span></span>
                <span className={freq > 4.4 ? 'text-[#FF007F] font-bold animate-pulse' : 'text-[#8E8E8E]'}>
                  PEAK 4.8 GHz
                </span>
              </div>
              <div className="h-2 w-full bg-[#14151B] overflow-hidden rounded-full border border-[rgba(242,240,234,0.08)]">
                <div
                  className={`h-full transition-[width] duration-75 ease-out rounded-full bg-gradient-to-r ${getFreqColor()} ${
                    freq > 4.4 ? 'shadow-[0_0_12px_#FF007F]' : ''
                  }`}
                  style={{
                    width: `${Math.min(100, (freq / 4.8) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Real-Time Audio Frequency FFT Spectrum */}
            <div className="flex items-center justify-between my-2 py-1 px-1.5 bg-[#0F111A] rounded border border-[rgba(242,240,234,0.08)]">
              <div className="flex items-center gap-1 text-[8px] text-[#8E8E8E]">
                <Activity size={10} className="text-[#C7FF4A]" />
                <span>FFT SPECTRUM</span>
              </div>
              <AudioSpectrumVisualizer />
            </div>

            {/* Sub Metrics: Latency & State */}
            <div className="flex items-center justify-between pt-2.5 border-t border-[rgba(242,240,234,0.06)] text-[9px] text-[#8E8E8E]">
              <div className="flex items-center gap-1.5">
                <Zap size={11} className="text-[#00F0FF]" />
                <span>LATENCY: <span className="text-[#00F0FF] font-bold">{latency} ms</span></span>
              </div>
              <div className="flex items-center gap-1 text-[#C7FF4A]">
                <Activity size={10} className="animate-pulse" />
                <span>FP16 SYNERGY</span>
              </div>
            </div>

            {/* Background 3D Vehicle Switcher */}
            <div className="mt-2 pt-2 border-t border-[rgba(242,240,234,0.06)] flex items-center justify-between text-[9px]">
              <div className="flex items-center gap-1 text-[#8E8E8E]">
                <Compass size={11} className="text-[#C7FF4A]" />
                <span>3D VEHICLE:</span>
              </div>
              <div className="flex items-center gap-1">
                {(
                  [
                    { id: 'spaceship', label: '🚀 SCOUT' },
                    { id: 'supra', label: '🏎️ SUPRA' },
                    { id: 'escort', label: '⚡ ESCORT' },
                  ] as const
                ).map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleVehicleChange(v.id)}
                    className={`px-1.5 py-0.5 rounded border text-[8px] font-bold uppercase transition-all ${
                      vehicleMode === v.id
                        ? 'border-[#00F0FF] bg-[#00F0FF]/20 text-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.3)]'
                        : 'border-[rgba(242,240,234,0.08)] text-[#666] hover:text-[#F2F0EA]'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Singularity Core Convergence Status */}
            <div className="mt-2 pt-2 border-t border-[rgba(242,240,234,0.06)] flex items-center justify-between text-[9px]">
              <div className="flex items-center gap-1.5 text-[#8E8E8E]">
                <Layers size={11} className="text-[#7928CA]" />
                <span>SINGULARITY CORE:</span>
              </div>
              <span className="text-[#00F0FF] font-bold">
                {singularityPct}% CONVERGED
              </span>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

// Re-export alias
export { AutomotiveTelemetryHUD as NeuralComputeHUD };

