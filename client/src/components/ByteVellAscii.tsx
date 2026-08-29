"use client";

import { useEffect, useRef } from "react";

const CHARS = [" ", " ", "·", ".", ":", "-", "=", "+", "*", "x", "%", "&", "#", "@"];
const CHAR_LEN = CHARS.length;

type ByteVellAsciiProps = {
  className?: string;
  density?: number;
  speed?: number;
  mouseInteraction?: boolean;
};

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

  // Wide, dense grid
  const gridRef = useRef({ cols: 250, rows: 44 });

  useEffect(() => {
    const updateGrid = () => {
      const w = window.innerWidth;
      if (w < 640) {
        gridRef.current = { cols: 100, rows: 24 };
      } else if (w < 1024) {
        gridRef.current = { cols: 180, rows: 36 };
      } else {
        gridRef.current = { cols: 250, rows: 44 };
      }
    };
    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
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
    let time = 0;
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = () => {
      if (!preRef.current) {
        raf = requestAnimationFrame(render);
        return;
      }

      const { cols, rows } = gridRef.current;
      const sm = smoothMouse.current;
      const tm = targetMouse.current;
      
      sm.x += (tm.x - sm.x) * 0.08;
      sm.y += (tm.y - sm.y) * 0.08;

      time += reduced ? 0.005 : 0.015;
      const t = time * speed;

      const lines: string[] = [];

      for (let y = 0; y < rows; y++) {
        let line = "";
        for (let x = 0; x < cols; x++) {
          const nx = (x / (cols - 1)) * 2 - 1;
          const ny = (y / (rows - 1)) * 2 - 1;
          
          // Smooth wide oval mask
          // Since cols=250 and rows=44, nx*nx + ny*ny automatically creates a VERY wide physical oval.
          const distFromCenter = nx * nx + ny * ny;
          if (distFromCenter > 1) {
            line += " ";
            continue;
          }

          // Exact mathematical noise for HORIZONTAL DATA STREAMS (like Nodesty AsciiVisual)
          let v = 0;
          
          // 1. High frequency horizontal lines (scanlines)
          v += Math.sin(ny * 40 + t * 2) * 0.3;
          v += Math.cos(ny * 70 - t * 3) * 0.2;
          
          // 2. Slow horizontal waves
          v += Math.sin(nx * 3 + ny * 5 + t * 0.8) * 0.4;
          
          // 3. Central bright core
          v += Math.cos(Math.sqrt(nx * nx + ny * ny) * 5 - t) * 0.3;

          // Normalize
          let intensity = (v + 1.2) / 2.4;
          
          intensity *= density;

          // Mouse interaction (pushes/ripples the scanlines)
          if (mouseInteraction) {
            const dx = nx - sm.x;
            const dy = ny - sm.y;
            // Stretch the mouse interaction horizontally to match the grid aspect ratio
            const mouseDist = Math.sqrt(dx * dx + dy * dy * 4); 
            if (mouseDist < 0.6) {
              const boost = Math.pow(1 - mouseDist / 0.6, 2) * 0.6;
              intensity += boost;
            }
          }

          // Edge fade (softens the oval boundary)
          const edgeFade = Math.pow(1 - distFromCenter, 1.2);
          intensity *= edgeFade;

          intensity = Math.max(0, Math.min(1, intensity));

          const ci = Math.floor(intensity * (CHAR_LEN - 1));
          line += CHARS[ci];
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
    <div ref={containerRef} className={`relative flex justify-center w-full ${className}`}>
      <pre
        ref={preRef}
        aria-hidden="true"
        className="font-mono whitespace-pre select-none text-center pointer-events-none"
        style={{
          // Very small font, normal letter spacing -> dense particle field
          fontSize: "clamp(6px, 0.75vw, 10px)", 
          lineHeight: 1.1,
          letterSpacing: "0.03em",
          
          // Deep space blue gradient matching the Nodesty screenshot
          backgroundImage: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(224,231,255,1) 0%, rgba(99,102,241,0.9) 25%, rgba(30,58,138,0.7) 60%, rgba(15,23,42,0) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 15px rgba(99,102,241,0.15))",
        }}
      />
    </div>
  );
}
