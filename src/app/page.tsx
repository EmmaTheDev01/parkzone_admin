"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AnimatedGlobe from "@/components/AnimatedGlobe";

/* ────────────────── Scroll reveal (Popcorn-style soft rise) ────────────────── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ────────────────── Small shared pieces ────────────────── */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="pz-pill inline-flex items-center rounded-full px-3.5 py-1.5 text-[11px] sm:text-xs font-medium text-neutral-800">
      {children}
    </span>
  );
}

function CheckIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function StoreBadges({ dark = true }: { dark?: boolean }) {
  const base = dark
    ? "bg-[#2B2A2A] hover:bg-black text-white"
    : "bg-white hover:bg-neutral-100 text-neutral-900";
  const sub = dark ? "text-neutral-400" : "text-neutral-500";
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <a
        href="https://apps.apple.com"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-2.5 pl-4 pr-5 py-2 rounded-full ${base} transition-all shadow-[0_6px_20px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 active:scale-95`}
      >
        <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.67-.82 1.13-1.96 1-3.1-.98.04-2.17.65-2.87 1.47-.62.72-1.16 1.88-1.01 2.99 1.1.08 2.21-.54 2.88-1.36z" />
        </svg>
        <span className="text-left leading-none">
          <span className={`block text-[9px] font-medium ${sub}`}>Download on the</span>
          <span className="block text-sm font-semibold tracking-tight mt-0.5">App Store</span>
        </span>
      </a>
      <a
        href="https://play.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-2.5 pl-4 pr-5 py-2 rounded-full ${base} transition-all shadow-[0_6px_20px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 active:scale-95`}
      >
        <svg className="w-[18px] h-[18px] fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M3.609 1.814L13.793 12 3.61 22.186a1.99 1.99 0 0 1-.61-1.423V3.237c0-.54.22-1.03.609-1.423zm11.238 11.24l2.58 2.58-12.35 7.126 9.77-9.706zm0-2.108L5.077 1.24l12.35 7.126-2.58 2.58zm1.054 1.054l3.19-1.84a1.8 1.8 0 0 1 0 3.12l-3.19-1.28z" />
        </svg>
        <span className="text-left leading-none">
          <span className={`block text-[9px] font-medium ${sub}`}>Get it on</span>
          <span className="block text-sm font-semibold tracking-tight mt-0.5">Google Play</span>
        </span>
      </a>
    </div>
  );
}

/* Pseudo QR code (deterministic, no runtime randomness) */
function QrMock() {
  const size = 21;
  const cells: React.ReactNode[] = [];
  const isFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (isFinder(x, y)) continue;
      if (x >= 8 && x <= 12 && y >= 8 && y <= 12) continue;
      const on = ((x * 7 + y * 13 + x * y) % 5) < 2;
      if (on) cells.push(<circle key={`${x}-${y}`} cx={x + 0.5} cy={y + 0.5} r={0.42} />);
    }
  }
  const finder = (fx: number, fy: number) => (
    <g key={`f-${fx}-${fy}`}>
      <circle cx={fx + 3.5} cy={fy + 3.5} r={3.1} fill="none" stroke="currentColor" strokeWidth={0.9} />
      <circle cx={fx + 3.5} cy={fy + 3.5} r={1.5} />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full text-neutral-500 fill-current">
      {cells}
      {finder(0, 0)}
      {finder(size - 7, 0)}
      {finder(0, size - 7)}
      <rect x={8.6} y={8.6} width={3.8} height={3.8} rx={0.9} className="fill-neutral-700" />
    </svg>
  );
}

