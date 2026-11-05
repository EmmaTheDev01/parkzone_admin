"use client";

import React, { useEffect, useRef } from "react";
import landDots from "./globe-land-dots.json";

/**
 * Popcorn-style dotted globe.
 * A pale frosted sphere with dotted continents (orthographic projection),
 * gently swaying around Africa so the Kigali beacon stays in view.
 */
const KIGALI: [number, number] = [30.06, -1.95];
const DEG = Math.PI / 180;

export default function AnimatedGlobe({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dots = landDots as [number, number][];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let size = 0;
    let raf = 0;
    let visible = true;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = wrap.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (lon: number, lat: number, lon0: number, lat0: number, r: number, c: number) => {
      const l = (lon - lon0) * DEG;
      const p = lat * DEG;
      const p0 = lat0 * DEG;
      const cosP = Math.cos(p);
      const x = cosP * Math.sin(l);
      const y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * cosP * Math.cos(l);
      const z = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * cosP * Math.cos(l);
      return { x: c + x * r, y: c - y * r, z };
    };

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      const c = size / 2;
      const r = size * 0.46;
      const lon0 = reduce ? 5 : 5 + Math.sin(t * 0.18) * 28;
      const lat0 = 12;

      ctx.clearRect(0, 0, size, size);

      // Sphere body: frosted pale blue
      const body = ctx.createRadialGradient(c - r * 0.35, c - r * 0.4, r * 0.1, c, c, r);
      body.addColorStop(0, "rgba(255,255,255,1)");
      body.addColorStop(0.55, "rgba(240,246,253,1)");
      body.addColorStop(0.9, "rgba(222,234,250,1)");
      body.addColorStop(1, "rgba(212,228,248,1)");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(c, c, r, 0, Math.PI * 2);
      ctx.fill();

      // Dotted continents
      const base = Math.max(1, size / 260);
      for (let i = 0; i < dots.length; i++) {
        const [lon, lat] = dots[i];
        const p = project(lon, lat, lon0, lat0, r, c);
        if (p.z <= 0.02) continue;
        const a = 0.18 + p.z * 0.5;
        ctx.fillStyle = `rgba(140,165,205,${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, base * (0.55 + p.z * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }

      // Rim light
      const rim = ctx.createRadialGradient(c, c, r * 0.82, c, c, r);
      rim.addColorStop(0, "rgba(255,255,255,0)");
      rim.addColorStop(1, "rgba(255,255,255,0.65)");
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(c, c, r, 0, Math.PI * 2);
      ctx.fill();

      // Kigali beacon
      const k = project(KIGALI[0], KIGALI[1], lon0, lat0, r, c);
      if (k.z > 0.05) {
        const phase = reduce ? 0.5 : (t % 2.2) / 2.2;
        ctx.strokeStyle = `rgba(16,185,129,${0.55 * (1 - phase)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(k.x, k.y, 6 + phase * size * 0.07, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(16,185,129,0.18)";
        ctx.beginPath();
        ctx.arc(k.x, k.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(k.x, k.y, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#10B981";
        ctx.beginPath();
        ctx.arc(k.x, k.y, 3.8, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(performance.now());
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was && !reduce) raf = requestAnimationFrame(draw);
    });
    io.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div className={`relative flex flex-col items-center select-none w-full ${className}`}>
      <div
        ref={wrapRef}
        className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-square drop-shadow-[0_30px_60px_rgba(120,150,200,0.18)]"
      >
        <canvas ref={canvasRef} aria-label="ParkZone coverage globe centered on Kigali" role="img" />
      </div>

      <div className="relative -mt-5 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.08)] flex items-center gap-2 text-xs text-neutral-900 pointer-events-none z-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/picon.png" alt="" className="w-4 h-4 rounded-full object-contain" />
        <span className="font-semibold tracking-tight">ParkZone</span>
        <span className="text-neutral-300">·</span>
        <span className="text-emerald-600 flex items-center gap-1.5 font-medium text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Kigali Grid Live
        </span>
      </div>
    </div>
  );
}
