'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { navigationItems } from '@/data/navigation';
import { siteConfig } from '@/data/site';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { Magnetic } from '@/components/ui/Magnetic';
import { useCursorHover } from '@/hooks/useCursorHover';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import { ScrollPayload } from '@/motion/scroll';
import { Menu, X, ArrowUpRight, FileText, Terminal } from 'lucide-react';
import { socialLinks } from '@/data/socials';
import { ResumeModal } from '@/components/ui/ResumeModal';
import { ThemeSwitcher, THEMES, applyTheme, CyberTheme } from '@/components/ui/ThemeSwitcher';
import { CyberCommandPalette, openCyberShell } from '@/components/ui/CyberCommandPalette';
import { CyberScramble } from '@/components/ui/CyberScramble';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [resumeOpen, setResumeOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [currentTheme, setCurrentTheme] = useState<CyberTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = (document.documentElement.getAttribute('data-theme') ||
        localStorage.getItem('portfolio-cyber-theme')) as CyberTheme | null;
      if (saved && THEMES.some((t) => t.id === saved)) {
        return saved;
      }
    }
    return 'lime';
  });

  // Sync theme with global state
  useEffect(() => {
    const handleTheme = (e: Event) => {
      const customEvent = e as CustomEvent<CyberTheme>;
      if (customEvent.detail) setCurrentTheme(customEvent.detail);
    };
    window.addEventListener('set-portfolio-theme', handleTheme);
    return () => window.removeEventListener('set-portfolio-theme', handleTheme);
  }, []);

  const sectionIds = useMemo(() => ['hero', 'about', 'toolkit', 'journey', 'projects', 'lab', 'contact'], []);

  const updateActiveSection = useCallback(() => {
    if (typeof window === 'undefined') return;
    const scrollPosition = window.scrollY + 220; // clearance offset
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Activate contact when near bottom of page
    if (window.scrollY + windowHeight >= documentHeight - 100) {
      setActiveSection('contact');
      return;
    }

    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const id = sectionIds[i];
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop;
        if (scrollPosition >= top) {
          setActiveSection(id);
          return;
        }
      }
    }
    setActiveSection('hero');
  }, [sectionIds]);

  useLenisScroll(
    useCallback((payload: ScrollPayload) => {
      setIsScrolled(payload.scroll > 50);
      updateActiveSection();
    }, [updateActiveSection])
  );

  const brandCursor = useCursorHover('link');
  const navItemCursor = useCursorHover('link');

  // Fallback native scroll listener and initial position check
  useEffect(() => {
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [updateActiveSection]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const sectionId = href.replace('#', '');
    setActiveSection(sectionId);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#07070B]/95 backdrop-blur-2xl border-b border-[rgba(242,240,234,0.12)] py-3.5 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
            : 'bg-[#07070B]/80 backdrop-blur-xl border-b border-[rgba(242,240,234,0.06)] py-4 sm:py-5 shadow-lg'
        }`}
      >
        <div className="mx-auto flex max-w-[1680px] items-center justify-between px-6 sm:px-10 md:px-14 lg:px-16">
          {/* Brand Identity */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="#hero"
              {...brandCursor}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#hero');
              }}
              className="group flex flex-col focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C7FF4A]"
            >
              <span className="text-base sm:text-lg font-sans font-extrabold tracking-tight text-white uppercase group-hover:text-[#C7FF4A] transition-colors duration-200">
                <CyberScramble text={siteConfig.name} scrambleOnHover={true} />
              </span>
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#00F0FF] uppercase font-semibold">
                CSE AI/ML // VIZAG
              </span>
            </a>

            <div className="hidden lg:block">
              <StatusIndicator />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main Navigation">
            {navigationItems.map((item) => {
              const isActive = activeSection === item.sectionId;
              return (
                <Magnetic key={item.id} maxDistance={6}>
                  <a
                    href={item.href}
                    {...navItemCursor}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="group relative flex items-center gap-1.5 py-1 text-xs font-mono tracking-[0.16em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C7FF4A]"
                  >
                    <span
                      className={`text-[10px] font-mono font-bold transition-colors ${
                        isActive ? 'text-[#C7FF4A]' : 'text-[#8E92A4] group-hover:text-[#00F0FF]'
                      }`}
                    >
                      {item.number}
                    </span>
                    <span
                      className={`transition-colors ${
                        isActive
                          ? 'text-white font-bold'
                          : 'text-[#E2E4EC] font-medium group-hover:text-white'
                      }`}
                    >
                      <CyberScramble text={item.label} scrambleOnHover={true} />
                    </span>
                    {isActive && (
                      <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#C7FF4A] shadow-[0_0_10px_#C7FF4A] rounded-full" />
                    )}
                  </a>
                </Magnetic>
              );
            })}

            {/* Architectural Resume / CV Trigger */}
            <Magnetic maxDistance={6}>
              <button
                type="button"
                onClick={() => setResumeOpen(true)}
                className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#C7FF4A]/40 bg-[#C7FF4A]/10 text-[#C7FF4A] hover:bg-[#C7FF4A] hover:text-black transition-all duration-200 text-xs font-mono tracking-[0.14em] font-medium shadow-[0_0_15px_rgba(199,255,74,0.12)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C7FF4A]"
              >
                <FileText size={12} className="group-hover:scale-110 transition-transform" />
                <span>CV // SPEC</span>
              </button>
            </Magnetic>

            {/* Cyber Command Terminal Shell */}
            <CyberCommandPalette />

            {/* Cyber Aesthetics Theme Switcher */}
            <ThemeSwitcher />
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeSwitcher />
            <button
              type="button"
              onClick={() => setResumeOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-sm border border-[#C7FF4A]/40 bg-[#C7FF4A]/10 text-[#C7FF4A] text-[10px] font-mono tracking-wider font-semibold"
            >
              <FileText size={10} />
              <span>CV</span>
            </button>
            <StatusIndicator className="text-[8px] py-0.5 px-2" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-[rgba(242,240,234,0.15)] bg-[rgba(18,18,18,0.7)] text-[#F2F0EA] active:bg-[#181818] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C7FF4A]"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Overlay Menu */}
      <div
        className={`fixed inset-0 z-50 flex flex-col justify-between bg-[#070707] p-6 sm:p-10 transition-all duration-500 ease-out md:hidden ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-4'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex items-center justify-between border-b border-[rgba(242,240,234,0.1)] pb-6">
          <div>
            <div className="text-sm font-bold uppercase tracking-tight text-[#F2F0EA]">
              {siteConfig.name}
            </div>
            <div className="text-[9px] font-mono tracking-[0.2em] text-[#8E8E8E]">
              COMPUTING THE FUTURE
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-[rgba(242,240,234,0.2)] text-[#F2F0EA]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-4 py-6" aria-label="Mobile Navigation">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setResumeOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-sm border border-[#C7FF4A] bg-[#C7FF4A]/15 text-[#C7FF4A] font-mono text-[11px] font-bold tracking-wider uppercase hover:bg-[#C7FF4A] hover:text-black transition-all"
            >
              <FileText size={13} />
              <span>CV // SPEC</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openCyberShell();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-sm border border-[#00F0FF] bg-[#00F0FF]/15 text-[#00F0FF] font-mono text-[11px] font-bold tracking-wider uppercase hover:bg-[#00F0FF] hover:text-black transition-all"
            >
              <Terminal size={13} />
              <span>CLI (⌘K)</span>
            </button>
          </div>

          {/* Mobile Cyber Palettes Grid */}
          <div className="border border-[rgba(242,240,234,0.08)] bg-[rgba(18,18,24,0.5)] rounded-lg p-2.5 mb-2">
            <div className="text-[9px] font-mono tracking-[0.2em] text-[#8E8E8E] mb-2 uppercase flex items-center justify-between">
              <span>CYBER PALETTE</span>
              <span
                className="text-[9px] font-bold"
                style={{ color: THEMES.find((t) => t.id === currentTheme)?.color }}
              >
                {THEMES.find((t) => t.id === currentTheme)?.name}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {THEMES.map((theme) => {
                const isSelected = currentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      applyTheme(theme.id);
                      setCurrentTheme(theme.id);
                    }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-[11px] font-mono transition-all ${
                      isSelected
                        ? 'bg-[rgba(242,240,234,0.12)] border border-[rgba(242,240,234,0.25)] text-[#F2F0EA] font-bold shadow-sm'
                        : 'border border-[rgba(242,240,234,0.06)] text-[#8E8E8E] hover:text-[#F2F0EA] hover:bg-[rgba(242,240,234,0.04)]'
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: theme.color, boxShadow: `0 0 6px ${theme.glow}` }}
                    />
                    <span className="truncate">{theme.shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
              className="flex items-baseline justify-between border-b border-[rgba(242,240,234,0.06)] py-2.5 text-2xl font-sans font-bold tracking-tight text-[#F2F0EA] active:text-[#C7FF4A]"
            >
              <span>{item.label}</span>
              <span className="text-xs font-mono text-[#C7FF4A] tracking-widest">{item.number}</span>
            </a>
          ))}
        </nav>

        {/* Mobile Socials & System Info */}
        <div className="border-t border-[rgba(242,240,234,0.1)] pt-6">
          <div className="text-[10px] font-mono tracking-[0.18em] text-[#8E8E8E] mb-3">
            VERIFIED NETWORKS
          </div>
          <div className="flex flex-wrap gap-4">
            {socialLinks.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-mono text-[#F2F0EA] hover:text-[#C7FF4A]"
              >
                <span>{s.label}</span>
                <ArrowUpRight size={12} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Holographic Architectural Resume / CV Viewer */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
