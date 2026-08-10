'use client'

import { HeroUIProvider } from "@heroui/system";
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      lerp: 0.1,
      duration: 1.0,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    const smoother = ScrollSmoother.create({
      wrapper: ".smooth-wrapper",
      content: ".smooth-content",
      smooth: 1.5,
      effects: true,
    });

    return () => {
      lenis.destroy();
      smoother.kill();
    };
  }, []);

  return (
    <HeroUIProvider>
      <div className="smooth-wrapper">
        <div className="smooth-content">
          {children}
        </div>
      </div>
    </HeroUIProvider>
  );
}
