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
  TrashIcon,
  SettingsIcon,
  GridDotsIcon,
  DatatablesIcon,
} from "@/components/icons";
import { parkingService, ParkingLocation, ParkingSpace } from "@/lib/services/parkingService";
import { formatCurrency } from "@/lib/utils/format";
import { ImageInputControl } from "@/components/ImageInputControl";
import { LocationListSkeleton, BayGridSkeleton, TableSkeleton } from "@/components/Skeletons";

const ZONES = ["All Zones", "Zone A", "Zone B", "Zone C", "Zone D", "Zone E"] as const;

const AVAILABLE_AMENITIES = [
  "CCTV Surveillance",
  "24/7 Security Patrol",
  "Underground Covered",
  "Wheelchair Step-Free",
  "EV Fast Charging",
  "Car Wash On-Site",
  "Tire Inflation Station",
  "MoMo QR Payment",
  "Automated Boom Gate",
  "Restrooms",
];

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
  const [showAddLotModal, setShowAddLotModal] = useState(false);
  const [showBayControlModal, setShowBayControlModal] = useState(false);
  const [selectedBay, setSelectedBay] = useState<ParkingSpace | null>(null);

  // Single Lot Provisioning State
  const [newSpaceNumber, setNewSpaceNumber] = useState("");
  const [newSpaceZone, setNewSpaceZone] = useState("Zone A");
  const [newSpaceType, setNewSpaceType] = useState<"regular" | "ev" | "handicap" | "vip">("regular");
  const [newSpaceFloor, setNewSpaceFloor] = useState("Floor 1");
  const [newSpaceHourlyRate, setNewSpaceHourlyRate] = useState<number | "">("");
  const [newSpaceImageUrl, setNewSpaceImageUrl] = useState<string | null>(null);
  const [isSubmittingSpace, setIsSubmittingSpace] = useState(false);

  // New Location Form State
  const [newLocName, setNewLocName] = useState("");
  const [newLocAddress, setNewLocAddress] = useState("");
  const [newLocImageUrl, setNewLocImageUrl] = useState<string | null>(null);
  const [newLocTopology, setNewLocTopology] = useState<"oblique" | "perpendicular" | "parallel" | "wide">("perpendicular");
  const [newLocFloors, setNewLocFloors] = useState("4 Levels (Underground B1-B4)");
  const [newLocHourly, setNewLocHourly] = useState(300);
  const [newLocDaily, setNewLocDaily] = useState(2000);
  const [newLocSpots, setNewLocSpots] = useState(80);
  const [newLocLat, setNewLocLat] = useState(-1.9536);
  const [newLocLng, setNewLocLng] = useState(30.0606);
  const [newLocIsEv, setNewLocIsEv] = useState(true);
  const [newLocEvPowerKw, setNewLocEvPowerKw] = useState(60);
  const [newLocEvRateKwh, setNewLocEvRateKwh] = useState(250);
  const [newLocEvConnectors, setNewLocEvConnectors] = useState("CCS2 Combo, Type 2");
  const [newLocIsHandicap, setNewLocIsHandicap] = useState(true);
  const [newLocFacilities, setNewLocFacilities] = useState<string[]>([
    "CCTV Surveillance",
    "24/7 Security Patrol",
    "Underground Covered",
    "MoMo QR Payment",
  ]);
  const [newLocGateInfo, setNewLocGateInfo] = useState("Entry Gate A · Exit Gate B");

  // Edit Location Form State
  const [editLocName, setEditLocName] = useState("");
  const [editLocAddress, setEditLocAddress] = useState("");
  const [editLocImageUrl, setEditLocImageUrl] = useState<string | null>(null);
  const [editLocTopology, setEditLocTopology] = useState<"oblique" | "perpendicular" | "parallel" | "wide">("perpendicular");
  const [editLocFloors, setEditLocFloors] = useState("4 Levels (Underground B1-B4)");
  const [editLocHourly, setEditLocHourly] = useState(300);
  const [editLocDaily, setEditLocDaily] = useState(2000);
  const [editLocStatus, setEditLocStatus] = useState<"active" | "inactive" | "maintenance">("active");
  const [editLocIsEv, setEditLocIsEv] = useState(false);
  const [editLocEvPowerKw, setEditLocEvPowerKw] = useState(60);
  const [editLocEvRateKwh, setEditLocEvRateKwh] = useState(250);
  const [editLocEvConnectors, setEditLocEvConnectors] = useState("CCS2 Combo, Type 2");
  const [editLocIsHandicap, setEditLocIsHandicap] = useState(false);
  const [editLocFacilities, setEditLocFacilities] = useState<string[]>([
    "CCTV Surveillance",
    "24/7 Security Patrol",
  ]);
  const [editLocGateInfo, setEditLocGateInfo] = useState("Entry Gate A · Exit Gate B");

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
  const [bayImageUrl, setBayImageUrl] = useState<string | null>(null);
  const [spaceViewMode, setSpaceViewMode] = useState<"table" | "grid">("table");
  const [locationViewMode, setLocationViewMode] = useState<"table" | "split">("table");

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
        image_url: newLocImageUrl,
        facilities: newLocFacilities,
        opening_hours: {
          open: "06:00",
          close: "22:00",
          "24_7": true,
          floors: newLocFloors,
          ev_power_kw: newLocEvPowerKw,
          ev_connectors: newLocEvConnectors,
          ev_rate_kwh: newLocEvRateKwh,
          gate_info: newLocGateInfo,
        },
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
      setNewLocImageUrl(null);
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
    setEditLocImageUrl(selectedLocation.image_url || null);
    setEditLocIsEv(Boolean(selectedLocation.is_electric_station));
    setEditLocIsHandicap(Boolean(selectedLocation.is_handicap_facility));
    setEditLocFacilities(selectedLocation.facilities || ["CCTV Surveillance", "24/7 Security Patrol"]);

    const extra = (selectedLocation.opening_hours as any) || {};
    setEditLocFloors(extra.floors || "4 Levels (Underground B1-B4)");
    setEditLocEvPowerKw(Number(extra.ev_power_kw || 60));
    setEditLocEvRateKwh(Number(extra.ev_rate_kwh || 250));
    setEditLocEvConnectors(extra.ev_connectors || "CCS2 Combo, Type 2");
    setEditLocGateInfo(extra.gate_info || "Entry Gate A · Exit Gate B");
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
        image_url: editLocImageUrl,
        is_electric_station: editLocIsEv,
        is_handicap_facility: editLocIsHandicap,
        facilities: editLocFacilities,
        opening_hours: {
          ...((selectedLocation.opening_hours as any) || {}),
          open: "06:00",
          close: "22:00",
          "24_7": true,
          floors: editLocFloors,
          ev_power_kw: editLocEvPowerKw,
          ev_connectors: editLocEvConnectors,
          ev_rate_kwh: editLocEvRateKwh,
          gate_info: editLocGateInfo,
        },
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
    setBayImageUrl(bay.image_url || null);
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
        image_url: bayImageUrl,
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

  // Create Single Parking / EV Charging Lot
  const handleCreateSingleSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation || !newSpaceNumber.trim()) return;

    setIsSubmittingSpace(true);
    try {
      const priceVal =
        newSpaceHourlyRate === ""
          ? (newSpaceType === "ev" ? 0 : selectedLocation.hourly_rate || 300)
          : Number(newSpaceHourlyRate);

      const created = await parkingService.createSpace({
        location_id: selectedLocation.id,
        space_number: newSpaceNumber.trim().toUpperCase(),
        zone_code: newSpaceZone,
        space_type: newSpaceType as any,
        is_occupied: false,
        price_per_hour_rwf: priceVal,
        image_url: newSpaceImageUrl,
        qr_code_token: `SPT-${selectedLocation.name.slice(0, 2).toUpperCase()}-${newSpaceNumber.trim().toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      } as any);

      if (created) {
        setSpaces((prev) => [...prev, created]);
        const newTotal = (selectedLocation.total_spots || 0) + 1;
        const newAvail = (selectedLocation.available_spots || 0) + 1;
        const updatedLoc = { ...selectedLocation, total_spots: newTotal, available_spots: newAvail };
        setSelectedLocation(updatedLoc);
        setLocations((prev) => prev.map((l) => (l.id === updatedLoc.id ? updatedLoc : l)));
      }

      setNewSpaceNumber("");
      setNewSpaceImageUrl(null);
      setShowAddLotModal(false);
    } catch (err) {
      console.error("Failed creating space lot:", err);
      alert("Failed creating lot: " + ((err as any)?.message || "Database error"));
    } finally {
      setIsSubmittingSpace(false);
    }
  };

  // Quick Delete Space from Grid
  const handleQuickDeleteBay = async (bay: ParkingSpace, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm(`Are you sure you want to delete lot / bay ${bay.space_number}?`)) return;
    try {
      await parkingService.deleteSpace(bay.id);
      setSpaces((prev) => prev.filter((s) => s.id !== bay.id));
      if (selectedLocation) {
        const newTotal = Math.max(0, (selectedLocation.total_spots || 1) - 1);
        const newAvail = bay.is_occupied
          ? (selectedLocation.available_spots || 0)
          : Math.max(0, (selectedLocation.available_spots || 1) - 1);
        const updated = { ...selectedLocation, total_spots: newTotal, available_spots: newAvail };
        setSelectedLocation(updated);
        setLocations((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      }
    } catch (err) {
      console.error("Failed deleting lot:", err);
      alert("Failed deleting lot: " + ((err as any)?.message || "Database error"));
    }
  };

  // Delete Individual Bay from Control Modal
  const handleDeleteBay = async () => {
    if (!selectedBay) return;
    if (!confirm(`Are you sure you want to delete lot / bay ${selectedBay.space_number}?`)) return;
    try {
      await parkingService.deleteSpace(selectedBay.id);
      setSpaces((prev) => prev.filter((s) => s.id !== selectedBay.id));
      if (selectedLocation) {
        const newTotal = Math.max(0, (selectedLocation.total_spots || 1) - 1);
        const newAvail = selectedBay.is_occupied
          ? (selectedLocation.available_spots || 0)
          : Math.max(0, (selectedLocation.available_spots || 1) - 1);
        const updated = { ...selectedLocation, total_spots: newTotal, available_spots: newAvail };
        setSelectedLocation(updated);
        setLocations((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      }
      setShowBayControlModal(false);
    } catch (err) {
      console.error("Failed deleting bay:", err);
      alert("Failed deleting bay: " + ((err as any)?.message || "Database error"));
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
      <div className="space-y-5">
        {/* Top Banner with Real-time Indicator (Uniform across ParkZone Admin) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#151921] p-6 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] shadow-xs">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase tracking-wide border border-neutral-200 dark:border-neutral-700">
                Kigali Municipal Mobility
              </span>
              <span className="text-xs text-neutral-400">
                · {formatCurrency(selectedLocation?.hourly_rate ?? 300)}/hr · {formatCurrency(selectedLocation?.daily_rate ?? 2000)} Daily Cap
              </span>
              {lastRealtimeEvent ? (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {lastRealtimeEvent}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200/50 dark:border-neutral-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  ANPR & Telemetry Active
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

          <button
            onClick={() => setShowCreateLocationModal(true)}
            className="px-4 py-2 rounded-xl bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 self-start md:self-auto whitespace-nowrap shrink-0"
          >
            <PlusIcon size={14} />
            <span className="whitespace-nowrap">Add Facility</span>
          </button>
        </div>

        {/* Operational Toolbar: View Switcher & Facility Stall Tools */}
        <div className="bg-white dark:bg-[#151921] px-4 py-3 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: View Mode Segmented Switcher */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-[#101319] border border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setLocationViewMode("table")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  locationViewMode === "table"
                    ? "bg-white dark:bg-[#1e2430] text-neutral-900 dark:text-white shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
                title="Table view of all facilities"
              >
                <DatatablesIcon size={13} />
                <span>Facilities Table</span>
              </button>
              <button
                type="button"
                onClick={() => setLocationViewMode("split")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  locationViewMode === "split"
                    ? "bg-white dark:bg-[#1e2430] text-neutral-900 dark:text-white shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
                title="Side-by-side split view"
              >
                <GridDotsIcon size={13} />
                <span>Split View</span>
              </button>
            </div>

            {selectedLocation && (
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium hidden sm:inline">
                Selected: <strong className="text-neutral-900 dark:text-white font-semibold">{selectedLocation.name}</strong> ({spaces.length} bays)
              </span>
            )}
          </div>

          {/* Right: Selected Facility Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {selectedLocation && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    const nextNum = (spaces.length + 1).toString().padStart(2, "0");
                    setNewSpaceNumber(`A-${nextNum}`);
                    setNewSpaceHourlyRate(selectedLocation.hourly_rate || 300);
                    setNewSpaceZone(availableZones[1] || "Zone A");
                    setShowAddLotModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <PlusIcon size={12} />
                  <span>Add Lot / Bay</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenEditLocation}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <SettingsIcon size={12} />
                  <span>Facility Settings</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setShowSpaceGeneratorModal(true)}
              className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <GridDotsIcon size={12} />
              <span>Bulk Generator</span>
            </button>
          </div>
        </div>

        {/* VIEW MODE: TABLE (Locations Table + Selected Facility Bays Table) */}
        {locationViewMode === "table" && (
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] overflow-hidden shadow-xs">
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
                  All Registered Parking & Charging Facilities Directory
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Click any facility row to inspect its live parking and charging stalls below.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                  {locations.length} Facilities
                </span>
                <button
                  onClick={() => setShowCreateLocationModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <PlusIcon size={12} />
                  <span>Add Facility</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-300">
                <thead className="bg-[#f8f9fa] dark:bg-[#181d26] border-b border-neutral-200/80 dark:border-neutral-800 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-16">Facility</th>
                    <th className="py-3 px-4">Name &amp; Address</th>
                    <th className="py-3 px-4">Capabilities</th>
                    <th className="py-3 px-4">Live Capacity</th>
                    <th className="py-3 px-4">Tariffs</th>
                    <th className="py-3 px-4">Operating Hours</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                  {loading && locations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-0">
                        <TableSkeleton rows={3} cols={8} />
                      </td>
                    </tr>
                  ) : locations.length > 0 ? (
                    locations.map((loc) => {
                      const isSelected = selectedLocation?.id === loc.id;
                      const occPercent =
                        loc.total_spots > 0
                          ? Math.round(((loc.total_spots - loc.available_spots) / loc.total_spots) * 100)
                          : 0;

                      return (
                        <tr
                          key={loc.id}
                          onClick={() => handleSelectLocation(loc)}
                          className={`hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer ${
                            isSelected ? "bg-neutral-100/90 dark:bg-neutral-800/70 font-semibold ring-1 ring-neutral-300 dark:ring-neutral-700" : ""
                          }`}
                        >
                          {/* Image */}
                          <td className="py-3 px-4">
                            <div className="w-12 h-10 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 shrink-0">
                              {loc.image_url ? (
                                <img src={loc.image_url} alt={loc.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs font-bold">
                                  {loc.name.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Name & Address */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-neutral-900 dark:text-white truncate max-w-[220px]" title={loc.name}>
                              {loc.name}
                            </div>
                            <div className="text-[10px] text-neutral-400 truncate max-w-[220px]" title={loc.address}>
                              {loc.address}, {loc.city}
                            </div>
                          </td>

                          {/* Capabilities */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {loc.is_electric_station && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                  ⚡ EV Station
                                </span>
                              )}
                              {loc.is_handicap_facility && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                  ♿ Accessible
                                </span>
                              )}
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 capitalize">
                                {loc.layout_topology || "Perpendicular"}
                              </span>
                            </div>
                          </td>

                          {/* Capacity */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-neutral-900 dark:text-white">
                                {loc.available_spots} / {loc.total_spots} Free
                              </span>
                              <span className="text-[10px] text-neutral-400 font-semibold">
                                ({occPercent}%)
                              </span>
                            </div>
                            <div className="w-24 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mt-1">
                              <div
                                style={{ width: `${Math.min(100, Math.max(0, occPercent))}%` }}
                                className={`h-full rounded-full ${
                                  occPercent > 80 ? "bg-red-500" : occPercent > 50 ? "bg-amber-500" : "bg-emerald-500"
                                }`}
                              />
                            </div>
                          </td>

                          {/* Tariffs */}
                          <td className="py-3 px-4 whitespace-nowrap font-medium text-neutral-900 dark:text-white">
                            <div>{formatCurrency(loc.hourly_rate)}/hr</div>
                            <div className="text-[10px] text-neutral-400 font-normal">
                              Cap: {formatCurrency(loc.daily_rate)}/day
                            </div>
                          </td>

                          {/* Hours */}
                          <td className="py-3 px-4 whitespace-nowrap text-[11px] text-neutral-500 dark:text-neutral-400">
                            {(loc as any).opening_time && (loc as any).closing_time
                              ? `${(loc as any).opening_time.slice(0, 5)} - ${(loc as any).closing_time.slice(0, 5)}`
                              : "24/7 Monitored"}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                loc.status === "active" && loc.is_active !== false
                                  ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  loc.status === "active" && loc.is_active !== false ? "bg-emerald-500" : "bg-neutral-400"
                                }`}
                              />
                              {loc.status || "Active"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleSelectLocation(loc)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-colors ${
                                  isSelected
                                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900"
                                    : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
                                }`}
                              >
                                {isSelected ? "Inspecting Bays" : "View Bays"}
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedLocation(loc);
                                  handleOpenEditLocation();
                                }}
                                className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white text-[10px] font-semibold"
                              >
                                Settings
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-xs text-neutral-400">
                        No facilities registered in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2-Column or Full Width Bay Control */}
        <div className={locationViewMode === "split" ? "grid grid-cols-1 lg:grid-cols-12 gap-6" : "w-full"}>
          {locationViewMode === "split" && (
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Active Facilities ({locations.length})
                </h3>
                <span className="text-[11px] text-neutral-400">Select to load live bays</span>
              </div>

              <div className="space-y-3">
                {loading && locations.length === 0 ? (
                  <LocationListSkeleton count={3} />
                ) : locations.length > 0 ? (
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
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white dark:bg-[#181d26] border-neutral-900 dark:border-neutral-300 shadow-md ring-1 ring-neutral-900/10 dark:ring-white/10"
                            : "bg-white dark:bg-[#151921] border-[#e8ecf1] dark:border-[#202734] hover:border-neutral-400"
                        }`}
                      >
                        {/* Facility Photo / Cover Preview */}
                        {loc.image_url ? (
                          <div className="relative w-full h-28 rounded-xl overflow-hidden mb-3 border border-neutral-200/60 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800">
                            <img
                              src={loc.image_url}
                              alt={loc.name}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                            <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs uppercase tracking-wider">
                              {loc.layout_topology}
                            </span>
                            {loc.is_electric_station && (
                              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-sm flex items-center gap-1">
                                <span>⚡ EV Fast</span>
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-11 rounded-xl mb-3 bg-neutral-100 dark:bg-neutral-800/60 border border-dashed border-neutral-200 dark:border-neutral-700 flex items-center justify-between px-3 text-[11px] text-neutral-400">
                            <span className="capitalize font-medium flex items-center gap-1.5">
                              📐 {loc.layout_topology} Layout
                            </span>
                            {loc.is_electric_station && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                                ⚡ EV Station
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4
                                className="font-bold text-sm text-neutral-900 dark:text-white truncate max-w-[190px]"
                                title={loc.name}
                              >
                                {loc.name}
                              </h4>
                              {loc.is_electric_station && !loc.image_url && (
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

                          {!loc.image_url && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 uppercase tracking-wider shrink-0">
                              {loc.layout_topology}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-2 my-3 text-xs">
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
          )}

          {/* Spaces Section with Full Interactive Control */}
          <div className={`${locationViewMode === "split" ? "lg:col-span-8" : "w-full"} bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-6 shadow-xs flex flex-col justify-between`}>
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

              {/* ────────────────── FACILITY SHOWCASE & CUSTOMIZATION BANNER ────────────────── */}
              {selectedLocation && (
                <div className="my-4 p-4 rounded-2xl bg-neutral-50 dark:bg-[#12161f] border border-neutral-200/80 dark:border-neutral-800/80 flex flex-col md:flex-row gap-4 items-stretch">
                  {/* Facility Photo / Preview */}
                  <div className="relative md:w-56 h-36 rounded-xl overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800 group">
                    {selectedLocation.image_url ? (
                      <img
                        src={selectedLocation.image_url}
                        alt={selectedLocation.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-3 text-neutral-400">
                        <svg className="w-8 h-8 mb-1 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[10px] font-semibold">No facility picture</span>
                      </div>
                    )}
                    <button
                      onClick={handleOpenEditLocation}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity backdrop-blur-xs"
                    >
                      Change Photo & Specs
                    </button>
                  </div>

                  {/* Details Grid */}
                  <div className="flex-1 flex flex-col justify-between space-y-2 text-xs">
                    {/* Topology & Circulation */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#181d26] border border-neutral-100 dark:border-neutral-800">
                        <span className="text-[10px] text-neutral-400 block font-medium">Layout Topology</span>
                        <span className="font-bold text-neutral-800 dark:text-neutral-200 capitalize mt-0.5 block truncate">
                          {selectedLocation.layout_topology === "perpendicular" && "90° Perpendicular"}
                          {selectedLocation.layout_topology === "oblique" && "45° Oblique Traffic"}
                          {selectedLocation.layout_topology === "parallel" && "0° Curbside Parallel"}
                          {selectedLocation.layout_topology === "wide" && "Wide / Accessible"}
                          {!["perpendicular", "oblique", "parallel", "wide"].includes(selectedLocation.layout_topology) && selectedLocation.layout_topology}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#181d26] border border-neutral-100 dark:border-neutral-800">
                        <span className="text-[10px] text-neutral-400 block font-medium">Floor Levels</span>
                        <span className="font-bold text-neutral-800 dark:text-neutral-200 mt-0.5 block truncate">
                          {(selectedLocation.opening_hours as any)?.floors || "Multi-Level"}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#181d26] border border-neutral-100 dark:border-neutral-800 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-neutral-400 block font-medium">Gate Circulation Flow</span>
                        <span className="font-bold text-neutral-800 dark:text-neutral-200 mt-0.5 block truncate">
                          {(selectedLocation.opening_hours as any)?.gate_info || "Ingress Gate A · Egress Gate B"}
                        </span>
                      </div>
                    </div>

                    {/* EV Charging Info Banner (if enabled) */}
                    {selectedLocation.is_electric_station ? (
                      <div className="p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-600 text-white uppercase tracking-wider">
                            ⚡ EV Fast Hub
                          </span>
                          <span className="text-[11px] font-semibold text-blue-900 dark:text-blue-300">
                            {(selectedLocation.opening_hours as any)?.ev_power_kw || 60} kW Max Output · {(selectedLocation.opening_hours as any)?.ev_connectors || "CCS2 Combo, Type 2"}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-blue-800 dark:text-blue-200">
                          {formatCurrency((selectedLocation.opening_hours as any)?.ev_rate_kwh || 250)}/kWh
                        </span>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 text-neutral-500 text-[11px] flex items-center justify-between">
                        <span>Standard ICE Facility (EV charging not equipped)</span>
                        <button
                          onClick={handleOpenEditLocation}
                          className="text-neutral-700 dark:text-neutral-300 font-semibold hover:underline"
                        >
                          + Enable EV Charging
                        </button>
                      </div>
                    )}

                    {/* Amenities Chips */}
                    {selectedLocation.facilities && selectedLocation.facilities.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        {selectedLocation.facilities.map((am) => (
                          <span
                            key={am}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-white dark:bg-[#181d26] border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 shadow-2xs"
                          >
                            ✓ {am}
                          </span>
                        ))}
                        <button
                          onClick={handleOpenEditLocation}
                          className="text-[10px] text-neutral-400 hover:text-black dark:hover:text-white font-medium ml-1"
                        >
                          Edit Amenities
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

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

                    {/* View Mode Toggle: Table or Grid */}
                    <div className="flex items-center p-0.5 rounded-xl bg-[#f8f9fa] dark:bg-[#181d26] border border-neutral-200 dark:border-neutral-700 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSpaceViewMode("table")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                          spaceViewMode === "table"
                            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xs"
                            : "text-neutral-500 hover:text-black dark:hover:text-white"
                        }`}
                      >
                        <span className="text-[11px]">☰</span>
                        <span>Table</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpaceViewMode("grid")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                          spaceViewMode === "grid"
                            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xs"
                            : "text-neutral-500 hover:text-black dark:hover:text-white"
                        }`}
                      >
                        <span className="text-[11px]">⊞</span>
                        <span>Grid</span>
                      </button>
                    </div>
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

              {/* Spaces View: Table or Visual Grid */}
              {loading ? (
                spaceViewMode === "table" ? (
                  <TableSkeleton rows={6} cols={7} />
                ) : (
                  <BayGridSkeleton count={8} />
                )
              ) : spaceViewMode === "table" ? (
                <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 pt-1">
                  <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-300">
                    <thead className="bg-[#f8f9fa] dark:bg-[#181d26] border-b border-neutral-200/80 dark:border-neutral-800 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                      <tr>
                        <th className="py-3 px-4 w-14">Image</th>
                        <th className="py-3 px-4">Lot # & Zone</th>
                        <th className="py-3 px-4">Space Type</th>
                        <th className="py-3 px-4">Live Status</th>
                        <th className="py-3 px-4">Hourly Tariff</th>
                        <th className="py-3 px-4">QR / Plate</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                      {filteredSpaces.length > 0 ? (
                        filteredSpaces.map((space) => {
                          const isOccupied = space.is_occupied;
                          const isEv = space.space_type === "ev";
                          const isHandicap = space.space_type === "handicap";
                          return (
                            <tr
                              key={space.id}
                              onClick={() => handleOpenBayControl(space)}
                              className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer"
                            >
                              {/* Image */}
                              <td className="py-2.5 px-4">
                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 shrink-0">
                                  {space.image_url ? (
                                    <img
                                      src={space.image_url}
                                      alt={space.space_number}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-400 font-black text-[10px]">
                                      {space.space_number.slice(0, 3)}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Space Number & Zone */}
                              <td className="py-2.5 px-4 font-mono font-bold text-neutral-900 dark:text-white whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm">{space.space_number}</span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded font-sans font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                                    {space.zone_code || "Zone A"}
                                  </span>
                                </div>
                                <span className="text-[10px] text-neutral-400 font-normal font-sans">
                                  Floor {(space as any).floor || "1"}
                                </span>
                              </td>

                              {/* Type */}
                              <td className="py-2.5 px-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    isEv
                                      ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                      : isHandicap
                                      ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                                  }`}
                                >
                                  {isEv ? "⚡ EV Charger" : isHandicap ? "♿ Accessible" : "🚗 Regular"}
                                </span>
                              </td>

                              {/* Status & Plate */}
                              <td className="py-2.5 px-4 whitespace-nowrap">
                                {isOccupied ? (
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                                      Occupied
                                    </span>
                                    {space.current_vehicle_plate && (
                                      <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white">
                                        {space.current_vehicle_plate}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Available
                                  </span>
                                )}
                              </td>

                              {/* Tariff */}
                              <td className="py-2.5 px-4 whitespace-nowrap font-medium text-neutral-900 dark:text-white">
                                {formatCurrency(space.price_per_hour_rwf || selectedLocation?.hourly_rate || 300)}/hr
                              </td>

                              {/* QR Code Token */}
                              <td className="py-2.5 px-4 whitespace-nowrap">
                                <span className="font-mono text-[10px] text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded truncate max-w-[140px] block" title={space.qr_code_token || ""}>
                                  {space.qr_code_token ? space.qr_code_token.slice(0, 16) + "..." : "—"}
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="py-2.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleQuickToggleOccupancy(space)}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-colors ${
                                      isOccupied
                                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
                                        : "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                    }`}
                                  >
                                    {isOccupied ? "Free Bay" : "Occupy"}
                                  </button>
                                  <button
                                    onClick={() => handleOpenBayControl(space)}
                                    className="px-2.5 py-1 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[10px] font-semibold hover:opacity-90"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={(e) => handleQuickDeleteBay(space, e)}
                                    title="Delete Bay"
                                    className="w-6 h-6 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-100"
                                  >
                                    <TrashIcon size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-xs text-neutral-400">
                            No parking stalls found matching filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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
                          <div className="flex items-center gap-1.5">
                            <span className={`font-mono font-extrabold text-xs tracking-wider ${isOccupied ? "text-white" : "text-neutral-900 dark:text-white"}`}>
                              {space.space_number}
                            </span>
                            {space.image_url && (
                              <span className="text-[10px]" title="Overhead camera / photo attached">
                                📷
                              </span>
                            )}
                          </div>
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

                        {/* Bottom Row: Quick Action Button & Quick Delete */}
                        <div className="pt-2 border-t border-neutral-200/40 dark:border-neutral-800/60 flex items-center justify-between text-[10px]">
                          <span className="text-neutral-400 font-medium">
                            {space.zone_code}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => handleQuickDeleteBay(space, e)}
                              className="p-1 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors opacity-0 group-hover:opacity-100"
                              title={`Delete lot ${space.space_number}`}
                            >
                              <TrashIcon size={13} />
                            </button>
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

              {/* Bay Photo / Camera Capture */}
              <div className="pt-1">
                <ImageInputControl
                  label="Bay Overhead Camera / Photo"
                  value={bayImageUrl}
                  onChange={setBayImageUrl}
                  folder="spaces"
                  bucket="parking-images"
                  helperText="Upload a photo of this bay from your device or paste a direct camera feed URL"
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

      {/* ────────────────── MODAL: ADD PARKING OR CHARGING LOT ────────────────── */}
      {showAddLotModal && selectedLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
                  Add Parking Stall or Charging Lot
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Register a regular parking spot, EV rapid charger bay, or accessible stall.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddLotModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 flex items-center justify-center hover:text-black dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSingleSpace} className="space-y-4 text-xs">
              {/* Target Location Banner */}
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-[#181d26] border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Target Facility</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 text-xs">{selectedLocation.name}</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                  {selectedLocation.layout_topology}
                </span>
              </div>

              {/* Stall / Lot Identifier & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Lot / Stall Identifier <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A-12, EV-04, B-02"
                    value={newSpaceNumber}
                    onChange={(e) => setNewSpaceNumber(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Lot Space Type
                  </label>
                  <select
                    value={newSpaceType}
                    onChange={(e) => {
                      const t = e.target.value as any;
                      setNewSpaceType(t);
                      if (t === "ev") {
                        setNewSpaceHourlyRate(0);
                        if (!newSpaceNumber || newSpaceNumber.startsWith("A-")) {
                          setNewSpaceNumber(`EV-${(spaces.filter((s) => s.space_type === "ev").length + 1).toString().padStart(2, "0")}`);
                        }
                      } else if (newSpaceHourlyRate === 0) {
                        setNewSpaceHourlyRate(selectedLocation.hourly_rate || 300);
                      }
                    }}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value="regular">🚗 Standard Parking Stall</option>
                    <option value="ev">⚡ EV Fast Charging Bay</option>
                    <option value="handicap">♿ Accessible / Handicap Stall</option>
                    <option value="vip">👑 VIP / Reserved Stall</option>
                  </select>
                </div>
              </div>

              {/* Zone & Floor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Zone / Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Zone A, EV Fast Hub"
                    value={newSpaceZone}
                    onChange={(e) => setNewSpaceZone(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Floor Level
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Level 1, Basement B1"
                    value={newSpaceFloor}
                    onChange={(e) => setNewSpaceFloor(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Hourly Rate (RWF)
                </label>
                <input
                  type="number"
                  placeholder={`Default: ${newSpaceType === "ev" ? "0 (Free Parking for EV charging)" : (selectedLocation.hourly_rate || 300)}`}
                  value={newSpaceHourlyRate}
                  onChange={(e) => setNewSpaceHourlyRate(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
                <p className="text-[10px] text-neutral-400 mt-1">
                  Leave blank to inherit the facility rate ({selectedLocation.hourly_rate || 300} RWF/hr).
                </p>
              </div>

              {/* Overhead Camera / Bay Photo */}
              <div className="pt-1">
                <ImageInputControl
                  label="Lot Photograph / ANPR Sensor Camera"
                  value={newSpaceImageUrl}
                  onChange={setNewSpaceImageUrl}
                  folder="spaces"
                  bucket="parking-images"
                  helperText="Upload a photo of this bay from your device or paste a direct image URL"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddLotModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSpace}
                  className="px-4 py-2 rounded-xl bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {isSubmittingSpace ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Creating Lot...</span>
                    </>
                  ) : (
                    <span>Create Lot / Bay</span>
                  )}
                </button>
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
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
                  Register New Kigali Parking Facility
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Configure facility photos, architectural layout topology, EV fast charging, and amenities.
                </p>
              </div>
              <button
                onClick={() => setShowCreateLocationModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateLocation} className="space-y-4 text-xs">
              {/* Photo Showcase */}
              <ImageInputControl
                label="Facility Showcase Picture / Architectural Photo"
                value={newLocImageUrl}
                onChange={setNewLocImageUrl}
                folder="locations"
                bucket="parking-images"
                helperText="Upload a photo from your computer to Supabase Storage or paste a web image link"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </div>

              {/* Layout Specifications */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#12161f] border border-neutral-200/70 dark:border-neutral-800 space-y-3">
                <span className="font-bold text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-300 block">
                  Physical Layout & Blueprint
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Layout Topology</label>
                    <select
                      value={newLocTopology}
                      onChange={(e) => setNewLocTopology(e.target.value as any)}
                      className="w-full bg-white dark:bg-[#181d26] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none font-medium"
                    >
                      <option value="perpendicular">90° Perpendicular (Standard High-Density)</option>
                      <option value="oblique">45° Oblique (One-Way Fast Traffic Flow)</option>
                      <option value="parallel">0° Parallel (Curbside Drive Aisle)</option>
                      <option value="wide">Wide Stall (Accessible / Fleet Stalls)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Total Bays Capacity</label>
                    <input
                      type="number"
                      value={newLocSpots}
                      onChange={(e) => setNewLocSpots(Number(e.target.value))}
                      className="w-full bg-white dark:bg-[#181d26] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Floor Levels / Multi-Story</label>
                    <input
                      type="text"
                      placeholder="e.g. 4 Levels (Underground B1-B4)"
                      value={newLocFloors}
                      onChange={(e) => setNewLocFloors(e.target.value)}
                      className="w-full bg-white dark:bg-[#181d26] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Circulation & Gate Flow</label>
                    <input
                      type="text"
                      placeholder="e.g. Entry Gate A · Exit Gate B"
                      value={newLocGateInfo}
                      onChange={(e) => setNewLocGateInfo(e.target.value)}
                      className="w-full bg-white dark:bg-[#181d26] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tariffs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Hourly Parking Tariff (RWF)</label>
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

              {/* EV Charging Capabilities */}
              <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[11px] uppercase tracking-wider text-blue-900 dark:text-blue-300 block">
                      EV Fast Charging Capabilities
                    </span>
                    <span className="text-[10px] text-blue-700 dark:text-blue-400">
                      Showcase EV chargers, charging rates, and plug standards to drivers
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newLocIsEv}
                      onChange={(e) => setNewLocIsEv(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {newLocIsEv && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                        Max Power (kW)
                      </label>
                      <input
                        type="number"
                        value={newLocEvPowerKw}
                        onChange={(e) => setNewLocEvPowerKw(Number(e.target.value))}
                        className="w-full bg-white dark:bg-[#181d26] border border-blue-200 dark:border-blue-900/60 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                        Tariff (RWF/kWh)
                      </label>
                      <input
                        type="number"
                        value={newLocEvRateKwh}
                        onChange={(e) => setNewLocEvRateKwh(Number(e.target.value))}
                        className="w-full bg-white dark:bg-[#181d26] border border-blue-200 dark:border-blue-900/60 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                        Connectors / Plugs
                      </label>
                      <input
                        type="text"
                        value={newLocEvConnectors}
                        onChange={(e) => setNewLocEvConnectors(e.target.value)}
                        className="w-full bg-white dark:bg-[#181d26] border border-blue-200 dark:border-blue-900/60 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Designated Accessible Facility */}
              <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-neutral-50 dark:bg-[#12161f] border border-neutral-200/70 dark:border-neutral-800">
                <input
                  type="checkbox"
                  checked={newLocIsHandicap}
                  onChange={(e) => setNewLocIsHandicap(e.target.checked)}
                  className="rounded text-neutral-900 w-4 h-4"
                />
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Designated Accessible Facility (Step-free elevators, wide accessible stalls)
                </span>
              </label>

              {/* Facility Amenities */}
              <div>
                <label className="block font-semibold mb-1.5 text-neutral-700 dark:text-neutral-300">
                  Included Amenities & Security Features
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABLE_AMENITIES.map((amenity) => {
                    const checked = newLocFacilities.includes(amenity);
                    return (
                      <label
                        key={amenity}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] cursor-pointer transition-all ${
                          checked
                            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 font-semibold"
                            : "bg-[#f8f9fa] dark:bg-[#181d26] border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewLocFacilities([...newLocFacilities, amenity]);
                            } else {
                              setNewLocFacilities(newLocFacilities.filter((a) => a !== amenity));
                            }
                          }}
                          className="sr-only"
                        />
                        <span>{checked ? "✓ " : "+ "}{amenity}</span>
                      </label>
                    );
                  })}
                </div>
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
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
                  Facility Settings & Customizations
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Update facility pictures, layout blueprint, EV charging specifications, and guest amenities.
                </p>
              </div>
              <button
                onClick={() => setShowEditLocationModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateLocation} className="space-y-4 text-xs">
              {/* Photo Showcase */}
              <ImageInputControl
                label="Facility Showcase Picture / Architectural Photo"
                value={editLocImageUrl}
                onChange={setEditLocImageUrl}
                folder="locations"
                bucket="parking-images"
                helperText="Upload a photo from your computer to Supabase Storage or paste a web image link"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </div>

              {/* Layout Specifications */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#12161f] border border-neutral-200/70 dark:border-neutral-800 space-y-3">
                <span className="font-bold text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-300 block">
                  Physical Layout & Blueprint
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Layout Topology</label>
                    <select
                      value={editLocTopology}
                      onChange={(e) => setEditLocTopology(e.target.value as any)}
                      className="w-full bg-white dark:bg-[#181d26] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none font-medium"
                    >
                      <option value="perpendicular">90° Perpendicular (Standard High-Density)</option>
                      <option value="oblique">45° Oblique (One-Way Fast Traffic Flow)</option>
                      <option value="parallel">0° Parallel (Curbside Drive Aisle)</option>
                      <option value="wide">Wide Stall (Accessible / Fleet Stalls)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Operational Status</label>
                    <select
                      value={editLocStatus}
                      onChange={(e) => setEditLocStatus(e.target.value as any)}
                      className="w-full bg-white dark:bg-[#181d26] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    >
                      <option value="active">Active Operational</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="inactive">Suspended / Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Floor Levels / Multi-Story</label>
                    <input
                      type="text"
                      placeholder="e.g. 4 Levels (Underground B1-B4)"
                      value={editLocFloors}
                      onChange={(e) => setEditLocFloors(e.target.value)}
                      className="w-full bg-white dark:bg-[#181d26] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Circulation & Gate Flow</label>
                    <input
                      type="text"
                      placeholder="e.g. Entry Gate A · Exit Gate B"
                      value={editLocGateInfo}
                      onChange={(e) => setEditLocGateInfo(e.target.value)}
                      className="w-full bg-white dark:bg-[#181d26] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tariffs */}
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

              {/* EV Charging Capabilities */}
              <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[11px] uppercase tracking-wider text-blue-900 dark:text-blue-300 block">
                      EV Fast Charging Capabilities
                    </span>
                    <span className="text-[10px] text-blue-700 dark:text-blue-400">
                      Display charging rates, max power, and plug types to EV drivers
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editLocIsEv}
                      onChange={(e) => setEditLocIsEv(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {editLocIsEv && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                        Max Power (kW)
                      </label>
                      <input
                        type="number"
                        value={editLocEvPowerKw}
                        onChange={(e) => setEditLocEvPowerKw(Number(e.target.value))}
                        className="w-full bg-white dark:bg-[#181d26] border border-blue-200 dark:border-blue-900/60 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                        Tariff (RWF/kWh)
                      </label>
                      <input
                        type="number"
                        value={editLocEvRateKwh}
                        onChange={(e) => setEditLocEvRateKwh(Number(e.target.value))}
                        className="w-full bg-white dark:bg-[#181d26] border border-blue-200 dark:border-blue-900/60 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                        Connectors / Plugs
                      </label>
                      <input
                        type="text"
                        value={editLocEvConnectors}
                        onChange={(e) => setEditLocEvConnectors(e.target.value)}
                        className="w-full bg-white dark:bg-[#181d26] border border-blue-200 dark:border-blue-900/60 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Designated Accessible Facility */}
              <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-neutral-50 dark:bg-[#12161f] border border-neutral-200/70 dark:border-neutral-800">
                <input
                  type="checkbox"
                  checked={editLocIsHandicap}
                  onChange={(e) => setEditLocIsHandicap(e.target.checked)}
                  className="rounded text-neutral-900 w-4 h-4"
                />
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Designated Accessible Facility (Step-free elevators, wide accessible stalls)
                </span>
              </label>

              {/* Facility Amenities */}
              <div>
                <label className="block font-semibold mb-1.5 text-neutral-700 dark:text-neutral-300">
                  Included Amenities & Security Features
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABLE_AMENITIES.map((amenity) => {
                    const checked = editLocFacilities.includes(amenity);
                    return (
                      <label
                        key={amenity}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] cursor-pointer transition-all ${
                          checked
                            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 font-semibold"
                            : "bg-[#f8f9fa] dark:bg-[#181d26] border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditLocFacilities([...editLocFacilities, amenity]);
                            } else {
                              setEditLocFacilities(editLocFacilities.filter((a) => a !== amenity));
                            }
                          }}
                          className="sr-only"
                        />
                        <span>{checked ? "✓ " : "+ "}{amenity}</span>
                      </label>
                    );
                  })}
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
