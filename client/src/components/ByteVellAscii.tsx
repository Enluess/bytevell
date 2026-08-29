
"use client";

import React, { useEffect, useRef } from "react";

type ByteVellAsciiProps = {
  className?: string;
  density?: number;
  speed?: number;
  mouseInteraction?: boolean;
};

const CHAR_SET = "   �.:-=+*x%&#@";
const CHAR_MAP = CHAR_SET.split("");

export function ByteVellAscii({
  className = "",
  density = 1,
  speed = 1,
  mouseInteraction = true,
}: ByteVellAsciiProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // Mouse state refs
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  // Size state
  const cols = useRef(90);
  const rows = useRef(44);

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        cols.current = 50;
        rows.current = 28;
      } else if (w < 1024) {
        cols.current = 75;
        rows.current = 36;
      } else {
        cols.current = 100;
        rows.current = 42;
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

      // Throttle for reduced motion
      if (prefersReducedMotion && currentTime - lastRenderTime < 200) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      lastRenderTime = currentTime;
      
      const width = cols.current;
      const height = rows.current;

      let output = "";

      // Mouse interpolation
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.08;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.08;

      const mx = currentMouse.current.x;
      const my = currentMouse.current.y;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const nx = (x / width) * 2 - 1;
          const ny = (y / height) * 2 - 1;

          // Create an elliptical shield mask
          // Make it wider than it is tall
          const shapeDist = Math.sqrt(nx * nx + (ny * 1.5) * (ny * 1.5));
          
          let mask = 0;
          if (shapeDist < 1.0) {
            mask = Math.pow(1 - shapeDist, 1.2); 
          }

          if (mask <= 0) {
            output += " ";
            continue;
          }

          const distToMouse = Math.sqrt(Math.pow(nx - mx, 2) + Math.pow(ny - my, 2));
          let mouseEffect = 0;
          if (mouseInteraction && distToMouse < 0.5) {
            mouseEffect = Math.pow(0.5 - distToMouse, 1.5) * 2; 
          }

          const freq1 = 3 * density;
          const freq2 = 4 * density;
          const freq3 = 2.5 * density;
          
          const t = time * 0.001 * speed;
          
          let noise = Math.sin(nx * freq1 + t) * Math.cos(ny * freq1 - t);
          noise += Math.sin((nx - ny) * freq2 + t * 1.2);
          noise += Math.cos(Math.sqrt(nx*nx + ny*ny) * freq3 - t * 0.8);
          
          // Normalize noise roughly to 0..1
          let intensity = (noise + 3) / 6;

          intensity += mouseEffect * 0.8;
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
      window.addEventListener('mousemove', handleGlobalMouseMove);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [mouseInteraction]);

  const handleMouseLeave = () => {
    targetMouse.current.x = 0;
    targetMouse.current.y = 0;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative flex items-center justify-center cursor-default ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      <pre 
        ref={preRef}
        className="font-mono text-[8px] sm:text-[10px] md:text-[13px] leading-[1.05] tracking-tight select-none opacity-80"
        style={{
          backgroundImage: "linear-gradient(135deg, #a855f7 0%, #d946ef 40%, #f472b6 70%, #ffffff 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          textShadow: "0 0 20px rgba(217, 70, 239, 0.2)",
        }}
      />
    </div>
  );
}

