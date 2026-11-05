"use client";

import React from "react";

/**
 * Base Theme-Compatible Skeleton Element
 * Smooth pulse animation matching light and dark modes
 */
export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`bg-neutral-200/70 dark:bg-neutral-800/70 animate-pulse rounded-lg ${className}`}
    />
  );
}

/**
 * Skeleton for Top KPI Metrics Cards
 */
export function MetricsRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-${count} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-white dark:bg-[#151921] border border-[#e8ecf1] dark:border-[#202734] shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-6 rounded-lg" />
          </div>
          <Skeleton className="h-7 w-28" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-2.5 w-12" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for Parking Locations List (Left column in Locations page)
 */
export function LocationListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-white dark:bg-[#151921] border border-[#e8ecf1] dark:border-[#202734] shadow-xs space-y-3"
        >
          {/* Cover image skeleton */}
          <Skeleton className="w-full h-28 rounded-xl" />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
            <Skeleton className="h-3 w-48" />
          </div>
          {/* Progress bar skeleton */}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for Interactive Bay Grid (Right column in Locations page)
 */
export function BayGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-3.5 rounded-2xl bg-[#f8f9fa] dark:bg-[#181d26]/80 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between h-36 shadow-xs"
        >
          {/* Top header */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-12" />
            <Skeleton className="h-3.5 w-14 rounded-md" />
          </div>
          {/* Middle status indicator */}
          <div className="my-auto flex flex-col items-center gap-1.5 py-1">
            <Skeleton className="h-2.5 w-16 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
          {/* Bottom row */}
          <div className="pt-2 border-t border-neutral-200/40 dark:border-neutral-800/60 flex items-center justify-between">
            <Skeleton className="h-2.5 w-10" />
            <Skeleton className="h-4 w-12 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for Tables (Users, Citations, Charging Sessions)
 */
export function TableSkeleton({
  rows = 5,
  cols = 6,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="p-4 flex items-center justify-between gap-4 animate-pulse"
        >
          {/* First column with circular avatar and text */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-2.5 w-36" />
            </div>
          </div>

          {/* Middle columns */}
          {Array.from({ length: cols - 2 }).map((_, c) => (
            <div key={c} className="hidden sm:block flex-1">
              <Skeleton className={`h-3 ${c % 2 === 0 ? "w-20" : "w-16"}`} />
            </div>
          ))}

          {/* Action column */}
          <div className="flex items-center gap-2 shrink-0">
            <Skeleton className="h-6 w-14 rounded-lg" />
            <Skeleton className="h-6 w-6 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for EV Fast Charger Telemetry Cards
 */
export function ChargerCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-[#e8ecf1] dark:border-[#202734] shadow-xs space-y-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          {/* Image skeleton */}
          <Skeleton className="w-full h-36 rounded-xl" />

          {/* Telemetry specs grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-[#181d26] border border-neutral-100 dark:border-neutral-800 space-y-1">
              <Skeleton className="h-2.5 w-14" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-[#181d26] border border-neutral-100 dark:border-neutral-800 space-y-1">
              <Skeleton className="h-2.5 w-14" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-24 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Full Page Shell Skeleton for Admin Dashboard initial load
 */
export function AdminShellSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f6fa] dark:bg-[#0c0f14] text-[#2c3038] dark:text-[#e2e8f0] font-sans antialiased">
      {/* Top Header Skeleton */}
      <header className="sticky top-0 z-40 h-16 bg-white dark:bg-[#151921] border-b border-[#e9ecef] dark:border-[#202734] px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>
          <Skeleton className="hidden lg:block h-7 w-44 rounded-lg" />
        </div>

        <div className="hidden sm:flex items-center gap-3 flex-1 max-w-xl mx-6">
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="flex items-center gap-2 pl-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="hidden sm:block h-3.5 w-20" />
          </div>
        </div>
      </header>

      {/* Subheader Breadcrumb Skeleton */}
      <div className="h-12 bg-white/60 dark:bg-[#151921]/60 backdrop-blur-md border-b border-[#e9ecef] dark:border-[#202734] px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-3 w-12" />
          <span className="text-neutral-300 dark:text-neutral-700">/</span>
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-3 w-28" />
      </div>

      {/* Main Skeleton Layout */}
      <div className="flex-1 flex max-w-[1920px] w-full mx-auto">
        {/* Sidebar Skeleton */}
        <aside className="w-60 shrink-0 border-r border-[#e9ecef] dark:border-[#202734] bg-white dark:bg-[#151921] p-4 hidden md:block space-y-4">
          <div className="space-y-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-3.5 w-28" />
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
            <Skeleton className="h-2.5 w-20" />
            <div className="space-y-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2">
                  <Skeleton className="w-3.5 h-3.5 rounded" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Skeleton */}
        <main className="flex-1 p-6 space-y-6 overflow-hidden">
          {/* Header Title Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-3.5 w-96 max-w-full" />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white dark:bg-[#151921] border border-[#e8ecf1] dark:border-[#202734] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-5 rounded" />
                </div>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-2.5 w-32" />
              </div>
            ))}
          </div>

          {/* Main Table / Grid Container */}
          <div className="rounded-2xl bg-white dark:bg-[#151921] border border-[#e8ecf1] dark:border-[#202734] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-7 w-24 rounded-lg" />
            </div>
            <TableSkeleton rows={5} cols={5} />
          </div>
        </main>
      </div>
    </div>
  );
}
