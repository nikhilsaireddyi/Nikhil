import { memo } from 'react';

interface SectionHeaderProps {
  number: string;
  label: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const SectionHeader = memo(function SectionHeader({
  number,
  label,
  title,
  subtitle,
  className = '',
}: SectionHeaderProps) {
  return (
    <header className={`mb-12 sm:mb-16 md:mb-20 border-t border-[rgba(242,240,234,0.1)] pt-6 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-mono tracking-[0.2em] text-[#C7FF4A]">
            {number}
          </span>
          <span className="text-xs sm:text-sm font-mono tracking-[0.2em] text-[#8E8E8E] uppercase">
            / {label}
          </span>
        </div>

        {subtitle && (
          <p className="text-xs sm:text-sm font-mono tracking-[0.1em] text-[#8E8E8E] max-w-md">
            {subtitle}
          </p>
        )}
      </div>

      {title && (
        <h2 className="mt-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-[#F2F0EA] uppercase leading-[0.95]">
          {title}
        </h2>
      )}
    </header>
  );
});
