
"use client";

import React, { useEffect, useRef } from "react";

type ByteVellAsciiProps = {
  className?: string;
  density?: number;
  speed?: number;
  mouseInteraction?: boolean;
};

// Subtle characters, mostly spaces, dots, and pluses. No blocky characters.
const CHAR_SET = "      ....::::---===+++xxx";
const CHAR_MAP = CHAR_SET.split("");

export function ByteVellAscii({
  className = "",
  density = 1,
  speed = 1,
  mouseInteraction = true,
}: ByteVellAsciiProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  const cols = useRef(150);
  const rows = useRef(32);

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        cols.current = 60;
        rows.current = 24;
      } else if (w < 1024) {
        cols.current = 100;
        rows.current = 28;
      } else {
        cols.current = 160;
        rows.current = 32;
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let time = 0;
    
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastRenderTime = 0;

    const render = (currentTime: number) => {
      if (!preRef.current) return;

      if (prefersReducedMotion && currentTime - lastRenderTime < 200) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      lastRenderTime = currentTime;
      
      const width = cols.current;
      const height = rows.current;

      let output = "";

      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.08;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.08;

      const mx = currentMouse.current.x;
      const my = currentMouse.current.y;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const nx = (x / width) * 2 - 1;
          const ny = (y / height) * 2 - 1;

          // Extremely wide ellipse shape
          const shapeDist = Math.sqrt(nx * nx + (ny * 4) * (ny * 4));
          
          let mask = 0;
          if (shapeDist < 1.0) {
            mask = Math.pow(1 - shapeDist, 1.5); 
          }

          if (mask <= 0) {
            output += " ";
            continue;
          }

          // Mouse effect distortion
          const distToMouse = Math.sqrt(Math.pow(nx - mx, 2) + Math.pow(ny - my, 2));
          let mouseEffect = 0;
          if (mouseInteraction && distToMouse < 0.4) {
            mouseEffect = Math.pow(0.4 - distToMouse, 1.2) * 2; 
          }

          // Create horizontal wave-like noise
          const freq1 = 2 * density;
          const freq2 = 5 * density;
          
          const t = time * 0.0015 * speed;
          
          // Horizontal moving waves
          let noise = Math.sin(nx * freq1 + t) * Math.cos(ny * freq1 - t * 0.5);
          noise += Math.cos(nx * freq2 - t) * 0.5;
          noise += Math.sin(ny * 10 + t) * 0.3; // subtle vertical striations
          
          let intensity = (noise + 2) / 4;

          intensity += mouseEffect * 0.5;
          intensity *= mask;

          let charIndex = Math.floor(intensity * CHAR_MAP.length);
          if (charIndex < 0) charIndex = 0;
          if (charIndex >= CHAR_MAP.length) charIndex = CHAR_MAP.length - 1;

          output += CHAR_MAP[charIndex];
        }
        output += "\n";
      }

      preRef.current.textContent = output;
      time += prefersReducedMotion ? 1 : 16;
      
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, speed, mouseInteraction]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!mouseInteraction || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      targetMouse.current.x = (x / rect.width) * 2 - 1;
      targetMouse.current.y = (y / rect.height) * 2 - 1;
    };
    
    if (mouseInteraction) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
    }
    
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [mouseInteraction]);

  const handleMouseLeave = () => {
    targetMouse.current.x = 0;
    targetMouse.current.y = 0;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative flex items-center justify-center cursor-default overflow-hidden ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      <pre 
        ref={preRef}
        className="font-mono text-[6px] sm:text-[8px] md:text-[10px] leading-[1.1] tracking-[0.2em] select-none mix-blend-screen opacity-90"
        style={{
          backgroundImage: "linear-gradient(to right, transparent 0%, rgba(59, 130, 246, 0.4) 15%, rgba(99, 102, 241, 0.8) 45%, #ffffff 50%, rgba(99, 102, 241, 0.8) 55%, rgba(59, 130, 246, 0.4) 85%, transparent 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      />
    </div>
  );
}

