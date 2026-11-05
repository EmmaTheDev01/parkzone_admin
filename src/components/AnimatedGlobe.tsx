"use client";

import React, { useEffect, useRef, useState } from "react";

export default function AnimatedGlobe({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState(340);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Calibrate globe size based on available width
        if (containerWidth < 340) {
          setSize(Math.max(260, containerWidth - 20));
        } else if (containerWidth < 450) {
          setSize(300);
        } else {
          setSize(360);
        }
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const radius = size * 0.38;
    const centerX = size / 2;
    const centerY = size / 2;

    // Generate points on a sphere (Fibonacci sphere algorithm)
    const numPoints = 620;
    const points: { x: number; y: number; z: number; isKigaliNode?: boolean }[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Mark a couple points as active telemetry sensors near equator (approx Kigali coordinates)
      const isKigaliNode = i === 120 || i === 122 || i === 124 || i === 126;

      points.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        isKigaliNode,
      });
    }

    let rotationAngle = 0;
    let pingRadius = 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      // Draw soft ambient globe atmosphere glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.2,
        centerX,
        centerY,
        radius * 1.25
      );
      glowGrad.addColorStop(0, "rgba(225, 240, 255, 0.45)");
      glowGrad.addColorStop(0.6, "rgba(215, 235, 250, 0.2)");
      glowGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Soft sphere backplate
      const sphereGrad = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      sphereGrad.addColorStop(0, "rgba(248, 250, 253, 0.98)");
      sphereGrad.addColorStop(0.7, "rgba(235, 243, 250, 0.7)");
      sphereGrad.addColorStop(1, "rgba(210, 228, 245, 0.35)");

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Delicate outer rim border
      ctx.strokeStyle = "rgba(180, 205, 230, 0.45)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      rotationAngle += 0.007;
      pingRadius = (pingRadius + 0.3) % 18;

      const cos = Math.cos(rotationAngle);
      const sin = Math.sin(rotationAngle);

      // Project points
      const projected = points.map((p) => {
        const rotX = p.x * cos - p.z * sin;
        const rotZ = p.x * sin + p.z * cos;
        return {
          x: rotX + centerX,
          y: p.y + centerY,
          z: rotZ,
          isKigaliNode: p.isKigaliNode,
        };
      });

      // Sort points so back points render first
      projected.sort((a, b) => a.z - b.z);

      for (const p of projected) {
        const depth = (p.z + radius) / (2 * radius);
        if (p.z < -20) continue;

        const alpha = Math.max(0.08, Math.min(1, depth * depth));
        const pointSize = Math.max(0.7, 1.8 * depth);

        if (p.isKigaliNode && p.z > 20) {
          // Special Kigali telemetry station ping
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, pointSize * 2, 0, Math.PI * 2);
          ctx.fill();

          // Concentric pulse ripple
          ctx.strokeStyle = `rgba(16, 185, 129, ${Math.max(0, 1 - pingRadius / 18)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, pingRadius + 2, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Standard dotted grid node (Popcorn blue/slate dots)
          ctx.fillStyle = `rgba(100, 145, 185, ${alpha * 0.75})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, pointSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [size]);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center w-full max-w-[400px] mx-auto ${className}`}
    >
      {/* Subtle pulse ambient behind */}
      <div
        style={{ width: `${size * 0.85}px`, height: `${size * 0.85}px` }}
        className="absolute rounded-full bg-emerald-100/30 filter blur-2xl pointer-events-none"
      />

      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: `${size}px`, height: `${size}px` }}
        className="select-none transition-all duration-300"
      />

      {/* Floating Kigali Grid Badge in Front Center */}
      <div className="absolute -bottom-2 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-neutral-200/90 shadow-md flex items-center gap-2 text-xs font-bold text-neutral-900 pointer-events-none z-20">
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
