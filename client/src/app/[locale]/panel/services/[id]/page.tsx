'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Server, Play, Square, RotateCw, RefreshCw, Loader2, HardDrive, Cpu, Activity, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { api, ApiError } from '@/lib/api';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const t = useTranslations('Panel.ServiceDetail');
  
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const json = await api.get<{ success: boolean; service: any }>(`/services/${id}`);
      setService(json.service);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch service details');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionName: string) => {
    if (!confirm(t('confirm_action', { action: actionName }))) return;
    
    setActionLoading(actionName);
    setMessage('');
    setError('');
    
    try {
      const json = await api.post<{ success: boolean; message: string }>(`/services/${id}/action`, { action: actionName });
      setMessage(json.message || t('action_success', { action: actionName }));
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(t('action_failed'));
      }
      setTimeout(() => setError(''), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="h-3 w-24 bg-surface rounded mb-4 border border-border"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-surface border border-border"></div>
              <div>
                <div className="h-7 w-48 bg-surface rounded mb-2 border border-border"></div>
                <div className="h-4 w-32 bg-surface rounded border border-border"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-8">
          <div className="lg:col-span-2 h-64 bg-surface rounded-md border border-border"></div>
          <div className="space-y-6">
            <div className="h-40 bg-surface rounded-md border border-border"></div>
            <div className="h-32 bg-surface rounded-md border border-border"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-border rounded-md bg-surface mt-8">
        <ShieldAlert className="w-10 h-10 text-red-500 mb-4" />
        <h2 className="text-lg font-medium text-foreground mb-2">{error || t('not_found')}</h2>
        <p className="text-sm text-foreground-secondary mb-6">{error ? 'Could not load service data.' : t('not_found_desc')}</p>
        <Link href="/panel/services" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:opacity-90 transition-opacity">
          {t('go_back')}
        </Link>
      </div>
    );
  }

  const isVps = service.type === 'vps';

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b border-white/5">
        <div>
          <Link href="/panel/services" className="text-white/40 hover:text-white flex items-center gap-2 text-[13px] font-medium tracking-wide mb-6 transition-colors w-fit group">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            {t('back_to_services')}
          </Link>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0 shadow-sm backdrop-blur-xl">
              <Server className="w-8 h-8 text-white/50" />
            </div>
            <div>
              <h1 className="text-[32px] font-semibold tracking-tight text-white flex items-center gap-4 mb-2">
                {service.name}
                <div className={`flex items-center gap-2 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                  service.status === 'active' ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' : 
                  service.status === 'suspended' ? 'bg-orange-400/10 border-orange-400/20 text-orange-400' : 
                  'bg-red-400/10 border-red-400/20 text-red-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${service.status === 'active' ? 'bg-emerald-400' : service.status === 'suspended' ? 'bg-orange-400' : 'bg-red-400'} animate-pulse`}></span>
                  {service.status}
                </div>
              </h1>
              <p className="text-white/40 font-mono text-[14px] tracking-wide">{service.ipAddress || t('no_ip')}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleAction('start')}
            disabled={actionLoading !== null}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all text-[12px] font-bold uppercase tracking-widest disabled:opacity-50 backdrop-blur-md shadow-sm"
          >
            {actionLoading === 'start' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {t('start')}
          </button>
          <button 
            onClick={() => handleAction('stop')}
            disabled={actionLoading !== null}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20 transition-all text-[12px] font-bold uppercase tracking-widest disabled:opacity-50 backdrop-blur-md shadow-sm"
          >
            {actionLoading === 'stop' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
            {t('stop')}
          </button>
          <button 
            onClick={() => handleAction('restart')}
            disabled={actionLoading !== null}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all text-[12px] font-bold uppercase tracking-widest disabled:opacity-50 backdrop-blur-md shadow-sm"
          >
            {actionLoading === 'restart' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCw className="w-4 h-4" />}
            {t('restart')}
          </button>
        </div>
      </div>

      {message && (
        <div className="px-6 py-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[14px] font-medium tracking-wide">
          {message}
        </div>
      )}

      {error && (
        <div className="px-6 py-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-[14px] font-medium tracking-wide">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-8 border-b border-white/5">
        {['overview', 'settings', 'billing'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[12px] font-bold transition-all uppercase tracking-widest relative ${
              activeTab === tab 
                ? 'text-white' 
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {/* @ts-ignore */}
            {t(`tab_${tab}`)}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-full shadow-[0_-2px_10px_rgba(255,255,255,0.5)]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-2">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {isVps ? (
                <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col items-center justify-center text-center min-h-[350px]">
                  <Activity className="w-12 h-12 text-white/10 mb-4" />
                  <p className="text-white/40 text-[14px] tracking-wide">{t('monitoring_disabled')}</p>
                </div>
              ) : (
                <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col items-center justify-center text-center min-h-[350px]">
                  <Activity className="w-12 h-12 text-white/10 mb-4" />
                  <p className="text-white/40 text-[14px] tracking-wide">{t('no_metrics')}</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                <h3 className="text-white/30 font-bold text-[11px] uppercase tracking-widest mb-6">{t('service_details')}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-white/50 tracking-wide">{t('product_type')}</span>
                    <span className="text-white capitalize font-medium">{service.type}</span>
                  </div>
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-white/50 tracking-wide">{t('created_at')}</span>
                    <span className="text-white font-mono">{new Date(service.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-white/50 tracking-wide">{t('ip_address')}</span>
                    <span className="text-white font-mono bg-white/5 px-2 py-1 rounded-md">{service.ipAddress || t('none')}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl border border-red-500/10 bg-red-500/[0.02] backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h3 className="text-red-400/50 font-bold text-[11px] uppercase tracking-widest mb-6 relative z-10">{t('dangerous_actions')}</h3>
                <button 
                  onClick={() => handleAction('reinstall')}
                  disabled={actionLoading !== null}
                  className="w-full relative z-10 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-[12px] uppercase tracking-widest font-bold disabled:opacity-50"
                >
                  {actionLoading === 'reinstall' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  {t('reinstall_os')}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-12 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl text-center">
            <p className="text-white/40 text-[15px] tracking-wide">{t('settings_coming_soon')}</p>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl max-w-lg">
            <h3 className="text-white/30 font-bold text-[11px] uppercase tracking-widest mb-6">{t('billing_info')}</h3>
            <div className="flex justify-between items-center text-[15px] pb-4 border-b border-white/5">
              <span className="text-white/50 tracking-wide">{t('price')}</span>
              <span className="text-2xl font-semibold text-white tracking-tight">₺{service.price}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
