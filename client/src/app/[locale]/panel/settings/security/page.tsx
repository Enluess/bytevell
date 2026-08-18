'use client';

import { useTranslations } from 'next-intl';
import { Shield, ShieldAlert, KeyRound } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Link } from '@/i18n/routing';

export default function SecuritySettingsPage() {
  const t = useTranslations('Panel.Settings');

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="pb-8 border-b border-white/5">
        <h1 className="text-[32px] font-semibold tracking-tight text-white mb-2">{t('title')}</h1>
        <p className="text-[14px] text-white/50 tracking-wide">{t('security_subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-white/5">
        <Link href="/panel/settings/profile" className="pb-4 text-[12px] font-bold transition-all uppercase tracking-widest relative text-white/40 hover:text-white/70">
          {t('tab_profile')}
        </Link>
        <Link href="/panel/settings/security" className="pb-4 text-[12px] font-bold transition-all uppercase tracking-widest relative text-white">
          {t('tab_security')}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-full shadow-[0_-2px_10px_rgba(255,255,255,0.5)]"></div>
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
            <KeyRound className="w-4 h-4 text-white/50" />
          </div>
          {t('password')}
        </h2>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <p className="text-[14px] text-white/60 tracking-wide">{t('password_desc')}</p>
          <button className="px-6 py-3 bg-white text-black hover:bg-white/90 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] shrink-0">
            {t('update_password')}
          </button>
        </div>
      </div>
    </div>
  );
}
