"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", contact: "", message: "" });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: "", contact: "", message: "" });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] font-sans antialiased selection:bg-neutral-900 selection:text-white flex flex-col justify-between">
      {/* ────────────────── HEADER (POPCORN CLEAN ARCHITECTURE) ────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 px-6 sm:px-10 py-4 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="ParkZone"
              className="h-8 w-auto object-contain transition-opacity group-hover:opacity-80"
            />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-tight text-neutral-600">
            <Link href="/#features" className="hover:text-black transition-colors">
              Features
            </Link>
            <Link href="/#coverage" className="hover:text-black transition-colors">
              Coverage
            </Link>
            <Link href="/#manifesto" className="hover:text-black transition-colors">
              Manifesto
            </Link>
            <Link href="/#pricing" className="hover:text-black transition-colors">
              Pricing
            </Link>
            <Link href="/#faq" className="hover:text-black transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/#download"
              className="px-5 py-2 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-semibold tracking-tight transition-all shadow-xs hover:scale-105 active:scale-95"
            >
              Download App
            </Link>
          </div>
        </div>
      </header>

      {/* ────────────────── MAIN CONTACT CONTENT ────────────────── */}
      <main className="py-16 sm:py-24 px-6 sm:px-10 max-w-4xl mx-auto w-full">
        <div className="bg-[#FAFAFA] border border-neutral-200/80 rounded-[36px] p-8 sm:p-14 shadow-xs">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>City Authority Support</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight mt-3 leading-tight">
              Speak with Municipal Dispatch
            </h1>

            <p className="text-sm text-neutral-500 mt-2 leading-relaxed font-normal">
              Need assistance with corporate fleet accounts, bay reservations, or citation audits? Our dispatch desk responds 24/7.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="mt-10 space-y-5 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Christian Mugisha"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Phone or Email
                </label>
                <input
                  type="text"
                  required
                  placeholder="+250 788 000 000"
                  value={contactForm.contact}
                  onChange={(e) => setContactForm({ ...contactForm, contact: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                Inquiry or Citation Details
              </label>
              <textarea
                rows={4}
                required
                placeholder="Include vehicle plate or station name..."
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors resize-none shadow-2xs leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-neutral-200/60">
              <div className="text-xs text-neutral-500 font-medium">
                Direct phone: <strong className="text-neutral-900 font-bold">+250 788 123 456</strong>
              </div>

              <button
                type="submit"
                disabled={contactSubmitted}
                className="px-7 py-3 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-tight transition-all shadow-md disabled:opacity-50 hover:scale-105 active:scale-95"
              >
                {contactSubmitted ? "Message Dispatched ✓" : "Send Inquiry"}
              </button>
            </div>
          </form>

          {/* Quick Contact Information Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-neutral-200/60 text-xs">
            <div className="p-4 rounded-2xl bg-white border border-neutral-200/70">
              <div className="font-bold text-neutral-900">24/7 Dispatch Hotline</div>
              <div className="text-neutral-500 mt-0.5">+250 788 123 456</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">Live Phone Operator</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-neutral-200/70">
              <div className="font-bold text-neutral-900">Official Inquiries</div>
              <div className="text-neutral-500 mt-0.5">dispatch@parkzone.rw</div>
              <div className="text-[10px] text-neutral-400 font-semibold mt-1">Under 15 min response</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-neutral-200/70">
              <div className="font-bold text-neutral-900">Command Center</div>
              <div className="text-neutral-500 mt-0.5">KN 3 Ave, Kigali</div>
              <div className="text-[10px] text-neutral-400 font-semibold mt-1">City Mobility Hub</div>
            </div>
          </div>
        </div>
      </main>

      {/* ────────────────── FOOTER ────────────────── */}
      <footer className="border-t border-neutral-200 py-10 px-6 sm:px-10 text-xs text-neutral-500 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ParkZone" className="h-5 w-auto object-contain" />
            <span className="text-neutral-400">· City of Kigali Municipal Mobility Authority</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-neutral-400">
            <span>© 2026 ParkZone Rwanda Ltd.</span>
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

