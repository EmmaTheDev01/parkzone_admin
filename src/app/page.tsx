"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [selectedHeroScreen, setSelectedHeroScreen] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", contact: "", message: "" });

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

  // Real App Screenshots uploaded by user
  const appScreens = [
    {
      id: "hub",
      title: "Kigali Convention Hub",
      subtitle: "3 of 3 Bays Open · KG 2 Roundabout",
      src: "/screenshots/kigali-convention-park.png",
      tag: "PARKING HUB",
      chip1: "Verified Municipal Hub",
      chip2: "300 RWF/hr Standard Rate",
    },
    {
      id: "spot",
      title: "Spot H-01 Reservation",
      subtitle: "90° Perpendicular · Floor 1-4 Grid",
      src: "/screenshots/parking-spot-selection.png",
      tag: "BAY ALLOCATION",
      chip1: "Spot H-01 Selected",
      chip2: "2h Duration Scheduled",
    },
    {
      id: "ev-map",
      title: "Live EV Navigation Map",
      subtitle: "Nyarutarama EV Fast Charging · 60kW CCS2",
      src: "/screenshots/ev-map-navigation.png",
      tag: "GPS & EV MAP",
      chip1: "60 kW CCS2 Online",
      chip2: "11.3 km · 17 min Route",
    },
    {
      id: "telemetry",
      title: "3D Vehicle Telemetry",
      subtitle: "Plate RAJ 778 Z · 100% Battery Level",
      src: "/screenshots/vehicle-telemetry.png",
      tag: "VEHICLE TELEMETRY",
      chip1: "100% Battery Level",
      chip2: "Verified Rwanda Plate",
    },
    {
      id: "history",
      title: "Parking History & MoMo",
      subtitle: "Active Session & Digital Receipts",
      src: "/screenshots/parking-history.png",
      tag: "SESSION & RECEIPTS",
      chip1: "Instant MoMo Receipt",
      chip2: "QR Bay Scan Ready",
    },
  ];

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

  return (
    <div className="min-h-screen bg-[#FBFAF9] text-[#1a1a1a] font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* ────────────────── 1. FLOATING PILL NAVBAR (FAMILY.CO STYLE) ────────────────── */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
        <div className="max-w-4xl mx-auto backdrop-blur-xl bg-white/90 border border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full px-5 py-2.5 flex items-center justify-between pointer-events-auto transition-all">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white shadow-xs">
              <span className="font-extrabold text-xs tracking-tighter">P</span>
            </div>
            <span className="font-extrabold text-sm tracking-tight text-neutral-900 flex items-center gap-1.5">
              ParkZone
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-600">
            <a href="#features" className="hover:text-black transition-colors">
              Features
            </a>
            <a href="#details" className="hover:text-black transition-colors">
              Details
            </a>
            <a href="#pricing" className="hover:text-black transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="hover:text-black transition-colors">
              Community
            </a>
            <a href="#faq" className="hover:text-black transition-colors">
              FAQs
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:text-black transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/admin"
              className="px-4 py-1.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Admin Portal</span>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </header>

      {/* ────────────────── 2. HERO SECTION (TYPOGRAPHY & INTERACTIVE DEVICE) ────────────────── */}
      <section className="pt-32 pb-20 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200/80 shadow-2xs mb-6 text-xs font-semibold text-neutral-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Kigali Smart Mobility Network</span>
          <span className="text-neutral-300">·</span>
          <span className="text-emerald-700 font-bold">15m Free Grace Period</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-900 max-w-4xl mx-auto leading-[1.08]">
          Your favorite <br className="hidden sm:inline" />
          parking &amp; mobility app.
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Explore Kigali with the smartest parking and EV charging network. Real-time bay occupancy, 60kW rapid charging, and automated daily commuter caps.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="px-6 py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.67-.82 1.13-1.96 1-3.1-.98.04-2.17.65-2.87 1.47-.62.72-1.16 1.88-1.01 2.99 1.1.08 2.21-.54 2.88-1.36z"/>
            </svg>
            <span>Download on iOS</span>
          </Link>
          <a
            href="#features"
            className="px-6 py-3.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 text-xs sm:text-sm font-bold border border-neutral-200/90 transition-all shadow-2xs hover:scale-[1.02]"
          >
            Explore Interactive Demo
          </a>
        </div>

        {/* ────────────────── INTERACTIVE APP SHOWCASE (PHONE FRAME) ────────────────── */}
        <div className="mt-14 relative max-w-4xl mx-auto">
          {/* Ambient Soft Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/50 via-transparent to-transparent rounded-[60px] filter blur-3xl -z-10" />

          {/* Interactive Screen Selector Pill Tabs */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap mb-8">
            {appScreens.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setSelectedHeroScreen(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedHeroScreen === idx
                    ? "bg-black text-white shadow-xs scale-105"
                    : "bg-white text-neutral-600 hover:text-black border border-neutral-200/70"
                }`}
              >
                {s.title.split(" ")[0]} {s.title.split(" ")[1] || ""}
              </button>
            ))}
          </div>

          {/* Phone Display Mockup */}
          <div className="relative mx-auto max-w-[320px] sm:max-w-[360px] rounded-[48px] p-3 bg-neutral-900 border-[8px] border-neutral-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]">
            {/* Phone Speaker Notch */}
            <div className="w-24 h-4 bg-neutral-900 rounded-full mx-auto mb-2" />

            <div className="relative rounded-[36px] overflow-hidden bg-white aspect-[9/19.5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={appScreens[selectedHeroScreen].src}
                alt={appScreens[selectedHeroScreen].title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>

            {/* Floating Live Pill 1: Top Left */}
            <div className="absolute -top-4 -left-6 sm:-left-16 bg-white text-neutral-900 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-neutral-200 flex items-center gap-1.5 whitespace-nowrap animate-bounce duration-1000">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{appScreens[selectedHeroScreen].chip1}</span>
            </div>

            {/* Floating Live Pill 2: Bottom Right */}
            <div className="absolute -bottom-4 -right-6 sm:-right-16 bg-black text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{appScreens[selectedHeroScreen].chip2}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── 3. EXPLORE IN A WHOLE NEW WAY (4 PILLARS) ────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-neutral-200/60">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Smart Kigali Mobility
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mt-3">
            Explore Kigali in a whole new way.
          </h2>
          <p className="text-sm text-neutral-500 mt-2">
            No paper tickets, no surprise penalties, and no guesswork. Four pillars designed for effortless city transit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs space-y-2 hover:border-black transition-all">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-extrabold text-base text-neutral-900">Park</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Reserve stalls with the fewest taps, or glide through ANPR camera gates with instant plate recognition.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs space-y-2 hover:border-black transition-all">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-extrabold text-base text-neutral-900">Charge</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Locate 60kW DC rapid EV chargers with live kilowatt draw telemetry and 0 RWF parking surcharge.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs space-y-2 hover:border-black transition-all">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-extrabold text-base text-neutral-900">Pay</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Tapless mobile checkout via MTN MoMo and Airtel Money with automatic receipts and zero queuing.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs space-y-2 hover:border-black transition-all">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="font-extrabold text-base text-neutral-900">Protect</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              15-minute free grace period, statutory 2,000 RWF daily cap, and blind-hash plate security.
            </p>
          </div>
        </div>
      </section>

      {/* ────────────────── 4. BENTO PRODUCT SHOWCASE (PARK, CHARGE, PAY) ────────────────── */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
            Park, charge, pay. <br />
            All in one place.
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 mt-3">
            Flawless essentials. Easily reserve spots with the fewest taps, or share your digital QR pass to enter and exit gated municipal facilities.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Card 1: Live Bay Navigation (Span 7) */}
          <div className="md:col-span-7 p-8 rounded-[36px] bg-white border border-neutral-200/90 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                ULTRASONIC SENSOR TELEMETRY
              </span>
              <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                Live Space Navigation &amp; Allocation
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-md">
                IoT ultrasonic loop detectors and overhead camera sensors guide you straight to vacant stalls across Kigali Convention Centre, Kigali Heights, and Downtown CBD.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-neutral-200/80 bg-[#f8f9fa] p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/screenshots/kigali-convention-park.png"
                alt="Parking Navigation"
                className="w-full h-56 object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Bento Card 2: 2,000 RWF Commuter Cap (Span 5) */}
          <div className="md:col-span-5 p-8 rounded-[36px] bg-black text-white shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Statutory Ceiling
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Automated 2,000 RWF Commuter Cap
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Hourly transient fees (300 RWF/hr) freeze the moment you reach 2,000 RWF. Enjoy unlimited re-entries, 24-hour protection, and zero surprise penalties.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Standard Transient</span>
                <span>300 RWF/hr</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-400 text-sm">
                <span>Maximum Daily Ceiling</span>
                <span>2,000 RWF</span>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Rapid EV Fast-Charging (Span 6) */}
          <div className="md:col-span-6 p-8 rounded-[36px] bg-white border border-neutral-200/90 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                OCPP 2.0.1 PROTOCOL
              </span>
              <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                Rapid EV Fast Charging Network
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                Locate high-speed 60kW CCS2 and Type 2 charging bays. View live power output in kW, battery percentage, and 0 RWF parking during charging.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-neutral-200/80 bg-[#f8f9fa] p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/screenshots/ev-map-navigation.png"
                alt="EV Map Navigation"
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Bento Card 4: 3D Vehicle Telemetry & Zero Arrears (Span 6) */}
          <div className="md:col-span-6 p-8 rounded-[36px] bg-white border border-neutral-200/90 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                BLIND-HASH PRIVACY
              </span>
              <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                Vehicle Telemetry &amp; Zero Arrears
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                Register your Rwanda license plate with cryptographic hash enforcement. Track battery state-of-charge, check-ins, and confirm clean standing with Irembo.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-neutral-200/80 bg-[#f8f9fa] p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/screenshots/vehicle-telemetry.png"
                alt="Vehicle Telemetry"
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── 5. DETAILS THAT MATTER (SIGNATURE FAMILY.CO SECTION) ────────────────── */}
      <section id="details" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-200/60">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Details that matter.
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 mt-2">
            We sweat the details, no matter how small.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Detail Card 1 */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
              01 · Live Telemetry
            </span>
            <h3 className="font-extrabold text-base text-neutral-900">
              Monitor In Real-Time
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Track the status of your parking session in real-time, with live minute updates, duration timers, notifications, and smooth state transitions.
            </p>
          </div>

          {/* Detail Card 2 */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full inline-block">
              02 · Blind-Hash Protection
            </span>
            <h3 className="font-extrabold text-base text-neutral-900">
              Protect Your Vehicle
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Understand every fee before you depart. Receive warnings about statutory limits and get full verification of clean citation standing with Irembo.
            </p>
          </div>

          {/* Detail Card 3 */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full inline-block">
              03 · Smart Wallet
            </span>
            <h3 className="font-extrabold text-base text-neutral-900">
              Organise Your Trips
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Take full control over your mobility budget. Automatic daily caps at 2,000 RWF, multi-vehicle management, and downloadable corporate VAT receipts.
            </p>
          </div>

          {/* Detail Card 4 */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full inline-block">
              04 · Clear Telemetry
            </span>
            <h3 className="font-extrabold text-base text-neutral-900">
              See Everything Clearly
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Alleviate all confusion with crystal-clear breakdowns of facilities, underground floor topologies, and live kilowatt EV power delivery.
            </p>
          </div>
        </div>
      </section>

      {/* ────────────────── 6. FRIENDS OF PARKZONE (TESTIMONIALS) ────────────────── */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-200/60">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Friends of ParkZone
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 mt-2">
            See what Kigali motorists, EV drivers, and fleet operators are saying.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs space-y-4 hover:border-black transition-all flex flex-col justify-between"
            >
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center">
                  {t.name.slice(0, 1)}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-neutral-900">{t.name}</h4>
                  <span className="text-[10px] text-neutral-400 block">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────── 7. PRICING PLANS (MINIMALIST FAMILY CARDS) ────────────────── */}
      <section id="pricing" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-200/60">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Regulated Tariffs
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight mt-3">
            Transparent, statutory pricing.
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 mt-2">
            Regulated by RURA &amp; City of Kigali. No hidden fees or surprise enforcement charges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Plan 1: Hourly Transient */}
          <div className="p-8 rounded-[36px] bg-white border border-neutral-200 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                TRANSIENT DRIVER
              </span>
              <div>
                <span className="text-4xl font-extrabold text-neutral-900">300</span>
                <span className="text-xs font-bold text-neutral-500 ml-1">RWF / hour</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Ideal for quick downtown errands, dining, or shopping across Kigali municipal parking hubs.
              </p>
              <ul className="space-y-2.5 text-xs text-neutral-700 pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>15-minute free grace period</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Real-time vacancy space navigation</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Instant MTN MoMo &amp; Airtel payment</span>
                </li>
              </ul>
            </div>
            <Link
              href="/login"
              className="w-full py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold text-center block transition-colors"
            >
              Park Now
            </Link>
          </div>

          {/* Plan 2: Commuter Cap (Featured Black Card) */}
          <div className="p-8 rounded-[36px] bg-black text-white shadow-2xl flex flex-col justify-between space-y-6 relative transform md:-translate-y-2">
            <div className="absolute top-5 right-5 text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-xs">
              MUNICIPAL CAP
            </div>
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                DAILY COMMUTER CEILING
              </span>
              <div>
                <span className="text-4xl font-extrabold text-white">2,000</span>
                <span className="text-xs font-bold text-neutral-400 ml-1">RWF / day</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Full 24-hour citywide access with automatic tariff capping. Never overpay on full working days.
              </p>
              <ul className="space-y-2.5 text-xs text-neutral-200 pt-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Automatic daily ceiling at 2,000 RWF</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Unlimited citywide re-entries</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>24-hour monitored overnight security</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Zero surprise parking citations</span>
                </li>
              </ul>
            </div>
            <Link
              href="/login"
              className="w-full py-3 rounded-full bg-white text-black hover:bg-neutral-100 text-xs font-bold text-center block transition-colors shadow-md"
            >
              Get Commuter Pass
            </Link>
          </div>

          {/* Plan 3: Corporate Fleet */}
          <div className="p-8 rounded-[36px] bg-white border border-neutral-200 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                ENTERPRISE FLEET
              </span>
              <div>
                <span className="text-4xl font-extrabold text-neutral-900">Custom</span>
                <span className="text-xs font-bold text-neutral-500 ml-1">monthly billing</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Dedicated management portal for taxi operators, logistics fleets, and corporate enterprises.
              </p>
              <ul className="space-y-2.5 text-xs text-neutral-700 pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Consolidated monthly RRA VAT invoice</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Multi-vehicle license plate management</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Dedicated commercial stall allocations</span>
                </li>
              </ul>
            </div>
            <Link
              href="/admin"
              className="w-full py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold text-center block transition-colors"
            >
              Contact Fleet Sales
            </Link>
          </div>
        </div>
      </section>

      {/* ────────────────── 8. DIRECT MESSAGE & CONTACT ────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-200/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              24/7 Municipal Hotline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Get in touch with mobility dispatch.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              Have questions regarding parking reservations, EV charging, or fleet accounts? Our Kigali dispatch support team is available around the clock.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-neutral-200 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Phone &amp; WhatsApp</span>
                  <a href="tel:+25091700692" className="font-bold text-sm text-neutral-900 hover:underline">
                    +25091700692
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy("+25091700692", "phone")}
                  className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-semibold hover:bg-neutral-200"
                >
                  {copiedItem === "phone" ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-neutral-200 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Official Email</span>
                  <a href="mailto:info@parkzone.dev" className="font-bold text-sm text-neutral-900 hover:underline">
                    info@parkzone.dev
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy("info@parkzone.dev", "email")}
                  className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-semibold hover:bg-neutral-200"
                >
                  {copiedItem === "email" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-8 rounded-[36px] bg-white border border-neutral-200/90 shadow-2xs">
            <h3 className="font-extrabold text-lg text-neutral-900">Send an Inquiry</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Leave your details below and a mobility dispatch agent will respond within 15 minutes.
            </p>

            {contactSubmitted ? (
              <div className="mt-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-xs font-bold">
                  OK
                </span>
                <h4 className="font-bold text-emerald-900 text-sm">Message Dispatched</h4>
                <p className="text-xs text-emerald-700">
                  Thank you! Our Kigali municipal dispatch team has received your message.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="mt-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Christian Mugisha"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-[#f8f9fa] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700">Phone or Email</label>
                  <input
                    type="text"
                    required
                    placeholder="+250 788... or driver@email.com"
                    value={contactForm.contact}
                    onChange={(e) => setContactForm({ ...contactForm, contact: e.target.value })}
                    className="w-full bg-[#f8f9fa] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700">Your Message</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about your fleet inquiry, citation question, or parking stall reservation..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-[#f8f9fa] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ────────────────── 9. FREQUENTLY ASKED QUESTIONS (ACCORDIONS) ────────────────── */}
      <section id="faq" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-neutral-200/60">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-neutral-500 mt-2">
            Everything you need to know about parking rules, tariffs, and EV charging in Kigali.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((f, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-neutral-200/80 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between text-xs sm:text-sm font-bold text-neutral-900"
                >
                  <span>{f.q}</span>
                  <span className="text-base text-neutral-400 font-normal">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ────────────────── 10. PRE-FOOTER CTA BANNER (EXPLORE PARKZONE) ────────────────── */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="p-10 sm:p-16 rounded-[40px] bg-black text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Explore ParkZone
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to experience effortless parking?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg mx-auto">
              Join thousands of Kigali motorists and fleet drivers navigating the city with ParkZone. No tickets, no stress.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-full bg-white text-black hover:bg-neutral-100 text-xs font-bold transition-all shadow-md"
            >
              Get Started Free
            </Link>
            <Link
              href="/admin"
              className="px-6 py-3.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold border border-neutral-800 transition-all"
            >
              Launch Admin Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ────────────────── 11. MINIMALIST FOOTER (FAMILY.CO STYLE) ────────────────── */}
      <footer className="py-14 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-200/80 text-xs text-neutral-500">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold">
                P
              </div>
              <span className="font-extrabold text-sm text-neutral-900">ParkZone</span>
            </div>
            <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
              ParkZone is a modern municipal parking &amp; EV mobility platform designed to make city transit easy for everyone.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-neutral-900 uppercase text-[10px] tracking-wider block">
              Drivers
            </span>
            <ul className="space-y-1.5 text-neutral-600">
              <li><a href="#features" className="hover:text-black">Bay Navigation</a></li>
              <li><a href="#pricing" className="hover:text-black">Commuter Pass</a></li>
              <li><Link href="/login" className="hover:text-black">MoMo Payment</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-neutral-900 uppercase text-[10px] tracking-wider block">
              Network
            </span>
            <ul className="space-y-1.5 text-neutral-600">
              <li><a href="#features" className="hover:text-black">60kW EV Fast Hubs</a></li>
              <li><a href="#details" className="hover:text-black">ANPR Camera Gates</a></li>
              <li><a href="#details" className="hover:text-black">Ultrasonic Sensors</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-neutral-900 uppercase text-[10px] tracking-wider block">
              Administration
            </span>
            <ul className="space-y-1.5 text-neutral-600">
              <li><Link href="/admin" className="hover:text-black">Master Dispatch</Link></li>
              <li><Link href="/locations" className="hover:text-black">Facility Topology</Link></li>
              <li><Link href="/system" className="hover:text-black">System Logs</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-neutral-200/60 gap-3 text-[11px] text-neutral-400">
          <div>
            © 2026 ParkZone Rwanda. Regulated by RURA &amp; City of Kigali.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-700 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-neutral-700 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-neutral-700 cursor-pointer">Irembo API Docs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
