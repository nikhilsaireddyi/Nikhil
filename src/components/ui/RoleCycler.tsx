'use client';

import React, { useState, useEffect, memo } from 'react';
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

export const RoleCycler = memo(function RoleCycler({
  roles = DEFAULT_ROLES,
  pauseDuration = 4500,
  className = '',
  prefix = '',
}: RoleCyclerProps) {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || roles.length <= 1) return;

    const interval = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        setOpacity(1);
      }, 400);
    }, pauseDuration);

    return () => clearInterval(interval);
  }, [roles, pauseDuration, reducedMotion]);

  return (
    <div
      aria-live="polite"
      aria-label={`${prefix} ${roles[currentRoleIndex]}`}
      className={`inline-flex items-center gap-1 font-mono tracking-wider select-none ${className}`}
    >
      {prefix && <span className="text-[#00F0FF] font-semibold mr-1">{prefix}</span>}
      <span
        className="bg-clip-text text-transparent font-bold transition-opacity duration-500"
        style={{
          opacity,
          backgroundImage: 'var(--theme-gradient, linear-gradient(135deg, #C7FF4A 0%, #00F0FF 50%, #7928CA 100%))',
        }}
      >
        {roles[currentRoleIndex]}
      </span>
    </div>
  );
});
