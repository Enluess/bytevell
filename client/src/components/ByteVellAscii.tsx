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

  const gridRef = useRef({ cols: 200, rows: 40 });

  useEffect(() => {
    const updateGrid = () => {
      const w = window.innerWidth;
      if (w < 640) {
        gridRef.current = { cols: 80, rows: 20 };
      } else if (w < 1024) {
        gridRef.current = { cols: 140, rows: 30 };
      } else {
        gridRef.current = { cols: 200, rows: 40 };
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

      time += reduced ? 0.005 : 0.02;
      const t = time * speed;

      const lines: string[] = [];

      for (let y = 0; y < rows; y++) {
        let line = "";
        for (let x = 0; x < cols; x++) {
          const nx = (x / (cols - 1)) * 2 - 1;
          const ny = (y / (rows - 1)) * 2 - 1;
          
          // Wide Oval Mask (AsciiVisual style)
          const distFromCenter = nx * nx + ny * ny;
          
          if (distFromCenter > 1) {
            line += " ";
            continue;
          }

          // Exact mathematical noise functions from the prompt
          let v = 0;
          v += Math.sin(nx * 5 + t * 0.8);
          v += Math.cos(ny * 4 - t * 0.6);
          v += Math.sin((nx - ny) * 6 + t * 1.2);
          v += Math.cos(Math.sqrt(nx * nx + ny * ny) * 8 - t * 2);

          // Normalize sum (-4 to 4) to roughly (0 to 1)
          let intensity = (v + 4) / 8;
          
          // Apply density multiplier
          intensity *= density;

          // Mouse interaction (boosts intensity near cursor)
          if (mouseInteraction) {
            const dx = nx - sm.x;
            const dy = ny - sm.y;
            const mouseDist = Math.sqrt(dx * dx + dy * dy);
            if (mouseDist < 0.6) {
              const boost = Math.pow(1 - mouseDist / 0.6, 2) * 0.5;
              intensity += boost;
            }
          }

          // Soften the edges of the oval so it fades out organically
          const edgeFade = Math.pow(1 - distFromCenter, 0.8);
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
    <div ref={containerRef} className={`relative flex items-center justify-center overflow-hidden w-full ${className}`}>
      <pre
        ref={preRef}
        aria-hidden="true"
        className="font-mono whitespace-pre select-none text-center pointer-events-none"
        style={{
          // Small font size, no massive letter spacing. This naturally creates the dense particle look.
          fontSize: "clamp(6px, 0.8vw, 10px)", 
          lineHeight: 1.1,
          letterSpacing: "0.05em", // NORMAL letter spacing
          // Deep blue gradient matching the screenshot
          backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,1) 0%, rgba(99,102,241,0.9) 30%, rgba(30,58,138,0.5) 70%, rgba(15,23,42,0) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 10px rgba(99,102,241,0.2))",
        }}
      />
    </div>
  );
}
