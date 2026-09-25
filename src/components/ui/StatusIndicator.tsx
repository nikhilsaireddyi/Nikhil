import { memo } from 'react';

interface StatusIndicatorProps {
  label?: string;
  className?: string;
}

export const StatusIndicator = memo(function StatusIndicator({
  label = 'BUILDING / LEARNING',
  className = '',
}: StatusIndicatorProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(199,255,74,0.35)] bg-[#0C101A]/95 backdrop-blur-md text-[10px] font-mono font-semibold tracking-[0.18em] text-[#F2F0EA] shadow-[0_0_15px_rgba(199,255,74,0.15)] select-none ${className}`}
      aria-label={`Status: ${label}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C7FF4A] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C7FF4A]" />
      </span>
      <span className="text-[#F2F0EA]">{label}</span>
    </div>
  );
});
