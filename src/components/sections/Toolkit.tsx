'use client';

import { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { skillCategories } from '@/data/skills';
import { Skill } from '@/types';
import { useCursorHover } from '@/hooks/useCursorHover';
import { ArrowUpRight, Share2, ListFilter } from 'lucide-react';
import { SkillConstellation } from '@/components/ui/SkillConstellation';
import { playHoverTick } from '@/lib/sound';

const CATEGORY_ACCENTS: Record<string, { color: string; border: string; bg: string; glow: string }> = {
  aiml: {
    color: '#00F0FF',
    border: 'border-[#00F0FF]/40',
    bg: 'bg-[#00F0FF]/10',
    glow: 'rgba(0, 240, 255, 0.25)',
  },
  frontend: {
    color: '#FF007F',
    border: 'border-[#FF007F]/40',
    bg: 'bg-[#FF007F]/10',
    glow: 'rgba(255, 0, 127, 0.25)',
  },
  motion: {
    color: '#FFB703',
    border: 'border-[#FFB703]/40',
    bg: 'bg-[#FFB703]/10',
    glow: 'rgba(255, 183, 3, 0.25)',
  },
  focus: {
    color: '#00F0FF',
    border: 'border-[#00F0FF]/40',
    bg: 'bg-[#00F0FF]/10',
    glow: 'rgba(0, 240, 255, 0.25)',
  },
  languages: {
    color: '#FFB703',
    border: 'border-[#FFB703]/40',
    bg: 'bg-[#FFB703]/10',
    glow: 'rgba(255, 183, 3, 0.25)',
  },
  systems: {
    color: '#C7FF4A',
    border: 'border-[#C7FF4A]/40',
    bg: 'bg-[#C7FF4A]/10',
    glow: 'rgba(199, 255, 74, 0.25)',
  },
};

export function Toolkit() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'both' | 'graph' | 'matrix'>('both');
  const cursorHandlers = useCursorHover('link');

  return (
    <section
      id="toolkit"
      className="relative w-full py-24 sm:py-32 md:py-40 border-b border-[rgba(242,240,234,0.06)] z-10 overflow-hidden"
      aria-label="Technical Toolkit Index"
    >
      <div className="mx-auto max-w-[1680px] px-6 sm:px-10 md:px-14 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeader
            number="02"
            label="TOOLKIT"
            subtitle="KINETIC TECHNICAL INDEX // OBJECTIVE CAPABILITIES"
            title="ENGINEERING INSTRUMENTS"
          />

          {/* View Mode Switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0F1117] border border-[rgba(242,240,234,0.1)] self-start md:self-auto">
            <button
              onClick={() => {
                setViewMode('both');
                playHoverTick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                viewMode === 'both'
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40'
                  : 'text-[#8E8E8E] hover:text-[#F2F0EA]'
              }`}
            >
              <span>COMBINED</span>
            </button>
            <button
              onClick={() => {
                setViewMode('graph');
                playHoverTick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                viewMode === 'graph'
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40'
                  : 'text-[#8E8E8E] hover:text-[#F2F0EA]'
              }`}
            >
              <Share2 size={12} />
              <span>3D GRAPH</span>
            </button>
            <button
              onClick={() => {
                setViewMode('matrix');
                playHoverTick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                viewMode === 'matrix'
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40'
                  : 'text-[#8E8E8E] hover:text-[#F2F0EA]'
              }`}
            >
              <ListFilter size={12} />
              <span>INDEX</span>
            </button>
          </div>
        </div>

        {/* 3D Force-Directed Constellation View */}
        {(viewMode === 'both' || viewMode === 'graph') && (
          <SkillConstellation />
        )}

        {/* Categories Stack / Matrix View */}
        {(viewMode === 'both' || viewMode === 'matrix') && (
          <div className="space-y-16 sm:space-y-20">

          {skillCategories.map((category) => {
            const accent = CATEGORY_ACCENTS[category.id] || {
              color: '#00F0FF',
              border: 'border-[#00F0FF]/40',
              bg: 'bg-[#00F0FF]/10',
              glow: 'rgba(0, 240, 255, 0.25)',
            };

            return (
              <div key={category.id} className="border-t border-[rgba(242,240,234,0.1)] pt-8">
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-8">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-mono tracking-widest font-bold"
                      style={{ color: accent.color }}
                    >
                      [{category.number}]
                    </span>
                    <h3 className="text-xl sm:text-2xl font-sans font-bold text-[#F2F0EA] uppercase tracking-tight">
                      {category.label}
                    </h3>
                  </div>

                  <p className="text-xs font-mono text-[#8E8E8E] tracking-wider max-w-md">
                    {category.description}
                  </p>
                </div>

                {/* Kinetic Skills Table / Rows */}
                <div className="divide-y divide-[rgba(242,240,234,0.06)] border-b border-[rgba(242,240,234,0.06)]">
                  {category.items.map((skill: Skill) => {
                    const isHovered = hoveredSkill === skill.name;
                    return (
                      <div
                        key={skill.name}
                        {...cursorHandlers}
                        onMouseEnter={() => setHoveredSkill(skill.name)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        className={`group relative transition-all duration-300 py-5 sm:py-6 px-4 sm:px-6 cursor-pointer rounded-xl ${
                          isHovered
                            ? 'bg-[#14151E] translate-x-1 sm:translate-x-2 shadow-lg'
                            : 'bg-transparent hover:bg-[#0E0F14]'
                        }`}
                        style={{
                          boxShadow: isHovered ? `0 4px 20px -2px ${accent.glow}` : undefined,
                        }}
                      >
                        {/* Active Left Neon Indicator */}
                        <span
                          className={`absolute left-0 top-2 bottom-2 w-[4px] rounded-r-md transition-opacity duration-200 ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                          }`}
                          style={{ backgroundColor: accent.color }}
                        />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* Name & Tag */}
                          <div className="flex items-baseline gap-4">
                            <span
                              className="text-xl sm:text-2xl md:text-3xl font-sans font-bold uppercase tracking-tight transition-colors"
                              style={{
                                color: isHovered ? accent.color : '#F2F0EA',
                              }}
                            >
                              {skill.name}
                            </span>
                            <span
                              className="text-[10px] font-mono tracking-[0.2em] font-bold px-2.5 py-0.5 rounded uppercase border transition-colors"
                              style={{
                                color: isHovered ? accent.color : '#8E8E8E',
                                borderColor: isHovered ? accent.color : 'rgba(242,240,234,0.1)',
                                backgroundColor: isHovered ? `${accent.color}15` : 'transparent',
                              }}
                            >
                              {skill.tag}
                            </span>
                          </div>

                          {/* Description & Technical Metadata */}
                          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8 text-xs font-mono text-[#A0A0A0]">
                            <p className="max-w-md font-sans text-xs sm:text-sm text-[#D4D2CC] group-hover:text-[#F2F0EA] transition-colors">
                              {skill.description}
                            </p>

                            <div className="flex items-center justify-between md:justify-end gap-3 min-w-[180px]">
                              <span
                                className="text-[10px] tracking-widest transition-colors font-bold"
                                style={{
                                  color: isHovered ? accent.color : '#555555',
                                }}
                              >
                                {skill.metadata}
                              </span>
                              <ArrowUpRight
                                size={14}
                                className="transition-transform duration-200"
                                style={{
                                  color: isHovered ? accent.color : '#8E8E8E',
                                  transform: isHovered ? 'translate(2px, -2px)' : 'none',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}
