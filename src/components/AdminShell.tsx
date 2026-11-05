"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  WalletIcon,
  ProjectsIcon,
  InboxIcon,
  ChartsIcon,
  TagsIcon,
  BellIcon,
  GlobeIcon,
  SunIcon,
  MoonIcon,
  SettingsIcon,
  SearchIcon,
  GridDotsIcon,
  SidebarToggleIcon,
  PlusIcon,
  FilterIcon,
  MaximizeIcon,
  ChevronDownIcon,
  ParkingCarIcon,
  UsersIcon,
  ExpandIcon,
  MoreCircleIcon,
  TrophyIcon,
  ArrowRightIcon,
  FileManagerIcon,
} from "./icons";

import { parkingService } from "@/lib/services/parkingService";
import { useTheme } from "@/components/ThemeProvider";
import { createClient } from "@/lib/supabase/client";
import { AdminShellSkeleton } from "@/components/Skeletons";

function getInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email && email.trim()) {
    return email.slice(0, 2).toUpperCase();
  }
  return "AD";
}

interface AdminShellProps {
  children: React.ReactNode;
  breadcrumb?: string;
  onQuickAdd?: () => void;
  onFilter?: () => void;
  hideRightSidebar?: boolean;
}

export function AdminShell({
  children,
  breadcrumb = "Dashboard",
  onQuickAdd,
  onFilter,
  hideRightSidebar = false,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isAuthVerifying, setIsAuthVerifying] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHub, setSelectedHub] = useState("Kigali Heights Underground");
  const [activeTab, setActiveTab] = useState<"Today" | "Wallet" | "Tasks" | "Emails">("Today");
  const [currentUser, setCurrentUser] = useState<{
    id?: string;
    fullName: string;
    email: string;
    role: string;
    initials: string;
    avatarUrl?: string | null;
  }>({
    fullName: "Admin",
    email: "admin@parkzone.rw",
    role: "System Admin",
    initials: "AD",
    avatarUrl: null,
  });
  const [shellUsers, setShellUsers] = useState<
    { id: string; name: string; letter: string; bg: string; avatarUrl?: string | null }[]
  >([]);
  const [shellLocations, setShellLocations] = useState<
    { id: string; name: string; spots: number; available: number }[]
  >([]);
  const [alerts, setAlerts] = useState<
    { id: string; title: string; subtitle: string }[]
  >([]);

  // Fetch logged in user details from Supabase Auth + Profiles
  const loadCurrentUser = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 1. Strict admin role verification
        let isAdmin = false;
        let detectedRole = "driver";

        try {
          const roleRes = await fetch("/api/auth/verify-role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, email: user.email }),
          });
          if (roleRes.ok) {
            const json = await roleRes.json();
            isAdmin = json.isAdmin === true;
            detectedRole = json.role || "driver";
          }
        } catch {
          // fallback check
        }

        // Fetch matching profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, full_name, email, role, avatar_url, phone_number, is_active")
          .eq("id", user.id)
          .maybeSingle();

        if (!isAdmin) {
          const rawRole = (profile?.role || (user.user_metadata as any)?.role || "").toLowerCase();
          isAdmin = rawRole === "admin" && profile?.is_active !== false;
          detectedRole = profile?.role || (user.user_metadata as any)?.role || "driver";
        }

        // Reject non-admin access immediately
        if (!isAdmin) {
          console.warn("Unauthorized admin portal access by non-admin:", user.email, "role:", detectedRole);
          await supabase.auth.signOut({ scope: "global" });
          if (typeof window !== "undefined") {
            localStorage.removeItem("parkzone_admin_session");
            document.cookie = "parkzone_admin_session=;path=/;max-age=0";
            window.location.href = "/login?error=unauthorized";
          }
          return;
        }

        const rawName =
          profile?.full_name ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          (user.email
            ? user.email
                .split("@")[0]
                .replace(/[._]/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())
            : "Admin");

        const rawEmail = profile?.email || user.email || "admin@parkzone.rw";

        setCurrentUser({
          id: user.id,
          fullName: rawName,
          email: rawEmail,
          role: "System Admin",
          initials: getInitials(rawName, rawEmail),
          avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || null,
        });
        setIsAuthVerifying(false);
        return;
      }

      // Check localStorage for saved session email if cookie auth is pending
      const savedEmail =
        typeof window !== "undefined"
          ? localStorage.getItem("parkzone_admin_session")
          : null;
      if (savedEmail) {
        const { data: profByEmail } = await supabase
          .from("profiles")
          .select("id, full_name, email, role, avatar_url, is_active")
          .eq("email", savedEmail)
          .maybeSingle();

        const role = (profByEmail?.role || "").toLowerCase();
        if (profByEmail && role === "admin" && profByEmail.is_active !== false) {
          const name = profByEmail.full_name || savedEmail.split("@")[0];
          setCurrentUser({
            id: profByEmail.id,
            fullName: name,
            email: profByEmail.email || savedEmail,
            role: "System Admin",
            initials: getInitials(name, savedEmail),
            avatarUrl: profByEmail.avatar_url || null,
          });
          setIsAuthVerifying(false);
          return;
        }

        // Invalid non-admin session
        if (typeof window !== "undefined") {
          localStorage.removeItem("parkzone_admin_session");
          document.cookie = "parkzone_admin_session=;path=/;max-age=0";
          window.location.href = "/login?error=unauthorized";
        }
        return;
      }

      // No active user or session found: User is logged out
      setCurrentUser({
        fullName: "",
        email: "",
        role: "",
        initials: "",
        avatarUrl: null,
      });
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.warn("Could not load current authenticated user:", err);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      } else {
        router.push("/login");
      }
    }
  };

  const handleLogout = async () => {
    try {
      setShowProfileMenu(false);
      const supabase = createClient();

      // 1. Terminate Supabase Auth session globally
      try {
        await supabase.auth.signOut({ scope: "global" });
      } catch (e) {
        console.warn("Supabase signOut error:", e);
      }

      // 2. Kill local and session storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("parkzone_admin_session");

        // Remove all Supabase and ParkZone auth keys
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (
            key &&
            (key.startsWith("sb-") ||
              key.includes("supabase") ||
              key.includes("parkzone_admin"))
          ) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        sessionStorage.clear();

        // 3. Clear all session cookies
        document.cookie.split(";").forEach((cookie) => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
          if (name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
          }
        });
      }

      // 4. Reset in-memory user state
      setCurrentUser({
        fullName: "",
        email: "",
        role: "",
        initials: "",
        avatarUrl: null,
      });

      // 5. Force hard redirect to /login to kill in-memory caches
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.warn("Error signing out:", err);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      } else {
        router.push("/login");
      }
    }
  };

  // Fetch real users, citations, and locations from Supabase
  const loadShellData = async () => {
    try {
      const [users, citations, locs] = await Promise.all([
        parkingService.getRecentUsers(5),
        parkingService.getCitations(),
        parkingService.getLocations(),
      ]);

      if (locs && locs.length > 0) {
        setShellLocations(
          locs.slice(0, 4).map((l: any) => ({
            id: l.id,
            name: l.name,
            spots: l.total_spots || 0,
            available: l.available_spots || 0,
          }))
        );
      } else {
        setShellLocations([]);
      }

      const bgs = [
        "from-blue-600 to-indigo-700",
        "from-amber-600 to-orange-700",
        "from-emerald-600 to-teal-700",
        "from-purple-600 to-pink-700",
        "from-rose-600 to-red-700",
      ];

      if (users && users.length > 0) {
        setShellUsers(
          users.map((u: any, i) => {
            const name = u.full_name || u.email || "Driver";
            return {
              id: u.id,
              name: `${name} (${u.role || "driver"})`,
              letter: name.charAt(0).toUpperCase(),
              bg: bgs[i % bgs.length],
              avatarUrl: u.avatar_url || null,
            };
          })
        );
      } else {
        setShellUsers([]);
      }

      if (citations && citations.length > 0) {
        setAlerts(
          citations.slice(0, 4).map((c) => ({
            id: c.id,
            title: `Citation #${c.fine_number} Issued`,
            subtitle: `Plate ${c.vehicle_plate} · ${c.fine_amount?.toLocaleString() || 3000} RWF`,
          }))
        );
      } else {
        setAlerts([]);
      }
    } catch (err) {
      console.warn("Error fetching shell data from DB:", err);
    }
  };

  useEffect(() => {
    // Restore admin's chosen theme (supports light mode on nav header and entire dashboard)
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("parkzone_theme");
      if (savedTheme === "light") {
        document.documentElement.classList.remove("dark");
      } else if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    }

    loadShellData();
    loadCurrentUser();

    const supabase = createClient();
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setCurrentUser({
          fullName: "",
          email: "",
          role: "",
          initials: "",
          avatarUrl: null,
        });
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      } else {
        loadCurrentUser();
      }
    });

    // Subscribe to realtime changes for shell alerts and locations
    const unsubFines = parkingService.subscribeToTable("parking_fines", () => {
      loadShellData();
    });
    const unsubProfiles = parkingService.subscribeToTable("profiles", () => {
      loadShellData();
      loadCurrentUser();
    });
    const unsubLocations = parkingService.subscribeToTable("parking_locations", () => {
      loadShellData();
    });

    return () => {
      authListener?.subscription?.unsubscribe();
      unsubFines();
      unsubProfiles();
      unsubLocations();
    };
  }, []);

  const navLinks = [
    { label: "Dashboard", href: "/admin", icon: <HomeIcon size={16} /> },
    { label: "Parking Stations", href: "/locations", icon: <ProjectsIcon size={16} /> },
    { label: "EV Fast Stations", href: "/ev-stations", icon: <TagsIcon size={16} /> },
    { label: "Vehicles Fleet", href: "/vehicles", icon: <ParkingCarIcon size={16} /> },
    { label: "Users & Drivers", href: "/users", icon: <UsersIcon size={16} /> },
    { label: "Citations & Arrears", href: "/citations", icon: <InboxIcon size={16} /> },
    { label: "Profits & Revenue", href: "/analytics", icon: <ChartsIcon size={16} /> },
    { label: "System Health & Logs", href: "/system", icon: <FileManagerIcon size={16} /> },
  ];

  const appManagementLinks = [
    { label: "Bay Allocations Grid", href: "/locations", icon: <ParkingCarIcon size={16} /> },
    { label: "Irembo 3k Fines Audit", href: "/citations", icon: <InboxIcon size={16} /> },
    { label: "Commuter Cap (2k RWF)", href: "/analytics", icon: <WalletIcon size={16} /> },
  ];

  if (isAuthVerifying) {
    return <AdminShellSkeleton />;
  }

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col bg-[#f5f6fa] dark:bg-[#0c0f14] text-[#2c3038] dark:text-[#e2e8f0] font-sans antialiased selection:bg-neutral-800 selection:text-white">
      {/* ────────────────── TOP NAVIGATION HEADER ────────────────── */}
      <header className="shrink-0 h-16 bg-white dark:bg-[#151921] border-b border-[#e9ecef] dark:border-[#202734] px-4 md:px-6 flex items-center justify-between transition-colors z-40">
        {/* Left: Brand & Select Zone */}
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="flex items-center gap-2">
              <img
                src="/parkzone-logo.png"
                alt="Parkzone"
                className="h-6 w-auto object-contain dark:invert group-hover:opacity-90 transition-opacity"
              />
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-neutral-100 dark:bg-[#181d26] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 whitespace-nowrap">
                ADMIN
              </span>
            </div>
          </Link>

          {/* Select Parking Facility Dropdown */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() =>
                  setSelectedHub(
                    selectedHub === "Kigali Heights Underground"
                      ? "Downtown Car Park - CBD"
                      : "Kigali Heights Underground"
                  )
                }
                className="flex items-center gap-2 text-sm font-medium text-[#495057] dark:text-neutral-300 hover:text-black dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">{selectedHub}</span>
                <ChevronDownIcon size={12} className="text-neutral-400 shrink-0" />
              </button>
            </div>
            {onQuickAdd && (
              <button
                onClick={onQuickAdd}
                title="Add New Resource / Allocation"
                className="w-6 h-6 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-colors shrink-0"
              >
                <PlusIcon size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Center: Search & App Grid */}
        <div className="flex items-center gap-3 flex-1 max-w-xl mx-4">
          <button
            title="App Hub"
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <GridDotsIcon size={18} />
          </button>
          <div className="relative flex-1">
            <SearchIcon
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parking stations, plates, citations..."
              className="w-full bg-[#f8f9fa] dark:bg-[#1a202c] border border-neutral-200 dark:border-neutral-700/80 rounded-lg pl-10 pr-4 py-2 text-xs md:text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors"
            />
          </div>
        </div>

        {/* Right: Quick Icons & Profile */}
        <div className="flex items-center gap-1.5 md:gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
            >
              <BellIcon size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#151921]"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1c222e] rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-700/60">
                  <h4 className="font-semibold text-sm">ParkZone Alerts</h4>
                  <span className="text-[11px] bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full font-medium text-neutral-600 dark:text-neutral-300">
                    {alerts.length} New
                  </span>
                </div>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                  {alerts.length > 0 ? (
                    alerts.map((al) => (
                      <div key={al.id} className="py-2.5">
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">
                          {al.title}
                        </p>
                        <p className="text-neutral-400 text-[11px]">{al.subtitle}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-neutral-400 text-xs">
                      No active alerts in database.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Light / Dark Mode Toggle on Admin Nav Header */}
          <button
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
            className="p-2 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0 flex items-center justify-center cursor-pointer"
          >
            {isDarkMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>

          {/* Landing Page Link */}
          <Link
            href="/"
            title="View Public Landing Page"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-[#181d26] dark:hover:bg-[#202734] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 transition-colors whitespace-nowrap shrink-0"
          >
            <GlobeIcon size={13} />
            <span>Landing Page</span>
          </Link>

          {/* Settings */}
          <button
            title="System Settings"
            className="p-2 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <SettingsIcon size={18} />
          </button>

          {/* Admin Profile */}
          <div className="relative pl-1">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
            >
              {currentUser.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-neutral-300 dark:border-neutral-600 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-300 dark:border-neutral-600 bg-neutral-200 dark:bg-[#1f2736] flex items-center justify-center font-bold text-xs text-neutral-700 dark:text-neutral-200 shrink-0">
                  {currentUser.initials}
                </div>
              )}
              <span className="hidden sm:inline text-xs font-semibold text-neutral-800 dark:text-neutral-200 max-w-[140px] truncate whitespace-nowrap">
                {currentUser.fullName}
              </span>
              <ChevronDownIcon size={10} className="text-neutral-400 shrink-0" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1c222e] rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-700">
                  <p className="font-semibold text-neutral-900 dark:text-white truncate whitespace-nowrap">
                    {currentUser.fullName}
                  </p>
                  <p className="text-neutral-400 text-[11px] truncate whitespace-nowrap">
                    {currentUser.email}
                  </p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 whitespace-nowrap text-neutral-700 dark:text-neutral-300 flex items-center justify-between cursor-pointer"
                >
                  <span>Dashboard Theme</span>
                  <span className="text-[11px] font-semibold text-neutral-500 capitalize flex items-center gap-1.5">
                    {isDarkMode ? <MoonIcon size={13} /> : <SunIcon size={13} />}
                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                  </span>
                </button>
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 mt-1 whitespace-nowrap text-neutral-700 dark:text-neutral-300"
                >
                  Admin Roles & Permissions
                </button>
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 whitespace-nowrap text-neutral-700 dark:text-neutral-300"
                >
                  Tariff Settings (300 RWF / 2k Cap)
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-red-500 font-medium whitespace-nowrap cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ────────────────── SUB-HEADER / BREADCRUMB BAR ────────────────── */}
      <div className="shrink-0 h-12 bg-white/60 dark:bg-[#151921]/60 backdrop-blur-md border-b border-[#e9ecef] dark:border-[#202734] px-4 md:px-6 flex items-center justify-between text-xs transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title="Toggle Sidebar"
            className="p-1.5 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <SidebarToggleIcon size={16} />
          </button>
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 font-medium whitespace-nowrap">
            <Link href="/" className="hover:text-black dark:hover:text-white whitespace-nowrap">
              Home
            </Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-semibold whitespace-nowrap">{breadcrumb}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onQuickAdd && (
            <button
              onClick={onQuickAdd}
              title="Add New Resource"
              className="w-7 h-7 rounded border border-neutral-200 dark:border-neutral-700/80 bg-white dark:bg-[#1a202c] flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:border-neutral-400 transition-colors shadow-xs"
            >
              <PlusIcon size={13} />
            </button>
          )}
          {onFilter && (
            <button
              onClick={onFilter}
              title="Filter"
              className="w-7 h-7 rounded border border-neutral-200 dark:border-neutral-700/80 bg-white dark:bg-[#1a202c] flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:border-neutral-400 transition-colors shadow-xs"
            >
              <FilterIcon size={13} />
            </button>
          )}
          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
              } else {
                document.exitFullscreen();
              }
            }}
            title="Full Screen View"
            className="w-7 h-7 rounded border border-neutral-200 dark:border-neutral-700/80 bg-white dark:bg-[#1a202c] flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:border-neutral-400 transition-colors shadow-xs"
          >
            <MaximizeIcon size={13} />
          </button>
        </div>
      </div>

      {/* ────────────────── MAIN BODY WITH FIXED SIDEBAR ────────────────── */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Sidebar - Fixed height, independently scrollable, never scrolls with page */}
        <aside
          className={`${
            sidebarCollapsed ? "w-16" : "w-60"
          } shrink-0 h-full bg-white dark:bg-[#151921] border-r border-[#e8ecf1] dark:border-[#202734] transition-all duration-200 flex flex-col justify-between py-4 select-none overflow-y-auto`}
        >
          <div className="space-y-6">
            <div>
              {!sidebarCollapsed && (
                <div className="px-5 mb-2 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 tracking-wider uppercase">
                  OPERATIONS
                </div>
              )}
              <nav className="space-y-0.5 px-2">
                {navLinks.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`w-full flex items-center ${
                        sidebarCollapsed ? "justify-center px-0" : "px-3"
                      } py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      {!sidebarCollapsed && <span className="ml-3 whitespace-nowrap">{item.label}</span>}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div>
              {!sidebarCollapsed && (
                <div className="px-5 mb-2 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 tracking-wider uppercase whitespace-nowrap">
                  PARKZONE MANAGEMENT
                </div>
              )}
              <nav className="space-y-0.5 px-2">
                {appManagementLinks.map((item) => {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`w-full flex items-center ${
                        sidebarCollapsed ? "justify-center px-0" : "px-3"
                      } py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 whitespace-nowrap transition-all`}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      {!sidebarCollapsed && <span className="ml-3 whitespace-nowrap">{item.label}</span>}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* Center Main Column - Independent vertical scroll */}
        <main className="flex-1 h-full overflow-y-auto px-4 md:px-6 py-6 space-y-6 min-h-0">
          {children}

          {/* Unified Standard Footer */}
          <footer className="pt-4 pb-2 text-[11px] text-neutral-400 flex items-center justify-between border-t border-neutral-200/60 dark:border-neutral-800">
            <div>
              © 2026 <span className="font-semibold text-neutral-600 dark:text-neutral-300">ParkZone Rwanda</span>, All Rights Reserved.
            </div>
            <div className="flex items-center gap-4">
              <span className="hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer">
                ParkZone Admin v2.4 (Kigali)
              </span>
              <span>·</span>
              <span className="hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer">
                Privacy Policy
              </span>
              <span>·</span>
              <span className="hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer">
                Irembo Integration Docs
              </span>
            </div>
          </footer>
        </main>

        {/* Right Sidebar Panel: Independent vertical scroll */}
        {!hideRightSidebar && (
          <aside className="w-80 shrink-0 h-full bg-white dark:bg-[#151921] border-l border-[#e8ecf1] dark:border-[#202734] hidden xl:flex flex-col py-4 px-5 overflow-y-auto space-y-6">
            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700/80 pb-2 text-xs font-semibold gap-1">
              {(["Today", "Wallet", "Tasks", "Emails"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 relative transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === tab
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  }`}
                >
                  <span className="whitespace-nowrap">{tab}</span>
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-800 dark:bg-white rounded-full"></span>
                  )}
                </button>
              ))}
            </div>

            {/* 1. NEW USERS (REAL DRIVERS) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-neutral-800 dark:text-neutral-200">
                  New Users
                </h4>
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <button className="hover:text-black dark:hover:text-white transition-colors">
                    <ExpandIcon size={12} />
                  </button>
                  <button className="hover:text-black dark:hover:text-white transition-colors">
                    <MoreCircleIcon size={12} />
                  </button>
                </div>
              </div>

              {/* Overlapping Initials Avatars: Real Supabase Drivers */}
              <div className="flex items-center -space-x-2 pt-1">
                {shellUsers.length > 0 ? (
                  shellUsers.map((user) => (
                    <div
                      key={user.id}
                      title={user.name}
                      className={`w-9 h-9 rounded-full bg-gradient-to-tr ${user.bg} border-2 border-white dark:border-[#151921] flex items-center justify-center text-white text-[11px] font-bold shadow-xs hover:scale-110 hover:z-10 transition-transform cursor-pointer overflow-hidden`}
                    >
                      {user.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.letter
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-[11px] text-neutral-400">
                    No commuter profiles in database yet
                  </div>
                )}
              </div>
              <p className="text-[11px] text-neutral-400">
                {shellUsers.length > 0
                  ? `${shellUsers.length} driver profiles synced from DB`
                  : "Registered driver profiles in DB"}
              </p>
            </div>

            {/* 2. ACTIVE PARKING HUBS (REAL DB) */}
            <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-neutral-800 dark:text-neutral-200">
                  Active Hubs
                </h4>
                <Link
                  href="/locations"
                  className="text-[11px] font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  View All
                </Link>
              </div>

              {shellLocations.length > 0 ? (
                <div className="space-y-2">
                  {shellLocations.map((loc) => (
                    <div
                      key={loc.id}
                      className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs"
                    >
                      <div className="truncate pr-2">
                        <p className="font-semibold text-neutral-900 dark:text-white truncate">
                          {loc.name}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          {loc.available} / {loc.spots} bays free
                        </p>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Online" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-neutral-400">No active locations synced</p>
              )}
            </div>

            {/* 3. RECENT CITATIONS & ENFORCEMENT (REAL DB) */}
            <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-neutral-800 dark:text-neutral-200">
                  Recent Citations
                </h4>
                <Link
                  href="/citations"
                  className="text-[11px] font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  View All
                </Link>
              </div>

              {alerts.length > 0 ? (
                <div className="space-y-2">
                  {alerts.map((alt) => (
                    <div
                      key={alt.id}
                      className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 text-xs"
                    >
                      <p className="font-semibold text-neutral-900 dark:text-white">
                        {alt.title}
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        {alt.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-neutral-400">No citations on record</p>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
