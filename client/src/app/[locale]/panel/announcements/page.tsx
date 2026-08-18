'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Megaphone, Pin, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function AnnouncementsPage() {
  const t = useTranslations('Panel.Announcements');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<any>('/announcements');
        if (res.announcements) setAnnouncements(res.announcements);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-surface-elevated rounded mb-8"></div>
        <div className="h-64 bg-surface border border-border rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="pb-8 border-b border-white/5">
        <h1 className="text-[32px] font-semibold tracking-tight text-white mb-2">{t('title')}</h1>
        <p className="text-[14px] text-white/50 tracking-wide">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {announcements.map((ann) => (
          <div key={ann.id} className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-8 hover:bg-white/[0.04] transition-all duration-500 backdrop-blur-xl flex flex-col sm:flex-row gap-8 items-start">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="shrink-0 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative z-10 shadow-sm">
              {ann.isPinned ? <Pin className="w-7 h-7 text-white" /> : <Megaphone className="w-7 h-7 text-white/50 group-hover:text-white transition-colors" />}
            </div>
            
            <div className="flex-1 min-w-0 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="text-xl font-semibold text-white tracking-tight">{ann.title}</h3>
                  <div className={`px-3 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase ${
                    ann.type === 'maintenance' ? 'bg-orange-400/10 border-orange-400/20 text-orange-400' :
                    ann.type === 'update' ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' :
                    ann.type === 'warning' ? 'bg-red-400/10 border-red-400/20 text-red-400' :
                    'bg-blue-400/10 border-blue-400/20 text-blue-400'
                  }`}>
                    {ann.type}
                  </div>
                </div>
                <div className="text-[12px] text-white/30 font-mono tracking-wide whitespace-nowrap">
                  {new Date(ann.publishedAt || ann.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <p className="text-[15px] text-white/60 leading-relaxed whitespace-pre-wrap tracking-wide">{ann.content}</p>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="py-20 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
            <Megaphone className="w-12 h-12 text-white/20 mb-4" />
            <h3 className="text-white font-medium text-lg tracking-tight mb-2">{t('no_announcements') || 'No Announcements'}</h3>
          </div>
        )}
      </div>
    </div>
  );
}
