"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("section-1");

  const sections = [
    { id: "section-1", title: "1. Scope, Purpose & Data Controller Identity" },
    { id: "section-2", title: "2. Categories of Personal Data Collected" },
    { id: "section-3", title: "3. Automatic Number Plate Recognition (ANPR) & Optical Capture" },
    { id: "section-4", title: "4. Legal Grounds for Processing Under Law Nº 058/2021" },
    { id: "section-5", title: "5. Financial Data Protection & Payment Tokenization" },
    { id: "section-6", title: "6. Geolocation, Telemetry & Sensor Mapping" },
    { id: "section-7", title: "7. Third-Party Disclosures & Inter-Agency Coordination" },
    { id: "section-8", title: "8. Data Retention, Purging & Archival Schedules" },
    { id: "section-9", title: "9. Technical & Organizational Security Safeguards" },
    { id: "section-10", title: "10. Your Statutory Rights as a Data Subject" },
    { id: "section-11", title: "11. Policy Modifications & National Cyber Security Authority Recourse" },
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
            Rwanda Law Nº 058/2021 Data Compliance
          </span>
          <h1 className="mt-5 font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-[#2B2A2A]">
            Privacy Policy
          </h1>
          <p className="mt-4 text-[15px] sm:text-base text-neutral-500 leading-relaxed max-w-2xl">
            This Privacy Policy details how ParkZone Rwanda Ltd. collects, safeguards, utilizes, and manages personal data across our municipal parking camera systems, mobile platforms, and automated payment gateways.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-[12px] font-mono text-neutral-400 border-b border-black/[0.06] pb-8">
            <span>Last Updated: January 1, 2026</span>
            <span>·</span>
            <span>Regulated by: NCSA Rwanda</span>
            <span>·</span>
            <span>Standard: Law Nº 058/2021</span>
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
                1. Scope, Purpose &amp; Data Controller Identity
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  ParkZone Rwanda Ltd. (&quot;ParkZone&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), incorporated under the company laws of the Republic of Rwanda with registered headquarters in Kigali, acts as the certified Data Controller responsible for the capture and processing of personal data across our municipal parking infrastructure, smart portals, and mobile client applications.
                </p>
                <p>
                  We are steadfastly committed to protecting the fundamental privacy rights and individual dignity of every driver, passenger, and corporate account holder in full compliance with Law Nº 058/2021 of 13/10/2021 Relating to the Protection of Personal Data and Privacy. This Policy explains the specific types of data collected, our lawful justifications, information security architectures, and your statutory rights under Rwandan data protection frameworks.
                </p>
                <p>
                  This Privacy Policy applies universally to all individuals whose vehicles enter ParkZone camera-monitored facilities, all registered application users, visitors to our web services, and drivers communicating with our customer support and dispatch teams.
                </p>
              </div>
            </article>

            {/* Section 2 */}
            <article id="section-2" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                2. Categories of Personal Data Collected
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  When you download our client application, register a profile, or drive through a monitored parking portal, we collect defined categories of personal, vehicular, and electronic data. This includes direct contact identifiers such as your legal full name, verified primary mobile telephone number, email address, and company tax identification number (TIN) for corporate billing accounts.
                </p>
                <p>
                  In addition, we process vehicular identifiers including vehicle registration plate alphanumeric marks, vehicle make, model, color, and technical classification. Operational data gathered during each session includes entry and exit timestamps, sensor-measured dwell durations, chosen facility IDs, bay stall numbers, and total calculated tariffs.
                </p>
                <p>
                  When you access our software via smartphone or web browsers, our systems record technical log data such as device operating system version, hardware identifiers, Internet Protocol (IP) addresses, preferred language settings, and crash diagnostics to maintain system availability and security integrity.
                </p>
              </div>
            </article>

            {/* Section 3 */}
            <article id="section-3" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                3. Automatic Number Plate Recognition (ANPR) &amp; Optical Capture
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  High-definition optical Automatic Number Plate Recognition (ANPR) cameras positioned at facility portals photograph the front and rear registration plates of every motor vehicle attempting ingress or egress. Edge computing units process these optical feeds in real time to convert image pixels into verified alphanumeric characters, initiating or concluding parking sessions automatically.
                </p>
                <p>
                  Visual captures are framed specifically to isolate vehicle license plates and surrounding bumper surfaces. ParkZone algorithms do not deploy facial recognition technology on vehicle occupants, nor do our roadside cameras inspect cabin interiors. The sole purpose of optical photography is the precise verification of vehicle presence, barrier automation, and billing calculation.
                </p>
                <p>
                  Optical image files are stored in encrypted object storage vaults located within secure sovereign data centers in Rwanda. These images are accessible exclusively to authorized security supervisors and billing dispute investigators evaluating contested parking sessions.
                </p>
              </div>
            </article>

            {/* Section 4 */}
            <article id="section-4" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                4. Legal Grounds for Processing Under Law Nº 058/2021
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  In strict accordance with Article 18 of Rwanda Law Nº 058/2021, ParkZone processes personal data exclusively under defined statutory legal bases. First, processing is necessary for the performance of a contract to which the driver is party—specifically, delivering automated parking space allocation, barrier lifting, EV charging, and electronic fee settlement.
                </p>
                <p>
                  Second, processing is mandated to satisfy legal obligations imposed by the City of Kigali municipal mobility bylaws, the Rwanda Revenue Authority (RRA) for electronic VAT tax recording, and the Ministry of Infrastructure for urban traffic safety regulations.
                </p>
                <p>
                  Third, processing serves the legitimate public interest of optimizing urban road network utilization, preventing fraudulent barrier evasion, deterring vehicle theft in public facilities, and ensuring equitable turnover of municipal parking infrastructure across the city.
                </p>
              </div>
            </article>

            {/* Section 5 */}
            <article id="section-5" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                5. Financial Data Protection &amp; Payment Tokenization
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  Financial security is engineered with bank-level encryption protocols across all ParkZone transactions. ParkZone never stores, logs, or has access to your secret Mobile Money Personal Identification Number (PIN), bank account credentials, or credit card CVV validation codes on our infrastructure.
                </p>
                <p>
                  When you settle fees via MTN MoMo or Airtel Money, transaction requests are dispatched directly to telecommunication operators via secure API conduits licensed and audited by the National Bank of Rwanda (NBR). Card transactions are processed utilizing Payment Card Industry Data Security Standard (PCI-DSS Level 1) certified payment gateways that substitute sensitive card data with randomized cryptographic tokens.
                </p>
                <p>
                  Electronic transaction summaries containing payment authorization codes, currency amounts, VAT breakdowns, and masked telephone numbers are archived strictly to verify accounting integrity and issue official tax receipts.
                </p>
              </div>
            </article>

            {/* Section 6 */}
            <article id="section-6" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                6. Geolocation, Telemetry &amp; Sensor Mapping
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  To provide dynamic real-time routing to nearest available parking bays, automated EV charger guidance, and municipal street telemetry, our mobile application may request your permission to access device geolocation services. Device coordinates are processed ephemerally solely to display relevant parking facilities within your immediate driving radius.
                </p>
                <p>
                  Physical parking bays across Kigali Heights, Downtown CBD, and municipal sectors are monitored using overhead ultrasonic and electromagnetic loop sensors. These sensors detect only the physical presence or absence of metallic vehicular mass and do not record any biometric, audio, or visual personal identity attributes.
                </p>
                <p>
                  ParkZone does not continuously track your device location in the background when the application is closed, and we strictly prohibit the monetization, transfer, or sale of user movement trajectories to commercial advertisers or data brokers.
                </p>
              </div>
            </article>

            {/* Section 7 */}
            <article id="section-7" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                7. Third-Party Disclosures &amp; Inter-Agency Coordination
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  ParkZone treats personal data with strict professional confidentiality. We never sell, lease, or monetize your information. Disclosures to external entities occur exclusively under narrow, lawful circumstances essential for public municipal services and statutory enforcement.
                </p>
                <p>
                  We share relevant parking data with: (a) the City of Kigali Municipal Directorate for mobility planning and urban transit analysis; (b) the Rwanda National Police (RNP) strictly pursuant to official statutory criminal investigations involving reported stolen vehicles or hit-and-run occurrences; (c) the national Irembo platform for automated municipal citation resolution; and (d) cloud hosting providers operating under binding Data Processing Agreements (DPAs).
                </p>
                <p>
                  Any cross-border transfer of technical server logs for international maintenance is executed strictly in compliance with Article 48 of Law Nº 058/2021, ensuring recipient jurisdictions maintain equivalent or superior data protection standards validated by the National Cyber Security Authority (NCSA).
                </p>
              </div>
            </article>

            {/* Section 8 */}
            <article id="section-8" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                8. Data Retention, Purging &amp; Archival Schedules
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  Personal data is retained only for the temporal duration strictly necessary to fulfill the operational, commercial, and regulatory mandates for which it was originally collected, after which it is irreversibly destroyed or permanently anonymized.
                </p>
                <p>
                  Routine optical ANPR camera photographs capturing entry and exit plates are automatically purged from active storage clusters after ninety (90) calendar days, except where an active billing dispute, unpaid citation, or law enforcement evidentiary hold requires temporary extension.
                </p>
                <p>
                  Financial transaction logs, digital VAT receipts, and municipal revenue reconciliation records are retained for a period of five (5) fiscal years in compliance with national tax legislation and statutory municipal audit guidelines enacted by the Government of Rwanda.
                </p>
              </div>
            </article>

            {/* Section 9 */}
            <article id="section-9" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                9. Technical &amp; Organizational Security Safeguards
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  ParkZone implements defense-in-depth security architectures designed to thwart unauthorized data access, unlawful disclosure, accidental modification, or catastrophic loss. All digital communications between client mobile applications, camera endpoints, and central servers are encrypted utilizing Transport Layer Security (TLS 1.3) protocols.
                </p>
                <p>
                  Databases housing user credentials and vehicle records are protected with Advanced Encryption Standard (AES-256) at rest, supplemented by stringent Role-Based Access Controls (RBAC), multi-factor authentication (MFA) for administrative terminals, and immutable audit logging tracking all administrative queries.
                </p>
                <p>
                  In the event of a verified data breach impacting personal records, ParkZone will notify the National Cyber Security Authority (NCSA) Data Protection Office and affected data subjects without undue delay, within the statutory timeframes mandated by Law Nº 058/2021.
                </p>
              </div>
            </article>

            {/* Section 10 */}
            <article id="section-10" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                10. Your Statutory Rights as a Data Subject
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  Under Chapter V of Rwanda Law Nº 058/2021, you possess comprehensive and enforceable rights regarding personal data held by ParkZone. These statutory rights include: the right to obtain confirmation and transparent copies of all records maintained in relation to your profile and vehicles; the right to rectify inaccurate, obsolete, or incomplete registration details; and the right to object to automated decision-making.
                </p>
                <p>
                  You also possess the statutory right to request erasure (&quot;right to be forgotten&quot;) of your personal data where the operational necessity for retention has expired and no overarching tax or municipal statutory retention duty applies. Furthermore, you may request data portability to export your historical session and billing records in a structured, commonly used machine-readable format.
                </p>
                <p>
                  To exercise any of these statutory rights without incurring fees, submit a formal written request to our Data Protection Officer at privacy@parkzone.rw or via the support ticketing module in your ParkZone client application. Requests will be acknowledged and processed within thirty (30) calendar days.
                </p>
              </div>
            </article>

            {/* Section 11 */}
            <article id="section-11" className="scroll-mt-28 rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                11. Policy Modifications &amp; National Cyber Security Authority Recourse
              </h2>
              <div className="mt-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
                <p>
                  ParkZone routinely reviews and updates this Privacy Policy to ensure alignment with statutory directives, administrative circulars issued by the National Cyber Security Authority (NCSA), and evolving cybersecurity standards. When revisions occur, the updated policy will be published with an updated version number, and significant changes will be communicated via in-app alerts at least fourteen (14) days prior to taking effect.
                </p>
                <p>
                  Your continued use of ParkZone software services and physical facilities following the effective date of an updated policy denotes your informed acknowledgment of the revised data management practices.
                </p>
                <p>
                  If you consider that your personal data has been processed in violation of Law Nº 058/2021 or that a formal request submitted to ParkZone has not been satisfactorily addressed, you have the legal right to submit a formal complaint directly to the Data Protection Office of the National Cyber Security Authority (NCSA) of the Republic of Rwanda (www.ncsa.gov.rw).
                </p>
              </div>
            </article>

            {/* Bottom Support Callout */}
            <div className="rounded-3xl bg-[#E8F3EE] p-8 border border-emerald-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h3 className="font-serif text-xl text-neutral-900">Data Protection Inquiries</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  Contact our designated Data Protection Officer for statutory access or erasure requests.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex px-6 py-2.5 rounded-full bg-[#2B2A2A] hover:bg-black text-white text-sm font-medium transition-all shadow-sm shrink-0"
              >
                Contact Privacy Officer
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
            <Link href="/privacy" className="text-white font-medium">Privacy</Link>
            <Link href="/bylaws" className="hover:text-white transition-colors">City Bylaws</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
