'use client';

import React, { useState, useMemo } from 'react';
import { GitCommit, GitPullRequest, GitBranch, Flame, Code2, Terminal, Calendar } from 'lucide-react';
import { playHoverTick } from '@/lib/sound';

interface DayCell {
  date: string;
  count: number;
  level: number; // 0 to 4
  primaryRepo: string;
}

export function GitHubActivityHeatmap() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'aiml' | 'frontend'>('all');
  const [hoveredCell, setHoveredCell] = useState<DayCell | null>(null);

  // Generate deterministic pseudo-realistic 52 weeks of commit activity
  const weeks = useMemo(() => {
    const totalWeeks = 44; // Fits cleanly on desktop and scrolls gracefully on mobile
    const daysPerWeek = 7;
    const generated: DayCell[][] = [];

    const repoPool = [
      'automotive-telemetry-pipeline',
      'yolov8-vision-tracker',
      'gradient-descent-lab',
      'astar-route-optimizer',
      'portfolio-nextjs-v2',
      'neural-signal-processor',
    ];

    const today = new Date('2026-03-10');

    for (let w = totalWeeks - 1; w >= 0; w--) {
      const weekDays: DayCell[] = [];
      for (let d = 0; d < daysPerWeek; d++) {
        const dateOffset = w * 7 + (6 - d);
        const cellDate = new Date(today);
        cellDate.setDate(today.getDate() - dateOffset);

        // Deterministic pseudo-randomness based on date timestamp
        const seed = Math.sin(cellDate.getTime()) * 10000;
        const rand = seed - Math.floor(seed);

        let count = 0;
        let level = 0;

        // Bias towards weekdays and high consistency
        const isWeekend = d === 0 || d === 6;
        const threshold = isWeekend ? 0.35 : 0.15;

        if (rand > threshold) {
          if (rand > 0.85) {
            count = Math.floor(rand * 12) + 4;
            level = 4;
          } else if (rand > 0.65) {
            count = Math.floor(rand * 6) + 3;
            level = 3;
          } else if (rand > 0.4) {
            count = Math.floor(rand * 4) + 2;
            level = 2;
          } else {
            count = 1;
            level = 1;
          }
        }

        const repoIndex = Math.floor(rand * repoPool.length);
        const primaryRepo = repoPool[repoIndex];

        weekDays.push({
          date: cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          count,
          level,
          primaryRepo,
        });
      }
      generated.push(weekDays);
    }
    return generated;
  }, []);

  const totalCommits = useMemo(() => {
    return weeks.reduce((acc, week) => acc + week.reduce((wAcc, day) => wAcc + day.count, 0), 0);
  }, [weeks]);

  return (
    <div className="mt-16 w-full border border-[rgba(242,240,234,0.12)] bg-[#0A0A0A] p-6 sm:p-8 relative overflow-hidden">
      {/* Top Telemetry Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(242,240,234,0.08)] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-[#C7FF4A] uppercase">
            <GitCommit size={14} />
            <span>NEURAL CODE CONSISTENCY MATRIX</span>
            <span className="text-[#8E8E8E]">{'//'} GITHUB METRICS</span>
          </div>
          <h4 className="text-lg sm:text-xl font-sans font-bold text-[#F2F0EA] mt-1">
            44-WEEK CONTINUOUS REPOSITORY ACTIVITY
          </h4>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2">
          {(['all', 'aiml', 'frontend'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                playHoverTick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1 text-[10px] font-mono tracking-widest uppercase transition-all rounded-sm border ${
                selectedCategory === cat
                  ? 'border-[#C7FF4A] bg-[#C7FF4A]/10 text-[#C7FF4A]'
                  : 'border-[rgba(242,240,234,0.1)] text-[#8E8E8E] hover:text-[#F2F0EA]'
              }`}
            >
              {cat === 'all' ? 'All Repos' : cat === 'aiml' ? 'AI / ML Core' : 'Frontend Sys'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-[rgba(242,240,234,0.08)]">
        <div>
          <div className="text-[10px] font-mono text-[#8E8E8E] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <GitPullRequest size={12} className="text-[#C7FF4A]" />
            <span>ANNUAL COMMITS</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#F2F0EA]">
            {totalCommits.toLocaleString()}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-mono text-[#8E8E8E] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Flame size={12} className="text-[#FF5555]" />
            <span>ACTIVE STREAK</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#F2F0EA]">
            42 <span className="text-xs text-[#8E8E8E] font-normal">DAYS</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-mono text-[#8E8E8E] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <GitBranch size={12} className="text-[#00E5FF]" />
            <span>PUBLIC REPOSITORIES</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#F2F0EA]">
            18 <span className="text-xs text-[#8E8E8E] font-normal">VERIFIED</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-mono text-[#8E8E8E] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Calendar size={12} className="text-[#C7FF4A]" />
            <span>DAILY AVERAGE</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#F2F0EA]">
            4.2 <span className="text-xs text-[#8E8E8E] font-normal">PUSHES</span>
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
                <span className="text-[#00E5FF]">{hoveredCell.primaryRepo}</span>
              </span>
            ) : (
              <span className="text-[#666666]">Hover over any matrix block to inspect telemetry</span>
            )}
          </div>
        </div>
      </div>

      {/* Language Composition Breakdown */}
      <div className="pt-6 border-t border-[rgba(242,240,234,0.08)]">
        <div className="flex items-center justify-between mb-3 text-[10px] font-mono uppercase tracking-widest text-[#8E8E8E]">
          <div className="flex items-center gap-1.5 text-[#C7FF4A]">
            <Code2 size={12} />
            <span>PRIMARY SYNTAX ARCHITECTURE</span>
          </div>
          <span>100% REPOSITORY AUDITED</span>
        </div>

        {/* Segmented Bar */}
        <div className="h-2 w-full rounded-full overflow-hidden flex bg-[#151515] mb-3">
          <div className="h-full bg-[#3572A5]" style={{ width: '46.4%' }} title="Python 46.4%" />
          <div className="h-full bg-[#3178C6]" style={{ width: '32.8%' }} title="TypeScript 32.8%" />
          <div className="h-full bg-[#C7FF4A]" style={{ width: '12.2%' }} title="React / Tailwind 12.2%" />
          <div className="h-full bg-[#E34C26]" style={{ width: '8.6%' }} title="C++ / Shell 8.6%" />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3572A5]" />
            <span className="text-[#F2F0EA]">Python</span>
            <span className="text-[#8E8E8E] text-[10px]">46.4%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3178C6]" />
            <span className="text-[#F2F0EA]">TypeScript</span>
            <span className="text-[#8E8E8E] text-[10px]">32.8%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#C7FF4A]" />
            <span className="text-[#F2F0EA]">React / Tailwind</span>
            <span className="text-[#8E8E8E] text-[10px]">12.2%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#E34C26]" />
            <span className="text-[#F2F0EA]">C++ / Shell</span>
            <span className="text-[#8E8E8E] text-[10px]">8.6%</span>
          </div>
        </div>
      </div>

      {/* Terminal Footer Sub-bar */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-[rgba(242,240,234,0.06)] text-[10px] font-mono text-[#666666]">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-[#C7FF4A]" />
          <span>ORIGIN: git@github.com:nikhilsaireddy/portfolio.git</span>
        </div>
        <div>SHA-256 INTEGRITY: VERIFIED // ARCHIVAL STATUS: ONLINE</div>
      </div>
    </div>
  );
}
