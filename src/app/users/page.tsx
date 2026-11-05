"use client";

import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/AdminShell";
import {
  UsersIcon,
  SearchIcon,
  FilterIcon,
} from "@/components/icons";
import { ImageInputControl } from "@/components/ImageInputControl";
import { TableSkeleton } from "@/components/Skeletons";
import { parkingService, Profile } from "@/lib/services/parkingService";
import { formatCurrency, formatNumberCompact } from "@/lib/utils/format";
import { UserRole } from "@/types/database";

const SQL_MIGRATION_SNIPPET = `-- Run this in Supabase SQL Editor:
-- 1. Grant table privileges and allow reading & updating profiles
GRANT ALL ON public.profiles TO authenticated, anon, service_role;

DROP POLICY IF EXISTS "Allow reading profiles for admin console" ON public.profiles;
CREATE POLICY "Allow reading profiles for admin console"
    ON public.profiles FOR SELECT
    USING (auth.role() IN ('authenticated', 'service_role', 'anon'));

DROP POLICY IF EXISTS "Allow updating profiles for admin console" ON public.profiles;
CREATE POLICY "Allow updating profiles for admin console"
    ON public.profiles FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- 2. Backfill public.profiles for all auth.users
INSERT INTO public.profiles (id, email, phone_number, full_name, role, wallet_balance_rwf, is_active, created_at, updated_at)
SELECT 
    u.id,
    LOWER(NULLIF(TRIM(COALESCE(u.email, '')), '')),
    NULLIF(TRIM(COALESCE(u.phone, u.raw_user_meta_data->>'phone_number', '')), ''),
    NULLIF(TRIM(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', '')), ''),
    COALESCE(u.raw_user_meta_data->>'role', 'driver'),
    0.00,
    true,
    COALESCE(u.created_at, NOW()),
    NOW()
FROM auth.users u
ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    phone_number = COALESCE(EXCLUDED.phone_number, public.profiles.phone_number),
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);

-- 3. Dedicated RPC to fetch auth.users + public.profiles
CREATE OR REPLACE FUNCTION public.get_all_users_admin()
RETURNS TABLE (
    id UUID, email TEXT, phone_number TEXT, full_name TEXT, avatar_url TEXT,
    role TEXT, wallet_balance_rwf NUMERIC, is_active BOOLEAN, created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ, last_sign_in_at TIMESTAMPTZ, provider TEXT
) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(u.id, p.id) AS id,
        COALESCE(p.email, u.email::TEXT) AS email,
        COALESCE(p.phone_number, u.phone::TEXT, (u.raw_user_meta_data->>'phone_number')::TEXT) AS phone_number,
        COALESCE(p.full_name, (u.raw_user_meta_data->>'full_name')::TEXT, (u.raw_user_meta_data->>'name')::TEXT, 'Registered User') AS full_name,
        COALESCE(p.avatar_url, (u.raw_user_meta_data->>'avatar_url')::TEXT, '') AS avatar_url,
        COALESCE(p.role, (u.raw_user_meta_data->>'role')::TEXT, 'driver') AS role,
        COALESCE(p.wallet_balance_rwf, 0.00) AS wallet_balance_rwf,
        COALESCE(p.is_active, true) AS is_active,
        COALESCE(p.created_at, u.created_at, NOW()) AS created_at,
        COALESCE(p.updated_at, u.updated_at, u.created_at, NOW()) AS updated_at,
        u.last_sign_in_at,
        COALESCE(u.raw_app_meta_data->>'provider', 'email')::TEXT AS provider
    FROM auth.users u
    FULL OUTER JOIN public.profiles p ON p.id = u.id
    ORDER BY COALESCE(p.created_at, u.created_at) DESC;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_all_users_admin() TO anon, authenticated, service_role;

-- 4. Storage Buckets for Parking, EV Stations & Driver Avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('parkzone-media', 'parkzone-media', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::TEXT[]),
    ('parking-images', 'parking-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::TEXT[]),
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::TEXT[])
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view parkzone media objects" ON storage.objects;
CREATE POLICY "Public can view parkzone media objects"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('parkzone-media', 'parking-images', 'avatars'));

DROP POLICY IF EXISTS "Anyone or authenticated can upload parkzone media objects" ON storage.objects;
CREATE POLICY "Anyone or authenticated can upload parkzone media objects"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id IN ('parkzone-media', 'parking-images', 'avatars'));`;

