'use client';

import React from 'react';
import { Terminal } from 'lucide-react';
import { CyberScramble } from '@/components/ui/CyberScramble';
import { playHoverTick } from '@/lib/sound';

export function Manifesto() {
  const statement =
    'I AM LEARNING TO BUILD INTELLIGENT SYSTEMS WHILE EXPLORING THE INTERFACES THROUGH WHICH HUMANS EXPERIENCE THEM.';

  return (
    <section
      id="manifesto"
      className="relative w-full py-10 sm:py-12 md:py-14 border-b border-[rgba(242,240,234,0.06)] z-10"
      aria-label="Manifesto Statement"
    >
      <div className="mx-auto max-w-[1680px] px-6 sm:px-10 md:px-14 lg:px-16">
        {/* Editorial Eyebrow */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs font-mono tracking-[0.25em] text-[#C7FF4A]">
            <Terminal size={14} />
            <CyberScramble text="MANIFESTO // 00" />
          </div>

          <div className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-[#8E8E8E]">
            CORE OPERATING PRINCIPLE
          </div>
        </div>

        {/* Large Statement - Clean, Static & High-Contrast */}
        <div className="max-w-5xl">
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-extrabold tracking-tight text-[#F2F0EA] leading-[1.08] uppercase flex flex-wrap gap-x-3 sm:gap-x-5 gap-y-2">
            {statement.split(' ').map((word, index) => (
              <span
                key={index}
                className={`manifesto-word inline-block opacity-100 ${
                  word === 'INTELLIGENT' || word === 'SYSTEMS' || word === 'EXPERIENCE'
                    ? 'text-[#F2F0EA] border-b-2 border-[#C7FF4A]/50 pb-0.5 font-black'
                    : 'text-[#E2E0D8]'
                }`}
              >
                {word}
              </span>
            ))}
          </h2>
        </div>

        {/* Conceptual Hierarchy Flow */}
        <div className="mt-6 sm:mt-8 pt-5 border-t border-[rgba(242,240,234,0.08)] flex flex-wrap items-center justify-between gap-6 text-[10px] sm:text-xs font-mono tracking-[0.2em] text-[#8E8E8E]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[#F2F0EA]">
            {['HUMAN', 'CURIOSITY', 'CODE', 'INTELLIGENCE'].map((step) => (
              <React.Fragment key={step}>
                <span
                  onMouseEnter={playHoverTick}
                  className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[#F2F0EA] transition-colors cursor-default"
                >
                  {step}
                </span>
                <span className="text-[#C7FF4A]">↓</span>
              </React.Fragment>
            ))}
            <span
              onMouseEnter={playHoverTick}
              className="px-2.5 py-0.5 rounded border border-[#C7FF4A]/50 bg-[#C7FF4A]/10 text-[#C7FF4A] font-bold shadow-[0_0_10px_rgba(199,255,74,0.2)] cursor-default"
            >
              <CyberScramble text="AI ENGINEER" />
            </span>
          </div>

          <div className="text-[#555555]">
            LOCATION: VIZAG // SYSTEM: CSE AI/ML
          </div>
        </div>
      </div>
    </section>
  );
}
