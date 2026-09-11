'use client';

import { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { projectsData } from '@/data/projects';
import { Project } from '@/types';
import { useCursorHover } from '@/hooks/useCursorHover';
import { CornerDownRight, Activity, Eye, Compass, ShieldAlert } from 'lucide-react';
import { playHoverTick, playSynapticPulse } from '@/lib/sound';
import { ProjectSimulations } from '@/components/ui/ProjectSimulations';
import { CyberScramble } from '@/components/ui/CyberScramble';
import { TechGlossaryTooltip } from '@/components/ui/TechGlossaryTooltip';

const PROJECT_THEMES = [
  {
    primary: '#00F0FF',
    secondary: '#FFB703',
    glow: 'rgba(0, 240, 255, 0.25)',
    border: 'border-[#00F0FF]/50',
    icon: Activity,
    statusTag: 'TELEMETRY PIPELINE ONLINE',
  },
  {
    primary: '#FF007F',
    secondary: '#7928CA',
    glow: 'rgba(255, 0, 127, 0.25)',
    border: 'border-[#FF007F]/50',
    icon: Eye,
    statusTag: 'NEURAL VISION INFERENCE',
  },
  {
    primary: '#C7FF4A',
    secondary: '#00DF81',
    glow: 'rgba(199, 255, 74, 0.25)',
    border: 'border-[#C7FF4A]/50',
    icon: Compass,
    statusTag: 'ECO-ROUTE ALGORITHM READY',
  },
];

export function Projects() {
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0, gleamX: 50, gleamY: 50 });
  const activeProject: Project = projectsData[activeProjectIndex] || projectsData[0];
  const activeTheme = PROJECT_THEMES[activeProjectIndex % PROJECT_THEMES.length];
  const projectCursor = useCursorHover('project', 'EXPLORE');

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setCardTilt({
      x: -(y - 0.5) * 8,
      y: (x - 0.5) * 8,
      gleamX: x * 100,
      gleamY: y * 100,
    });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0, gleamX: 50, gleamY: 50 });
  };

  const ThemeIcon = activeTheme.icon;

  return (
    <section
      id="projects"
      className="relative w-full py-24 sm:py-32 md:py-40 border-b border-[rgba(242,240,234,0.06)] z-10 overflow-hidden"
      aria-label="Selected Projects and Workspaces"
    >
      {/* Dynamic Colored Glow Halo */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-[150px] pointer-events-none opacity-20 transition-colors duration-700"
        style={{ backgroundColor: activeTheme.primary }}
      />

      <div className="mx-auto max-w-[1680px] px-6 sm:px-10 md:px-14 lg:px-16 relative z-10">
        <SectionHeader
          number="04"
          label="SELECTED BUILDS"
          subtitle="COMPUTATIONAL SYSTEMS & INTERACTIVE MODELS // REAL-TIME CODE ARCHITECTURE"
          title="ENGINEERING WORKSPACES"
        />

        {/* Project Selector Bar */}
        <div className="mb-12 flex flex-wrap items-center gap-3 sm:gap-4 border-b border-[rgba(242,240,234,0.1)] pb-6">
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#8E8E8E] mr-2">
            SLOTS:
          </span>
          {projectsData.map((project, idx) => {
            const isActive = idx === activeProjectIndex;
            const theme = PROJECT_THEMES[idx % PROJECT_THEMES.length];
            return (
              <button
                key={project.id}
                type="button"
                onMouseEnter={playHoverTick}
                onClick={() => {
                  playSynapticPulse();
                  setActiveProjectIndex(idx);
                }}
                className={`flex items-center gap-2.5 px-4 py-2 text-xs font-mono tracking-wider border rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'border-transparent text-[#070707] font-bold shadow-lg'
                    : 'border-[rgba(242,240,234,0.1)] text-[#8E8E8E] hover:border-[rgba(242,240,234,0.3)] hover:text-[#F2F0EA] bg-[#0E0F14]'
                }`}
                style={{
                  backgroundColor: isActive ? theme.primary : undefined,
                  boxShadow: isActive ? `0 0 20px ${theme.glow}` : undefined,
                }}
              >
                <span>{project.number}</span>
                <span className="uppercase">{project.category}</span>
              </button>
            );
          })}
        </div>

        {/* Dominant Editorial Project Scene with 3D Perspective Tilt */}
        <div
          {...projectCursor}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          className="border border-[rgba(242,240,234,0.14)] bg-[#0A0B10]/95 backdrop-blur-xl p-6 sm:p-10 md:p-14 relative group overflow-hidden rounded-2xl shadow-2xl transition-[border-color,box-shadow] duration-500"
          style={{
            transform: `perspective(1200px) rotateX(${cardTilt.x.toFixed(2)}deg) rotateY(${cardTilt.y.toFixed(2)}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.15s ease-out',
            boxShadow: `0 20px 50px -10px ${activeTheme.glow}`,
          }}
        >
          {/* Dynamic Specular Gleam Overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen"
            style={{
              background: `radial-gradient(circle 350px at ${cardTilt.gleamX}% ${cardTilt.gleamY}%, rgba(255,255,255,0.18), ${activeTheme.glow} 40%, transparent 80%)`,
            }}
          />

          {/* Architectural Framing Ticks */}
          <div className="absolute top-4 left-4 text-[9px] font-mono tracking-widest text-[#8E8E8E]">
            WORKSPACE // {activeProject.number}
          </div>
          <div
            className="absolute top-4 right-4 flex items-center gap-2 text-[9px] font-mono tracking-widest font-bold px-2.5 py-1 rounded-md border"
            style={{
              color: activeTheme.primary,
              borderColor: activeTheme.primary,
              backgroundColor: `${activeTheme.primary}15`,
            }}
          >
            <ShieldAlert size={12} />
            <span>{activeTheme.statusTag}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center pt-6 relative z-10">
            {/* Left: Project Metadata & Copy */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-3 text-xs font-mono text-[#8E8E8E] mb-3">
                  <span style={{ color: activeTheme.primary }} className="font-bold">
                    {activeProject.category}
                  </span>
                  <span>{'//'}</span>
                  <span>YEAR: {activeProject.year}</span>
                  <span>{'//'}</span>
                  <span className="uppercase text-[#8E8E8E]">STATUS: {activeProject.status}</span>
                </div>

                <h3 className="text-3xl sm:text-5xl md:text-6xl font-sans font-black uppercase text-[#F2F0EA] tracking-tight leading-[0.95] group-hover:translate-x-1 transition-transform duration-300">
                  <CyberScramble text={activeProject.title} />
                </h3>
              </div>

              <p className="text-sm sm:text-base font-sans font-light text-[#8E8E8E] leading-relaxed max-w-xl">
                {activeProject.description}
              </p>

              {/* Technologies List with Vibrant Chips */}
              <div className="pt-6 border-t border-[rgba(242,240,234,0.08)]">
                <div className="text-[10px] font-mono text-[#555555] tracking-widest mb-3 uppercase">
                  STACK ARCHITECTURE
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeProject.technologies.map((tech) => (
                    <TechGlossaryTooltip key={tech} termKey={tech}>
                      <span
                        className="inline-block text-xs font-mono tracking-wider font-bold px-3 py-1.5 rounded-md border uppercase transition-transform hover:scale-105"
                        style={{
                          color: activeTheme.primary,
                          borderColor: `${activeTheme.primary}40`,
                          backgroundColor: `${activeTheme.primary}10`,
                        }}
                      >
                        {tech}
                      </span>
                    </TechGlossaryTooltip>
                  ))}
                </div>
              </div>

              {/* Data Model Note */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#8E8E8E]">
                <CornerDownRight size={14} style={{ color: activeTheme.primary }} />
                <span>DATA MODEL RIGIDLY CONFIGURED FOR PRODUCTION BUILDS</span>
              </div>
            </div>

            {/* Right: Architectural Computational Visual Display */}
            <div className="lg:col-span-5">
              <div
                className="relative aspect-video sm:aspect-[4/3] border rounded-xl overflow-hidden shadow-2xl transition-colors duration-500 flex flex-col justify-between"
                style={{
                  borderColor: `${activeTheme.primary}40`,
                  backgroundColor: '#07070B',
                  boxShadow: `0 10px 30px -5px ${activeTheme.glow}`,
                }}
              >
                {/* Live Canvas Simulation */}
                <ProjectSimulations
                  projectIndex={activeProjectIndex}
                  primaryColor={activeTheme.primary}
                  secondaryColor={activeTheme.secondary}
                />

                {/* Diagnostic Framing Badge in bottom left */}
                <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center border backdrop-blur-md"
                    style={{
                      borderColor: activeTheme.primary,
                      backgroundColor: `${activeTheme.primary}20`,
                      color: activeTheme.primary,
                    }}
                  >
                    <ThemeIcon size={12} className="animate-pulse" />
                  </div>
                  <span className="text-[9px] font-mono text-[#F2F0EA] font-bold tracking-widest bg-[#0B0C10]/90 px-2 py-0.5 rounded border border-[rgba(242,240,234,0.1)]">
                    {activeProject.title}
                  </span>
                </div>


                <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2 text-[9px] font-mono text-[#8E8E8E] bg-[#07080B]/80 px-2.5 py-1 rounded border border-[rgba(242,240,234,0.1)] pointer-events-none backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: activeTheme.primary }} />
                  <span style={{ color: activeTheme.secondary }} className="font-bold">
                    60 FPS INTERACTIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
