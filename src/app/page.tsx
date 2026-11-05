"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [selectedPhoneTab, setSelectedPhoneTab] = useState(0);
  const [activeSpotlightTab, setActiveSpotlightTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", contact: "", message: "" });
  const [simulatorState, setSimulatorState] = useState<"idle" | "scanning" | "cleared">("idle");

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: "", contact: "", message: "" });
    }, 4000);
  };

  const triggerSimulator = () => {
    setSimulatorState("scanning");
    setTimeout(() => {
      setSimulatorState("cleared");
      setTimeout(() => setSimulatorState("idle"), 4000);
    }, 1500);
  };

  // 3-Phone Showcase Data (Family.co Image 4 clone)
  const phoneCards = [
    {
      id: "park",
      pillLabel: "Park",
      dotColor: "bg-emerald-500",
      screenSrc: "/screenshots/parking-spot-selection.png",
      tag: "REAL-TIME RESERVATION",
      title: "Smart Bay Guidance",
      subtitle: "Spot H-01 · Kigali Heights · 90° Bay",
      badge: "Reserved · 300 RWF/hr",
    },
    {
      id: "charge",
      pillLabel: "Charge",
      dotColor: "bg-emerald-400",
      screenSrc: "/screenshots/ev-map-navigation.png",
      tag: "60kW RAPID DC",
      title: "EV Supercharging",
      subtitle: "Nyarutarama Station · CCS2 Combo",
      badge: "60 kW Active · 0 RWF Parking",
    },
    {
      id: "pay",
      pillLabel: "Pay",
      dotColor: "bg-neutral-800",
      screenSrc: "/screenshots/parking-history.png",
      tag: "CASHLESS MOMO",
      title: "Instant Digital Receipts",
      subtitle: "MTN MoMo & Airtel Money Checkout",
      badge: "Paid 2,000 RWF · Daily Cap",
    },
  ];

  // 6 Pillars Feature Grid (Family.co Image 3 clone)
  const featurePillars = [
    {
      category: "Send & Navigate",
      title: "Smart Bay Guidance",
      desc: "Flawless essentials. Real-time ultrasonic sensors guide you straight to open stalls at Kigali Heights and downtown without circling the block or creating street congestion.",
    },
    {
      category: "Clean Energy",
      title: "60kW DC Fast Charging",
      desc: "Power up with high-output CCS2 combo connectors while you shop or attend meetings across Kigali, with 0 RWF parking tariffs during active charging sessions.",
    },
    {
      category: "Municipal Protection",
      title: "Automatic 2,000 RWF Daily Cap",
      desc: "Pay 300 RWF per hour transient rates, automatically capped at 2,000 RWF maximum per day. Enjoy unlimited city re-entries with zero surprise penalties.",
    },
    {
      category: "Computer Vision",
      title: "Optical ANPR Gate Clearance",
      desc: "Drive in and out seamlessly. High-speed optical cameras scan your registered Rwandan plate and lift barriers in under 400 milliseconds.",
    },
    {
      category: "Cashless Mobility",
      title: "MTN MoMo & Instant USSD Checkout",
      desc: "Integrated directly with MTN Mobile Money, Airtel Money, and local debit cards for instant automated USSD prompts and compliant digital VAT receipts.",
    },
    {
      category: "National Registry",
      title: "Irembo & Traffic Police Sync",
      desc: "Direct integration with Irembo and Rwanda National Police traffic database keeps your compliance status 100% verified and dispute-free at all times.",
    },
  ];

  // Testimonials (Family.co Friends of Family clone)
  const testimonials = [
    {
      name: "Christian Mugisha",
      handle: "@cmugisha",
      role: "Kigali Tech Commuter",
      text: "The ParkZone app has completely changed driving in Kigali. Finding an open stall at Kigali Heights used to take 20 minutes; now I reserve it before I leave Kimihurura.",
    },
    {
      name: "Aline Uwase",
      handle: "@aline_u",
      role: "EV Motorist (BYD Atto 3)",
      text: "Having live 60 kW DC charger telemetry right on my phone with zero parking surcharge is a dream. The design feels like Apple and Family.co combined.",
    },
    {
      name: "Eric Habimana",
      handle: "@e_habimana",
      role: "Fleet Operations Manager",
      text: "Managing 14 logistics vans across Kigali with automatic 2,000 RWF daily caps and consolidated VAT invoices saved our company hours of accounting every month.",
    },
    {
      name: "Jean-Paul Nsengiyumva",
      handle: "@jp_nsengi",
      role: "Downtown Motorist",
      text: "The 15-minute free grace period and instant MTN MoMo push checkout make quick downtown errands completely frictionless. Zero parking tickets ever since.",
    },
    {
      name: "Diane Gasana",
      handle: "@diane_g",
      role: "Creative Director",
      text: "One of the cleanest digital products built in Rwanda. The UI animations, typography, and micro-interactions make checking into a parking lot feel delightfully modern.",
    },
    {
      name: "Samson Kanimba",
      handle: "@skanimba",
      role: "City Marshal Supervisor",
      text: "The administrative dispatch backend seamlessly mirrors the mobile driver app. Real-time ANPR loop sensors give our team 100% visibility over all bays.",
    },
  ];

  // FAQs
  const faqs = [
    {
      q: "How does the 15-minute free grace period work?",
      a: "Every municipal parking hub and smart street zone in Kigali grants a mandatory 15-minute grace period. If you drop off a passenger, pick up an order, or exit within 15 minutes, the ANPR camera gate verifies your stay and your ticket balance remains exactly 0 RWF.",
    },
    {
      q: "How does the 2,000 RWF daily commuter cap protect drivers?",
      a: "Under City of Kigali mobility statutory regulations, all transient parking fees accumulate at 300 RWF per hour but automatically freeze the moment your total reaches 2,000 RWF. You enjoy unlimited city re-entries, full overnight parking protection, and zero surprise fines.",
    },
    {
      q: "Can I charge my electric vehicle without paying parking fees?",
      a: "Yes. All designated EV fast-charging stations (such as Nyarutarama EV Hub) waive parking tariffs entirely during active charging sessions. Motorists pay only the statutory electricity rate (250 RWF/kWh or 9k/10k flat quick-charge), with 0 RWF charged for parking.",
    },
    {
      q: "How do MTN MoMo and Airtel Money checkouts work?",
      a: "When you scan your parking bay QR code or enter your license plate in the app, you receive an automated USSD push prompt directly on your phone. Simply enter your mobile money PIN to complete payment with instant digital receipts recorded.",
    },
    {
      q: "How do I check or dispute a parking citation?",
      a: "Enter your vehicle plate in the ParkZone mobile app or web portal to view your real-time standing. Any statutory fine logged by marshals is linked directly to Irembo, where you can inspect timestamps, photos, and resolve arrears instantly.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] font-sans antialiased selection:bg-neutral-900 selection:text-white">
      {/* ────────────────── 1. FLOATING PILL NAVBAR (FAMILY.CO EXACT STYLE) ────────────────── */}
      <header className="fixed top-5 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
        <div className="max-w-4xl mx-auto backdrop-blur-xl bg-white/85 border border-neutral-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-full px-5 py-2.5 flex items-center justify-between pointer-events-auto transition-all">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform">
              <span className="font-black text-xs tracking-tighter">P</span>
            </div>
            <span className="font-extrabold text-sm tracking-tight text-neutral-900 flex items-center gap-1.5">
              ParkZone
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-600">
            <a href="#overview" className="hover:text-black transition-colors">
              Overview
            </a>
            <a href="#explore" className="hover:text-black transition-colors">
              Pillars
            </a>
            <a href="#spotlight" className="hover:text-black transition-colors">
              Experience
            </a>
            <a href="#community" className="hover:text-black transition-colors">
              Community
            </a>
            <a href="#faq" className="hover:text-black transition-colors">
              FAQs
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-2xs hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ────────────────── 2. HERO SECTION WITH SIGNATURE FLOATING BADGES (IMAGE 1 CLONE) ────────────────── */}
      <section id="overview" className="relative pt-36 pb-24 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Floating Badges Left Side (Floating animations) */}
        <div className="hidden lg:block absolute left-4 top-40 w-72 pointer-events-auto">
          {/* Badge 1: Smart Bay Pill */}
          <div className="animate-float-slow absolute top-0 left-4 bg-white p-3 rounded-2xl border border-neutral-200/90 shadow-[0_12px_30px_rgba(0,0,0,0.08)] flex items-center gap-3 hover:scale-105 hover:-rotate-2 transition-all cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
              P-04
            </div>
            <div>
              <div className="text-[11px] font-bold text-neutral-900 flex items-center gap-1.5">
                Kigali Heights Bay
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[10px] text-neutral-500 font-medium">300 RWF/hr · Free</div>
            </div>
          </div>

          {/* Badge 2: ANPR Vehicle Cleared */}
          <div className="animate-float-medium absolute top-28 left-12 bg-white px-3.5 py-2.5 rounded-2xl border border-neutral-200/90 shadow-[0_10px_24px_rgba(0,0,0,0.06)] flex items-center gap-2.5 hover:scale-105 transition-all cursor-pointer">
            <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-xs font-black">
              ✓
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-neutral-900 tracking-tight">RAD 892 B</div>
              <div className="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider">ANPR Verified · 0.4s</div>
            </div>
          </div>

          {/* Badge 3: 2K Commuter Cap Pill */}
          <div className="animate-float-fast absolute top-56 left-2 bg-emerald-50 px-3.5 py-2 rounded-full border border-emerald-200 shadow-2xs flex items-center gap-2 hover:scale-105 hover:rotate-2 transition-all cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold text-emerald-900">2,000 RWF Daily Cap</span>
          </div>

          {/* Badge 4: 15-minute Grace Period */}
          <div className="animate-float-reverse absolute top-76 left-16 bg-neutral-900 text-white px-3.5 py-1.5 rounded-full shadow-md text-[10px] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>15m Free Grace Period</span>
          </div>
        </div>

        {/* Floating Badges Right Side (Floating animations) */}
        <div className="hidden lg:block absolute right-4 top-40 w-72 pointer-events-auto">
          {/* Badge 5: 60kW DC Fast Charge */}
          <div className="animate-float-medium absolute top-4 right-6 bg-white p-3 rounded-2xl border border-neutral-200/90 shadow-[0_12px_30px_rgba(0,0,0,0.08)] flex items-center gap-3 hover:scale-105 hover:rotate-2 transition-all cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0">
              ⚡
            </div>
            <div>
              <div className="text-[11px] font-bold text-neutral-900">60kW Fast DC</div>
              <div className="text-[10px] text-emerald-600 font-semibold">82% Charged · CCS2</div>
            </div>
          </div>

          {/* Badge 6: MTN MoMo Instant Pill */}
          <div className="animate-float-slow absolute top-32 right-12 bg-white px-3.5 py-2.5 rounded-2xl border border-neutral-200/90 shadow-[0_10px_24px_rgba(0,0,0,0.06)] flex items-center gap-2.5 hover:scale-105 transition-all cursor-pointer">
            <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-extrabold">
              M
            </div>
            <div>
              <div className="text-[11px] font-bold text-neutral-900">MTN MoMo</div>
              <div className="text-[9px] text-neutral-400 font-semibold">Instant USSD · 0 Fees</div>
            </div>
          </div>

          {/* Badge 7: Kigali Heights Live Count */}
          <div className="animate-float-fast absolute top-60 right-4 bg-white px-3.5 py-2 rounded-full border border-neutral-200/90 shadow-2xs flex items-center gap-2 hover:scale-105 hover:-rotate-2 transition-all cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-neutral-800">Kigali Heights · 14 Free</span>
          </div>

          {/* Badge 8: Ultrasonic Loop Sensor */}
          <div className="animate-float-reverse absolute top-80 right-14 bg-neutral-100 border border-neutral-200/80 px-3 py-1.5 rounded-full text-[10px] font-semibold text-neutral-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
            <span>Ultrasonic Loop Telemetry</span>
          </div>
        </div>

        {/* Center Typography & Primary CTA */}
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 mb-6 text-xs font-semibold text-neutral-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Kigali Smart Mobility Network</span>
            <span className="text-neutral-300">·</span>
            <span className="text-neutral-500 font-medium">ANPR Telemetry Active</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-900 leading-[1.08]">
            Your favorite <br />
            parking app.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed">
            Explore Kigali with the best parking &amp; EV charging app for iOS. Interacting with city mobility has never been so simple.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="px-7 py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2.5 hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.67-.82 1.13-1.96 1-3.1-.98.04-2.17.65-2.87 1.47-.62.72-1.16 1.88-1.01 2.99 1.1.08 2.21-.54 2.88-1.36z"/>
              </svg>
              <span>Download on iOS</span>
            </Link>

            <a
              href="#explore"
              className="px-7 py-3.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Watch the Demo</span>
            </a>
          </div>
        </div>
      </section>

      {/* ────────────────── 3. EXPLORE KIGALI IN A WHOLE NEW WAY (IMAGE 2 CLONE - 6 CARDS GRID) ────────────────── */}
      <section id="explore" className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-100">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">
            Explore Kigali in a whole new way.
          </h2>
          <p className="text-sm text-neutral-500 mt-3 font-normal">
            Precision engineering, seamless gate loops, and total transparency built for Rwandan drivers.
          </p>
        </div>

        {/* 6 Cards Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Easy (Dark Interactive Stack) */}
          <div className="p-7 rounded-[32px] bg-[#fbfbfb] border border-neutral-200/70 hover:border-black transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between group">
            {/* Visual: Stacked action items */}
            <div className="bg-[#121417] text-white rounded-2xl p-4 space-y-2.5 shadow-sm">
              <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  P
                </div>
                <div>
                  <div className="text-xs font-bold leading-none">Park</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Find &amp; reserve monitored spaces.</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-7 h-7 rounded-full bg-neutral-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  ⚡
                </div>
                <div>
                  <div className="text-xs font-bold leading-none">Charge</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">60kW high-speed DC chargers.</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  ↓
                </div>
                <div>
                  <div className="text-xs font-bold leading-none">Pay</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Cashless MTN MoMo auto-receipts.</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-7 h-7 rounded-full bg-black border border-emerald-500 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold leading-none">Protect</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">2,000 RWF daily commuter cap.</div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight">Easy</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Whether you&apos;re a daily commuter or weekend driver, ParkZone makes it easy.
              </p>
            </div>
          </div>

          {/* Card 2: Secure (Protected 2K Cap Pulse Button) */}
          <div className="p-7 rounded-[32px] bg-[#fbfbfb] border border-neutral-200/70 hover:border-black transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between">
            <div className="h-44 flex items-center justify-center">
              <div className="animate-pulse-ring px-6 py-3 rounded-full border-2 border-emerald-500 bg-white text-emerald-600 font-extrabold text-sm tracking-wide shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>2,000 RWF Cap Active</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight">Secure</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Your wallet, protected. Automatic statutory caps prevent unexpected parking costs.
              </p>
            </div>
          </div>

          {/* Card 3: Fast (0.4s Optical ANPR Stepper) */}
          <div className="p-7 rounded-[32px] bg-[#fbfbfb] border border-neutral-200/70 hover:border-black transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between">
            <div className="h-44 flex items-center justify-center">
              <div className="w-full max-w-[220px] bg-white rounded-2xl p-4 border border-neutral-200/70 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Optical Read (RAD 892B)</span>
                </div>
                <div className="w-full h-0.5 bg-neutral-100 ml-1">
                  <div className="w-full h-full bg-emerald-500" />
                </div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Ultrasonic Loop Verified</span>
                </div>
                <div className="w-full h-0.5 bg-neutral-100 ml-1">
                  <div className="w-full h-full bg-emerald-500" />
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Gate Lifted · 0.4s</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight">Fast</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Uncompromising speed. Optimal performance and seamless gate transit all the time.
              </p>
            </div>
          </div>

          {/* Card 4: Powerful (Telemetry Gauge) */}
          <div className="p-7 rounded-[32px] bg-[#fbfbfb] border border-neutral-200/70 hover:border-black transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between">
            <div className="h-44 flex items-center justify-center">
              <div className="bg-white rounded-2xl p-4 border border-neutral-200/70 shadow-2xs w-full max-w-[220px] text-center">
                <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  Live Station Telemetry
                </div>
                <div className="text-xl font-extrabold text-neutral-900 mt-1 flex items-center justify-center gap-1.5">
                  <span>60 kW DC</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200">
                    82%
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">~ 14 mins to full charge</div>
                <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden mt-3">
                  <div className="w-[82%] h-full bg-emerald-500 rounded-full" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight">Powerful</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Experience the full power of real-time bay telemetry with advanced municipal controls.
              </p>
            </div>
          </div>

          {/* Card 5: Delightful (Vehicle Avatar Chips) */}
          <div className="p-7 rounded-[32px] bg-[#fbfbfb] border border-neutral-200/70 hover:border-black transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between">
            <div className="h-44 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shadow-md hover:scale-110 transition-transform cursor-pointer">
                  EV
                </div>
                <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center font-extrabold text-sm shadow-md hover:scale-110 transition-transform cursor-pointer ring-4 ring-emerald-100">
                  SUV
                </div>
                <div className="w-12 h-12 rounded-full bg-neutral-200 text-neutral-800 flex items-center justify-center font-bold text-xs shadow-md hover:scale-110 transition-transform cursor-pointer">
                  VAN
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight">Delightful</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                ParkZone takes precision seriously. Delightful interactions with every tap and visit.
              </p>
            </div>
          </div>

          {/* Card 6: Seamless (Instant QR Pass Scanner) */}
          <div className="p-7 rounded-[32px] bg-[#fbfbfb] border border-neutral-200/70 hover:border-black transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between">
            <div className="h-44 flex items-center justify-center">
              <div className="relative w-36 h-28 bg-white border border-neutral-300 rounded-2xl shadow-2xs p-3 overflow-hidden flex flex-col items-center justify-center">
                {/* Laser scan line animation */}
                <div className="animate-scan-line absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                <div className="text-[10px] font-extrabold text-neutral-900 tracking-wider">GATE PASS QR</div>
                <div className="text-[9px] text-neutral-400 mt-0.5">Tap or Scan at Stalls</div>
                <div className="mt-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-200">
                  Instant MoMo
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight">Seamless</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Instant MTN MoMo USSD push checkout with zero paper ticket waste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── 4. PARK, CHARGE, COMMUTE. ALL IN ONE PLACE. (IMAGE 4 CLONE - 3 PHONES) ────────────────── */}
      <section className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-100">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">
            Park, charge, commute. <br />
            All in one place.
          </h2>
          <p className="text-sm text-neutral-500 mt-3 font-normal">
            Three unified mobile capabilities designed for modern motorists in Rwanda.
          </p>
        </div>

        {/* 3 Side-by-Side Phone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {phoneCards.map((card, idx) => {
            const isSelected = selectedPhoneTab === idx;
            return (
              <div
                key={card.id}
                onClick={() => setSelectedPhoneTab(idx)}
                className={`flex flex-col items-center cursor-pointer transition-all duration-300 group ${
                  isSelected ? "scale-[1.03]" : "opacity-85 hover:opacity-100"
                }`}
              >
                {/* Realistic Phone Bezel */}
                <div
                  className={`w-full max-w-[280px] rounded-[44px] p-2.5 bg-neutral-900 border-[7px] border-neutral-900 shadow-xl transition-all duration-300 ${
                    isSelected ? "ring-4 ring-neutral-900 shadow-2xl" : "hover:shadow-2xl"
                  }`}
                >
                  {/* Speaker Notch */}
                  <div className="w-20 h-3.5 bg-neutral-900 rounded-full mx-auto mb-2" />

                  {/* Screen Frame */}
                  <div className="relative rounded-[32px] overflow-hidden bg-white aspect-[9/19]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.screenSrc}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Floating Overlay Badge */}
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-2.5 border border-neutral-200/80 shadow-md">
                      <div className="text-[10px] font-bold text-neutral-900 truncate">{card.title}</div>
                      <div className="text-[9px] text-emerald-700 font-semibold">{card.badge}</div>
                    </div>
                  </div>
                </div>

                {/* Pill Tab Selector Below (Family.co exact interactive style) */}
                <button
                  type="button"
                  onClick={() => setSelectedPhoneTab(idx)}
                  className={`mt-6 px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? "bg-black text-white shadow-md scale-105"
                      : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${card.dotColor}`} />
                  <span>{card.pillLabel}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* ────────────────── 5. 6-FEATURE DETAIL BREAKDOWN (IMAGE 3 CLONE) ────────────────── */}
        <div className="mt-20 pt-16 border-t border-neutral-100 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {featurePillars.map((feat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="text-xs font-bold text-emerald-600 tracking-wide">
                  {feat.category}
                </div>
                <h4 className="text-base font-extrabold text-neutral-900">
                  {feat.title}
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── 6. FEATURE SPOTLIGHT WITH IPHONE BEZEL & PILL TAGS (IMAGE 5 CLONE) ────────────────── */}
      <section id="spotlight" className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Large iPhone Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] rounded-[52px] p-3 bg-neutral-900 border-[8px] border-neutral-900 shadow-[0_30px_70px_rgba(0,0,0,0.25)]">
              {/* Dynamic Island Notch */}
              <div className="w-24 h-4 bg-neutral-900 rounded-full mx-auto mb-2" />

              <div className="relative rounded-[40px] overflow-hidden bg-white aspect-[9/19]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/screenshots/ev-map-navigation.png"
                  alt="Spotlight Preview"
                  className="w-full h-full object-cover"
                />

                {/* Floating Live Telemetry Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-neutral-200 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500">
                      Nyarutarama EV Hub
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <div className="text-xs font-black text-neutral-900 mt-0.5">
                    CCS2 Combo · 60 kW Fast Output
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Category, Title, Subtitle, Pill Grid & Demo Banner */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-600 tracking-wide uppercase">
                Seamless
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight mt-1 leading-tight">
                The best way to navigate Kigali parking.
              </h2>
              <p className="text-sm text-neutral-500 mt-4 leading-relaxed font-normal">
                View parking in its ideal intended format. Full rich telemetry no matter the station, from underground multi-tier commercial hubs to rapid street stalls.
              </p>
            </div>

            {/* Pill Tags Grid (2 columns, 6 pills with clean SVG icons) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs font-bold text-neutral-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Real-time Bay Sensors</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs font-bold text-neutral-800">
                <span className="w-2 h-2 rounded-full bg-neutral-900" />
                <span>60kW DC Rapid Hubs</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs font-bold text-neutral-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Automatic ANPR Cameras</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs font-bold text-neutral-800">
                <span className="w-2 h-2 rounded-full bg-neutral-900" />
                <span>MTN &amp; Airtel MoMo</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs font-bold text-neutral-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>2,000 RWF Commuter Cap</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs font-bold text-neutral-800">
                <span className="w-2 h-2 rounded-full bg-neutral-900" />
                <span>Ultrasonic Loop Telemetry</span>
              </div>
            </div>

            {/* Interactive Demo Simulator Banner */}
            <div className="p-4 rounded-2xl bg-neutral-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center font-bold text-emerald-400 shrink-0">
                  {simulatorState === "scanning" ? "..." : simulatorState === "cleared" ? "✓" : "⚡"}
                </div>
                <div>
                  <div className="text-xs font-bold">
                    {simulatorState === "scanning"
                      ? "ANPR Scanning Plate..."
                      : simulatorState === "cleared"
                      ? "Gate Lifted · Barrier Free"
                      : "Municipal Gate Sensor Simulator"}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {simulatorState === "cleared"
                      ? "Cleared under 15m grace period (0 RWF)"
                      : "Simulate a live vehicle arrival at Kigali Heights"}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={triggerSimulator}
                disabled={simulatorState !== "idle"}
                className="px-4 py-2 rounded-xl bg-white text-neutral-900 text-xs font-bold hover:bg-neutral-100 transition-all shrink-0 disabled:opacity-50"
              >
                {simulatorState === "idle" ? "Simulate Arrival" : "Processing..."}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── 7. FRIENDS OF PARKZONE (INFINITE AUTO-SCROLLING MARQUEE) ────────────────── */}
      <section id="community" className="py-24 bg-[#FAFAFA] border-y border-neutral-100 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Friends of ParkZone
            </h2>
            <p className="text-xs text-neutral-500 mt-1 font-normal">
              See what motorists, EV owners, and city marshals are saying across Kigali.
            </p>
          </div>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-semibold border border-neutral-200 transition-all flex items-center gap-2 self-start sm:self-auto shadow-2xs"
          >
            <span>Follow @ParkZoneRw</span>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>

        {/* Infinite Marquee Track */}
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee gap-6 py-2 px-4">
            {/* Repeat testimonials twice to enable infinite smooth wrap */}
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div
                key={idx}
                className="w-[340px] sm:w-[400px] shrink-0 p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 text-white font-extrabold text-xs flex items-center justify-center">
                      {t.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900">{t.name}</div>
                      <div className="text-[10px] text-neutral-400 font-medium">{t.handle} · {t.role}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-4 leading-relaxed font-normal">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── 8. REGULATED PRICING & DISPATCH ────────────────── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
            Official Municipal Rates
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mt-3">
            Transparent, regulated mobility tariffs.
          </h2>
          <p className="text-xs text-neutral-500 mt-2">
            Standardized rates approved by the City of Kigali. Zero surge fees, zero predatory fines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Transient */}
          <div className="p-7 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs hover:border-black transition-all flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Hourly Transient</div>
              <div className="text-3xl font-black text-neutral-900 mt-2">
                300 <span className="text-xs font-semibold text-neutral-500">RWF / hr</span>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Standard transient parking across all City of Kigali streets and commercial facilities.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-neutral-600 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> 15-minute free grace period
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> ANPR optical plate recognition
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> Instant MTN MoMo push checkout
                </li>
              </ul>
            </div>
            <Link
              href="/login"
              className="mt-8 w-full py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold transition-all text-center"
            >
              Start Session
            </Link>
          </div>

          {/* Commuter Cap */}
          <div className="p-7 rounded-3xl bg-neutral-900 text-white border border-neutral-900 shadow-xl flex flex-col justify-between relative ring-2 ring-emerald-500">
            <span className="absolute -top-3 right-6 bg-emerald-500 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
              Statutory Protection
            </span>
            <div>
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Daily Commuter Cap</div>
              <div className="text-3xl font-black text-white mt-2">
                2,000 <span className="text-xs font-semibold text-neutral-400">RWF / day</span>
              </div>
              <p className="text-xs text-neutral-300 mt-2">
                Fees automatically freeze once reaching 2,000 RWF within any 24-hour cycle.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-neutral-200 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Unlimited re-entries across all hubs
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Overnight parking protection
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Zero fine risk on long meetings
                </li>
              </ul>
            </div>
            <Link
              href="/login"
              className="mt-8 w-full py-2.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-bold transition-all text-center"
            >
              Activate Cap
            </Link>
          </div>

          {/* Fleet Operations */}
          <div className="p-7 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs hover:border-black transition-all flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Commercial Fleet</div>
              <div className="text-3xl font-black text-neutral-900 mt-2">
                Custom <span className="text-xs font-semibold text-neutral-500">Corporate</span>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Tailored for logistics operators, delivery fleets, and corporate office parks.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-neutral-600 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> Centralized company billing
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> Automated VAT EBM v2 receipts
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> Priority EV charger reservation
                </li>
              </ul>
            </div>
            <a
              href="#contact"
              className="mt-8 w-full py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold transition-all text-center"
            >
              Contact Dispatch
            </a>
          </div>
        </div>
      </section>

      {/* ────────────────── 9. DIRECT DISPATCH CONTACT FORM ────────────────── */}
      <section id="contact" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-neutral-100">
        <div className="bg-[#fbfbfb] border border-neutral-200/80 rounded-[36px] p-8 sm:p-12">
          <div className="max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              City Authority Support
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-2">
              Speak with Municipal Dispatch
            </h2>
            <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
              Have inquiries regarding commercial bay allocations, citation disputes, or fleet onboarding? Our team is on standby 24/7.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="mt-8 space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Christian Mugisha"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Phone or Email</label>
                <input
                  type="text"
                  required
                  placeholder="+250 788 000 000"
                  value={contactForm.contact}
                  onChange={(e) => setContactForm({ ...contactForm, contact: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Inquiry or Citation Details</label>
              <textarea
                rows={3}
                required
                placeholder="Include vehicle plate or station name..."
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black transition-colors resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-neutral-400">
                Direct phone: <strong className="text-neutral-700">+250 788 123 456</strong>
              </div>
              <button
                type="submit"
                disabled={contactSubmitted}
                className="px-6 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              >
                {contactSubmitted ? "Message Dispatched ✓" : "Send Inquiry"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ────────────────── 10. INTERACTIVE FAQS ────────────────── */}
      <section id="faq" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-neutral-100">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-neutral-500 mt-2">
            Everything you need to know about parking tariffs, EV charging, and city regulations.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-neutral-900 hover:text-black"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg font-light text-neutral-400 shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-neutral-500 leading-relaxed border-t border-neutral-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ────────────────── 11. PRE-FOOTER BANNER ────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="rounded-[40px] bg-neutral-900 text-white p-10 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Ready to experience effortless parking?
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-3">
              Download ParkZone today.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-4 leading-relaxed font-normal">
              Available across iOS, Android, and web. Join thousands of Kigali drivers enjoying 0.4s optical barrier entry and guaranteed daily commuter caps.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="px-7 py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 text-xs sm:text-sm font-bold transition-all shadow-md hover:scale-105 active:scale-95"
              >
                Download on iOS
              </Link>
              <Link
                href="/admin"
                className="px-7 py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95"
              >
                Open Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── 12. MINIMALIST 4-COLUMN FOOTER ────────────────── */}
      <footer className="border-t border-neutral-200 py-12 px-4 sm:px-6 text-xs text-neutral-500 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="font-extrabold text-neutral-900 mb-3 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">P</div>
              ParkZone
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-400">
              City of Kigali Municipal Mobility Authority. Seamless parking &amp; EV fast charging infrastructure.
            </p>
          </div>

          <div>
            <div className="font-bold text-neutral-900 mb-2">Platform</div>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#overview" className="hover:text-black">iOS Mobile App</a></li>
              <li><a href="#overview" className="hover:text-black">Android Mobile App</a></li>
              <li><Link href="/admin" className="hover:text-black">Admin Dispatch Portal</Link></li>
              <li><a href="#pricing" className="hover:text-black">Statutory Tariffs</a></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-neutral-900 mb-2">Network</div>
            <ul className="space-y-1.5 text-[11px]">
              <li><span className="hover:text-black cursor-pointer">Kigali Heights Underground</span></li>
              <li><span className="hover:text-black cursor-pointer">Kigali Convention Hub</span></li>
              <li><span className="hover:text-black cursor-pointer">Nyarutarama EV Fast Hub</span></li>
              <li><span className="hover:text-black cursor-pointer">Downtown Commercial Grid</span></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-neutral-900 mb-2">Compliance</div>
            <ul className="space-y-1.5 text-[11px]">
              <li><span className="hover:text-black cursor-pointer">City of Kigali Bylaws</span></li>
              <li><span className="hover:text-black cursor-pointer">Rwanda Police ANPR Sync</span></li>
              <li><span className="hover:text-black cursor-pointer">Irembo Fines Settlement</span></li>
              <li><span className="hover:text-black cursor-pointer">Privacy &amp; Terms</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-400">
          <div>© {new Date().getFullYear()} ParkZone Rwanda Ltd. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>Kigali, Rwanda</span>
            <span>·</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
