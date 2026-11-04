"use client";

import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/AdminShell";
import {
  ParkingCarIcon,
  SearchIcon,
  PlusIcon,
} from "@/components/icons";
import { parkingService, Vehicle, Profile } from "@/lib/services/parkingService";
import { formatCurrency } from "@/lib/utils/format";

export default function VehiclesPage() {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "gasoline" | "ev" | "handicap">("all");
  const [selectedArrears, setSelectedArrears] = useState<"all" | "clean" | "arrears">("all");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlate, setNewPlate] = useState("");
  const [newUserId, setNewUserId] = useState("");
  const [newType, setNewType] = useState<"gasoline" | "ev" | "handicap">("gasoline");
  const [newBrand, setNewBrand] = useState("Toyota");
  const [newModel, setNewModel] = useState("RAV4");
  const [newColor, setNewColor] = useState("Silver");
  const [newBodyStyle, setNewBodyStyle] = useState("SUV");
  const [newPlugType, setNewPlugType] = useState("CCS2");
  const [newBatteryKwh, setNewBatteryKwh] = useState(60);

  // Realtime notification
  const [realtimeNotice, setRealtimeNotice] = useState<string | null>(null);

  const loadVehicles = async () => {
    try {
      const [vData, uData] = await Promise.all([
        parkingService.getVehicles(),
        parkingService.getUsers(),
      ]);
      setVehicles(vData);
      setUsers(uData);
      if (uData.length > 0 && !newUserId) {
        setNewUserId(uData[0].id);
      }
    } catch (err) {
      console.warn("Failed fetching vehicles from DB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  // Real-time Subscription to vehicles
  useEffect(() => {
    const unsub = parkingService.subscribeToTable("vehicles", () => {
      setRealtimeNotice("Vehicles Registry Synced");
      setTimeout(() => setRealtimeNotice(null), 3000);
      loadVehicles();
    });
    return () => unsub();
  }, []);

  const handleRegisterVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim()) return;
    try {
      const cleanPlate = newPlate.trim().toUpperCase();
      const masked = `${cleanPlate.slice(0, 3)} *** ${cleanPlate.slice(-1)}`;
      const isEv = newType === "ev";

      const created = await parkingService.registerVehicle({
        user_id: newUserId || users[0]?.id || "",
        plate_number: cleanPlate,
        plate_hash: cleanPlate,
        masked_plate: masked,
        vehicle_type: newType,
        brand: newBrand,
        model: newModel,
        make_model: `${newBrand} ${newModel}`.trim(),
        color: newColor,
        body_style: newBodyStyle,
        plug_type: isEv ? newPlugType : "None",
        battery_capacity_kwh: isEv ? Number(newBatteryKwh) : 0,
        battery_level_percent: 100,
        is_default: false,
        has_unpaid_arrears: false,
        total_arrears_rwf: 0,
      });

      if (created) {
        setVehicles([created, ...vehicles]);
      }
      setShowAddModal(false);
      setNewPlate("");
    } catch (err) {
      console.error("Failed registering vehicle:", err);
    }
  };

  const handleToggleArrears = async (vehicle: Vehicle) => {
    try {
      const newHasArrears = !vehicle.has_unpaid_arrears;
      const newAmount = newHasArrears ? 3000 : 0;
      await parkingService.updateVehicleArrears(vehicle.id, newHasArrears, newAmount);
      setVehicles(
        vehicles.map((v) =>
          v.id === vehicle.id ? { ...v, has_unpaid_arrears: newHasArrears, total_arrears_rwf: newAmount } : v
        )
      );
    } catch (err) {
      console.error("Failed updating vehicle arrears:", err);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm("Are you sure you want to remove this vehicle from the registry?")) return;
    try {
      await parkingService.deleteVehicle(vehicleId);
      setVehicles(vehicles.filter((v) => v.id !== vehicleId));
    } catch (err) {
      console.error("Failed deleting vehicle:", err);
    }
  };

  const filteredVehicles = vehicles.filter((v: any) => {
    const q = searchQuery.toLowerCase().trim();
    const plateMatch =
      v.plate_number.toLowerCase().includes(q) ||
      (v.masked_plate && v.masked_plate.toLowerCase().includes(q));
    const modelMatch = v.make_model ? v.make_model.toLowerCase().includes(q) : false;
    const ownerName = v.profiles?.full_name ? v.profiles.full_name.toLowerCase().includes(q) : false;
    const ownerPhone = v.profiles?.phone_number ? v.profiles.phone_number.toLowerCase().includes(q) : false;
    const matchesSearch = !q || plateMatch || modelMatch || ownerName || ownerPhone;

    const matchesType = selectedType === "all" || v.vehicle_type === selectedType;
    const matchesArrears =
      selectedArrears === "all" ||
      (selectedArrears === "arrears" && (v.has_unpaid_arrears || v.total_arrears_rwf > 0)) ||
      (selectedArrears === "clean" && !v.has_unpaid_arrears && (!v.total_arrears_rwf || v.total_arrears_rwf === 0));

    return matchesSearch && matchesType && matchesArrears;
  });

  const totalCount = vehicles.length;
  const evCount = vehicles.filter((v) => v.vehicle_type === "ev").length;
  const arrearsCount = vehicles.filter((v) => v.has_unpaid_arrears || v.total_arrears_rwf > 0).length;
  const gasolineCount = vehicles.filter((v) => v.vehicle_type === "gasoline").length;

  return (
    <AdminShell breadcrumb="Vehicles Fleet Registry" onQuickAdd={() => setShowAddModal(true)}>
      <div className="space-y-6">
        {/* Banner with Real-time indicator */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#151921] p-6 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase tracking-wide border border-neutral-200 dark:border-neutral-700">
                National Fleet Database
              </span>
              <span className="text-xs text-neutral-400">· Kigali Municipal ANPR Optical Registry</span>
              {realtimeNotice && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {realtimeNotice}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-1">
              Vehicle Fleet Registry & Compliance
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Comprehensive registry of all vehicles operating across Kigali parking bays, ANPR optical camera logs, and EV chargers.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <PlusIcon size={14} />
            <span>Register Vehicle</span>
          </button>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-neutral-500">Total Fleet Vehicles</span>
            <div className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-2">
              {totalCount}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Active municipal vehicles</p>
          </div>

          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-neutral-500">Electric Vehicles (EV)</span>
            <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
              {evCount}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Clean mobility fleet units</p>
          </div>

          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-neutral-500">Combustion (ICE)</span>
            <div className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-2">
              {gasolineCount}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Gasoline & diesel commuters</p>
          </div>

          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-neutral-500">Vehicles In Arrears</span>
            <div className="text-3xl font-extrabold text-red-600 dark:text-red-400 mt-2">
              {arrearsCount}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Flagged with unpaid citations</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#151921] p-4 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] text-xs">
          <div className="relative w-full sm:w-80">
            <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search Plate, Model, Driver Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8f9fa] dark:bg-[#181d26] border border-neutral-200 dark:border-neutral-700 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <div className="flex items-center gap-1 bg-[#f8f9fa] dark:bg-[#181d26] p-1 rounded-xl border border-neutral-200 dark:border-neutral-700">
              {(["all", "gasoline", "ev", "handicap"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1 rounded-lg font-bold uppercase text-[10px] transition-all ${
                    selectedType === t
                      ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs"
                      : "text-neutral-500 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-[#f8f9fa] dark:bg-[#181d26] p-1 rounded-xl border border-neutral-200 dark:border-neutral-700">
              {(["all", "clean", "arrears"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setSelectedArrears(a)}
                  className={`px-3 py-1 rounded-lg font-bold uppercase text-[10px] transition-all ${
                    selectedArrears === a
                      ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs"
                      : "text-neutral-500 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vehicles Table */}
        <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-300">
              <thead className="bg-[#f8f9fa] dark:bg-[#181d26] border-b border-neutral-200/80 dark:border-neutral-800 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                <tr>
                  <th className="py-3 px-4">License Plate</th>
                  <th className="py-3 px-4">Vehicle Type</th>
                  <th className="py-3 px-4">Make, Model & Style</th>
                  <th className="py-3 px-4">Owner Profile</th>
                  <th className="py-3 px-4">Arrears Balance</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-400 text-xs">
                      Loading vehicle registry from database...
                    </td>
                  </tr>
                ) : filteredVehicles.length > 0 ? (
                  filteredVehicles.map((v: any) => {
                    const hasArrears = v.has_unpaid_arrears || (v.total_arrears_rwf && v.total_arrears_rwf > 0);
                    return (
                      <tr key={v.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                        {/* Plate */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-neutral-900 dark:text-white tracking-wider bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                              {v.plate_number}
                            </span>
                            {v.masked_plate && (
                              <span className="text-[10px] text-neutral-400 font-mono">
                                ({v.masked_plate})
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Type */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                              v.vehicle_type === "ev"
                                ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                : v.vehicle_type === "handicap"
                                ? "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
                            }`}
                          >
                            {v.vehicle_type}
                          </span>
                        </td>

                        {/* Make & Model */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                            {v.make_model || (v.brand ? `${v.brand} ${v.model || ""}`.trim() : "Standard Commuter")}
                          </div>
                          <div className="text-[10px] text-neutral-400 flex items-center gap-1.5 mt-0.5 flex-wrap">
                            {v.color && <span>{v.color}</span>}
                            {v.body_style && <span>• {v.body_style}</span>}
                            {v.vehicle_type === "ev" && v.battery_capacity_kwh ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">• {v.battery_capacity_kwh} kWh ({v.plug_type || "CCS2"})</span>
                            ) : null}
                          </div>
                        </td>

                        {/* Owner Profile */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                            {v.profiles?.full_name || "Registered Driver"}
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            {v.profiles?.email || v.profiles?.phone_number || "Verified Account"}
                          </div>
                        </td>

                        {/* Arrears */}
                        <td className="py-3.5 px-4">
                          {hasArrears ? (
                            <div>
                              <span className="font-bold text-red-600 dark:text-red-400">
                                {formatCurrency(v.total_arrears_rwf || 3000)}
                              </span>
                              <span className="text-[10px] text-red-500 block">Flagged Citation</span>
                            </div>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                              ✓ Clear Standing
                            </span>
                          )}
                        </td>

                        {/* Registered Date */}
                        <td className="py-3.5 px-4 text-neutral-400 text-[11px]">
                          {v.created_at
                            ? new Date(v.created_at).toLocaleDateString("en-RW", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleArrears(v)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                                hasArrears
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                  : "border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                              }`}
                            >
                              {hasArrears ? "Clear Arrears" : "Flag Citation"}
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(v.id)}
                              className="px-2 py-1 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-[10px] font-semibold"
                              title="Delete record"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-400 text-xs">
                      No vehicles found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ────────────────── MODAL: REGISTER VEHICLE ────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
                Register Fleet Vehicle
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterVehicle} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">License Plate Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RAD 101 B"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Owner Account</label>
                <select
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name || u.email || u.id} ({u.role})
                    </option>
                  ))}
                  {users.length === 0 && <option value="">No users registered</option>}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Vehicle Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="gasoline">Gasoline / ICE</option>
                    <option value="ev">Electric Vehicle (EV)</option>
                    <option value="handicap">Accessible / Permit</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Body Style</label>
                  <select
                    value={newBodyStyle}
                    onChange={(e) => setNewBodyStyle(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Truck">Truck / Pickup</option>
                    <option value="Van">Van / Minibus</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Brand / Make</label>
                  <input
                    type="text"
                    placeholder="e.g. Toyota, Tesla"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Model</label>
                  <input
                    type="text"
                    placeholder="e.g. RAV4, Model Y"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {newType === "ev" && (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                  <div>
                    <label className="block font-semibold mb-1 text-blue-900 dark:text-blue-300">
                      Inlet Plug Standard
                    </label>
                    <select
                      value={newPlugType}
                      onChange={(e) => setNewPlugType(e.target.value)}
                      className="w-full bg-white dark:bg-[#12161f] border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    >
                      <option value="CCS2">CCS2 DC</option>
                      <option value="Type 2">Type 2 AC</option>
                      <option value="CHAdeMO">CHAdeMO</option>
                      <option value="Tesla">Tesla / NACS</option>
                      <option value="GBT">GB/T</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-blue-900 dark:text-blue-300">
                      Battery (kWh)
                    </label>
                    <input
                      type="number"
                      value={newBatteryKwh}
                      onChange={(e) => setNewBatteryKwh(Number(e.target.value))}
                      className="w-full bg-white dark:bg-[#12161f] border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-2 text-xs focus:outline-none font-bold"
                    />
                  </div>
                </div>
              )}

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
                  Register Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
