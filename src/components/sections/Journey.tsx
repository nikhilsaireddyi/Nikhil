'use client';

import { useState, useRef, useEffect } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { journeyMilestones } from '@/data/journey';
import { JourneyItem } from '@/types';
import { Sparkles, Radio, Zap, ChevronRight } from 'lucide-react';
import { playHoverTick, playSynapticPulse } from '@/lib/sound';

export function Journey() {
  const [activeItem, setActiveItem] = useState<string>(
    journeyMilestones.find((j) => j.isCurrent)?.id || journeyMilestones[0].id
  );
  const sectionRef = useRef<HTMLElement | null>(null);
  const [timelineProgress, setTimelineProgress] = useState<number>(0.35);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Progress from 0 when section enters screen to 1 when leaving
      const total = rect.height + windowHeight;
      const current = windowHeight - rect.top;
      const progress = Math.min(Math.max(current / total, 0), 1);
      setTimelineProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative w-full py-24 sm:py-32 md:py-40 border-b border-[rgba(242,240,234,0.06)] z-10 overflow-hidden"
      aria-label="Learning Journey Timeline"
    >
      {/* Laser Glow Atmospheric Gradient */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[#C7FF4A]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-[1680px] px-6 sm:px-10 md:px-14 lg:px-16 relative z-10">
        <SectionHeader
          number="03"
          label="JOURNEY"
          subtitle="LEARNING → BUILDING → EXPERIMENTING → DEVELOPING"
          title="COMPUTATIONAL PROGRESSION"
        />

        {/* Conceptual Sequence Bar */}
        <div className="mb-16 border border-[rgba(242,240,234,0.12)] bg-[#0A0B10]/90 backdrop-blur-md rounded-xl p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono shadow-xl">
          <div className="flex items-center gap-2 text-[#C7FF4A]">
            <Radio size={14} className="animate-pulse text-[#C7FF4A]" />
            <span className="font-bold tracking-widest">PROGRESSION PIPELINE ACTIVE</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[#8E8E8E]">
            <span className="text-[#F2F0EA] font-mono px-2 py-0.5 rounded bg-white/5">01. LEARNING</span>
            <ChevronRight size={12} className="text-[#00F0FF]" />
            <span className="text-[#F2F0EA] font-mono px-2 py-0.5 rounded bg-white/5">02. BUILDING</span>
            <ChevronRight size={12} className="text-[#00F0FF]" />
            <span className="text-[#C7FF4A] font-bold font-mono px-2 py-0.5 rounded bg-[#C7FF4A]/15 border border-[#C7FF4A]/30">03. EXPERIMENTING</span>
            <ChevronRight size={12} className="text-[#555555]" />
            <span className="text-[#555555] font-mono px-2 py-0.5 rounded">04. DEVELOPING</span>
          </div>
        </div>

        {/* Vertical Timeline Structure with Dynamic Laser Track */}
        <div className="relative ml-4 sm:ml-8 md:ml-12 pl-8 sm:pl-12 md:pl-16 space-y-12 sm:space-y-16">
          {/* Base Passive Circuit Track */}
          <div className="absolute left-[3px] sm:left-[7px] md:left-[11px] top-4 bottom-8 w-[2px] bg-gradient-to-b from-[rgba(242,240,234,0.1)] via-[rgba(242,240,234,0.06)] to-transparent" />

          {/* Active Glowing Neon Laser Beam */}
          <div
            className="absolute left-[2px] sm:left-[6px] md:left-[10px] top-4 w-[4px] bg-gradient-to-b from-[#00F0FF] via-[#C7FF4A] to-[#FF007F] rounded-full shadow-[0_0_15px_rgba(0,240,255,0.8)] transition-all duration-150 ease-out"
            style={{
              height: `${Math.min(timelineProgress * 115, 100)}%`,
            }}
          >
            {/* Travelling Laser Lead Photon */}
            <div className="absolute bottom-0 -left-[5px] w-3.5 h-3.5 rounded-full bg-[#FFFFFF] shadow-[0_0_20px_#00F0FF] animate-ping" />
            <div className="absolute bottom-0 -left-[3px] w-2.5 h-2.5 rounded-full bg-[#FFFFFF] shadow-[0_0_12px_#C7FF4A]" />
          </div>

          {journeyMilestones.map((milestone: JourneyItem, mIdx) => {
            const isSelected = activeItem === milestone.id;

            return (
              <div
                key={milestone.id}
                onClick={() => {
                  playSynapticPulse();
                  setActiveItem(milestone.id);
                }}
                onMouseEnter={playHoverTick}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {/* Timeline Node Point (Circuit Via) */}
                <div
                  className={`absolute -left-[41px] sm:-left-[57px] md:-left-[73px] top-2 flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300 ${
                    milestone.isCurrent
                      ? 'border-[#C7FF4A] bg-[#0A0D08] shadow-[0_0_18px_rgba(199,255,74,0.6)]'
                      : isSelected
                      ? 'border-[#00F0FF] bg-[#080D12] shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                      : 'border-[rgba(242,240,234,0.2)] bg-[#07070B] group-hover:border-[#8E8E8E]'
                  }`}
                >
                  <div
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                      milestone.isCurrent
                        ? 'bg-[#C7FF4A] scale-125'
                        : isSelected
                        ? 'bg-[#00F0FF]'
                        : 'bg-[rgba(242,240,234,0.2)]'
                    }`}
                  />
                </div>

                {/* Milestone Content Card */}
                <div
                  className={`border rounded-xl transition-all duration-300 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden ${
                    isSelected
                      ? 'border-[#C7FF4A]/50 bg-[#0F1218]/90 shadow-[0_10px_35px_-5px_rgba(199,255,74,0.15)] translate-x-1 sm:translate-x-2'
                      : 'border-[rgba(242,240,234,0.08)] bg-[#0B0C10]/80 hover:border-[rgba(242,240,234,0.2)] hover:bg-[#0E0F15]'
                  }`}
                >
                  {/* Subtle Corner Circuit Accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-20">
                    <svg viewBox="0 0 64 64" className="w-full h-full stroke-current text-[#00F0FF] fill-none">
                      <path d="M64,0 L40,0 L20,20 L0,20" strokeWidth="1.5" />
                      <circle cx="20" cy="20" r="2" fill="#00F0FF" />
                    </svg>
                  </div>

                  {/* Top Metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-[10px] sm:text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-[#C7FF4A] font-bold">PHASE // {milestone.phase}</span>
                      <span className="text-[#555555]">/</span>
                      <span className="text-[#8E8E8E]">STAGE 0{mIdx + 1}</span>
                    </div>

                    {milestone.isCurrent && (
                      <div className="flex items-center gap-1.5 text-[#C7FF4A] bg-[#C7FF4A]/15 border border-[#C7FF4A]/40 px-2.5 py-1 rounded-md text-[10px] font-bold shadow-[0_0_10px_rgba(199,255,74,0.3)]">
                        <Sparkles size={11} className="animate-spin text-[#C7FF4A]" />
                        <span>CURRENT FOCUS // IN PROCESS</span>
                      </div>
                    )}
                  </div>

                  {/* Title & Context */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-sans font-bold text-[#F2F0EA] uppercase tracking-tight mb-2 flex items-center gap-3">
                    <span>{milestone.title}</span>
                    {isSelected && <Zap size={16} className="text-[#00F0FF]" />}
                  </h3>
                  <div className="text-xs font-mono text-[#00F0FF]/80 mb-4 tracking-wider font-semibold">
                    {milestone.context}
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base font-sans font-light text-[#8E8E8E] leading-relaxed mb-6 max-w-3xl">
                    {milestone.description}
                  </p>

                  {/* Focus Badges with Hover Glow */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-[rgba(242,240,234,0.08)]">
                    {milestone.focusAreas.map((area) => (
                      <span
                        key={area}
                        className="text-[10px] font-mono tracking-wider text-[#F2F0EA] border border-[rgba(242,240,234,0.12)] bg-[#13151D] px-3 py-1 rounded-md hover:border-[#00F0FF]/50 transition-colors"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
