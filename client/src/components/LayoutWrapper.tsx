'use client';

import { usePathname } from '@/i18n/routing';
import { Navigation } from '@/components/Navigation';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
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
