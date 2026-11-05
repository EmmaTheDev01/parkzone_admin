"use client";

import React from "react";

export default function AnimatedGlobe({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex flex-col items-center justify-center select-none w-full ${className}`}>
      {/* Soft ambient back glow */}
      <div className="absolute inset-0 rounded-full bg-emerald-100/30 filter blur-3xl pointer-events-none -z-10" />

      {/* Popcorn.space exact coverage globe graphic */}
      <div className="relative w-full max-w-[360px] sm:max-w-[420px] md:max-w-[460px] aspect-square flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/coverage-globe.webp"
          alt="ParkZone Citywide Municipal Coverage"
          className="w-full h-auto object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.06)]"
        />

        {/* Live Kigali Telemetry Beacon Ping */}
        <div
          className="absolute pointer-events-none flex items-center justify-center"
          style={{ top: "54%", left: "55%" }}
        >
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white shadow-xs" />
          </span>
        </div>
      </div>

      {/* Floating live status pill badge */}
      <div className="relative -mt-6 sm:-mt-8 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-neutral-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center gap-2 text-xs font-bold text-neutral-900 pointer-events-none z-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/picon.png" alt="ParkZone" className="w-4 h-4 rounded-full object-contain" />
        <span className="font-extrabold tracking-tight">ParkZone</span>
        <span className="text-neutral-300">·</span>
        <span className="text-emerald-600 flex items-center gap-1.5 font-semibold text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Kigali Grid Live
        </span>
      </div>
    </div>
  );
}
