'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';
import { centralScroll } from '@/motion/scroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface LenisProviderProps {
  children: ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (reducedMotion) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      prevent: (node) =>
        node.hasAttribute('data-lenis-prevent') ||
        !!node.closest('[data-lenis-prevent]') ||
        !!node.closest('.overflow-y-auto') ||
        node.classList.contains('lenis-prevent'),
    });

    lenisRef.current = lenis;

    lenis.on('scroll', (e) => {
      centralScroll.notify({
        scroll: e.scroll,
        limit: e.limit,
        velocity: e.velocity,
        direction: e.direction,
        progress: e.progress,
      });
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
