'use client';

import React, { useRef, useEffect } from 'react';
import { getAudioAnalyser, isSoundEnabled } from '@/lib/sound';

interface AudioSpectrumVisualizerProps {
  className?: string;
}

export function AudioSpectrumVisualizer({ className = '' }: AudioSpectrumVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const barCount = 24;
    const freqData = new Uint8Array(32);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const analyser = getAudioAnalyser();
      const soundOn = isSoundEnabled();

      if (analyser && soundOn) {
        analyser.getByteFrequencyData(freqData);
      }

      const barWidth = (width - (barCount - 1) * 2) / barCount;

      for (let i = 0; i < barCount; i++) {
        let value = 0;
        if (analyser && soundOn) {
          value = freqData[i] / 255;
        } else {
          // Subtle idle ambient ripple
          value = 0.08 + Math.sin(Date.now() * 0.003 + i * 0.4) * 0.05;
        }

        const barHeight = Math.max(2, value * height);
        const x = i * (barWidth + 2);
        const y = height - barHeight;

        // Gradient from cyan base to neon lime peak
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
        grad.addColorStop(0.7, 'rgba(199, 255, 74, 0.85)');
        grad.addColorStop(1, '#FFFFFF');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <canvas
        ref={canvasRef}
        width={96}
        height={18}
        className="rounded-[2px] bg-[rgba(10,12,18,0.7)] border border-[rgba(242,240,234,0.08)]"
      />
    </div>
  );
}
