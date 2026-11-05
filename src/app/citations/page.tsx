"use client";

import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/AdminShell";
import { InboxIcon, SearchIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { parkingService, ParkingFine, ParkingLocation } from "@/lib/services/parkingService";
import { formatCurrency } from "@/lib/utils/format";
import { TableSkeleton } from "@/components/Skeletons";

export default function CitationsPage() {
  const [loading, setLoading] = useState(true);
  const [citations, setCitations] = useState<ParkingFine[]>([]);
  const [locations, setLocations] = useState<ParkingLocation[]>([]);

  // Filtering & Search
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchPlate, setSearchPlate] = useState("");

  // Modals
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [newPlate, setNewPlate] = useState("");
  const [newLocationId, setNewLocationId] = useState("");
  const [newReason, setNewReason] = useState("No active parking ticket / unauthorized occupancy");
  const [newFineAmount, setNewFineAmount] = useState(3000);

  // Realtime Flash
  const [realtimeEvent, setRealtimeEvent] = useState<string | null>(null);

  // Load Citations & Locations
  const loadCitations = async () => {
    try {
      const [fines, locs] = await Promise.all([
        parkingService.getCitations(),
        parkingService.getLocations(),
      ]);
      setCitations(fines);
      setLocations(locs);
      if (locs.length > 0 && !newLocationId) {
        setNewLocationId(locs[0].id);
      }
    } catch (err) {
      console.warn("Failed fetching citations from DB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCitations();
  }, []);

  // Real-time Subscription to parking_fines
  useEffect(() => {
    const unsub = parkingService.subscribeToTable("parking_fines", () => {
      setRealtimeEvent("Citations Ledger Synced");
      setTimeout(() => setRealtimeEvent(null), 3000);
      loadCitations();
    });
    return () => unsub();
  }, []);

  const handleIssueCitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim()) return;
    try {
      const fineNum = `FN-${Date.now().toString().slice(-6)}`;
      const iremboCode = `IREMBO-RW-${Math.floor(100000 + Math.random() * 900000)}`;
      const cleanPlate = newPlate.trim().toUpperCase();

      const created = await parkingService.createCitation({
        fine_number: fineNum,
        vehicle_plate: cleanPlate,
        plate_hash: cleanPlate,
        location_id: newLocationId || null,
        fine_amount: Number(newFineAmount),
        currency: "RWF",
        reason: newReason,
        payment_status: "unpaid",
        irembo_reference_code: iremboCode,
        notes: "Admin contactless statutory citation issued.",
        issued_at: new Date().toISOString(),
      });

      if (created) {
        setCitations([created, ...citations]);
      }
      setShowIssueModal(false);
      setNewPlate("");
    } catch (err) {
      console.error("Failed issuing citation:", err);
    }
  };

  const markAsPaid = async (id: string) => {
    try {
      await parkingService.updateFineStatus(id, "paid");
      setCitations(citations.map((c) => (c.id === id ? { ...c, payment_status: "paid", paid_at: new Date().toISOString() } : c)));
    } catch (err) {
      console.warn("Failed updating fine status in DB:", err);
    }
  };

  const markAsDismissed = async (id: string) => {
    try {
      await parkingService.updateFineStatus(id, "waived");
      setCitations(citations.map((c) => (c.id === id ? { ...c, payment_status: "waived" } : c)));
    } catch (err) {
      console.warn("Failed dismissing fine in DB:", err);
    }
  };

  const handleDeleteCitation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this citation record?")) return;
    try {
      await parkingService.deleteCitation(id);
      setCitations(citations.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed deleting citation:", err);
    }
  };

  const filtered = citations.filter((c) => {
    const matchesStatus = filterStatus === "all" || c.payment_status === filterStatus;
    const q = searchPlate.toLowerCase().trim();
    const matchesPlate =
      !q ||
      c.vehicle_plate.toLowerCase().includes(q) ||
      (c.irembo_reference_code && c.irembo_reference_code.toLowerCase().includes(q)) ||
      c.fine_number.toLowerCase().includes(q);
    return matchesStatus && matchesPlate;
  });

  const totalUnpaid = citations.filter((c) => c.payment_status === "unpaid").length;
  const totalArrearsAmount = citations
    .filter((c) => c.payment_status === "unpaid")
    .reduce((acc, c) => acc + (c.fine_amount || 3000), 0);

  return (
    <AdminShell breadcrumb="Citations & Irembo Fines" onQuickAdd={() => setShowIssueModal(true)}>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#151921] p-6 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase tracking-wide border border-neutral-200 dark:border-neutral-700">
                Enforcement & Irembo
              </span>
              <span className="text-xs text-neutral-400">· Statutory Contactless Citations</span>
              {realtimeEvent && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {realtimeEvent}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-1">
              Violations, Citations & Arrears
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Inspect automated ANPR optical cameras, unpaid tickets, bay violations, and municipal fine reconciliation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 bg-[#f8f9fa] dark:bg-[#181d26] px-4 py-2.5 rounded-xl border border-neutral-200/60 dark:border-neutral-800">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                  Pending Arrears
                </span>
                <span className="text-base font-extrabold text-neutral-900 dark:text-white">
                  {formatCurrency(totalArrearsAmount)}
                </span>
              </div>
              <span className="text-neutral-300 dark:text-neutral-700">|</span>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                  Open Fines
                </span>
                <span className="text-base font-extrabold text-neutral-900 dark:text-white">
                  {totalUnpaid}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIssueModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <PlusIcon size={14} />
              <span className="whitespace-nowrap">Issue Citation</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#151921] p-4 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] text-xs">
          <div className="relative w-full sm:w-72">
            <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search Plate, Irembo Code, FN-#"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
              className="w-full bg-[#f8f9fa] dark:bg-[#181d26] border border-neutral-200 dark:border-neutral-700 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 shrink-0">
            {["all", "unpaid", "paid", "waived"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] transition-all whitespace-nowrap shrink-0 ${
                  filterStatus === st
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Citations Table */}
        <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f9fa] dark:bg-[#181d26] border-b border-neutral-200/80 dark:border-neutral-800 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Citation & Irembo</th>
                  <th className="py-3 px-4">License Plate</th>
                  <th className="py-3 px-4">Location Facility</th>
                  <th className="py-3 px-4">Infraction Reason</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Issued Timestamp</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-0">
                      <TableSkeleton rows={5} cols={8} />
                    </td>
                  </tr>
                ) : filtered.length > 0 ? (
                  filtered.map((c: any) => {
                    const isUnpaid = c.payment_status === "unpaid";
                    const isPaid = c.payment_status === "paid";
                    const locName = c.parking_locations?.name || locations.find((l) => l.id === c.location_id)?.name || "Kigali Municipal Facility";

                    return (
                      <tr key={c.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-mono font-bold text-neutral-900 dark:text-white">
                            {c.fine_number}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono">
                            {c.irembo_reference_code || "IREMBO-RW-PENDING"}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono font-black px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white">
                            {c.vehicle_plate}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[170px]" title={locName}>
                          {locName}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300 max-w-[200px] truncate" title={c.reason}>
                          {c.reason}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-neutral-900 dark:text-white whitespace-nowrap">
                          {formatCurrency(c.fine_amount)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isPaid
                                ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300"
                                : isUnpaid
                                ? "bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                            }`}
                          >
                            {c.payment_status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-500 text-[11px] whitespace-nowrap">
                          {c.issued_at
                            ? new Date(c.issued_at).toLocaleDateString("en-RW", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Just now"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                            {isUnpaid && (
                              <button
                                onClick={() => markAsPaid(c.id)}
                                className="px-2.5 py-1 rounded-lg bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-[10px] font-semibold transition-colors whitespace-nowrap shrink-0"
                              >
                                Mark Paid
                              </button>
                            )}
                            {isUnpaid && (
                              <button
                                onClick={() => markAsDismissed(c.id)}
                                className="px-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 text-[10px] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white whitespace-nowrap shrink-0"
                              >
                                Waive
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteCitation(c.id)}
                              className="p-1 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-[10px] font-semibold whitespace-nowrap shrink-0 transition-colors"
                              title="Delete record"
                            >
                              <TrashIcon size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-400 text-xs">
                      No citation records found matching filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ────────────────── MODAL: ISSUE CITATION ────────────────── */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
                  Issue Contactless Citation
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Statutory citation registered directly in database & linked with Irembo.
                </p>
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white"
                aria-label="Close"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <form onSubmit={handleIssueCitation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">License Plate Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RAD 123 A"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Parking Facility</label>
                <select
                  value={newLocationId}
                  onChange={(e) => setNewLocationId(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                  {locations.length === 0 && <option value="">No facilities configured</option>}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Violation Reason</label>
                <select
                  value={newReason}
                  onChange={(e) => {
                    const r = e.target.value;
                    setNewReason(r);
                    if (r.includes("EV Charging")) setNewFineAmount(5000);
                    else if (r.includes("accessible")) setNewFineAmount(10000);
                    else setNewFineAmount(3000);
                  }}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="No active parking ticket / unauthorized occupancy">
                    No active parking ticket / unauthorized occupancy (3,000 RWF)
                  </option>
                  <option value="Non-electric vehicle parked in EV Charging Bay">
                    Non-electric vehicle parked in EV Charging Bay (5,000 RWF)
                  </option>
                  <option value="Unauthorized parking in accessible/handicap stall">
                    Unauthorized parking in accessible/handicap stall (10,000 RWF)
                  </option>
                  <option value="Overstay beyond booked reservation session">
                    Overstay beyond booked reservation session (3,000 RWF)
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Fine Amount (RWF)</label>
                <input
                  type="number"
                  value={newFineAmount}
                  onChange={(e) => setNewFineAmount(Number(e.target.value))}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  Issue & Enforce Fine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
