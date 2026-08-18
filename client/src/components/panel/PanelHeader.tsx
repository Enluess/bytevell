'use client'

import { useTranslations } from 'next-intl';
import { Bell, Search, User, Menu } from 'lucide-react';
import { LanguageFlags } from '@/components/LanguageFlags';
import { Suspense, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function PanelHeader() {
  const t = useTranslations('Panel.Header');
  const user = useAuthStore(state => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initials = mounted && user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '..';

  return (
    <header className="h-20 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-0 lg:pr-8 shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button className="lg:hidden p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Command Palette Trigger */}
        <button 
          className="hidden sm:flex items-center gap-3 px-4 py-2.5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl text-white/40 hover:text-white/60 transition-all duration-300 w-72 backdrop-blur-xl"
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
        >
          <Search className="w-4 h-4" />
          <span className="text-[13px] flex-1 text-left tracking-wide">{t('search_placeholder') || 'Search...'}</span>
          <div className="flex items-center gap-1 text-[11px] font-medium bg-black/20 px-2 py-0.5 rounded-lg border border-white/5">
            <span className="text-[10px]">⌘</span>K
          </div>
        </button>
      </div>

      <div className="flex items-center gap-6">
        {/* Language Selection */}
        <Suspense fallback={<div className="w-6 h-6 rounded-full bg-white/5 animate-pulse" />}>
          <LanguageFlags />
        </Suspense>

        <button className="relative text-white/50 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5" aria-label={t('notifications')}>
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
        </button>

        {/* Profile */}
        <button className="flex items-center gap-3 text-white/70 hover:text-white transition-all pl-6 border-l border-white/5" aria-label={t('profile')}>
          <span className="text-[13px] font-medium hidden md:block tracking-wide">
            {(mounted && user?.name) || t('profile')}
          </span>
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-xl shadow-sm">
            {initials}
          </div>
        </button>
      </div>
    </header>
  );
}
