'use client';

import React, { useEffect, useState } from 'react';
import { X, Printer, Copy, Check, ExternalLink, GraduationCap, Code2, Briefcase } from 'lucide-react';
import { playHoverTick, playSynapticPulse } from '@/lib/sound';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    playHoverTick();
    const resumeText = `NIKHIL SAI REDDY — AI/ML & FRONTEND DEVELOPER
Student @ Nxt Wave of Innovation in Advanced Technology, Visakhapatnam, India
Email: nikhilsaireddy@gmail.com | Location: Vizag, India

CORE TECHNICAL EXPERTISE:
• AI & Machine Learning: Python, PyTorch, YOLOv8, Computer Vision, Deep Learning, NumPy
• Frontend Development: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
• Motion & Systems: Anime.js, WebGL/Canvas, Web Audio API, Lenis Scroll Physics

SELECTED PROJECTS:
1. Real-Time Automotive Telemetry Pipeline (Python, Next.js, WebSockets, Three.js)
2. Neural Vision Inference HUD (YOLOv8, PyTorch, WebGL, Tailwind CSS)
3. Eco-Route Topology Pathfinder (TypeScript, A* Algorithm, Next.js, Canvas)`;

    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    playSynapticPulse();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#090B10] border border-[rgba(0,240,255,0.3)] shadow-[0_20px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(0,240,255,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(242,240,234,0.1)] bg-[#0C0E17]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#F2F0EA]">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
            <span className="font-bold text-[#00F0FF]">CURRICULUM VITAE</span>
            <span className="text-[#8E8E8E] hidden sm:inline">{'// ARCHITECTURAL DOSSIER (2026)'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              onMouseEnter={playHoverTick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-[rgba(242,240,234,0.1)] text-xs font-mono text-[#F2F0EA] hover:bg-[#00F0FF]/15 hover:text-[#00F0FF] transition-colors"
              title="Copy Summary"
            >
              {copied ? <Check size={13} className="text-[#C7FF4A]" /> : <Copy size={13} />}
              <span className="hidden sm:inline">{copied ? 'COPIED' : 'COPY'}</span>
            </button>

            <button
              onClick={handlePrint}
              onMouseEnter={playHoverTick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00F0FF]/15 border border-[#00F0FF]/50 text-xs font-mono text-[#00F0FF] hover:bg-[#00F0FF] hover:text-[#07070B] font-bold transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              title="Print or Save as PDF"
            >
              <Printer size={13} />
              <span className="hidden sm:inline">PRINT / PDF</span>
            </button>

            <button
              onClick={onClose}
              onMouseEnter={playHoverTick}
              className="p-1.5 rounded-lg text-[#8E8E8E] hover:text-[#FF007F] hover:bg-white/5 transition-colors ml-2"
              aria-label="Close CV Modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable CV Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 text-[#F2F0EA] font-sans">
          {/* Identity Header */}
          <div className="border-b border-[rgba(242,240,234,0.1)] pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F2F0EA] uppercase">
                Nikhil Sai Reddy
              </h2>
              <div className="text-sm font-mono text-[#00F0FF] tracking-wider mt-1 font-bold">
                AI / MACHINE LEARNING & FRONTEND ARCHITECT
              </div>
            </div>

            <div className="text-xs font-mono text-[#8E8E8E] space-y-1 sm:text-right">
              <div>LOCATION: VISAKHAPATNAM, INDIA</div>
              <div>EMAIL: nikhilsaireddy@gmail.com</div>
              <div className="text-[#C7FF4A] font-bold">AVAILABLE FOR OPPORTUNITIES</div>
            </div>
          </div>

          {/* Academic Affiliation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#00F0FF] uppercase">
              <GraduationCap size={15} />
              <span>EDUCATION & FOUNDATIONS</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0E101A] border border-[rgba(242,240,234,0.08)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <h4 className="text-base font-bold text-[#F2F0EA]">
                  Nxt Wave of Innovation in Advanced Technology
                </h4>
                <span className="text-xs font-mono text-[#C7FF4A] font-bold">ENROLLED // VISAKHAPATNAM</span>
              </div>
              <p className="text-xs font-mono text-[#8E8E8E] leading-relaxed">
                Specialized coursework in Computer Science, Artificial Intelligence foundations, Machine Learning mathematical modeling, and enterprise Frontend System Engineering.
              </p>
            </div>
          </div>

          {/* Technical Skills Matrix */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#FF007F] uppercase">
              <Code2 size={15} />
              <span>CORE TECHNICAL COMPETENCIES</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-[#0E101A] border border-[rgba(242,240,234,0.08)]">
                <div className="text-xs font-mono font-bold text-[#00F0FF] mb-2">[AI / ML SYSTEMS]</div>
                <ul className="text-xs font-mono text-[#8E8E8E] space-y-1">
                  <li>• Python (NumPy, Pandas)</li>
                  <li>• PyTorch & Deep Learning</li>
                  <li>• YOLOv8 Computer Vision</li>
                  <li>• Gradient Descent & Optimizers</li>
                  <li>• Convolutional Neural Networks</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#0E101A] border border-[rgba(242,240,234,0.08)]">
                <div className="text-xs font-mono font-bold text-[#FF007F] mb-2">[FRONTEND CRAFT]</div>
                <ul className="text-xs font-mono text-[#8E8E8E] space-y-1">
                  <li>• Next.js 16 (App Router)</li>
                  <li>• React 19 & Concurrent Hooks</li>
                  <li>• TypeScript (Strict Typing)</li>
                  <li>• Tailwind CSS & Token Architecture</li>
                  <li>• Responsive Multi-Device UX</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#0E101A] border border-[rgba(242,240,234,0.08)]">
                <div className="text-xs font-mono font-bold text-[#C7FF4A] mb-2">[GRAPHICS & SYSTEMS]</div>
                <ul className="text-xs font-mono text-[#8E8E8E] space-y-1">
                  <li>• Anime.js Kinetic Engine</li>
                  <li>• Canvas 2D & WebGL Shaders</li>
                  <li>• Lenis Scroll Physics</li>
                  <li>• Web Audio API Synthesizers</li>
                  <li>• Git, GitHub, Linux Shell</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Key Featured Engineering Workspaces */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#C7FF4A] uppercase">
              <Briefcase size={15} />
              <span>FEATURED WORKSPACES & IMPLEMENTATIONS</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#0E101A] border border-[rgba(242,240,234,0.08)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h4 className="text-sm font-bold text-[#F2F0EA] uppercase">
                    01. Real-Time Automotive Telemetry Pipeline
                  </h4>
                  <span className="text-[10px] font-mono text-[#00F0FF]">AI/ML & IOT STREAMS</span>
                </div>
                <p className="text-xs font-mono text-[#8E8E8E] leading-relaxed mb-2">
                  High-frequency data ingestion pipeline parsing CAN bus telemetry and simulated vehicle performance indicators with real-time 3D dashboard visualizers.
                </p>
                <div className="flex flex-wrap gap-1.5 text-[9px] font-mono text-[#00F0FF]">
                  <span className="px-2 py-0.5 rounded bg-white/5">Python</span>
                  <span className="px-2 py-0.5 rounded bg-white/5">Next.js</span>
                  <span className="px-2 py-0.5 rounded bg-white/5">WebSockets</span>
                  <span className="px-2 py-0.5 rounded bg-white/5">Three.js</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0E101A] border border-[rgba(242,240,234,0.08)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h4 className="text-sm font-bold text-[#F2F0EA] uppercase">
                    02. Neural Vision Inference HUD
                  </h4>
                  <span className="text-[10px] font-mono text-[#FF007F]">COMPUTER VISION</span>
                </div>
                <p className="text-xs font-mono text-[#8E8E8E] leading-relaxed mb-2">
                  Real-time optical object detection and tracking reticle overlay capable of bounding box classification, optical flow direction, and velocity tracking at 120 FPS.
                </p>
                <div className="flex flex-wrap gap-1.5 text-[9px] font-mono text-[#FF007F]">
                  <span className="px-2 py-0.5 rounded bg-white/5">YOLOv8</span>
                  <span className="px-2 py-0.5 rounded bg-white/5">PyTorch</span>
                  <span className="px-2 py-0.5 rounded bg-white/5">WebGL</span>
                  <span className="px-2 py-0.5 rounded bg-white/5">Tailwind CSS</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0E101A] border border-[rgba(242,240,234,0.08)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h4 className="text-sm font-bold text-[#F2F0EA] uppercase">
                    03. Eco-Route Topology Pathfinder
                  </h4>
                  <span className="text-[10px] font-mono text-[#C7FF4A]">GRAPH ALGORITHMS</span>
                </div>
                <p className="text-xs font-mono text-[#8E8E8E] leading-relaxed mb-2">
                  Heuristic A* search algorithm computing minimum energy consumption routes across irregular urban grid topologies with dynamic barrier recalculation.
                </p>
                <div className="flex flex-wrap gap-1.5 text-[9px] font-mono text-[#C7FF4A]">
                  <span className="px-2 py-0.5 rounded bg-white/5">TypeScript</span>
                  <span className="px-2 py-0.5 rounded bg-white/5">A* Heuristic</span>
                  <span className="px-2 py-0.5 rounded bg-white/5">Canvas 2D</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[rgba(242,240,234,0.1)] bg-[#0C0E17] flex items-center justify-between text-xs font-mono text-[#8E8E8E]">
          <span>VERIFIED PORTFOLIO DOSSIER</span>
          <a
            href="mailto:nikhilsaireddy@gmail.com"
            className="text-[#00F0FF] hover:underline flex items-center gap-1 font-bold"
          >
            <span>DISPATCH INQUIRY</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
