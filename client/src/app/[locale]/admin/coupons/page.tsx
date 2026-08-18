'use client';
import { useTranslations } from 'next-intl';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Ticket, Plus, Save, Trash2, Edit } from 'lucide-react';

export default function AdminCouponsPage() {
  const t = useTranslations('Admin');
  const token = useAuthStore(state => state.token);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: '', code: '', description: '', type: 'percentage', value: '', usageLimit: '', startsAt: '', expiresAt: '' });

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get<any>('/coupons');
      if (res.coupons) setCoupons(res.coupons);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      if (form.id) {
        await api.put(`/coupons/${form.id}`, form);
      } else {
        await api.post('/coupons', form);
      }
      setShowForm(false);
      fetchData();
    } catch (err) { console.error(err); alert('Hata oluştu.'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Emin misiniz?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      fetchData();
    } catch (err) { console.error(err); alert('Hata oluştu.'); }
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 mb-1">
            <Ticket className="w-6 h-6" /> Kuponlar & İndirimler
          </h1>
          <p className="text-sm text-foreground-muted">{t('Promosyonkodlar')}</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-surface-elevated/50 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">{t('KuponListesi')}</h2>
          <button 
            onClick={() => { setForm({ id: '', code: '', description: '', type: 'percentage', value: '', usageLimit: '', startsAt: '', expiresAt: '' }); setShowForm(true); }}
            className="px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded hover:bg-foreground/90 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Yeni Kupon
          </button>
        </div>

        {showForm && (
          <div className="p-6 bg-surface-raised/30 border-b border-border space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('KuponKodu')}</label>
                <input type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value})} placeholder={t('YAZ2024')} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none uppercase" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('Tr')}</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none">
                  <option value="percentage">{t('Yzde')}</option>
                  <option value="fixed">{t('SabitTutar')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1.5">Değer ({form.type === 'percentage' ? '%' : 'Para Birimi'})</label>
                <input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} placeholder={t('15')} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('KullanmSnrBoSnr')}</label>
                <input type="number" value={form.usageLimit} onChange={e => setForm({...form, usageLimit: e.target.value})} placeholder={t('100')} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
              </div>
              <div className="md:col-span-4">
                <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('Aklama')}</label>
                <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder={t('Yazindirimikamp')} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-[13px] font-medium text-foreground-muted hover:text-foreground transition-colors">{t('ptal')}</button>
              <button onClick={handleSave} className="px-4 py-2 bg-foreground text-background font-medium text-[13px] rounded-md hover:bg-foreground/90 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" /> Kaydet
              </button>
            </div>
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-[13px] whitespace-nowrap">
            <thead className="bg-surface-elevated/50 text-foreground-muted font-medium border-b border-border text-[12px]">
              <tr>
                <th className="px-6 py-3">{t('Kod')}</th>
                <th className="px-6 py-3">{t('ndirim')}</th>
                <th className="px-6 py-3">{t('Kullanm')}</th>
                <th className="px-6 py-3">{t('Durum')}</th>
                <th className="px-6 py-3 text-right">{t('lemler')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-surface-raised/50 transition-colors">
                  <td className="px-6 py-3 font-mono font-medium text-foreground">{c.code}</td>
                  <td className="px-6 py-3 text-emerald-500 font-medium">
                    {c.type === 'percentage' ? `%${c.value}` : `${c.value} Sabit`}
                  </td>
                  <td className="px-6 py-3 text-foreground-secondary text-[12px]">
                    {c.usageCount} / {c.usageLimit || '∞'}
                  </td>
                  <td className="px-6 py-3">
                    {c.isActive ? <span className="text-emerald-500 font-medium text-[12px]">{t('Aktif')}</span> : <span className="text-red-500 text-[12px]">{t('Pasif')}</span>}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => { setForm({ ...c, value: c.value, usageLimit: c.usageLimit || '' }); setShowForm(true); }} className="p-1.5 text-foreground-muted hover:text-foreground rounded transition-colors mr-2 inline-flex">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-foreground-muted hover:text-red-500 rounded transition-colors inline-flex">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-foreground-muted text-[13px]">{t('Kuponbulunamad')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
