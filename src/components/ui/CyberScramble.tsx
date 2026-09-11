'use client';

import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { playHoverTick } from '@/lib/sound';

interface CyberScrambleProps {
  text: string;
  className?: string;
  as?: React.ElementType;
  scrambleOnHover?: boolean;
  triggerOnScroll?: boolean;
  audioFeedback?: boolean;
  speedMs?: number;
  glyphs?: string;
}

const DEFAULT_GLYPHS = '01ΞΔλ∫0x8FØ§ΨΩ<>/*#$[]{}%@!~+^';

export const CyberScramble = memo(function CyberScramble({
  text,
  className = '',
  as: Component = 'span',
  scrambleOnHover = true,
  triggerOnScroll = false,
  audioFeedback = false,
  speedMs = 24,
  glyphs = DEFAULT_GLYPHS,
}: CyberScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const isScrambling = useRef(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  // Reset when prop text changes
  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  const scramble = useCallback(() => {
    if (reducedMotion || isScrambling.current) return;
    isScrambling.current = true;

    if (audioFeedback) {
      playHoverTick();
    }

    let iteration = 0;
    const totalSteps = text.length * 2;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / 2) {
              return text[index];
            }
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join('')
      );

      iteration += 1;

      if (iteration >= totalSteps) {
        clearInterval(interval);
        isScrambling.current = false;
        setDisplayText(text);
      }
    }, speedMs);
  }, [text, reducedMotion, audioFeedback, speedMs, glyphs]);

  // Trigger on scroll into view if enabled
  useEffect(() => {
    if (!triggerOnScroll || reducedMotion || !elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            scramble();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [triggerOnScroll, reducedMotion, scramble]);

  const handleMouseEnter = useCallback(() => {
    if (scrambleOnHover) {
      scramble();
    }
  }, [scrambleOnHover, scramble]);

  return (
    <Component
      ref={elementRef}
      onMouseEnter={handleMouseEnter}
      aria-label={text}
      role="text"
      className={`cursor-default select-none transition-colors duration-200 ${className}`}
    >
      {displayText}
    </Component>
  );
});
