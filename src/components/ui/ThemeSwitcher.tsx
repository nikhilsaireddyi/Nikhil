'use client';

import React, { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { playHoverTick } from '@/lib/sound';

export type CyberTheme = 'lime' | 'cyberpunk' | 'solar' | 'violet';

export interface ThemeConfig {
  id: CyberTheme;
  name: string;
  color: string;
  glow: string;
}

export const THEMES: ThemeConfig[] = [
  { id: 'lime', name: 'ACID LIME', color: '#C7FF4A', glow: 'rgba(199, 255, 74, 0.5)' },
  { id: 'cyberpunk', name: 'CYBERPUNK 2077', color: '#00F0FF', glow: 'rgba(0, 240, 255, 0.5)' },
  { id: 'solar', name: 'SOLAR PAPAYA', color: '#FFB703', glow: 'rgba(255, 183, 3, 0.5)' },
  { id: 'violet', name: 'QUANTUM VIOLET', color: '#A855F7', glow: 'rgba(168, 85, 247, 0.5)' },
];

export function applyTheme(theme: CyberTheme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-cyber-theme', theme);
}

export function ThemeSwitcher({ className = '' }: { className?: string }) {
  const [activeTheme, setActiveTheme] = useState<CyberTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-cyber-theme') as CyberTheme | null;
      if (saved && THEMES.some((t) => t.id === saved)) {
        return saved;
      }
    }
    return 'lime';
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  const handleSelectTheme = (t: CyberTheme) => {
    playHoverTick();
    setActiveTheme(t);
    applyTheme(t);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => {
          playHoverTick();
          setIsOpen(!isOpen);
        }}
        title="Switch Cyber Aesthetic Theme"
        aria-label="Switch Cyber Aesthetic Theme"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-[rgba(242,240,234,0.15)] bg-[rgba(18,18,24,0.8)] text-[#F2F0EA] hover:border-[#C7FF4A] transition-all text-xs font-mono"
      >
        <Palette size={12} style={{ color: THEMES.find((t) => t.id === activeTheme)?.color }} />
        <span className="hidden sm:inline text-[10px] tracking-wider uppercase">THEME</span>
        <span
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor: THEMES.find((t) => t.id === activeTheme)?.color,
            boxShadow: `0 0 6px ${THEMES.find((t) => t.id === activeTheme)?.glow}`,
          }}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 p-2 bg-[#0A0B10]/95 backdrop-blur-xl border border-[rgba(242,240,234,0.15)] rounded-lg shadow-2xl flex flex-col gap-1.5 min-w-[150px]">
          <div className="text-[9px] font-mono text-[#8E8E8E] px-2 py-1 uppercase tracking-widest border-b border-[rgba(242,240,234,0.08)]">
            CYBER PALETTES
          </div>
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => {
                handleSelectTheme(theme.id);
                setIsOpen(false);
              }}
              className={`flex items-center justify-between px-2 py-1.5 rounded text-[10px] font-mono transition-all ${
                activeTheme === theme.id
                  ? 'bg-[rgba(242,240,234,0.08)] text-[#F2F0EA] font-bold'
                  : 'text-[#8E8E8E] hover:text-[#F2F0EA]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: theme.color, boxShadow: `0 0 6px ${theme.glow}` }}
                />
                <span>{theme.name}</span>
              </div>
              {activeTheme === theme.id && <span className="text-[9px] text-[#C7FF4A]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