const sectors = [
  { name: "Nyarugenge", r: "-6deg", dot: "bg-emerald-500" },
  { name: "Kimihurura", r: "4deg", dot: "bg-neutral-900" },
  { name: "Kacyiru", r: "-3deg", dot: "bg-emerald-400" },
  { name: "Nyarutarama", r: "7deg", dot: "bg-neutral-700" },
  { name: "Remera", r: "-5deg", dot: "bg-emerald-600" },
  { name: "Kicukiro", r: "5deg", dot: "bg-neutral-900" },
  { name: "Gisozi", r: "-4deg", dot: "bg-emerald-500" },
  { name: "Kimironko", r: "3deg", dot: "bg-neutral-600" },
  { name: "Gikondo", r: "-7deg", dot: "bg-emerald-400" },
  { name: "40+ More", r: "6deg", dot: "" },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const faqs = [
    {
      q: "What is ParkZone?",
      a: "ParkZone is Kigali's next-gen municipal mobility network. It unifies ANPR optical camera gates, ultrasonic bay sensors, 60kW DC electric vehicle chargers, and cashless Mobile Money into one seamless experience. No paper tickets, no ticket booths, and no surprise citations.",
    },
    {
      q: "Where in Kigali does ParkZone work?",
      a: "ParkZone covers 50+ facilities across Nyarugenge, Gasabo, and Kicukiro, including Kigali Heights, the Convention Centre precinct, Downtown commercial streets, and the Nyarutarama EV Hub.",
    },
    {
      q: "How does the 2,000 RWF daily cap work?",
      a: "Transient parking accumulates at the standard municipal rate of 300 RWF per hour, but automatically freezes the moment your daily total reaches 2,000 RWF. After that, re-entries across all connected facilities cost nothing extra.",
    },
    {
      q: "How does the 15-minute free grace period work?",
      a: "Every municipal hub and smart street zone provides a statutory 15-minute grace period. Drop off passengers or collect a quick pickup and the ANPR barrier opens at exactly 0 RWF.",
    },
    {
      q: "How do MTN MoMo and Airtel Money checkouts work?",
      a: "When your vehicle approaches the exit gate, an automated USSD prompt appears on your phone. Enter your mobile money PIN to authorize the payment. Digital VAT receipts are instantly recorded in your account.",
    },
    {
      q: "How do I check or dispute a parking citation?",
      a: "Enter your vehicle plate in the ParkZone app to view your real-time standing. Any statutory fine logged by marshals is linked to Irembo, where you can inspect timestamps, photos, and resolve arrears instantly.",
    },
  ];

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#coverage", label: "Coverage" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <div className="min-h-screen bg-[#161515] text-[#2B2A2A] font-sans antialiased selection:bg-emerald-200 selection:text-neutral-900 overflow-x-hidden">
      {/* ══════════════ MAIN SHEET (rounded bottom over dark footer) ══════════════ */}
      <div className="relative z-10 bg-[#F7F7F6] rounded-b-[32px] sm:rounded-b-[48px] overflow-hidden">
        {/* ────────────────── NAVBAR ────────────────── */}
        <header className="sticky top-0 z-50 bg-[#F7F7F6]/85 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 sm:h-[72px] flex items-center justify-between">
            <div className="flex items-center gap-8 lg:gap-10">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="ParkZone" className="h-7 sm:h-8 w-auto object-contain" />
              </Link>
              <nav className="hidden md:flex items-center gap-7 text-sm text-neutral-500">
                <a href="#" className="relative text-neutral-900 font-medium after:absolute after:left-0 after:right-0 after:-bottom-1.5 after:h-[1.5px] after:bg-neutral-900">
                  Home
                </a>
                {navLinks.map((l) => (
                  <a key={l.href} href={l.href} className="hover:text-neutral-900 transition-colors">
                    {l.label}
                  </a>
                ))}
                <Link href="/contact" className="hover:text-neutral-900 transition-colors">
                  Support
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="#download"
                className="hidden sm:inline-flex px-5 py-2 rounded-full bg-[#2B2A2A] hover:bg-black text-white text-sm font-medium transition-all hover:-translate-y-0.5"
              >
                Get the app
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full text-neutral-700 hover:bg-neutral-200/60 transition-colors"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mx-4 mb-3 rounded-3xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] px-6 py-5 space-y-4">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-serif text-xl text-neutral-900"
                >
                  {l.label}
                </a>
              ))}
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block font-serif text-xl text-neutral-900">
                Support
              </Link>
              <a
                href="#download"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-5 py-2.5 rounded-full bg-[#2B2A2A] text-white text-sm font-medium"
              >
                Get the app
              </a>
            </div>
          )}
        </header>

        {/* ────────────────── HERO ────────────────── */}
        <section className="relative pt-12 sm:pt-16 md:pt-20 px-5 sm:px-8 max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="pz-rise" style={{ animationDelay: "0ms" }}>
              <Pill>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-2" />
                Now live across Kigali
              </Pill>
            </div>

            <h1
              className="pz-rise mt-6 font-serif text-[44px] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[84px] tracking-[-0.02em] text-[#2B2A2A]"
              style={{ animationDelay: "80ms" }}
            >
              One parking network.
              <br />
              No hassle.
            </h1>

            <p
              className="pz-rise mt-5 sm:mt-6 max-w-md text-[15px] sm:text-base leading-relaxed text-neutral-500"
              style={{ animationDelay: "160ms" }}
            >
              Park anywhere in Kigali for 300 RWF/hr.
              <br className="hidden sm:block" /> Capped at 2,000 RWF a day. No tickets, or headaches.
            </p>

            <div id="download" className="pz-rise mt-7 sm:mt-8 scroll-mt-24" style={{ animationDelay: "240ms" }}>
              <StoreBadges />
            </div>
          </div>

          {/* Phones over watercolor blob */}
          <div className="pz-rise relative mt-10 sm:mt-14 flex justify-center" style={{ animationDelay: "320ms" }}>
            <div className="relative w-full max-w-[560px] aspect-[1/1.02] sm:aspect-[1.05/1]">
              {/* Watercolor wash */}
              <div className="pointer-events-none absolute left-1/2 top-[6%] -translate-x-1/2 w-[86%] h-[94%] rounded-[50%] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_18%,rgba(16,185,129,0.35),transparent_55%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_95%,rgba(5,150,105,0.45),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_55%,rgba(209,250,229,0.9),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_45%,rgba(236,253,245,0.95),transparent_55%)]" />
                <div className="absolute inset-0 pz-grain mix-blend-multiply" />
              </div>
              <div className="pointer-events-none absolute left-1/2 top-[6%] -translate-x-1/2 w-[92%] h-[100%] rounded-[50%] shadow-[inset_0_0_60px_30px_#F7F7F6]" />

              {/* Left phone */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/screenshots/ev-map-navigation.png"
                alt="ParkZone live EV navigation"
                className="absolute left-[8%] sm:left-[10%] top-[14%] w-[46%] -rotate-[8deg] drop-shadow-[0_30px_40px_rgba(0,0,0,0.22)] z-20 select-none"
              />
              {/* Right phone */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/screenshots/parking-spot-selection.png"
                alt="ParkZone spot reservation"
                className="absolute right-[8%] sm:right-[10%] top-[10%] w-[44%] rotate-[9deg] drop-shadow-[0_24px_34px_rgba(0,0,0,0.18)] z-10 select-none"
              />
            </div>
          </div>
        </section>

        {/* ────────────────── 3 ICON FEATURES ────────────────── */}
        <section className="px-5 sm:px-8 max-w-5xl mx-auto pt-10 sm:pt-14 pb-20 sm:pb-28">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
            {[
              {
                title: ["15 minutes free", "at every gate"],
                icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="13" r="8" />
                    <path d="M12 9v4l2.5 2M9 2h6" />
                  </svg>
                ),
              },
              {
                title: ["Live bays in", "50+ facilities"],
                icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
                    <circle cx="12" cy="9.5" r="2.5" />
                  </svg>
                ),
              },
              {
                title: ["Pay with", "MoMo in seconds"],
                icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
                    <path d="M11 18h2" />
                  </svg>
                ),
              },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 100} className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-neutral-800 shadow-[0_4px_14px_rgba(16,185,129,0.18)] ring-1 ring-emerald-100">
                  {f.icon}
                </div>
                <p className="mt-4 font-serif text-[22px] leading-[1.15] text-[#2B2A2A]">
                  {f.title[0]}
                  <br />
                  {f.title[1]}
                </p>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-center text-[11px] text-neutral-400">*Subject to City of Kigali municipal mobility bylaws</p>
        </section>

        {/* ────────────────── PEACE OF MIND BENTO ────────────────── */}
        <section id="features" className="px-5 sm:px-8 max-w-6xl mx-auto pb-24 sm:pb-32 scroll-mt-20">
          <Reveal className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-4xl sm:text-5xl md:text-[56px] leading-[1.05] tracking-[-0.015em] text-[#2B2A2A]">
              A Kigali plate,
              <br />
              with peace of mind.
            </h2>
            <p className="mt-4 text-[15px] text-neutral-500 leading-relaxed">
              Get started in 72 seconds.
              <br />
              Drive in from any sector in the city.
            </p>
          </Reveal>

          <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {/* Simple */}
            <Reveal delay={0}>
              <div className="h-full rounded-[24px] bg-[#E8F3EE] p-6 sm:p-8 flex flex-col">
                <div className="flex-1 flex items-center justify-center py-4">
                  <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] px-8 py-6 text-center w-[190px]">
                    <div className="text-xs text-neutral-600">Daily cap</div>
                    <div className="mt-1 text-[40px] leading-none font-light tracking-tight text-neutral-900">2,000</div>
                    <div className="text-[11px] text-neutral-500 mt-1">RWF</div>
                    <span className="mt-3 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                      <CheckIcon /> All inclusive
                    </span>
                  </div>
                </div>
                <h3 className="mt-6 font-serif text-2xl text-center text-[#2B2A2A]">Simple</h3>
                <p className="mt-2 text-sm text-neutral-500 text-center leading-relaxed">
                  One rate, one cap. Fees freeze at 2,000 RWF no matter how long your day runs.
                </p>
              </div>
            </Reveal>

            {/* Fast & Easy */}
            <Reveal delay={100}>
              <div className="h-full rounded-[24px] bg-[#E8EDF5] p-6 sm:p-8 flex flex-col">
                <div className="flex-1 flex items-center justify-center py-4">
                  <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-4 w-[150px] h-[150px]">
                    <QrMock />
                  </div>
                </div>
                <h3 className="mt-6 font-serif text-2xl text-center text-[#2B2A2A]">Fast &amp; Easy</h3>
                <p className="mt-2 text-sm text-neutral-500 text-center leading-relaxed">
                  ANPR cameras read your plate and lift the barrier in 0.4 seconds. Or scan a bay pass.
                </p>
              </div>
            </Reveal>

            {/* Fine Free */}
            <Reveal delay={200}>
              <div className="h-full rounded-[24px] bg-[#EEEAF4] p-6 sm:p-8 flex flex-col">
                <div className="flex-1 flex items-center justify-center py-4 relative">
                  <div className="absolute inset-x-2 sm:inset-x-0 top-1/2 -translate-y-1/2 h-[96px] rounded-2xl bg-white/50 flex items-center justify-between px-4 text-[11px] text-neutral-400 font-serif">
                    <span>Cash booth</span>
                    <span>Paper ticket</span>
                  </div>
                  <div className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] px-6 py-5 text-center w-[160px]">
                    <div className="mx-auto w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="6" width="18" height="12" rx="2" />
                        <path d="M7 10h4M7 14h7" />
                      </svg>
                    </div>
                    <div className="mt-2 font-serif text-[15px] leading-tight text-neutral-900">Parking ticket</div>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                      <CheckIcon /> Not needed
                    </span>
                  </div>
                </div>
                <h3 className="mt-6 font-serif text-2xl text-center text-[#2B2A2A]">Ticket Free</h3>
                <p className="mt-2 text-sm text-neutral-500 text-center leading-relaxed">
                  No booths, no paper, no surprise citations. Every session lives in your app.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ────────────────── WORKS EVERYWHERE (GLOBE) ────────────────── */}
        <section id="coverage" className="px-5 sm:px-8 max-w-6xl mx-auto pb-24 sm:pb-32 scroll-mt-20">
          <Reveal className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <h2 className="font-serif text-4xl sm:text-5xl md:text-[56px] leading-[1.05] tracking-[-0.015em] text-[#2B2A2A]">
              Works at Kigali Heights.
              <br />
              Works everywhere.
            </h2>
            <p className="mt-4 text-[15px] text-neutral-500 leading-relaxed max-w-sm mx-auto">
              Experience premium municipal sensor coverage across Downtown, Nyarutarama, and 50+ facilities.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center max-w-5xl mx-auto">
            {[
              [
                {
                  t: "Citywide Coverage",
                  d: "Powered by optical ANPR camera gates across all Kigali municipal sectors.",
                  icon: (
                    <>
                      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
                      <circle cx="12" cy="9.5" r="2.5" />
                    </>
                  ),
                },
                {
                  t: "Smart Telemetry",
                  d: "Real-time ultrasonic loop sensors track every single bay and stall occupancy.",
                  icon: (
                    <>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
                    </>
                  ),
                },
              ],
              [
                {
                  t: "60kW DC EV Hubs",
                  d: "Rapid charging stations with 0 RWF parking fees during active charging.",
                  icon: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
                },
                {
                  t: "Instant MoMo",
                  d: "Automated USSD prompt on your phone for instant, frictionless gate departure.",
                  icon: (
                    <>
                      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
                      <path d="M11 18h2" />
                    </>
                  ),
                },
              ],
            ].map((col, ci) => (
              <div
                key={ci}
                className={`lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-10 lg:gap-16 ${
                  ci === 0 ? "order-2 lg:order-1 lg:text-right" : "order-3 lg:text-left"
                } text-center`}
              >
                {col.map((c, i) => (
                  <Reveal key={c.t} delay={i * 120} className={`flex flex-col items-center ${ci === 0 ? "lg:items-end" : "lg:items-start"}`}>
                    <div className="w-11 h-11 rounded-full bg-[#EDEDEC] flex items-center justify-center text-neutral-800">
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        {c.icon}
                      </svg>
                    </div>
                    <h4 className="mt-3 text-sm font-semibold text-neutral-900">{c.t}</h4>
                    <p className="mt-1.5 text-[13px] text-neutral-500 leading-relaxed max-w-[230px]">{c.d}</p>
                  </Reveal>
                ))}
              </div>
            ))}

            <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center">
              <Reveal className="w-full">
                <AnimatedGlobe />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ────────────────── OUR COVERAGE? GLAD YOU ASKED ────────────────── */}
        <section className="relative px-5 sm:px-8 pb-24 sm:pb-32">
          <div className="relative max-w-4xl mx-auto">
            {/* Dotted map wash */}
            <div
              className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[110%] sm:w-full h-[380px] sm:h-[420px] pz-dots opacity-70"
              style={{
                WebkitMaskImage: "radial-gradient(ellipse 55% 50% at 50% 45%, #000 40%, transparent 75%)",
                maskImage: "radial-gradient(ellipse 55% 50% at 50% 45%, #000 40%, transparent 75%)",
              }}
            />
            <Reveal className="relative text-center pt-16 sm:pt-20">
              <Pill>The city is your oyster</Pill>
              <h2 className="mt-5 font-serif text-4xl sm:text-5xl md:text-[56px] leading-[1.05] tracking-[-0.015em] text-[#2B2A2A]">
                Our coverage?
                <br />
                Glad you asked.
              </h2>
              <p className="mt-4 text-[15px] text-neutral-500 leading-relaxed">
                Smart bays across all three districts,
                <br />
                and 50+ facilities citywide.
              </p>
            </Reveal>

            <Reveal delay={150} className="relative mt-12 sm:mt-14 flex flex-wrap justify-center gap-x-2.5 gap-y-3 max-w-xl mx-auto">
              {sectors.map((s, i) => (
                <span
                  key={s.name}
                  className="pz-float inline-flex items-center gap-2 rounded-full bg-white pl-2 pr-4 py-1.5 text-[13px] text-neutral-800 shadow-[0_6px_18px_rgba(0,0,0,0.07)]"
                  style={{ ["--r" as string]: s.r, animationDelay: `${i * 0.35}s` } as React.CSSProperties}
                >
                  {s.dot ? (
                    <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center">
                      <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                    </span>
                  ) : (
                    <span className="w-1" />
                  )}
                  {s.name}
                </span>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ────────────────── THE BEST FEATURE? THE MARSHALS ────────────────── */}
        <section className="relative bg-gradient-to-b from-[#EFEEF3] to-[#F7F7F6] rounded-t-[32px] sm:rounded-t-[48px] px-5 sm:px-8 pt-20 sm:pt-28 pb-24 sm:pb-32">
          <Reveal className="text-center max-w-xl mx-auto">
            <h2 className="font-serif text-4xl sm:text-5xl md:text-[56px] leading-[1.05] tracking-[-0.015em] text-[#2B2A2A]">
              The best feature?
              <br />
              The marshals.
            </h2>
            <p className="mt-4 text-[15px] text-neutral-500 leading-relaxed">
              Fast and reliable dispatch support.
              <br />
              Helping with bays, EV charging, and a few laughs.
            </p>
          </Reveal>

          <div className="mt-12 sm:mt-14 max-w-md mx-auto space-y-5">
            {[
              { who: "Aline", t: "14:15", m: "I'm at Kigali Heights underground with no signal. Is the DC charger bay free?", me: false, rot: "-2deg" },
              { who: "Eric, Dispatch Lead", t: "14:16", m: "Bay EV-02 is reserved for RAD 892 B. The barrier will lift on its own.", me: true, rot: "1.5deg" },
              { who: "Aline", t: "14:17", m: "Lifted in half a second. Five stars.", me: false, rot: "-1.5deg" },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 180}>
                <div className={`flex items-center gap-3 ${c.me ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ring-4 ring-white shadow-sm ${
                      c.me ? "bg-emerald-600 text-white" : "bg-[#2B2A2A] text-white"
                    }`}
                  >
                    {c.me ? "ER" : "AL"}
                  </div>
                  <div
                    className={`flex-1 rounded-[22px] px-5 py-3.5 shadow-[0_6px_20px_rgba(0,0,0,0.05)] ${
                      c.me ? "bg-white" : "bg-[#ECECEC]"
                    }`}
                    style={{ transform: `rotate(${c.rot})` }}
                  >
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-semibold text-neutral-900">{c.who}</span>
                      <span className="text-neutral-400">{c.t}</span>
                    </div>
                    <p className="mt-0.5 text-[13px] text-neutral-700 leading-snug">{c.m}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ────────────────── FAQ ────────────────── */}
        <section id="faq" className="px-5 sm:px-8 pb-24 sm:pb-32 scroll-mt-20">
          <Reveal className="text-center">
            <Pill>FAQs</Pill>
            <h2 className="mt-5 font-serif text-4xl sm:text-5xl md:text-[56px] leading-[1.05] tracking-[-0.015em] text-[#2B2A2A]">
              Got questions?
              <br />
              Here&apos;s the answers.
            </h2>
          </Reveal>

          <div className="mt-10 sm:mt-12 max-w-[420px] mx-auto space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full text-left flex items-center justify-between gap-4 px-4 py-3.5 font-serif text-[15px] text-neutral-800"
                  >
                    <span>{faq.q}</span>
                    <span
                      className={`w-4 h-4 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 bg-emerald-100" : ""
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </button>
                  <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="px-4 pb-4 text-[13px] text-neutral-500 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ────────────────── CTA: 5 MINUTES + ONE PRICE ────────────────── */}
        <section className="px-5 sm:px-8 pb-20 sm:pb-28">
          <div className="relative max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 items-center">
              {/* Left gradient card */}
              <Reveal className="md:mt-10">
                <div className="relative rounded-[24px] md:rounded-r-none bg-gradient-to-br from-[#D7EFE5] via-[#CFE6EE] to-[#BFD9EE] p-7 sm:p-10 md:pr-32 min-h-[280px]">
                  <h3 className="font-serif text-3xl sm:text-[34px] leading-[1.1] text-[#2B2A2A]">
                    Get parked
                    <br />
                    in 5 minutes
                  </h3>
                  <div className="mt-6 space-y-2 max-w-[220px]">
                    {["Get the app", "Add your plate", "You're cleared!"].map((s, i) => (
                      <div key={s} className="flex items-center gap-3 rounded-xl bg-white/45 backdrop-blur-sm px-3 py-2.5 text-[13px] text-neutral-800">
                        <span className="w-5 text-center text-neutral-500">{i + 1}</span>
                        {s}
                      </div>
                    ))}
                  </div>
                  <span className="absolute left-[150px] sm:left-[180px] bottom-6 sm:bottom-8 -rotate-6 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] text-neutral-800 shadow-[0_6px_16px_rgba(0,0,0,0.1)]">
                    Yes, we timed it.
                    <span className="w-3.5 h-3.5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                      <CheckIcon className="w-2 h-2" />
                    </span>
                  </span>
                </div>
              </Reveal>

              {/* Right dark card */}
              <Reveal delay={120}>
                <div className="relative rounded-[24px] md:rounded-l-none bg-[#232222] pz-grain text-white p-7 sm:p-10 md:pl-32 min-h-[300px] md:min-h-[340px] flex flex-col items-end text-right">
                  <h3 className="font-serif text-3xl sm:text-[34px] leading-[1.1]">
                    One cap,
                    <br />
                    one price.
                  </h3>
                  <div className="mt-6 text-6xl sm:text-7xl font-light tracking-tight leading-none">2,000</div>
                  <div className="mt-1.5 text-xs text-neutral-300">RWF per day, max</div>
                  <a
                    href="#download"
                    className="mt-auto pt-0 inline-flex px-6 py-2.5 rounded-full bg-white text-neutral-900 text-sm font-medium hover:bg-neutral-100 transition-all hover:-translate-y-0.5"
                  >
                    Get the app
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Center tilted phone */}
            <div className="hidden md:block pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[54%] w-[230px] lg:w-[250px] z-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/screenshots/parking-spot-selection.png"
                alt="ParkZone app"
                className="w-full h-auto rotate-[12deg] drop-shadow-[0_30px_40px_rgba(0,0,0,0.3)]"
              />
            </div>
          </div>
        </section>
      </div>

      {/* ══════════════ DARK FOOTER WITH GIANT WORDMARK ══════════════ */}
      <footer className="relative -mt-12 sm:-mt-16 pt-24 sm:pt-32 bg-[#161515] pz-grain text-neutral-400 overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/picon.png" alt="ParkZone" className="w-8 h-8 rounded-lg object-contain" />
            <p className="mt-4 text-xs leading-relaxed text-neutral-500 max-w-[220px]">
              Smart parking and EV charging for the City of Kigali.
            </p>
          </div>

          <div>
            <div className="text-sm font-medium text-white mb-3">The Good</div>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#coverage" className="hover:text-white transition-colors">Coverage</a></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-medium text-white mb-3">The Boring</div>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">City Bylaws</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacy</span></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-medium text-white mb-3">The Apps</div>
            <ul className="space-y-2 text-sm">
              <li><a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">App Store</a></li>
              <li><a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Google Play</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 mt-14 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-600">
          <span>© 2026 ParkZone Rwanda Ltd.</span>
          <span className="flex items-center gap-1.5 text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </span>
        </div>

        <div className="mt-6 sm:mt-10 select-none pointer-events-none">
          <div className="text-center font-sans font-medium text-white leading-[0.78] tracking-[-0.05em] text-[21vw] translate-y-[18%]">
            ParkZone
          </div>
        </div>
      </footer>
    </div>
  );
}
