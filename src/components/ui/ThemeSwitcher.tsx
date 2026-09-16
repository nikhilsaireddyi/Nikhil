'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Palette, ChevronDown, Check } from 'lucide-react';
import { playHoverTick, playSynapticPulse } from '@/lib/sound';

export type CyberTheme = 'lime' | 'cyberpunk' | 'solar' | 'violet';

export interface ThemeConfig {
  id: CyberTheme;
  name: string;
  shortName: string;
  color: string;
  rgb: string;
  glow: string;
  description: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'lime',
    name: 'ACID LIME',
    shortName: 'LIME',
    color: '#C7FF4A',
    rgb: '199, 255, 74',
    glow: 'rgba(199, 255, 74, 0.6)',
    description: 'High-voltage electric lime & cyber cyan',
  },
  {
    id: 'cyberpunk',
    name: 'CYBERPUNK 2077',
    shortName: 'CYAN',
    color: '#00F0FF',
    rgb: '0, 240, 255',
    glow: 'rgba(0, 240, 255, 0.6)',
    description: 'Neon electric cyan & night-city magenta',
  },
  {
    id: 'solar',
    name: 'SOLAR PAPAYA',
    shortName: 'SOLAR',
    color: '#FFB703',
    rgb: '255, 183, 3',
    glow: 'rgba(255, 183, 3, 0.6)',
    description: 'Radiant star gold & solar plasma amber',
  },
  {
    id: 'violet',
    name: 'QUANTUM VIOLET',
    shortName: 'VIOLET',
    color: '#A855F7',
    rgb: '168, 85, 247',
    glow: 'rgba(168, 85, 247, 0.6)',
    description: 'Ultraviolet neural pulse & deep electric purple',
  },
];

export function applyTheme(theme: CyberTheme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('portfolio-cyber-theme', theme);
    // Also update legacy key for compatibility
    localStorage.setItem('nikhil_theme_preference', theme);
  } catch {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('set-portfolio-theme', { detail: theme }));
  }
}

export function ThemeSwitcher({ className = '' }: { className?: string }) {
  const [activeTheme, setActiveTheme] = useState<CyberTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = (document.documentElement.getAttribute('data-theme') ||
        localStorage.getItem('portfolio-cyber-theme') ||
        localStorage.getItem('nikhil_theme_preference')) as CyberTheme | null;

      if (saved && THEMES.some((t) => t.id === saved)) {
        return saved;
      }
    }
    return 'lime';
  });
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync theme with global event
  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<CyberTheme>;
      if (customEvent.detail && THEMES.some((t) => t.id === customEvent.detail)) {
        setActiveTheme(customEvent.detail);
      }
    };

    window.addEventListener('set-portfolio-theme', handleThemeChange);
    return () => window.removeEventListener('set-portfolio-theme', handleThemeChange);
  }, []);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectTheme = useCallback((t: CyberTheme) => {
    playSynapticPulse();
    setActiveTheme(t);
    applyTheme(t);
    setIsOpen(false);
  }, []);

  const handleCycleTheme = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playSynapticPulse();
    const currentIndex = THEMES.findIndex((t) => t.id === activeTheme);
    const nextTheme = THEMES[(currentIndex + 1) % THEMES.length].id;
    setActiveTheme(nextTheme);
    applyTheme(nextTheme);
  }, [activeTheme]);

  const activeConfig = THEMES.find((t) => t.id === activeTheme) || THEMES[0];

  return (
    <div ref={containerRef} className={`relative inline-flex items-stretch ${className}`}>
      {/* Quick Cycle Left Button */}
      <button
        type="button"
        onClick={handleCycleTheme}
        title={`Active: ${activeConfig.name}. Click to cycle next palette.`}
        aria-label={`Current theme: ${activeConfig.name}. Click to cycle next palette.`}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-l-sm border border-r-0 border-[rgba(242,240,234,0.15)] bg-[rgba(18,18,24,0.85)] text-[#F2F0EA] hover:border-[var(--theme-accent,#C7FF4A)] hover:bg-[rgba(24,24,32,0.95)] transition-all text-xs font-mono group select-none"
      >
        <Palette
          size={12}
          style={{ color: activeConfig.color }}
          className="group-hover:rotate-45 transition-transform duration-300"
        />
        <span className="hidden sm:inline text-[10px] tracking-wider uppercase font-semibold text-[#8E8E8E] group-hover:text-[#F2F0EA] transition-colors">
          THEME:
        </span>
        <span
          className="text-[10px] font-bold tracking-wider uppercase transition-colors"
          style={{ color: activeConfig.color }}
        >
          {activeConfig.shortName}
        </span>
        <span
          className="h-2 w-2 rounded-full transition-all duration-300"
          style={{
            backgroundColor: activeConfig.color,
            boxShadow: `0 0 8px ${activeConfig.glow}`,
          }}
        />
      </button>

      {/* Dropdown Chevron Right Button */}
      <button
        type="button"
        onClick={() => {
          playHoverTick();
          setIsOpen(!isOpen);
        }}
        title="Open Palette Selector"
        aria-label="Open Palette Selector"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="px-1.5 py-1 rounded-r-sm border border-[rgba(242,240,234,0.15)] bg-[rgba(18,18,24,0.85)] text-[#8E8E8E] hover:text-[#F2F0EA] hover:border-[var(--theme-accent,#C7FF4A)] hover:bg-[rgba(24,24,32,0.95)] transition-all text-xs font-mono flex items-center justify-center select-none"
      >
        <ChevronDown
          size={11}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Palette Picker Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-label="Cyber Aesthetic Palettes"
          className="absolute right-0 top-full mt-2 z-[9999] p-2 bg-[#0A0B10]/98 backdrop-blur-2xl border border-[rgba(242,240,234,0.18)] rounded-lg shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex flex-col gap-1 min-w-[210px] animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between text-[9px] font-mono text-[#8E8E8E] px-2 py-1 uppercase tracking-widest border-b border-[rgba(242,240,234,0.08)] mb-1">
            <span>AESTHETIC PALETTES</span>
            <span className="text-[8px] text-[#555555]">CYCLE (CLICK)</span>
          </div>

          {THEMES.map((theme) => {
            const isSelected = activeTheme === theme.id;
            return (
              <button
                key={theme.id}
                role="menuitem"
                type="button"
                onClick={() => handleSelectTheme(theme.id)}
                className={`flex flex-col gap-0.5 px-2.5 py-2 rounded text-left transition-all group ${
                  isSelected
                    ? 'bg-[rgba(242,240,234,0.08)] border border-[rgba(242,240,234,0.12)] text-[#F2F0EA]'
                    : 'text-[#8E8E8E] hover:text-[#F2F0EA] hover:bg-[rgba(242,240,234,0.04)] border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-125"
                      style={{
                        backgroundColor: theme.color,
                        boxShadow: `0 0 8px ${theme.glow}`,
                      }}
                    />
                    <span className="font-mono text-[11px] font-bold tracking-wide">
                      {theme.name}
                    </span>
                  </div>
                  {isSelected && (
                    <Check size={12} style={{ color: theme.color }} className="stroke-[3]" />
                  )}
                </div>
                <span className="text-[9px] font-sans text-[#777777] group-hover:text-[#9E9E9E] pl-4.5 line-clamp-1 transition-colors">
                  {theme.description}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
