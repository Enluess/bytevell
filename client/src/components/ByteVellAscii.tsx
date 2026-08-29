"use client";

import { useEffect, useRef } from "react";

// ─── TYPES ────────────────────────────────────────────────────
type ByteVellAsciiProps = {
  className?: string;
  density?: number;
  speed?: number;
  mouseInteraction?: boolean;
};

// ─── CONSTANTS ────────────────────────────────────────────────
const CHARS = [
  " ", " ", "\u00B7", ".", ":", "-", "=",
  "+", "*", "x", "%", "&", "#", "@",
];
const CHAR_COUNT = CHARS.length;

// Grid sizes per breakpoint
const GRID_DESKTOP = { cols: 90, rows: 44 };
const GRID_TABLET = { cols: 65, rows: 32 };
const GRID_MOBILE = { cols: 40, rows: 22 };

// Mouse interpolation factor
const MOUSE_LERP = 0.08;

// ─── SHAPE FUNCTION (Nodesty-style shield) ────────────────────
function isInsideShield(nx: number, ny: number): boolean {
  // nx: -1..1 (horizontal), ny: -1..1 (vertical)
  const bottom = -1 + 0.5 * nx * nx;
  const top = 1 - 1.5 * Math.pow(Math.abs(nx), 1.8);
  return ny >= bottom && ny <= top;
}

// Shield edge distance for soft falloff
function shieldEdgeFactor(nx: number, ny: number): number {
  const bottom = -1 + 0.5 * nx * nx;
  const top = 1 - 1.5 * Math.pow(Math.abs(nx), 1.8);
  const range = top - bottom;
  if (range <= 0) return 0;

  // Distance from nearest edge, normalized
  const distFromBottom = (ny - bottom) / range;
  const distFromTop = (top - ny) / range;
  const edgeDist = Math.min(distFromBottom, distFromTop);

  // Also fade at horizontal edges
  const horizFade = 1 - Math.pow(Math.abs(nx), 2.5);

  return Math.max(0, Math.min(1, edgeDist * 4)) * horizFade;
}

// ─── COMPONENT ────────────────────────────────────────────────
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

  // ─── Responsive grid sizing ─────────────────────────────────
  useEffect(() => {
    const updateGrid = () => {
      const w = window.innerWidth;
      if (w < 640) gridRef.current = GRID_MOBILE;
      else if (w < 1024) gridRef.current = GRID_TABLET;
      else gridRef.current = GRID_DESKTOP;
    };
    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, []);

  // ─── Mouse tracking ────────────────────────────────────────
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

  // ─── Animation loop ────────────────────────────────────────
  useEffect(() => {
    let raf: number;
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let time = 0;

    const render = () => {
      if (!preRef.current) {
        raf = requestAnimationFrame(render);
        return;
      }

      const { cols, rows } = gridRef.current;

      // Smooth mouse interpolation
      const sm = smoothMouse.current;
      const tm = targetMouse.current;
      sm.x += (tm.x - sm.x) * MOUSE_LERP;
      sm.y += (tm.y - sm.y) * MOUSE_LERP;

      // Advance time
      time += reducedMotion ? 0.002 : 0.016;
      const t = time * speed;

      const lines: string[] = [];

      for (let row = 0; row < rows; row++) {
        let line = "";
        for (let col = 0; col < cols; col++) {
          // Normalize to -1..1
          const nx = (col / (cols - 1)) * 2 - 1;
          const ny = (row / (rows - 1)) * 2 - 1;

          // Check if inside shield shape
          if (!isInsideShield(nx, ny)) {
            line += " ";
            continue;
          }

          // Edge softness factor
          const edge = shieldEdgeFactor(nx, ny);

          // ── Layered noise (organic flowing energy) ──
          const f = density;
          let noise = 0;

          // Primary horizontal waves
          noise += Math.sin(nx * 5 * f + t * 0.8) * Math.cos(ny * 4 * f - t * 0.6);

          // Diagonal flow
          noise += Math.sin((nx - ny) * 6 * f + t * 1.2) * 0.7;

          // Radial pulse
          const r = Math.sqrt(nx * nx + ny * ny);
          noise += Math.cos(r * 8 * f - t * 2) * 0.5;

          // Secondary high-frequency detail
          noise += Math.sin(nx * 12 * f + t * 1.5) * Math.cos(ny * 10 * f - t * 0.9) * 0.3;

          // Subtle vertical bands
          noise += Math.sin(ny * 15 * f + t * 0.4) * 0.2;

          // Normalize noise to 0..1
          let intensity = (noise + 2.7) / 5.4;
          intensity = Math.max(0, Math.min(1, intensity));

          // ── Mouse interaction ──
          if (mouseInteraction) {
            const dx = nx - sm.x;
            const dy = ny - sm.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.6) {
              const ripple = Math.pow(1 - dist / 0.6, 2);
              // Add energy near mouse
              intensity = Math.min(1, intensity + ripple * 0.5);
              // Add extra noise distortion near mouse
              intensity += Math.sin(dist * 20 - t * 8) * ripple * 0.15;
              intensity = Math.max(0, Math.min(1, intensity));
            }
          }

          // Apply edge mask
          intensity *= edge;

          // Map to character
          const ci = Math.floor(intensity * (CHAR_COUNT - 1));
          line += CHARS[Math.max(0, Math.min(CHAR_COUNT - 1, ci))];
        }
        lines.push(line);
      }

      preRef.current.textContent = lines.join("\n");
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [density, speed, mouseInteraction]);

  // ─── RENDER ─────────────────────────────────────────────────
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <pre
        ref={preRef}
        aria-hidden="true"
        className="font-mono select-none whitespace-pre text-center leading-none pointer-events-none"
        style={{
          fontSize: "clamp(8px, 1.1vw, 14px)",
          lineHeight: 1.05,
          letterSpacing: "0.04em",
          backgroundImage:
            "linear-gradient(135deg, #7c3aed 0%, #a855f7 25%, #d946ef 50%, #f0abfc 75%, #ffffff 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 8px rgba(168, 85, 247, 0.15))",
        }}
      />
    </div>
  );
}
