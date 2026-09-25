'use client';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { siteConfig } from '@/data/site';
import { GraduationCap, Compass, Layers, Binary } from 'lucide-react';
import { GitHubActivityHeatmap } from '@/components/ui/GitHubActivityHeatmap';
import { TechGlossaryTooltip } from '@/components/ui/TechGlossaryTooltip';
import { CyberScramble } from '@/components/ui/CyberScramble';

export function About() {
  return (
    <section
      id="about"
      className="relative w-full pt-12 sm:pt-16 md:pt-20 pb-24 sm:pb-32 md:pb-40 border-b border-[rgba(242,240,234,0.06)] z-10"
      aria-label="About Nikhil Sai Reddy"
    >
      <div className="mx-auto max-w-[1680px] px-6 sm:px-10 md:px-14 lg:px-16">
        <SectionHeader
          number="01"
          label="ABOUT"
          subtitle="AUTHENTIC FOUNDATION // NO ARTIFICIAL CLAIMS"
          title="LEARNING. BUILDING. ITERATING."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Academic & Identity Specs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-[rgba(242,240,234,0.12)] bg-[#0D0D0D] p-6 sm:p-8 relative">
              <div className="text-[10px] font-mono tracking-[0.25em] text-[#C7FF4A] uppercase mb-4 flex items-center gap-2">
                <GraduationCap size={14} />
                <span>ACADEMIC STATUS</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-sans font-bold text-[#F2F0EA] mb-2">
                {siteConfig.education.institution}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[#A8ABB8] tracking-wider mb-6">
                DEPARTMENT: {siteConfig.education.department} {'//'} {siteConfig.education.location}
              </p>

              <div className="space-y-4 border-t border-[rgba(242,240,234,0.08)] pt-4 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[#A8ABB8]">CURRENT STATUS</span>
                  <span className="text-[#C7FF4A] font-semibold">UNDERGRADUATE STUDENT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A8ABB8]">FOCUS FIELD</span>
                  <span className="text-[#F2F0EA] font-semibold">CSE AI/ML</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A8ABB8]">TRAJECTORY</span>
                  <span className="text-[#F2F0EA] font-semibold">{siteConfig.specialization}</span>
                </div>
              </div>
            </div>

            {/* Micro Pillars */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[rgba(242,240,234,0.08)] bg-[#0D0D0D]/60 p-4">
                <Binary size={16} className="text-[#C7FF4A] mb-2" />
                <div className="text-xs font-bold text-[#F2F0EA] uppercase mb-1">AI / ML</div>
                <div className="text-[10px] font-mono text-[#A8ABB8]">Algorithmic thinking & neural concepts</div>
              </div>

              <div className="border border-[rgba(242,240,234,0.08)] bg-[#0D0D0D]/60 p-4">
                <Layers size={16} className="text-[#C7FF4A] mb-2" />
                <div className="text-xs font-bold text-[#F2F0EA] uppercase mb-1">FRONTEND</div>
                <div className="text-[10px] font-mono text-[#A8ABB8]">Next.js, TypeScript & reactive architecture</div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative - Permanently Crisp & Readable */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="border border-[rgba(242,240,234,0.12)] bg-[#0D0D0D]/85 backdrop-blur-xl p-6 sm:p-8 rounded-xl shadow-2xl space-y-6">
              <p className="text-lg sm:text-xl md:text-2xl font-sans font-medium text-[#F2F0EA] leading-snug">
                I am an undergraduate student in Vizag, dedicating my academic and creative focus to{' '}
                <span className="text-[#00F0FF] font-semibold">Computer Science Engineering</span> with a specialization in{' '}
                <span className="text-[#C7FF4A] font-semibold">Artificial Intelligence and Machine Learning</span>.
              </p>

              <div className="space-y-4 text-sm sm:text-base font-sans leading-relaxed border-t border-[rgba(242,240,234,0.12)] pt-5">
                <p className="text-[#F2F0EA] font-normal leading-relaxed">
                  My trajectory is shaped by curiosity. Rather than viewing technology as isolated tools,
                  I approach code as a computational medium where mathematics, logic, and human interface
                  design converge.
                </p>

                <p className="text-[#F2F0EA] font-normal leading-relaxed">
                  In the frontend domain, I architect responsive interfaces using{' '}
                  <TechGlossaryTooltip termKey="Next.js 16" className="text-white font-semibold underline decoration-[#00F0FF] underline-offset-4">Next.js 16</TechGlossaryTooltip>, React, and{' '}
                  <TechGlossaryTooltip termKey="TypeScript" className="text-white font-semibold underline decoration-[#00F0FF] underline-offset-4">strict TypeScript</TechGlossaryTooltip>, pairing structural rigor with intentional kinetic motion through{' '}
                  <TechGlossaryTooltip termKey="Anime.js" className="text-white font-semibold underline decoration-[#00F0FF] underline-offset-4">Anime.js</TechGlossaryTooltip> and Lenis smooth scrolling.
                </p>

                <p className="text-[#F2F0EA] font-normal leading-relaxed">
                  As an aspiring AI engineer, my long-term ambition is to develop intelligent systems from
                  first principles, simultaneously building the expressive, high-performance interfaces
                  necessary for people to explore and orchestrate them.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(242,240,234,0.08)] flex items-center gap-4 text-xs font-mono text-[#A0A0A0]">
              <Compass size={14} className="text-[#C7FF4A]" />
              <CyberScramble text="CORE DISCIPLINE: CONTINUOUS EXPERIMENTATION & DEEP LEARNING" triggerOnScroll={true} />
            </div>
          </div>
        </div>

        {/* Neural GitHub Activity & Commit Heatmap */}
        <GitHubActivityHeatmap />
      </div>
    </section>
  );
}
