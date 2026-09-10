'use client';

import { Terminal } from 'lucide-react';
import { playHoverTick } from '@/lib/sound';
import { openCyberShell } from '@/components/ui/CyberCommandPalette';

export function AITerminal() {
  return (
    <div className="fixed bottom-6 left-6 z-40 hidden sm:block">
      <button
        type="button"
        onClick={() => openCyberShell()}
        onMouseEnter={playHoverTick}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl font-mono text-xs font-bold tracking-wider backdrop-blur-xl transition-all duration-300 shadow-2xl border bg-[#0A0D14]/90 text-[#F2F0EA] border-[rgba(242,240,234,0.15)] hover:border-[#00F0FF]/60 hover:text-[#00F0FF] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] group select-none"
        aria-label="Open Cyber Command Terminal Shell (Cmd + K)"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF]" />
        </span>
        <Terminal size={14} className="text-[#00F0FF] group-hover:animate-pulse" />
        <span>NIKHIL_AI CLI</span>
        <span className="hidden md:inline-block text-[10px] text-[#8E8E8E] px-1.5 py-0.5 rounded bg-white/10 font-normal">
          ⌘K
        </span>
      </button>
    </div>
  );
}
