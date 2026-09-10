'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { playNodeTone, playHoverTick } from '@/lib/sound';
import { Zap, RotateCcw, Move, Eye } from 'lucide-react';

interface ConstellationNode {
  id: string;
  name: string;
  category: 'aiml' | 'frontend' | 'motion' | 'systems';
  tag: string;
  metadata: string;
  level: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  radius: number;
  connections: string[];
}

const CATEGORY_COLORS: Record<string, { main: string; glow: string; label: string }> = {
  aiml: { main: '#00F0FF', glow: 'rgba(0, 240, 255, 0.4)', label: 'AI / MACHINE LEARNING' },
  frontend: { main: '#FF007F', glow: 'rgba(255, 0, 127, 0.4)', label: 'FRONTEND ARCHITECTURE' },
  motion: { main: '#FFB703', glow: 'rgba(255, 183, 3, 0.4)', label: 'MOTION & KINETIC ENGINES' },
  systems: { main: '#C7FF4A', glow: 'rgba(199, 255, 74, 0.4)', label: 'SYSTEMS & CODEBASE' },
};

const NODES_DATA: Omit<ConstellationNode, 'x' | 'y' | 'vx' | 'vy' | 'homeX' | 'homeY' | 'radius'>[] = [
  // AI / ML Cluster
  { id: 'ai', name: 'Artificial Intelligence', category: 'aiml', tag: 'FOUNDATIONS', metadata: 'AGENTS / LLMS', level: 'ADVANCED', connections: ['ml', 'python', 'neural', 'frontend_dev'] },
  { id: 'ml', name: 'Machine Learning', category: 'aiml', tag: 'MODELS', metadata: 'TRAINING & INFERENCE', level: 'ADVANCED', connections: ['ai', 'python', 'neural'] },
  { id: 'python', name: 'Python', category: 'aiml', tag: 'CORE LANGUAGE', metadata: 'PYTORCH / NUMPY', level: 'EXPERT', connections: ['ai', 'ml', 'neural'] },
  { id: 'neural', name: 'Neural Networks', category: 'aiml', tag: 'DEEP LEARNING', metadata: 'CONV / ATTENTION', level: 'CORE FOCUS', connections: ['ai', 'ml', 'python'] },

  // Frontend Cluster
  { id: 'nextjs', name: 'Next.js', category: 'frontend', tag: 'FRAMEWORK', metadata: 'APP ROUTER / SSR', level: 'EXPERT', connections: ['react', 'typescript', 'tailwind', 'frontend_dev'] },
  { id: 'react', name: 'React', category: 'frontend', tag: 'CORE UI', metadata: 'CONCURRENT / HOOKS', level: 'EXPERT', connections: ['nextjs', 'typescript', 'tailwind'] },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', tag: 'TYPING ENGINE', metadata: 'STRICT / GENERICS', level: 'PROFICIENT', connections: ['nextjs', 'react', 'systems_dev'] },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', tag: 'DESIGN ENGINE', metadata: 'TOKENS / RESPONSIVE', level: 'EXPERT', connections: ['react', 'nextjs', 'animejs'] },
  { id: 'frontend_dev', name: 'Frontend Architecture', category: 'frontend', tag: 'EXPERIENCE', metadata: 'DESIGN SYSTEMS', level: 'EXPERT', connections: ['ai', 'nextjs', 'animejs'] },

  // Motion Cluster
  { id: 'animejs', name: 'Anime.js', category: 'motion', tag: 'ANIMATION ENGINE', metadata: 'TIMELINES / EASING', level: 'EXPERT', connections: ['tailwind', 'canvas', 'lenis'] },
  { id: 'lenis', name: 'Lenis Scroll', category: 'motion', tag: 'SCROLL INERTIA', metadata: 'SMOOTH PHYSICS', level: 'EXPERT', connections: ['animejs', 'frontend_dev'] },
  { id: 'canvas', name: 'Canvas 2D / WebGL', category: 'motion', tag: 'GRAPHICS ENGINE', metadata: 'PARTICLES / SHADERS', level: 'ADVANCED', connections: ['animejs', 'neural'] },

  // Systems Cluster
  { id: 'systems_dev', name: 'Git & Workflows', category: 'systems', tag: 'DEVOPS / CI', metadata: 'BRANCHING / REBASING', level: 'PROFICIENT', connections: ['typescript', 'python'] },
  { id: 'webaudio', name: 'Web Audio API', category: 'systems', tag: 'SOUND SYNTH', metadata: 'PROCEDURAL SYNTHESIS', level: 'EXPLORING', connections: ['canvas', 'react'] },
];

