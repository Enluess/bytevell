'use client';

import { useTranslations } from 'next-intl';
import { Activity, Clock, Loader2, Search } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function ActivityLogPage() {
  const t = useTranslations('Panel.Settings');
  
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const json = await api.get<{ success: boolean; logs: any[] }>('/activity');
      setLogs(json.logs || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="pb-8 border-b border-white/5">
        <h1 className="text-[32px] font-semibold tracking-tight text-white mb-2">{t('title')}</h1>
        <p className="text-[14px] text-white/50 tracking-wide">{t('activity_subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-white/5">
        <Link href="/panel/settings/profile" className="pb-4 text-[12px] font-bold transition-all uppercase tracking-widest relative text-white/40 hover:text-white/70">
          {t('tab_profile')}
        </Link>
        <Link href="/panel/settings/security" className="pb-4 text-[12px] font-bold transition-all uppercase tracking-widest relative text-white/40 hover:text-white/70">
          {t('tab_security')}
        </Link>
        <Link href="/panel/settings/api-keys" className="pb-4 text-[12px] font-bold transition-all uppercase tracking-widest relative text-white/40 hover:text-white/70">
          {t('tab_api_keys')}
        </Link>
        <Link href="/panel/settings/activity" className="pb-4 text-[12px] font-bold transition-all uppercase tracking-widest relative text-white">
          {t('tab_activity')}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-full shadow-[0_-2px_10px_rgba(255,255,255,0.5)]"></div>
        </Link>
      </div>

      {error && (
        <div className="px-6 py-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-[14px] font-medium tracking-wide">
          {error}
        </div>
      )}

      <div className="bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <h2 className="text-[11px] uppercase tracking-widest font-bold text-white/30 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white/50" />
            </div>
            {t('activity_log')}
          </h2>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 w-full sm:w-72 focus-within:border-white/20 transition-colors">
            <Search className="w-4 h-4 text-white/30 shrink-0" />
            <input type="text" placeholder={t('search_logs')} className="bg-transparent border-none outline-none text-[13px] text-white px-3 w-full placeholder:text-white/30 tracking-wide" />
          </div>
        </div>

        {loading ? (
          <div className="p-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-white/20" />
          </div>
        ) : logs.length > 0 ? (
          <div className="divide-y divide-white/5">
            {logs.map((log) => (
              <div key={log.id} className="p-6 flex gap-6 hover:bg-white/[0.02] transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 shadow-sm">
                  <Clock className="w-5 h-5 text-white/30 group-hover:text-white/50 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <p className="text-[15px] text-white font-semibold tracking-tight">{log.action}</p>
                    <span className="text-[12px] text-white/30 font-mono tracking-wider sm:ml-4 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[14px] text-white/60 tracking-wide mb-3 leading-relaxed">{log.details}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-white/30 tracking-wide">
                    <span className="bg-white/5 px-2 py-1 rounded-md">IP: {log.ipAddress || t('unknown')}</span>
                    <span className="hidden sm:inline">&bull;</span>
                    <span className="truncate max-w-[200px] sm:max-w-md">{t('user_agent')} {log.userAgent || t('unknown')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-8 py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
              <Activity className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-white font-semibold text-[16px] tracking-tight mb-2">{t('no_activity')}</h3>
            <p className="text-white/40 text-[14px] tracking-wide">{t('no_activity_desc')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
