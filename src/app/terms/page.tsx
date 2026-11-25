"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("section-1");

  const sections = [
    { id: "section-1", title: "1. Acceptance of Terms & Regulatory Framework" },
    { id: "section-2", title: "2. Account Registration, Vehicle Plates & Identity" },
    { id: "section-3", title: "3. ANPR Automated Access, Optical Recognition & Grace Periods" },
    { id: "section-4", title: "4. Municipal Tariffs, Daily Billing Caps & Automated Freezes" },
    { id: "section-5", title: "5. Digital Payment Methods, MoMo USSD Prompts & VAT Receipts" },
    { id: "section-6", title: "6. Electric Vehicle (EV) Charging Stations & Stalls" },
    { id: "section-7", title: "7. Enforcement, Statutory Citations & Irembo Integration" },
    { id: "section-8", title: "8. Vehicle Safety, Liability Disclaimers & Bailment" },
    { id: "section-9", title: "9. Prohibited Conduct, Facility Misuse & Penalties" },
    { id: "section-10", title: "10. Dispute Resolution, Governing Law & Jurisdiction" },
    { id: "section-11", title: "11. Amendments, Service Notifications & Severability" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      for (const s of [...sections].reverse()) {
        const el = document.getElementById(s.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180) {
            setActiveSection(s.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F7F6] text-[#2B2A2A] font-sans antialiased selection:bg-emerald-200 selection:text-neutral-900 flex flex-col">
      {/* ────────────────── HEADER ────────────────── */}
      <header className="sticky top-0 z-50 bg-[#F7F7F6]/85 backdrop-blur-md border-b border-black/[0.04]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 sm:h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.webp"
              alt="ParkZone"
              width={140}
              height={32}
              className="h-7 sm:h-8 w-auto object-contain"
              fetchPriority="high"
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hidden sm:inline-block text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/bylaws"
              className="hidden sm:inline-block text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              City Bylaws
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back home
            </Link>
          </div>
        </div>
      </header>

      {/* ────────────────── MAIN CONTENT ────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-24 w-full">
        {/* Hero banner */}
        <div className="max-w-3xl">
          <span className="pz-pill inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium text-neutral-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-2" />
            ParkZone Legal Framework
          </span>
          <h1 className="mt-5 font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-[#2B2A2A]">
            Terms of Service
          </h1>
          <p className="mt-4 text-[15px] sm:text-base text-neutral-500 leading-relaxed max-w-2xl">
            These Terms of Service govern your access to and utilization of the ParkZone municipal parking network, automated camera portals, electric vehicle charging facilities, and mobile payment platforms across the City of Kigali.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-[12px] font-mono text-neutral-400 border-b border-black/[0.06] pb-8">
            <span>Effective: January 1, 2026</span>
            <span>·</span>
            <span>Version: 3.2.0</span>
            <span>·</span>
            <span>Jurisdiction: Republic of Rwanda</span>
          </div>
        </div>

        {/* 2-Column Layout: Sticky Sidebar TOC + Content */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Table of contents */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-1 bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-black/[0.04]">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3 px-3">
              Table of Contents
            </div>
            <nav className="space-y-1 text-[13px]">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`block px-3 py-2 rounded-lg transition-all line-clamp-1 ${
                    activeSection === s.id
                      ? "bg-neutral-900 text-white font-medium"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70"
                  }`}
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Sections body */}
          <div className="lg:col-span-8 space-y-12">
            {/* Section 1 */}
            <article id="section-1" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                1. Acceptance of Terms &amp; Regulatory Framework
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  ParkZone Rwanda Ltd. (&quot;ParkZone&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates an intelligent municipal parking telemetry network, automated Automatic Number Plate Recognition (ANPR) barrier infrastructure, and Electric Vehicle Supply Equipment (EVSE) network under commercial concession and statutory mandate with the City of Kigali. By downloading, accessing, browsing, or utilizing the ParkZone mobile applications, physical bay entry terminals, web-based management dashboards, or entering any sensor-monitored facility, you (&quot;User&quot;, &quot;Driver&quot;, or &quot;Account Holder&quot;) unconditionally agree to be legally bound by these Terms of Service.
                </p>
                <p>
                  These Terms constitute a valid and binding contract executed in Kigali, Rwanda, entered into between yourself and ParkZone Rwanda Ltd. in compliance with the Law Governing Contracts in Rwanda (Law Nº 45/2011). If you do not agree to these Terms in their entirety, you must refrain from entering designated ParkZone camera-monitored parking facilities, avoid utilizing bay passes, and cease all interaction with our mobile applications and digital payment gateways immediately.
                </p>
                <p>
                  Your physical entry into any designated facility, whether via automated barrier lifting or open street bay parking, constitutes definitive legal performance signifying your consent to camera capture, automated session calculation, and tariff settlement according to the schedule of municipal fees enacted by the City of Kigali.
                </p>
              </div>
            </article>

            {/* Section 2 */}
            <article id="section-2" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                2. Account Registration, Vehicle Plates &amp; Identity
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  To unlock frictionless barrier lifting, reserve municipal EV charging bays, or access corporate daily billing caps, drivers must establish a verified ParkZone account utilizing an active Rwandan mobile telephone number (MTN Rwanda or Airtel Rwanda) or a secure electronic mail address. You are strictly responsible for maintaining the confidentiality of your mobile authentication credentials, USSD confirmation prompts, and any two-factor authentication tokens delivered to your registered device.
                </p>
                <p>
                  You are solely and strictly liable for the accuracy of all motor vehicle registration marks (license plates) registered under your user profile. Every plate associated with your account must correspond to an authentic vehicle registered with the Rwanda Revenue Authority (RRA) and Rwanda National Police (RNP) motor vehicle registry, and you must possess legal authorization to operate or manage said vehicle.
                </p>
                <p>
                  ParkZone reserves the unilateral right to suspend, freeze, or terminate any account that registers fictitious, altered, duplicate, or unverified vehicle license plates without prior notification, and to report suspected fraudulent plate usage to municipal law enforcement authorities immediately.
                </p>
              </div>
            </article>

            {/* Section 3 */}
            <article id="section-3" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                3. ANPR Automated Access, Optical Recognition &amp; Grace Periods
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  ParkZone operates high-definition optical Automatic Number Plate Recognition (ANPR) cameras positioned at entry and exit portals across participating municipal and private commercial facilities. Passage of a motor vehicle through an entry portal constitutes the automated creation of a digital parking session, timestamped synchronously against national network time servers operating within the Central Africa Time (CAT) zone.
                </p>
                <p>
                  Every connected municipal facility provides an unconditional statutory grace period of fifteen (15) minutes from the recorded moment of entry. Motorists who enter a facility to discharge passengers, perform immediate pickups, or find no vacant stalls and subsequently clear the exit barrier within fifteen (15) minutes will be assessed an automated fee of exactly zero Rwandan Francs (0 RWF).
                </p>
                <p>
                  If a vehicle remains within the monitored facility for sixteen (16) minutes or longer, the statutory grace period expires retroactively, and transient parking charges will be computed from the exact minute the vehicle initially passed through the entrance portal.
                </p>
              </div>
            </article>

            {/* Section 4 */}
            <article id="section-4" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                4. Municipal Tariffs, Daily Billing Caps &amp; Automated Freezes
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  Standard municipal parking across the City of Kigali is billed at the statutory tariff of three hundred Rwandan Francs (300 RWF) per sixty-minute increment, or as formally gazetted by the City of Kigali for special event districts. Parking durations are metered continuously using bay ultrasonic telemetry and optical gate records, rounded to the nearest standard billing increment as authorized by municipal regulations.
                </p>
                <p>
                  Under the ParkZone Fair Mobility Mandate, transient parking charges automatically freeze once your aggregate parking fees reach two thousand Rwandan Francs (2,000 RWF) within a single calendar day (00:00 to 23:59 CAT). Once this daily billing cap is achieved, no additional transient hourly parking charges will be assessed against that registered license plate across any connected municipal parking facility for the remainder of that calendar day.
                </p>
                <p>
                  The daily billing cap applies exclusively to standard transient vehicle parking and expressly excludes dedicated Electric Vehicle kilowatt-hour (kWh) charging tariffs, overnight storage surcharges for unauthorized vehicles parked past 04:00 AM, and statutory citations issued for obstruction or parking infractions.
                </p>
              </div>
            </article>

            {/* Section 5 */}
            <article id="section-5" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                5. Digital Payment Methods, MoMo USSD Prompts &amp; VAT Receipts
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  ParkZone supports seamless cashless settlement utilizing MTN Mobile Money (MoMo), Airtel Money, linked international and regional payment cards (Visa, Mastercard), or preloaded ParkZone digital wallet balances. Cash payments to individual marshals or parking attendants are strictly prohibited across all automated facilities to ensure full financial transparency and prevent tariff leakage.
                </p>
                <p>
                  When your vehicle approaches an exit barrier with an outstanding balance, our payment engine dispatches an automated USSD authorization push directly to your registered mobile handset. Upon entering your secret Mobile Money PIN, the transaction is settled via licensed payment aggregators regulated by the National Bank of Rwanda (NBR), and the barrier arm lifts automatically within four hundred milliseconds (0.4s).
                </p>
                <p>
                  All completed transactions generate an electronic Value Added Tax (VAT) fiscal receipt compliant with Rwanda Revenue Authority (RRA) electronic invoicing standards, archived permanently within your application dashboard for corporate reimbursement and tax accounting purposes.
                </p>
              </div>
            </article>

            {/* Section 6 */}
            <article id="section-6" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                6. Electric Vehicle (EV) Charging Stations &amp; Stalls
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  ParkZone provides dedicated DC Fast Charging (60kW to 150kW) and Level 2 AC charging infrastructure across designated municipal hubs including Nyarutarama, Kigali Heights, and Downtown CBD. Stalls marked with green iconography and charging pillars are strictly reserved for active battery electric vehicles (BEVs) and plug-in hybrid electric vehicles (PHEVs) actively connected to dispensing equipment.
                </p>
                <p>
                  Internal Combustion Engine (ICE) vehicles parked in designated EV charging stalls, as well as electric vehicles parked without being plugged into charging equipment, are classified as green zone obstructions and are subject to immediate towing, wheel clamping, and municipal civil infractions without prior warning.
                </p>
                <p>
                  Charging energy is metered in kilowatt-hours (kWh) at prevailing tariffs approved by the Rwanda Utilities Regulatory Authority (RURA). An idle fee of fifty Rwandan Francs (50 RWF) per minute will commence fifteen (15) minutes after a vehicle reaches ninety-five percent (95%) battery capacity or charging terminates, if the vehicle remains parked in the charging stall.
                </p>
              </div>
            </article>

            {/* Section 7 */}
            <article id="section-7" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                7. Enforcement, Statutory Citations &amp; Irembo Integration
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  Vehicles that force barrier mechanisms, evade exit payment portals, straddle designated bay demarcations, block emergency fire hydrants, or abandon vehicles on municipal property will receive formal statutory citations issued by certified municipal marshals and automated enforcement systems.
                </p>
                <p>
                  All unpaid parking sessions, violation notices, and enforcement penalties are automatically synchronized with the national Irembo e-government platform and Rwanda National Police traffic enforcement systems. Citations must be settled within fourteen (14) calendar days of electronic notice delivery to prevent late statutory penalties.
                </p>
                <p>
                  Failure to settle outstanding citations within the statutory fourteen-day window will result in vehicle immobilization via mechanical wheel clamps, administrative flags preventing the issuance of technical control roadworthiness certificates, and potential civil recovery proceedings before municipal courts.
                </p>
              </div>
            </article>

            {/* Section 8 */}
            <article id="section-8" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                8. Vehicle Safety, Liability Disclaimers &amp; Bailment
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  ParkZone facilities, optical surveillance cameras, ultrasonic telemetry sensors, and on-site parking marshals are deployed solely for space management, traffic optimization, automated access, and revenue collection. ParkZone Rwanda Ltd. does not operate as a bailee, does not accept custody or safekeeping of any vehicle, and does not provide vehicle insurance coverage.
                </p>
                <p>
                  To the maximum extent permitted by applicable Rwandan law, ParkZone disclaims all liability for loss or damage to vehicles, their equipment, or contents resulting from theft, vandalism, fire, collision, civil disturbance, flooding, or natural occurrences while parked within any municipal or private facility.
                </p>
                <p>
                  Motorists are strictly advised to lock all doors, roll up windows completely, and remove all valuables, laptops, and mobile phones from view prior to leaving their vehicles unattended. Any vehicular damage caused by driver error, obstacle contact, or barrier collision resulting from tailgating remains the sole liability of the motor vehicle operator.
                </p>
              </div>
            </article>

            {/* Section 9 */}
            <article id="section-9" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                9. Prohibited Conduct, Facility Misuse &amp; Penalties
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  Users agree to observe all posted facility signage, painted bay demarcations, and instructions issued by uniformed municipal marshals. The maximum speed limit across all covered parking facilities, ramps, and surface lots is strictly fifteen kilometers per hour (15 km/h), and pedestrian right-of-way must be respected at all times.
                </p>
                <p>
                  Prohibited conduct includes, without limitation: unauthorized commercial solicitation, vehicle repair or oil changes on premises, reckless drifting or rapid acceleration, parking across multiple marked bays, tailgating preceding vehicles through barrier portals, and verbal abuse or physical harassment directed toward parking marshals.
                </p>
                <p>
                  Tampering with, altering, or intentionally damaging ANPR camera lenses, loop sensors, barrier gates, payment kiosks, or network antennas constitutes a criminal offense under Article 182 of the Penal Code of Rwanda and will result in immediate criminal prosecution alongside liability for all restoration costs.
                </p>
              </div>
            </article>

            {/* Section 10 */}
            <article id="section-10" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                10. Dispute Resolution, Governing Law &amp; Jurisdiction
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  These Terms of Service, their interpretation, validity, and enforcement are governed strictly by the substantive laws of the Republic of Rwanda, without regard to principles of conflicts of law. All platform operations and transactions are deemed to have transpired within the municipal boundaries of the City of Kigali.
                </p>
                <p>
                  Drivers seeking to dispute an automated billing charge, camera plate misread, or citation must submit an administrative dispute via the ParkZone mobile app or support portal within seven (7) business days of session termination. ParkZone dispute teams will evaluate telemetry logs, optical images, and gate records, rendering a formal resolution within five (5) business days.
                </p>
                <p>
                  Any legal dispute, controversy, or claim arising out of or relating to these Terms that cannot be settled amicably through administrative review shall be submitted to the exclusive jurisdiction of the competent commercial courts of the City of Kigali, Rwanda.
                </p>
              </div>
            </article>

            {/* Section 11 */}
            <article id="section-11" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                11. Amendments, Service Notifications &amp; Severability
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  ParkZone reserves the right to modify, amend, or update these Terms of Service periodically to reflect statutory municipal directives, technological updates, or tariff adjustments formally gazetted by the City of Kigali. Material amendments will be communicated via in-app notifications, SMS alerts to registered phone numbers, or prominent website notices at least fourteen (14) calendar days prior to implementation.
                </p>
                <p>
                  Your continued use of ParkZone mobile software, web portals, or physical entry into any sensor-monitored facility following the effective date of revised Terms constitutes conclusive legal acceptance of all modifications. If you object to any revised provision, your sole remedy is to discontinue using the ParkZone network immediately.
                </p>
                <p>
                  If any provision of these Terms is deemed unlawful, invalid, or unenforceable by a court of competent jurisdiction in Rwanda, such provision shall be severed to the minimum extent necessary, and the validity, legality, and enforceability of the remaining provisions shall remain fully intact and operational.
                </p>
              </div>
            </article>

            {/* Bottom Support Callout */}
            <div className="rounded-3xl bg-[#E8F3EE] p-8 border border-emerald-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h3 className="font-serif text-xl text-neutral-900">Have questions regarding these terms?</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  Our legal compliance team and dispatch center are available 24/7 to assist you.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex px-6 py-2.5 rounded-full bg-[#2B2A2A] hover:bg-black text-white text-sm font-medium transition-all shadow-sm shrink-0"
              >
                Contact Legal Team
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ────────────────── FOOTER ────────────────── */}
      <footer className="pt-16 pb-12 bg-[#161515] pz-grain text-neutral-400">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <img
              src="/logo.webp"
              alt="ParkZone"
              width={100}
              height={24}
              className="h-6 w-auto object-contain brightness-0 invert opacity-70"
            />
            <span>© 2026 ParkZone Rwanda Ltd.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-white font-medium">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/bylaws" className="hover:text-white transition-colors">City Bylaws</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
