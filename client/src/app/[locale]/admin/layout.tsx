'use client';
import { useTranslations } from 'next-intl';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from '@/i18n/routing';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('Admin');
  const { user } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user || user.role !== 'ADMIN') {
      router.push('/panel/dashboard');
    }
  }, [user, router]);

  if (!mounted || !user || user.role !== 'ADMIN') {
    return <div className="h-screen w-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-rose-500" /></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex relative selection:bg-primary/30 selection:text-white">
      <div className="hidden lg:block z-40 bg-surface border-r border-border w-[240px] shrink-0">
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative z-10 transition-all duration-300">
        <AdminHeader />
        
        <main className="flex-1 p-4 md:p-8 xl:p-10 overflow-x-hidden bg-background">
          <div className="max-w-[1700px] mx-auto w-full relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