export function SkillConstellation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodesRef = useRef<ConstellationNode[]>([]);
  const animationFrameRef = useRef<number>(0);
  const draggedNodeRef = useRef<ConstellationNode | null>(null);
  const hoveredNodeRef = useRef<ConstellationNode | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNode, setActiveNode] = useState<ConstellationNode | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const initNodes = useCallback((width: number, height: number) => {
    const cx = width / 2;
    const cy = height / 2;

    // Cluster center coordinates
    const clusters: Record<string, { x: number; y: number }> = {
      aiml: { x: cx - width * 0.22, y: cy - height * 0.16 },
      frontend: { x: cx + width * 0.22, y: cy - height * 0.16 },
      motion: { x: cx - width * 0.18, y: cy + height * 0.2 },
      systems: { x: cx + width * 0.18, y: cy + height * 0.2 },
    };

    const nodes: ConstellationNode[] = NODES_DATA.map((data, index) => {
      const cluster = clusters[data.category] || { x: cx, y: cy };
      // Distribute nodes around their cluster center with some spread
      const angle = (index * (Math.PI * 2)) / 4 + (index % 3) * 0.8;
      const dist = 55 + (index % 3) * 40;
      const homeX = Math.max(70, Math.min(width - 70, cluster.x + Math.cos(angle) * dist));
      const homeY = Math.max(50, Math.min(height - 50, cluster.y + Math.sin(angle) * dist));

      return {
        ...data,
        x: homeX + (Math.random() - 0.5) * 20,
        y: homeY + (Math.random() - 0.5) * 20,
        vx: 0,
        vy: 0,
        homeX,
        homeY,
        radius: 8 + (data.connections.length > 3 ? 3 : 0),
      };
    });

    nodesRef.current = nodes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let width = container.clientWidth;
    let height = container.clientHeight || 560;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas || !container) return;
      width = container.clientWidth;
      height = Math.max(480, Math.min(620, window.innerHeight * 0.65));
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      initNodes(width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    // Energy packet propagation time counter
    let pulseT = 0;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      pulseT += 0.02;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Deep subtle neural grid lines
      ctx.strokeStyle = 'rgba(242, 240, 234, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const nodes = nodesRef.current;
      const dragged = draggedNodeRef.current;
      const hovered = hoveredNodeRef.current;

      // 1. Force Physics Calculation
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        if (n1 === dragged) continue;

        // Spring back to home position
        const dxHome = n1.homeX - n1.x;
        const dyHome = n1.homeY - n1.y;
        n1.vx += dxHome * 0.04;
        n1.vy += dyHome * 0.04;

        // Node repulsion
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.hypot(dx, dy) || 1;
          const minDist = n1.radius + n2.radius + 36;
          if (dist < minDist) {
            const force = (minDist - dist) / dist * 0.06;
            const fx = dx * force;
            const fy = dy * force;
            n1.vx -= fx;
            n1.vy -= fy;
            if (n2 !== dragged) {
              n2.vx += fx;
              n2.vy += fy;
            }
          }
        }

        // Damping
        n1.vx *= 0.85;
        n1.vy *= 0.85;

        // Apply position
        n1.x += n1.vx;
        n1.y += n1.vy;
      }

      // Dragged node locks to cursor
      if (dragged) {
        dragged.x += (mousePosRef.current.x - dragged.x) * 0.5;
        dragged.y += (mousePosRef.current.y - dragged.y) * 0.5;
      }

      // 2. Render Synaptic Edges / Attention Lines
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (const connId of n1.connections) {
          const n2 = nodes.find((n) => n.id === connId);
          if (!n2 || n2.id < n1.id) continue; // draw once per pair

          const isConnectedToHovered =
            hovered && (hovered.id === n1.id || hovered.id === n2.id);
          const isCategoryMatch =
            activeCategory === 'all' ||
            n1.category === activeCategory ||
            n2.category === activeCategory;

          const baseAlpha = isCategoryMatch ? 0.2 : 0.04;
          const strokeAlpha = isConnectedToHovered ? 0.85 : baseAlpha;

          const strokeColor = isConnectedToHovered
            ? (hovered?.category === 'aiml' ? '#00F0FF' : '#FF007F')
            : (n1.category === n2.category ? CATEGORY_COLORS[n1.category]?.main || '#8E8E8E' : 'rgba(242, 240, 234, 0.2)');

          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = strokeColor;
          ctx.globalAlpha = strokeAlpha;
          ctx.lineWidth = isConnectedToHovered ? 2 : 1;
          if (isConnectedToHovered) {
            ctx.shadowColor = strokeColor;
            ctx.shadowBlur = 10;
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;

          // Energy Packet Spark moving along the wire
          if (isCategoryMatch) {
            const edgeT = (pulseT + i * 0.3) % 1;
            const px = n1.x + (n2.x - n1.x) * edgeT;
            const py = n1.y + (n2.y - n1.y) * edgeT;

            ctx.beginPath();
            ctx.arc(px, py, isConnectedToHovered ? 2.5 : 1.5, 0, Math.PI * 2);
            ctx.fillStyle = isConnectedToHovered ? '#FFFFFF' : strokeColor;
            ctx.shadowColor = strokeColor;
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // 3. Render Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const isHovered = hovered?.id === node.id;
        const isConnectedToHovered =
          hovered && (hovered.id === node.id || hovered.connections.includes(node.id));
        const isCatMatch = activeCategory === 'all' || node.category === activeCategory;
        const catColor = CATEGORY_COLORS[node.category] || { main: '#00F0FF', glow: 'rgba(0, 240, 255, 0.4)' };

        const currentRadius = isHovered ? node.radius * 1.5 : (isConnectedToHovered ? node.radius * 1.2 : node.radius);
        const nodeAlpha = isCatMatch ? 1 : 0.25;

        ctx.globalAlpha = nodeAlpha;

        // Outer Halo / Pulse
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius + (isHovered ? 12 : 5), 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? catColor.glow : `${catColor.main}12`;
        ctx.fill();

        // Node Shell
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? catColor.main : '#0B0C10';
        ctx.strokeStyle = catColor.main;
        ctx.lineWidth = isHovered ? 2.5 : 1.5;
        if (isHovered || isConnectedToHovered) {
          ctx.shadowColor = catColor.main;
          ctx.shadowBlur = isHovered ? 20 : 10;
        }
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Core Spark
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? '#FFFFFF' : catColor.main;
        ctx.fill();

        // Label typography
        ctx.font = isHovered ? 'bold 11px monospace' : '10px monospace';
        ctx.fillStyle = isHovered ? '#FFFFFF' : (isConnectedToHovered ? '#F2F0EA' : '#8E8E8E');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.name, node.x, node.y + currentRadius + 6);

        ctx.globalAlpha = 1;
      }

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    // Event Handlers for Drag & Hover
    const getPos = (e: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const pos = getPos(e);
      mousePosRef.current = pos;

      if (draggedNodeRef.current) return;

      const nodes = nodesRef.current;
      let found: ConstellationNode | null = null;
      for (const node of nodes) {
        const d = Math.hypot(pos.x - node.x, pos.y - node.y);
        if (d < node.radius + 14) {
          found = node;
          break;
        }
      }

      if (found !== hoveredNodeRef.current) {
        hoveredNodeRef.current = found;
        setActiveNode(found);
        if (found) {
          playHoverTick();
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const pos = getPos(e);
      const nodes = nodesRef.current;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const d = Math.hypot(pos.x - node.x, pos.y - node.y);
        if (d < node.radius + 16) {
          draggedNodeRef.current = node;
          playNodeTone(i);
          break;
        }
      }
    };

    const handleMouseUp = () => {
      draggedNodeRef.current = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [initNodes, activeCategory]);

  const handleReset = () => {
    if (canvasRef.current) {
      initNodes(canvasRef.current.clientWidth, canvasRef.current.clientHeight || 560);
      playHoverTick();
    }
  };

  return (
    <div className="relative w-full rounded-2xl border border-[rgba(242,240,234,0.08)] bg-[#0B0C10]/80 backdrop-blur-xl overflow-hidden mb-12 shadow-2xl">
      {/* Top Cyber Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[rgba(242,240,234,0.06)] bg-[#07080B]/60">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00F0FF]" />
          </span>
          <span className="text-xs font-mono font-bold tracking-widest text-[#F2F0EA] uppercase">
            3D NEURAL SKILL GRAPH // VERLET FORCE PHYSICS
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono text-[#8E8E8E] px-2 py-0.5 rounded border border-[rgba(242,240,234,0.1)]">
            CLICK & DRAG TO SLING
          </span>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2">
          {['all', 'aiml', 'frontend', 'motion', 'systems'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                playHoverTick();
              }}
              className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50 shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                  : 'text-[#8E8E8E] hover:text-[#F2F0EA] border border-transparent'
              }`}
            >
              {cat === 'all' ? 'ALL NODES' : cat}
            </button>
          ))}

          <button
            onClick={handleReset}
            title="Reset Physics Equilibrium"
            className="p-1.5 rounded text-[#8E8E8E] hover:text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-colors border border-[rgba(242,240,234,0.1)] ml-2"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Physics Canvas Area */}
      <div ref={containerRef} className="relative w-full h-[520px] sm:h-[580px] cursor-grab active:cursor-grabbing">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* Floating Node Inspection HUD */}
        {activeNode && (
          <div className="absolute bottom-4 left-4 sm:left-6 max-w-sm p-4 rounded-xl bg-[#0E1017]/95 border border-[rgba(242,240,234,0.15)] shadow-2xl backdrop-blur-md pointer-events-none animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span
                className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded uppercase"
                style={{
                  color: CATEGORY_COLORS[activeNode.category]?.main,
                  backgroundColor: `${CATEGORY_COLORS[activeNode.category]?.main}15`,
                  border: `1px solid ${CATEGORY_COLORS[activeNode.category]?.main}40`,
                }}
              >
                {activeNode.tag}
              </span>
              <span className="text-[10px] font-mono text-[#C7FF4A] tracking-wider font-bold">
                {activeNode.level}
              </span>
            </div>
            <h4 className="text-base font-sans font-bold text-[#F2F0EA] uppercase tracking-tight mb-1">
              {activeNode.name}
            </h4>
            <p className="text-xs font-mono text-[#8E8E8E] mb-3">
              {activeNode.metadata}
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-[rgba(242,240,234,0.08)] text-[10px] font-mono text-[#8E8E8E]">
              <Zap size={11} className="text-[#00F0FF]" />
              <span>SYNAPTIC ATTENTION: {activeNode.connections.length} ACTIVE EDGES</span>
            </div>
          </div>
        )}

        {/* Bottom Help Legend */}
        <div className="absolute bottom-4 right-4 sm:right-6 hidden sm:flex items-center gap-4 text-[10px] font-mono text-[#8E8E8E] pointer-events-none bg-[#07080B]/70 px-3 py-1.5 rounded-lg border border-[rgba(242,240,234,0.08)]">
          <div className="flex items-center gap-1.5">
            <Move size={11} className="text-[#00F0FF]" />
            <span>GRAB & REPOSITION</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye size={11} className="text-[#FF007F]" />
            <span>HOVER TO TRACE SYNAPSE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
