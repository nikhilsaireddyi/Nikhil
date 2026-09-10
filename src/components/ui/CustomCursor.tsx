'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { cursorBus } from '@/motion/cursor';
import { CursorState } from '@/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { playHoverTick } from '@/lib/sound';

function subscribeFinePointer(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(pointer: fine)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getFinePointerSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: fine)').matches;
}

function getFinePointerServerSnapshot() {
  return false;
}

interface QuantumSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

const SPARK_COLORS = ['#00F0FF', '#7928CA', '#C7FF4A', '#FFB703', '#FF007F'];

export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isFinePointer = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot
  );
  const reducedMotion = useReducedMotion();

  const mousePos = useRef({ x: -100, y: -100 });
  const prevMousePos = useRef({ x: -100, y: -100 });
  const outerPos = useRef({ x: -100, y: -100 });
  const innerPos = useRef({ x: -100, y: -100 });
  const isVisible = useRef<boolean>(false);
  const sparks = useRef<QuantumSpark[]>([]);

  useEffect(() => {
    if (!isFinePointer || reducedMotion) return;

    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext('2d') : null;

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible.current) {
        isVisible.current = true;
        if (outerRef.current) outerRef.current.style.opacity = '1';
        if (innerRef.current) innerRef.current.style.opacity = '1';
      }

      // Calculate speed for particle generation
      const dx = e.clientX - prevMousePos.current.x;
      const dy = e.clientY - prevMousePos.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 4 && sparks.current.length < 50) {
        // Spawn 1-2 quantum trailing sparks
        const count = Math.min(2, Math.floor(dist / 8));
        for (let i = 0; i < count; i++) {
          const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
          sparks.current.push({
            x: e.clientX + (Math.random() - 0.5) * 6,
            y: e.clientY + (Math.random() - 0.5) * 6,
            vx: -dx * 0.15 + (Math.random() - 0.5) * 1.5,
            vy: -dy * 0.15 + (Math.random() - 0.5) * 1.5,
            size: Math.random() * 2.2 + 0.8,
            color,
            life: 1,
            maxLife: Math.random() * 18 + 14,
          });
        }
      }

      prevMousePos.current.x = e.clientX;
      prevMousePos.current.y = e.clientY;
    };

    const onMouseDown = (e: MouseEvent) => {
      // Quantum burst on click
      for (let i = 0; i < 14; i++) {
        const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 4 + 2;
        const color = SPARK_COLORS[i % SPARK_COLORS.length];
        sparks.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.5 + 1.2,
          color,
          life: 1,
          maxLife: Math.random() * 24 + 18,
        });
      }
    };

    const onMouseLeave = () => {
      isVisible.current = false;
      if (outerRef.current) outerRef.current.style.opacity = '0';
      if (innerRef.current) innerRef.current.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    let rafId: number;

    const loop = () => {
      // Interpolate outer ring (smooth lag)
      outerPos.current.x += (mousePos.current.x - outerPos.current.x) * 0.18;
      outerPos.current.y += (mousePos.current.y - outerPos.current.y) * 0.18;

      // Inner dot (crisper response)
      innerPos.current.x += (mousePos.current.x - innerPos.current.x) * 0.5;
      innerPos.current.y += (mousePos.current.y - innerPos.current.y) * 0.5;

      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${outerPos.current.x}px, ${outerPos.current.y}px, 0)`;
      }

      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${innerPos.current.x}px, ${innerPos.current.y}px, 0)`;
      }

      // Render quantum spark particles
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = sparks.current.length - 1; i >= 0; i--) {
          const sp = sparks.current[i];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.vx *= 0.94;
          sp.vy *= 0.94;
          sp.life -= 1 / sp.maxLife;

          if (sp.life <= 0) {
            sparks.current.splice(i, 1);
            continue;
          }

          const alpha = Math.max(0, sp.life);
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = sp.color;
          ctx.shadowColor = sp.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size * alpha, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    const unsubscribe = cursorBus.subscribe((state: CursorState, label?: string) => {
      if (!outerRef.current || !innerRef.current || !labelRef.current) return;

      if (state === 'hidden') {
        outerRef.current.style.opacity = '0';
        innerRef.current.style.opacity = '0';
        return;
      }

      if (isVisible.current) {
        outerRef.current.style.opacity = '1';
        innerRef.current.style.opacity = '1';
      }

      if (state === 'link') {
        playHoverTick();
        outerRef.current.style.width = '48px';
        outerRef.current.style.height = '48px';
        outerRef.current.style.borderColor = '#C7FF4A';
        outerRef.current.style.backgroundColor = 'rgba(199, 255, 74, 0.08)';
        outerRef.current.style.boxShadow = '0 0 15px rgba(199, 255, 74, 0.25)';
        innerRef.current.style.transform += ' scale(0.5)';
        labelRef.current.textContent = '';
      } else if (state === 'project') {
        playHoverTick();
        outerRef.current.style.width = '84px';
        outerRef.current.style.height = '84px';
        outerRef.current.style.borderColor = '#00F0FF';
        outerRef.current.style.backgroundColor = 'rgba(0, 240, 255, 0.12)';
        outerRef.current.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.3)';
        labelRef.current.textContent = label || 'VIEW';
      } else if (state === 'image') {
        playHoverTick();
        outerRef.current.style.width = '88px';
        outerRef.current.style.height = '88px';
        outerRef.current.style.borderColor = '#FFB703';
        outerRef.current.style.backgroundColor = 'rgba(255, 183, 3, 0.12)';
        outerRef.current.style.boxShadow = '0 0 20px rgba(255, 183, 3, 0.3)';
        labelRef.current.textContent = label || 'EXPLORE';
      } else {
        // default
        outerRef.current.style.width = '32px';
        outerRef.current.style.height = '32px';
        outerRef.current.style.borderColor = 'rgba(242, 240, 234, 0.35)';
        outerRef.current.style.backgroundColor = 'transparent';
        outerRef.current.style.boxShadow = 'none';
        labelRef.current.textContent = '';
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseleave', onMouseLeave);
      unsubscribe();
    };
  }, [isFinePointer, reducedMotion]);

  if (!isFinePointer || reducedMotion) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Quantum Spark Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* Outer interactive ring */}
      <div
        ref={outerRef}
        aria-hidden="true"
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(242,240,234,0.35)] transition-[width,height,border-color,background-color,box-shadow] duration-200 ease-out flex items-center justify-center opacity-0 backdrop-blur-[1px]"
        style={{
          width: '32px',
          height: '32px',
          willChange: 'transform',
        }}
      >
        <span
          ref={labelRef}
          className="text-[10px] tracking-[0.15em] font-mono font-bold text-[#C7FF4A] uppercase select-none"
        />
      </div>

      {/* Inner precise point */}
      <div
        ref={innerRef}
        aria-hidden="true"
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#C7FF4A] opacity-0 transition-opacity duration-150 ease-out shadow-[0_0_8px_#C7FF4A]"
        style={{
          willChange: 'transform',
        }}
      />
    </div>
  );
}

