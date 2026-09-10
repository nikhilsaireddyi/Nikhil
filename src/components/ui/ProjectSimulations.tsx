'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { playHoverTick, playNodeTone } from '@/lib/sound';
import { Sliders, Plus, RotateCcw, Zap } from 'lucide-react';

interface ProjectSimulationsProps {
  projectIndex: number;
  primaryColor: string;
  secondaryColor: string;
}

export function ProjectSimulations({
  projectIndex,
  primaryColor,
  secondaryColor,
}: ProjectSimulationsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Playground interactive state
  // Slot 0 (ML Optimization)
  const [learningRate, setLearningRate] = useState<number>(0.025);
  const [optimizer, setOptimizer] = useState<'AdamW' | 'SGD' | 'Momentum'>('AdamW');
  const lrRef = useRef(learningRate);
  const optRef = useRef(optimizer);

  useEffect(() => {
    lrRef.current = learningRate;
  }, [learningRate]);

  useEffect(() => {
    optRef.current = optimizer;
  }, [optimizer]);

  // Slot 1 (Computer Vision)
  const cvObjectsRef = useRef<Array<{
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    w: number;
    h: number;
    label: string;
    conf: number;
  }>>([
    { id: 'CAR_01', x: 40, y: 50, vx: 1.2, vy: 0.6, w: 75, h: 45, label: 'VEHICLE', conf: 0.984 },
    { id: 'PED_09', x: 180, y: 120, vx: -0.8, vy: 0.4, w: 32, h: 60, label: 'PEDESTRIAN', conf: 0.941 },
    { id: 'SIG_04', x: 260, y: 35, vx: 0.1, vy: -0.1, w: 28, h: 42, label: 'LIGHT_GREEN', conf: 0.995 },
  ]);

  // Slot 2 (A* Pathfinder)
  const gridCols = 14;
  const gridRows = 9;
  const [customObstacles, setCustomObstacles] = useState<string[]>([
    '3,2', '3,3', '3,4', '3,5', '3,6',
    '7,3', '7,4', '7,5', '7,6', '7,7',
    '10,1', '10,2', '10,3', '10,4', '10,5',
  ]);
  const obstaclesRef = useRef(customObstacles);

  useEffect(() => {
    obstaclesRef.current = customObstacles;
  }, [customObstacles]);

  // BFS/A* dynamic path recalculator
  const computePath = useCallback((obstacles: string[]) => {
    const obsSet = new Set(obstacles);
    const start = { c: 0, r: 4 };
    const goal = { c: gridCols - 1, r: 4 };

    const queue: Array<{ c: number; r: number; path: Array<{ c: number; r: number }> }> = [
      { c: start.c, r: start.r, path: [start] },
    ];
    const visited = new Set<string>();
    visited.add(`${start.c},${start.r}`);

    const directions = [
      { dc: 1, dr: 0 },
      { dc: 0, dr: 1 },
      { dc: 0, dr: -1 },
      { dc: -1, dr: 0 },
    ];

    while (queue.length > 0) {
      const { c, r, path } = queue.shift()!;
      if (c === goal.c && r === goal.r) {
        return path;
      }

      for (const { dc, dr } of directions) {
        const nc = c + dc;
        const nr = r + dr;
        const key = `${nc},${nr}`;

        if (nc >= 0 && nc < gridCols && nr >= 0 && nr < gridRows && !obsSet.has(key) && !visited.has(key)) {
          visited.add(key);
          queue.push({ c: nc, r: nr, path: [...path, { c: nc, r: nr }] });
        }
      }
    }
    // Fallback if blocked
    return [{ c: 0, r: 4 }, { c: gridCols - 1, r: 4 }];
  }, []);

  const pathRef = useRef(computePath(customObstacles));
  useEffect(() => {
    pathRef.current = computePath(customObstacles);
  }, [customObstacles, computePath]);

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
    let pathStep = 0;

    // Gradient descent particles
    const gdParticles = Array.from({ length: 22 }, () => ({
      x: (Math.random() - 0.5) * 180,
      y: (Math.random() - 0.5) * 180,
      vx: 0,
      vy: 0,
      trail: [] as { x: number; y: number }[],
    }));

    const render = () => {
      frame++;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Deep dark background
      ctx.fillStyle = '#06070B';
      ctx.fillRect(0, 0, width, height);

      if (projectIndex === 0) {
        // ==========================================
        // SIMULATION 0: 3D GRADIENT DESCENT LOSS VALLEY
        // ==========================================
        const cx = width * 0.48;
        const cy = height * 0.54;
        const lr = lrRef.current;
        const opt = optRef.current;

        // Draw 3D Loss Contour Rings
        const ringCount = 10;
        for (let r = 1; r <= ringCount; r++) {
          const radiusX = r * 15 + Math.sin(frame * 0.02 + r) * 2;
          const radiusY = r * 9;
          ctx.beginPath();
          ctx.ellipse(cx, cy + (ringCount - r) * 2.5, radiusX, radiusY, 0, 0, Math.PI * 2);
          ctx.strokeStyle = primaryColor;
          ctx.globalAlpha = 0.08 + (r / ringCount) * 0.16;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Cross-axis gradient vectors
        ctx.strokeStyle = primaryColor;
        ctx.globalAlpha = 0.12;
        ctx.beginPath();
        ctx.moveTo(cx - 150, cy);
        ctx.lineTo(cx + 150, cy);
        ctx.moveTo(cx, cy - 90);
        ctx.lineTo(cx + 90, cy);
        ctx.stroke();

        // Global minimum attractor target
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 6 + Math.sin(frame * 0.08) * 2, 0, Math.PI * 2);
        ctx.fillStyle = primaryColor;
        ctx.shadowColor = primaryColor;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Dynamic gradient particles with active Optimizer physics
        gdParticles.forEach((p, idx) => {
          // Negative gradient: vector towards (0, 0)
          const gradX = -p.x * lr * 2.2;
          const gradY = -p.y * lr * 2.2;

          if (opt === 'AdamW') {
            p.vx = p.vx * 0.82 + gradX * 0.18;
            p.vy = p.vy * 0.82 + gradY * 0.18;
          } else if (opt === 'Momentum') {
            p.vx = p.vx * 0.94 + gradX * 0.12;
            p.vy = p.vy * 0.94 + gradY * 0.12;
          } else {
            // SGD
            p.vx = gradX;
            p.vy = gradY;
          }

          p.x += p.vx;
          p.y += p.vy;

          // Add to trail
          p.trail.push({ x: cx + p.x, y: cy + p.y * 0.6 });
          if (p.trail.length > 14) p.trail.shift();

          // Reset when reached bottom or strayed too far
          if (Math.hypot(p.x, p.y) < 5 || Math.hypot(p.x, p.y) > 220) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 95 + Math.random() * 70;
            p.x = Math.cos(angle) * dist;
            p.y = Math.sin(angle) * dist;
            p.vx = 0;
            p.vy = 0;
            p.trail = [];
          }

          // Render Trail
          if (p.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let t = 1; t < p.trail.length; t++) {
              ctx.lineTo(p.trail[t].x, p.trail[t].y);
            }
            ctx.strokeStyle = idx % 2 === 0 ? primaryColor : secondaryColor;
            ctx.globalAlpha = 0.45;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // Particle Head
          const headX = cx + p.x;
          const headY = cy + p.y * 0.6;
          ctx.beginPath();
          ctx.arc(headX, headY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = primaryColor;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        });

        // Real-time Loss Decay HUD
        ctx.font = '9px monospace';
        ctx.fillStyle = primaryColor;
        ctx.fillText(`OPTIMIZER: ${opt} // LR: ${lr.toFixed(3)} // LOSS: ${(0.012 / (lr * 40)).toFixed(4)}`, 14, 20);
        ctx.fillStyle = '#8E8E8E';
        ctx.fillText('LIVE TENSOR INFERENCE // PARTICLE LOSS ATTRACTION', 14, 32);

      } else if (projectIndex === 1) {
        // ==========================================
        // SIMULATION 1: YOLOv8 COMPUTER VISION TRACKER
        // ==========================================
        // Grid background dots
        ctx.strokeStyle = 'rgba(255, 0, 127, 0.08)';
        ctx.lineWidth = 1;
        const step = 28;
        for (let x = 0; x < width; x += step) {
          for (let y = 0; y < height; y += step) {
            ctx.beginPath();
            ctx.arc(x, y, 0.8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 0, 127, 0.15)';
            ctx.fill();
          }
        }

        // Center reticle
        const cx = width / 2;
        const cy = height / 2;
        ctx.strokeStyle = 'rgba(242, 240, 234, 0.12)';
        ctx.beginPath();
        ctx.arc(cx, cy, 26, 0, Math.PI * 2);
        ctx.moveTo(cx - 32, cy);
        ctx.lineTo(cx + 32, cy);
        ctx.moveTo(cx, cy - 32);
        ctx.lineTo(cx, cy + 32);
        ctx.stroke();

        // Animate CV Objects
        cvObjectsRef.current.forEach((obj) => {
          obj.x += obj.vx;
          obj.y += obj.vy;

          if (obj.x < 10 || obj.x + obj.w > width - 10) obj.vx *= -1;
          if (obj.y < 35 || obj.y + obj.h > height - 20) obj.vy *= -1;

          const cornerLen = 10;
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 2;
          ctx.shadowColor = primaryColor;
          ctx.shadowBlur = 8;

          // Corner brackets
          ctx.beginPath();
          ctx.moveTo(obj.x, obj.y + cornerLen);
          ctx.lineTo(obj.x, obj.y);
          ctx.lineTo(obj.x + cornerLen, obj.y);
          ctx.moveTo(obj.x + obj.w - cornerLen, obj.y);
          ctx.lineTo(obj.x + obj.w, obj.y);
          ctx.lineTo(obj.x + obj.w, obj.y + cornerLen);
          ctx.moveTo(obj.x, obj.y + obj.h - cornerLen);
          ctx.lineTo(obj.x, obj.y + obj.h);
          ctx.lineTo(obj.x + cornerLen, obj.y + obj.h);
          ctx.moveTo(obj.x + obj.w - cornerLen, obj.y + obj.h);
          ctx.lineTo(obj.x + obj.w, obj.y + obj.h);
          ctx.lineTo(obj.x + obj.w, obj.y + obj.h - cornerLen);
          ctx.stroke();
          ctx.shadowBlur = 0;

          ctx.fillStyle = `${primaryColor}12`;
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);

          // Velocity arrow
          ctx.beginPath();
          ctx.moveTo(obj.x + obj.w / 2, obj.y + obj.h / 2);
          ctx.lineTo(obj.x + obj.w / 2 + obj.vx * 14, obj.y + obj.h / 2 + obj.vy * 14);
          ctx.strokeStyle = secondaryColor;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Label Banner
          ctx.fillStyle = primaryColor;
          ctx.fillRect(obj.x, obj.y - 14, obj.w, 13);
          ctx.font = 'bold 8px monospace';
          ctx.fillStyle = '#07070B';
          ctx.fillText(`${obj.label} ${(obj.conf * 100).toFixed(1)}%`, obj.x + 3, obj.y - 4);
        });

        // Top Status HUD
        ctx.font = '9px monospace';
        ctx.fillStyle = primaryColor;
        ctx.fillText(`YOLOv8 // TRACKED OBJECTS: ${cvObjectsRef.current.length} // LATENCY: 3.4ms`, 14, 20);
        ctx.fillStyle = '#8E8E8E';
        ctx.fillText('CLICK ANYWHERE TO SPAWN NEW DETECTED TARGETS', 14, 32);

      } else {
        // ==========================================
        // SIMULATION 2: A* ECO-ROUTE PATHFINDER
        // ==========================================
        const cellW = (width - 40) / gridCols;
        const cellH = (height - 50) / gridRows;
        const startX = 20;
        const startY = 32;

        const currentPath = pathRef.current;
        const obsSet = new Set(obstaclesRef.current);

        if (frame % 7 === 0 && currentPath.length > 0) {
          pathStep = (pathStep + 1) % currentPath.length;
        }

        // Render Grid Cells
        for (let r = 0; r < gridRows; r++) {
          for (let c = 0; c < gridCols; c++) {
            const x = startX + c * cellW;
            const y = startY + r * cellH;
            const key = `${c},${r}`;

            if (obsSet.has(key)) {
              ctx.fillStyle = 'rgba(255, 0, 127, 0.3)';
              ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
              ctx.strokeStyle = '#FF007F';
              ctx.lineWidth = 1;
              ctx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2);
            } else {
              ctx.strokeStyle = 'rgba(242, 240, 234, 0.05)';
              ctx.strokeRect(x, y, cellW, cellH);
            }
          }
        }

        // Render Explored Path Wavefront
        for (let i = 0; i <= pathStep && i < currentPath.length; i++) {
          const pt = currentPath[i];
          const px = startX + pt.c * cellW;
          const py = startY + pt.r * cellH;
          ctx.fillStyle = `${primaryColor}22`;
          ctx.fillRect(px + 1, py + 1, cellW - 2, cellH - 2);
        }

        // Render Optimal Laser Path Line
        if (currentPath.length > 1) {
          ctx.beginPath();
          ctx.moveTo(startX + currentPath[0].c * cellW + cellW / 2, startY + currentPath[0].r * cellH + cellH / 2);
          for (let i = 1; i <= pathStep && i < currentPath.length; i++) {
            const pt = currentPath[i];
            ctx.lineTo(startX + pt.c * cellW + cellW / 2, startY + pt.r * cellH + cellH / 2);
          }
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 2.5;
          ctx.shadowColor = primaryColor;
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Current Travelling Robot / Packet
        const currentPt = currentPath[pathStep] || currentPath[0];
        if (currentPt) {
          const rx = startX + currentPt.c * cellW + cellW / 2;
          const ry = startY + currentPt.r * cellH + cellH / 2;
          ctx.beginPath();
          ctx.arc(rx, ry, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = primaryColor;
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Start & End markers
        const startPt = currentPath[0] || { c: 0, r: 4 };
        const endPt = currentPath[currentPath.length - 1] || { c: 13, r: 4 };
        ctx.font = 'bold 8px monospace';
        ctx.fillStyle = '#C7FF4A';
        ctx.fillText('START', startX + startPt.c * cellW + 2, startY + startPt.r * cellH + 10);
        ctx.fillStyle = primaryColor;
        ctx.fillText('TARGET', startX + endPt.c * cellW - 8, startY + endPt.r * cellH + 10);

        // Top Status HUD
        ctx.font = '9px monospace';
        ctx.fillStyle = primaryColor;
        ctx.fillText(`A* TOPOLOGY // OPTIMAL ROUTE: ${currentPath.length} NODES // OBSTACLES: ${obsSet.size}`, 14, 18);
        ctx.fillStyle = '#8E8E8E';
        ctx.fillText('CLICK ANY GRID CELL TO PLACE OR REMOVE OBSTACLE WALLS', 14, 28);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [projectIndex, primaryColor, secondaryColor]);

  // Click on canvas handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (projectIndex === 1) {
      // Spawn new CV object
      playNodeTone(cvObjectsRef.current.length);
      const labels = ['BICYCLE', 'TRAFFIC_CONE', 'SPEED_LIMIT', 'VEHICLE_SUV'];
      const randomLabel = labels[Math.floor(Math.random() * labels.length)];
      cvObjectsRef.current.push({
        id: `OBJ_${cvObjectsRef.current.length + 1}`,
        x: Math.max(10, Math.min(rect.width - 60, clickX - 25)),
        y: Math.max(35, Math.min(rect.height - 40, clickY - 20)),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        w: 55 + Math.random() * 20,
        h: 38 + Math.random() * 15,
        label: randomLabel,
        conf: 0.92 + Math.random() * 0.07,
      });
    } else if (projectIndex === 2) {
      // Toggle A* obstacle cell
      const startX = 20;
      const startY = 32;
      const cellW = (rect.width - 40) / gridCols;
      const cellH = (rect.height - 50) / gridRows;

      const c = Math.floor((clickX - startX) / cellW);
      const r = Math.floor((clickY - startY) / cellH);

      if (c >= 0 && c < gridCols && r >= 0 && r < gridRows) {
        // Don't block exact start or target
        if ((c === 0 && r === 4) || (c === gridCols - 1 && r === 4)) return;

        playHoverTick();
        const key = `${c},${r}`;
        setCustomObstacles((prev) =>
          prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[290px] overflow-hidden rounded-xl flex flex-col justify-between">
      {/* Interactive Controls Header Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#090B12]/90 border-b border-[rgba(242,240,234,0.1)] backdrop-blur-md text-[10px] font-mono">
        {projectIndex === 0 && (
          <div className="flex flex-wrap items-center gap-3 w-full justify-between">
            {/* Optimizer Switcher */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#8E8E8E]">OPTIMIZER:</span>
              {(['AdamW', 'SGD', 'Momentum'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    playHoverTick();
                    setOptimizer(opt);
                  }}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    optimizer === opt
                      ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/60 font-bold'
                      : 'text-[#8E8E8E] hover:text-[#F2F0EA] border border-transparent'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Learning Rate Slider */}
            <div className="flex items-center gap-2">
              <Sliders size={11} className="text-[#00F0FF]" />
              <span className="text-[#8E8E8E]">LR: {learningRate.toFixed(3)}</span>
              <input
                type="range"
                min="0.005"
                max="0.06"
                step="0.005"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-16 accent-[#00F0FF] cursor-pointer"
              />
            </div>
          </div>
        )}

        {projectIndex === 1 && (
          <div className="flex items-center justify-between w-full">
            <span className="text-[#FF007F] font-bold flex items-center gap-1.5">
              <Zap size={11} />
              <span>YOLOv8 INTERACTIVE TARGET SCANNER</span>
            </span>
            <button
              onClick={() => {
                playHoverTick();
                cvObjectsRef.current = [
                  { id: 'CAR_01', x: 40, y: 50, vx: 1.2, vy: 0.6, w: 75, h: 45, label: 'VEHICLE', conf: 0.984 },
                  { id: 'PED_09', x: 180, y: 120, vx: -0.8, vy: 0.4, w: 32, h: 60, label: 'PEDESTRIAN', conf: 0.941 },
                ];
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded border border-[rgba(242,240,234,0.15)] text-[#8E8E8E] hover:text-[#F2F0EA]"
            >
              <RotateCcw size={10} />
              <span>RESET</span>
            </button>
          </div>
        )}

        {projectIndex === 2 && (
          <div className="flex items-center justify-between w-full">
            <span className="text-[#C7FF4A] font-bold flex items-center gap-1.5">
              <Plus size={11} />
              <span>CLICK GRID TO TOGGLE OBSTACLES</span>
            </span>
            <button
              onClick={() => {
                playHoverTick();
                setCustomObstacles(['3,3', '3,4', '3,5', '7,4', '7,5', '10,3', '10,4']);
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded border border-[rgba(242,240,234,0.15)] text-[#8E8E8E] hover:text-[#F2F0EA]"
            >
              <RotateCcw size={10} />
              <span>RESET MAZE</span>
            </button>
          </div>
        )}
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
