'use client';

import React, { useRef, useEffect } from 'react';
import { playNodeTone } from '@/lib/sound';
import { Gamepad2, ExternalLink } from 'lucide-react';

interface ProjectSimulationsProps {
  projectIndex?: number;
  primaryColor: string;
  secondaryColor: string;
}

export function ProjectSimulations({
  primaryColor: _primaryColor,
  secondaryColor: _secondaryColor,
}: ProjectSimulationsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Ganesh: The Quest Interactive Spark Particle Physics
  const festivalSparksRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas || !container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    window.addEventListener('resize', resize);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // 1. Twilight Festival Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#120924');
      skyGrad.addColorStop(0.45, '#35123D');
      skyGrad.addColorStop(0.75, '#B43E12');
      skyGrad.addColorStop(1, '#FF7A00');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Parallax Distant Stars
      for (let s = 0; s < 14; s++) {
        const sx = (s * (width / 13) + Math.sin(frame * 0.01 + s) * 8) % width;
        const sy = 20 + (s * 17) % 55;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 236, 179, 0.75)';
        ctx.fill();
      }

      // Swaying Marigold & Light Strings (Toran)
      ctx.strokeStyle = 'rgba(255, 179, 0, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 20);
      for (let x = 0; x <= width; x += 40) {
        const sag = Math.sin((x / 40) * Math.PI) * 10;
        ctx.quadraticCurveTo(x + 20, 20 + sag, x + 40, 20);
      }
      ctx.stroke();

      // 3. Akash Kandil Glowing Paper Lanterns
      for (let l = 0; l < 5; l++) {
        const lx = 40 + l * ((width - 80) / 4) + Math.sin(frame * 0.03 + l) * 5;
        const ly = 30 + Math.cos(frame * 0.02 + l) * 3;
        // Glow Halo
        ctx.beginPath();
        ctx.arc(lx, ly + 8, 14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 193, 7, 0.18)';
        ctx.fill();
        // Lantern Body
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx - 6, ly + 8);
        ctx.lineTo(lx, ly + 16);
        ctx.lineTo(lx + 6, ly + 8);
        ctx.closePath();
        ctx.fillStyle = l % 2 === 0 ? '#FF5722' : '#FFC107';
        ctx.fill();
        ctx.strokeStyle = '#FFE082';
        ctx.lineWidth = 1;
        ctx.stroke();
        // Hanging Tassels
        ctx.beginPath();
        ctx.moveTo(lx, ly + 16);
        ctx.lineTo(lx + Math.sin(frame * 0.05 + l) * 3, ly + 24);
        ctx.strokeStyle = '#FFE082';
        ctx.stroke();
      }

      // 4. Mandapam Arch & Ganesha Aura
      const groundY = height * 0.72;
      const archW = 104;
      const archX = width * 0.5 - archW / 2;
      ctx.fillStyle = 'rgba(18, 10, 32, 0.88)';
      ctx.fillRect(archX, groundY - 70, 14, 70);
      ctx.fillRect(archX + archW - 14, groundY - 70, 14, 70);
      ctx.beginPath();
      ctx.moveTo(archX - 6, groundY - 70);
      ctx.lineTo(archX + archW / 2, groundY - 95);
      ctx.lineTo(archX + archW + 6, groundY - 70);
      ctx.closePath();
      ctx.fillStyle = '#FFA000';
      ctx.fill();

      // Ganesha Idol Aura in Mandapam
      ctx.beginPath();
      ctx.arc(archX + archW / 2, groundY - 45, 22, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 215, 0, 0.35)';
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 5. Cobblestone Ground & Rangoli Floor Pattern
      ctx.fillStyle = '#1D1322';
      ctx.fillRect(0, groundY, width, height - groundY);
      ctx.strokeStyle = 'rgba(255, 143, 0, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Rangoli Circular Mandala Motif
      ctx.beginPath();
      ctx.arc(width * 0.5, groundY + 22, 18, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 6. Running Player Hero with 60 FPS Animation
      const runnerSpeed = 1.8;
      const runnerX = ((frame * runnerSpeed) % (width + 80)) - 40;
      const bounce = Math.abs(Math.sin(frame * 0.2)) * 6;
      const py = groundY - 24 - bounce;

      // Runner Aura
      ctx.beginPath();
      ctx.arc(runnerX, py + 12, 12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 143, 0, 0.28)';
      ctx.fill();

      // Stylized Runner Sprite
      ctx.beginPath();
      ctx.arc(runnerX, py + 4, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFCC80';
      ctx.fill();
      ctx.fillStyle = '#FF3D00';
      ctx.fillRect(runnerX - 3, py + 9, 7, 10);
      const legPhase = Math.sin(frame * 0.25);
      ctx.strokeStyle = '#FFE082';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(runnerX - 1, py + 19);
      ctx.lineTo(runnerX - 1 + legPhase * 8, groundY);
      ctx.moveTo(runnerX + 2, py + 19);
      ctx.lineTo(runnerX + 2 - legPhase * 8, groundY);
      ctx.stroke();

      // Floating Collectible Modaks (Sweets)
      for (let m = 0; m < 4; m++) {
        const mx = 60 + m * ((width - 120) / 3);
        const my = groundY - 28 + Math.sin(frame * 0.08 + m) * 4;
        ctx.beginPath();
        ctx.moveTo(mx, my - 6);
        ctx.lineTo(mx - 4, my + 4);
        ctx.lineTo(mx + 4, my + 4);
        ctx.closePath();
        ctx.fillStyle = '#FFD54F';
        ctx.shadowColor = '#FFD54F';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 7. Interactive Festival Spark Particle Physics
      const sparks = festivalSparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.08;
        sp.life -= 0.02;

        if (sp.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.life;
        ctx.shadowColor = sp.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      // Top Status HUD
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#FFD54F';
      ctx.fillText('GANESH: THE QUEST // 2.5D FESTIVAL ENGINE // 60 FPS', 14, 20);
      ctx.fillStyle = '#F2F0EA';
      ctx.fillText('QUEST: REACH GRAND MANDAPAM ✦ CLICK CANVAS TO BURST SPARKS', 14, 32);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Click on canvas handler - celebratory firework sparks
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    playNodeTone(4);
    const colors = ['#FFD700', '#FF9100', '#FF3D00', '#FFEB3B', '#FF4081', '#FFFFFF'];
    for (let i = 0; i < 26; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 4.0;
      festivalSparksRef.current.push({
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        life: 1.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2.2 + Math.random() * 2.5,
      });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[290px] overflow-hidden rounded-xl flex flex-col justify-between">
      {/* Interactive Controls Header Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#090B12]/90 border-b border-[rgba(242,240,234,0.1)] backdrop-blur-md text-[10px] font-mono">
        <div className="flex items-center justify-between w-full">
          <span className="text-[#FF8F00] font-bold flex items-center gap-1.5">
            <Gamepad2 size={13} />
            <span>GANESH: THE QUEST // FESTIVAL GAME ENGINE</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[#FFD700] text-[9px] hidden sm:inline">✦ CLICK CANVAS FOR SPARKS</span>
            <a
              href="https://ganesh-the-quest-game.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#FF8F00] text-[#07080B] font-bold hover:bg-[#FFA000] transition-transform hover:scale-105 shadow-[0_0_12px_rgba(255,143,0,0.4)]"
            >
              <span>PLAY LIVE GAME</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Canvas with Click-to-Interact */}
      <div className="relative flex-1 w-full h-full cursor-crosshair">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="absolute inset-0 w-full h-full block"
        />
      </div>
    </div>
  );
}
