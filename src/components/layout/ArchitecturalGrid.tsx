import { memo } from 'react';

export const ArchitecturalGrid = memo(function ArchitecturalGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
    >
      {/* 12-Column Grid Lines for Desktop, 4 for Mobile */}
      <div className="mx-auto h-full w-full max-w-[1680px] px-6 sm:px-10 md:px-14 lg:px-16">
        <div className="grid h-full w-full grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`h-full border-r border-[rgba(242,240,234,0.03)] ${
                i >= 4 ? 'hidden md:block' : ''
              } ${i >= 8 ? 'hidden lg:block' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Subtle Horizontal Metric Lines */}
      <div className="absolute top-[25vh] left-0 right-0 h-[1px] bg-[rgba(242,240,234,0.02)]" />
      <div className="absolute top-[50vh] left-0 right-0 h-[1px] bg-[rgba(242,240,234,0.02)]" />
      <div className="absolute top-[75vh] left-0 right-0 h-[1px] bg-[rgba(242,240,234,0.02)]" />

      {/* Top and Bottom Architectural Edge Coordinates */}
      <div className="absolute top-4 left-6 sm:left-10 md:left-14 lg:left-16 flex items-center gap-4 text-[9px] font-mono tracking-[0.2em] text-[rgba(242,240,234,0.18)]">
        <span>SYS.V3 // GRID: 12-COL</span>
        <span>LAT: 17.6868° N</span>
        <span className="hidden sm:inline">LON: 83.2185° E</span>
      </div>

      <div className="absolute top-4 right-6 sm:right-10 md:right-14 lg:right-16 text-[9px] font-mono tracking-[0.2em] text-[rgba(242,240,234,0.18)]">
        <span>MODE: COMPUTATIONAL LAB</span>
      </div>
    </div>
  );
});
