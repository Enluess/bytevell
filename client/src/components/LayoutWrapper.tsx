'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/routing';
import { Navigation } from '@/components/Navigation';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useEffect(() => {
    // Lenis is already initialized globally in Providers.tsx
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
