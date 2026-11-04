"use client";

import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/AdminShell";
import { PlusIcon, TagsIcon, MoreCircleIcon } from "@/components/icons";
import { parkingService, EVChargingPoint, EVChargingSession } from "@/lib/services/parkingService";
import { formatCurrency } from "@/lib/utils/format";

export default function EVStationsPage() {
  const [loading, setLoading] = useState(true);
  const [chargers, setChargers] = useState<EVChargingPoint[]>([]);
  const [sessions, setSessions] = useState<EVChargingSession[]>([]);
  const [locationsList, setLocationsList] = useState<{ id: string; name: string }[]>([]);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showControlModal, setShowControlModal] = useState(false);
  const [selectedCharger, setSelectedCharger] = useState<EVChargingPoint | null>(null);

  // Add Station Form State
  const [newIdentifier, setNewIdentifier] = useState("");
  const [newLocationId, setNewLocationId] = useState("");
  const [newConnector, setNewConnector] = useState("CCS2");
  const [newMaxKw, setNewMaxKw] = useState(60);
  const [newPrice, setNewPrice] = useState(250);
  const [newFlatQuick, setNewFlatQuick] = useState(9000);
  const [newFlatFull, setNewFlatFull] = useState(10000);

  // Edit Charger Form State
  const [editStatus, setEditStatus] = useState<"available" | "charging" | "faulted" | "reserved" | "offline">("available");
  const [editOperational, setEditOperational] = useState<"operational" | "degraded" | "offline" | "faulted" | "maintenance">("operational");
  const [editCurrentDrawKw, setEditCurrentDrawKw] = useState(0);
  const [editPricePerKwh, setEditPricePerKwh] = useState(250);
  const [editFlatQuick, setEditFlatQuick] = useState(9000);
  const [editFlatFull, setEditFlatFull] = useState(10000);

  // Real-time flash indicator
  const [realtimeNotice, setRealtimeNotice] = useState<string | null>(null);

  // 1. Initial Data Fetch
  const loadEVData = async () => {
    try {
      const [evPoints, locs, evSessions] = await Promise.all([
        parkingService.getEVStations(),
        parkingService.getLocations(),
        parkingService.getEVSessions(30),
      ]);

      setChargers(evPoints);
      setSessions(evSessions);
      setLocationsList(locs.map((l) => ({ id: l.id, name: l.name })));
      if (locs.length > 0 && !newLocationId) {
        setNewLocationId(locs[0].id);
      }
    } catch (err) {
      console.warn("Failed fetching EV stations from DB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEVData();
  }, []);

  // 2. Real-time Subscriptions for EV telemetry & charging sessions
  useEffect(() => {
    const unsubPoints = parkingService.subscribeToTable("ev_charging_points", () => {
      setRealtimeNotice("Charger Telemetry Updated");
      setTimeout(() => setRealtimeNotice(null), 3000);
      loadEVData();
    });

    const unsubSessions = parkingService.subscribeToTable("ev_charging_sessions", () => {
      setRealtimeNotice("Active Session Event Received");
      setTimeout(() => setRealtimeNotice(null), 3000);
      loadEVData();
    });

    return () => {
      unsubPoints();
      unsubSessions();
    };
  }, []);

  // Open Charger Admin Control
  const handleOpenControl = (charger: EVChargingPoint) => {
    setSelectedCharger(charger);
    setEditStatus(charger.status);
    setEditOperational(charger.operational_status);
    setEditCurrentDrawKw(charger.current_power_draw_kw || 0);
    setEditPricePerKwh(charger.price_per_kwh || 250);
    setEditFlatQuick(charger.flat_rate_quick_rwf || 9000);
    setEditFlatFull(charger.flat_rate_full_rwf || 10000);
    setShowControlModal(true);
  };

  // Save Charger Admin Changes
  const handleSaveChargerControl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCharger) return;
    try {
      const isAvailable = editStatus === "available";
      const watts = Number(editCurrentDrawKw) * 1000;
      const updated = await parkingService.updateEVStation(selectedCharger.id, {
        status: editStatus,
        operational_status: editOperational,
        is_operational: editOperational === "operational" || editOperational === "degraded",
        current_power_draw_kw: Number(editCurrentDrawKw),
        charging_power_watts: watts,
        price_per_kwh: Number(editPricePerKwh),
        flat_rate_quick_rwf: Number(editFlatQuick),
        flat_rate_full_rwf: Number(editFlatFull),
      });

      if (updated) {
        setChargers(chargers.map((c) => (c.id === updated.id ? updated : c)));
      }
      setShowControlModal(false);
    } catch (err) {
      console.error("Failed saving charger controls:", err);
    }
  };

  // Add New Charger Handler
  const handleAddStation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await parkingService.createEVStation({
        station_identifier: newIdentifier,
        location_id: newLocationId || locationsList[0]?.id || "",
        connector_type: newConnector,
        max_output_kw: Number(newMaxKw),
        max_power_watts: Number(newMaxKw) * 1000,
        voltage_volts: Number(newMaxKw) >= 50 ? 400 : 230,
        price_per_kwh: Number(newPrice),
        flat_rate_quick_rwf: Number(newFlatQuick),
        flat_rate_full_rwf: Number(newFlatFull),
        parking_fee_rwf: 0,
        status: "available",
        operational_status: "operational",
        is_operational: true,
        current_power_draw_kw: 0,
        charging_power_watts: 0,
        total_energy_delivered_kwh: 0,
      });

      if (created) {
        setChargers([created, ...chargers]);
      }
      setShowAddModal(false);
      setNewIdentifier("");
    } catch (err) {
      console.error("Failed creating EV station in DB:", err);
    }
  };

  // Force Complete Session
  const handleForceCompleteSession = async (sessionId: string) => {
    try {
      await parkingService.completeEVSession(sessionId);
      await loadEVData();
    } catch (err) {
      console.error("Failed completing EV session:", err);
    }
  };

  // Delete Charger
  const handleDeleteCharger = async () => {
    if (!selectedCharger) return;
    if (!confirm(`Are you sure you want to delete ${selectedCharger.station_identifier}?`)) return;
    try {
      await parkingService.deleteEVStation(selectedCharger.id);
      setChargers(chargers.filter((c) => c.id !== selectedCharger.id));
      setShowControlModal(false);
    } catch (err) {
      console.error("Failed deleting EV station:", err);
    }
  };

  // Metrics
  const totalKwDraw = chargers.reduce((acc, s) => acc + (s.current_power_draw_kw || 0), 0);
  const activeChargersCount = chargers.filter((s) => s.status === "charging").length;
  const availableChargersCount = chargers.filter((s) => s.status === "available").length;
  const totalEnergyDelivered = chargers.reduce((acc, s) => acc + (s.total_energy_delivered_kwh || 0), 0);

  return (
    <AdminShell breadcrumb="EV Fast Stations Telemetry" onQuickAdd={() => setShowAddModal(true)}>
      <div className="space-y-6">
        {/* Banner with Real-time Pill */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#151921] p-6 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase tracking-wide border border-neutral-200 dark:border-neutral-700">
                Clean Mobility Rwanda
              </span>
              <span className="text-xs text-neutral-400">· OCPP 2.0.1 Protocol Telemetry</span>
              {realtimeNotice && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  {realtimeNotice}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-1">
              EV Fast Charging Stations & Live Hardware Telemetry
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Live power output, 400V grid draw, automated 9,000 / 10,000 RWF flat session billing, and emergency override control.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 self-start md:self-auto whitespace-nowrap shrink-0"
          >
            <PlusIcon size={14} />
            <span className="whitespace-nowrap">Register Charger</span>
          </button>
        </div>

        {/* 4 Telemetry Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#151921] p-5 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] shadow-xs">
            <span className="text-xs font-semibold text-neutral-500">Live Grid Power Draw</span>
            <div className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-2">
              {totalKwDraw.toFixed(1)} <span className="text-sm font-bold text-neutral-400">kW</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">{activeChargersCount} active charging sessions</p>
          </div>

          <div className="bg-white dark:bg-[#151921] p-5 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] shadow-xs">
            <span className="text-xs font-semibold text-neutral-500">Statutory Flat Tariff</span>
            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-2">
              9k <span className="text-sm font-bold text-neutral-400">/ 10k RWF</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">&lt;30m quick vs full charge (0 RWF parking)</p>
          </div>

          <div className="bg-white dark:bg-[#151921] p-5 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] shadow-xs">
            <span className="text-xs font-semibold text-neutral-500">Network Fleet Readiness</span>
            <div className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-2">
              {availableChargersCount} <span className="text-sm font-bold text-neutral-400">/ {chargers.length}</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Available chargers ready for EV drivers</p>
          </div>

          <div className="bg-white dark:bg-[#151921] p-5 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] shadow-xs">
            <span className="text-xs font-semibold text-neutral-500">Total Energy Delivered</span>
            <div className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-2">
              {totalEnergyDelivered.toFixed(1)} <span className="text-sm font-bold text-neutral-400">kWh</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Dispensed to Kigali electric fleet</p>
          </div>
        </div>

        {/* Station Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {chargers.length > 0 ? (
            chargers.map((st) => {
              const isCharging = st.status === "charging";
              const isFaulted = st.status === "faulted" || st.operational_status === "faulted";
              const isOffline = st.status === "offline" || st.operational_status === "offline";

              // Find active session for this charger
              const activeSession = sessions.find(
                (s) => s.status === "active" && (s.charger_id === st.id || s.bay_number?.toUpperCase() === st.station_identifier?.toUpperCase())
              );

              return (
                <div
                  key={st.id}
                  onClick={() => handleOpenControl(st)}
                  className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-neutral-400 transition-all cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase block">
                          {locationsList.find((l) => l.id === st.location_id)?.name || "Kigali EV Hub"}
                        </span>
                        <h3 className="font-extrabold text-base text-neutral-900 dark:text-white mt-0.5">
                          {st.station_identifier}
                        </h3>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${
                            isCharging
                              ? "bg-blue-600 text-white border-blue-600"
                              : isFaulted
                              ? "bg-red-600 text-white border-red-600"
                              : isOffline
                              ? "bg-neutral-600 text-white border-neutral-600"
                              : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                          }`}
                        >
                          {isCharging && <span className="inline-block w-1.5 h-1.5 rounded-full bg-white mr-1.5 align-middle animate-pulse" />}
                          {st.status}
                        </span>
                      </div>
                    </div>

                    {/* Hardware specs */}
                    <div className="flex items-center gap-2 mt-3 text-xs text-neutral-500 dark:text-neutral-400 flex-wrap">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {st.connector_type}
                      </span>
                      <span>·</span>
                      <span>{st.max_output_kw} kW Max</span>
                      <span>·</span>
                      <span>{st.voltage_volts || 400}V</span>
                      <span>·</span>
                      <span>{formatCurrency(st.flat_rate_quick_rwf || 9000)} Flat</span>
                    </div>

                    {/* Active Charging Session Box */}
                    {isCharging && (
                      <div className="mt-4 p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#181d26] border border-neutral-200/60 dark:border-neutral-800 space-y-2.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-500">Vehicle Plate:</span>
                          <span className="font-mono font-bold text-neutral-900 dark:text-white">
                            {activeSession?.vehicle_plate || "RAD 882 A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-500">Live Power:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            {st.current_power_draw_kw || 42} kW
                          </span>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1 font-medium">
                            <span className="text-neutral-400">Target Battery SoC</span>
                            <span className="font-bold">{activeSession?.target_soc || 80}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${activeSession?.target_soc || 80}%` }}
                              className="h-full bg-blue-500 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {!isCharging && (
                      <div className="mt-4 p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#181d26] border border-neutral-200/60 dark:border-neutral-800 text-xs text-neutral-400 flex items-center justify-between">
                        <span>Delivered: {(st.total_energy_delivered_kwh || 0).toFixed(1)} kWh</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">● Ready to Charge</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                    <span className="text-neutral-400 text-[11px]">
                      Operational: <strong className="capitalize text-neutral-700 dark:text-neutral-300">{st.operational_status}</strong>
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-300 font-semibold hover:underline">
                      Admin Control →
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734]">
              <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                No EV fast charging stations found in database.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-3 px-4 py-2 rounded-xl bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
              >
                Register EV Station
              </button>
            </div>
          )}
        </div>

        {/* ── LIVE EV CHARGING SESSIONS TABLE ── */}
        <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] overflow-hidden shadow-xs">
          <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
                Live & Recent EV Charging Sessions
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Real-time session records from ev_charging_sessions with kilowatt deliveries & revenue.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              {sessions.length} Recorded Sessions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-300">
              <thead className="bg-[#f8f9fa] dark:bg-[#181d26] border-b border-neutral-200/80 dark:border-neutral-800 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Session #</th>
                  <th className="py-3 px-4">Vehicle Plate</th>
                  <th className="py-3 px-4">Station / Bay</th>
                  <th className="py-3 px-4">Delivered</th>
                  <th className="py-3 px-4">Tariff Tier</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {sessions.length > 0 ? (
                  sessions.map((sess) => {
                    const isActive = sess.status === "active";
                    return (
                      <tr key={sess.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-white">
                          {sess.session_number}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">
                            {sess.vehicle_plate}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-neutral-800 dark:text-neutral-200">
                          {sess.bay_number}
                        </td>
                        <td className="py-3 px-4">
                          {sess.delivered_kwh.toFixed(2)} kWh
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize text-neutral-600 dark:text-neutral-400">
                            {sess.tariff_tier.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">
                          {formatCurrency(sess.charging_amount_rwf)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isActive
                                ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 animate-pulse"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                            }`}
                          >
                            {sess.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isActive ? (
                            <button
                              onClick={() => handleForceCompleteSession(sess.id)}
                              className="px-2.5 py-1 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-[10px] hover:opacity-90"
                            >
                              Complete Session
                            </button>
                          ) : (
                            <span className="text-[10px] text-neutral-400">Recorded</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-neutral-400 text-xs">
                      No EV charging sessions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ────────────────── MODAL: CHARGER ADMIN CONTROL ────────────────── */}
      {showControlModal && selectedCharger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
                  Charger Telemetry Control · {selectedCharger.station_identifier}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  OCPP 2.0.1 command interface & tariff governance.
                </p>
              </div>
              <button
                onClick={() => setShowControlModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveChargerControl} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Session Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="available">Available / Free</option>
                    <option value="charging">Charging Active</option>
                    <option value="faulted">Faulted / Interrupted</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Hardware Health</label>
                  <select
                    value={editOperational}
                    onChange={(e) => setEditOperational(e.target.value as any)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="operational">Fully Operational</option>
                    <option value="degraded">Degraded Output</option>
                    <option value="maintenance">Maintenance Locked</option>
                    <option value="faulted">Hardware Fault</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Simulated Grid Draw (kW)</label>
                <input
                  type="number"
                  value={editCurrentDrawKw}
                  onChange={(e) => setEditCurrentDrawKw(Number(e.target.value))}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Quick Tariff &lt;30m (RWF)</label>
                  <input
                    type="number"
                    value={editFlatQuick}
                    onChange={(e) => setEditFlatQuick(Number(e.target.value))}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Full Charge Tariff (RWF)</label>
                  <input
                    type="number"
                    value={editFlatFull}
                    onChange={(e) => setEditFlatFull(Number(e.target.value))}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={handleDeleteCharger}
                  className="px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 font-semibold"
                >
                  Delete Charger
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowControlModal(false)}
                    className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD CHARGER ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                Register New EV Charging Station
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 flex items-center justify-center hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Station Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EV-01, BAY-101"
                  value={newIdentifier}
                  onChange={(e) => setNewIdentifier(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Parking Facility</label>
                <select
                  value={newLocationId}
                  onChange={(e) => setNewLocationId(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  {locationsList.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                  {locationsList.length === 0 && (
                    <option value="">No facilities created yet</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Connector Protocol</label>
                  <select
                    value={newConnector}
                    onChange={(e) => setNewConnector(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="CCS2">CCS2 DC Fast</option>
                    <option value="Type 2">Type 2 AC</option>
                    <option value="CHAdeMO">CHAdeMO</option>
                    <option value="Tesla">Tesla Supercharger</option>
                    <option value="GBT">GB/T</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Max Power (kW)</label>
                  <input
                    type="number"
                    value={newMaxKw}
                    onChange={(e) => setNewMaxKw(Number(e.target.value))}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Quick Tariff (&lt;30m)</label>
                  <input
                    type="number"
                    value={newFlatQuick}
                    onChange={(e) => setNewFlatQuick(Number(e.target.value))}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Full Charge Tariff</label>
                  <input
                    type="number"
                    value={newFlatFull}
                    onChange={(e) => setNewFlatFull(Number(e.target.value))}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold"
                >
                  Register Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
