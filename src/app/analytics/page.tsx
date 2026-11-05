"use client";

import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/AdminShell";
import { ChartsIcon, WalletIcon, ExpandIcon, MoreCircleIcon } from "@/components/icons";
import { parkingService } from "@/lib/services/parkingService";
import { formatCurrency, formatNumberCompact } from "@/lib/utils/format";
import { MetricsRowSkeleton } from "@/components/Skeletons";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"Today" | "Week" | "Month" | "Year">("Today");
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    grandTotal: 0,
    hourlyCount: 0,
    hourlyRevenue: 0,
    cappedCount: 0,
    cappedRevenue: 0,
    evDeliveredKwh: 0,
    evRevenue: 0,
    finesCollected: 0,
    finesCount: 0,
    locations: [] as { id: string; name: string; total: number; occupied: number; revenueRwf: number }[],
    fleet: { regular: 0, ev: 0, handicap: 0, total: 0 },
  });

  const [realtimeNotification, setRealtimeNotification] = useState<string | null>(null);

  const loadAnalytics = async () => {
    try {
      const res = await parkingService.getAnalyticsData();
      setAnalytics(res);
    } catch (err) {
      console.warn("Failed fetching analytics from DB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  // Real-time Subscriptions across tickets, fines, and EV sessions
  useEffect(() => {
    const unsubTickets = parkingService.subscribeToTable("parking_tickets", () => {
      setRealtimeNotification("Revenue Ledger Updated");
      setTimeout(() => setRealtimeNotification(null), 3000);
      loadAnalytics();
    });

    const unsubFines = parkingService.subscribeToTable("parking_fines", () => {
      setRealtimeNotification("Citation Receipts Synced");
      setTimeout(() => setRealtimeNotification(null), 3000);
      loadAnalytics();
    });

    const unsubSessions = parkingService.subscribeToTable("ev_charging_sessions", () => {
      setRealtimeNotification("EV Power Settlement Synced");
      setTimeout(() => setRealtimeNotification(null), 3000);
      loadAnalytics();
    });

    return () => {
      unsubTickets();
      unsubFines();
      unsubSessions();
    };
  }, []);

  const totalVehicles = analytics.fleet.total || 0;
  const regPct = totalVehicles > 0 ? Math.round((analytics.fleet.regular / totalVehicles) * 100) : 0;
  const evPct = totalVehicles > 0 ? Math.round((analytics.fleet.ev / totalVehicles) * 100) : 0;
  const hndPct = totalVehicles > 0 ? Math.round((analytics.fleet.handicap / totalVehicles) * 100) : 0;

  return (
    <AdminShell breadcrumb="Profits & Revenue Analytics">
      <div className="space-y-6">
        {/* Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#151921] p-6 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase tracking-wide border border-neutral-200 dark:border-neutral-700">
                Fiscal Model Kigali
              </span>
              <span className="text-xs text-neutral-400">· {formatCurrency(300)}/hr · {formatCurrency(2000)} Daily Cap</span>
              {realtimeNotification && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {realtimeNotification}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-1">
              Profits & Revenue Analytics
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Live automated statutory billing aggregation: Transient Hourly, Commuter Caps, EV Sales, and Citations.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#f8f9fa] dark:bg-[#181d26] p-1 rounded-xl border border-neutral-200/80 dark:border-neutral-700/80 text-xs">
            {(["Today", "Week", "Month", "Year"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 ${
                  period === p
                    ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs"
                    : "text-neutral-500 hover:text-black dark:hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Summary KPI Cards */}
        {loading ? (
          <MetricsRowSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#151921] rounded-xl border border-[#e8ecf1] dark:border-[#202734] p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-neutral-500">Gross Accrued Revenue</span>
            <div className="my-3">
              <div className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight truncate">
                {formatCurrency(analytics.grandTotal)}
              </div>
              <span className="text-[11px] text-neutral-400 mt-0.5 block truncate">
                All Revenue Channels Combined
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <span>Period</span>
              <span className="text-neutral-700 dark:text-neutral-300 font-semibold">{period}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#151921] rounded-xl border border-[#e8ecf1] dark:border-[#202734] p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-neutral-500">Hourly Tariff Sessions (300 RWF)</span>
            <div className="my-3">
              <div className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight truncate">
                {formatCurrency(analytics.hourlyRevenue)}
              </div>
              <span className="text-[11px] text-neutral-400 mt-0.5 block truncate">
                {formatNumberCompact(analytics.hourlyCount)} Transient Tickets
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <span>Standard Rate</span>
              <span className="text-neutral-700 dark:text-neutral-300 font-semibold">300 RWF/hr</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#151921] rounded-xl border border-[#e8ecf1] dark:border-[#202734] p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-neutral-500">Daily Commuter Caps (2,000 RWF)</span>
            <div className="my-3">
              <div className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight truncate">
                {formatCurrency(analytics.cappedRevenue)}
              </div>
              <span className="text-[11px] text-neutral-400 mt-0.5 block truncate">
                {formatNumberCompact(analytics.cappedCount)} Capped Commuters
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <span>Statutory Rule</span>
              <span className="text-neutral-700 dark:text-neutral-300 font-semibold">Max 2,000 / Day</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#151921] rounded-xl border border-[#e8ecf1] dark:border-[#202734] p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-neutral-500">EV Power Revenue</span>
            <div className="my-3">
              <div className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight truncate">
                {formatCurrency(analytics.evRevenue)}
              </div>
              <span className="text-[11px] text-neutral-400 mt-0.5 block truncate">
                {analytics.evDeliveredKwh.toFixed(1)} kWh Delivered
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <span>Unit Tariff</span>
              <span className="text-neutral-700 dark:text-neutral-300 font-semibold">250 RWF / kWh</span>
            </div>
          </div>
        </div>
        )}

        {/* 2-Column Split: Facility Breakdown vs Fleet Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Facility Revenue & Occupancy Breakdown */}
          <div className="lg:col-span-7 bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white truncate max-w-[240px]">
                  Kigali Facilities: Occupancy & Revenue
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5 truncate max-w-[240px]">
                  Database occupancy & municipal gross receipts
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              {analytics.locations.length > 0 ? (
                analytics.locations.map((fac) => {
                  const pct = fac.total > 0 ? Math.round((fac.occupied / fac.total) * 100) : 0;
                  return (
                    <div key={fac.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className="font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[200px]"
                          title={fac.name}
                        >
                          {fac.name}
                        </span>
                        <span className="font-extrabold text-neutral-900 dark:text-white shrink-0">
                          {formatCurrency(fac.revenueRwf)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                          className="h-full rounded-full bg-neutral-600 dark:bg-neutral-400 transition-all"
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-neutral-400">
                        <span>
                          {fac.occupied} / {fac.total} bays occupied
                        </span>
                        <span className="font-medium text-neutral-600 dark:text-neutral-300">
                          {pct}% Capacity
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-xs text-neutral-400">
                  No parking locations recorded in database yet.
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Fleet Type Breakdown */}
          <div className="lg:col-span-5 bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="font-bold text-base text-neutral-900 dark:text-white truncate max-w-[200px]">
                  Parking Bay Fleet Mix
                </h3>
                <span className="text-xs font-semibold text-neutral-400 shrink-0">
                  {analytics.fleet.total} Total Stalls
                </span>
              </div>

              <div className="space-y-3 pt-4 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#181d26] border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-neutral-700 dark:bg-neutral-300 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-white">Regular Bays</h4>
                      <p className="text-[10px] text-neutral-400">Standard Internal Combustion</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-sm block text-neutral-900 dark:text-white">{regPct}%</span>
                    <span className="text-[10px] text-neutral-400">{analytics.fleet.regular} bays</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#181d26] border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-white">EV Fast Stalls</h4>
                      <p className="text-[10px] text-neutral-400">Dedicated DC/AC Chargers</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-sm text-neutral-900 dark:text-white block">
                      {evPct}%
                    </span>
                    <span className="text-[10px] text-neutral-400">{analytics.fleet.ev} bays</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#181d26] border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-white">Handicap Bays</h4>
                      <p className="text-[10px] text-neutral-400">Designated Accessible Bays</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-sm text-neutral-900 dark:text-white block">
                      {hndPct}%
                    </span>
                    <span className="text-[10px] text-neutral-400">{analytics.fleet.handicap} bays</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 text-center">
              Certified Kigali City Council Mobility Telemetry Protocol
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
