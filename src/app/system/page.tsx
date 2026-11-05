"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AdminShell } from "@/components/AdminShell";
import { SearchIcon } from "@/components/icons";
import { SystemHealthData, AuditLogItem } from "@/app/api/admin/system/route";

export default function SystemPage() {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<SystemHealthData | null>(null);
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>("ALL");
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");
  const [copiedPayload, setCopiedPayload] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/system", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setHealth(json.health);
        setLogs(json.logs || []);
        setLastRefreshed(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.warn("Failed fetching system health:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Optional auto-refresh timer (every 10 seconds)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        log.message.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q) ||
        log.subsystem.toLowerCase().includes(q);

      const matchesLevel = selectedLevel === "ALL" || log.level === selectedLevel;
      const matchesSubsystem = selectedSubsystem === "ALL" || log.subsystem === selectedSubsystem;

      return matchesSearch && matchesLevel && matchesSubsystem;
    });
  }, [logs, searchQuery, selectedLevel, selectedSubsystem]);

  const exportLogsAsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `parkzone_system_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyPayload = () => {
    if (!selectedLog) return;
    navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <AdminShell breadcrumb="System Health & Infrastructure Logs">
      <div className="space-y-6">
        {/* Top Banner with Real-time Telemetry Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#151921] p-6 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] shadow-xs">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase tracking-wide border border-neutral-200 dark:border-neutral-700">
                Infrastructure & Audit Governance
              </span>
              <span className="text-xs text-neutral-400">
                · Next.js 16.4.5 Security Upgrade Active · Node {health?.server.nodeVersion || "v22"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {health?.status === "healthy" ? "All Systems Operational" : health?.status === "degraded" ? "Telemetry Latency Moderate" : "Telemetry Active"}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-1">
              System Health & Infrastructure Telemetry Logs
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Real-time PostgreSQL connection telemetry, Supabase storage buckets, ANPR sensor logs, and administrative audit trails.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                autoRefresh
                  ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300"
                  : "bg-white dark:bg-[#1a202c] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
              }`}
            >
              Auto-Refresh (10s) {autoRefresh ? "ON" : "OFF"}
            </button>
            <button
              onClick={exportLogsAsJson}
              className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#1a202c] text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-2xs whitespace-nowrap"
            >
              Export JSON
            </button>
            <button
              onClick={fetchData}
              className="px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold transition-all shadow-xs whitespace-nowrap"
            >
              Refresh Telemetry
            </button>
          </div>
        </div>

        {/* 4 KPI Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Database Health */}
          <div className="bg-white dark:bg-[#151921] p-5 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">PostgreSQL Database</span>
              <span className={`w-2 h-2 rounded-full ${health?.database.connected ? "bg-emerald-500" : "bg-red-500"}`} />
            </div>
            <div className="my-2">
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">
                {health?.database.connected ? "Connected" : "Disconnected"}
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Latency: <strong className="text-neutral-800 dark:text-neutral-200">{health?.latencyMs ?? 0} ms</strong>
              </p>
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/80 pt-2 flex justify-between">
              <span>Bays: {health?.database.tables.parking_spaces ?? 0}</span>
              <span>Profiles: {health?.database.tables.profiles ?? 0}</span>
              <span>Hubs: {health?.database.tables.parking_locations ?? 0}</span>
            </div>
          </div>

          {/* 2. Storage Buckets */}
          <div className="bg-white dark:bg-[#151921] p-5 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">Supabase Storage</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">
                {health?.storage.buckets.length ?? 0} Active Buckets
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">Public media & image hosting</p>
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/80 pt-2 truncate" title={health?.storage.buckets.map((b) => b.name).join(", ")}>
              {health?.storage.buckets.map((b) => b.name).slice(0, 3).join(", ") || "parking-images"}
            </div>
          </div>

          {/* 3. Next.js Runtime */}
          <div className="bg-white dark:bg-[#151921] p-5 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">Next.js Framework</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                16.4.5
              </span>
            </div>
            <div className="my-2">
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">
                Turbopack Ready
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Security patch upgrade applied
              </p>
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/80 pt-2 flex justify-between">
              <span>Platform: {health?.server.platform || "mac"}</span>
              <span>Uptime: {Math.floor((health?.server.uptimeSeconds || 0) / 60)}m</span>
            </div>
          </div>

          {/* 4. Memory Telemetry */}
          <div className="bg-white dark:bg-[#151921] p-5 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">Memory Allocation</span>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">
                {health?.server.memory.heapUsedMb ?? 0} MB
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Heap allocated: {health?.server.memory.heapTotalMb ?? 0} MB
              </p>
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/80 pt-2 flex justify-between">
              <span>Resident Set: {health?.server.memory.rssMb ?? 0} MB</span>
              <span>Env: {health?.server.environment || "dev"}</span>
            </div>
          </div>
        </div>

        {/* Audit Logs Directory Table Container */}
        <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] overflow-hidden shadow-xs">
          {/* Header & Filter Controls Bar */}
          <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
                Platform Audit & Operational Log Trail
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Showing {filteredLogs.length} of {logs.length} system events. Last updated {lastRefreshed || "just now"}.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Level Filter Tabs */}
              <div className="inline-flex p-1 rounded-xl bg-neutral-100 dark:bg-[#101319] border border-neutral-200 dark:border-neutral-800">
                {(["ALL", "INFO", "SUCCESS", "WARN", "ERROR"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedLevel === lvl
                        ? "bg-white dark:bg-[#1e2430] text-neutral-900 dark:text-white shadow-2xs"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {/* Subsystem Filter Dropdown */}
              <select
                value={selectedSubsystem}
                onChange={(e) => setSelectedSubsystem(e.target.value)}
                className="bg-neutral-50 dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 focus:outline-none"
              >
                <option value="ALL">All Subsystems</option>
                <option value="AUTH">Auth & Users</option>
                <option value="ANPR_GATE">ANPR Camera Gates</option>
                <option value="OCCUPANCY_SENSOR">Ultrasonic Bay Loops</option>
                <option value="BILLING_MOMO">Billing & Citations</option>
                <option value="EV_HARDWARE">EV OCPP Telemetry</option>
                <option value="SECURITY">Security & Engine</option>
                <option value="DATABASE">Database</option>
              </select>

              {/* Search Query Input */}
              <div className="relative w-full sm:w-56">
                <SearchIcon size={14} className="absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search logs, plates, actors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#f8f9fa] dark:bg-[#181d26] border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none placeholder-neutral-400"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-300">
              <thead className="bg-[#f8f9fa] dark:bg-[#181d26] border-b border-neutral-200/80 dark:border-neutral-800 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Subsystem</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Description / Event Message</th>
                  <th className="py-3 px-4">Origin / Actor</th>
                  <th className="py-3 px-4 text-right">Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {loading && logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-xs text-neutral-400">
                      Loading real-time audit logs from database...
                    </td>
                  </tr>
                ) : filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => {
                    const isError = log.level === "ERROR";
                    const isWarn = log.level === "WARN";
                    const isSuccess = log.level === "SUCCESS";

                    const badgeClass = isError
                      ? "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900"
                      : isWarn
                      ? "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900"
                      : isSuccess
                      ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700";

                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                      >
                        {/* Level */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${badgeClass}`}>
                            {log.level}
                          </span>
                        </td>

                        {/* Timestamp */}
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                          {new Date(log.timestamp).toLocaleString("en-RW", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>

                        {/* Subsystem */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                            {log.subsystem}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-xs font-bold text-neutral-900 dark:text-white">
                          {log.action}
                        </td>

                        {/* Description */}
                        <td className="py-3 px-4 text-xs font-medium text-neutral-700 dark:text-neutral-300 max-w-md truncate" title={log.message}>
                          {log.message}
                        </td>

                        {/* Origin / Actor */}
                        <td className="py-3 px-4 whitespace-nowrap text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                          {log.actor}
                        </td>

                        {/* Payload Inspect Action */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedLog(log)}
                            className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#1a202c] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-semibold transition-colors shadow-2xs"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-xs text-neutral-400">
                      No system logs found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ────────────────── MODAL: LOG PAYLOAD INSPECTOR ────────────────── */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {selectedLog.subsystem}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    {selectedLog.level}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-white mt-1">
                  {selectedLog.action}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white"
                aria-label="Close"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-0.5">Event Summary</span>
                <p className="text-neutral-800 dark:text-neutral-200 font-medium bg-neutral-50 dark:bg-[#12161f] p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  {selectedLog.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-neutral-600 dark:text-neutral-400">
                <div className="bg-neutral-50 dark:bg-[#12161f] p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Origin Actor</span>
                  <span className="font-mono text-xs text-neutral-800 dark:text-neutral-200 font-bold">{selectedLog.actor}</span>
                </div>
                <div className="bg-neutral-50 dark:bg-[#12161f] p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">ISO Timestamp</span>
                  <span className="font-mono text-xs text-neutral-800 dark:text-neutral-200 font-bold">{selectedLog.timestamp}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase text-neutral-400">JSON Payload & Metadata</span>
                  <button
                    type="button"
                    onClick={handleCopyPayload}
                    className="text-[10px] font-semibold text-neutral-500 hover:text-black dark:hover:text-white"
                  >
                    {copiedPayload ? "Copied!" : "Copy Payload"}
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-neutral-900 text-neutral-100 font-mono text-[11px] overflow-x-auto max-h-56 leading-relaxed">
                  {JSON.stringify(selectedLog.metadata || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

