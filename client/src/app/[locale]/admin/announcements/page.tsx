'use client';
import { useTranslations } from 'next-intl';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Megaphone, Plus, Save, Trash2, Edit, Pin } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const t = useTranslations('Admin');
  const token = useAuthStore(state => state.token);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: '', title: '', content: '', type: 'info', isPublished: false, isPinned: false });

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get<any>('/announcements/admin/all');
      if (res.announcements) setAnnouncements(res.announcements);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      if (form.id) {
        await api.put(`/announcements/${form.id}`, form);
      } else {
        await api.post('/announcements', form);
      }
      setShowForm(false);
      fetchData();
    } catch (err) { console.error(err); alert('Hata oluştu.'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Emin misiniz?')) return;
    try {
      await api.delete(`/announcements/${id}`);
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
            <Megaphone className="w-6 h-6" /> Duyurular
          </h1>
          <p className="text-sm text-foreground-muted">{t('Mterileregsteri')}</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-surface-elevated/50 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">{t('DuyuruListesi')}</h2>
          <button 
            onClick={() => { setForm({ id: '', title: '', content: '', type: 'info', isPublished: false, isPinned: false }); setShowForm(true); }}
            className="px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded hover:bg-foreground/90 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Yeni Duyuru
          </button>
        </div>

        {showForm && (
          <div className="p-6 bg-surface-raised/30 border-b border-border space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('DuyuruBal')}</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('Tr')}</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none">
                  <option value="info">{t('BilgiMavi')}</option>
                  <option value="warning">{t('UyarKrmz')}</option>
                  <option value="maintenance">{t('BakmTuruncu')}</option>
                  <option value="update">{t('GncellemeYeil')}</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('erikMetin')}</label>
                <textarea rows={5} value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none resize-none" />
              </div>
              <div className="md:col-span-2 flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} className="rounded bg-surface border-border text-primary focus:ring-primary focus:ring-offset-background" />
                  <span className="text-[13px] text-foreground">{t('YayndaMterilerg')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPinned} onChange={e => setForm({...form, isPinned: e.target.checked})} className="rounded bg-surface border-border text-primary focus:ring-primary focus:ring-offset-background" />
                  <span className="text-[13px] text-foreground">{t('SabitleEnsttegs')}</span>
                </label>
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
                <th className="px-6 py-3">{t('Balk')}</th>
                <th className="px-6 py-3">{t('Tr')}</th>
                <th className="px-6 py-3">{t('Durum')}</th>
                <th className="px-6 py-3">{t('Sabit')}</th>
                <th className="px-6 py-3 text-right">{t('lemler')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {announcements.map((a) => (
                <tr key={a.id} className="hover:bg-surface-raised/50 transition-colors">
                  <td className="px-6 py-3 font-medium text-foreground">{a.title}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      a.type === 'maintenance' ? 'bg-orange-500/10 text-orange-500' :
                      a.type === 'update' ? 'bg-emerald-500/10 text-emerald-500' :
                      a.type === 'warning' ? 'bg-red-500/10 text-red-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>{a.type}</span>
                  </td>
                  <td className="px-6 py-3">
                    {a.isPublished ? <span className="text-emerald-500 font-medium">{t('Yaynda')}</span> : <span className="text-foreground-muted">{t('Taslak')}</span>}
                  </td>
                  <td className="px-6 py-3">
                    {a.isPinned && <Pin className="w-4 h-4 text-primary" />}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => { setForm({ ...a }); setShowForm(true); }} className="p-1.5 text-foreground-muted hover:text-foreground rounded transition-colors mr-2 inline-flex">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="p-1.5 text-foreground-muted hover:text-red-500 rounded transition-colors inline-flex">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {announcements.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-foreground-muted text-[13px]">{t('Duyurubulunamad')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