export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<"all" | "driver" | "agent" | "operator" | "admin">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive">("all");
  const [metaInfo, setMetaInfo] = useState<{
    hasServiceKey: boolean;
    rpcAvailable: boolean;
    authUsersCount: number;
    profilesCount: number;
  } | null>(null);

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("driver");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editWalletRwf, setEditWalletRwf] = useState(0);
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(null);

  // Real-time flash notice
  const [realtimeNotice, setRealtimeNotice] = useState<string | null>(null);
  const [sqlCopied, setSqlCopied] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // 1. Fetch via API route which unifies auth.users + public.profiles
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json?.users) {
          setUsers(json.users);
          setMetaInfo(json.meta || null);
          setLoading(false);
          return;
        }
      }

      // 2. Direct service fallback
      const data = await parkingService.getUsers();
      setUsers(data);
    } catch (err) {
      console.warn("Failed fetching profiles from DB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Real-time Subscription to profiles
  useEffect(() => {
    const unsub = parkingService.subscribeToTable("profiles", () => {
      setRealtimeNotice("Profiles Synchronized");
      setTimeout(() => setRealtimeNotice(null), 3000);
      loadUsers();
    });
    return () => unsub();
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_MIGRATION_SNIPPET);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2500);
  };

  const handleOpenEditUser = (user: Profile) => {
    setSelectedUser(user);
    setEditFullName(user.full_name || "");
    setEditRole(user.role);
    setEditIsActive(user.is_active);
    setEditWalletRwf(user.wallet_balance_rwf || 0);
    setEditAvatarUrl(user.avatar_url || null);
    setShowEditModal(true);
  };

  const handleSaveUserEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await parkingService.updateUserProfile(selectedUser.id, {
        full_name: editFullName.trim(),
        role: editRole,
        is_active: editIsActive,
        wallet_balance_rwf: Number(editWalletRwf),
        avatar_url: editAvatarUrl,
      });

      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                full_name: editFullName.trim(),
                role: editRole,
                is_active: editIsActive,
                wallet_balance_rwf: Number(editWalletRwf),
                avatar_url: editAvatarUrl,
              }
            : u
        )
      );
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed saving user edits:", err);
    }
  };

  const handleQuickToggleStatus = async (user: Profile) => {
    try {
      const newStatus = !user.is_active;
      await parkingService.updateUserStatus(user.id, newStatus);
      setUsers(users.map((u) => (u.id === user.id ? { ...u, is_active: newStatus } : u)));
    } catch (err) {
      console.error("Failed toggling user status:", err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = u.full_name ? u.full_name.toLowerCase().includes(q) : false;
    const emailMatch = u.email ? u.email.toLowerCase().includes(q) : false;
    const phoneMatch = u.phone_number ? u.phone_number.toLowerCase().includes(q) : false;
    const roleMatch = u.role ? u.role.toLowerCase().includes(q) : false;
    const idMatch = u.id ? u.id.toLowerCase().includes(q) : false;
    const matchesSearch = !q || nameMatch || emailMatch || phoneMatch || roleMatch || idMatch;

    const matchesRole = selectedRole === "all" || u.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && u.is_active) ||
      (selectedStatus === "inactive" && !u.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalCount = users.length;
  const driverCount = users.filter((u) => u.role === "driver").length;
  const agentCount = users.filter((u) => u.role === "agent").length;
  const adminOpCount = users.filter((u) => u.role === "admin" || u.role === "operator").length;
  const totalWalletLiquidity = users.reduce((acc, u) => acc + (u.wallet_balance_rwf || 0), 0);

  return (
    <AdminShell breadcrumb="Users & Auth Accounts Directory">
      <div className="space-y-6">
        {/* Banner with Real-time indicator */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#151921] p-6 rounded-2xl border border-[#e8ecf1] dark:border-[#202734] shadow-xs">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase tracking-wide border border-neutral-200 dark:border-neutral-700">
                Identity & Access Governance
              </span>
              <span className="text-xs text-neutral-400">· Supabase auth.users & public.profiles</span>
              {realtimeNotice && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {realtimeNotice}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-1">
              All Users & Authentication Accounts
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Comprehensive directory across Supabase <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">auth.users</code> and <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">public.profiles</code>.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={loadUsers}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-neutral-700 transition-colors whitespace-nowrap shrink-0"
            >
              ↻ Refresh DB
            </button>
            <button
              onClick={() => setShowSqlModal(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
            >
              SQL Setup Helper
            </button>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 whitespace-nowrap shrink-0">
              {totalCount} Total Accounts
            </span>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-neutral-500">Drivers & Commuters</span>
            <div className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-2">
              {formatNumberCompact(driverCount)}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Mobile app motorists</p>
          </div>

          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-neutral-500">Field Marshals / Agents</span>
            <div className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-2">
              {formatNumberCompact(agentCount)}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Enforcement & handheld scanning</p>
          </div>

          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-neutral-500">Admins & Operators</span>
            <div className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-2">
              {formatNumberCompact(adminOpCount)}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Full console access</p>
          </div>

          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-neutral-500">Total Wallet Liquidity</span>
            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-2">
              {formatCurrency(totalWalletLiquidity)}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Stored driver balances</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#151921] p-4 rounded-2xl border border-[#e8ecf1] dark:border-[#202734]">
          <div className="relative w-full sm:w-80">
            <SearchIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user name, email, phone, role, ID..."
              className="w-full bg-[#f8f9fa] dark:bg-[#181d26] border border-neutral-200 dark:border-neutral-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <div className="flex items-center gap-1 bg-[#f8f9fa] dark:bg-[#181d26] p-1 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs shrink-0">
              {(["all", "driver", "agent", "operator", "admin"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`px-3 py-1 rounded-lg font-bold uppercase text-[10px] transition-all whitespace-nowrap shrink-0 ${
                    selectedRole === r
                      ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs"
                      : "text-neutral-500 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-[#f8f9fa] dark:bg-[#181d26] p-1 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs shrink-0">
              {(["all", "active", "inactive"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-3 py-1 rounded-lg font-bold uppercase text-[10px] transition-all whitespace-nowrap shrink-0 ${
                    selectedStatus === s
                      ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs"
                      : "text-neutral-500 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-[#151921] rounded-2xl border border-[#e8ecf1] dark:border-[#202734] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-300">
              <thead className="bg-[#f8f9fa] dark:bg-[#181d26] border-b border-neutral-200/80 dark:border-neutral-800 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                <tr>
                  <th className="py-3 px-4">User & Origin</th>
                  <th className="py-3 px-4">Contact & Auth</th>
                  <th className="py-3 px-4">Wallet Balance</th>
                  <th className="py-3 px-4">System Role</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Registered / Last Active</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-0">
                      <TableSkeleton rows={6} cols={7} />
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => {
                    const displayName = u.full_name || u.email?.split("@")[0] || "User";
                    const initial = displayName.charAt(0).toUpperCase();

                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                      >
                        {/* User Avatar + Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center font-bold text-xs text-neutral-700 dark:text-neutral-200 shrink-0 border border-neutral-300/80 dark:border-neutral-600">
                              {u.avatar_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={u.avatar_url}
                                  alt={displayName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                initial
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5 whitespace-nowrap">
                                <span>{displayName}</span>
                                {u.source && (
                                  <span
                                    className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                                      u.source === "synced"
                                        ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                        : u.source === "auth_users"
                                        ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700"
                                    }`}
                                  >
                                    {u.source === "auth_users" ? "auth.users" : u.source === "synced" ? "synced" : "profile"}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-neutral-400 font-mono truncate max-w-[200px]" title={u.id}>
                                {u.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-4">
                          <div className="text-neutral-800 dark:text-neutral-200 font-medium">
                            {u.email || "No email"}
                          </div>
                          <div className="text-[10px] text-neutral-400 flex items-center gap-1.5">
                            <span>{u.phone_number || "No phone linked"}</span>
                            {u.provider && (
                              <span className="capitalize text-neutral-500 font-mono text-[9px] bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                                {u.provider}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Wallet Balance */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-neutral-900 dark:text-white">
                            {formatCurrency(u.wallet_balance_rwf || 0)}
                          </span>
                        </td>

                        {/* System Role */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                              u.role === "admin"
                                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-800"
                                : u.role === "operator"
                                ? "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                                : u.role === "agent"
                                ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
                            }`}
                          >
                            {u.role || "driver"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.is_active
                                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                                : "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                u.is_active ? "bg-emerald-500" : "bg-red-500"
                              }`}
                            />
                            {u.is_active ? "Active" : "Suspended"}
                          </span>
                        </td>

                        {/* Registered Date & Last Active */}
                        <td className="py-3.5 px-4 text-neutral-400 text-[11px]">
                          <div>
                            {u.created_at
                              ? new Date(u.created_at).toLocaleDateString("en-RW", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "—"}
                          </div>
                          {u.last_sign_in_at && (
                            <div className="text-[10px] text-neutral-500">
                              Active: {new Date(u.last_sign_in_at).toLocaleDateString("en-RW", { month: "short", day: "numeric" })}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleQuickToggleStatus(u)}
                              className="px-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white whitespace-nowrap shrink-0"
                            >
                              {u.is_active ? "Suspend" : "Activate"}
                            </button>
                            <button
                              onClick={() => handleOpenEditUser(u)}
                              className="px-2.5 py-1 rounded-lg bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-[10px] font-semibold transition-colors whitespace-nowrap shrink-0"
                            >
                              Edit Profile
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 px-6 text-center text-xs">
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 flex items-center justify-center mx-auto">
                          <UsersIcon size={24} />
                        </div>
                        <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                          No Users Synced Yet
                        </h3>
                        <p className="text-neutral-500 text-[11px] leading-relaxed">
                          In Supabase, user accounts registered via Auth reside in the internal <code className="text-neutral-700 dark:text-neutral-300 font-mono">auth.users</code> table.
                          To list them in the admin console, run the 1-click SQL migration function or set your <code className="text-neutral-700 dark:text-neutral-300 font-mono">SUPABASE_SERVICE_ROLE_KEY</code>.
                        </p>
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <button
                            onClick={() => setShowSqlModal(true)}
                            className="px-3.5 py-2 rounded-xl bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold text-xs transition-colors whitespace-nowrap"
                          >
                            Open SQL Setup Script
                          </button>
                          <button
                            onClick={loadUsers}
                            className="px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 font-semibold text-xs text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white whitespace-nowrap"
                          >
                            Refresh Database
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ────────────────── MODAL: SQL SETUP HELPER ────────────────── */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
                  Supabase Auth & Profiles Direct Connect
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Fetch all users directly from Supabase <code className="font-mono">auth.users</code> and <code className="font-mono">public.profiles</code>.
                </p>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-600 dark:text-neutral-300">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-300">
                <span className="font-bold block mb-1">Option 1: Run SQL in Supabase SQL Editor (Recommended)</span>
                Paste this script into your Supabase Dashboard SQL Editor. It creates a <code className="font-mono font-bold">SECURITY DEFINER</code> function that joins <code className="font-mono">auth.users</code> with <code className="font-mono">public.profiles</code> securely:
              </div>

              <div className="relative">
                <pre className="p-3 rounded-xl bg-neutral-900 text-neutral-100 font-mono text-[10px] overflow-x-auto max-h-52">
                  {SQL_MIGRATION_SNIPPET}
                </pre>
                <button
                  onClick={handleCopySql}
                  className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-[10px] backdrop-blur-xs transition-all"
                >
                  {sqlCopied ? "✓ Copied to Clipboard" : "Copy SQL Script"}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60">
                <span className="font-bold block mb-1">Option 2: Add Service Role Key to .env.local</span>
                In your Supabase Dashboard &rarr; Project Settings &rarr; API &rarr; copy <code className="font-mono font-bold">service_role secret</code> and add:
                <div className="mt-1 font-mono text-[11px] text-neutral-800 dark:text-neutral-200 bg-neutral-200/50 dark:bg-neutral-900/60 p-1.5 rounded">
                  SUPABASE_SERVICE_ROLE_KEY=ey...
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-[11px] text-neutral-400">
                Saved in file: <code className="font-mono">supabase/migrations/20261104_get_all_users_admin.sql</code>
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowSqlModal(false);
                  loadUsers();
                }}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90"
              >
                Done / Refresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── MODAL: USER ADMIN CONTROL ────────────────── */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
                  User Governance · {selectedUser.full_name || selectedUser.email || "Account"}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Update profile avatar, role authorization, account suspension, and wallet balance.
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUserEdits} className="space-y-3.5 text-xs">
              {/* User Avatar Upload Control */}
              <ImageInputControl
                label="Profile Picture / Driver Avatar"
                value={editAvatarUrl}
                onChange={setEditAvatarUrl}
                folder="avatars"
                bucket="avatars"
                helperText="Upload profile photo to the avatars bucket or pick from presets"
                presets={[
                  {
                    label: "Driver Professional",
                    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
                    category: "Profile",
                  },
                  {
                    label: "Executive Commuter",
                    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
                    category: "Executive",
                  },
                  {
                    label: "Fleet Marshal",
                    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
                    category: "Operator",
                  },
                ]}
              />

              <div>
                <label className="block font-semibold mb-1">User Full Name</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="e.g. Kais Alkaisy"
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none font-semibold text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">System Role Authorization</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none capitalize font-semibold"
                >
                  <option value="driver">Driver / Commuter</option>
                  <option value="agent">Parking Marshal / Field Agent</option>
                  <option value="operator">System Operator</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Account Access Status</label>
                <select
                  value={editIsActive ? "true" : "false"}
                  onChange={(e) => setEditIsActive(e.target.value === "true")}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="true">Active Operational</option>
                  <option value="false">Suspended / Deactivated</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Adjust Wallet Balance (RWF)</label>
                <input
                  type="number"
                  value={editWalletRwf}
                  onChange={(e) => setEditWalletRwf(Number(e.target.value))}
                  className="w-full bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs focus:outline-none font-bold"
                />
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {[1000, 5000, 10000, 20000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setEditWalletRwf((prev) => prev + amt)}
                      className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white whitespace-nowrap shrink-0"
                    >
                      +{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs font-semibold whitespace-nowrap shrink-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold text-xs whitespace-nowrap shrink-0"
                >
                  Save User Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
