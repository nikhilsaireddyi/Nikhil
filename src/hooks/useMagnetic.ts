'use client';

import { useRef, useCallback, MouseEvent as ReactMouseEvent } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface UseMagneticOptions {
  maxDistance?: number;
}

export function useMagnetic<T extends HTMLElement>({ maxDistance = 10 }: UseMagneticOptions = {}) {
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: ReactMouseEvent<T>) => {
      if (reducedMotion || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const pullX = Math.max(-maxDistance, Math.min(maxDistance, deltaX * 0.25));
      const pullY = Math.max(-maxDistance, Math.min(maxDistance, deltaY * 0.25));

      ref.current.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
      ref.current.style.transition = 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)';
    },
    [reducedMotion, maxDistance]
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate3d(0px, 0px, 0)';
    ref.current.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
  }, []);

  return {
    ref,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
}
