'use client';
import { useTranslations } from 'next-intl';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { BookOpen, Plus, Save, Trash2, Edit, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminKBPage() {
  const t = useTranslations('Admin');
  const token = useAuthStore(state => state.token);
  const [categories, setCategories] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCatForm, setShowCatForm] = useState(false);
  const [catForm, setCatForm] = useState({ id: '', name: '', description: '', sortOrder: 0, isVisible: true });

  const [showArtForm, setShowArtForm] = useState(false);
  const [artForm, setArtForm] = useState({ id: '', categoryId: '', title: '', excerpt: '', content: '', status: 'published' });

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, artRes] = await Promise.all([
        api.get<any>('/kb/admin/categories'),
        api.get<any>('/kb/admin/articles')
      ]);
      if (catRes.categories) setCategories(catRes.categories);
      if (artRes.articles) setArticles(artRes.articles);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSaveCat = async () => {
    try {
      if (catForm.id) await api.put(`/kb/admin/categories/${catForm.id}`, catForm);
      else await api.post('/kb/admin/categories', catForm);
      setShowCatForm(false);
      fetchData();
    } catch (err) { console.error(err); alert('Hata'); }
  };

  const handleSaveArt = async () => {
    try {
      if (artForm.id) await api.put(`/kb/admin/articles/${artForm.id}`, artForm);
      else await api.post('/kb/admin/articles', artForm);
      setShowArtForm(false);
      fetchData();
    } catch (err) { console.error(err); alert('Hata'); }
  };

  const deleteCat = async (id: string) => {
    if (!confirm('Emin misiniz?')) return;
    try { await api.delete(`/kb/admin/categories/${id}`); fetchData(); } catch (err) { console.error(err); alert('Hata'); }
  };

  const deleteArt = async (id: string) => {
    if (!confirm('Emin misiniz?')) return;
    try { await api.delete(`/kb/admin/articles/${id}`); fetchData(); } catch (err) { console.error(err); alert('Hata'); }
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
            <BookOpen className="w-6 h-6" /> Bilgi Bankası
          </h1>
          <p className="text-sm text-foreground-muted">{t('Destekmakaleler')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Categories */}
        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-surface-elevated/50 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">{t('Kategoriler')}</h2>
            <button 
              onClick={() => { setCatForm({ id: '', name: '', description: '', sortOrder: 0, isVisible: true }); setShowCatForm(true); }}
              className="p-1.5 bg-foreground text-background rounded hover:bg-foreground/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showCatForm && (
            <div className="p-4 bg-surface-raised/30 border-b border-border space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">{t('KategoriAd')}</label>
                <input type="text" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isVisible" checked={catForm.isVisible} onChange={e => setCatForm({...catForm, isVisible: e.target.checked})} className="rounded bg-surface border-border text-primary focus:ring-primary focus:ring-offset-background" />
                <label htmlFor="isVisible" className="text-[13px] text-foreground">{t('Grnr')}</label>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowCatForm(false)} className="px-3 py-1.5 text-[12px] font-medium text-foreground-muted hover:text-foreground">{t('ptal')}</button>
                <button onClick={handleSaveCat} className="px-3 py-1.5 bg-foreground text-background font-medium text-[12px] rounded-md hover:bg-foreground/90 flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5" /> Kaydet
                </button>
              </div>
            </div>
          )}

          <div className="divide-y divide-border">
            {categories.map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between hover:bg-surface-raised/50 transition-colors">
                <div>
                  <h3 className="text-sm font-medium text-foreground">{c.name}</h3>
                  <p className="text-[11px] text-foreground-muted mt-0.5">{c.isVisible ? 'Görünür' : 'Gizli'}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setCatForm({ id: c.id, name: c.name, description: c.description || '', sortOrder: c.sortOrder, isVisible: c.isVisible }); setShowCatForm(true); }} className="p-1.5 text-foreground-muted hover:text-foreground rounded"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteCat(c.id)} className="p-1.5 text-foreground-muted hover:text-red-500 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div className="xl:col-span-2 bg-surface border border-border rounded-md overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-surface-elevated/50 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">{t('Makaleler')}</h2>
            <button 
              onClick={() => { setArtForm({ id: '', categoryId: '', title: '', excerpt: '', content: '', status: 'published' }); setShowArtForm(true); }}
              className="px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded hover:bg-foreground/90 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Yeni Makale
            </button>
          </div>

          {showArtForm && (
            <div className="p-6 bg-surface-raised/30 border-b border-border space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('MakaleBal')}</label>
                  <input type="text" value={artForm.title} onChange={e => setArtForm({...artForm, title: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('Kategori')}</label>
                  <select value={artForm.categoryId} onChange={e => setArtForm({...artForm, categoryId: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none">
                    <option value="">{t('KategoriSein')}</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('Durum')}</label>
                  <select value={artForm.status} onChange={e => setArtForm({...artForm, status: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none">
                    <option value="published">{t('Yaynda')}</option>
                    <option value="draft">{t('Taslak')}</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('Ksazet')}</label>
                  <input type="text" value={artForm.excerpt} onChange={e => setArtForm({...artForm, excerpt: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('erikHTMLdestekl')}</label>
                  <textarea rows={8} value={artForm.content} onChange={e => setArtForm({...artForm, content: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none resize-none font-mono" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowArtForm(false)} className="px-4 py-2 text-[13px] font-medium text-foreground-muted hover:text-foreground">{t('ptal')}</button>
                <button onClick={handleSaveArt} className="px-4 py-2 bg-foreground text-background font-medium text-[13px] rounded-md hover:bg-foreground/90 flex items-center gap-2">
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
                  <th className="px-6 py-3">{t('Kategori')}</th>
                  <th className="px-6 py-3">{t('Grntlenme')}</th>
                  <th className="px-6 py-3">{t('Durum')}</th>
                  <th className="px-6 py-3 text-right">{t('lemler')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {articles.map((a) => (
                  <tr key={a.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-foreground">{a.title}</td>
                    <td className="px-6 py-3 text-foreground-secondary">{a.categoryName || '-'}</td>
                    <td className="px-6 py-3 text-foreground-secondary">{a.views}</td>
                    <td className="px-6 py-3">
                      {a.status === 'published' ? <span className="text-emerald-500 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/>{t('Yaynda')}</span> : <span className="text-foreground-muted flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5"/>{t('Taslak')}</span>}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => { setArtForm({ id: a.id, categoryId: a.categoryId || '', title: a.title, excerpt: a.excerpt || '', content: a.content || '', status: a.status }); setShowArtForm(true); }} className="p-1.5 text-foreground-muted hover:text-foreground rounded transition-colors mr-2 inline-flex"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteArt(a.id)} className="p-1.5 text-foreground-muted hover:text-red-500 rounded transition-colors inline-flex"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
                {articles.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-foreground-muted text-[13px]">{t('Makalebulunamad')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
