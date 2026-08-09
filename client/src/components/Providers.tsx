'use client'

import { HeroUIProvider } from "@heroui/system";
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      lerp: 0.08,
      wheelMultiplier: 1.2
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <HeroUIProvider>
      {children}
    </HeroUIProvider>
  );
}
