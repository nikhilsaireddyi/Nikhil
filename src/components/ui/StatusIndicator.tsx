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
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[rgba(242,240,234,0.1)] bg-[rgba(18,18,18,0.6)] backdrop-blur-md text-[10px] font-mono tracking-[0.18em] text-[#F2F0EA] select-none ${className}`}
      aria-label={`Status: ${label}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C7FF4A] opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C7FF4A]" />
      </span>
      <span>{label}</span>
    </div>
  );
});
