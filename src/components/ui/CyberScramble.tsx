'use client';

import React, { memo } from 'react';

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

export const CyberScramble = memo(function CyberScramble({
  text,
  className = '',
  as: Component = 'span',
}: CyberScrambleProps) {
  return (
    <Component
      aria-label={text}
      role="text"
      className={`cursor-default select-none transition-colors duration-200 ${className}`}
    >
      {text}
    </Component>
  );
});
