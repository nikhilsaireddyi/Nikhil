'use client';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { siteConfig } from '@/data/site';
import { GraduationCap, Compass, Layers, Binary } from 'lucide-react';
import { GitHubActivityHeatmap } from '@/components/ui/GitHubActivityHeatmap';
import { GeospatialNode } from '@/components/ui/GeospatialNode';

export function About() {
  return (
    <section
      id="about"
      className="relative w-full py-24 sm:py-32 md:py-40 border-b border-[rgba(242,240,234,0.06)] z-10"
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
              <p className="text-xs sm:text-sm font-mono text-[#8E8E8E] tracking-wider mb-6">
                DEPARTMENT: {siteConfig.education.department} {'//'} {siteConfig.education.location}
              </p>

              <div className="space-y-4 border-t border-[rgba(242,240,234,0.08)] pt-4 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[#8E8E8E]">CURRENT STATUS</span>
                  <span className="text-[#C7FF4A]">UNDERGRADUATE STUDENT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8E8E8E]">FOCUS FIELD</span>
                  <span className="text-[#F2F0EA]">CSE AI/ML</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8E8E8E]">TRAJECTORY</span>
                  <span className="text-[#F2F0EA]">{siteConfig.specialization}</span>
                </div>
              </div>
            </div>

            {/* Micro Pillars */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[rgba(242,240,234,0.08)] bg-[#0D0D0D]/60 p-4">
                <Binary size={16} className="text-[#C7FF4A] mb-2" />
                <div className="text-xs font-bold text-[#F2F0EA] uppercase mb-1">AI / ML</div>
                <div className="text-[10px] font-mono text-[#8E8E8E]">Algorithmic thinking & neural concepts</div>
              </div>

              <div className="border border-[rgba(242,240,234,0.08)] bg-[#0D0D0D]/60 p-4">
                <Layers size={16} className="text-[#C7FF4A] mb-2" />
                <div className="text-xs font-bold text-[#F2F0EA] uppercase mb-1">FRONTEND</div>
                <div className="text-[10px] font-mono text-[#8E8E8E]">Next.js, TypeScript & reactive architecture</div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 text-[#8E8E8E] leading-relaxed">
            <p className="text-lg sm:text-xl md:text-2xl font-sans font-normal text-[#F2F0EA] leading-snug">
              I am an undergraduate student in Vizag, dedicating my academic and creative focus to
              Computer Science Engineering with a specialization in Artificial Intelligence and
              Machine Learning.
            </p>

            <div className="space-y-6 text-sm sm:text-base font-sans font-light">
              <p>
                My trajectory is shaped by curiosity. Rather than viewing technology as isolated tools,
                I approach code as a computational medium where mathematics, logic, and human interface
                design converge.
              </p>

              <p>
                In the frontend domain, I architect responsive interfaces using Next.js, React, and
                strict TypeScript, pairing structural rigor with intentional kinetic motion through
                Anime.js and Lenis smooth scrolling.
              </p>

              <p>
                As an aspiring AI engineer, my long-term ambition is to develop intelligent systems from
                first principles, simultaneously building the expressive, high-performance interfaces
                necessary for people to explore and orchestrate them.
              </p>
            </div>

            <div className="pt-6 border-t border-[rgba(242,240,234,0.08)] flex items-center gap-4 text-xs font-mono text-[#8E8E8E]">
              <Compass size={14} className="text-[#C7FF4A]" />
              <span>CORE DISCIPLINE: CONTINUOUS EXPERIMENTATION & DEEP LEARNING</span>
            </div>
          </div>
        </div>

        {/* 3D Global Geospatial Node (Visakhapatnam Orbit Relay) */}
        <GeospatialNode />

        {/* Neural GitHub Activity & Commit Heatmap */}
        <GitHubActivityHeatmap />
      </div>
    </section>
  );
}
