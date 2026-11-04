"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AdminShell } from "@/components/AdminShell";
import {
  ProjectsIcon,
  PlusIcon,
  ParkingCarIcon,
  SearchIcon,
  FilterIcon,
  MoreCircleIcon,
} from "@/components/icons";
import { parkingService, ParkingLocation, ParkingSpace } from "@/lib/services/parkingService";
import { formatCurrency } from "@/lib/utils/format";

const ZONES = ["All Zones", "Zone A", "Zone B", "Zone C", "Zone D", "Zone E"] as const;

export default function LocationsPage() {
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<ParkingLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<ParkingLocation | null>(null);
  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);

  // Filtering & Search
  const [selectedZone, setSelectedZone] = useState<string>("All Zones");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"all" | "available" | "occupied">("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<"all" | "regular" | "ev" | "handicap">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Drawers
  const [showCreateLocationModal, setShowCreateLocationModal] = useState(false);
  const [showEditLocationModal, setShowEditLocationModal] = useState(false);
  const [showSpaceGeneratorModal, setShowSpaceGeneratorModal] = useState(false);
  const [showBayControlModal, setShowBayControlModal] = useState(false);
  const [selectedBay, setSelectedBay] = useState<ParkingSpace | null>(null);

  // New Location Form State
  const [newLocName, setNewLocName] = useState("");
  const [newLocAddress, setNewLocAddress] = useState("");
  const [newLocTopology, setNewLocTopology] = useState<"oblique" | "perpendicular" | "parallel" | "wide">("perpendicular");
  const [newLocHourly, setNewLocHourly] = useState(300);
  const [newLocDaily, setNewLocDaily] = useState(2000);
  const [newLocSpots, setNewLocSpots] = useState(80);
  const [newLocLat, setNewLocLat] = useState(-1.9536);
  const [newLocLng, setNewLocLng] = useState(30.0606);
  const [newLocIsEv, setNewLocIsEv] = useState(false);
  const [newLocIsHandicap, setNewLocIsHandicap] = useState(false);

  // Edit Location Form State
  const [editLocName, setEditLocName] = useState("");
  const [editLocAddress, setEditLocAddress] = useState("");
  const [editLocTopology, setEditLocTopology] = useState<"oblique" | "perpendicular" | "parallel" | "wide">("perpendicular");
  const [editLocHourly, setEditLocHourly] = useState(300);
  const [editLocDaily, setEditLocDaily] = useState(2000);
  const [editLocStatus, setEditLocStatus] = useState<"active" | "inactive" | "maintenance">("active");

  // Bulk space generator form state
  const [genPrefix, setGenPrefix] = useState("A-");
  const [genCount, setGenCount] = useState(12);
  const [genZone, setGenZone] = useState("Zone A");
  const [genType, setGenType] = useState<"regular" | "ev" | "handicap">("regular");

  // Single Bay Edit State
  const [bayPlateInput, setBayPlateInput] = useState("");
  const [bayTypeInput, setBayTypeInput] = useState<"regular" | "ev" | "handicap">("regular");
  const [bayZoneInput, setBayZoneInput] = useState("Zone A");
  const [bayPriceInput, setBayPriceInput] = useState<number | string>("");

  // Real-time indicator animation
  const [lastRealtimeEvent, setLastRealtimeEvent] = useState<string | null>(null);

  // 1. Initial Data Fetch
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const locs = await parkingService.getLocations();
        setLocations(locs);
        if (locs.length > 0) {
          const first = locs[0];
          setSelectedLocation(first);
          const sps = await parkingService.getSpaces(first.id);
          setSpaces(sps);
        } else {
          setSelectedLocation(null);
          setSpaces([]);
        }
      } catch (err) {
        console.warn("Failed fetching locations from DB:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 2. Real-time Subscriptions for Live Database Synchronization
  useEffect(() => {
    // Listen to changes in parking_spaces
    const unsubSpaces = parkingService.subscribeToTable("parking_spaces", async (payload) => {
      setLastRealtimeEvent(`Bay ${payload.eventType} at ${new Date().toLocaleTimeString()}`);
      setTimeout(() => setLastRealtimeEvent(null), 3000);

      // Refresh spaces if the updated space belongs to selected location
      if (selectedLocation?.id) {
        const refreshedSpaces = await parkingService.getSpaces(selectedLocation.id);
        setSpaces(refreshedSpaces);
      }

      // Also refresh locations to get live available_spots counts
      const refreshedLocs = await parkingService.getLocations();
      setLocations(refreshedLocs);
      if (selectedLocation?.id) {
        const updatedSelected = refreshedLocs.find((l) => l.id === selectedLocation.id);
        if (updatedSelected) setSelectedLocation(updatedSelected);
      }
    });

    // Listen to changes in parking_locations
    const unsubLocations = parkingService.subscribeToTable("parking_locations", async () => {
      const refreshedLocs = await parkingService.getLocations();
      setLocations(refreshedLocs);
      if (selectedLocation?.id) {
        const updatedSelected = refreshedLocs.find((l) => l.id === selectedLocation.id);
        if (updatedSelected) setSelectedLocation(updatedSelected);
      }
    });

    return () => {
      unsubSpaces();
      unsubLocations();
    };
  }, [selectedLocation?.id]);

  const handleSelectLocation = async (loc: ParkingLocation) => {
    setSelectedLocation(loc);
    try {
      const sps = await parkingService.getSpaces(loc.id);
      setSpaces(sps);
    } catch (err) {
      console.warn("Failed fetching spaces for location:", err);
    }
  };

  // Create Location Handler
  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await parkingService.createLocation({
        name: newLocName,
        address: newLocAddress,
        city: "Kigali",
        country: "Rwanda",
        latitude: Number(newLocLat),
        longitude: Number(newLocLng),
        layout_topology: newLocTopology,
        total_spots: Number(newLocSpots),
        available_spots: Number(newLocSpots),
        hourly_rate: Number(newLocHourly),
        daily_rate: Number(newLocDaily),
        currency: "RWF",
        qr_code_identifier: "QR-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        is_electric_station: newLocIsEv,
        is_handicap_facility: newLocIsHandicap,
        status: "active",
      });
      if (created) {
        setLocations([created, ...locations]);
        setSelectedLocation(created);
        setSpaces([]);
      }
      setShowCreateLocationModal(false);
      setNewLocName("");
      setNewLocAddress("");
    } catch (err) {
      console.error("Failed creating location in DB:", err);
    }
  };

  // Edit Location Handler
  const handleOpenEditLocation = () => {
    if (!selectedLocation) return;
    setEditLocName(selectedLocation.name);
    setEditLocAddress(selectedLocation.address);
    setEditLocTopology(selectedLocation.layout_topology);
    setEditLocHourly(selectedLocation.hourly_rate);
    setEditLocDaily(selectedLocation.daily_rate);
    setEditLocStatus(selectedLocation.status);
    setShowEditLocationModal(true);
  };

  const handleUpdateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;
    try {
      const updated = await parkingService.updateLocation(selectedLocation.id, {
        name: editLocName,
        address: editLocAddress,
        layout_topology: editLocTopology,
        hourly_rate: Number(editLocHourly),
        daily_rate: Number(editLocDaily),
        status: editLocStatus,
      });
      if (updated) {
        setSelectedLocation(updated);
        setLocations(locations.map((l) => (l.id === updated.id ? updated : l)));
      }
      setShowEditLocationModal(false);
    } catch (err) {
      console.error("Failed updating location:", err);
    }
  };

  // Delete Location Handler
  const handleDeleteLocation = async () => {
    if (!selectedLocation) return;
    if (!confirm(`Are you sure you want to delete ${selectedLocation.name}? This will remove all associated spaces.`)) {
      return;
    }
    try {
      await parkingService.deleteLocation(selectedLocation.id);
      const remaining = locations.filter((l) => l.id !== selectedLocation.id);
      setLocations(remaining);
      if (remaining.length > 0) {
        handleSelectLocation(remaining[0]);
      } else {
        setSelectedLocation(null);
        setSpaces([]);
      }
      setShowEditLocationModal(false);
    } catch (err) {
      console.error("Failed deleting location:", err);
    }
  };

  // Bulk Bay Generator Handler
  const handleBulkGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;
    try {
      const spacesToInsert: any[] = [];
      const currentHighest = spaces.length;
      for (let i = 1; i <= genCount; i++) {
        const num = currentHighest + i;
        spacesToInsert.push({
          location_id: selectedLocation.id,
          space_number: `${genPrefix}${num.toString().padStart(2, "0")}`,
          zone_code: genZone,
          space_type: genType,
          is_occupied: false,
          price_per_hour_rwf: genType === "ev" ? 0 : selectedLocation.hourly_rate,
          qr_code_token: `SPT-${selectedLocation.name.slice(0, 2).toUpperCase()}-${num}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        });
      }
      const createdSpaces = await parkingService.bulkCreateSpaces(spacesToInsert);
      setSpaces([...spaces, ...createdSpaces]);
      setShowSpaceGeneratorModal(false);
    } catch (err) {
      console.error("Failed creating spaces in DB:", err);
    }
  };

  // Open Bay Control Drawer / Modal
  const handleOpenBayControl = (bay: ParkingSpace) => {
    setSelectedBay(bay);
    setBayPlateInput(bay.current_vehicle_plate || "");
    setBayTypeInput(bay.space_type);
    setBayZoneInput(bay.zone_code);
    setBayPriceInput(bay.price_per_hour_rwf ?? "");
    setShowBayControlModal(true);
  };

  // One-Click Occupancy Toggle Handler
  const handleQuickToggleOccupancy = async (bay: ParkingSpace, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const newOccupied = !bay.is_occupied;
      const defaultPlate = newOccupied ? `RAD ${Math.floor(100 + Math.random() * 899)} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}` : null;
      const updated = await parkingService.toggleSpaceOccupancy(bay.id, newOccupied, defaultPlate);
      if (updated) {
        setSpaces(spaces.map((s) => (s.id === updated.id ? updated : s)));
        if (selectedBay?.id === updated.id) setSelectedBay(updated);
      }
    } catch (err) {
      console.error("Failed toggling space occupancy:", err);
    }
  };

  // Save Full Bay Edits
  const handleSaveBayChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBay) return;
    try {
      const priceVal = bayPriceInput === "" ? null : Number(bayPriceInput);
      const isOccupied = Boolean(bayPlateInput.trim());
      const updated = await parkingService.updateSpace(selectedBay.id, {
        space_type: bayTypeInput,
        zone_code: bayZoneInput,
        is_occupied: isOccupied,
        current_vehicle_plate: isOccupied ? bayPlateInput.trim().toUpperCase() : null,
        occupied_at: isOccupied ? (selectedBay.occupied_at || new Date().toISOString()) : null,
        price_per_hour_rwf: priceVal,
      });

      if (updated) {
        setSpaces(spaces.map((s) => (s.id === updated.id ? updated : s)));
        setSelectedBay(updated);
      }
      setShowBayControlModal(false);
    } catch (err) {
      console.error("Failed saving bay changes:", err);
    }
  };

  // Delete Individual Bay
  const handleDeleteBay = async () => {
    if (!selectedBay) return;
    if (!confirm(`Are you sure you want to delete bay ${selectedBay.space_number}?`)) return;
    try {
      await parkingService.deleteSpace(selectedBay.id);
      setSpaces(spaces.filter((s) => s.id !== selectedBay.id));
      setShowBayControlModal(false);
    } catch (err) {
      console.error("Failed deleting bay:", err);
    }
  };

  // Dynamic zones derived from actual space records in DB
  const availableZones = useMemo(() => {
    const rawZones = Array.from(new Set(spaces.map((s) => s.zone_code).filter(Boolean)));
    if (rawZones.length === 0) return ["All Zones"];
    return ["All Zones", ...rawZones];
  }, [spaces]);

  // Filtered spaces by search, zone, status, and type
  const filteredSpaces = useMemo(() => {
    return spaces.filter((s) => {
      const matchesZone = selectedZone === "All Zones" || s.zone_code === selectedZone;
      const matchesStatus =
        selectedStatusFilter === "all" ||
        (selectedStatusFilter === "occupied" && s.is_occupied) ||
        (selectedStatusFilter === "available" && !s.is_occupied);
      const matchesType = selectedTypeFilter === "all" || s.space_type === selectedTypeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.space_number.toLowerCase().includes(q) ||
        (s.current_vehicle_plate && s.current_vehicle_plate.toLowerCase().includes(q));

      return matchesZone && matchesStatus && matchesType && matchesSearch;
    });
  }, [spaces, selectedZone, selectedStatusFilter, selectedTypeFilter, searchQuery]);

  const totalBays = spaces.length;
  const occupiedBays = spaces.filter((s) => s.is_occupied).length;
  const availableBays = totalBays - occupiedBays;
  const occupancyRate = totalBays > 0 ? Math.round((occupiedBays / totalBays) * 100) : 0;
  const evBaysCount = spaces.filter((s) => s.space_type === "ev").length;
  const handicapBaysCount = spaces.filter((s) => s.space_type === "handicap").length;

  return (
    <AdminShell
      breadcrumb="Parking Stations & Bays"
      onQuickAdd={() => setShowCreateLocationModal(true)}
    >
      <div className="space-y-6">
        {/* Top Header Banner with Live Realtime Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#151921] p-6 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase tracking-wide border border-neutral-200 dark:border-neutral-700">
                Kigali Municipal Mobility
              </span>
              <span className="text-xs text-neutral-400">
                · {formatCurrency(300)}/hr · {formatCurrency(2000)} Daily Cap
              </span>
              {lastRealtimeEvent && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {lastRealtimeEvent}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-1">
              Parking Stations & Interactive Bay Control
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Live ANPR camera sensors & ultrasonic loop telemetry. Admin has full interactive override control over bay allocations.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {selectedLocation && (
              <button
                onClick={handleOpenEditLocation}
                className="px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#1a202c] text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-xs whitespace-nowrap shrink-0"
              >
                Facility Settings
              </button>
            )}
            <button
              onClick={() => setShowSpaceGeneratorModal(true)}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#1a202c] text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-xs whitespace-nowrap shrink-0"
            >
              Bulk Bay Generator
            </button>
            <button
              onClick={() => setShowCreateLocationModal(true)}
              className="px-4 py-2 rounded-xl bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <PlusIcon size={14} />
              <span className="whitespace-nowrap">Add Facility</span>
            </button>
          </div>
        </div>

        {/* 2-Column: Left Locations Selector, Right Full Interactive Bays Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Location Cards Column */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Active Facilities ({locations.length})
              </h3>
              <span className="text-[11px] text-neutral-400">Select to load live bays</span>
            </div>

            <div className="space-y-3">
              {locations.length > 0 ? (
                locations.map((loc) => {
                  const isSelected = selectedLocation?.id === loc.id;
                  const occPercent =
                    loc.total_spots > 0
                      ? Math.round(((loc.total_spots - loc.available_spots) / loc.total_spots) * 100)
                      : 0;

                  return (
                    <div
                      key={loc.id}
                      onClick={() => handleSelectLocation(loc)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-white dark:bg-[#181d26] border-neutral-900 dark:border-neutral-300 shadow-md ring-1 ring-neutral-900/10 dark:ring-white/10"
                          : "bg-white dark:bg-[#151921] border-[#e8ecf1] dark:border-[#202734] hover:border-neutral-400"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              className="font-bold text-sm text-neutral-900 dark:text-white truncate max-w-[190px]"
                              title={loc.name}
                            >
                              {loc.name}
                            </h4>
                            {loc.is_electric_station && (
                              <span className="w-2 h-2 rounded-full bg-blue-500" title="EV Charging Hub" />
                            )}
                          </div>
                          <p
                            className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate max-w-[210px]"
                            title={loc.address}
                          >
                            {loc.address}
                          </p>
                          {(loc.opening_hours as any) && (
                            <p className="text-[10px] text-neutral-400 mt-0.5">
                              {(loc.opening_hours as any)?.["24_7"] ? "● Open 24/7" : `● ${(loc.opening_hours as any)?.open} - ${(loc.opening_hours as any)?.close}`}
                            </p>
                          )}
                        </div>

                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 uppercase tracking-wider shrink-0">
                          {loc.layout_topology}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 my-4 text-xs">
                        <div className="p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#181d26] border border-neutral-100 dark:border-neutral-800">
                          <span className="text-[10px] text-neutral-400 block font-medium">Bays</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200 mt-0.5 block">
                            {loc.total_spots}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#181d26] border border-neutral-100 dark:border-neutral-800">
                          <span className="text-[10px] text-neutral-400 block font-medium">Available</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                            {loc.available_spots}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#181d26] border border-neutral-100 dark:border-neutral-800">
                          <span className="text-[10px] text-neutral-400 block font-medium">Tariff</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200 mt-0.5 block">
                            {formatCurrency(loc.hourly_rate)}/h
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1 font-medium">
                          <span className="text-neutral-400">Live Occupancy</span>
                          <span className="text-neutral-700 dark:text-neutral-300 font-bold">
                            {occPercent}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${Math.min(100, Math.max(0, occPercent))}%` }}
                            className={`h-full rounded-full transition-all ${
                              occPercent > 80 ? "bg-red-500" : occPercent > 50 ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734]">
                  <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                    No parking facilities in database.
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Click &ldquo;Add Facility&rdquo; above to register a hub.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Spaces Grid with Full Interactive Control */}
          <div className="lg:col-span-8 bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-6 shadow-xs flex flex-col justify-between">
            <div>
              {/* Header Info Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-neutral-900 dark:text-white truncate max-w-[320px]">
                      {selectedLocation ? selectedLocation.name : "Select Facility"}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase">
                      {selectedLocation?.layout_topology || "Perpendicular"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Click any bay to open the Admin Control Drawer or toggle vehicle occupancy in real-time.
                  </p>
                </div>

                {/* KPI Micro Badges */}
                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                    {availableBays} Free
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold">
                    {occupiedBays} Occupied ({occupancyRate}%)
                  </div>
                </div>
              </div>

              {/* Filters Bar: Zone Selector, Status, Type, and Search */}
              <div className="py-4 border-b border-neutral-100 dark:border-neutral-800 space-y-3">
                {/* Zone Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {availableZones.map((zone) => (
                    <button
                      key={zone}
                      onClick={() => setSelectedZone(zone)}
                      className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 whitespace-nowrap ${
                        selectedZone === zone
                          ? "bg-[#212529] hover:bg-black text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-900 shadow-xs"
                          : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      {zone}
                    </button>
                  ))}
                </div>

                {/* Sub-filters & Search */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                    {/* Status Filter */}
                    <select
                      value={selectedStatusFilter}
                      onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                      className="bg-[#f8f9fa] dark:bg-[#181d26] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-1.5 font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="available">Available Only</option>
                      <option value="occupied">Occupied Only</option>
                    </select>

                    {/* Space Type Filter */}
                    <select
                      value={selectedTypeFilter}
                      onChange={(e) => setSelectedTypeFilter(e.target.value as any)}
                      className="bg-[#f8f9fa] dark:bg-[#181d26] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-1.5 font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none"
                    >
                      <option value="all">All Space Types</option>
                      <option value="regular">Regular Stalls</option>
                      <option value="ev">EV Fast Charging</option>
                      <option value="handicap">Accessible</option>
                    </select>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-56">
                    <SearchIcon size={14} className="absolute left-3 top-2.5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search bay # or plate..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-[#f8f9fa] dark:bg-[#181d26] border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none placeholder-neutral-400"
                    />
                  </div>
                </div>
              </div>

              {/* Spaces Grid (Interactive Top-Down Visual Bay Rendering) */}
              {loading ? (
                <div className="py-16 text-center text-xs text-neutral-400">
                  Loading real-time bay telemetry...
                </div>
              ) : filteredSpaces.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-4">
                  {filteredSpaces.map((space) => {
                    const isOccupied = space.is_occupied;
                    const isEv = space.space_type === "ev";
                    const isHandicap = space.space_type === "handicap";

                    return (
                      <div
                        key={space.id}
                        onClick={() => handleOpenBayControl(space)}
                        className={`group relative p-3.5 rounded-2xl border text-xs flex flex-col justify-between h-36 transition-all cursor-pointer shadow-xs ${
                          isOccupied
                            ? "bg-[#141820] text-white border-neutral-700 hover:border-neutral-500"
                            : isEv
                            ? "bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 hover:border-blue-400"
                            : isHandicap
                            ? "bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 hover:border-amber-400"
                            : "bg-[#f8f9fa] dark:bg-[#181d26]/80 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                        }`}
                      >
                        {/* Bay Top Row: Number & Type Badge */}
                        <div className="flex items-center justify-between">
                          <span className={`font-mono font-extrabold text-xs tracking-wider ${isOccupied ? "text-white" : "text-neutral-900 dark:text-white"}`}>
                            {space.space_number}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                              isEv
                                ? "bg-blue-600 text-white"
                                : isHandicap
                                ? "bg-amber-600 text-white"
                                : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                            }`}
                          >
                            {isEv ? "EV Hub" : isHandicap ? "Access" : space.zone_code || "Std"}
                          </span>
                        </div>

                        {/* Bay Center Status Display */}
                        <div className="my-auto text-center py-1">
                          {isOccupied ? (
                            <div>
                              <div className="flex items-center justify-center gap-1 text-[10px] text-red-400 font-semibold mb-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                <span>OCCUPIED</span>
                              </div>
                              <span className="font-mono font-black text-xs tracking-wider px-2 py-0.5 bg-neutral-900 rounded border border-neutral-700 text-neutral-100 shadow-inner">
                                {space.current_vehicle_plate || "RAD *** A"}
                              </span>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-center gap-1.5 mb-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                  AVAILABLE
                                </span>
                              </div>
                              <span className="text-[10px] text-neutral-400">
                                {isEv ? "0 RWF (Free EV)" : `${space.price_per_hour_rwf || selectedLocation?.hourly_rate || 300} RWF/h`}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Bottom Row: Quick Action Button */}
                        <div className="pt-2 border-t border-neutral-200/40 dark:border-neutral-800/60 flex items-center justify-between text-[10px]">
                          <span className="text-neutral-400 font-medium">
                            {space.zone_code}
                          </span>
                          <button
                            onClick={(e) => handleQuickToggleOccupancy(space, e)}
                            className={`px-2 py-0.5 rounded font-bold transition-colors whitespace-nowrap shrink-0 ${
                              isOccupied
                                ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                            }`}
                            title={isOccupied ? "Vacate / Free Bay" : "Simulate Parked Car"}
                          >
                            {isOccupied ? "Vacate" : "+ Park"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center text-xs text-neutral-400">
                  No bays match the active filters. Click &ldquo;Generate Bays&rdquo; to add stalls.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────── MODAL: BAY CONTROL & OVERRIDE DRAWER ────────────────── */}
      {showBayControlModal && selectedBay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
                  Bay Admin Control · {selectedBay.space_number}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Manual hardware override, occupancy assignment & optical ANPR simulation.
                </p>
              </div>
              <button
                onClick={() => setShowBayControlModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBayChanges} className="space-y-4 text-xs">
              {/* Quick Status Toggle */}
              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Occupancy State
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!bayPlateInput.trim()) setBayPlateInput("RAD 550 B");
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      bayPlateInput.trim()
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 shadow-xs"
                        : "bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500"
                    }`}
                  >
                    ● Occupied
                  </button>
                  <button
                    type="button"
                    onClick={() => setBayPlateInput("")}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      !bayPlateInput.trim()
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500"
                    }`}
                  >
                    ● Available / Free
                  </button>
                </div>
              </div>

              {/* Vehicle License Plate */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Vehicle License Plate
                  </label>
                  <button
                    type="button"
                    onClick={() => setBayPlateInput(`RAD ${Math.floor(100 + Math.random() * 899)} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`)}
                    className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Generate Random Plate
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. RAD 123 A (Leave empty to free space)"
                  value={bayPlateInput}
                  onChange={(e) => setBayPlateInput(e.target.value.toUpperCase())}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                />
              </div>

              {/* Space Type & Zone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Space Type
                  </label>
                  <select
                    value={bayTypeInput}
                    onChange={(e) => setBayTypeInput(e.target.value as any)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="regular">Regular Stalls</option>
                    <option value="ev">EV Fast Charging</option>
                    <option value="handicap">Accessible / Handicap</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Zone Allocation
                  </label>
                  <select
                    value={bayZoneInput}
                    onChange={(e) => setBayZoneInput(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="Zone A">Zone A (Executive)</option>
                    <option value="Zone B">Zone B (Covered)</option>
                    <option value="Zone C">Zone C (Plaza)</option>
                    <option value="Zone D">Zone D (East Deck)</option>
                    <option value="Zone E">Zone E (Rooftop)</option>
                  </select>
                </div>
              </div>

              {/* Price Override */}
              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Custom Tariff Override (RWF/hr, optional)
                </label>
                <input
                  type="number"
                  placeholder={`Default: ${bayTypeInput === "ev" ? "0 (Free EV Parking)" : (selectedLocation?.hourly_rate || 300)}`}
                  value={bayPriceInput}
                  onChange={(e) => setBayPriceInput(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={handleDeleteBay}
                  className="px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 font-semibold"
                >
                  Delete Bay
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBayControlModal(false)}
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

      {/* ────────────────── MODAL: BULK SPACE GENERATOR ────────────────── */}
      {showSpaceGeneratorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                Bulk Space Provisioner
              </h3>
              <button
                onClick={() => setShowSpaceGeneratorModal(false)}
                className="text-neutral-400 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleBulkGenerate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Target Facility</label>
                <input
                  type="text"
                  disabled
                  value={selectedLocation?.name || "None selected"}
                  className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Prefix</label>
                  <input
                    type="text"
                    value={genPrefix}
                    onChange={(e) => setGenPrefix(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Number of Bays</label>
                  <input
                    type="number"
                    value={genCount}
                    onChange={(e) => setGenCount(Number(e.target.value))}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Zone Scope</label>
                  <select
                    value={genZone}
                    onChange={(e) => setGenZone(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="Zone A">Zone A</option>
                    <option value="Zone B">Zone B</option>
                    <option value="Zone C">Zone C</option>
                    <option value="Zone D">Zone D</option>
                    <option value="Zone E">Zone E</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Bay Type</label>
                  <select
                    value={genType}
                    onChange={(e) => setGenType(e.target.value as any)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="regular">Regular</option>
                    <option value="ev">EV Charger</option>
                    <option value="handicap">Handicap</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowSpaceGeneratorModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold"
                >
                  Generate {genCount} Bays
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────── MODAL: CREATE FACILITY ────────────────── */}
      {showCreateLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                Register New Kigali Parking Facility
              </h3>
              <button
                onClick={() => setShowCreateLocationModal(false)}
                className="text-neutral-400 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateLocation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Facility Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nyarutarama Plaza Parking"
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Address / Street</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KG 9 Ave, Gasabo District"
                  value={newLocAddress}
                  onChange={(e) => setNewLocAddress(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Topology</label>
                  <select
                    value={newLocTopology}
                    onChange={(e) => setNewLocTopology(e.target.value as any)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="oblique">Oblique (45° angle)</option>
                    <option value="perpendicular">Perpendicular (90° standard)</option>
                    <option value="parallel">Parallel (Curbside 0°)</option>
                    <option value="wide">Wide (Accessible / Fleet Stalls)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Total Spots</label>
                  <input
                    type="number"
                    value={newLocSpots}
                    onChange={(e) => setNewLocSpots(Number(e.target.value))}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Hourly Tariff (RWF)</label>
                  <input
                    type="number"
                    value={newLocHourly}
                    onChange={(e) => setNewLocHourly(Number(e.target.value))}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Daily Cap (RWF)</label>
                  <input
                    type="number"
                    value={newLocDaily}
                    onChange={(e) => setNewLocDaily(Number(e.target.value))}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newLocIsEv}
                    onChange={(e) => setNewLocIsEv(e.target.checked)}
                    className="rounded text-neutral-900"
                  />
                  <span>Equipped with EV Fast Charging</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newLocIsHandicap}
                    onChange={(e) => setNewLocIsHandicap(e.target.checked)}
                    className="rounded text-neutral-900"
                  />
                  <span>Designated Accessible Facility</span>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowCreateLocationModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold"
                >
                  Create Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────── MODAL: EDIT FACILITY SETTINGS ────────────────── */}
      {showEditLocationModal && selectedLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                Facility Settings & Governance
              </h3>
              <button
                onClick={() => setShowEditLocationModal(false)}
                className="text-neutral-400 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateLocation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Facility Name</label>
                <input
                  type="text"
                  required
                  value={editLocName}
                  onChange={(e) => setEditLocName(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={editLocAddress}
                  onChange={(e) => setEditLocAddress(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Topology</label>
                  <select
                    value={editLocTopology}
                    onChange={(e) => setEditLocTopology(e.target.value as any)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="oblique">Oblique (45° angle)</option>
                    <option value="perpendicular">Perpendicular (90° standard)</option>
                    <option value="parallel">Parallel (Curbside 0°)</option>
                    <option value="wide">Wide (Accessible / Fleet Stalls)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={editLocStatus}
                    onChange={(e) => setEditLocStatus(e.target.value as any)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="active">Active Operational</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Suspended / Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Hourly Tariff (RWF)</label>
                  <input
                    type="number"
                    value={editLocHourly}
                    onChange={(e) => setEditLocHourly(Number(e.target.value))}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Daily Cap (RWF)</label>
                  <input
                    type="number"
                    value={editLocDaily}
                    onChange={(e) => setEditLocDaily(Number(e.target.value))}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={handleDeleteLocation}
                  className="px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 font-semibold"
                >
                  Delete Facility
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEditLocationModal(false)}
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
    </AdminShell>
  );
}
