'use client';

import { useTranslations } from 'next-intl';
import { Server, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { api, ApiError } from '@/lib/api';

export default function ServicesPage() {
  const t = useTranslations('Panel.Services');
  
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const json = await api.get<{ success: boolean; services: any[] }>('/services');
        setServices(json.services || []);
      } catch (err: any) {
        console.error("Failed to fetch services", err);
        setError(err.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div>
          <div className="h-7 w-48 bg-surface rounded mb-2 border border-border"></div>
          <div className="h-4 w-72 bg-surface rounded border border-border"></div>
        </div>
        <div className="border border-border rounded-md bg-surface divide-y divide-border">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-surface-elevated border border-border"></div>
                <div>
                  <div className="h-4 w-32 bg-surface-elevated rounded mb-2"></div>
                  <div className="h-3 w-24 bg-surface-elevated rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center border border-border rounded-md bg-surface">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <h3 className="text-foreground font-medium mb-2">{t('error_loading')}</h3>
        <p className="text-foreground-secondary">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="pb-8 border-b border-white/5">
        <h1 className="text-[32px] font-semibold tracking-tight text-white mb-2">{t('title')}</h1>
        <p className="text-[14px] text-white/50 tracking-wide">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {services.length > 0 ? (
          services.map((service, i) => (
            <Link
              key={service.id || i}
              href={`/panel/services/${service.id}`}
              className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.04] transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-6 backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                  <Server className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg tracking-tight mb-1">{service.name}</h3>
                  <p className="text-[13px] text-white/50 font-mono tracking-wide">IP Address: {service.ipAddress || t('not_assigned')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-10 relative z-10">
                <div className="flex flex-col sm:items-end">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1.5">{t('status')}</span>
                  <div className={`px-3 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase ${service.status === 'active' ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' : service.status === 'suspended' ? 'bg-orange-400/10 border-orange-400/20 text-orange-400' : 'bg-red-400/10 border-red-400/20 text-red-400'}`}>
                    {service.status === 'active' ? t('service_status_active') : service.status}
                  </div>
                </div>
                <div className="flex flex-col items-end min-w-[80px]">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1.5">{t('price')}</span>
                  <span className="text-xl text-white font-semibold tracking-tight">₺{service.price}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="px-6 py-20 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
            <Server className="w-12 h-12 text-white/20 mb-4" />
            <h3 className="text-white font-medium text-lg tracking-tight mb-2">{t('no_active_services') || 'No active services'}</h3>
            <p className="text-white/40 text-[14px] mb-8 max-w-sm tracking-wide">{t('no_services_desc')}</p>
            <Link href="/panel/store" className="px-6 py-3 bg-white text-black text-[14px] font-semibold rounded-xl hover:opacity-90 transition-opacity tracking-wide">
              {t('browse_services') || 'Browse Services'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
