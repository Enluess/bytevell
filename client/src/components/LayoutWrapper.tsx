'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/routing';
import { Navigation } from '@/components/Navigation';
import Lenis from 'lenis';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.07,
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Do not show Navigation on /panel, /auth, or /admin routes
  const isHiddenRoute = pathname.startsWith('/panel') || pathname.startsWith('/auth') || pathname.startsWith('/admin');

  return (
    <>
      {!isHiddenRoute && <Navigation />}
      <div className="relative z-10">
        {children}
      </div>
    </>
  );
}
