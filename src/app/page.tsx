"use client";

import React, { useState } from "react";
import Link from "next/link";

// 14-Point Starburst Geometric SVG matching the Dribbble design
function StarburstGraphic({ className = "w-28 h-28 text-current" }: { className?: string }) {
  const starPoints =
    "100.00,0.00 108.46,62.95 143.39,9.90 123.69,70.29 178.18,37.65 134.24,83.51 197.49,77.75 138.00,100.00 197.49,122.25 134.24,116.49 178.18,162.35 123.69,129.71 143.39,190.10 108.46,137.05 100.00,200.00 91.54,137.05 56.61,190.10 76.31,129.71 21.82,162.35 65.76,116.49 2.51,122.25 62.00,100.00 2.51,77.75 65.76,83.51 21.82,37.65 76.31,70.29 56.61,9.90 91.54,62.95";

  return (
    <svg
      viewBox="0 0 200 200"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points={starPoints} />
    </svg>
  );
}

export default function LandingPage() {
  const [selectedHeroScreen, setSelectedHeroScreen] = useState(0);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", contact: "", message: "" });

  // Ensure landing page is strictly dark mode (admin theme preference is preserved for admin dashboard)
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const html = document.documentElement;
    const savedAdminTheme = localStorage.getItem("parkzone_theme") || "dark";

    // Strictly enforce dark mode on public landing page
    html.classList.add("dark");

    return () => {
      // When leaving landing page (e.g. entering /admin), restore admin's theme preference
      if (savedAdminTheme === "light") {
        html.classList.remove("dark");
      } else {
        html.classList.add("dark");
      }
    };
  }, []);

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
      chip1: "✓ Verified Municipal Hub",
      chip2: "300 RWF/hr Standard Rate",
    },
    {
      id: "spot",
      title: "Spot H-01 Reservation",
      subtitle: "90° Perpendicular · Floor 1-4 Grid",
      src: "/screenshots/parking-spot-selection.png",
      tag: "BAY ALLOCATION",
      chip1: "✓ Spot H-01 Selected",
      chip2: "2h Duration Scheduled",
    },
    {
      id: "ev-map",
      title: "Live EV Navigation Map",
      subtitle: "Nyarutarama EV Fast Charging · 60kW CCS2",
      src: "/screenshots/ev-map-navigation.png",
      tag: "GPS & EV MAP",
      chip1: "⚡ 60 kW CCS2 Online",
      chip2: "11.3 km · 17 min Route",
    },
    {
      id: "telemetry",
      title: "3D Vehicle Telemetry",
      subtitle: "Plate RAJ 778 Z · 100% Battery Level",
      src: "/screenshots/vehicle-telemetry.png",
      tag: "VEHICLE TELEMETRY",
      chip1: "🔋 100% Battery Level",
      chip2: "Verified Rwanda Plate",
    },
    {
      id: "history",
      title: "Parking History & MoMo",
      subtitle: "Active Session & Digital Receipts",
      src: "/screenshots/parking-history.png",
      tag: "SESSION & RECEIPTS",
      chip1: "✓ Instant MoMo Receipt",
      chip2: "QR Bay Scan Ready",
    },
  ];

  const features = [
    {
      id: "telemetry",
      title: "Real-time Bay Telemetry & Sensors",
      description:
        "Work together seamlessly with smart city infrastructure. Our IoT ultrasonic and camera network accurately detects vacancy and guides drivers straight to open spots across Kigali.",
      badge: "Kigali Convention · 3 of 3 Bays Open",
      subtext: "Ultrasonic sensor active · 99.4% precision",
      action: "Select Bay",
      screenshot: "/screenshots/kigali-convention-park.png",
    },
    {
      id: "commuter-cap",
      title: "Automated Commuter Cap (2,000 RWF)",
      description:
        "Never fear runaway parking tickets or inflated bills. In full compliance with Rwanda municipal tariff regulations, daily parking fees are automatically capped at 2,000 RWF.",
      badge: "Spot H-01 · 90° Perpendicular Grid",
      subtext: "Automatic daily ceiling · Zero manual activation required",
      action: "Reserve Spot",
      screenshot: "/screenshots/parking-spot-selection.png",
    },
    {
      id: "ev-charging",
      title: "Rapid EV Fast-Charging Stations",
      description:
        "Locate high-speed CCS2 and Type 2 charging ports in Kigali CBD and surrounding hubs. View live kilowatts delivered, state-of-charge percentage, and billing telemetry in real-time.",
      badge: "Nyarutarama EV Charging · 60kW Rapid DC",
      subtext: "⚡ 11.3 km route · Charge Rate 250 RWF/kWh",
      action: "Navigate Station",
      screenshot: "/screenshots/ev-map-navigation.png",
    },
    {
      id: "vehicle-telemetry",
      title: "3D Vehicle Telemetry & Zero Arrears",
      description:
        "Register your vehicle plate with blind hash privacy enforcement. Track battery state of charge, exterior color specs, and verify zero parking arrears instantly.",
      badge: "Vehicle RAJ 778 Z · 100% Battery",
      subtext: "RURA & City of Kigali parking verification compliant",
      action: "Manage Fleet",
      screenshot: "/screenshots/vehicle-telemetry.png",
    },
  ];

  const handleNextFeature = () => {
    setActiveFeatureIndex((prev) => (prev + 1) % features.length);
  };

  const handlePrevFeature = () => {
    setActiveFeatureIndex((prev) => (prev - 1 + features.length) % features.length);
  };


  const faqs = [
    {
      q: "How does the 2,000 RWF daily commuter cap work?",
      a: "The ParkZone municipal pricing engine charges a standard 300 RWF per hour. Once your cumulative daily session reaches 2,000 RWF (at approximately 6.6 hours), the system automatically locks the tariff for the rest of the calendar day. You will never pay more than 2,000 RWF for 24-hour municipal street or lot parking.",
    },
    {
      q: "How can I pay using MTN Mobile Money or Airtel Money?",
      a: "When you scan the QR code at any Kigali parking bay or start a session through the app, simply choose Mobile Money. Enter your registered Rwandan phone number (+250 78/79/72/73), and an automated USSD authorization prompt (*182#) will appear immediately on your handset.",
    },
    {
      q: "How do parking marshals check if my vehicle is registered?",
      a: "Under Rwanda Data Protection Law Nº 058/2021, marshals do not see driver personal details. Marshals scan or input the masked vehicle plate (e.g. RAD *** A). The system queries a cryptographic blind index to verify whether an active paid session or permit exists.",
    },
    {
      q: "Where can I find EV Fast Charging spots in Kigali?",
      a: "ParkZone has deployed Level 2 (22kW) and Rapid DC (60kW-150kW) CCS2 charging bays at major municipal hubs including Kigali Heights Underground, Downtown Car Park, Kigali Convention Centre, and Nyarutarama EV Charging.",
    },
    {
      q: "How do I access the administrative operations console?",
      a: "Municipal marshals, parking operators, and city administrators can access the console by clicking the 'Admin Console' button in the top navigation or visiting /admin with authorized credentials.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0e0f11] text-[#f4f5f8] antialiased selection:bg-white selection:text-black font-sans">
      <div className="relative max-w-[1360px] mx-auto p-3 sm:p-5 md:p-8 space-y-4 md:space-y-6">
        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 1. HERO CARD (Dark rounded card with high-contrast panel right)*/}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section className="bg-[#131417] text-white rounded-[32px] md:rounded-[40px] border border-white/10 p-6 sm:p-10 md:p-14 relative overflow-hidden shadow-2xl">
          {/* Subtle background angled accent lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="0" y1="120" x2="800" y2="40" stroke="white" strokeWidth="0.8" />
            <line x1="0" y1="360" x2="1100" y2="120" stroke="white" strokeWidth="0.8" />
            <line x1="100" y1="720" x2="1360" y2="340" stroke="white" strokeWidth="0.8" />
          </svg>

          {/* ──────────────── TOP NAVIGATION BAR ──────────────── */}
          <header className="relative z-20 flex items-center justify-between pb-8 sm:pb-10 border-b border-white/10">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/parkzone-logo.png"
                  alt="ParkZone"
                  className="h-7 md:h-8 w-auto object-contain invert brightness-200"
                />
              </Link>
            </div>

            {/* Center Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-neutral-400">
              <a href="#home" className="text-white font-bold hover:underline transition-all">
                Home
              </a>
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#contact" className="hover:text-white transition-colors">
                Contact
              </a>
              <a href="#faq" className="hover:text-white transition-colors">
                FAQ
              </a>
            </nav>
          </header>

          {/* ──────────────── HERO MAIN GRID ──────────────── */}
          <div className="relative z-10 pt-10 sm:pt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* LEFT COLUMN: Headlines, App Badges, Social Proof */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8 sm:space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white text-xs font-semibold whitespace-nowrap shrink-0">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>Kigali Smart Urban Mobility & IoT Metering</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-extrabold text-white tracking-tight leading-[1.06]">
                  Easy way to get <br />
                  full control <br />
                  of your parking
                </h1>
                <p className="text-sm sm:text-base text-neutral-400 max-w-lg leading-relaxed">
                  A powerful municipal platform to navigate spaces, charge your EV, and settle
                  tariffs across Kigali. Settle seamlessly with automated 2,000 RWF commuter caps
                  and zero arrears.
                </p>
              </div>

              {/* Crisp White App Store & Google Play Badges (matching Dribbble frame_00.png) */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {/* Apple App Store */}
                <a
                  href="#download"
                  className="bg-white hover:bg-neutral-100 text-black px-4 sm:px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap shrink-0 border border-neutral-200/80"
                >
                  <svg className="w-6 h-6 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.85-.9.04-1.99.6-2.64 1.35-.58.67-.99 1.74-.94 2.79.99.08 1.95-.54 2.57-1.29z" />
                  </svg>
                  <div className="text-left flex flex-col justify-center">
                    <span className="block text-[10px] tracking-tight text-neutral-600 font-semibold leading-none">
                      Download on the
                    </span>
                    <span className="block text-xs sm:text-sm font-extrabold tracking-tight text-black leading-tight mt-0.5">
                      App Store
                    </span>
                  </div>
                </a>

                {/* Google Play Store */}
                <a
                  href="#download"
                  className="bg-white hover:bg-neutral-100 text-black px-4 sm:px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap shrink-0 border border-neutral-200/80"
                >
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186c-.37-.362-.61-.88-.61-1.463V3.277c0-.583.24-1.101.609-1.463zm11.233 11.235l2.427-2.427-12.01-6.93 9.583 9.357zm2.427-2.427l2.48 1.432c.732.423.732 1.114 0 1.536l-2.48 1.432-2.427-2.427 2.427-2.373zm-2.427 2.373l-9.583 9.357 12.01-6.93-2.427-2.427z" />
                  </svg>
                  <div className="text-left flex flex-col justify-center">
                    <span className="block text-[10px] uppercase tracking-wider text-neutral-600 font-semibold leading-none">
                      GET IT ON
                    </span>
                    <span className="block text-xs sm:text-sm font-extrabold tracking-tight text-black leading-tight mt-0.5">
                      Google Play
                    </span>
                  </div>
                </a>
              </div>

              {/* Bottom Social Proof & Stats */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-6">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    1.2M
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5 whitespace-nowrap">
                    Users already get the app
                  </p>
                </div>

                {/* Clean Light Pill with overlapping avatars and arrow (matching Dribbble frame_00.png) */}
                <div className="bg-white text-black p-1.5 pl-3.5 pr-2 rounded-full flex items-center gap-3 shadow-xl">
                  <div className="flex -space-x-2.5 overflow-hidden">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-800 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                        alt="User"
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-700 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                        alt="User"
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-900 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                        alt="User"
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                  </div>
                  <Link
                    href="/login"
                    className="w-9 h-9 rounded-full bg-black text-white hover:bg-neutral-800 flex items-center justify-center transition-transform hover:scale-105 shrink-0 shadow-sm"
                    title="Get Started"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: High-Contrast Light Card with Real Screenshot & Floating Chips */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-[430px] bg-[#f2f4f7] text-black rounded-[32px] md:rounded-[40px] p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-white/20 flex flex-col items-center min-h-[580px] justify-between">
                {/* 14-point Starburst in the background (bold contrast) */}
                <div className="absolute -top-12 -right-12 pointer-events-none opacity-20">
                  <StarburstGraphic className="w-64 h-64 text-black" />
                </div>
                <div className="absolute -bottom-16 -left-16 pointer-events-none opacity-20">
                  <StarburstGraphic className="w-64 h-64 text-black" />
                </div>

                {/* Real App Screenshot Phone Frame */}
                <div className="relative z-10 w-[260px] sm:w-[280px] my-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={appScreens[selectedHeroScreen].src}
                    alt={appScreens[selectedHeroScreen].title}
                    className="w-full h-auto object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.35)] transition-all duration-300"
                  />
                </div>

                {/* Floating Chips around the phone (positioned safely inside card padding) */}
                <div className="absolute top-16 left-4 z-20 bg-white text-black text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-neutral-200 flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-3.5 h-3.5 rounded-full bg-black text-white flex items-center justify-center text-[9px] shrink-0">
                    ✓
                  </span>
                  <span>{appScreens[selectedHeroScreen].chip1}</span>
                </div>

                <div className="absolute bottom-6 right-4 z-20 bg-black text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
                  <span>{appScreens[selectedHeroScreen].chip2}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 2. FEATURES SECTION (Clean White Card - matching frame_03.png)*/}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section
          id="features"
          className="bg-white text-black rounded-[32px] md:rounded-[40px] border border-neutral-200 p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-xl transition-colors"
        >
          {/* Top-Right 14-Point Starburst in Crisp Light Gray */}
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 pointer-events-none opacity-20">
            <StarburstGraphic className="w-24 h-24 sm:w-36 sm:h-36 text-black" />
          </div>

          {/* Section Tag & Heading */}
          <div className="max-w-2xl relative z-10">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400">
              FEATURES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-black tracking-tight leading-tight mt-2">
              ParkZone offers a comprehensive suite of features to help you stay ahead in urban parking
            </h2>

            {/* Left / Right Carousel Controls */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handlePrevFeature}
                aria-label="Previous Feature"
                className="w-10 h-10 rounded-full border border-neutral-300 bg-[#f5f6f9] hover:bg-neutral-200 text-black flex items-center justify-center transition-colors shadow-xs"
              >
                ←
              </button>
              <button
                onClick={handleNextFeature}
                aria-label="Next Feature"
                className="w-10 h-10 rounded-full bg-black hover:bg-neutral-800 text-white flex items-center justify-center transition-colors shadow-sm"
              >
                →
              </button>
            </div>
          </div>

          {/* Feature Cards Row */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {features.map((f, idx) => {
              const isActive = idx === activeFeatureIndex;
              return (
                <div
                  key={f.id}
                  onClick={() => setActiveFeatureIndex(idx)}
                  className={`p-6 rounded-3xl cursor-pointer transition-all duration-200 border flex flex-col justify-between min-h-[260px] ${
                    isActive
                      ? "bg-white border-black ring-2 ring-black/10 shadow-lg transform -translate-y-1"
                      : "bg-[#f5f6f9] border-neutral-200 hover:bg-[#ebedf2]"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-neutral-400">
                        0{idx + 1}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActive ? "bg-black" : "bg-neutral-300"
                        }`}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-black tracking-tight leading-snug">
                      {f.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {f.description}
                    </p>
                  </div>

                  {/* Card bottom widget preview */}
                  <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-black truncate max-w-[170px] whitespace-nowrap">
                      {f.action}
                    </span>
                    <span className="text-neutral-400">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 3. CALL TO ACTION / 3-PHONE PREVIEW (matching frame_05.png)  */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section className="bg-[#131417] text-white rounded-[32px] md:rounded-[40px] border border-white/10 p-8 sm:p-14 md:p-18 pb-0 md:pb-0 relative overflow-hidden shadow-2xl">
          {/* Angled background line art */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="0" y1="200" x2="1400" y2="40" stroke="white" strokeWidth="0.8" />
            <line x1="0" y1="500" x2="1400" y2="280" stroke="white" strokeWidth="0.8" />
          </svg>

          {/* Starburst graphic bottom-left */}
          <div className="absolute -bottom-10 -left-10 pointer-events-none opacity-20">
            <StarburstGraphic className="w-56 h-56 text-white" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-neutral-300 text-xs font-semibold whitespace-nowrap">
              <span>Rwanda Municipal Smart Parking</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Start your smart parking session <br />
              today just in one click
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
              To get started with our municipal smart parking network, locate a bay on the interactive map or scan any QR meter across Kigali. Pay seamlessly with MoMo, Airtel Money, or your ParkZone wallet. Manage parking from anywhere, at any time.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-white hover:bg-neutral-100 text-black transition-all transform hover:scale-105 shadow-xl whitespace-nowrap shrink-0"
              >
                Start for Free
              </Link>
              <Link
                href="/admin"
                className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md transition-all whitespace-nowrap shrink-0 shadow-xs"
              >
                Open Admin Console →
              </Link>
            </div>
          </div>

          {/* 3-Phone Mockup Showcase rising from the bottom edge */}
          <div className="mt-12 relative z-10 flex items-end justify-center gap-4 sm:gap-8 -mb-20 sm:-mb-24">
            {/* Phone 1: Left (Live EV Map Navigation) */}
            <div className="hidden md:block w-[220px] sm:w-[250px] lg:w-[270px] transform -rotate-3 translate-y-10 hover:translate-y-4 transition-all duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/screenshots/ev-map-navigation.png"
                alt="ParkZone EV Map Navigation"
                className="w-full h-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* Phone 2: Center Highlighted Phone (Parking Spot Reservation H-01) */}
            <div className="w-[260px] sm:w-[290px] lg:w-[310px] relative z-20 transform hover:scale-105 transition-all duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/screenshots/parking-spot-selection.png"
                alt="ParkZone Parking Spot Selection"
                className="w-full h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.95)]"
              />
            </div>

            {/* Phone 3: Right (3D Vehicle Telemetry & Customizer) */}
            <div className="hidden md:block w-[220px] sm:w-[250px] lg:w-[270px] transform rotate-3 translate-y-10 hover:translate-y-4 transition-all duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/screenshots/vehicle-telemetry.png"
                alt="ParkZone 3D Vehicle Telemetry"
                className="w-full h-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)]"
              />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 4. PRICING PLANS SECTION                                    */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section
          id="pricing"
          className="bg-white text-black rounded-[32px] md:rounded-[40px] border border-neutral-200 p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-xl transition-colors"
        >
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400">
              PRICING
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
              Simple & Transparent Parking Plans
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Clear, law-compliant tariffs designed for daily commuters, short visits, and corporate fleets in Kigali.
            </p>
          </div>

          {/* 3 Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standard Driver */}
            <div className="p-7 rounded-3xl bg-[#f5f6f9] border border-neutral-200 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-black bg-white border border-neutral-200 px-2 py-0.5 rounded">
                  Driver Hourly
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-black">300</span>
                  <span className="text-xs font-bold text-neutral-500">RWF / hour</span>
                </div>
                <p className="text-xs text-neutral-600">
                  Ideal for quick errands, shopping, or appointments in the City of Kigali.
                </p>
                <ul className="space-y-2 text-xs text-black pt-2">
                  <li className="flex items-center gap-2">✓ 15-minute free grace period</li>
                  <li className="flex items-center gap-2">✓ Real-time space navigation</li>
                  <li className="flex items-center gap-2">✓ Instant MoMo & Airtel payment</li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold text-center block transition-colors shadow-xs"
              >
                Park Now
              </Link>
            </div>

            {/* Commuter Pass (Featured Black Card) */}
            <div className="p-7 rounded-3xl bg-black text-white border border-neutral-800 space-y-5 flex flex-col justify-between shadow-2xl relative transform md:-translate-y-2">
              <div className="absolute top-4 right-4 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white text-black shadow-xs">
                POPULAR
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-white/20 px-2 py-0.5 rounded">
                  Daily Commuter Cap
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">2,000</span>
                  <span className="text-xs font-bold text-neutral-400">RWF / day</span>
                </div>
                <p className="text-xs text-neutral-300">
                  Full 24-hour access with automatic capping. Never overpay on full working days.
                </p>
                <ul className="space-y-2 text-xs text-white font-medium pt-2">
                  <li className="flex items-center gap-2">✓ Automatic daily ceiling</li>
                  <li className="flex items-center gap-2">✓ Unlimited city re-entries</li>
                  <li className="flex items-center gap-2">✓ Overnight lot protection</li>
                  <li className="flex items-center gap-2">✓ Zero surprise parking citations</li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-bold text-center block transition-colors shadow-md"
              >
                Get Commuter Pass
              </Link>
            </div>

            {/* Corporate Fleet */}
            <div className="p-7 rounded-3xl bg-[#f5f6f9] border border-neutral-200 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-black bg-white border border-neutral-200 px-2 py-0.5 rounded">
                  Corporate Fleet
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-black">Custom</span>
                  <span className="text-xs font-bold text-neutral-500">monthly invoicing</span>
                </div>
                <p className="text-xs text-neutral-600">
                  Dedicated portals for logistics firms, taxi fleets, and corporate enterprises.
                </p>
                <ul className="space-y-2 text-xs text-black pt-2">
                  <li className="flex items-center gap-2">✓ Consolidated monthly VAT invoice</li>
                  <li className="flex items-center gap-2">✓ Multi-vehicle management</li>
                  <li className="flex items-center gap-2">✓ Reserved commercial bays</li>
                </ul>
              </div>
              <Link
                href="/admin"
                className="w-full py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold text-center block transition-colors shadow-xs"
              >
                Contact Fleet Sales
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 5. FAQ SECTION (Accordion)                                  */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section
          id="faq"
          className="bg-[#131417] text-white rounded-[32px] md:rounded-[40px] border border-white/10 p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl"
        >
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-10">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Everything you need to know about parking, EV charging, and rates in Kigali.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-[#1a1b20] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-white hover:text-neutral-300 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-lg leading-none font-bold text-white">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-neutral-400 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 6. CONTACT INFORMATION SECTION                             */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section
          id="contact"
          className="bg-white text-black rounded-[32px] md:rounded-[40px] border border-neutral-200 p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-xl transition-colors"
        >
          {/* Decorative Starburst Top-Right */}
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 pointer-events-none opacity-20">
            <StarburstGraphic className="w-28 h-28 sm:w-40 sm:h-40 text-black" />
          </div>

          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10 relative z-10">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400">
              CONTACT US
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
              Get in Touch with ParkZone
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
              Have questions regarding municipal parking bays, commuter rates, EV fast charging stations, or corporate fleet onboarding? Reach out to our Kigali team directly.
            </p>
          </div>

          {/* Cards & Contact Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
            {/* Left Column: Direct Contact Channels (Phone & Email) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              {/* Phone Card */}
              <div className="p-6 rounded-3xl bg-[#f5f6f9] border border-neutral-200 space-y-3 relative group hover:border-black transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <button
                    onClick={() => handleCopy("+25091700692", "phone")}
                    className="text-[11px] font-bold text-neutral-600 hover:text-black bg-white px-2.5 py-1 rounded-full border border-neutral-200 shadow-xs transition-colors"
                  >
                    {copiedItem === "phone" ? "Copied! ✓" : "Copy"}
                  </button>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                    Phone & WhatsApp
                  </span>
                  <a
                    href="tel:+25091700692"
                    className="text-xl sm:text-2xl font-black text-black hover:underline block tracking-tight mt-0.5"
                  >
                    +25091700692
                  </a>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Direct municipal driver hotline, QR payment support, and 24/7 emergency parking dispatch.
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold text-black">
                  <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                  <span>Available 24/7 · Mon to Sun</span>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-6 rounded-3xl bg-[#f5f6f9] border border-neutral-200 space-y-3 relative group hover:border-black transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <button
                    onClick={() => handleCopy("info@parkzone.dev", "email")}
                    className="text-[11px] font-bold text-neutral-600 hover:text-black bg-white px-2.5 py-1 rounded-full border border-neutral-200 shadow-xs transition-colors"
                  >
                    {copiedItem === "email" ? "Copied! ✓" : "Copy"}
                  </button>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                    Official Email
                  </span>
                  <a
                    href="mailto:info@parkzone.dev"
                    className="text-xl sm:text-2xl font-black text-black hover:underline block tracking-tight mt-0.5 truncate"
                  >
                    info@parkzone.dev
                  </a>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  General inquiries, partner integrations, API access, and corporate fleet onboarding.
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold text-neutral-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  <span>Typical response time: under 1 hour</span>
                </div>
              </div>

              {/* Location Mini Card */}
              <div className="p-5 rounded-3xl bg-black text-white space-y-2 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-300">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span>Kigali Operations & City Hub</span>
                </div>
                <p className="text-sm font-semibold text-white">
                  KG 2 Roundabout, Kimihurura & Kigali CBD
                </p>
                <p className="text-[11px] text-neutral-400">
                  Kigali, Rwanda · Regulated by RURA & City of Kigali
                </p>
              </div>
            </div>

            {/* Right Column: Direct Message / Inquiry Form (Monochrome) */}
            <div className="lg:col-span-7 bg-[#f5f6f9] border border-neutral-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-black tracking-tight">
                  Send Us a Direct Message
                </h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Fill in the details below and a ParkZone mobility specialist will respond promptly.
                </p>

                {contactSubmitted ? (
                  <div className="mt-8 p-6 rounded-2xl bg-white border border-black/20 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mx-auto text-sm font-bold">
                      ✓
                    </div>
                    <h4 className="text-base font-bold text-black">Message Received</h4>
                    <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                      Thank you for contacting ParkZone. Our team at info@parkzone.dev has logged your inquiry and will follow up shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-black mb-1.5">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="e.g. Jean-Luc Mugisha"
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-black text-xs font-medium placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-black mb-1.5">
                          Phone or Email
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.contact}
                          onChange={(e) => setContactForm({ ...contactForm, contact: e.target.value })}
                          placeholder="+250 78... or name@company.rw"
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-black text-xs font-medium placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-black mb-1.5">
                        Inquiry or Message
                      </label>
                      <textarea
                        rows={8}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Tell us about your parking query, fleet requirements, or station location..."
                        className="w-full min-h-[190px] sm:min-h-[220px] px-4 py-3 rounded-2xl bg-white border border-neutral-300 text-black text-xs sm:text-sm font-medium leading-relaxed placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 resize-y transition-all"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                      <p className="text-[11px] text-neutral-500">
                        We safeguard your information under Rwanda Data Law Nº 058/2021.
                      </p>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-7 py-3 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-md whitespace-nowrap shrink-0"
                      >
                        Send Message →
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Fast Action Footer */}
              <div className="mt-6 pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-neutral-500">Need immediate on-site marshal assistance?</span>
                <a
                  href="tel:+25091700692"
                  className="font-bold text-black hover:underline flex items-center gap-1"
                >
                  <span>Call +25091700692</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 7. MINIMALIST FOOTER                                        */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <footer className="bg-[#131417] text-white rounded-[32px] md:rounded-[40px] border border-white/10 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/parkzone-logo.png"
                  alt="ParkZone"
                  className="h-7 w-auto object-contain invert brightness-200"
                />
              </Link>
              <span className="text-[10px] font-semibold text-neutral-400 border-l border-white/20 pl-3 whitespace-nowrap">
                Kigali Urban Mobility
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400">
              <a href="#home" className="hover:text-white transition-colors">
                Home
              </a>
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#contact" className="hover:text-white transition-colors">
                Contact
              </a>
              <a href="#faq" className="hover:text-white transition-colors">
                FAQ
              </a>
              <Link href="/admin" className="text-white font-bold hover:underline whitespace-nowrap">
                Admin Console
              </Link>
            </div>
          </div>

          {/* Legal and Compliance */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
            <p className="whitespace-nowrap">© 2026 ParkZone Ltd. All rights reserved. Kigali, Rwanda.</p>
            <p className="flex items-center gap-2 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
              <span>Compliant with Rwanda Data Protection Law Nº 058/2021</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
