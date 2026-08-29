"use client";

import { useEffect, useRef } from "react";

type ByteVellAsciiProps = {
  className?: string;
  density?: number;
  speed?: number;
  mouseInteraction?: boolean;
};

// Characters ordered by visual density
const CHARS = [
  " ", " ", " ", "\u00B7", ".", ":", "-", "=",
  "+", "*", "x", "%", "&", "#", "@",
];
const CHAR_LEN = CHARS.length;

// Grid sizes
const GRID_DESKTOP = { cols: 220, rows: 32 };
const GRID_TABLET  = { cols: 140, rows: 24 };
const GRID_MOBILE  = { cols: 70,  rows: 16 };

const MOUSE_LERP = 0.08;

// ─── Wide horizontal band mask ─────────────────────────────
function bandMask(nx: number, ny: number): number {
  // nx: -1..1, ny: -1..1
  // Very wide, short horizontal band
  const absX = Math.abs(nx);
  const absY = Math.abs(ny);

  // Horizontal: gentle fade starting at 70% width
  const hFade = absX < 0.7 ? 1 : Math.max(0, 1 - (absX - 0.7) / 0.3);

  // Vertical: tight band, strong fade
  const vFade = absY < 0.4 ? 1 : Math.max(0, 1 - (absY - 0.4) / 0.6);

  // Combine with smooth curve
  return Math.pow(hFade, 1.5) * Math.pow(vFade, 2);
}

export function ByteVellAscii({
  className = "",
  density = 1,
  speed = 1,
  mouseInteraction = true,
}: ByteVellAsciiProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const targetMouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });
  const gridRef = useRef(GRID_DESKTOP);

  // Responsive
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) gridRef.current = GRID_MOBILE;
      else if (w < 1024) gridRef.current = GRID_TABLET;
      else gridRef.current = GRID_DESKTOP;
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Mouse tracking
  useEffect(() => {
    if (!mouseInteraction) return;
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      targetMouse.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      targetMouse.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onLeave = () => {
      targetMouse.current.x = 0;
      targetMouse.current.y = 0;
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseInteraction]);

  // Animation
  useEffect(() => {
    let raf: number;
    const reduced = typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let time = 0;

    const render = () => {
      if (!preRef.current) { raf = requestAnimationFrame(render); return; }

      const { cols, rows } = gridRef.current;
      const sm = smoothMouse.current;
      const tm = targetMouse.current;
      sm.x += (tm.x - sm.x) * MOUSE_LERP;
      sm.y += (tm.y - sm.y) * MOUSE_LERP;

      time += reduced ? 0.003 : 0.014;
      const t = time * speed;
      const f = density;

      const lines: string[] = [];

      for (let row = 0; row < rows; row++) {
        let line = "";
        for (let col = 0; col < cols; col++) {
          const nx = (col / (cols - 1)) * 2 - 1;
          const ny = (row / (rows - 1)) * 2 - 1;

          // Band mask
          const mask = bandMask(nx, ny);
          if (mask < 0.01) { line += " "; continue; }

          // ── Layered noise ──

          // Horizontal flowing waves
          let v = 0;
          v += Math.sin(nx * 8 * f + t * 1.2) * Math.cos(ny * 6 * f - t * 0.7) * 0.5;
          v += Math.sin((nx + ny * 0.5) * 12 * f - t * 1.8) * 0.35;
          v += Math.cos(nx * 20 * f + t * 2.5) * Math.sin(ny * 15 * f - t * 1.0) * 0.2;

          // Radial pulse from center
          const r = Math.sqrt(nx * nx + ny * ny);
          v += Math.cos(r * 10 * f - t * 2) * 0.25;

          // Horizontal scan-line bands (data stream feel)
          v += Math.sin(ny * 30 + nx * 2 + t * 1.5) * 0.2;
          v += Math.cos(ny * 50 - t * 3) * 0.1;

          // Fine detail texture
          v += Math.sin(nx * 35 * f + ny * 25 * f + t * 0.8) * 0.12;

          // Normalize to 0..1
          let intensity = (v + 1.7) / 3.4;
          intensity = Math.max(0, Math.min(1, intensity));

          // Mouse interaction
          if (mouseInteraction) {
            const dx = nx - sm.x;
            const dy = (ny - sm.y) * 2; // stretch Y because band is short
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.5) {
              const ripple = Math.pow(1 - dist / 0.5, 2);
              intensity = Math.min(1, intensity + ripple * 0.5);
              intensity += Math.sin(dist * 25 - t * 8) * ripple * 0.1;
              intensity = Math.max(0, Math.min(1, intensity));
            }
          }

          // Apply mask
          intensity *= mask;

          // Character selection
          const ci = Math.floor(intensity * (CHAR_LEN - 1));
          line += CHARS[Math.max(0, Math.min(CHAR_LEN - 1, ci))];
        }
        lines.push(line);
      }

      preRef.current.textContent = lines.join("\n");
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [density, speed, mouseInteraction]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <pre
        ref={preRef}
        aria-hidden="true"
        className="font-mono select-none whitespace-pre text-center leading-none"
        style={{
          fontSize: "clamp(4px, 0.5vw, 7px)",
          lineHeight: 1.2,
          letterSpacing: "0.01em",
          backgroundImage:
            "linear-gradient(180deg, rgba(15,23,42,0.3) 0%, rgba(30,58,138,0.6) 20%, rgba(59,130,246,0.8) 45%, rgba(147,197,253,0.95) 50%, rgba(59,130,246,0.8) 55%, rgba(30,58,138,0.6) 80%, rgba(15,23,42,0.3) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 12px rgba(59, 130, 246, 0.1))",
        }}
      />
    </div>
  );
}
