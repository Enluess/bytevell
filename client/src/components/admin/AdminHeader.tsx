'use client';

import { useTranslations } from 'next-intl';
import { Menu, Search, Bell, Activity, UserX, Plus } from 'lucide-react';
import { LanguageFlags } from '@/components/LanguageFlags';
import { Suspense, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function AdminHeader() {
  const t = useTranslations('Panel.Header');
  const user = useAuthStore(state => state.user);
  // Optional: Impersonation state logic would go here
  const impersonating = false; 
  const impersonatedUser = '';

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const initials = mounted && user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AD';

  return (
    <>
      {impersonating && (
        <div className="bg-[#E5007F] text-white px-4 py-2 flex items-center justify-between z-50 text-[13px] font-medium tracking-tight">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            You are currently impersonating: {impersonatedUser}
          </div>
          <button className="flex items-center gap-1.5 hover:bg-black/20 px-2 py-1 rounded transition-colors">
            <UserX className="w-4 h-4" />
            Exit Impersonation
          </button>
        </div>
      )}

      <header className="h-16 bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 shrink-0 border-b border-border">
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 text-foreground-secondary hover:text-foreground hover:bg-surface-raised rounded-md transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden md:flex items-center group bg-surface-elevated border border-border hover:border-border-strong focus-within:border-primary rounded-md w-[300px] transition-colors overflow-hidden">
            <div className="px-3">
              <Search className="w-[14px] h-[14px] text-foreground-muted group-focus-within:text-primary" />
            </div>
            <input
              type="text"
              placeholder={t('Searchcustomers')}
              className="bg-transparent border-none outline-none text-[13px] text-foreground py-1.5 w-full placeholder:text-foreground-muted"
            />
            <div className="px-2 flex items-center">
              <kbd className="hidden sm:flex items-center gap-1 bg-surface px-1.5 py-0.5 rounded border border-border text-[10px] font-medium text-foreground-muted">
                <span>⌘</span>K
              </kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[11px] text-emerald-400 font-medium tracking-wide hidden sm:block uppercase">{t('Operational')}</span>
          </div>

          <div className="w-px h-4 bg-border hidden md:block"></div>

          <Suspense fallback={<div className="w-6 h-6 rounded-full bg-surface-raised animate-pulse" />}>
            <LanguageFlags />
          </Suspense>

          <button className="relative text-foreground-secondary hover:text-foreground transition-colors p-1" aria-label={t('notifications')}>
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
          </button>

          {/* Profile */}
          <button className="flex items-center gap-3 text-foreground hover:text-white transition-colors pl-4 border-l border-border" aria-label={t('profile')}>
            <span className="text-[13px] font-medium hidden md:block text-foreground-secondary hover:text-foreground">
              {user?.name || 'Admin'}
            </span>
            <div className="w-7 h-7 rounded bg-surface-elevated border border-border flex items-center justify-center text-foreground-secondary text-[11px] font-semibold uppercase">
              {initials}
            </div>
          </button>
        </div>
      </header>
    </>
  );
}
