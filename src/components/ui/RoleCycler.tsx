'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface RoleCyclerProps {
  roles?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  prefix?: string;
}

const DEFAULT_ROLES = [
  'CSE AI/ML UNDERGRADUATE',
  'DEEP LEARNING RESEARCHER',
  'CREATIVE COMPUTING ARCHITECT',
  'AUTONOMOUS SYSTEMS ENTHUSIAST',
];

const GLYPHS = '01ΞΔλ∫0x8FØ§ΨΩ<>/*#$[]{}%@!~';

export const RoleCycler = memo(function RoleCycler({
  roles = DEFAULT_ROLES,
  typingSpeed = 45,
  deletingSpeed = 25,
  pauseDuration = 2400,
  className = '',
  prefix = '',
}: RoleCyclerProps) {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(roles[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const reducedMotion = useReducedMotion();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayedText(roles[0]);
      return;
    }

    const currentFullText = roles[currentRoleIndex];

    if (!isDeleting) {
      // Typing phase
      if (displayedText.length < currentFullText.length) {
        timerRef.current = setTimeout(() => {
          // Subtle glitch effect on intermediate characters
          const nextChar = currentFullText[displayedText.length];
          const shouldGlitch = Math.random() < 0.15;
          if (shouldGlitch && nextChar !== ' ') {
            const randomGlyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            setDisplayedText((prev) => prev + randomGlyph);
            setTimeout(() => {
              setDisplayedText((prev) => prev.slice(0, -1) + nextChar);
            }, 30);
          } else {
            setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
          }
        }, typingSpeed);
      } else {
        // Reached end of string, wait before deleting
        timerRef.current = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Deleting phase
      if (displayedText.length > 0) {
        timerRef.current = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      } else {
        // Move to next role
        setIsDeleting(false);
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [displayedText, isDeleting, currentRoleIndex, roles, typingSpeed, deletingSpeed, pauseDuration, reducedMotion]);

  return (
    <div
      aria-live="polite"
      aria-label={`${prefix} ${roles[currentRoleIndex]}`}
      className={`inline-flex items-center gap-1 font-mono tracking-wider select-none ${className}`}
    >
      {prefix && <span className="text-[#8E8E8E] mr-1">{prefix}</span>}
      <span className="bg-gradient-to-r from-[#00F0FF] via-[#7928CA] to-[#FF007F] bg-clip-text text-transparent font-bold">
        {displayedText}
      </span>
      {/* Blinking Cyber Cursor */}
      <span
        aria-hidden="true"
        className="inline-block w-2 sm:w-2.5 h-3.5 sm:h-4 bg-[#00F0FF] animate-[pulse_0.8s_infinite] shadow-[0_0_8px_#00F0FF] ml-0.5"
      />
    </div>
  );
});
