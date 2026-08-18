'use client';

import { useTranslations } from 'next-intl';
import { Server, Loader2, Save, Ban, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminServicesPage() {
  const t = useTranslations('Admin.Services');
  const token = useAuthStore(state => state.token);
  
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchServices();
  }, [token]);

  const fetchServices = async () => {
    try {
      const res = await api.get<any>('/admin/services');
      if (res.services) {
        setServices(res.services);
        const initialStatuses: Record<string, string> = {};
        res.services.forEach((s: any) => {
          initialStatuses[s.id] = s.status;
        });
        setStatuses(initialStatuses);
      }
    } catch (err) {
      console.error("Failed to fetch services", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    setMessage('');
    try {
      const newStatus = statuses[id];
      await api.put(`/admin/services/${id}/status`, { status: newStatus });
      setMessage('Hizmet güncellendi.');
      fetchServices();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Güncelleme başarısız.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/admin/services/${id}`);
      setMessage('Hizmet silindi.');
      fetchServices();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-surface-elevated rounded mb-8"></div>
        <div className="h-64 bg-surface border border-border rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">{t('title')}</h1>
          <p className="text-sm text-foreground-muted">{t('subtitle')}</p>
        </div>
        
        {message && (
          <div className="px-4 py-2 rounded bg-emerald-500/10 text-emerald-400 text-sm font-medium">
            {message}
          </div>
        )}
      </div>

      <div className="w-full rounded-md overflow-x-auto bg-surface border border-border">
        <table className="w-full text-left text-[13px] whitespace-nowrap">
          <thead className="bg-surface-elevated text-foreground-muted font-medium border-b border-border text-[12px]">
            <tr>
              <th className="px-6 py-4">{t('HizmetAd')}</th>
              <th className="px-6 py-4">{t('Sahibi')}</th>
              <th className="px-6 py-4">{t('Tr')}</th>
              <th className="px-6 py-4">{t('Fiyat')}</th>
              <th className="px-6 py-4">{t('Durum')}</th>
              <th className="px-6 py-4 text-right">{t('Eylemler')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-surface-raised transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-elevated flex items-center justify-center shrink-0">
                      <Server className="w-4 h-4 text-foreground-muted" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{service.name}</h3>
                      <p className="text-xs text-foreground-secondary">{service.ipAddress || 'IP Atanmamış'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-foreground">{service.userName || 'İsimsiz'}</div>
                  <div className="text-xs text-foreground-secondary">{service.userEmail}</div>
                </td>
                <td className="px-6 py-4 text-foreground-secondary uppercase">{service.type}</td>
                <td className="px-6 py-4 text-foreground-secondary">₺{service.price} / ay</td>
                <td className="px-6 py-4">
                  <select 
                    value={statuses[service.id] || 'pending'}
                    onChange={(e) => setStatuses({ ...statuses, [service.id]: e.target.value })}
                    className="bg-background border border-border rounded px-2 py-1 text-foreground text-xs outline-none focus:border-primary"
                  >
                    <option value="active">{t('Active')}</option>
                    <option value="pending">{t('Pending')}</option>
                    <option value="suspended">{t('Suspended')}</option>
                    <option value="cancelled">{t('Cancelled')}</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleSave(service.id)}
                      disabled={savingId === service.id || statuses[service.id] === service.status}
                      className="px-3 py-1.5 bg-surface-elevated hover:bg-surface-raised text-foreground rounded text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {savingId === service.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Kaydet
                    </button>
                    <button 
                      onClick={() => handleDelete(service.id)}
                      className="px-3 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded text-xs font-medium transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-foreground-muted text-[13px]">
                  Kayıtlı hizmet bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
