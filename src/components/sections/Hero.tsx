'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { createTimeline, remove } from 'animejs';
import { siteConfig } from '@/data/site';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useCursorHover } from '@/hooks/useCursorHover';
import {
  ArrowDown,
  Cpu,
  Sparkles,
  Terminal,
  RotateCw,
  Crosshair,
  Zap,
  ExternalLink,
} from 'lucide-react';
import {
  playHoverTick,
  playApertureClick,
  playSynapticPulse,
} from '@/lib/sound';
import { CyberScramble } from '@/components/ui/CyberScramble';
import { RoleCycler } from '@/components/ui/RoleCycler';
import { TechGlossaryTooltip } from '@/components/ui/TechGlossaryTooltip';


const TECH_BADGES = [
  { name: 'Python', color: '#00F0FF', border: 'border-[#00F0FF]/40', bg: 'bg-[#00F0FF]/10' },
  { name: 'PyTorch', color: '#FF5E00', border: 'border-[#FF5E00]/40', bg: 'bg-[#FF5E00]/10' },
  { name: 'Next.js 16', color: '#F2F0EA', border: 'border-white/30', bg: 'bg-white/10' },
  { name: 'React 19', color: '#38BDF8', border: 'border-[#38BDF8]/40', bg: 'bg-[#38BDF8]/10' },
  { name: 'TypeScript', color: '#3B82F6', border: 'border-[#3B82F6]/40', bg: 'bg-[#3B82F6]/10' },
  { name: 'Tailwind CSS', color: '#2DD4BF', border: 'border-[#2DD4BF]/40', bg: 'bg-[#2DD4BF]/10' },
];



