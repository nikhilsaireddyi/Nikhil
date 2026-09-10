'use client';

import { ReactNode } from 'react';
import { useMagnetic } from '@/hooks/useMagnetic';

interface MagneticProps {
  children: ReactNode;
  maxDistance?: number;
  className?: string;
}

export function Magnetic({ children, maxDistance = 10, className = '' }: MagneticProps) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic<HTMLDivElement>({ maxDistance });

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
