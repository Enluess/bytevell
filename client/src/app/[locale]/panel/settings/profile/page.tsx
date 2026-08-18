'use client';

import { useTranslations } from 'next-intl';
import { User, Mail, Wallet, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Link } from '@/i18n/routing';
import { useEffect, useState } from 'react';

export default function ProfileSettingsPage() {
  const t = useTranslations('Panel.Settings');
  const user = useAuthStore(state => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="pb-8 border-b border-white/5">
        <h1 className="text-[32px] font-semibold tracking-tight text-white mb-2">{t('title')}</h1>
        <p className="text-[14px] text-white/50 tracking-wide">{t('profile_subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-white/5">
        <Link href="/panel/settings/profile" className="pb-4 text-[12px] font-bold transition-all uppercase tracking-widest relative text-white">
          {t('tab_profile')}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-full shadow-[0_-2px_10px_rgba(255,255,255,0.5)]"></div>
        </Link>
        <Link href="/panel/settings/security" className="pb-4 text-[12px] font-bold transition-all uppercase tracking-widest relative text-white/40 hover:text-white/70">
          {t('tab_security')}
        </Link>
        <Link href="/panel/settings/api-keys" className="pb-4 text-[12px] font-bold transition-all uppercase tracking-widest relative text-white/40 hover:text-white/70">
          {t('tab_api_keys')}
        </Link>
        <Link href="/panel/settings/activity" className="pb-4 text-[12px] font-bold transition-all uppercase tracking-widest relative text-white/40 hover:text-white/70">
          {t('tab_activity')}
        </Link>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-sm">
        <h2 className="text-[11px] uppercase tracking-widest font-bold text-white/30 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
            <User className="w-4 h-4 text-white/50" />
          </div>
          {t('profile')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[11px] uppercase tracking-widest font-bold text-white/30 ml-1">{t('name')}</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                readOnly
                value={mounted && user?.name ? user.name : '-'}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[14px] text-white/50 outline-none cursor-not-allowed tracking-wide"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] uppercase tracking-widest font-bold text-white/30 ml-1">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="email" 
                readOnly
                value={mounted && user?.email ? user.email : '-'}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[14px] text-white/50 outline-none cursor-not-allowed tracking-wide"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] uppercase tracking-widest font-bold text-white/30 ml-1">{t('role')}</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                readOnly
                value={mounted && user?.role ? user.role : 'USER'}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[14px] text-white/50 outline-none cursor-not-allowed tracking-wide font-mono uppercase"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] uppercase tracking-widest font-bold text-white/30 ml-1">{t('balance')}</label>
            <div className="relative">
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50" />
              <input 
                type="text" 
                readOnly
                value={`₺${mounted && user?.balance ? user.balance : '0.00'}`}
                className="w-full bg-emerald-500/5 border border-emerald-500/10 rounded-2xl py-3 pl-12 pr-4 text-[14px] text-emerald-400 font-semibold outline-none cursor-not-allowed tracking-wide"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
