'use client';

import { useTranslations } from 'next-intl';
import { HardDrive, Loader2, Plus, Trash2, Database, Cpu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminServersPage() {
  const t = useTranslations('Admin');
  const token = useAuthStore(state => state.token);
  
  const [servers, setServers] = useState<any[]>([]);
  const [datacenters, setDatacenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ hostname: '', ip: '', datacenterId: '', os: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [resServers, resDCs] = await Promise.all([
        api.get<any>('/admin/infrastructure/servers'),
        api.get<any>('/admin/infrastructure/datacenters')
      ]);
      if (resServers.servers) setServers(resServers.servers);
      if (resDCs.datacenters) {
        setDatacenters(resDCs.datacenters);
        if (resDCs.datacenters.length > 0) {
          setFormData(prev => ({ ...prev, datacenterId: resDCs.datacenters[0].id }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch servers", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/infrastructure/servers', formData);
      setMessage('Sunucu başarıyla eklendi.');
      setIsModalOpen(false);
      setFormData({ hostname: '', ip: '', datacenterId: datacenters[0]?.id || '', os: '' });
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu sunucuyu silmek istediğinize emin misiniz? Üzerindeki sanal makineler etkilenebilir!')) return;
    try {
      await api.delete(`/admin/infrastructure/servers/${id}`);
      setMessage('Sunucu silindi.');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Silme işlemi başarısız.');
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">{t('FizikselSunucul')}</h1>
          <p className="text-sm text-foreground-muted">{t('Altyapnzbarndra')}</p>
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
            Yeni Sunucu Ekle
          </button>
        </div>
      </div>

      <div className="w-full rounded-md overflow-x-auto bg-surface border border-border">
        <table className="w-full text-left text-[13px] whitespace-nowrap">
          <thead className="bg-surface-elevated text-foreground-muted font-medium border-b border-border text-[12px]">
            <tr>
              <th className="px-6 py-4">{t('HostnameIP')}</th>
              <th className="px-6 py-4">{t('VeriMerkezi')}</th>
              <th className="px-6 py-4">{t('letimSistemi')}</th>
              <th className="px-6 py-4">{t('YkKapasite')}</th>
              <th className="px-6 py-4">{t('Durum')}</th>
              <th className="px-6 py-4 text-right">{t('lemler')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {servers.map((server) => (
              <tr key={server.id} className="hover:bg-surface-raised transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-elevated flex items-center justify-center shrink-0">
                      <HardDrive className="w-4 h-4 text-foreground-muted" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{server.hostname}</h3>
                      <span className="text-xs text-foreground-secondary font-mono">{server.ip}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-foreground-secondary">
                    <Database className="w-3.5 h-3.5" />
                    {server.datacenterName || 'Bilinmiyor'}
                  </div>
                </td>
                <td className="px-6 py-4 text-foreground-secondary flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5" />
                  {server.os || 'Linux'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 w-24">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground">{server.currentLoad || 0}</span>
                      <span className="text-foreground-secondary">/ {server.maxCapacity || '∞'}</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500" 
                        style={{ width: `${server.maxCapacity ? ((server.currentLoad / server.maxCapacity) * 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    server.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                    server.status === 'maintenance' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {server.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(server.id)}
                    className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded transition-colors inline-flex"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {servers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-foreground-muted text-[13px]">
                  Henüz bir fiziksel sunucu eklenmemiş.
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
              <h2 className="text-lg font-medium text-foreground">{t('YeniSunucuEkle')}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-foreground-muted hover:text-foreground">✕</button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-foreground-muted mb-1.5">{t('Hostname')}</label>
                <input 
                  required
                  type="text" 
                  value={formData.hostname}
                  onChange={e => setFormData({...formData, hostname: e.target.value})}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-[13px] outline-none focus:border-foreground-muted transition-colors"
                  placeholder={t('rnnode01bytevel')}
                />
              </div>
              
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-foreground-muted mb-1.5">{t('IPAdresi')}</label>
                <input 
                  required
                  type="text" 
                  value={formData.ip}
                  onChange={e => setFormData({...formData, ip: e.target.value})}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-[13px] outline-none focus:border-foreground-muted transition-colors font-mono"
                  placeholder={t('1921681100')}
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-foreground-muted mb-1.5">{t('VeriMerkezi')}</label>
                <select 
                  required
                  value={formData.datacenterId}
                  onChange={e => setFormData({...formData, datacenterId: e.target.value})}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-[13px] outline-none focus:border-foreground-muted transition-colors"
                >
                  <option value="" disabled>{t('Seiniz')}</option>
                  {datacenters.map(dc => (
                    <option key={dc.id} value={dc.id}>{dc.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-foreground-muted mb-1.5">{t('letimSistemi')}</label>
                <input 
                  type="text" 
                  value={formData.os}
                  onChange={e => setFormData({...formData, os: e.target.value})}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-[13px] outline-none focus:border-foreground-muted transition-colors"
                  placeholder={t('ProxmoxVE81')}
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
