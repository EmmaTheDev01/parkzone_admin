"use client";

import React, { useState } from "react";
import Link from "next/link";

const inputCls =
  "w-full rounded-xl bg-[#F7F7F6] px-4 py-3 text-[15px] text-neutral-900 placeholder:text-neutral-400 outline-none ring-1 ring-transparent focus:bg-white focus:ring-emerald-500/40 transition";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", contact: "", message: "" });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F6] text-[#2B2A2A] font-sans antialiased selection:bg-emerald-200 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#F7F7F6]/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 sm:h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ParkZone" className="h-7 sm:h-8 w-auto object-contain" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back home
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-5 sm:px-8 pt-10 sm:pt-16 pb-20">
        <div className="max-w-[460px] mx-auto">
          <div className="text-center pz-rise">
            <span className="pz-pill inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium text-neutral-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-2" />
              Dispatch online 24/7
            </span>
            <h1 className="mt-5 font-serif text-[40px] sm:text-[52px] leading-[1.05] tracking-[-0.015em]">
              Talk to a
              <br />
              real human.
            </h1>
            <p className="mt-4 text-[15px] text-neutral-500 leading-relaxed">
              Fleet accounts, bay reservations, or citations.
              <br className="hidden sm:block" /> We usually reply within 15 minutes.
            </p>
          </div>

          {/* Form card */}
          <form
            onSubmit={handleSubmit}
            className="pz-rise mt-10 rounded-[24px] bg-white p-5 sm:p-7 shadow-[0_10px_40px_rgba(0,0,0,0.05)] space-y-3"
            style={{ animationDelay: "120ms" }}
          >
            <label className="block">
              <span className="sr-only">Full name</span>
              <input
                type="text"
                required
                autoComplete="name"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="sr-only">Phone or email</span>
              <input
                type="text"
                required
                autoComplete="email"
                placeholder="Phone or email"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="sr-only">Message</span>
              <textarea
                rows={5}
                required
                placeholder="How can we help? Include your plate or station."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${inputCls} resize-none leading-relaxed`}
              />
            </label>

            <button
              type="submit"
              disabled={sent}
              className="w-full mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#2B2A2A] hover:bg-black disabled:bg-emerald-600 text-white py-3 text-sm font-medium transition-all active:scale-[0.98]"
            >
              {sent ? (
                <>
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Message sent
                </>
              ) : (
                "Send message"
              )}
            </button>
          </form>

          {/* Direct contacts */}
          <div className="pz-rise mt-4 rounded-[24px] bg-white divide-y divide-neutral-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)]" style={{ animationDelay: "200ms" }}>
            {[
              {
                label: "Call dispatch",
                value: "+250 788 123 456",
                href: "tel:+250788123456",
                icon: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />,
              },
              {
                label: "Email",
                value: "dispatch@parkzone.rw",
                href: "mailto:dispatch@parkzone.rw",
                icon: (
                  <>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </>
                ),
              },
              {
                label: "Visit",
                value: "KN 3 Ave, Kigali",
                href: undefined,
                icon: (
                  <>
                    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
                    <circle cx="12" cy="9.5" r="2.5" />
                  </>
                ),
              },
            ].map((c) => {
              const inner = (
                <>
                  <span className="w-9 h-9 rounded-full bg-[#F1F1F0] flex items-center justify-center text-neutral-700 shrink-0">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {c.icon}
                    </svg>
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[12px] text-neutral-400">{c.label}</span>
                    <span className="block text-sm text-neutral-900 truncate">{c.value}</span>
                  </span>
                  {c.href && (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  )}
                </>
              );
              return c.href ? (
                <a key={c.label} href={c.href} className="group flex items-center gap-3 px-5 py-3.5 hover:bg-neutral-50/70 first:rounded-t-[24px] last:rounded-b-[24px] transition-colors">
                  {inner}
                </a>
              ) : (
                <div key={c.label} className="flex items-center gap-3 px-5 py-3.5">
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-5 sm:px-8 pb-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-400">
          <span>© 2026 ParkZone Rwanda Ltd.</span>
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </span>
        </div>
      </footer>
    </div>
  );
}
