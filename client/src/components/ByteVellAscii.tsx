"use client";

import { useEffect, useRef } from "react";

type ByteVellAsciiProps = {
  className?: string;
  density?: number;
  speed?: number;
  mouseInteraction?: boolean;
};

// Characters from empty to dense - using block-like chars for particle look
const CHARS = " ·∙•●";

function hash(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
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
  const grid = useRef({ cols: 220, rows: 22 });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) {
        grid.current = { cols: 90, rows: 14 };
      } else if (w < 1024) {
        grid.current = { cols: 150, rows: 18 };
      } else {
        grid.current = { cols: 220, rows: 22 };
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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

  useEffect(() => {
    let raf: number;
    const slow = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let t = 0;

    const frame = () => {
      if (!preRef.current) { raf = requestAnimationFrame(frame); return; }

      const { cols, rows } = grid.current;
      const mx = smoothMouse.current;
      mx.x += (targetMouse.current.x - mx.x) * 0.05;
      mx.y += (targetMouse.current.y - mx.y) * 0.05;

      t += (slow ? 0.002 : 0.008) * speed;

      const charLen = CHARS.length;
      const lines: string[] = [];

      for (let row = 0; row < rows; row++) {
        let line = "";
        for (let col = 0; col < cols; col++) {
          // Normalized -1..1
          const nx = (col / cols) * 2 - 1;
          const ny = (row / rows) * 2 - 1;

          // Very wide, short ellipse mask
          const ex = nx * 0.7;
          const ey = ny * 3.5;
          const dist = ex * ex + ey * ey;

          if (dist > 1.0) { line += " "; continue; }

          // Soft edge falloff
          const edge = Math.pow(1 - dist, 0.8);

          // Layered flowing noise - horizontal movement dominant
          const f = density;
          let v = 0;
          v += Math.sin(nx * 10 * f + t * 3) * Math.cos(ny * 8 * f - t * 1.5) * 0.4;
          v += Math.cos(nx * 16 * f - t * 2 + ny * 4) * 0.3;
          v += Math.sin((nx * nx + ny * ny) * 12 * f - t * 2.5) * 0.2;
          v += Math.sin(nx * 25 * f + t * 4) * 0.15;

          // Subtle texture grain
          v += (hash(col + t * 10, row + t * 5) - 0.5) * 0.25;

          // Horizontal band structure (like scan lines / data streams)
          v += Math.sin(ny * 40 + t * 2) * 0.12;
          v += Math.cos(nx * 6 + ny * 20 - t * 3) * 0.1;

          // Normalize
          let intensity = (v + 1.2) / 2.4;
          intensity = Math.max(0, Math.min(1, intensity));

          // Mouse boost
          if (mouseInteraction) {
            const dx = nx - mx.x;
            const dy = (ny - mx.y) * 2; // Stretch Y for the wide shape
            const md = Math.sqrt(dx * dx + dy * dy);
            if (md < 0.4) {
              intensity = Math.min(1, intensity + Math.pow(1 - md / 0.4, 2) * 0.5);
            }
          }

          // Apply mask
          intensity *= edge;

          // Character selection
          const ci = Math.floor(intensity * (charLen - 1));
          line += CHARS[Math.max(0, Math.min(charLen - 1, ci))];
        }
        lines.push(line);
      }

      preRef.current.textContent = lines.join("\n");
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [density, speed, mouseInteraction]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <pre
        ref={preRef}
        aria-hidden="true"
        className="font-mono select-none whitespace-pre text-center leading-none"
        style={{
          fontSize: "clamp(3px, 0.45vw, 6px)",
          lineHeight: 1.3,
          letterSpacing: "0.02em",
          backgroundImage:
            "linear-gradient(180deg, rgba(30,58,138,0.3) 0%, rgba(59,130,246,0.7) 30%, rgba(147,197,253,0.9) 50%, rgba(59,130,246,0.7) 70%, rgba(30,58,138,0.3) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
        }}
      />
    </div>
  );
}
