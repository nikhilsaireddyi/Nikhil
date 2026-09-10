import { siteConfig } from '@/data/site';
import { socialLinks } from '@/data/socials';
import { ArrowUp } from 'lucide-react';

export function Footer() {
  return (
    <footer
      className="relative w-full py-16 sm:py-24 border-t border-[rgba(242,240,234,0.08)] bg-[#070707] z-10"
      aria-label="Footer"
    >
      <div className="mx-auto max-w-[1680px] px-6 sm:px-10 md:px-14 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12 pb-16 border-b border-[rgba(242,240,234,0.06)]">
          {/* Brand & Closing Identity */}
          <div className="space-y-4 max-w-lg">
            <h2 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-[#F2F0EA] uppercase">
              {siteConfig.name}
            </h2>
            <p className="text-xs sm:text-sm font-mono text-[#8E8E8E] tracking-wider">
              {siteConfig.role} {'//'} {siteConfig.location}
            </p>
            <div className="text-xs font-mono text-[#C7FF4A] tracking-widest pt-2">
              BUILT WITH CURIOSITY.
            </div>
          </div>

          {/* Quick links & Back to Top */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 text-xs font-mono">
            <div className="flex flex-wrap gap-6 text-[#8E8E8E]">
              {socialLinks.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C7FF4A] transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>

            <a
              href="#hero"
              className="flex items-center gap-2 text-[#F2F0EA] border border-[rgba(242,240,234,0.15)] bg-[#121212] px-4 py-2 hover:border-[#C7FF4A] hover:text-[#C7FF4A] transition-colors"
            >
              <span>RETURN TO TOP</span>
              <ArrowUp size={14} />
            </a>
          </div>
        </div>

        {/* Bottom Technical Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[10px] font-mono text-[#555555] tracking-widest">
          <div>© {new Date().getFullYear()} NIKHIL SAI REDDY. ALL RIGHTS RESERVED.</div>
          <div className="flex items-center gap-4">
            <span>DARK EDITORIAL TECHNOLOGY</span>
            <span className="text-[#333333]">{'//'}</span>
            <span>NEXT.JS + TAILWIND + ANIME.JS + LENIS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
