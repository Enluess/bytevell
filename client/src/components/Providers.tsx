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
      lerp: 0.2,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
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
