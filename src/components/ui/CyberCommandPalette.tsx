'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal, X, CornerDownLeft, Sparkles, ShieldAlert, Cpu } from 'lucide-react';
import { playKeyClick, playSynapticPulse, playOverclockSurge } from '@/lib/sound';

interface HistoryItem {
  id: string;
  command: string;
  output: React.ReactNode;
}

const WELCOME_BANNER = `
 ███╗   ██╗██╗██╗  ██╗██╗  ██╗██╗██╗     
 ████╗  ██║██║██║ ██╔╝██║  ██║██║██║     
 ██╔██╗ ██║██║█████╔╝ ███████║██║██║     
 ██║╚██╗██║██║██╔═██╗ ██╔══██║██║██║     
 ██║ ╚████║██║██║  ██╗██║  ██║██║███████╗
 ╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝
 ═══════════════════════════════════════════════════
 NIKHIL SAI REDDY // AUTONOMOUS CYBER SHELL v2.4.0
 ORIGIN: VISAKHAPATNAM, INDIA // NXT WAVE CSE AI/ML
 TYPE 'help' FOR SYSTEM DIRECTIVES OR SELECT CHIPS BELOW.
`;

export function CyberCommandPalette() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [cmdIndex, setCmdIndex] = useState<number>(-1);
  const [pastCommands, setPastCommands] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Global Keyboard Listener for Cmd+K / Ctrl+K / Backquote & Custom Event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-cyber-shell', handleCustomOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-cyber-shell', handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      playSynapticPulse();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Auto scroll to bottom of terminal
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Execute terminal command
  const executeCommand = useCallback((rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    setPastCommands((prev) => [...prev, trimmed]);
    setCmdIndex(-1);

    let output: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        output = (
          <div className="space-y-1.5 text-xs text-[#8E8E8E]">
            <div className="text-[#00F0FF] font-bold">AVAILABLE SYSTEM DIRECTIVES:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <div><span className="text-[#C7FF4A] font-bold">help</span> — List directives</div>
              <div><span className="text-[#C7FF4A] font-bold">story</span> — Nikhil&apos;s origin & engineering journey</div>
              <div><span className="text-[#C7FF4A] font-bold">philosophy</span> — Core thesis on AI + Interfaces</div>
              <div><span className="text-[#C7FF4A] font-bold">glossary</span> — AI/ML & frontend spec dictionary</div>
              <div><span className="text-[#C7FF4A] font-bold">about</span> — Academic background & bio</div>
              <div><span className="text-[#C7FF4A] font-bold">skills</span> — Neural & frontend stack</div>
              <div><span className="text-[#C7FF4A] font-bold">projects</span> — Flagship system deployments</div>
              <div><span className="text-[#C7FF4A] font-bold">cat resume.md</span> — Print markdown CV</div>
              <div><span className="text-[#C7FF4A] font-bold">theme &lt;name&gt;</span> — lime | cyberpunk | solar | violet</div>
              <div><span className="text-[#C7FF4A] font-bold">vehicle &lt;type&gt;</span> — spaceship | supra | escort</div>
              <div><span className="text-[#C7FF4A] font-bold">sudo hire-nikhil</span> — Trigger priority talent acquisition</div>
              <div><span className="text-[#C7FF4A] font-bold">clear</span> — Wipe terminal display buffer</div>
              <div><span className="text-[#C7FF4A] font-bold">exit</span> — Close cyber terminal shell</div>
            </div>
          </div>
        );
        break;

      case 'story':
        output = (
          <div className="space-y-2 text-xs text-[#8E8E8E] bg-[#0B0D15] p-3.5 rounded-lg border border-[rgba(242,240,234,0.1)]">
            <div className="text-[#00F0FF] font-bold flex items-center gap-2">
              <Cpu size={14} />
              <span>ORIGIN STORY // NIKHIL SAI REDDY</span>
            </div>
            <p className="text-[#F2F0EA] leading-relaxed">
              Growing up in Vizag, India, my fascination with computational engineering began with a core obsession:
              how can cold mathematical algorithms become living, responsive interfaces that people can intuitively feel?
            </p>
            <p className="leading-relaxed">
              Currently pursuing Computer Science Engineering (AI/ML) at Nxt Wave, I build at the frontier of two worlds:
              deriving neural network loss surfaces from first principles and sculpting ultra-fluid 60 FPS web architectures
              with Next.js, TypeScript, and kinetic physics.
            </p>
            <div className="text-[#C7FF4A] pt-1">
              MISSION: Build intelligent computing systems with zero compromise on craft or performance.
            </div>
          </div>
        );
        break;

      case 'philosophy':
        output = (
          <div className="space-y-2 text-xs text-[#8E8E8E] bg-[#0B0D15] p-3.5 rounded-lg border border-[#C7FF4A]/30">
            <div className="text-[#C7FF4A] font-bold">CORE PHILOSOPHY // INTELLIGENCE + INTERFACE</div>
            <p className="text-[#F2F0EA] leading-relaxed">
              1. Intelligence without an expressive interface is trapped potential.
            </p>
            <p className="text-[#F2F0EA] leading-relaxed">
              2. An interface without intelligence is an empty shell.
            </p>
            <p className="text-[#8E8E8E] leading-relaxed">
              True breakthrough computing systems live at the exact convergence: high-dimensional neural weights orchestrated
              through intuitive, tactile, sub-16ms latency digital cockpits.
            </p>
          </div>
        );
        break;

      case 'glossary':
        output = (
          <div className="space-y-2 text-xs text-[#8E8E8E] bg-[#0B0D15] p-3.5 rounded-lg border border-[#00F0FF]/30">
            <div className="text-[#00F0FF] font-bold">SYS // TECHNICAL GLOSSARY INDEX:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div><span className="text-[#C7FF4A] font-bold">Softmax</span> — Normalized probability distribution across classes</div>
              <div><span className="text-[#C7FF4A] font-bold">AdamW</span> — Adaptive moment estimation with decoupled weight decay</div>
              <div><span className="text-[#C7FF4A] font-bold">Backprop</span> — Reverse-mode automatic differentiation via chain rule</div>
              <div><span className="text-[#C7FF4A] font-bold">A* Search</span> — Heuristic graph search for minimal-cost paths</div>
              <div><span className="text-[#C7FF4A] font-bold">Next.js 16</span> — Turbopack-powered React full-stack architecture</div>
              <div><span className="text-[#C7FF4A] font-bold">Anime.js</span> — JavaScript spring physics & kinetic typography</div>
            </div>
            <div className="text-[10px] text-[#00F0FF] mt-1 pt-1 border-t border-white/10 italic">
              Tip: Hover over underlined keywords across the portfolio for interactive formulas & specs!
            </div>
          </div>
        );
        break;

      case 'about':
        output = (
          <div className="space-y-2 text-xs text-[#8E8E8E]">
            <div className="text-[#F2F0EA] font-bold">NIKHIL SAI REDDY</div>
            <div>Undergraduate student specializing in Computer Science Engineering (AI & ML).</div>
            <div>Institution: <span className="text-[#C7FF4A]">Nxt Wave of Innovation in Advanced Technology</span></div>
            <div>Base Location: <span className="text-[#00F0FF]">Visakhapatnam, Andhra Pradesh, India</span></div>
            <div>Discipline: Modern Web Architectures, Deep Learning, Generative Interfaces, Procedural Web Audio.</div>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-2 text-xs text-[#8E8E8E]">
            <div className="text-[#00F0FF] font-bold">CORE TECHNICAL COMPETENCIES:</div>
            <div><span className="text-[#C7FF4A]">AI & ML:</span> Python, PyTorch, Neural Classifier Architectures, Softmax Regression, MNIST Modeling, Feature Maps</div>
            <div><span className="text-[#C7FF4A]">FRONTEND & SYSTEMS:</span> Next.js (App Router), React 19, TypeScript, Vanilla CSS Tokens, Canvas 2D/3D Contexts, Web Audio API, Anime.js</div>
            <div><span className="text-[#C7FF4A]">ENGINEERING DISCIPLINE:</span> Real-time telemetry, zero external audio footprint, mathematical kinetic physics, low latency architectures</div>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-2 text-xs text-[#8E8E8E]">
            <div className="text-[#00F0FF] font-bold">DEPLOYED PORTFOLIO MODULES:</div>
            <div className="space-y-1">
              <div>1. <span className="text-[#F2F0EA] font-bold">Supra 911 Kinetic Assembly</span> — Scroll-driven aerodynamic procedural CAD rendering.</div>
              <div>2. <span className="text-[#F2F0EA] font-bold">3D Neural Tensor Core</span> — 360° interactive transformer orbit with exploded synaptic layers.</div>
              <div>3. <span className="text-[#F2F0EA] font-bold">Neural Digit Classifier</span> — In-browser deep learning forward pass inference pad.</div>
              <div>4. <span className="text-[#F2F0EA] font-bold">Wind Tunnel Dyno & Livery Spec</span> — Reynolds airflow simulation with audio dyno synthesizer.</div>
              <div>5. <span className="text-[#F2F0EA] font-bold">Geospatial Orbit Node</span> — Global orbital telemetry routing from Visakhapatnam base.</div>
            </div>
          </div>
        );
        break;

      case 'cat':
        if (arg === 'resume.md' || arg === 'resume') {
          output = (
            <div className="space-y-2 text-xs text-[#8E8E8E] bg-[#0B0D15] p-3 rounded-lg border border-[rgba(242,240,234,0.08)]">
              <div className="text-[#C7FF4A] font-bold"># RESUME.MD // NIKHIL SAI REDDY</div>
              <div>-------------------------------------------------------</div>
              <div><strong>EDUCATION:</strong> Undergraduate Student, CSE AI/ML</div>
              <div>Nxt Wave of Innovation in Advanced Technology, Visakhapatnam</div>
              <div>-------------------------------------------------------</div>
              <div><strong>AREAS OF IMPACT:</strong></div>
              <div>- Architecting hyper-performance full-stack web applications with reactive motion.</div>
              <div>- Deep learning research & browser-based neural network model evaluation.</div>
              <div>- Synthesizing interactive audio-visual hardware accelerators with Web Audio API.</div>
              <div>-------------------------------------------------------</div>
              <div className="text-[#00F0FF]">CONTACT: nikhilsaireddy@... // Available for Internships & AI Engineering Roles</div>
            </div>
          );
        } else {
          output = <div className="text-[#FF5E00]">cat: {arg || 'file'}: No such file or directory. Try: &apos;cat resume.md&apos;</div>;
        }
        break;

      case 'theme':
        if (['lime', 'cyberpunk', 'solar', 'violet'].includes(arg)) {
          document.documentElement.setAttribute('data-theme', arg);
          try {
            localStorage.setItem('nikhil_theme_preference', arg);
          } catch {}
          output = (
            <div className="text-[#C7FF4A]">
              [OK] THEME SHIFTED TO: <span className="font-bold uppercase">{arg}</span>
            </div>
          );
        } else {
          output = (
            <div className="text-[#FF5E00]">
              Usage: theme &lt;name&gt; (Available: lime, cyberpunk, solar, violet)
            </div>
          );
        }
        break;

      case 'vehicle':
        if (['spaceship', 'supra', 'escort'].includes(arg)) {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('set-bg-vehicle', { detail: arg }));
            try {
              localStorage.setItem('portfolio-bg-vehicle', arg);
            } catch {}
          }
          output = (
            <div className="text-[#00F0FF]">
              [OK] BACKGROUND 3D VEHICLE SHIFTED TO: <span className="font-bold uppercase text-[#C7FF4A]">{arg}</span>
            </div>
          );
        } else {
          output = (
            <div className="text-[#FF5E00]">
              Usage: vehicle &lt;type&gt; (Available: spaceship, supra, escort)
            </div>
          );
        }
        break;

      case 'sudo':
        if (arg.includes('hire') || arg.includes('hire-nikhil')) {
          playOverclockSurge();
          output = (
            <div className="border border-[#C7FF4A] bg-[#C7FF4A]/10 p-3 rounded-lg space-y-1 text-xs">
              <div className="text-[#C7FF4A] font-bold flex items-center gap-2">
                <Sparkles size={14} className="animate-spin" />
                <span>[ROOT AUTHORIZATION GRANTED: 100% MATCH]</span>
              </div>
              <div className="text-[#F2F0EA]">
                TRANSMITTING PRIORITY INVITATION TO NIKHIL SAI REDDY (VIZAG BASE).
              </div>
              <div className="text-[#00F0FF]">
                STATUS: READY TO BUILD TRANSFORMATIVE INTELLIGENCE & ELEVATED USER EXPERIENCES.
              </div>
            </div>
          );
        } else {
          output = (
            <div className="text-[#FF007F] flex items-center gap-1.5">
              <ShieldAlert size={14} />
              <span>sudo: permission denied for command &apos;{arg}&apos;. Try &apos;sudo hire-nikhil&apos;</span>
            </div>
          );
        }
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'exit':
      case 'quit':
        setIsOpen(false);
        return;

      default:
        output = (
          <div className="text-[#FF5E00]">
            Command not recognized: &apos;{trimmed}&apos;. Type &apos;help&apos; for available directives.
          </div>
        );
        break;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        command: trimmed,
        output,
      },
    ]);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Mechanical key audio tick
    playKeyClick();

    if (e.key === 'Enter') {
      executeCommand(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (pastCommands.length === 0) return;
      const nextIdx = cmdIndex === -1 ? pastCommands.length - 1 : Math.max(0, cmdIndex - 1);
      setCmdIndex(nextIdx);
      setInputVal(pastCommands[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdIndex === -1) return;
      const nextIdx = cmdIndex + 1;
      if (nextIdx >= pastCommands.length) {
        setCmdIndex(-1);
        setInputVal('');
      } else {
        setCmdIndex(nextIdx);
        setInputVal(pastCommands[nextIdx]);
      }
    }
  };

  return (
    <>
      {/* Quick Launch Trigger Button (Desktop & Mobile Nav) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[rgba(242,240,234,0.12)] bg-[#11131C]/80 hover:bg-[#181B26] hover:border-[#00F0FF] transition-all text-xs font-mono text-[#8E8E8E] hover:text-[#F2F0EA] group shadow-sm"
        title="Open Cyber Terminal Shell (Cmd + K)"
      >
        <Terminal size={13} className="text-[#00F0FF] group-hover:animate-pulse" />
        <span className="font-bold text-[11px] text-[#F2F0EA]">CLI SHELL</span>
        <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-[#0A0B10] border border-[rgba(242,240,234,0.1)] text-[#C7FF4A]">
          ⌘K
        </span>
      </button>

      {/* Cyberpunk Modal Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cyber Terminal Shell"
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-3xl bg-[#08090F] border border-[#00F0FF]/40 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col overflow-hidden max-h-[85vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Window Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0D0F1A] border-b border-[rgba(242,240,234,0.1)] text-xs font-mono">
              <div className="flex items-center gap-2 text-[#F2F0EA]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block" />
                </div>
                <span className="text-[#00F0FF] font-bold ml-2 flex items-center gap-1.5">
                  <Cpu size={13} />
                  <span>terminal // nikhil@quantum-node:~$</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-[10px] text-[#8E8E8E]">PRESS ESC TO EXIT</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-[#8E8E8E] hover:text-[#F2F0EA] transition-colors p-1"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Quick Directive Chips */}
            <div className="px-4 py-2 bg-[#0B0C14] border-b border-[rgba(242,240,234,0.06)] flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
              <span className="text-[#666] mr-1">QUICK RUN:</span>
              {[
                'help',
                'story',
                'philosophy',
                'glossary',
                'cat resume.md',
                'sudo hire-nikhil',
                'vehicle supra',
                'skills',
                'projects',
                'theme cyberpunk',
                'clear',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => executeCommand(chip)}
                  className="px-2 py-0.5 rounded border border-[rgba(242,240,234,0.08)] bg-[#121422] text-[#C7FF4A] hover:border-[#C7FF4A] hover:bg-[#C7FF4A]/15 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Terminal Body Screen */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 font-mono text-xs text-[#F2F0EA] flex-1 min-h-[280px]">
              {/* ASCII Banner */}
              <pre className="text-[9px] sm:text-[10px] text-[#00F0FF] leading-tight select-none opacity-90">
                {WELCOME_BANNER}
              </pre>

              {/* Command History Buffer */}
              {history.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#C7FF4A] font-bold">nikhil@vizag:~$</span>
                    <span className="text-[#F2F0EA]">{item.command}</span>
                  </div>
                  <div className="pl-4 border-l border-[rgba(242,240,234,0.1)]">{item.output}</div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Command Input Prompt */}
            <div className="p-3 sm:p-4 bg-[#0A0B12] border-t border-[rgba(242,240,234,0.1)] flex items-center gap-3">
              <span className="text-[#C7FF4A] font-mono text-xs font-bold whitespace-nowrap">
                nikhil@vizag:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type 'help', 'skills', 'cat resume.md', or 'sudo hire-nikhil'..."
                className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-[#F2F0EA] placeholder-[#555]"
              />
              <button
                type="button"
                onClick={() => {
                  executeCommand(inputVal);
                  setInputVal('');
                }}
                className="p-1.5 rounded-lg bg-[#141724] border border-[rgba(242,240,234,0.1)] text-[#00F0FF] hover:bg-[#00F0FF]/20 transition-all"
                title="Execute Command"
              >
                <CornerDownLeft size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function openCyberShell() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-cyber-shell'));
  }
}

