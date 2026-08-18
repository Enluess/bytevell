'use client';

import { useTranslations } from 'next-intl';
import { Database, Loader2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminDatacentersPage() {
  const t = useTranslations('Admin'); // Fallback if no specific translations
  const token = useAuthStore(state => state.token);
  
  const [datacenters, setDatacenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', country: '', city: '', timezone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDatacenters();
  }, [token]);

  const fetchDatacenters = async () => {
    try {
      const res = await api.get<any>('/admin/infrastructure/datacenters');
      if (res.datacenters) {
        setDatacenters(res.datacenters);
      }
    } catch (err) {
      console.error("Failed to fetch datacenters", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/infrastructure/datacenters', formData);
      setMessage('Veri merkezi başarıyla eklendi.');
      setIsModalOpen(false);
      setFormData({ name: '', country: '', city: '', timezone: '' });
      fetchDatacenters();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu veri merkezini silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/admin/infrastructure/datacenters/${id}`);
      setMessage('Veri merkezi silindi.');
      fetchDatacenters();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Silme işlemi başarısız. İçinde sunucu olabilir.');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">{t('VeriMerkezleri')}</h1>
          <p className="text-sm text-foreground-muted">{t('Altyapnzaaitver')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {message && (
            <div className="px-4 py-2 rounded bg-emerald-500/10 text-emerald-400 text-sm font-medium">
              {message}
            </div>
          )}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-foreground text-background hover:opacity-90 rounded text-sm font-medium transition-opacity flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Yeni Veri Merkezi
          </button>
        </div>
      </div>

      <div className="w-full rounded-md overflow-x-auto bg-surface border border-border">
        <table className="w-full text-left text-[13px] whitespace-nowrap">
          <thead className="bg-surface-elevated text-foreground-muted font-medium border-b border-border text-[12px]">
            <tr>
              <th className="px-6 py-4">{t('sim')}</th>
              <th className="px-6 py-4">{t('Lokasyon')}</th>
              <th className="px-6 py-4">{t('ZamanDilimi')}</th>
              <th className="px-6 py-4">{t('Durum')}</th>
              <th className="px-6 py-4 text-right">{t('lemler')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {datacenters.map((dc) => (
              <tr key={dc.id} className="hover:bg-surface-raised transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-elevated flex items-center justify-center shrink-0">
                      <Database className="w-4 h-4 text-foreground-muted" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{dc.name}</h3>
                      <span className="text-xs text-foreground-secondary font-mono">{dc.id.substring(0, 8)}...</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-foreground-secondary">
                  {dc.city}, {dc.country}
                </td>
                <td className="px-6 py-4 text-foreground-secondary">{dc.timezone}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-xs font-medium">
                    {dc.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(dc.id)}
                    className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded transition-colors inline-flex"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {datacenters.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-foreground-muted text-[13px]">
                  Henüz bir veri merkezi eklenmemiş.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface border border-border rounded-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-medium text-foreground">{t('YeniVeriMerkezi')}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-foreground-muted hover:text-foreground">✕</button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-foreground-muted mb-1.5">{t('VeriMerkeziAd')}</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-[13px] outline-none focus:border-foreground-muted transition-colors"
                  placeholder={t('rnIstanbulDC1')}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-foreground-muted mb-1.5">{t('lke')}</label>
                  <input 
                    type="text" 
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-[13px] outline-none focus:border-foreground-muted transition-colors"
                    placeholder={t('Turkey')}
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-foreground-muted mb-1.5">{t('ehir')}</label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-[13px] outline-none focus:border-foreground-muted transition-colors"
                    placeholder={t('Istanbul')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-foreground-muted mb-1.5">{t('ZamanDilimi')}</label>
                <input 
                  type="text" 
                  value={formData.timezone}
                  onChange={e => setFormData({...formData, timezone: e.target.value})}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-[13px] outline-none focus:border-foreground-muted transition-colors"
                  placeholder={t('EuropeIstanbul')}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[13px] font-medium text-foreground-secondary hover:text-foreground transition-colors"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-foreground text-background hover:opacity-90 rounded-md text-[13px] font-medium transition-opacity disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
