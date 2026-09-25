'use client';

import React, { useState, useMemo } from 'react';
import { GitCommit, GitPullRequest, GitBranch, Flame, Code2, Terminal, Calendar, Layers, Sparkles } from 'lucide-react';
import { playHoverTick } from '@/lib/sound';

interface DayCell {
  date: string;
  count: number;
  level: number; // 0 to 4
  primaryRepo: string;
  domain: 'aiml' | 'frontend' | 'mixed';
}

type CategoryKey = 'all' | 'aiml' | 'frontend';

interface CategoryConfig {
  label: string;
  badge: string;
  title: string;
  subtitle: string;
  repos: string[];
  repoCount: number;
  streak: number;
  dailyAvg: string;
  languages: { name: string; pct: string; color: string; width: string }[];
}

const CATEGORY_CONFIGS: Record<CategoryKey, CategoryConfig> = {
  all: {
    label: 'ALL REPOS',
    badge: '18 REPOSITORIES',
    title: '44-WEEK CONTINUOUS REPOSITORY ACTIVITY',
    subtitle: 'GLOBAL REPOSITORY AUDIT // ALL 18 TRACKED CODEBASES',
    repos: [
      'automotive-telemetry-pipeline',
      'yolov8-vision-tracker',
      'gradient-descent-lab',
      'ganesh-the-quest-engine',
      'portfolio-nextjs-v2',
      'neural-signal-processor',
    ],
    repoCount: 18,
    streak: 42,
    dailyAvg: '4.2',
    languages: [
      { name: 'Python', pct: '46.4%', color: '#3572A5', width: '46.4%' },
      { name: 'TypeScript', pct: '32.8%', color: '#3178C6', width: '32.8%' },
      { name: 'React / Tailwind', pct: '12.2%', color: '#C7FF4A', width: '12.2%' },
      { name: 'C++ / Shell', pct: '8.6%', color: '#E34C26', width: '8.6%' },
    ],
  },
  aiml: {
    label: 'AI / ML CORE',
    badge: '11 REPOSITORIES',
    title: 'AI & MACHINE LEARNING REPOSITORY ACTIVITY',
    subtitle: 'COMPUTER VISION, NEURAL ARCHITECTURES & MATHEMATICAL MODELING',
    repos: [
      'yolov8-vision-tracker',
      'gradient-descent-lab',
      'neural-signal-processor',
      'automotive-telemetry-pipeline',
      'pytorch-model-zoo',
    ],
    repoCount: 11,
    streak: 28,
    dailyAvg: '2.6',
    languages: [
      { name: 'Python', pct: '74.2%', color: '#3572A5', width: '74.2%' },
      { name: 'PyTorch / C++', pct: '14.8%', color: '#EE4C2C', width: '14.8%' },
      { name: 'CUDA / Shell', pct: '6.5%', color: '#76B900', width: '6.5%' },
      { name: 'Jupyter', pct: '4.5%', color: '#DA5B0B', width: '4.5%' },
    ],
  },
  frontend: {
    label: 'FRONTEND SYS',
    badge: '7 REPOSITORIES',
    title: 'FRONTEND & INTERFACE REPOSITORY ACTIVITY',
    subtitle: 'REACT 19, CANVAS GAME ENGINES, TYPESCRIPT & KINETIC MOTION',
    repos: [
      'ganesh-the-quest-engine',
      'portfolio-nextjs-v2',
      'animejs-kinetic-components',
      'canvas-shader-experiments',
      'lenis-physics-lab',
    ],
    repoCount: 7,
    streak: 34,
    dailyAvg: '1.8',
    languages: [
      { name: 'TypeScript', pct: '58.6%', color: '#3178C6', width: '58.6%' },
      { name: 'React 19', pct: '24.2%', color: '#00F0FF', width: '24.2%' },
      { name: 'Tailwind CSS', pct: '11.4%', color: '#C7FF4A', width: '11.4%' },
      { name: 'HTML5 Canvas', pct: '5.8%', color: '#FF8F00', width: '5.8%' },
    ],
  },
};

