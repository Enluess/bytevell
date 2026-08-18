'use client';

import { useTranslations } from 'next-intl';
import { Server, Receipt, Ticket, ArrowRight, CheckCircle2, Clock, Loader2, AlertCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function DashboardPage() {
  const t = useTranslations('Panel.Dashboard');
  const user = useAuthStore(state => state.user);
  const [mounted, setMounted] = useState(false);
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const json = await api.get<{ stats: any; recentServices: any[]; recentInvoices: any[] }>('/dashboard/stats');
        setData(json);
      } catch (err: any) {
        console.error("Failed to fetch dashboard stats", err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-surface rounded-md border border-border"></div>
        <div className="h-[400px] bg-surface rounded-md border border-border"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <h3 className="text-foreground font-medium mb-2">{t('error_occurred')}</h3>
        <p className="text-foreground-secondary">{error}</p>
      </div>
    );
  }

  const activeServices = data?.stats?.activeServices || 0;
  const unpaidInvoices = data?.stats?.unpaidInvoices || 0;
  const openTickets = data?.stats?.openTickets || 0;
  const balance = data?.stats?.balance || '0.00';
  const recentServices = data?.recentServices || [];

  return (
    <div className="space-y-12">
      {/* Account Hero */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
        <div>
          <h1 className="text-[32px] font-semibold tracking-tight text-white mb-3">
            {t('greeting_evening')}{mounted && user?.name ? user.name.split(' ')[0] : t('customer')}.
          </h1>
          <div className="flex items-center gap-3 text-[14px] text-white/50">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
              <span className="text-[12px] text-white/80 font-medium tracking-wide uppercase">{t('systems_operational')}</span>
            </div>
            <span>•</span>
            <span className="tracking-wide">{t('you_have')} {activeServices} {t('active_services_count')}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-10">
          <div className="flex flex-col">
            <span className="text-white/40 mb-1.5 uppercase tracking-widest text-[10px] font-bold">{t('account_balance')}</span>
            <span className="text-3xl font-semibold tracking-tight text-white">₺{balance}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/40 mb-1.5 uppercase tracking-widest text-[10px] font-bold">{t('open_tickets_count')}</span>
            <span className="text-3xl font-semibold tracking-tight text-white">{openTickets}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/40 mb-1.5 uppercase tracking-widest text-[10px] font-bold">{t('unpaid_invoices_count')}</span>
            <span className={`text-3xl font-semibold tracking-tight ${unpaidInvoices > 0 ? 'text-red-400' : 'text-white'}`}>{unpaidInvoices}</span>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-white tracking-tight">{t('active_infrastructure')}</h2>
          <Link href="/panel/services" className="text-[14px] text-white/50 hover:text-white transition-colors flex items-center gap-1">
            {t('view_all_services')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentServices.length > 0 ? (
            recentServices.map((service: any, i: number) => (
              <Link key={i} href={`/panel/services/${service.id}`} className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.04] transition-all duration-500 flex flex-col justify-between min-h-[160px] backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-semibold tracking-widest text-white/40 uppercase">
                      {service.type === 'vps' ? t('vps_server') : service.type === 'web' ? t('web_hosting') : service.type}
                    </span>
                    <h3 className="text-lg font-medium text-white tracking-tight">{service.name}</h3>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase ${service.status === 'active' ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' : 'bg-red-400/10 border-red-400/20 text-red-400'}`}>
                    {service.status}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-white/30 uppercase tracking-wider mb-1">IP Address</span>
                    <span className="text-[13px] text-white/70 font-mono">{service.ipAddress || t('not_assigned')}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-16 text-center rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center">
              <Server className="w-12 h-12 text-white/20 mb-4" />
              <p className="text-white/50 text-[15px]">{t('no_infrastructure')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
