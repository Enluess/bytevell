'use client';

import { useTranslations } from 'next-intl';
import { Network, Loader2, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminIpsPage() {
  const t = useTranslations('Admin');
  const token = useAuthStore(state => state.token);
  
  const [ips, setIps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ address: '', type: 'ipv4' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchIps();
  }, [token]);

  const fetchIps = async () => {
    try {
      const res = await api.get<any>('/admin/infrastructure/ips');
      if (res.ips) setIps(res.ips);
    } catch (err) {
      console.error("Failed to fetch IPs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/infrastructure/ips', formData);
      setMessage('IP adresi başarıyla eklendi.');
      setIsModalOpen(false);
      setFormData({ address: '', type: 'ipv4' });
      fetchIps();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu IP adresini silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/admin/infrastructure/ips/${id}`);
      setMessage('IP adresi silindi.');
      fetchIps();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Silme işlemi başarısız. Bu IP bir hizmete atanmış olabilir.');
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">{t('IPAdresleri')}</h1>
          <p className="text-sm text-foreground-muted">{t('Mterilereveyasu')}</p>
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
            Yeni IP Ekle
          </button>
        </div>
      </div>

      <div className="w-full rounded-md overflow-x-auto bg-surface border border-border">
        <table className="w-full text-left text-[13px] whitespace-nowrap">
          <thead className="bg-surface-elevated text-foreground-muted font-medium border-b border-border text-[12px]">
            <tr>
              <th className="px-6 py-4">{t('IPAdresi')}</th>
              <th className="px-6 py-4">{t('Tr')}</th>
              <th className="px-6 py-4">{t('Durum')}</th>
              <th className="px-6 py-4 text-right">{t('lemler')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ips.map((ip) => (
              <tr key={ip.id} className="hover:bg-surface-raised transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-elevated flex items-center justify-center shrink-0">
                      <Network className="w-4 h-4 text-foreground-muted" />
                    </div>
                    <span className="font-medium text-foreground text-sm font-mono">{ip.address}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-foreground-secondary uppercase">{ip.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1.5 ${
                    ip.status === 'available' ? 'bg-emerald-500/10 text-emerald-500' :
                    ip.status === 'assigned' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-orange-500/10 text-orange-500'
                  }`}>
                    {ip.status === 'available' && <CheckCircle2 className="w-3 h-3" />}
                    {ip.status === 'assigned' && <AlertCircle className="w-3 h-3" />}
                    {ip.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(ip.id)}
                    className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded transition-colors inline-flex disabled:opacity-50"
                    title="Sil"
                    disabled={ip.status === 'assigned'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {ips.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-foreground-muted text-[13px]">
                  Henüz IP adresi eklenmemiş.
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
              <h2 className="text-lg font-medium text-foreground">{t('YeniIPAdresiEkl')}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-foreground-muted hover:text-foreground">✕</button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-foreground-muted mb-1.5">{t('IPAdresi')}</label>
                <input 
                  required
                  type="text" 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-[13px] outline-none focus:border-foreground-muted transition-colors font-mono"
                  placeholder={t('rn192168150')}
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-foreground-muted mb-1.5">{t('IPTr')}</label>
                <select 
                  required
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-[13px] outline-none focus:border-foreground-muted transition-colors"
                >
                  <option value="ipv4">{t('IPv4')}</option>
                  <option value="ipv6">{t('IPv6')}</option>
                </select>
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
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
