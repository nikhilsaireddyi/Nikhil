'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Terminal } from 'lucide-react';

export function Manifesto() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current || !textRef.current) return;

    const words = textRef.current.querySelectorAll('.manifesto-word');
    if (!words.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(words, {
              opacity: [0.15, 1],
              translateY: [15, 0],
              delay: stagger(40),
              duration: 700,
              ease: 'outExpo',
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const statement =
    'I AM LEARNING TO BUILD INTELLIGENT SYSTEMS WHILE EXPLORING THE INTERFACES THROUGH WHICH HUMANS EXPERIENCE THEM.';

  return (
    <section
      id="manifesto"
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 md:py-44 border-b border-[rgba(242,240,234,0.06)] z-10"
      aria-label="Manifesto Statement"
    >
      <div className="mx-auto max-w-[1680px] px-6 sm:px-10 md:px-14 lg:px-16">
        {/* Editorial Eyebrow */}
        <div className="mb-8 sm:mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs font-mono tracking-[0.25em] text-[#C7FF4A]">
            <Terminal size={14} />
            <span>MANIFESTO // 00</span>
          </div>

          <div className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-[#8E8E8E]">
            CORE OPERATING PRINCIPLE
          </div>
        </div>

        {/* Large Statement with Staggered Word Reveal */}
        <div ref={textRef} className="max-w-5xl">
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-extrabold tracking-tight text-[#F2F0EA] leading-[1.08] uppercase flex flex-wrap gap-x-3 sm:gap-x-5 gap-y-2">
            {statement.split(' ').map((word, index) => (
              <span
                key={index}
                className={`manifesto-word inline-block ${
                  reducedMotion ? 'opacity-100' : 'opacity-15'
                } ${
                  word === 'INTELLIGENT' || word === 'SYSTEMS' || word === 'EXPERIENCE'
                    ? 'text-[#F2F0EA] border-b-2 border-[#C7FF4A]/40 pb-0.5'
                    : 'text-[#8E8E8E]'
                }`}
              >
                {word}
              </span>
            ))}
          </h2>
        </div>

        {/* Conceptual Hierarchy Flow */}
        <div className="mt-16 sm:mt-24 pt-8 border-t border-[rgba(242,240,234,0.08)] flex flex-wrap items-center justify-between gap-6 text-[10px] sm:text-xs font-mono tracking-[0.2em] text-[#8E8E8E]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[#F2F0EA]">
            <span>HUMAN</span>
            <span className="text-[#C7FF4A]">↓</span>
            <span>CURIOSITY</span>
            <span className="text-[#C7FF4A]">↓</span>
            <span>CODE</span>
            <span className="text-[#C7FF4A]">↓</span>
            <span>INTELLIGENCE</span>
            <span className="text-[#C7FF4A]">↓</span>
            <span className="text-[#C7FF4A] font-bold">AI ENGINEER</span>
          </div>

          <div className="text-[#555555]">
            LOCATION: VIZAG // SYSTEM: CSE AI/ML
          </div>
        </div>
      </div>
    </section>
  );
}
