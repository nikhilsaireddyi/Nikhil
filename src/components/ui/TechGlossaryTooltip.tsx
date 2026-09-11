'use client';

import React, { useState, useRef, useEffect, memo } from 'react';
import { playHoverTick } from '@/lib/sound';
import { BookOpen, Sparkles, Terminal } from 'lucide-react';

export interface GlossaryEntry {
  term: string;
  category: string;
  formula?: string;
  definition: string;
  implementation: string;
  accentColor?: string;
}

export const GLOSSARY_DICTIONARY: Record<string, GlossaryEntry> = {
  softmax: {
    term: 'Softmax',
    category: 'AI / PROBABILITY',
    formula: 'σ(z)_i = e^(z_i) / Σ e^(z_j)',
    definition: 'Converts raw logit outputs into a normalized probability distribution across multiple classes.',
    implementation: 'Calculates real-time digit recognition confidence in the interactive Neural Classifier.',
    accentColor: '#00F0FF',
  },
  backpropagation: {
    term: 'Backpropagation',
    category: 'DEEP LEARNING',
    formula: '∂L/∂W = (∂L/∂y) · (∂y/∂z) · (∂z/∂W)',
    definition: 'Reverse-mode automatic differentiation calculating loss gradients with respect to neural network weights via the chain rule.',
    implementation: 'Underlying mechanism for adjusting connection weights during model training iterations.',
    accentColor: '#FF007F',
  },
  adamw: {
    term: 'AdamW',
    category: 'OPTIMIZATION',
    formula: 'θ_t = θ_{t-1} - η (m̂_t / (√v̂_t + ε) + λ θ_{t-1})',
    definition: 'Adaptive moment estimation with decoupled weight decay, preventing over-regularization on large models.',
    implementation: 'Simulated in real-time in the Project Optimization Playground across 3D loss topologies.',
    accentColor: '#C7FF4A',
  },
  'next.js 16': {
    term: 'Next.js 16',
    category: 'FRAMEWORK ARCHITECTURE',
    formula: 'Turbopack + App Router + React 19',
    definition: 'Modern full-stack React framework featuring streaming server components and instantaneous compile-time bundling.',
    implementation: 'Powers this portfolio with near-zero latency, strict SSR hydration, and reactive architecture.',
    accentColor: '#F2F0EA',
  },
  typescript: {
    term: 'TypeScript',
    category: 'TYPE SYSTEMS',
    formula: 'Compile-Time Static Invariants',
    definition: 'Strict syntactic superset of JavaScript enforcing type contracts and zero-runtime overhead correctness.',
    implementation: 'Guarantees strict zero-defect compilation across all 60+ modular portfolio components.',
    accentColor: '#3B82F6',
  },
  tensors: {
    term: 'Tensors',
    category: 'MATHEMATICS',
    formula: 'T ∈ ℝ^{d_1 × d_2 × ... × d_n}',
    definition: 'Multi-dimensional geometric arrays generalizing scalars (0D), vectors (1D), and matrices (2D).',
    implementation: 'Data structure representing 28×28 input pixel matrices and weight tensors.',
    accentColor: '#FFB703',
  },
  'a* search': {
    term: 'A* Pathfinding',
    category: 'ALGORITHMS',
    formula: 'f(n) = g(n) + h(n)',
    definition: 'Heuristic graph traversal algorithm that combines exact cost from start with estimated distance to target.',
    implementation: 'Calculates minimal-latency telemetry vectors in the Geospatial Planetary Node.',
    accentColor: '#00F0FF',
  },
  'anime.js': {
    term: 'Anime.js',
    category: 'KINETIC PHYSICS',
    formula: 'DOM Spring & Bezier Physics',
    definition: 'High-performance JavaScript animation engine handling staggered transforms and fluid easing transitions.',
    implementation: 'Synchronizes aperture reveals, word staggering, and kinetic typography throughout the UI.',
    accentColor: '#FF007F',
  },
  'parametric splines': {
    term: 'Parametric Splines',
    category: 'COMPUTATIONAL GEOMETRY',
    formula: 'B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃',
    definition: 'Polynomial coordinate functions generating smooth, continuous curves across high-dimensional space.',
    implementation: 'Renders the 3D Cyber Supra 911 wireframe chassis and roadway vectors on canvas.',
    accentColor: '#C7FF4A',
  },
};

interface TechGlossaryTooltipProps {
  termKey: string;
  children?: React.ReactNode;
  className?: string;
}

export const TechGlossaryTooltip = memo(function TechGlossaryTooltip({
  termKey,
  children,
  className = '',
}: TechGlossaryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const normalizedKey = termKey.toLowerCase().trim();
  const entry = GLOSSARY_DICTIONARY[normalizedKey];

  const handleOpen = () => {
    if (!isOpen) {
      playHoverTick();
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!entry) {
    return <span className={className}>{children || termKey}</span>;
  }

  const accentColor = entry.accentColor || '#00F0FF';

  return (
    <span className="relative inline-block">
      <span
        ref={triggerRef}
        role="button"
        tabIndex={0}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        className={`cursor-help border-b border-dotted transition-all duration-200 ${className}`}
        style={{
          borderColor: `${accentColor}80`,
          color: isOpen ? accentColor : undefined,
        }}
        aria-label={`${entry.term}: ${entry.definition}`}
      >
        {children || entry.term}
      </span>

      {/* Floating Micro-HUD Specification Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-72 sm:w-80 p-3.5 rounded-xl bg-[#090B12]/98 border border-[rgba(242,240,234,0.15)] shadow-2xl backdrop-blur-2xl text-left pointer-events-none sm:pointer-events-auto transition-all animate-[fadeIn_0.15s_ease-out]"
          style={{
            borderColor: `${accentColor}60`,
            boxShadow: `0 12px 30px -8px ${accentColor}30, 0 0 0 1px ${accentColor}20`,
          }}
        >
          {/* Header Metadata */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[9px] font-mono tracking-widest">
            <div className="flex items-center gap-1.5 font-bold" style={{ color: accentColor }}>
              <Terminal size={11} />
              <span>SYS // GLOSSARY</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[#F2F0EA] font-semibold">
              {entry.category}
            </span>
          </div>

          {/* Term Title & Formula */}
          <div className="mb-2">
            <h4 className="text-sm font-sans font-bold text-[#F2F0EA] flex items-center justify-between">
              <span>{entry.term}</span>
              <BookOpen size={12} className="text-[#8E8E8E]" />
            </h4>
            {entry.formula && (
              <div className="mt-1 px-2 py-1 rounded bg-black/50 border border-white/5 font-mono text-[10px] text-[#C7FF4A] tracking-wider overflow-x-auto">
                {entry.formula}
              </div>
            )}
          </div>

          {/* Definition */}
          <p className="text-[11px] font-sans text-[#8E8E8E] leading-relaxed mb-2">
            {entry.definition}
          </p>

          {/* Portfolio Implementation Context */}
          <div className="pt-2 border-t border-white/10 flex items-start gap-1.5 text-[10px] font-mono text-white/90">
            <Sparkles size={11} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
            <span>
              <strong className="text-white">Applied In: </strong>
              {entry.implementation}
            </span>
          </div>
        </div>
      )}
    </span>
  );
});
