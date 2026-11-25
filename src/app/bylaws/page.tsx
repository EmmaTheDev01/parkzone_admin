"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function BylawsPage() {
  const [activeSection, setActiveSection] = useState("section-1");

  const sections = [
    { id: "section-1", title: "1. Municipal Mandate & Legal Authority" },
    { id: "section-2", title: "2. Mandatory Vehicle Registration & Plate Visibility" },
    { id: "section-3", title: "3. Gazetted Tariffs & Statutory 15-Minute Free Grace" },
    { id: "section-4", title: "4. Municipal Daily Tariff Cap & Unified Mobility" },
    { id: "section-5", title: "5. Designated Bay Usage, Demarcation & Straddling Infractions" },
    { id: "section-6", title: "6. Accessible Parking Concessions & Persons with Disabilities (PWD)" },
    { id: "section-7", title: "7. Electric Vehicle (EV) Charging Stalls & Green Infrastructure" },
    { id: "section-8", title: "8. Prohibited Parking: Fire Aprons, Bus Corridors & Red Zones" },
    { id: "section-9", title: "9. Continuous Dwell, Abandoned Vehicles & Municipal Impoundment" },
    { id: "section-10", title: "10. Statutory Citations, Wheel Clamping & Irembo Revenue Enforcement" },
    { id: "section-11", title: "11. Administrative Appeals, Review Procedures & Municipal Redress" },
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
              href="/terms"
              className="hidden sm:inline-block text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="hidden sm:inline-block text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Privacy Policy
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
            City of Kigali Municipal Governance
          </span>
          <h1 className="mt-5 font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-[#2B2A2A]">
            City Parking Bylaws
          </h1>
          <p className="mt-4 text-[15px] sm:text-base text-neutral-500 leading-relaxed max-w-2xl">
            Official municipal regulations governing roadside parking bays, automated ANPR camera facilities, tariffs, EV stalls, and statutory enforcement across Nyarugenge, Gasabo, and Kicukiro districts.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-[12px] font-mono text-neutral-400 border-b border-black/[0.06] pb-8">
            <span>Authority: City of Kigali Council</span>
            <span>·</span>
            <span>District Concessions: All 3 Sectors</span>
            <span>·</span>
            <span>Enforcement: Certified Marshals &amp; ANPR</span>
          </div>
        </div>

        {/* 2-Column Layout */}
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
                1. Municipal Mandate &amp; Legal Authority
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  Pursuant to Law Nº 87/2013 on the Organization and Functioning of Decentralized Administrative Entities and Ministerial Orders governing Urban Mobility in Rwanda, the City of Kigali exercises full legislative and regulatory jurisdiction over all public highways, roadside parking bays, municipal squares, and off-street parking facilities located within the administrative boundaries of Nyarugenge, Gasabo, and Kicukiro districts.
                </p>
                <p>
                  ParkZone Rwanda Ltd. operates as the designated municipal concessionaire entrusted with modernizing parking infrastructure, deploying optical camera telemetry, automating access control, and collecting municipal parking revenues in strict conformance with the master concession agreements executed with the City of Kigali Council.
                </p>
                <p>
                  All motorists driving, parking, or operating motor vehicles within designated public parking zones are legally subject to the provisions, tariffs, inspection procedures, and administrative penalties enacted within these municipal bylaws.
                </p>
              </div>
            </article>

            {/* Section 2 */}
            <article id="section-2" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                2. Mandatory Vehicle Registration &amp; Plate Visibility
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  Every motor vehicle parked within a municipal street bay, commercial lot, or parking structure must display official, authentic license plates issued by the Rwanda Revenue Authority (RRA) or competent foreign registration bodies, securely mounted to the front and rear of the chassis in an upright, perpendicular position.
                </p>
                <p>
                  Covering, obscuring, tinting, mechanically flipping, or allowing mud or road debris to render any license plate illegible to human observers or optical ANPR cameras constitutes a severe municipal infraction. Vehicles with obscured or unreadable plates are subject to immediate physical inspection by municipal marshals.
                </p>
                <p>
                  Vehicles displaying fraudulent, counterfeit, altered, or mismatched registration plates will be immobilized immediately with heavy-duty mechanical wheel clamps, reported to the Rwanda National Police (RNP) for criminal investigation, and towed to the municipal impoundment facility at the vehicle owner&apos;s sole expense.
                </p>
              </div>
            </article>

            {/* Section 3 */}
            <article id="section-3" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                3. Gazetted Tariffs &amp; Statutory 15-Minute Free Grace
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  Municipal parking rates are gazetted by the City of Kigali Council at a uniform baseline tariff of three hundred Rwandan Francs (300 RWF) per hourly increment on standard municipal streets and public parking plazas. Dwell time is measured continuously using optical barrier timestamps or ground-embedded magnetic loop telemetry.
                </p>
                <p>
                  In accordance with City of Kigali Administrative Order No. 04/2024, every municipal parking stall and camera portal enforces an automatic statutory grace period of fifteen (15) consecutive minutes. Motorists executing passenger drop-offs, commercial deliveries, or brief errands who vacate the stall within fifteen minutes incur zero fee obligations (0 RWF).
                </p>
                <p>
                  Upon entering the sixteenth (16th) minute of dwell time, the grace period dissolves retroactively, and billable parking time is computed from the initial minute of entry recorded by the optical camera or ground telemetry sensor.
                </p>
              </div>
            </article>

            {/* Section 4 */}
            <article id="section-4" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                4. Municipal Daily Tariff Cap &amp; Unified Mobility
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  To eliminate excessive economic burdens on commercial commuters and support urban productivity across Kigali, the City Council has enacted a mandatory daily parking ceiling capped at exactly two thousand Rwandan Francs (2,000 RWF) per registered vehicle per calendar day (00:00 to 23:59 CAT).
                </p>
                <p>
                  Once an individual license plate accumulates 2,000 RWF in verified transient fees within a calendar day, the ParkZone billing system automatically freezes all subsequent transient charges. The vehicle may enter, park, and exit any participating municipal parking zone across all three urban districts without incurring supplementary transient fees for the balance of that calendar day.
                </p>
                <p>
                  The daily tariff cap is strictly non-transferable between vehicles and does not subsidize or encompass kilowatt-hour (kWh) electricity consumption at municipal EV fast-charging stations or statutory fines for parking infractions.
                </p>
              </div>
            </article>

            {/* Section 5 */}
            <article id="section-5" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                5. Designated Bay Usage, Demarcation &amp; Straddling Infractions
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  Every vehicle operator must park their vehicle completely within the painted white, yellow, or blue boundary lines demarcating a single designated parking bay. Vehicles must align parallel or angled to the curb as dictated by street marking orientation and directional arrows.
                </p>
                <p>
                  Straddling painted bay dividers, parking diagonally across two adjacent stalls, or obstructing adjacent vehicles from opening passenger doors constitutes a municipal improper parking infraction punishable by an administrative citation of ten thousand Rwandan Francs (10,000 RWF).
                </p>
                <p>
                  Oversized commercial vehicles, long-wheelbase cargo trucks, and buses whose physical footprints exceed standard passenger bay dimensions (2.5m x 5.0m) are prohibited from parking in standard municipal bays and must utilize designated heavy logistics terminals in Gikondo and Masaka.
                </p>
              </div>
            </article>

            {/* Section 6 */}
            <article id="section-6" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                6. Accessible Parking Concessions &amp; Persons with Disabilities (PWD)
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  Parking stalls demarcated with distinct blue reflective thermoplastic paint and marked with the International Symbol of Access are strictly reserved for vehicles conveying persons with physical disabilities who possess a verified municipal or national PWD mobility permit.
                </p>
                <p>
                  Unauthorized vehicles found occupying an accessible stall—regardless of whether hazard warning flashers are activated, or a driver remains seated behind the steering wheel—will be issued an immediate maximum municipal citation of twenty-five thousand Rwandan Francs (25,000 RWF) and prioritized for immediate towing.
                </p>
                <p>
                  Legitimate holders of verified City of Kigali PWD permits are granted statutory municipal concessions, including a fifty percent (50%) discount on standard transient parking tariffs and priority access to all municipal EV fast-charging hubs.
                </p>
              </div>
            </article>

            {/* Section 7 */}
            <article id="section-7" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                7. Electric Vehicle (EV) Charging Stalls &amp; Green Infrastructure
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  Under the Kigali Green City Master Plan, dedicated electric vehicle charging bays equipped with DC fast chargers or AC Level 2 charging equipment constitute critical green transit infrastructure, reserved exclusively for active, plugged-in battery electric vehicles (BEVs).
                </p>
                <p>
                  Internal Combustion Engine (ICE) vehicles that park in designated EV charging stalls, as well as plug-in electric vehicles parked without actively drawing electricity from the charging connector, are classified as green infrastructure obstructions and will be cited and towed immediately.
                </p>
                <p>
                  Motorists must disconnect and relocate their fully charged electric vehicle within fifteen (15) minutes of charge completion. Vehicles that remain stationary in an active charging stall past this threshold will incur automated idle charges of fifty Rwandan Francs (50 RWF) per minute to preserve charging availability.
                </p>
              </div>
            </article>

            {/* Section 8 */}
            <article id="section-8" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                8. Prohibited Parking: Fire Aprons, Bus Corridors &amp; Red Zones
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  Stopping, idling, or parking a motor vehicle is strictly prohibited at all times in marked red zones, emergency fire hydrant aprons, ambulance access routes, designated bus transit corridors, pedestrian zebra crossings, and public sidewalk ramps.
                </p>
                <p>
                  Any vehicle situated within an emergency corridor or obstructing dedicated public transport lanes will be deemed an imminent public hazard. Certified municipal marshals and Rwanda National Police traffic units are legally empowered to clamp and tow such vehicles immediately without prior notice.
                </p>
                <p>
                  All towing and impound recovery costs—including standard flatbed transit fees of forty thousand Rwandan Francs (40,000 RWF) plus accrued daily storage fees—must be settled in full prior to vehicle release from municipal yards.
                </p>
              </div>
            </article>

            {/* Section 9 */}
            <article id="section-9" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                9. Continuous Dwell, Abandoned Vehicles &amp; Municipal Impoundment
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  Public municipal parking facilities are designed for transit, business, and daily commuting mobility. Continuous parking of any motor vehicle in a municipal bay for exceeding forty-eight (48) consecutive hours without registered prior authorization is classified as municipal vehicle abandonment.
                </p>
                <p>
                  When a vehicle reaches forty-eight hours of continuous unbilled dwell time, municipal marshals will affix an official notice of intent to impound upon the driver-side windshield, and dispatch formal SMS notices to the registered owner&apos;s telephone number.
                </p>
                <p>
                  If the abandoned vehicle remains unclaimed, unverified, and unpaid for five (5) consecutive business days following physical notice issuance, it will be towed to the City of Kigali Municipal Impound Facility and processed for statutory public auction in accordance with national asset recovery laws.
                </p>
              </div>
            </article>

            {/* Section 10 */}
            <article id="section-10" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                10. Statutory Citations, Wheel Clamping &amp; Irembo Revenue Enforcement
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  Statutory parking citations issued by certified municipal marshals or automated ANPR evasion algorithms are digitally registered on the national Irembo electronic revenue platform. Motorists receive immediate electronic notification via SMS containing the citation number, infraction code, photographic evidence, and payment billing ID.
                </p>
                <p>
                  All citations must be settled within fourteen (14) calendar days of electronic issuance via the ParkZone mobile app, Mobile Money USSD (*812#), or through direct Irembo payment channels at commercial banking partners.
                </p>
                <p>
                  Citations remaining delinquent beyond the statutory fourteen-day threshold will incur a mandatory late penalty of fifty percent (50%) and will result in the immediate immobilization of the vehicle via wheel clamping upon subsequent detection on any municipal roadway in Kigali.
                </p>
              </div>
            </article>

            {/* Section 11 */}
            <article id="section-11" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                11. Administrative Appeals, Review Procedures &amp; Municipal Redress
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  Any motorist who believes an automated camera tariff was calculated in error, an ANPR optical misread occurred, or a municipal citation was issued unjustly possesses the statutory right to file a formal administrative appeal within seven (7) business days of the incident.
                </p>
                <p>
                  Appeals may be submitted directly through the ParkZone client application or lodged in writing with the City of Kigali Mobility Appeals Directorate at City Hall. Appellants must supply verifiable supporting documentation, such as electronic payment timestamps, vehicle maintenance logs, or municipal permits.
                </p>
                <p>
                  The Municipal Appeals Directorate will review optical telemetry files and issue a binding written determination within ten (10) business days. During the pendency of a formal review, all statutory late penalty accruals and wheel-clamping enforcement orders are temporarily frozen.
                </p>
              </div>
            </article>

            {/* Bottom Support Callout */}
            <div className="rounded-3xl bg-[#E8F3EE] p-8 border border-emerald-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h3 className="font-serif text-xl text-neutral-900">City Mobility Office Inquiries</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  Questions regarding municipal mobility concessions, permits, or commercial logistics zones?
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex px-6 py-2.5 rounded-full bg-[#2B2A2A] hover:bg-black text-white text-sm font-medium transition-all shadow-sm shrink-0"
              >
                Contact Mobility Support
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
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/bylaws" className="text-white font-medium">City Bylaws</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
