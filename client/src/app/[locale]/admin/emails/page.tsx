'use client';
import { useTranslations } from 'next-intl';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Mail, Edit, Save, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminEmailsPage() {
  const t = useTranslations('Admin');
  const token = useAuthStore(state => state.token);
  const [templates, setTemplates] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'templates' | 'logs'>('templates');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: '', slug: '', name: '', subject: '', bodyHtml: '', bodyText: '', isActive: true });

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tplRes, logsRes] = await Promise.all([
        api.get<any>('/emails/templates'),
        api.get<any>('/emails/logs')
      ]);
      if (tplRes.templates) setTemplates(tplRes.templates);
      if (logsRes.emails) setLogs(logsRes.emails);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      if (form.id) {
        await api.put(`/emails/templates/${form.id}`, form);
      } else {
        await api.post('/emails/templates', form);
      }
      setShowForm(false);
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 mb-1">
          <Mail className="w-6 h-6" /> E-posta Yönetimi
        </h1>
        <p className="text-sm text-foreground-muted">{t('Sistemepostaabl')}</p>
      </div>

      <div className="flex border-b border-border">
        <button 
          onClick={() => setActiveTab('templates')} 
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'templates' ? 'border-primary text-primary' : 'border-transparent text-foreground-muted hover:text-foreground'}`}
        >
          Şablonlar
        </button>
        <button 
          onClick={() => setActiveTab('logs')} 
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'logs' ? 'border-primary text-primary' : 'border-transparent text-foreground-muted hover:text-foreground'}`}
        >
          Gönderim Kayıtları
        </button>
      </div>

      {activeTab === 'templates' && (
        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-surface-elevated/50 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">{t('Epostaablonlar')}</h2>
          </div>

          {showForm && (
            <div className="p-6 bg-surface-raised/30 border-b border-border space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('ablonAd')}</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('BenzersizAnahta')}</label>
                  <input type="text" value={form.slug} disabled={!!form.id} onChange={e => setForm({...form, slug: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none disabled:opacity-50" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('EpostaKonusuSub')}</label>
                  <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">HTML İçerik (Değişkenler: {'{{name}}'}, vb.)</label>
                  <textarea rows={10} value={form.bodyHtml} onChange={e => setForm({...form, bodyHtml: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground font-mono outline-none resize-y" />
                </div>
                <div className="md:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="rounded bg-surface border-border text-primary focus:ring-primary focus:ring-offset-background" />
                    <span className="text-[13px] text-foreground">{t('Aktif')}</span>
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
                  <th className="px-6 py-3">{t('ablon')}</th>
                  <th className="px-6 py-3">{t('SlugAnahtar')}</th>
                  <th className="px-6 py-3">{t('Konu')}</th>
                  <th className="px-6 py-3">{t('Durum')}</th>
                  <th className="px-6 py-3 text-right">{t('lemler')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {templates.map((t) => (
                  <tr key={t.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-foreground">{t.name}</td>
                    <td className="px-6 py-3 text-foreground-secondary font-mono">{t.slug}</td>
                    <td className="px-6 py-3 text-foreground-secondary">{t.subject}</td>
                    <td className="px-6 py-3">
                      {t.isActive ? <span className="text-emerald-500 font-medium">{t('Aktif')}</span> : <span className="text-foreground-muted">{t('Pasif')}</span>}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => { setForm({ ...t, bodyText: t.bodyText || '' }); setShowForm(true); }} className="p-1.5 text-foreground-muted hover:text-foreground rounded transition-colors inline-flex">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {templates.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-foreground-muted text-[13px]">{t('ablonbulunamad')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead className="bg-surface-elevated/50 text-foreground-muted font-medium border-b border-border text-[12px]">
                <tr>
                  <th className="px-6 py-3">{t('Alc')}</th>
                  <th className="px-6 py-3">{t('Konu')}</th>
                  <th className="px-6 py-3">{t('Tarih')}</th>
                  <th className="px-6 py-3">{t('Durum')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-foreground">{log.recipientEmail}</td>
                    <td className="px-6 py-3 text-foreground-secondary">{log.subject}</td>
                    <td className="px-6 py-3 text-foreground-secondary">
                      {new Date(log.createdAt).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-3">
                      {log.status === 'sent' ? (
                        <span className="text-emerald-500 flex items-center gap-1.5 font-medium"><CheckCircle2 className="w-3.5 h-3.5" />{t('Gnderildi')}</span>
                      ) : log.status === 'failed' ? (
                        <span className="text-red-500 flex items-center gap-1.5 font-medium"><XCircle className="w-3.5 h-3.5" />{t('Hata')}</span>
                      ) : (
                        <span className="text-orange-500 font-medium">{t('Kuyrukta')}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-foreground-muted text-[13px]">{t('Logbulunamad')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
