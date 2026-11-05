"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", contact: "", message: "" });
  const [simulatorStep, setSimulatorStep] = useState<number>(0);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: "", contact: "", message: "" });
    }, 4000);
  };

  const faqs = [
    {
      q: "What is ParkZone?",
      a: "ParkZone is Kigali's next-gen municipal mobility network. It unifies ANPR optical camera gates, ultrasonic bay sensors, 60kW DC electric vehicle superchargers, and cashless Mobile Money into one seamless experience. No paper tickets, no ticket booths, and no surprise citations.",
    },
    {
      q: "How does the 2,000 RWF daily commuter cap work?",
      a: "Transient parking accumulates at the standard municipal rate of 300 RWF per hour, but automatically caps and freezes the moment your daily total reaches 2,000 RWF. After that, you enjoy unlimited re-entries and overnight parking protection across all connected Kigali facilities at 0 extra cost.",
    },
    {
      q: "How does the 15-minute free grace period work?",
      a: "Every municipal parking hub and smart street zone in Kigali provides a statutory 15-minute grace period. If you drop off passengers, collect a quick pickup, or exit within 15 minutes, the ANPR barrier verifies your session and opens at exactly 0 RWF.",
    },
    {
      q: "Can I charge my electric vehicle without paying parking tariffs?",
      a: "Yes. All designated EV fast-charging stations (such as Nyarutarama EV Hub) waive parking tariffs entirely during active charging sessions. Motorists pay only the statutory electricity rate (250 RWF/kWh or 9k flat quick-charge), with 0 RWF charged for the parking stall.",
    },
    {
      q: "How do MTN MoMo and Airtel Money checkouts work?",
      a: "When your vehicle approaches the exit gate or when you scan a bay QR pass, an automated USSD prompt appears directly on your phone. Simply enter your mobile money PIN to authorize the payment. Digital VAT receipts are instantly recorded in your account.",
    },
    {
      q: "How do I check or dispute a parking citation?",
      a: "Enter your Rwandan vehicle plate in the ParkZone mobile app or web portal to view your real-time standing. Any statutory fine logged by marshals is linked directly to Irembo, where you can inspect timestamps, photos, and resolve arrears instantly.",
    },
  ];

  const testimonials = [
    {
      name: "Christian Mugisha",
      handle: "@cmugisha",
      role: "Kigali Tech Commuter",
      text: "ParkZone feels like the future of Kigali. Finding an open stall at Kigali Heights used to take 20 minutes; now I reserve it before I leave Kimihurura.",
    },
    {
      name: "Aline Uwase",
      handle: "@aline_u",
      role: "EV Motorist (BYD Atto 3)",
      text: "Having live 60 kW DC charger telemetry right on my phone with zero parking surcharge is a dream. The design is as clean and thoughtful as Popcorn.",
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
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] font-sans antialiased selection:bg-neutral-900 selection:text-white">
      {/* ────────────────── 1. NAVBAR (POPCORN EXACT STYLE) ────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 px-6 sm:px-10 py-4 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-xs tracking-tighter">P</span>
            </div>
            <span className="font-extrabold text-base tracking-tight text-neutral-900 flex items-center gap-1.5">
              ParkZone
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
            <a href="#features" className="hover:text-black transition-colors">
              Features
            </a>
            <a href="#coverage" className="hover:text-black transition-colors">
              Coverage
            </a>
            <a href="#manifesto" className="hover:text-black transition-colors">
              Manifesto
            </a>
            <a href="#pricing" className="hover:text-black transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-black transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-black transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/admin"
              className="px-5 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-semibold tracking-tight transition-all shadow-xs hover:scale-105 active:scale-95"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* ────────────────── 2. HERO SECTION (POPCORN EXACT TYPOGRAPHY & OVERLAPPING TILTED PHONES) ────────────────── */}
      <section className="pt-20 sm:pt-28 pb-20 px-6 sm:px-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-[11px] font-semibold text-neutral-700 tracking-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>City of Kigali Smart Mobility Network</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-900 leading-[1.04]">
              One parking network. <br />
              No hassle.
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed max-w-lg">
              Enjoy unlimited municipal mobility in Kigali. 300 RWF/hr transient, 2,000 RWF/day cap. No surprise tickets, or headaches.
            </p>

            {/* Checklist */}
            <ul className="space-y-2.5 pt-2 text-sm text-neutral-800 font-medium">
              <li className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                <span>15-minute free grace period on all municipal lots</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                <span>Works across 50+ Kigali hubs with 60kW DC fast charging</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                <span>Automated MTN MoMo &amp; Airtel Money gate checkout</span>
              </li>
            </ul>

            <div className="pt-2 text-[11px] text-neutral-400 font-normal">
              *Subject to City of Kigali municipal mobility bylaws
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white text-sm font-semibold tracking-tight transition-all shadow-md hover:scale-105 active:scale-95"
              >
                Sign Up
              </Link>
              <a
                href="#pricing"
                className="text-sm font-semibold text-neutral-700 hover:text-black transition-colors underline underline-offset-4 decoration-neutral-300"
              >
                See pricing
              </a>
            </div>
          </div>

          {/* Right Hero Column: Popcorn Signature Overlapping Tilted Phones */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-8">
            {/* Ambient soft glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/40 via-transparent to-neutral-100/50 rounded-full filter blur-3xl -z-10" />

            {/* Phone 1 (Back, Tilted Left) */}
            <div className="relative w-[210px] sm:w-[240px] -rotate-6 rounded-[38px] p-2 bg-neutral-900 border-[6px] border-neutral-900 shadow-2xl transition-transform hover:-rotate-3 duration-300 -mr-16 sm:-mr-20 z-10">
              <div className="w-16 h-3 bg-neutral-900 rounded-full mx-auto mb-1.5" />
              <div className="rounded-[28px] overflow-hidden aspect-[9/19] bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/screenshots/ev-map-navigation.png"
                  alt="Live EV Navigation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Phone 2 (Front, Tilted Right) */}
            <div className="relative w-[230px] sm:w-[260px] rotate-6 rounded-[42px] p-2.5 bg-neutral-900 border-[7px] border-neutral-900 shadow-[0_30px_60px_rgba(0,0,0,0.25)] transition-transform hover:rotate-3 duration-300 z-20">
              <div className="w-18 h-3.5 bg-neutral-900 rounded-full mx-auto mb-2" />
              <div className="rounded-[30px] overflow-hidden aspect-[9/19] bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/screenshots/parking-spot-selection.png"
                  alt="Spot Reservation"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Pill on Phone */}
              <div className="absolute -bottom-4 left-4 right-4 bg-white p-2.5 rounded-2xl border border-neutral-200/90 shadow-xl flex items-center justify-between text-[11px] font-bold text-neutral-900">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  RAD 892 B
                </span>
                <span className="text-emerald-600 font-extrabold">Cleared · 0.4s</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── 3. A KIGALI PLATE, WITH PEACE OF MIND (POPCORN SECTION 1) ────────────────── */}
      <section id="features" className="py-24 px-6 sm:px-10 max-w-6xl mx-auto border-t border-neutral-100">
        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            A Kigali plate, with peace of mind.
          </h2>
          <p className="text-base text-neutral-500 mt-3 font-normal">
            Get started in 5 minutes. Monitored parking across the entire capital.
          </p>
        </div>

        {/* 3 Clean Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-[#FAFAFA] border border-neutral-200/70 hover:border-black transition-all hover:shadow-lg space-y-3">
            <div className="text-sm font-bold text-emerald-600 uppercase tracking-wider">
              Simple
            </div>
            <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">
              A city network without costly fines.
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-normal">
              No paper tickets slipping between your seats, and no guessing if a stall is occupied. Live ultrasonic telemetry displays empty bays before you arrive.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#FAFAFA] border border-neutral-200/70 hover:border-black transition-all hover:shadow-lg space-y-3">
            <div className="text-sm font-bold text-emerald-600 uppercase tracking-wider">
              Fast &amp; Easy
            </div>
            <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">
              Get parked in seconds. Keep your plate synced.
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-normal">
              High-speed optical ANPR camera gates recognize your Rwandan registration plate instantly. Drive in and out with barriers lifting in 400 milliseconds.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#FAFAFA] border border-neutral-200/70 hover:border-black transition-all hover:shadow-lg space-y-3">
            <div className="text-sm font-bold text-emerald-600 uppercase tracking-wider">
              Protected
            </div>
            <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">
              Made for Kigali life. 2,000 RWF daily cap.
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-normal">
              Whether you have back-to-back meetings in Nyarugenge or park overnight at Kigali Heights, fees automatically freeze at 2,000 RWF per day.
            </p>
          </div>
        </div>
      </section>

      {/* ────────────────── 4. WORKS IN KIGALI HEIGHTS. WORKS EVERYWHERE (POPCORN SECTION 2) ────────────────── */}
      <section id="coverage" className="py-24 px-6 sm:px-10 max-w-6xl mx-auto border-t border-neutral-100">
        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Works at Kigali Heights. Works everywhere.
          </h2>
          <p className="text-base text-neutral-500 mt-3 font-normal">
            Experience premium municipal sensor coverage across Downtown, Nyarutarama, and 50+ stations.
          </p>
        </div>

        {/* 4 Feature Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2 p-6 rounded-2xl bg-white border border-neutral-200/80 hover:border-neutral-400 transition-all">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Station Coverage</div>
            <h4 className="text-base font-extrabold text-neutral-900 tracking-tight">Optical ANPR Mesh</h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-normal">
              Powered by high-precision optical recognition cameras and ultrasonic ground loop sensors across all hubs.
            </p>
          </div>

          <div className="space-y-2 p-6 rounded-2xl bg-white border border-neutral-200/80 hover:border-neutral-400 transition-all">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">EV Fast Charging</div>
            <h4 className="text-base font-extrabold text-neutral-900 tracking-tight">60kW DC Rapid Hubs</h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-normal">
              Power up your electric vehicle with 0 RWF parking fees during active charging sessions.
            </p>
          </div>

          <div className="space-y-2 p-6 rounded-2xl bg-white border border-neutral-200/80 hover:border-neutral-400 transition-all">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Mobile Checkout</div>
            <h4 className="text-base font-extrabold text-neutral-900 tracking-tight">MTN &amp; Airtel MoMo</h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-normal">
              Automatic USSD push prompts sent straight to your phone. Pay in one tap with compliant digital VAT receipts.
            </p>
          </div>

          <div className="space-y-2 p-6 rounded-2xl bg-white border border-neutral-200/80 hover:border-neutral-400 transition-all">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Compliance</div>
            <h4 className="text-base font-extrabold text-neutral-900 tracking-tight">Irembo Cloud Sync</h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-normal">
              Real-time audit log sync with Rwanda National Police and Irembo guarantees zero false citations.
            </p>
          </div>
        </div>
      </section>

      {/* ────────────────── 5. HUNDREDS OF STORIES. YOURS NEXT (POPCORN REVIEWS) ────────────────── */}
      <section className="py-24 px-6 sm:px-10 max-w-6xl mx-auto border-t border-neutral-100">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">
              Hundreds of journeys. Yours next.
            </h2>
            <div className="flex items-center gap-2 mt-2 text-sm text-neutral-600">
              <span>Rated</span>
              <strong className="text-neutral-900 font-extrabold">4.9</strong>
              <span>from 1K+ verified Kigali motorists &amp; fleet drivers.</span>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-[#FAFAFA] border border-neutral-200/70 hover:border-black transition-all space-y-4"
            >
              <p className="text-sm text-neutral-700 leading-relaxed font-normal">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                  {t.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900">{t.name}</div>
                  <div className="text-[10px] text-neutral-400 font-medium">{t.handle} · {t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────── 6. THE BEST FEATURE? THE HUMANS (POPCORN DISPATCH) ────────────────── */}
      <section className="py-24 px-6 sm:px-10 max-w-6xl mx-auto border-t border-neutral-100">
        <div className="bg-[#fbfbfb] rounded-[36px] p-8 sm:p-14 border border-neutral-200/80 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              24/7 Field Support
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              The best feature? The marshals &amp; dispatch.
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed font-normal">
              Fast and reliable municipal dispatch. Helping with bay allocations, EV charger connectivity, and citation reviews without wait times.
            </p>
          </div>

          <a
            href="#contact"
            className="px-8 py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold tracking-tight transition-all shadow-md shrink-0 hover:scale-105 active:scale-95"
          >
            Get Help
          </a>
        </div>
      </section>

      {/* ────────────────── 7. ONE PLAN THAT DOES IT ALL (POPCORN TWO CARDS) ────────────────── */}
      <section className="py-24 px-6 sm:px-10 max-w-6xl mx-auto border-t border-neutral-100">
        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            One network that does it all.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Municipal */}
          <div className="p-8 sm:p-10 rounded-[36px] bg-[#FAFAFA] border border-neutral-200/70 hover:border-black transition-all flex flex-col justify-between space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Everyday Mobility
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Municipal
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed font-normal">
                Standard transient parking across Kigali with automated 2,000 RWF daily caps, 15m free grace periods, and instant MoMo push checkout.
              </p>
            </div>
            <Link
              href="/login"
              className="text-xs font-bold text-neutral-900 hover:text-black underline underline-offset-4 decoration-neutral-300"
            >
              Learn more →
            </Link>
          </div>

          {/* Card 2: Commercial Fleet */}
          <div className="p-8 sm:p-10 rounded-[36px] bg-[#FAFAFA] border border-neutral-200/70 hover:border-black transition-all flex flex-col justify-between space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Corporate Fleet
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Fleet Dispatch
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed font-normal">
                Centralized corporate billing for delivery vans, logistics fleets, and company vehicles with consolidated VAT EBM v2 receipts.
              </p>
            </div>
            <a
              href="#contact"
              className="text-xs font-bold text-neutral-900 hover:text-black underline underline-offset-4 decoration-neutral-300"
            >
              Learn more →
            </a>
          </div>
        </div>
      </section>

      {/* ────────────────── 8. WHY DOES CITY PARKING FEEL STUCK IN THE 90S? (MANIFESTO) ────────────────── */}
      <section id="manifesto" className="py-24 px-6 sm:px-10 max-w-4xl mx-auto border-t border-neutral-100 text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
          Why does city parking feel stuck in the 90s?
        </h2>
        <p className="mt-6 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal max-w-2xl mx-auto">
          Paper tickets getting crushed in your cup holder. Circling downtown for 20 minutes looking for an open bay. Waiting in a line at a toll booth to find small change. Unfair 10,000 RWF citations from missing an attendant.
        </p>
        <p className="mt-4 text-base sm:text-lg text-neutral-900 font-semibold max-w-xl mx-auto">
          We built ParkZone to eliminate all of it. Drive in, park, charge, and drive out.
        </p>
      </section>

      {/* ────────────────── 9. GET CONNECTED IN 3 STEPS ────────────────── */}
      <section className="py-20 px-6 sm:px-10 max-w-5xl mx-auto border-t border-neutral-100">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Get parked in 3 simple steps.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2 text-center sm:text-left">
            <div className="text-3xl font-black text-neutral-300">01</div>
            <h4 className="text-lg font-bold text-neutral-900">Sign up plate</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Register your Rwandan license plate once in under 60 seconds with your phone number.
            </p>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="text-3xl font-black text-neutral-300">02</div>
            <h4 className="text-lg font-bold text-neutral-900">Drive in &amp; park</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Optical ANPR cameras scan your plate and raise barriers automatically in 0.4 seconds.
            </p>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="text-3xl font-black text-emerald-500">03</div>
            <h4 className="text-lg font-bold text-neutral-900">You&apos;re cleared!</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Drive out seamlessly. 15m free grace period or automated MoMo push with 2,000 RWF cap.
            </p>
          </div>
        </div>
      </section>

      {/* ────────────────── 10. POPCORN SIGNATURE DARK PRICING CARD (IMAGE & MARKDOWN CLONE) ────────────────── */}
      <section id="pricing" className="py-20 px-6 sm:px-10 max-w-5xl mx-auto">
        <div className="relative w-full overflow-hidden bg-[#121417] text-white rounded-[36px] p-8 sm:p-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Statutory Municipal Rate
            </span>
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
              One plan, <br />
              one price.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed">
              Standard 300 RWF/hr transient parking across Kigali, automatically capped at 2,000 RWF daily maximum. Unlimited citywide re-entries with zero surprise fees.
            </p>
          </div>

          <div className="text-right flex flex-col items-end gap-5">
            <div>
              <div className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-none">
                2,000
              </div>
              <div className="text-xs sm:text-sm font-semibold tracking-tight text-neutral-400 mt-1">
                RWF Per Day (Max Cap) · 300 RWF/hr
              </div>
            </div>

            <Link
              href="/login"
              className="px-9 py-3.5 rounded-full bg-white text-neutral-900 hover:bg-neutral-100 text-sm font-bold tracking-tight transition-all shadow-md hover:scale-105 active:scale-95"
            >
              Sign up
            </Link>
          </div>
        </div>
      </section>

      {/* ────────────────── 11. GOT QUESTIONS? HERE'S THE ANSWERS (FAQS) ────────────────── */}
      <section id="faq" className="py-24 px-6 sm:px-10 max-w-4xl mx-auto border-t border-neutral-100">
        <div className="mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Got questions? Here&apos;s the answers.
          </h2>
        </div>

        <div className="divide-y divide-neutral-200/80">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-6 transition-all">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-neutral-900 hover:text-black"
                >
                  <span>{faq.q}</span>
                  <span className="text-xl font-light text-neutral-400 shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="pt-3 text-xs sm:text-sm text-neutral-500 leading-relaxed font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ────────────────── 12. DIRECT DISPATCH INQUIRY FORM ────────────────── */}
      <section id="contact" className="py-20 px-6 sm:px-10 max-w-4xl mx-auto border-t border-neutral-100">
        <div className="bg-[#fbfbfb] border border-neutral-200/80 rounded-[32px] p-8 sm:p-12">
          <div className="max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              City Authority Support
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-2">
              Speak with Municipal Dispatch
            </h2>
            <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed font-normal">
              Need assistance with corporate fleet accounts, bay reservations, or citation audits? Our dispatch desk responds 24/7.
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

      {/* ────────────────── 13. MINIMALIST FOOTER (POPCORN STYLE) ────────────────── */}
      <footer className="border-t border-neutral-200 py-12 px-6 sm:px-10 text-xs text-neutral-500 max-w-6xl mx-auto">
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
              <li><Link href="/login" className="hover:text-black">iOS Mobile App</Link></li>
              <li><Link href="/login" className="hover:text-black">Android Mobile App</Link></li>
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
