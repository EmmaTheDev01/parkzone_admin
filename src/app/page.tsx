"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] font-sans antialiased selection:bg-neutral-900 selection:text-white">
      {/* ────────────────── 1. NAVBAR (POPCORN CLEAN ARCHITECTURE - NO LOGIN/SIGNUP) ────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 px-6 sm:px-10 py-4 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo using real ParkZone image asset */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="ParkZone"
              className="h-8 w-auto object-contain transition-opacity group-hover:opacity-80"
            />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-tight text-neutral-600">
            <a href="#features" className="hover:text-black transition-colors">
              Features
            </a>
            <a href="#coverage" className="hover:text-black transition-colors">
              Coverage
            </a>
            <a href="#dispatch" className="hover:text-black transition-colors">
              Dispatch
            </a>
            <a href="#pricing" className="hover:text-black transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-black transition-colors">
              FAQ
            </a>
            <Link href="/contact" className="hover:text-black transition-colors">
              Support
            </Link>
          </nav>

          {/* Download App Action (No Login/Signup buttons) */}
          <div className="flex items-center gap-3">
            <a
              href="#download"
              className="px-5 py-2 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-semibold tracking-tight transition-all shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <span>Download App</span>
            </a>
          </div>
        </div>
      </header>

      {/* ────────────────── 2. HERO SECTION (APP STORE & PLAY STORE BUTTONS + RAW PNG PHONES) ────────────────── */}
      <section className="pt-16 sm:pt-24 pb-16 sm:pb-24 px-6 sm:px-10 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-5">
          {/* Announcement Badge */}
          <div className="inline-flex items-center justify-center rounded-full border border-neutral-200/90 px-4 py-1.5 text-xs font-semibold tracking-tight text-neutral-800 bg-neutral-50/80 shadow-2xs hover:opacity-80 transition-opacity">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
            <span>City of Kigali Smart Mobility Network</span>
            <span className="mx-2 text-neutral-300">·</span>
            <span className="text-emerald-700 font-bold">15m Free Grace Period</span>
          </div>

          {/* Big Confident Headline */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-neutral-900 leading-[1.03]">
            One parking network. <br />
            No hassle.
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl text-base sm:text-lg font-medium leading-snug tracking-tight text-neutral-500">
            Enjoy unlimited municipal mobility in Kigali for 300 RWF/hr. 2,000 RWF daily cap, zero surprise fines, or headaches.
          </p>

          {/* Checklist */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs sm:text-sm font-semibold text-neutral-800">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>15m free grace period</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>50+ hubs &amp; 60kW DC EV charging</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Automated MTN MoMo checkout</span>
            </div>
          </div>

          <div className="text-[11px] text-neutral-400 font-normal">
            *Subject to City of Kigali municipal mobility bylaws
          </div>

          {/* Hero Download Badges: App Store & Google Play */}
          <div id="download" className="flex flex-wrap items-center justify-center gap-3 pt-3">
            {/* Apple App Store */}
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white transition-all shadow-md hover:scale-105 active:scale-95"
            >
              <svg className="w-6 h-6 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.67-.82 1.13-1.96 1-3.1-.98.04-2.17.65-2.87 1.47-.62.72-1.16 1.88-1.01 2.99 1.1.08 2.21-.54 2.88-1.36z" />
              </svg>
              <div className="text-left">
                <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold leading-none">
                  Download on the
                </div>
                <div className="text-xs sm:text-sm font-bold tracking-tight leading-tight mt-0.5">
                  App Store
                </div>
              </div>
            </a>

            {/* Google Play Store */}
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white transition-all shadow-md hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.793 12 3.61 22.186a1.99 1.99 0 0 1-.61-1.423V3.237c0-.54.22-1.03.609-1.423zm11.238 11.24l2.58 2.58-12.35 7.126 9.77-9.706zm0-2.108L5.077 1.24l12.35 7.126-2.58 2.58zm1.054 1.054l3.19-1.84a1.8 1.8 0 0 1 0 3.12l-3.19-1.28z" />
              </svg>
              <div className="text-left">
                <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold leading-none">
                  GET IT ON
                </div>
                <div className="text-xs sm:text-sm font-bold tracking-tight leading-tight mt-0.5">
                  Google Play
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* ────────────────── RAW PNG HERO IMAGES (NO BORDERS, NO ARTIFICIAL BACKGROUNDS) ────────────────── */}
        <div className="relative mt-16 sm:mt-20 flex w-full max-w-4xl mx-auto items-center justify-center">
          {/* Subtle ambient blur behind images */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 w-[70%] h-[70%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-emerald-100/40 to-neutral-100/50 rounded-full filter blur-3xl -z-10" />

          {/* Left PNG Image (Slightly tilted left, no borders/bgs) */}
          <div className="relative w-[48%] sm:w-[320px] -rotate-3 hover:rotate-0 transition-transform duration-300 select-none z-10 -mr-6 sm:-mr-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/screenshots/ev-map-navigation.png"
              alt="Live EV Navigation"
              className="w-full h-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.18)]"
            />
          </div>

          {/* Right PNG Image (Slightly tilted right, no borders/bgs) */}
          <div className="relative w-[50%] sm:w-[335px] rotate-3 hover:rotate-0 transition-transform duration-300 select-none z-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/screenshots/parking-spot-selection.png"
              alt="Spot Reservation"
              className="w-full h-auto drop-shadow-[0_30px_45px_rgba(0,0,0,0.22)]"
            />
          </div>
        </div>
      </section>

      {/* ────────────────── 3. A KIGALI PLATE, WITH PEACE OF MIND ────────────────── */}
      <section id="features" className="py-24 px-6 sm:px-10 max-w-6xl mx-auto border-t border-neutral-100">
        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            A Kigali plate, with peace of mind.
          </h2>
          <p className="text-base text-neutral-500 mt-3 font-normal">
            Get started in 5 minutes. Monitored parking across the entire capital.
          </p>
        </div>

        {/* 3 Clean Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-[#FAFAFA] border border-neutral-200/70 hover:border-black transition-all hover:shadow-lg space-y-3">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Simple
            </div>
            <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">
              A city network without costly fines.
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-normal">
              No paper tickets slipping between your seats, and no guessing if a stall is occupied. Live ultrasonic telemetry displays empty bays before you leave home.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#FAFAFA] border border-neutral-200/70 hover:border-black transition-all hover:shadow-lg space-y-3">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
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
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
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

      {/* ────────────────── 4. WORKS AT KIGALI HEIGHTS. WORKS EVERYWHERE (IMAGE 2 CLONE - CENTRAL RADAR/GLOBE + 4 CALLOUTS) ────────────────── */}
      <section id="coverage" className="py-24 px-6 sm:px-10 max-w-6xl mx-auto border-t border-neutral-100">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Works at Kigali Heights. <br />
            Works everywhere.
          </h2>
          <p className="text-base text-neutral-500 mt-3 font-normal">
            Experience premium municipal sensor coverage across Downtown, Nyarutarama, and 50+ facilities.
          </p>
        </div>

        {/* Central Graphic with 4 Symmetrical Callouts (Popcorn.space Image 2 exact clone) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Left Column (2 Callouts) */}
          <div className="lg:col-span-3 space-y-12 text-center lg:text-left order-2 lg:order-1">
            {/* Callout 1 */}
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto lg:mx-0 text-neutral-800 shadow-2xs">
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h4 className="text-base font-extrabold text-neutral-900 tracking-tight">
                Citywide Coverage
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                Powered by optical ANPR camera gates across all Kigali municipal sectors.
              </p>
            </div>

            {/* Callout 2 */}
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto lg:mx-0 text-neutral-800 shadow-2xs">
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h4 className="text-base font-extrabold text-neutral-900 tracking-tight">
                Smart Telemetry
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                Real-time ultrasonic loop sensors track every single bay and stall occupancy.
              </p>
            </div>
          </div>

          {/* Center Column: Dotted Radar Globe Illustration */}
          <div className="lg:col-span-6 flex justify-center items-center order-1 lg:order-2">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-b from-neutral-50 to-neutral-100/80 border border-neutral-200/70 shadow-inner flex items-center justify-center p-6">
              {/* Concentric telemetry rings */}
              <div className="absolute inset-4 rounded-full border border-dashed border-neutral-300 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-12 rounded-full border border-neutral-200" />
              <div className="absolute inset-20 rounded-full border border-dashed border-emerald-300/80" />

              {/* Center Kigali Municipal Hub Node */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/picon.png" alt="ParkZone" className="w-10 h-10 object-contain rounded-full" />
                </div>
                <div className="mt-3 px-3 py-1 rounded-full bg-white border border-neutral-200 text-[10px] font-bold text-neutral-800 shadow-2xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Kigali Grid Live</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (2 Callouts) */}
          <div className="lg:col-span-3 space-y-12 text-center lg:text-left order-3">
            {/* Callout 3 */}
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto lg:mx-0 text-emerald-600 shadow-2xs">
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h4 className="text-base font-extrabold text-neutral-900 tracking-tight">
                60kW DC EV Hubs
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                Rapid charging stations with 0 RWF parking fees during active charging.
              </p>
            </div>

            {/* Callout 4 */}
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto lg:mx-0 text-neutral-800 shadow-2xs">
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <h4 className="text-base font-extrabold text-neutral-900 tracking-tight">
                Instant MoMo
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                Automated USSD prompt on your phone for instant, frictionless gate departure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── 5. THE BEST FEATURE? THE HUMANS (IMAGE 1 CLONE - REALISTIC CHAT THREAD) ────────────────── */}
      <section id="dispatch" className="py-24 px-6 sm:px-10 max-w-4xl mx-auto border-t border-neutral-100">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            The best feature? <br />
            The marshals.
          </h2>
          <p className="text-base text-neutral-500 mt-3 font-normal leading-relaxed">
            Fast and reliable municipal dispatch. <br />
            Helping with bay allocation, EV charging, and a few laughs.
          </p>
        </div>

        {/* Realistic Chat Bubbles Thread (Popcorn.space Image 1 exact clone) */}
        <div className="max-w-md mx-auto space-y-4">
          {/* Message 1 (Driver: Aline) */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              AL
            </div>
            <div className="flex-1 bg-neutral-100/90 rounded-2xl rounded-tl-sm p-4 border border-neutral-200/70 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-neutral-900">Aline</span>
                <span className="text-neutral-400">14:15</span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed">
                I&apos;m arriving at Kigali Heights underground, is the 60kW DC charger bay free?
              </p>
            </div>
          </div>

          {/* Message 2 (Dispatch Lead: Eric) */}
          <div className="flex items-start gap-3 justify-end">
            <div className="flex-1 bg-white rounded-2xl rounded-tr-sm p-4 border border-neutral-200/90 shadow-sm max-w-sm text-left">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                  Eric, Dispatch Lead
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-neutral-400">14:16</span>
              </div>
              <p className="text-xs text-neutral-800 leading-relaxed">
                Bay EV-02 is clear and reserved for your plate RAD 892 B! Barrier will lift automatically.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              ER
            </div>
          </div>

          {/* Message 3 (Driver: Aline) */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              AL
            </div>
            <div className="flex-1 bg-neutral-100/90 rounded-2xl rounded-tl-sm p-4 border border-neutral-200/70 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-neutral-900">Aline</span>
                <span className="text-neutral-400">14:17</span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed">
                Barrier lifted in 0.4s, amazing five stars
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── 6. ONE PLAN THAT DOES IT ALL (TWO CARDS) ────────────────── */}
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
            <a
              href="#pricing"
              className="text-xs font-bold text-neutral-900 hover:text-black underline underline-offset-4 decoration-neutral-300"
            >
              See pricing →
            </a>
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
            <Link
              href="/contact"
              className="text-xs font-bold text-neutral-900 hover:text-black underline underline-offset-4 decoration-neutral-300"
            >
              Contact dispatch →
            </Link>
          </div>
        </div>
      </section>

      {/* ────────────────── 7. WHY DOES CITY PARKING FEEL STUCK IN THE 90S? (MANIFESTO) ────────────────── */}
      <section id="manifesto" className="py-24 px-6 sm:px-10 max-w-4xl mx-auto border-t border-neutral-100 text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
          Why does city parking feel stuck in the 90s?
        </h2>
        <p className="mt-6 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal max-w-2xl mx-auto">
          Paper tickets getting crushed in your cup holder. Circling downtown for 20 minutes looking for an open bay. Waiting in line at a toll booth to find small change. Unfair 10,000 RWF citations from missing an attendant.
        </p>
        <p className="mt-4 text-base sm:text-lg text-neutral-900 font-semibold max-w-xl mx-auto">
          We built ParkZone to eliminate all of it. Drive in, park, charge, and drive out.
        </p>
      </section>

      {/* ────────────────── 8. DUAL OVERLAPPING CARDS + CENTER PHONE (IMAGE 3 EXACT CLONE) ────────────────── */}
      <section id="pricing" className="py-24 px-6 sm:px-10 max-w-6xl mx-auto border-t border-neutral-100">
        <div className="relative w-full max-w-5xl mx-auto">
          {/* Dual Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Left Card: Get parked in 5 minutes (Soft Gradient) */}
            <div className="p-8 sm:p-12 rounded-[36px] bg-gradient-to-br from-neutral-50 via-emerald-50/20 to-neutral-100 border border-neutral-200/80 flex flex-col justify-between min-h-[380px]">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                  Get parked <br />
                  in 5 minutes.
                </h3>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white border border-neutral-300 text-xs font-bold text-neutral-800 flex items-center justify-center shrink-0 shadow-2xs">
                      1
                    </span>
                    <span className="text-sm font-semibold text-neutral-800">Sign up plate</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white border border-neutral-300 text-xs font-bold text-neutral-800 flex items-center justify-center shrink-0 shadow-2xs">
                      2
                    </span>
                    <span className="text-sm font-semibold text-neutral-800">Drive in &amp; park</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
                      3
                    </span>
                    <span className="text-sm font-bold text-emerald-900">You&apos;re Cleared!</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 text-[11px] font-bold text-neutral-700 shadow-2xs">
                  Yes, we timed it. ✓
                </span>
              </div>
            </div>

            {/* Right Card: One plan, one price (Dark Ink) */}
            <div className="p-8 sm:p-12 rounded-[36px] bg-[#121417] text-white border border-neutral-900 flex flex-col justify-between items-end text-right min-h-[380px] shadow-xl">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  One plan, <br />
                  one price.
                </h3>
              </div>

              <div className="space-y-4 text-right">
                <div>
                  <div className="text-5xl sm:text-6xl font-black text-white tracking-tight leading-none">
                    2,000
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-neutral-400 mt-1">
                    RWF Per Day (Max Cap)
                  </div>
                </div>

                <a
                  href="#download"
                  className="inline-block px-7 py-3 rounded-full bg-white text-neutral-900 hover:bg-neutral-100 text-xs font-bold tracking-tight transition-all shadow-md hover:scale-105 active:scale-95"
                >
                  Download App
                </a>
              </div>
            </div>

            {/* Overlapping Center Phone Mockup (Popcorn.space Image 3 exact clone) */}
            <div className="hidden md:block pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[240px] select-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/screenshots/parking-spot-selection.png"
                alt="ParkZone App Screen"
                className="w-full h-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.3)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── 9. GOT QUESTIONS? HERE'S THE ANSWERS (FAQS) ────────────────── */}
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

      {/* ────────────────── 10. MINIMALIST FOOTER (POPCORN STYLE - NO LOGIN/SIGNUP) ────────────────── */}
      <footer className="border-t border-neutral-200 py-12 px-6 sm:px-10 text-xs text-neutral-500 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="ParkZone"
                className="h-6 w-auto object-contain"
              />
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-400">
              City of Kigali Municipal Mobility Authority. Seamless parking &amp; EV fast charging infrastructure.
            </p>
          </div>

          <div>
            <div className="font-bold text-neutral-900 mb-2">Platform</div>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#download" className="hover:text-black">iOS Mobile App</a></li>
              <li><a href="#download" className="hover:text-black">Android Mobile App</a></li>
              <li><a href="#pricing" className="hover:text-black">Statutory Tariffs</a></li>
              <li><a href="#coverage" className="hover:text-black">Station Network</a></li>
              <li><Link href="/contact" className="hover:text-black">Support &amp; Dispatch</Link></li>
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
