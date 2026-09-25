'use client';

import { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { socialLinks } from '@/data/socials';
import { SocialLink } from '@/types';
import { useCursorHover } from '@/hooks/useCursorHover';
import { Magnetic } from '@/components/ui/Magnetic';
import { ArrowUpRight, Send, CheckCircle2, ShieldCheck, Radio, Mail, Copy, Check } from 'lucide-react';
import { playHoverTick, playTransmissionSound } from '@/lib/sound';

export function Contact() {
  const linkCursor = useCursorHover('link');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [missionType, setMissionType] = useState('AI/ML');
  const [payloadText, setPayloadText] = useState('');
  const [transmissionState, setTransmissionState] = useState<'idle' | 'encrypting' | 'dispatched'>('idle');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('nikhilsaireddyi@gmail.com');
    setCopiedEmail(true);
    playHoverTick();
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderEmail || !payloadText) return;

    setTransmissionState('encrypting');
    playTransmissionSound();

    setTimeout(() => {
      setTransmissionState('dispatched');
      // Create mailto fallback
      const subject = encodeURIComponent(`[TRANSMISSION: ${missionType}] from ${senderName || 'Anonymous'}`);
      const body = encodeURIComponent(`SENDER: ${senderName}\nCONTACT: ${senderEmail}\nOBJECTIVE: ${missionType}\n\nPAYLOAD:\n${payloadText}`);
      window.location.href = `mailto:nikhilsaireddyi@gmail.com?subject=${subject}&body=${body}`;
    }, 1200);
  };

  return (
    <section
      id="contact"
      className="relative w-full py-24 sm:py-32 md:py-44 border-b border-[rgba(242,240,234,0.06)] z-10 overflow-hidden"
      aria-label="Contact and Social Networks"
    >
      {/* Background Cyber Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#00F0FF]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="mx-auto max-w-[1680px] px-6 sm:px-10 md:px-14 lg:px-16 relative z-10">
        <SectionHeader
          number="06"
          label="CONTACT"
          subtitle="COMMUNICATION CHANNELS // DIRECT TRANSMISSION"
          title="HAVE AN IDEA WORTH BUILDING?"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Transmission Terminal Console */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#090B12]/90 border border-[rgba(0,240,255,0.3)] shadow-[0_0_35px_rgba(0,240,255,0.15)] backdrop-blur-2xl relative overflow-hidden">
              {/* Scanline CRT overlay */}
              <div
                className="pointer-events-none absolute inset-0 opacity-10 mix-blend-screen"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, #000, #000 2px, transparent 2px, transparent 4px)',
                }}
              />

              {/* Console Header */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[rgba(242,240,234,0.1)] relative z-10">
                <div className="flex items-center gap-2">
                  <Radio size={14} className="text-[#00F0FF] animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-widest text-[#F2F0EA]">
                    MISSION CONTROL // DISPATCH TRANSMISSION
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#C7FF4A]">
                  <ShieldCheck size={12} />
                  <span>256-BIT ENCRYPTED</span>
                </div>
              </div>

              {transmissionState === 'dispatched' ? (
                <div className="py-12 text-center space-y-4 relative z-10">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#C7FF4A]/15 border border-[#C7FF4A] flex items-center justify-center text-[#C7FF4A] shadow-[0_0_20px_rgba(199,255,74,0.4)]">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-xl font-sans font-bold text-[#F2F0EA] uppercase">
                    TRANSMISSION DISPATCHED
                  </h4>
                  <p className="text-xs font-mono text-[#8E8E8E] max-w-sm mx-auto">
                    Your transmission payload has been sealed and routed to Nikhil Sai Reddy. Expect contact shortly.
                  </p>
                  <button
                    onClick={() => {
                      setTransmissionState('idle');
                      setPayloadText('');
                    }}
                    className="mt-4 px-4 py-2 rounded-lg bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-xs font-mono text-[#00F0FF] hover:bg-[#00F0FF] hover:text-[#07070B] transition-all font-bold"
                  >
                    DISPATCH NEW TRANSMISSION
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDispatch} className="space-y-4 relative z-10">
                  {/* Mission Type Selector */}
                  <div>
                    <label className="block text-[10px] font-mono text-[#8E8E8E] tracking-widest mb-2 uppercase">
                      SELECT OBJECTIVE
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['AI/ML', 'FRONTEND', 'FULL-STACK', 'RESEARCH'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            playHoverTick();
                            setMissionType(type);
                          }}
                          className={`py-1.5 px-2 rounded-md text-[10px] font-mono text-center transition-all ${
                            missionType === type
                              ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/60 font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                              : 'bg-[#12141C] text-[#8E8E8E] hover:text-[#F2F0EA] border border-transparent'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-[#8E8E8E] tracking-widest mb-1 uppercase">
                        SENDER / CALLSIGN
                      </label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. Elena Vance"
                        className="w-full bg-[#12141C] border border-[rgba(242,240,234,0.1)] rounded-lg px-3 py-2 text-xs font-mono text-[#F2F0EA] placeholder:text-[#555555] focus:outline-none focus:border-[#00F0FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#8E8E8E] tracking-widest mb-1 uppercase">
                        TRANSMISSION CHANNEL *
                      </label>
                      <input
                        type="email"
                        required
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="your.email@domain.com"
                        className="w-full bg-[#12141C] border border-[rgba(242,240,234,0.1)] rounded-lg px-3 py-2 text-xs font-mono text-[#F2F0EA] placeholder:text-[#555555] focus:outline-none focus:border-[#00F0FF]"
                      />
                    </div>
                  </div>

                  {/* Payload / Message */}
                  <div>
                    <label className="block text-[10px] font-mono text-[#8E8E8E] tracking-widest mb-1 uppercase">
                      TRANSMISSION PAYLOAD *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={payloadText}
                      onChange={(e) => setPayloadText(e.target.value)}
                      placeholder="Outline your vision, architecture requirements, or collaborative proposal..."
                      className="w-full bg-[#12141C] border border-[rgba(242,240,234,0.1)] rounded-lg px-3 py-2 text-xs font-mono text-[#F2F0EA] placeholder:text-[#555555] focus:outline-none focus:border-[#00F0FF] resize-none"
                    />
                  </div>

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={transmissionState === 'encrypting'}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#00A8FF] text-[#07070B] font-mono text-xs font-bold tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] transition-all disabled:opacity-50"
                  >
                    {transmissionState === 'encrypting' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-[#07070B] animate-ping" />
                        <span>ENCRYPTING & DISPATCHING...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>INITIALIZE DISPATCH TRANSMISSION</span>
                      </>
                    )}
                  </button>

                  {/* Fast-track direct email option */}
                  <div className="pt-2 border-t border-[rgba(242,240,234,0.06)]">
                    <a
                      href="mailto:nikhilsaireddyi@gmail.com?subject=Direct%20Inquiry%20via%20Portfolio&body=Hi%20Nikhil,"
                      className="w-full py-2.5 px-3 rounded-lg border border-[rgba(0,240,255,0.25)] bg-[#00F0FF]/5 hover:bg-[#00F0FF]/15 text-[#00F0FF] font-mono text-[11px] font-semibold tracking-wider flex items-center justify-center gap-2 transition-all hover:border-[#00F0FF] group"
                    >
                      <Mail size={13} className="transition-transform group-hover:scale-110" />
                      <span>FAST-TRACK: OPEN IN EMAIL CLIENT</span>
                      <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </form>
              )}

              {/* Station Info Footer */}
              <div className="mt-6 pt-4 border-t border-[rgba(242,240,234,0.08)] flex items-center justify-between text-[9px] font-mono text-[#555555] relative z-10">
                <span>TERMINAL NODE: VIZAG</span>
                <span>AFFILIATION: NXT WAVE</span>
                <span>STATUS: READY</span>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Email Console & Editorial Links List */}
          <div className="lg:col-span-6 space-y-8">
            {/* Featured Direct Send a Mail Card */}
            <div className="p-6 rounded-2xl bg-[#090B12]/90 border border-[rgba(0,240,255,0.3)] shadow-[0_0_30px_rgba(0,240,255,0.12)] backdrop-blur-2xl relative overflow-hidden group">
              {/* Ambient accent glow */}
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#00F0FF]/10 blur-3xl pointer-events-none" />
              <div className="absolute top-0 right-0 border-t-2 border-r-2 border-[#00F0FF]/60 w-3 h-3" />
              <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-[#00F0FF]/60 w-3 h-3" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(242,240,234,0.08)] relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.25)]">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-[#00F0FF] uppercase flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C7FF4A] animate-pulse" />
                      DIRECT MAIL CHANNEL
                    </div>
                    <h4 className="text-xl font-sans font-bold text-[#F2F0EA] tracking-tight">
                      SEND A MAIL
                    </h4>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8E8E8E] bg-[#12141C] px-3 py-1.5 rounded-md border border-[rgba(242,240,234,0.08)] self-start sm:self-auto">
                  <span className="text-[#555]">SLA:</span>
                  <span className="text-[#C7FF4A] font-semibold">&lt; 24H RESPONSE</span>
                </div>
              </div>

              <div className="mt-5 space-y-3 relative z-10">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#12141C] p-3 sm:p-4 rounded-xl border border-[rgba(242,240,234,0.08)]">
                  <div className="flex items-center gap-2 font-mono text-sm text-[#F2F0EA] truncate">
                    <span className="text-[#555] select-none">&gt;</span>
                    <span className="font-semibold select-all text-[#00F0FF] sm:text-[#F2F0EA]">nikhilsaireddyi@gmail.com</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-[#181B26] hover:bg-[#202534] border border-[rgba(242,240,234,0.12)] hover:border-[#00F0FF]/50 text-xs font-mono text-[#F2F0EA] flex items-center justify-center gap-1.5 transition-all"
                      title="Copy email address"
                    >
                      {copiedEmail ? (
                        <>
                          <Check size={13} className="text-[#C7FF4A]" />
                          <span className="text-[#C7FF4A] font-bold">COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} className="text-[#8E8E8E]" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>

                    <a
                      href="mailto:nikhilsaireddyi@gmail.com?subject=Hello%20Nikhil&body=Hi%20Nikhil,"
                      className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#00A8FF] hover:from-[#00D0DF] hover:to-[#0090DF] text-[#07070B] text-xs font-mono font-bold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all"
                    >
                      <span>SEND MAIL</span>
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Social Links List */}
            <div className="border-t border-[rgba(242,240,234,0.1)]">
            <div className="divide-y divide-[rgba(242,240,234,0.08)]">
              {socialLinks.map((social: SocialLink) => (
                <Magnetic key={social.platform} maxDistance={10} className="w-full">
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...linkCursor}
                    className="group relative flex items-center justify-between py-6 sm:py-8 px-4 sm:px-6 transition-all duration-300 hover:bg-[#0D0D0D] block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00F0FF]"
                  >
                    {/* Left: Index & Platform */}
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span className="text-xs font-mono text-[#555555] group-hover:text-[#00F0FF] transition-colors">
                        [{social.index}]
                      </span>
                      <span className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold uppercase tracking-tight text-[#F2F0EA] group-hover:text-[#00F0FF] group-hover:translate-x-2 transition-all duration-300">
                        {social.label}
                      </span>
                    </div>

                    {/* Right: Handle & Animated Arrow */}
                    <div className="flex items-center gap-4 text-xs font-mono text-[#8E8E8E]">
                      <span className="hidden sm:inline text-[11px] text-[#8E8E8E] group-hover:text-[#F2F0EA] transition-colors">
                        {social.displayHandle}
                      </span>
                      <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[rgba(242,240,234,0.15)] bg-[#121212] text-[#F2F0EA] group-hover:border-[#00F0FF] group-hover:bg-[#00F0FF] group-hover:text-[#070707] transition-all duration-300 shadow-md">
                        <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>

                    {/* Bottom expanding accent line */}
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#00F0FF] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
}

