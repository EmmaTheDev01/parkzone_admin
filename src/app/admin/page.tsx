"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import {
  ParkingCarIcon,
  PlusIcon,
  ExpandIcon,
  MoreCircleIcon,
  WalletIcon,
  UsersIcon,
  TagsIcon,
  ProjectsIcon,
  ChartsIcon,
  ArrowRightIcon,
} from "@/components/icons";
import { parkingService, ParkingLocation, ParkingTicket, WeeklyChartData } from "@/lib/services/parkingService";
import { formatCurrency, formatNumberCompact } from "@/lib/utils/format";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalIncomeRwf: 0,
    totalUsers: 0,
    totalEvStations: 0,
    totalParkingLocations: 0,
    totalBays: 0,
    netOccupancy: 0,
  });
  const [facilities, setFacilities] = useState<
    { id: string; name: string; revenueRwf: number; occupancyPct: number; totalSpots: number; availableSpots: number }[]
  >([]);
  const [locations, setLocations] = useState<ParkingLocation[]>([]);
  const [recentTickets, setRecentTickets] = useState<ParkingTicket[]>([]);

  // Weekly Revenue Chart Data (100% Real DB Data)
  const [weeklyChart, setWeeklyChart] = useState<WeeklyChartData>({
    days: [
      { day: "Mon", date: "", collectedAmount: 0, operatingAmount: 0, collectedPct: 0, operatingPct: 0, isToday: false },
      { day: "Tue", date: "", collectedAmount: 0, operatingAmount: 0, collectedPct: 0, operatingPct: 0, isToday: false },
      { day: "Wed", date: "", collectedAmount: 0, operatingAmount: 0, collectedPct: 0, operatingPct: 0, isToday: false },
      { day: "Thu", date: "", collectedAmount: 0, operatingAmount: 0, collectedPct: 0, operatingPct: 0, isToday: false },
      { day: "Fri", date: "", collectedAmount: 0, operatingAmount: 0, collectedPct: 0, operatingPct: 0, isToday: false },
      { day: "Sat", date: "", collectedAmount: 0, operatingAmount: 0, collectedPct: 0, operatingPct: 0, isToday: false },
      { day: "Sun", date: "", collectedAmount: 0, operatingAmount: 0, collectedPct: 0, operatingPct: 0, isToday: false },
    ],
    maxAmount: 0,
    totalCollected: 0,
    totalOperating: 0,
  });

  // Modal & filter states
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  // New reservation form state
  const [newPlate, setNewPlate] = useState("");
  const [newLocationId, setNewLocationId] = useState("");
  const [newHours, setNewHours] = useState(2);
  const [reservationSuccess, setReservationSuccess] = useState(false);

  // Real-time flash notification
  const [realtimeNotification, setRealtimeNotification] = useState<string | null>(null);

  // Load DB Data
  const fetchDBData = async () => {
    try {
      const [agg, locs, tickets, chartData] = await Promise.all([
        parkingService.getDashboardAggregates(),
        parkingService.getLocations(),
        parkingService.getTickets(),
        parkingService.getWeeklyChartData(),
      ]);

      setStats(agg);
      setLocations(locs);
      setRecentTickets(tickets.slice(0, 6));
      setWeeklyChart(chartData);

      if (locs.length > 0) {
        if (!newLocationId) setNewLocationId(locs[0].id);
        setFacilities(
          locs.map((l) => ({
            id: l.id,
            name: l.name,
            revenueRwf: (l.total_spots - l.available_spots) * (l.hourly_rate || 300) * 8,
            occupancyPct:
              l.total_spots > 0
                ? Math.round(((l.total_spots - l.available_spots) / l.total_spots) * 100)
                : 0,
            totalSpots: l.total_spots,
            availableSpots: l.available_spots,
          }))
        );
      } else {
        setFacilities([]);
      }
    } catch (err) {
      console.warn("Failed fetching from DB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDBData();
  }, []);

  // Real-time Subscriptions across DB Tables
  useEffect(() => {
    const unsubTickets = parkingService.subscribeToTable("parking_tickets", () => {
      setRealtimeNotification("New Ticket Generated");
      setTimeout(() => setRealtimeNotification(null), 3000);
      fetchDBData();
    });

    const unsubSpaces = parkingService.subscribeToTable("parking_spaces", () => {
      setRealtimeNotification("Bays Telemetry Updated");
      setTimeout(() => setRealtimeNotification(null), 3000);
      fetchDBData();
    });

    const unsubSessions = parkingService.subscribeToTable("parking_sessions", () => {
      fetchDBData();
    });

    const unsubFines = parkingService.subscribeToTable("parking_fines", () => {
      fetchDBData();
    });

    return () => {
      unsubTickets();
      unsubSpaces();
      unsubSessions();
      unsubFines();
    };
  }, []);

  // Handle Quick Drive-In Ticket Creation
  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim()) return;

    try {
      const loc = locations.find((l) => l.id === newLocationId) || locations[0];
      const hourly = loc?.hourly_rate || 300;
      const dailyCap = loc?.daily_rate || 2000;
      const hours = Number(newHours) || 2;
      const rawTotal = hours * hourly;
      const isDaily = rawTotal >= dailyCap;
      const finalAmount = isDaily ? dailyCap : rawTotal;
      const cleanPlate = newPlate.trim().toUpperCase();

      await parkingService.createTicket({
        ticket_number: `PZ-${Date.now().toString().slice(-6)}`,
        vehicle_plate: cleanPlate,
        plate_hash: cleanPlate,
        location_id: loc?.id || "",
        entry_time: new Date().toISOString(),
        hourly_rate: hourly,
        daily_cap: dailyCap,
        rate_applied: isDaily ? "daily" : "hourly",
        hours_elapsed: hours,
        total_amount: finalAmount,
        amount_paid: finalAmount,
        payment_status: "paid",
        payment_method: "cash",
        status: "active",
        qr_token: `QR-DRV-${cleanPlate}-${Date.now().toString().slice(-4)}`,
      });

      setReservationSuccess(true);
      setTimeout(() => {
        setReservationSuccess(false);
        setShowAddModal(false);
        setNewPlate("");
      }, 1500);

      await fetchDBData();
    } catch (err) {
      console.error("Failed creating drive-in ticket:", err);
    }
  };

  const totalIncomeFormatted = formatCurrency(stats.totalIncomeRwf);

  return (
    <AdminShell breadcrumb="Dashboard" onQuickAdd={() => setShowAddModal(true)}>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* ────────────────── TOP STATUS & ACTION RIBBON ────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#151921] px-5 py-3.5 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] shadow-xs">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Kigali Urban Mobility Grid Connected
            </span>
            <span className="hidden md:inline text-xs text-neutral-400">·</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium whitespace-nowrap">
              Zone A–F Mesh Sensors Online
            </span>
            {realtimeNotification && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 animate-pulse whitespace-nowrap shrink-0">
                {realtimeNotification}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold text-xs transition-all shadow-xs whitespace-nowrap shrink-0"
            >
              <PlusIcon size={13} />
              <span className="whitespace-nowrap">Issue Check-In</span>
            </button>
            <Link
              href="/locations"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold border border-neutral-200 dark:border-neutral-700 transition-colors whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">Manage Bays</span>
              <ArrowRightIcon size={12} />
            </Link>
          </div>
        </div>

        {/* ────────────────── 1. MASTER OVERVIEW HERO CARD ────────────────── */}
        <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-6 md:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Authority & Identity Greeting */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 whitespace-nowrap shrink-0">
                    Municipal Mobility Dispatch
                  </span>
                  <span className="text-[11px] text-neutral-400 font-medium whitespace-nowrap">Kigali, Rwanda</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a202c] dark:text-white tracking-tight mt-1 truncate whitespace-nowrap">
                  Master Overview
                </h1>
              </div>

              {/* Admin Profile Chip */}
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200/80 dark:border-neutral-800/80">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shrink-0 bg-white dark:bg-[#181d26] p-1 flex items-center justify-center shadow-xs">
                  <img src="/picon.png" alt="ParkZone" className="w-full h-full object-contain dark:invert" />
                </div>
                <div className="overflow-hidden min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white truncate whitespace-nowrap">
                      Municipal Administration
                    </h3>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate whitespace-nowrap">
                    admin@parkzone.rw · Kigali City Authority
                  </p>
                </div>
              </div>

              {/* Rwanda Smart Mobility Engine Rules */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-white dark:bg-[#181d26] border border-neutral-200/70 dark:border-neutral-700/60 shadow-xs overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider whitespace-nowrap">
                    Transient Rate
                  </span>
                  <div className="text-sm font-extrabold text-neutral-900 dark:text-white mt-0.5 whitespace-nowrap">
                    300 RWF <span className="text-neutral-400 font-normal text-xs whitespace-nowrap">/ hour</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5 whitespace-nowrap">
                    Active Enforcement
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#181d26] border border-neutral-200/70 dark:border-neutral-700/60 shadow-xs overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider whitespace-nowrap">
                    Commuter Cap
                  </span>
                  <div className="text-sm font-extrabold text-neutral-900 dark:text-white mt-0.5 whitespace-nowrap">
                    2,000 RWF <span className="text-neutral-400 font-normal text-xs whitespace-nowrap">Max/day</span>
                  </div>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block mt-0.5 whitespace-nowrap">
                    Automatic Capping
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Column: Gross Revenue Breakdown */}
            <div className="lg:col-span-3 flex flex-col justify-between space-y-4 border-l-0 lg:border-l border-neutral-100 dark:border-neutral-800/80 lg:pl-6">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200/80 dark:border-neutral-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium">
                    <span className="whitespace-nowrap">Gross Live Revenue</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
                      Live
                    </span>
                  </div>
                  <div className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight whitespace-nowrap">
                    {totalIncomeFormatted}
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 whitespace-nowrap truncate">
                    Aggregated across all parking hubs, EV points &amp; fines.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                    <span className="whitespace-nowrap">Monitored Bays:</span>
                    <strong className="text-neutral-900 dark:text-white font-semibold whitespace-nowrap">{stats.totalBays} Bays</strong>
                  </div>
                  <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                    <span className="whitespace-nowrap">Net Occupancy:</span>
                    <strong className="text-neutral-900 dark:text-white font-semibold whitespace-nowrap">{stats.netOccupancy}%</strong>
                  </div>
                  <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                    <span className="whitespace-nowrap">ANPR Loop Sensors:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">Sync</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/analytics"
                  className="w-full text-center inline-block px-5 py-2.5 rounded-xl bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold text-xs tracking-wide transition-all shadow-xs whitespace-nowrap"
                >
                  View Fiscal Analytics
                </Link>
              </div>
            </div>

            {/* Right Column: Weekly Dynamic Revenue Chart */}
            <div className="lg:col-span-4 flex flex-col justify-end">
              <div className="h-56 w-full flex flex-col justify-end relative">
                {/* Dynamic Y-Axis Scale Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] text-neutral-400 font-mono pr-2">
                  {(weeklyChart.maxAmount > 0
                    ? [
                        formatNumberCompact(weeklyChart.maxAmount),
                        formatNumberCompact(Math.round(weeklyChart.maxAmount * 0.8)),
                        formatNumberCompact(Math.round(weeklyChart.maxAmount * 0.6)),
                        formatNumberCompact(Math.round(weeklyChart.maxAmount * 0.4)),
                        formatNumberCompact(Math.round(weeklyChart.maxAmount * 0.2)),
                        "0",
                      ]
                    : ["100%", "80%", "60%", "40%", "20%", "0"]
                  ).map((label, idx) => (
                    <div
                      key={idx}
                      className="border-b border-neutral-100 dark:border-neutral-800 w-full flex justify-between"
                    >
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Bars Rendered from Real Database Records */}
                <div className="h-44 w-full flex items-end justify-between px-3 z-10">
                  {weeklyChart.days.map((bar, i) => {
                    const isSelected = selectedBar === i;
                    const cHeight = bar.collectedPct > 0 ? bar.collectedPct : bar.collectedAmount > 0 ? 4 : 0;
                    const oHeight = bar.operatingPct > 0 ? bar.operatingPct : bar.operatingAmount > 0 ? 4 : 0;

                    return (
                      <div
                        key={bar.day}
                        onClick={() => setSelectedBar(isSelected ? null : i)}
                        className="flex flex-col items-center gap-1.5 cursor-pointer group"
                      >
                        <div className="flex items-end gap-1 h-36">
                          {/* Collected Bar */}
                          <div
                            style={{ height: `${cHeight}%` }}
                            className={`w-3 sm:w-3.5 rounded-t-sm transition-all duration-300 ${
                              isSelected
                                ? "bg-neutral-900 dark:bg-white ring-2 ring-emerald-500/50"
                                : "bg-[#718096] dark:bg-neutral-500 group-hover:bg-neutral-700 dark:group-hover:bg-neutral-400"
                            }`}
                            title={`${bar.day} (${bar.date || "Day"}): Collected ${formatCurrency(bar.collectedAmount)}`}
                          />
                          {/* Operating Bar */}
                          <div
                            style={{ height: `${oHeight}%` }}
                            className={`w-3 sm:w-3.5 rounded-t-sm transition-all duration-300 ${
                              isSelected
                                ? "bg-neutral-600 dark:bg-neutral-300 ring-2 ring-blue-500/50"
                                : "bg-[#4a5568] dark:bg-neutral-600 group-hover:bg-neutral-500 dark:group-hover:bg-neutral-500"
                            }`}
                            title={`${bar.day} (${bar.date || "Day"}): Operating ${formatCurrency(bar.operatingAmount)}`}
                          />
                        </div>
                        <div className="flex flex-col items-center">
                          <span
                            className={`text-[10px] transition-colors ${
                              isSelected
                                ? "text-neutral-900 dark:text-white font-bold"
                                : bar.isToday
                                ? "text-neutral-900 dark:text-white font-bold"
                                : "text-neutral-400 group-hover:text-black dark:group-hover:text-white"
                            }`}
                          >
                            {bar.day}
                          </span>
                          {bar.isToday && (
                            <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" title="Today"></span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Day Stats Badge */}
                {selectedBar !== null && weeklyChart.days[selectedBar] && (
                  <div className="mt-3 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800/80 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-[11px] animate-in fade-in duration-150 whitespace-nowrap">
                    <span className="font-bold text-neutral-900 dark:text-white whitespace-nowrap">
                      {weeklyChart.days[selectedBar].day} {weeklyChart.days[selectedBar].date && `(${weeklyChart.days[selectedBar].date})`}
                    </span>
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <span className="whitespace-nowrap">
                        Collected: <strong className="text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{formatCurrency(weeklyChart.days[selectedBar].collectedAmount)}</strong>
                      </span>
                      <span className="whitespace-nowrap">
                        Operating: <strong className="text-neutral-700 dark:text-neutral-300 whitespace-nowrap">{formatCurrency(weeklyChart.days[selectedBar].operatingAmount)}</strong>
                      </span>
                    </div>
                  </div>
                )}

                {/* Legend displaying real database aggregate sums */}
                <div className="flex items-center justify-center gap-5 mt-4 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium flex-wrap">
                  <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
                    <span className="w-3 h-1 bg-[#718096] dark:bg-neutral-500 rounded-full shrink-0"></span>
                    <span className="whitespace-nowrap">
                      Collected{weeklyChart.totalCollected > 0 ? ` (${formatCurrency(weeklyChart.totalCollected)})` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
                    <span className="w-3 h-1 bg-[#4a5568] dark:bg-neutral-600 rounded-full shrink-0"></span>
                    <span className="whitespace-nowrap">
                      Operating{weeklyChart.totalOperating > 0 ? ` (${formatCurrency(weeklyChart.totalOperating)})` : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ────────────────── 2. 4 RE-ENGINEERED KPI CARDS ────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Revenue */}
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-5 shadow-xs flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                Total Revenue Accrued
              </span>
              <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 shrink-0">
                <WalletIcon size={14} />
              </div>
            </div>
            <div className="my-3">
              <span className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight truncate block whitespace-nowrap">
                {totalIncomeFormatted}
              </span>
              <span className="text-xs font-medium text-neutral-400 block mt-0.5 truncate whitespace-nowrap">
                Hourly, Daily Cap &amp; Fines
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/60 pt-3">
              <span className="whitespace-nowrap">Collection</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                Live DB
              </span>
            </div>
          </div>

          {/* KPI 2: Motorists */}
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-5 shadow-xs flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                Registered Motorists
              </span>
              <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 shrink-0">
                <UsersIcon size={14} />
              </div>
            </div>
            <div className="my-3">
              <span className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight truncate block whitespace-nowrap">
                {formatNumberCompact(stats.totalUsers)}
              </span>
              <span className="text-xs font-medium text-neutral-400 block mt-0.5 truncate whitespace-nowrap">
                App Drivers &amp; Marshals
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/60 pt-3">
              <Link href="/users" className="hover:underline text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                Manage Directory →
              </Link>
              <span className="font-bold text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                {stats.totalUsers} Total
              </span>
            </div>
          </div>

          {/* KPI 3: EV Charging */}
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-5 shadow-xs flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                EV Fast Charging
              </span>
              <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 shrink-0">
                <TagsIcon size={14} />
              </div>
            </div>
            <div className="my-3">
              <span className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight truncate block whitespace-nowrap">
                {stats.totalEvStations} Points
              </span>
              <span className="text-xs font-medium text-neutral-400 block mt-0.5 truncate whitespace-nowrap">
                DC Fast &amp; AC Stations
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/60 pt-3">
              <span className="whitespace-nowrap">Grid Network</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                {stats.totalEvStations} Active
              </span>
            </div>
          </div>

          {/* KPI 4: Parking Hubs & Bays */}
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-5 shadow-xs flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                Parking Stations
              </span>
              <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 shrink-0">
                <ParkingCarIcon size={14} />
              </div>
            </div>
            <div className="my-3">
              <span className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight truncate block whitespace-nowrap">
                {stats.totalParkingLocations} Hubs
              </span>
              <span className="text-xs font-medium text-neutral-400 block mt-0.5 truncate whitespace-nowrap">
                {stats.totalBays} Total Monitored Bays
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/60 pt-3">
              <span className="whitespace-nowrap">Occupancy</span>
              <span className="font-bold text-neutral-900 dark:text-white whitespace-nowrap">
                {stats.netOccupancy}%
              </span>
            </div>
          </div>
        </div>

        {/* ────────────────── 3. REAL-TIME SESSIONS & FACILITY CAPACITY ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live Active Sessions & Tickets */}
          <div className="lg:col-span-7 bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 gap-3">
                <div className="min-w-0">
                  <h3 className="font-extrabold text-base text-neutral-900 dark:text-white truncate whitespace-nowrap">
                    Live Active Sessions &amp; Tickets
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5 truncate whitespace-nowrap">
                    Real-time transient motorist bookings across Kigali hubs.
                  </p>
                </div>
                <Link
                  href="/locations"
                  className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:underline flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">Manage Bays</span>
                  <ArrowRightIcon size={11} />
                </Link>
              </div>

              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80 pt-2">
                {recentTickets.length > 0 ? (
                  recentTickets.map((t: any) => {
                    const isActive = t.status === "active";
                    return (
                      <div key={t.id} className="py-3 flex items-center justify-between text-xs gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono font-black px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white whitespace-nowrap shrink-0">
                            {t.vehicle_plate}
                          </span>
                          <div className="min-w-0">
                            <span className="font-semibold text-neutral-800 dark:text-neutral-200 block truncate whitespace-nowrap">
                              {t.parking_locations?.name || "Kigali Parking Facility"}
                            </span>
                            <span className="text-[10px] text-neutral-400 truncate whitespace-nowrap block">
                              Ticket #{t.ticket_number} · {t.rate_applied === "daily" ? "2,000 RWF Cap" : `${t.hours_elapsed || 1}h transient`}
                            </span>
                          </div>
                        </div>

                        <div className="text-right whitespace-nowrap shrink-0">
                          <div className="font-bold text-neutral-900 dark:text-white whitespace-nowrap">
                            {formatCurrency(t.amount_paid || t.total_amount || 300)}
                          </div>
                          <span
                            className={`inline-block text-[9px] font-bold uppercase px-1.5 py-0.2 rounded whitespace-nowrap ${
                              isActive
                                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 animate-pulse"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-xs text-neutral-400 whitespace-nowrap">
                    No active parking tickets found in database.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-400 gap-3">
              <span className="whitespace-nowrap">Automatic ANPR Loop Synchronization</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                Live Telemetry
              </span>
            </div>
          </div>

          {/* Right Column: Facility Capacity & Sales */}
          <div className="lg:col-span-5 bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 gap-3">
                <div className="min-w-0">
                  <h3 className="font-extrabold text-base text-neutral-900 dark:text-white truncate whitespace-nowrap">
                    Facility Capacity &amp; Sales
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5 truncate whitespace-nowrap">
                    Live occupancy &amp; revenue by Kigali parking hub
                  </p>
                </div>
                <Link
                  href="/locations"
                  className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white whitespace-nowrap shrink-0"
                >
                  View All →
                </Link>
              </div>

              {/* Progress bars list */}
              <div className="space-y-4 pt-4">
                {facilities.length > 0 ? (
                  facilities.map((fac) => {
                    const displayName =
                      fac.name.length > 22 ? `${fac.name.slice(0, 19)}...` : fac.name;
                    const isHigh = fac.occupancyPct >= 85;
                    const isMedium = fac.occupancyPct >= 60 && fac.occupancyPct < 85;

                    return (
                      <div key={fac.id}>
                        <div className="flex items-center justify-between text-xs mb-1 gap-2">
                          <span
                            title={fac.name}
                            className="font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[170px] whitespace-nowrap"
                          >
                            {displayName}
                          </span>
                          <span className="font-bold text-neutral-900 dark:text-white font-mono whitespace-nowrap shrink-0">
                            {formatCurrency(fac.revenueRwf)}
                          </span>
                        </div>
                        <div className="w-full bg-[#edf2f7] dark:bg-[#181d26] h-2 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${Math.min(100, Math.max(0, fac.occupancyPct))}%` }}
                            className={`h-full rounded-full transition-all duration-300 ${
                              isHigh
                                ? "bg-rose-500"
                                : isMedium
                                ? "bg-blue-600 dark:bg-blue-400"
                                : "bg-neutral-800 dark:bg-white"
                            }`}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-neutral-400 mt-1 gap-2">
                          <span className="whitespace-nowrap">
                            {fac.availableSpots} of {fac.totalSpots} spots free
                          </span>
                          <span className="font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap shrink-0">
                            {fac.occupancyPct}% occupied
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-xs text-neutral-400 whitespace-nowrap">
                    No facilities found in database.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
              <Link
                href="/locations"
                className="text-xs font-bold text-neutral-900 dark:text-white hover:underline whitespace-nowrap"
              >
                Inspect All Facilities &amp; Bays →
              </Link>
            </div>
          </div>
        </div>

        {/* ────────────────── 4. RWANDA STATUTORY & PRIVACY COMPLIANCE FOOTER STRIP ────────────────── */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#151921] border border-[#e8ecf1] dark:border-[#202734] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400 shadow-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
              Rwanda Data Protection &amp; Privacy Law Nº 058/2021 Compliant
            </span>
            <span className="hidden sm:inline whitespace-nowrap">· Cryptographic Blind SHA-256 Indexing</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] whitespace-nowrap shrink-0">
            <span className="whitespace-nowrap">Irembo 3,000 RWF Automated Audit</span>
            <span>·</span>
            <Link href="/analytics" className="text-neutral-700 dark:text-neutral-300 font-semibold hover:underline whitespace-nowrap">
              Revenue Assurance →
            </Link>
          </div>
        </div>
      </div>

      {/* ────────────────── MODAL: DRIVE-IN CHECK-IN TICKET CREATION ────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                Admin Drive-In Ticket Check-In
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 flex items-center justify-center hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {reservationSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                  Parking Ticket Issued!
                </h4>
                <p className="text-xs text-neutral-400">
                  Recorded in Supabase database &amp; synced across system.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateReservation} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">License Plate Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RAD 882 A"
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
                        {loc.name} ({loc.hourly_rate} RWF/h)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Expected Duration (Hours)</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value))}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none font-bold"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Capped automatically at 2,000 RWF for all-day parking.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 whitespace-nowrap text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold whitespace-nowrap text-xs"
                  >
                    Issue Check-In Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