export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const portraitWrapperRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();
  const portraitCursor = useCursorHover('image', 'NIKHIL');
  const [sequenceComplete, setSequenceComplete] = useState<boolean>(() => reducedMotion);
  const [visionMode, setVisionMode] = useState<'studio' | 'tactical' | 'hologram'>('studio');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const isFlippedRef = useRef<boolean>(false);
  useEffect(() => {
    isFlippedRef.current = isFlipped;
  }, [isFlipped]);
  const [cardMousePos, setCardMousePos] = useState({ x: 50, y: 50 });


  // Opening cinematic sequence
  useEffect(() => {
    if (reducedMotion) {
      if (metaRef.current) metaRef.current.style.opacity = '1';
      if (title1Ref.current) title1Ref.current.style.opacity = '1';
      if (title2Ref.current) title2Ref.current.style.opacity = '1';
      if (portraitWrapperRef.current) portraitWrapperRef.current.style.opacity = '1';
      if (statementRef.current) statementRef.current.style.opacity = '1';
      if (scrollIndicatorRef.current) scrollIndicatorRef.current.style.opacity = '1';
      setSequenceComplete(true);
      return;
    }

    const tl = createTimeline({
      onComplete: () => {
        setSequenceComplete(true);
        if (metaRef.current) metaRef.current.style.opacity = '1';
        if (title1Ref.current) title1Ref.current.style.opacity = '1';
        if (title2Ref.current) title2Ref.current.style.opacity = '1';
        if (portraitWrapperRef.current) portraitWrapperRef.current.style.opacity = '1';
        if (statementRef.current) statementRef.current.style.opacity = '1';
        if (scrollIndicatorRef.current) scrollIndicatorRef.current.style.opacity = '1';
      },
    });

    if (metaRef.current) {
      tl.add(metaRef.current, {
        opacity: [0, 1],
        translateY: [15, 0],
        duration: 500,
        delay: 150,
        ease: 'outExpo',
      });
    }

    if (title1Ref.current) {
      tl.add(
        title1Ref.current,
        {
          opacity: [0, 1],
          translateY: [60, 0],
          duration: 750,
          ease: 'outExpo',
        },
        '-=250'
      );
    }

    if (title2Ref.current) {
      tl.add(
        title2Ref.current,
        {
          opacity: [0, 1],
          translateY: [60, 0],
          duration: 750,
          ease: 'outExpo',
        },
        '-=550'
      );
    }

    if (portraitWrapperRef.current) {
      tl.add(
        portraitWrapperRef.current,
        {
          opacity: [0, 1],
          scale: [0.94, 1],
          translateY: [30, 0],
          duration: 900,
          ease: 'outExpo',
        },
        '-=600'
      );
    }

    const footers = [statementRef.current, scrollIndicatorRef.current].filter(
      (el): el is HTMLDivElement => el !== null
    );

    if (footers.length) {
      tl.add(
        footers,
        {
          opacity: [0, 1],
          translateY: [15, 0],
          duration: 600,
          ease: 'outExpo',
        },
        '-=400'
      );
    }

    const rawTargets: (HTMLElement | null)[] = [
      metaRef.current,
      title1Ref.current,
      title2Ref.current,
      portraitWrapperRef.current,
      statementRef.current,
      scrollIndicatorRef.current,
    ];
    const targetsToClean = rawTargets.filter((el): el is HTMLElement => el !== null);

    return () => {
      if (targetsToClean.length) {
        remove(targetsToClean);
        targetsToClean.forEach((el) => {
          el.style.opacity = '1';
        });
      }
    };
  }, [reducedMotion]);

  const [telemetryAngles, setTelemetryAngles] = useState({ pitch: 0, roll: 0, yaw: 0, gForce: 1.0 });

  // Subtle interactive pointer tilt & live 3D telemetry tracking
  useEffect(() => {
    if (reducedMotion || !sequenceComplete) return;

    const container = containerRef.current;
    const portrait = portraitWrapperRef.current;
    if (!container || !portrait) return;

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      targetRotY = x * 14; // +/- 7 deg
      targetRotX = -y * 14;
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    let frameCount = 0;
    let currentFlipY = 0;

    const loop = () => {
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;
      const targetFlip = isFlippedRef.current ? 180 : 0;
      currentFlipY += (targetFlip - currentFlipY) * 0.12;

      portrait.style.transform = `perspective(1200px) rotateX(${currentRotX.toFixed(
        2
      )}deg) rotateY(${(currentRotY + currentFlipY).toFixed(2)}deg)`;

      // Throttle telemetry state updates to avoid React overhead
      frameCount++;
      if (frameCount % 4 === 0) {
        setTelemetryAngles({
          pitch: Number(currentRotX.toFixed(1)),
          roll: Number(currentRotY.toFixed(1)),
          yaw: Number((currentRotY * 0.4).toFixed(1)),
          gForce: Number((1.0 + Math.abs(currentRotX + currentRotY) * 0.03).toFixed(2)),
        });
      }

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [reducedMotion, sequenceComplete]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[100svh] w-full flex flex-col justify-between pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 overflow-hidden z-10"
      aria-label="Hero Introduction"
    >
      <div className="mx-auto w-full max-w-[1680px] px-6 sm:px-10 md:px-14 lg:px-16 flex-1 flex flex-col justify-between">
        {/* Top Technical Metadata Bar */}
        <div
          ref={metaRef}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(242,240,234,0.08)] pb-4 text-[10px] sm:text-xs font-mono tracking-[0.2em] text-[#A8ABB8]"
        >
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-[#00F0FF]" />
            <span className="text-[#F2F0EA] font-medium">CSE AI/ML</span>
            <span className="text-[#555555]">{'//'}</span>
            <span className="text-[#D0D4E0]">VIZAG / INDIA</span>
          </div>

          <div className="flex items-center gap-3">
            <RoleCycler prefix="STATUS:" className="text-[10px] sm:text-xs" />
          </div>
        </div>

        {/* Central Display Composition (Typography + Authentic Portrait) */}
        <div className="my-auto py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Titles & Tech Badges */}
          <div className="lg:col-span-8 flex flex-col justify-center select-none">
            <div className="overflow-hidden">
              <h1
                ref={title1Ref}
                className="text-6xl sm:text-8xl md:text-[10.5vw] font-sans font-black tracking-[-0.04em] text-[#F2F0EA] leading-[0.88] uppercase"
              >
                <CyberScramble text="NIKHIL" />
              </h1>
            </div>

            <div className="overflow-hidden mt-1 sm:mt-2">
              <h1
                ref={title2Ref}
                className="text-6xl sm:text-8xl md:text-[10.5vw] font-sans font-black tracking-[-0.04em] text-[#F2F0EA] leading-[0.88] uppercase flex items-baseline gap-3"
              >
                <span className="bg-gradient-to-r from-[#F2F0EA] via-[#F2F0EA] to-[#00F0FF] hover:to-[#FF007F] bg-clip-text text-transparent transition-all duration-500">
                  <CyberScramble text="SAI REDDY" />
                </span>
                <span className="inline-block w-3 h-3 sm:w-5 sm:h-5 md:w-7 md:h-7 bg-gradient-to-tr from-[#00F0FF] via-[#7928CA] to-[#FF007F] rounded-xs mb-1 shadow-[0_0_15px_#00F0FF] animate-pulse" />
              </h1>
            </div>

            {/* Supporting Statement */}
            <div ref={statementRef} className="mt-8 sm:mt-10 max-w-2xl">
              <div className="mb-3">
                <RoleCycler
                  className="text-xs sm:text-sm md:text-base font-bold"
                  prefix="TRAJECTORY //"
                />
              </div>

              <p
                style={{ color: '#F2F0EA' }}
                className="text-base sm:text-lg md:text-xl font-sans font-medium text-[#F2F0EA] leading-relaxed drop-shadow-sm"
              >
                {siteConfig.tagline}
              </p>

              {/* Colorful Vibrant Tech Stack Badges with Interactive Glossary */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-[11px] font-mono text-[#A8ABB8] mr-2">
                  <Terminal size={13} className="text-[#00F0FF]" />
                  <span>CORE:</span>
                </div>
                {TECH_BADGES.map((tech) => (
                  <TechGlossaryTooltip key={tech.name} termKey={tech.name}>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide border ${tech.border} ${tech.bg} transition-all hover:scale-105 shadow-sm`}
                      style={{ color: tech.color }}
                    >
                      {tech.name}
                    </span>
                  </TechGlossaryTooltip>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-4 text-xs font-mono text-[#A8ABB8] tracking-widest">
                <span className="text-[#F2F0EA] font-semibold">EST. 2026</span>
                <span className="text-[#555555]">•</span>
                <span className="text-[#00F0FF] font-semibold">NXT WAVE // ADVANCED TECH</span>
              </div>
            </div>
          </div>

          {/* Authentic Portrait Card with 3D Holographic Iridescent Frame & Multi-Vision Switcher */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end">
            <div className="relative w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[380px]">
              {/* Vibrant Multi-Color Holographic Glow Halo */}
              <div
                aria-hidden="true"
                className="absolute -inset-10 bg-gradient-to-tr from-[#00F0FF]/25 via-[#7928CA]/20 to-[#FF007F]/25 rounded-3xl blur-3xl pointer-events-none opacity-80 animate-pulse"
              />

              {/* 3D Rotating Telemetry Gimbal Rings */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-6 sm:-inset-8 border border-[#00F0FF]/30 rounded-full animate-[spin_24s_linear_infinite] border-dashed"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 sm:-inset-4 border border-[#FF007F]/25 rounded-full animate-[spin_16s_linear_infinite_reverse]"
              />

              {/* Interactive Vision Mode Switcher Dock */}
              <div className="mb-3 w-full flex items-center justify-between gap-1 p-1 rounded-xl bg-[#090B12]/90 border border-[rgba(242,240,234,0.12)] backdrop-blur-xl shadow-2xl text-[9px] font-mono relative z-20">
                {[
                  { id: 'studio', label: 'STUDIO', icon: Sparkles, color: '#F2F0EA' },
                  { id: 'tactical', label: 'TACTICAL', icon: Crosshair, color: '#FF007F' },
                  { id: 'hologram', label: 'HOLOGRAM', icon: Zap, color: '#C7FF4A' },
                ].map((m) => {
                  const Icon = m.icon;
                  const isActive = visionMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        playApertureClick();
                        setVisionMode(m.id as 'studio' | 'tactical' | 'hologram');
                        if (isFlipped) setIsFlipped(false);
                      }}
                      onMouseEnter={playHoverTick}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg transition-all duration-200 ${
                        isActive && !isFlipped
                          ? 'bg-[#141824] text-[#F2F0EA] border border-[#00F0FF]/60 shadow-[0_0_12px_rgba(0,240,255,0.35)] font-bold'
                          : 'text-[#8E8E8E] hover:text-[#F2F0EA] hover:bg-white/5 border border-transparent'
                      }`}
                      style={{ color: isActive && !isFlipped ? m.color : undefined }}
                    >
                      <Icon size={11} className={isActive && !isFlipped ? 'animate-pulse' : ''} />
                      <span className="tracking-wider">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Holographic Iridescent Border Wrapper */}
              <div className="relative p-[2px] rounded-2xl bg-gradient-to-tr from-[#00F0FF] via-[#7928CA] via-[#FF007F] to-[#C7FF4A] shadow-[0_0_40px_rgba(0,240,255,0.35)]">
                <div
                  ref={portraitWrapperRef}
                  {...portraitCursor}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setCardMousePos({
                      x: Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100)),
                      y: Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100)),
                    });
                  }}
                  className="relative w-full aspect-[3/4] bg-[#0A0B10] rounded-2xl shadow-2xl opacity-0 transition-shadow duration-300 group overflow-hidden"
                  style={{
                    willChange: 'transform',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* ========================================================= */}
                  {/* FRONT FACE: PORTRAIT WITH 4 ACTIVE VISION MODES           */}
                  {/* ========================================================= */}
                  <div
                    className="absolute inset-0 p-3 flex flex-col justify-between rounded-2xl bg-[#0A0B10]"
                    style={{
                      backfaceVisibility: 'hidden',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Layer 3: Corner Coordinates & Ticks with 3D Pop (105px) */}
                    <div
                      className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#00F0FF] shadow-[0_0_10px_#00F0FF]"
                      style={{ transform: 'translateZ(105px)' }}
                    />
                    <div
                      className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#00F0FF] shadow-[0_0_10px_#00F0FF]"
                      style={{ transform: 'translateZ(105px)' }}
                    />
                    <div
                      className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#FF007F] shadow-[0_0_10px_#FF007F]"
                      style={{ transform: 'translateZ(105px)' }}
                    />
                    <div
                      className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#FF007F] shadow-[0_0_10px_#FF007F]"
                      style={{ transform: 'translateZ(105px)' }}
                    />

                    {/* Layer 2: Floating Header & 3D Flip Trigger (70px) */}
                    <div className="relative z-20 flex items-center justify-between gap-2" style={{ transform: 'translateZ(70px)' }}>
                      <div className="flex items-center gap-1.5 bg-[#07070B]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#00F0FF]/50 text-[9px] font-mono tracking-widest text-[#F2F0EA] shadow-xl">
                        <Sparkles size={10} className="text-[#00F0FF]" />
                        <span>PORTRAIT // {visionMode.toUpperCase()}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          playSynapticPulse();
                          setIsFlipped(true);
                        }}
                        onMouseEnter={playHoverTick}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#07070B]/90 border border-[#00F0FF]/60 text-[8px] font-mono text-[#00F0FF] shadow-xl hover:bg-[#00F0FF]/20 hover:border-[#00F0FF] transition-all"
                        title="Flip to Developer Hardware & Architecture Spec"
                      >
                        <RotateCw size={10} className="text-[#00F0FF]" />
                        <span>3D FLIP SPEC</span>
                      </button>
                    </div>

                    {/* Layer 1: Portrait Image Container with 3D Spatial Offset (35px) */}
                    <div
                      className={`relative flex-1 my-2 w-full overflow-hidden rounded-xl border border-[rgba(242,240,234,0.1)] transition-all duration-500 ${
                        visionMode === 'hologram'
                          ? 'shadow-[4px_0_20px_rgba(0,240,255,0.4),-4px_0_20px_rgba(255,0,127,0.4)]'
                          : ''
                      }`}
                      style={{ transform: 'translateZ(35px)' }}
                    >
                      <Image
                        src="/images/nikhil-v3.jpg"
                        alt="Nikhil Sai Reddy - Authentic Portrait"
                        fill
                        priority
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
                          visionMode === 'hologram'
                            ? 'hue-rotate-15 contrast-125 saturate-150'
                            : 'contrast-[1.04] brightness-[0.98]'
                        }`}
                      />

                      {/* Vignette Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07070B]/85 via-transparent to-transparent opacity-60 pointer-events-none" />

                      {/* =================================================== */}
                      {/* MODE 1: STUDIO LIGHTING & SPATIAL GLASS SHEEN       */}
                      {/* =================================================== */}
                      {visionMode === 'studio' && (
                        <>
                          {/* Apple Vision Pro Spatial Specular Glass Sheen */}
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300 opacity-50 group-hover:opacity-90 mix-blend-screen"
                            style={{
                              background: `radial-gradient(circle 320px at ${50 + telemetryAngles.roll * 3.2}% ${50 - telemetryAngles.pitch * 3.2}%, rgba(255, 255, 255, 0.45), rgba(0, 240, 255, 0.22) 35%, transparent 75%)`,
                              transform: 'translateZ(55px)',
                            }}
                          />

                          {/* Orbiting Quantum Light Motes */}
                          <div className="absolute inset-0 pointer-events-none" style={{ transform: 'translateZ(75px)' }}>
                            {[...Array(6)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF] animate-pulse"
                                style={{
                                  top: `${25 + Math.sin((i / 6) * Math.PI * 2) * 38}%`,
                                  left: `${50 + Math.cos((i / 6) * Math.PI * 2) * 44}%`,
                                  animationDelay: `${i * 0.35}s`,
                                  animationDuration: `${2.4 + i * 0.2}s`,
                                }}
                              />
                            ))}
                          </div>

                          {/* Laser Scanning Line */}
                          <div
                            aria-hidden="true"
                            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[bounce_3s_infinite] pointer-events-none shadow-[0_0_12px_#00F0FF]"
                          />
                        </>
                      )}



                      {/* =================================================== */}
                      {/* MODE 3: TACTICAL AR / IRON MAN OPTIC TRACKER        */}
                      {/* =================================================== */}
                      {visionMode === 'tactical' && (
                        <div className="absolute inset-0 pointer-events-none" style={{ transform: 'translateZ(60px)' }}>
                          {/* Rotating Concentric Radar Reticles */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 border border-[#FF007F]/30 rounded-full border-dashed animate-[spin_20s_linear_infinite]" />
                            <div className="absolute w-36 h-36 border border-[#00F0FF]/40 rounded-full border-dotted animate-[spin_12s_linear_infinite_reverse]" />
                            <div className="absolute w-24 h-24 border border-[#FF007F]/50 rounded-full" />
                          </div>

                          {/* Autonomous Optical Target Crosshair Tracking Cursor */}
                          <div
                            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-out"
                            style={{
                              left: `${cardMousePos.x}%`,
                              top: `${cardMousePos.y}%`,
                            }}
                          >
                            <div className="w-10 h-10 border border-[#00F0FF] rounded-md relative flex items-center justify-center shadow-[0_0_12px_#00F0FF]">
                              <div className="w-1.5 h-1.5 bg-[#FF007F] rounded-full animate-ping" />
                              <div className="absolute -top-3 text-[7px] font-mono font-bold text-[#00F0FF] bg-[#07070B]/90 px-1 rounded whitespace-nowrap">
                                LOCK: {(1.15 + cardMousePos.x * 0.008).toFixed(2)}m
                              </div>
                            </div>
                          </div>

                          {/* Tactical Telemetry HUD Readouts */}
                          <div className="absolute top-2 left-2 text-[7px] font-mono text-[#FF007F] bg-[#07070B]/85 px-1.5 py-0.5 rounded border border-[#FF007F]/40">
                            f/1.4 // 85mm // ISO 100
                          </div>

                          <div className="absolute bottom-2 left-2 text-[7px] font-mono text-[#00F0FF] bg-[#07070B]/85 px-1.5 py-0.5 rounded border border-[#00F0FF]/40">
                            HR: 72 BPM // SYNC: 99.4%
                          </div>

                          <div className="absolute bottom-2 right-2 text-[7px] font-mono text-[#C7FF4A] bg-[#07070B]/85 px-1.5 py-0.5 rounded border border-[#C7FF4A]/40 font-bold">
                            TARGET: IDENTIFIED
                          </div>
                        </div>
                      )}

                      {/* =================================================== */}
                      {/* MODE 4: CYBERPUNK HOLOGRAM & MATRIX GLITCH          */}
                      {/* =================================================== */}
                      {visionMode === 'hologram' && (
                        <div className="absolute inset-0 pointer-events-none" style={{ transform: 'translateZ(50px)' }}>
                          {/* Scanline CRT lines */}
                          <div
                            className="absolute inset-0 opacity-25 mix-blend-screen"
                            style={{
                              backgroundImage: 'repeating-linear-gradient(0deg, #00F0FF, #00F0FF 1px, transparent 1px, transparent 3px)',
                            }}
                          />

                          {/* Matrix glyphs stream along left edge */}
                          <div className="absolute top-2 left-2 text-[8px] font-mono text-[#C7FF4A]/80 flex flex-col space-y-0.5 select-none opacity-80">
                            <span>0100</span>
                            <span>1101</span>
                            <span>0x8F</span>
                            <span>ΨΩ</span>
                            <span>1010</span>
                          </div>

                          {/* Matrix glyphs stream along right edge */}
                          <div className="absolute top-2 right-2 text-[8px] font-mono text-[#00F0FF]/80 flex flex-col space-y-0.5 select-none opacity-80 text-right">
                            <span>NEO</span>
                            <span>0xAA</span>
                            <span>ΞΔλ</span>
                            <span>0111</span>
                            <span>1001</span>
                          </div>

                          {/* Hologram Coherence Badge */}
                          <div className="absolute bottom-2 left-2 right-2 text-center text-[7px] font-mono text-[#C7FF4A] bg-[#07070B]/90 py-0.5 px-2 rounded border border-[#C7FF4A]/40 font-bold">
                            QUANTUM HOLOGRAM // COHERENCE 96.8%
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Card Monospace Spec & Live Neural Gimbal Telemetry Angles */}
                    <div
                      className="mt-1 space-y-1 text-[9px] font-mono tracking-widest text-[#8E8E8E]"
                      style={{ transform: 'translateZ(45px)' }}
                    >
                      <div className="flex items-center justify-between">
                        <span>ID: NSR-2026 // VISUAL-V2</span>
                        <span className="text-[#00F0FF] font-bold">STATUS: VERIFIED</span>
                      </div>

                      {/* Real-time calculated angles */}
                      <div className="flex items-center justify-between pt-1 border-t border-[rgba(242,240,234,0.08)] text-[8px] text-[#8E8E8E]">
                        <span>P: {telemetryAngles.pitch > 0 ? `+${telemetryAngles.pitch}` : telemetryAngles.pitch}°</span>
                        <span>R: {telemetryAngles.roll > 0 ? `+${telemetryAngles.roll}` : telemetryAngles.roll}°</span>
                        <span>Y: {telemetryAngles.yaw > 0 ? `+${telemetryAngles.yaw}` : telemetryAngles.yaw}°</span>
                        <span className="text-[#FF007F] font-bold">{telemetryAngles.gForce}G</span>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* BACK FACE: DEVELOPER ARCHITECTURE & HARDWARE SPEC SHEET   */}
                  {/* ========================================================= */}
                  <div
                    className="absolute inset-0 p-5 flex flex-col justify-between rounded-2xl bg-[#08090E] border border-[#00F0FF]/50 shadow-[0_0_35px_rgba(0,240,255,0.25)] select-none"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Top Status & Flip-back Button */}
                    <div className="flex items-center justify-between pb-3 border-b border-[rgba(242,240,234,0.1)]">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C7FF4A] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C7FF4A]" />
                        </span>
                        <span className="text-[9px] font-mono font-bold tracking-widest text-[#C7FF4A]">
                          ONLINE // SPEC SHEET
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          playApertureClick();
                          setIsFlipped(false);
                        }}
                        onMouseEnter={playHoverTick}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00F0FF]/15 border border-[#00F0FF] text-[8px] font-mono text-[#00F0FF] hover:bg-[#00F0FF]/30 transition-colors shadow-lg"
                      >
                        <RotateCw size={10} />
                        <span>RETURN</span>
                      </button>
                    </div>

                    {/* Developer Identity Block */}
                    <div className="my-auto space-y-4">
                      <div>
                        <div className="text-[9px] font-mono text-[#00F0FF] tracking-widest uppercase font-bold mb-1">
                          ARCHITECTURAL PROFILE
                        </div>
                        <h3 className="text-xl font-sans font-black text-[#F2F0EA] tracking-tight uppercase">
                          Nikhil Sai Reddy
                        </h3>
                        <p className="text-[11px] font-mono text-[#8E8E8E] leading-relaxed">
                          AI/ML & High-Craft Frontend Engineer
                        </p>
                        <p className="text-[10px] font-mono text-[#555555]">
                          Student @ Nxt Wave of Innovation in Advanced Technology, Vizag
                        </p>
                      </div>

                      {/* Architecture Stack Grid */}
                      <div className="space-y-2.5 pt-2 border-t border-[rgba(242,240,234,0.08)]">
                        <div>
                          <span className="text-[8px] font-mono font-bold tracking-widest text-[#00F0FF]">
                            [01 // NEURAL COMPUTE]
                          </span>
                          <p className="text-[10px] font-mono text-[#D0D4E0]">
                            PyTorch, YOLOv8, Computer Vision, CNNs
                          </p>
                        </div>

                        <div>
                          <span className="text-[8px] font-mono font-bold tracking-widest text-[#FF007F]">
                            [02 // REACTIVE UI ENGINE]
                          </span>
                          <p className="text-[10px] font-mono text-[#D0D4E0]">
                            Next.js 16, React 19, TypeScript, Tailwind CSS
                          </p>
                        </div>

                        <div>
                          <span className="text-[8px] font-mono font-bold tracking-widest text-[#C7FF4A]">
                            [03 // KINETIC ENGINES]
                          </span>
                          <p className="text-[10px] font-mono text-[#D0D4E0]">
                            Anime.js, Lenis Scroll, Canvas 2D/WebGL, Web Audio API
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action & Dispatch Link */}
                    <div className="pt-3 border-t border-[rgba(242,240,234,0.1)] space-y-2">
                      <a
                        href="#contact"
                        onClick={() => playSynapticPulse()}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#00F0FF]/15 border border-[#00F0FF]/50 text-[10px] font-mono text-[#00F0FF] hover:bg-[#00F0FF] hover:text-[#07070B] transition-all font-bold tracking-wider"
                      >
                        <span>DISPATCH TRANSMISSION</span>
                        <ExternalLink size={12} />
                      </a>
                      <div className="text-[8px] font-mono text-[#555555] text-center tracking-widest">
                        NODE: VISAKHAPATNAM (17.68° N, 83.21° E)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar / Scroll Prompt */}
        <div
          ref={scrollIndicatorRef}
          className="pt-6 border-t border-[rgba(242,240,234,0.06)] flex items-center justify-between text-xs font-mono tracking-[0.2em] text-[#A8ABB8]"
        >
          <a
            href="#about"
            className="flex items-center gap-2 text-[#F2F0EA] hover:text-[#00F0FF] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00F0FF]"
          >
            <span>DISCOVER CORE ESSENCE</span>
            <ArrowDown size={14} className="animate-bounce text-[#00F0FF]" />
          </a>

          <div className="hidden sm:flex items-center gap-6">
            <span>INDEX [01 → 06]</span>
            <span className="text-[#555555]">{'//'}</span>
            <span className="text-[#00F0FF]">SCROLL TO ADVANCE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