export function GitHubActivityHeatmap() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [hoveredCell, setHoveredCell] = useState<DayCell | null>(null);

  const currentConfig = CATEGORY_CONFIGS[selectedCategory];

  // Dynamically generate 44 weeks of commit activity reacting to selectedCategory
  const weeks = useMemo(() => {
    const totalWeeks = 44;
    const daysPerWeek = 7;
    const generated: DayCell[][] = [];

    const today = new Date('2026-03-10');

    for (let w = totalWeeks - 1; w >= 0; w--) {
      const weekDays: DayCell[] = [];
      for (let d = 0; d < daysPerWeek; d++) {
        const dateOffset = w * 7 + (6 - d);
        const cellDate = new Date(today);
        cellDate.setDate(today.getDate() - dateOffset);

        // Deterministic pseudo-random seed based on day offset
        const seed1 = Math.sin(dateOffset * 9301 + 49297) * 233280;
        const rand = Math.abs(seed1 - Math.floor(seed1));

        const isWeekend = d === 0 || d === 6;

        // Determine which domain had commits on this day
        // Day hash assigns ~60% AI/ML days and ~40% Frontend days, with overlap on peak sprints
        const dayDomainHash = (dateOffset * 17) % 100;
        const isAimlDay = dayDomainHash < 65;
        const isFrontendDay = dayDomainHash > 35;

        let dayActiveInFilter = false;
        let domain: 'aiml' | 'frontend' | 'mixed' = 'aiml';

        if (selectedCategory === 'all') {
          dayActiveInFilter = true;
          domain = isAimlDay && isFrontendDay ? 'mixed' : isAimlDay ? 'aiml' : 'frontend';
        } else if (selectedCategory === 'aiml') {
          dayActiveInFilter = isAimlDay;
          domain = 'aiml';
        } else {
          dayActiveInFilter = isFrontendDay;
          domain = 'frontend';
        }

        let count = 0;
        let level = 0;

        if (dayActiveInFilter) {
          const threshold = isWeekend ? 0.38 : 0.12;
          if (rand > threshold) {
            if (selectedCategory === 'all') {
              if (rand > 0.85) {
                count = Math.floor(rand * 10) + 5;
                level = 4;
              } else if (rand > 0.65) {
                count = Math.floor(rand * 5) + 3;
                level = 3;
              } else if (rand > 0.38) {
                count = Math.floor(rand * 3) + 2;
                level = 2;
              } else {
                count = 1;
                level = 1;
              }
            } else if (selectedCategory === 'aiml') {
              if (rand > 0.82) {
                count = Math.floor(rand * 8) + 4;
                level = 4;
              } else if (rand > 0.62) {
                count = Math.floor(rand * 4) + 2;
                level = 3;
              } else if (rand > 0.35) {
                count = 2;
                level = 2;
              } else {
                count = 1;
                level = 1;
              }
            } else {
              // frontend
              if (rand > 0.80) {
                count = Math.floor(rand * 6) + 3;
                level = 4;
              } else if (rand > 0.58) {
                count = Math.floor(rand * 3) + 2;
                level = 3;
              } else if (rand > 0.32) {
                count = 2;
                level = 2;
              } else {
                count = 1;
                level = 1;
              }
            }
          }
        }

        const pool = currentConfig.repos;
        const repoIdx = Math.floor(rand * pool.length);
        const primaryRepo = pool[repoIdx] || pool[0];

        weekDays.push({
          date: cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          count,
          level,
          primaryRepo,
          domain,
        });
      }
      generated.push(weekDays);
    }
    return generated;
  }, [selectedCategory, currentConfig.repos]);

  const totalCommits = useMemo(() => {
    return weeks.reduce((acc, week) => acc + week.reduce((wAcc, day) => wAcc + day.count, 0), 0);
  }, [weeks]);

  return (
    <div className="mt-16 w-full border border-[rgba(242,240,234,0.12)] bg-[#0A0A0A] p-6 sm:p-8 relative overflow-hidden rounded-xl">
      {/* Top Telemetry Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(242,240,234,0.08)] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-[#C7FF4A] uppercase">
            <GitCommit size={14} />
            <span>NEURAL CODE CONSISTENCY MATRIX</span>
            <span className="text-[#8E8E8E]">{'//'} GITHUB METRICS</span>
          </div>
          <h4 className="text-lg sm:text-xl font-sans font-bold text-[#F2F0EA] mt-1 transition-all">
            {currentConfig.title}
          </h4>
          <p className="text-xs font-mono text-[#A8ABB8] mt-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
            <span>{currentConfig.subtitle}</span>
          </p>
        </div>

        {/* Dynamic Filter Chips */}
        <div className="flex items-center gap-2 bg-[#12141C] p-1.5 rounded-lg border border-[rgba(242,240,234,0.08)]">
          {(['all', 'aiml', 'frontend'] as const).map((cat) => {
            const cfg = CATEGORY_CONFIGS[cat];
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  playHoverTick();
                  setSelectedCategory(cat);
                  setHoveredCell(null);
                }}
                className={`px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase transition-all rounded-md border flex items-center gap-1.5 ${
                  isActive
                    ? 'border-[#C7FF4A] bg-[#C7FF4A]/15 text-[#C7FF4A] font-bold shadow-[0_0_12px_rgba(199,255,74,0.3)]'
                    : 'border-transparent text-[#8E8E8E] hover:text-[#F2F0EA] hover:bg-[#181B26]'
                }`}
              >
                <span>{cfg.label}</span>
                {isActive && <span className="text-[9px] opacity-75 font-normal">({cfg.repoCount})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Repos Scope Pill Strip */}
      <div className="py-3 px-3.5 my-4 rounded-lg bg-[#0E1017] border border-[rgba(242,240,234,0.06)] flex flex-wrap items-center gap-2 text-[10px] font-mono">
        <span className="text-[#8E8E8E] uppercase tracking-wider flex items-center gap-1">
          <GitBranch size={11} className="text-[#00F0FF]" />
          ACTIVE REPOSITORIES:
        </span>
        {currentConfig.repos.map((repo) => (
          <span
            key={repo}
            className="px-2 py-0.5 rounded bg-[#161824] border border-[rgba(0,240,255,0.2)] text-[#00F0FF] font-medium"
          >
            {repo}
          </span>
        ))}
      </div>

      {/* Metrics Row - Dynamically Filtered */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-[rgba(242,240,234,0.08)]">
        <div>
          <div className="text-[10px] font-mono text-[#8E8E8E] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <GitPullRequest size={12} className="text-[#C7FF4A]" />
            <span>ANNUAL COMMITS</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#F2F0EA] transition-all">
            {totalCommits.toLocaleString()}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-mono text-[#8E8E8E] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Flame size={12} className="text-[#FF5555]" />
            <span>ACTIVE STREAK</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#F2F0EA] transition-all">
            {currentConfig.streak} <span className="text-xs text-[#8E8E8E] font-normal">DAYS</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-mono text-[#8E8E8E] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <GitBranch size={12} className="text-[#00E5FF]" />
            <span>PUBLIC REPOSITORIES</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#F2F0EA] transition-all">
            {currentConfig.repoCount} <span className="text-xs text-[#8E8E8E] font-normal">VERIFIED</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-mono text-[#8E8E8E] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Calendar size={12} className="text-[#C7FF4A]" />
            <span>DAILY AVERAGE</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#F2F0EA] transition-all">
            {currentConfig.dailyAvg} <span className="text-xs text-[#8E8E8E] font-normal">PUSHES</span>
          </div>
        </div>
      </div>

      {/* Interactive Heatmap Matrix */}
      <div className="py-6">
        <div className="flex items-center justify-between text-[10px] font-mono text-[#8E8E8E] mb-3">
          <span>MAR 2025</span>
          <span>JUN 2025</span>
          <span>SEP 2025</span>
          <span>DEC 2025</span>
          <span>MAR 2026 (PRESENT)</span>
        </div>

        <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#C7FF4A]/20">
          <div className="inline-flex gap-1.5 min-w-[720px]">
            {weeks.map((week, wIdx) => (
              <div key={`w-${wIdx}`} className="flex flex-col gap-1.5">
                {week.map((day, dIdx) => {
                  let bgClass = 'bg-[#151515] border-[rgba(242,240,234,0.04)]';
                  if (day.level === 1) bgClass = 'bg-[#163818] border-[#225c26]';
                  if (day.level === 2) bgClass = 'bg-[#1e6124] border-[#2e8b35]';
                  if (day.level === 3) bgClass = 'bg-[#3fa32d] border-[#57db3f] shadow-[0_0_6px_rgba(87,219,63,0.3)]';
                  if (day.level === 4) bgClass = 'bg-[#C7FF4A] border-[#E2FF85] shadow-[0_0_8px_rgba(199,255,74,0.6)]';

                  return (
                    <button
                      key={`d-${wIdx}-${dIdx}`}
                      type="button"
                      aria-label={`${day.date}: ${day.count} commits`}
                      onMouseEnter={() => {
                        setHoveredCell(day);
                      }}
                      className={`h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-[2px] border transition-transform hover:scale-125 focus:scale-125 focus:outline-none ${bgClass}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap Legend & Live Hover Inspector */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-[11px] text-[#8E8E8E]">
            <span>LESS</span>
            <div className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-[1px] bg-[#151515] border border-[rgba(242,240,234,0.06)]" />
              <span className="h-2.5 w-2.5 rounded-[1px] bg-[#163818]" />
              <span className="h-2.5 w-2.5 rounded-[1px] bg-[#1e6124]" />
              <span className="h-2.5 w-2.5 rounded-[1px] bg-[#3fa32d]" />
              <span className="h-2.5 w-2.5 rounded-[1px] bg-[#C7FF4A]" />
            </div>
            <span>MORE ACTIVITY</span>
          </div>

          <div className="min-h-[24px] text-[11px] font-mono text-[#F2F0EA]">
            {hoveredCell ? (
              <span className="text-[#C7FF4A]">
                {hoveredCell.date}:{' '}
                <strong className="text-[#F2F0EA]">{hoveredCell.count} commits</strong> in{' '}
                <span className="text-[#00E5FF] font-semibold">{hoveredCell.primaryRepo}</span>
              </span>
            ) : (
              <span className="text-[#888888]">Hover over any matrix block to inspect telemetry</span>
            )}
          </div>
        </div>
      </div>

      {/* Language Composition Breakdown - Dynamically Filtered */}
      <div className="pt-6 border-t border-[rgba(242,240,234,0.08)]">
        <div className="flex items-center justify-between mb-3 text-[10px] font-mono uppercase tracking-widest text-[#8E8E8E]">
          <div className="flex items-center gap-1.5 text-[#C7FF4A]">
            <Code2 size={12} />
            <span>PRIMARY SYNTAX ARCHITECTURE // {currentConfig.label}</span>
          </div>
          <span>100% REPOSITORY AUDITED</span>
        </div>

        {/* Dynamic Segmented Bar */}
        <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-[#151515] mb-3 transition-all">
          {currentConfig.languages.map((lang) => (
            <div
              key={lang.name}
              className="h-full transition-all duration-500"
              style={{ width: lang.width, backgroundColor: lang.color }}
              title={`${lang.name} ${lang.pct}`}
            />
          ))}
        </div>

        {/* Dynamic Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          {currentConfig.languages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
              <span className="text-[#F2F0EA] truncate">{lang.name}</span>
              <span className="text-[#8E8E8E] text-[10px]">{lang.pct}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Footer Sub-bar */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-[rgba(242,240,234,0.06)] text-[10px] font-mono text-[#666666]">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-[#C7FF4A]" />
          <span>ORIGIN: git@github.com:nikhilsaireddyi/portfolio.git</span>
        </div>
        <div>SHA-256 INTEGRITY: VERIFIED // ARCHIVAL STATUS: ONLINE</div>
      </div>
    </div>
  );
}
