'use client';
import { useTranslations } from 'next-intl';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Box, Plus, Save, Trash2, Edit } from 'lucide-react';

export default function AdminProductsPage() {
  const t = useTranslations('Admin');
  const token = useAuthStore(state => state.token);
  const [activeTab, setActiveTab] = useState<'products' | 'groups'>('products');
  
  const [products, setProducts] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupForm, setGroupForm] = useState({ id: '', name: '', slug: '', description: '', sortOrder: 0, isVisible: true });
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState<{ id: string, groupId: string, type: string, name: string, slug: string, description: string, status: string, stockControl: boolean, stockQuantity: number, features: any, monthlyPrice: string, priceId: string }>({ id: '', groupId: '', type: 'hosting', name: '', slug: '', description: '', status: 'active', stockControl: false, stockQuantity: 0, features: {}, monthlyPrice: '', priceId: '' });

  useEffect(() => {
    fetchData();
  }, [token, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'products') {
        const [pRes, gRes] = await Promise.all([
          api.get<any>('/products'),
          api.get<any>('/products/groups')
        ]);
        if (pRes.products) setProducts(pRes.products);
        if (gRes.groups) setGroups(gRes.groups);
      } else if (activeTab === 'groups') {
        const res = await api.get<any>('/products/groups');
        if (res.groups) setGroups(res.groups);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSaveGroup = async () => {
    try {
      if (groupForm.id) await api.put(`/products/groups/${groupForm.id}`, groupForm);
      else await api.post('/products/groups', groupForm);
      setShowGroupForm(false);
      fetchData();
    } catch (err) { console.error(err); alert('Hata'); }
  };

  const handleSaveProduct = async () => {
    try {
      const payload = {
        ...productForm,
        prices: [{ billingCycle: 'monthly', recurringPrice: productForm.monthlyPrice || '0.00', currency: 'TRY' }]
      };
      if (productForm.id) {
        await api.put(`/products/${productForm.id}`, payload);
        await api.post(`/products/${productForm.id}/prices`, { priceId: productForm.priceId, billingCycle: 'monthly', recurringPrice: productForm.monthlyPrice || '0.00', currency: 'TRY' });
      } else {
        await api.post('/products', payload);
      }
      setShowProductForm(false);
      fetchData();
    } catch (err) { console.error(err); alert('Hata'); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/products/${id}`);
      if (productForm.id === id) setShowProductForm(false);
      fetchData();
    } catch (err) { console.error(err); alert('Hata'); }
  };

  const handleDeleteGroup = async (id: string) => {
    if (!window.confirm('Bu grubu silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/products/groups/${id}`);
      if (groupForm.id === id) setShowGroupForm(false);
      fetchData();
    } catch (err) { console.error(err); alert('Hata'); }
  };

  if (loading && products.length === 0 && groups.length === 0) {
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
          <Box className="w-6 h-6" /> Ürün & Katalog
        </h1>
        <p className="text-sm text-foreground-muted">{t('Satlanhizmetler')}</p>
      </div>

      <div className="flex border-b border-border">
        <button onClick={() => setActiveTab('products')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'products' ? 'border-primary text-primary' : 'border-transparent text-foreground-muted hover:text-foreground'}`}>
          Ürünler
        </button>
        <button onClick={() => setActiveTab('groups')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'groups' ? 'border-primary text-primary' : 'border-transparent text-foreground-muted hover:text-foreground'}`}>
          Kategoriler (Gruplar)
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-surface-elevated/50 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">{t('rnListesi')}</h2>
            <button 
              onClick={() => { setProductForm({ id: '', groupId: '', type: 'vps', name: '', slug: '', description: '', status: 'active', stockControl: false, stockQuantity: 0, features: {}, monthlyPrice: '', priceId: '' }); setShowProductForm(true); }}
              className="px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded hover:bg-foreground/90 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Yeni Ürün
            </button>
          </div>

          {showProductForm && (
            <div className="p-6 bg-surface-raised/30 border-b border-border space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('KategoriGrup')}</label>
                  <select value={productForm.groupId} onChange={e => setProductForm({...productForm, groupId: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none">
                    <option value="">{t('Seiniz')}</option>
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('rnAd')}</label>
                  <input type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('Tr')}</label>
                  <select value={productForm.type} onChange={e => setProductForm({...productForm, type: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none">
                    <option value="hosting">{t('WebHosting')}</option>
                    <option value="vps">{t('VPSVDS')}</option>
                    <option value="dedicated">{t('DedicatedServer')}</option>
                    <option value="domain">{t('Domain')}</option>
                    <option value="license">{t('YazlmLisans')}</option>
                    <option value="other">{t('Dier')}</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('zelliklerRozetl') || 'Teknik Özellikler'}</label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] text-foreground-muted mb-1">CPU</label>
                      <input type="text" value={productForm.features.cpu || ''} onChange={e => setProductForm({...productForm, features: {...productForm.features, cpu: e.target.value}})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" placeholder="Örn: 2 Core" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-foreground-muted mb-1">RAM</label>
                      <input type="text" value={productForm.features.ram || ''} onChange={e => setProductForm({...productForm, features: {...productForm.features, ram: e.target.value}})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" placeholder="Örn: 4 GB" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-foreground-muted mb-1">Disk</label>
                      <input type="text" value={productForm.features.disk || ''} onChange={e => setProductForm({...productForm, features: {...productForm.features, disk: e.target.value}})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" placeholder="Örn: 40 GB NVMe" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-foreground-muted mb-1">Bant Genişliği</label>
                      <input type="text" value={productForm.features.bandwidth || ''} onChange={e => setProductForm({...productForm, features: {...productForm.features, bandwidth: e.target.value}})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" placeholder="Örn: 100 Mbit/s" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-foreground-muted mb-1">İşletim Sistemi</label>
                      <input type="text" value={productForm.features.os || ''} onChange={e => setProductForm({...productForm, features: {...productForm.features, os: e.target.value}})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" placeholder="Örn: Linux / Windows" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-foreground-muted mb-1">DDoS Koruması</label>
                      <input type="text" value={productForm.features.ddos || ''} onChange={e => setProductForm({...productForm, features: {...productForm.features, ddos: e.target.value}})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" placeholder="Örn: Ücretsiz" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] text-foreground-muted mb-1">Ekstra (Virgülle ayırın)</label>
                      <input type="text" value={productForm.features.extras || ''} onChange={e => setProductForm({...productForm, features: {...productForm.features, extras: e.target.value}})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" placeholder="Örn: Haftalık Yedek, 7/24 Destek" />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('AklamaDetaylNot')}</label>
                  <textarea rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('AylkFiyat')}</label>
                  <input type="text" value={productForm.monthlyPrice} onChange={e => setProductForm({...productForm, monthlyPrice: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" placeholder={t('rn29990')} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('Durum')}</label>
                  <select value={productForm.status} onChange={e => setProductForm({...productForm, status: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none">
                    <option value="active">{t('Aktif')}</option>
                    <option value="hidden">{t('Gizli')}</option>
                    <option value="retired">{t('Kaldrlm')}</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer h-[38px]">
                    <input type="checkbox" checked={productForm.stockControl} onChange={e => setProductForm({...productForm, stockControl: e.target.checked})} className="rounded bg-surface border-border text-primary focus:ring-primary focus:ring-offset-background" />
                    <span className="text-[13px] text-foreground">{t('StokKontrolAk')}</span>
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('StokMiktar')}</label>
                  <input type="number" disabled={!productForm.stockControl} value={productForm.stockQuantity} onChange={e => setProductForm({...productForm, stockQuantity: parseInt(e.target.value)})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none disabled:opacity-50" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowProductForm(false)} className="px-4 py-2 text-[13px] font-medium text-foreground-muted hover:text-foreground transition-colors">{t('ptal')}</button>
                <button onClick={handleSaveProduct} className="px-4 py-2 bg-foreground text-background font-medium text-[13px] rounded-md hover:bg-foreground/90 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> Kaydet
                </button>
              </div>
            </div>
          )}

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead className="bg-surface-elevated/50 text-foreground-muted font-medium border-b border-border text-[12px]">
                <tr>
                  <th className="px-6 py-3">{t('rn')}</th>
                  <th className="px-6 py-3">{t('Grup')}</th>
                  <th className="px-6 py-3">{t('Tr')}</th>
                  <th className="px-6 py-3">{t('Stok')}</th>
                  <th className="px-6 py-3">{t('Durum')}</th>
                  <th className="px-6 py-3 text-right">{t('lem')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-foreground">{p.name}</td>
                    <td className="px-6 py-3 text-foreground-secondary">{p.groupName || '-'}</td>
                    <td className="px-6 py-3 text-foreground-secondary capitalize">{p.type}</td>
                    <td className="px-6 py-3 text-foreground-secondary">{p.stockControl ? p.stockQuantity : '∞'}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${p.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>{p.status}</span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => {
                        const monthlyPriceObj = p.prices?.find((pr: any) => pr.billingCycle === 'monthly');
                        setProductForm({ id: p.id, groupId: p.groupId || '', type: p.type, name: p.name, slug: p.slug, description: p.description || '', status: p.status, stockControl: p.stockControl, stockQuantity: p.stockQuantity || 0, features: (typeof p.features === 'object' && !Array.isArray(p.features) && p.features !== null) ? p.features : {}, monthlyPrice: monthlyPriceObj?.recurringPrice || '', priceId: monthlyPriceObj?.id || '' });
                        setShowProductForm(true); 
                      }} className="p-1.5 text-foreground-muted hover:text-foreground rounded transition-colors mr-2 inline-flex">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 text-rose-500/70 hover:text-rose-500 rounded transition-colors inline-flex">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-foreground-muted text-[13px]">{t('rnbulunamad')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-surface-elevated/50 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">{t('rnGruplar')}</h2>
            <button 
              onClick={() => { setGroupForm({ id: '', name: '', slug: '', description: '', sortOrder: 0, isVisible: true }); setShowGroupForm(true); }}
              className="px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded hover:bg-foreground/90 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Yeni Grup
            </button>
          </div>

          {showGroupForm && (
            <div className="p-6 bg-surface-raised/30 border-b border-border space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('GrupAd')}</label>
                  <input type="text" value={groupForm.name} onChange={e => setGroupForm({...groupForm, name: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('URLSlugOtomatik')}</label>
                  <input type="text" value={groupForm.slug} disabled className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none disabled:opacity-50" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('Aklama')}</label>
                  <input type="text" value={groupForm.description} onChange={e => setGroupForm({...groupForm, description: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer h-full">
                    <input type="checkbox" checked={groupForm.isVisible} onChange={e => setGroupForm({...groupForm, isVisible: e.target.checked})} className="rounded bg-surface border-border text-primary focus:ring-primary focus:ring-offset-background" />
                    <span className="text-[13px] text-foreground">{t('SitedeGrnr')}</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowGroupForm(false)} className="px-4 py-2 text-[13px] font-medium text-foreground-muted hover:text-foreground transition-colors">{t('ptal')}</button>
                <button onClick={handleSaveGroup} className="px-4 py-2 bg-foreground text-background font-medium text-[13px] rounded-md hover:bg-foreground/90 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> Kaydet
                </button>
              </div>
            </div>
          )}

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead className="bg-surface-elevated/50 text-foreground-muted font-medium border-b border-border text-[12px]">
                <tr>
                  <th className="px-6 py-3">{t('GrupAd')}</th>
                  <th className="px-6 py-3">{t('Slug')}</th>
                  <th className="px-6 py-3">{t('Sra')}</th>
                  <th className="px-6 py-3">{t('Durum')}</th>
                  <th className="px-6 py-3 text-right">{t('lem')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {groups.map((g) => (
                  <tr key={g.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-foreground">{g.name}</td>
                    <td className="px-6 py-3 text-foreground-secondary">{g.slug}</td>
                    <td className="px-6 py-3 text-foreground-secondary">{g.sortOrder}</td>
                    <td className="px-6 py-3">
                      {g.isVisible ? <span className="text-emerald-500 font-medium">{t('Grnr')}</span> : <span className="text-foreground-muted">{t('Gizli')}</span>}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => { setGroupForm({ id: g.id, name: g.name, slug: g.slug, description: g.description || '', sortOrder: g.sortOrder, isVisible: g.isVisible }); setShowGroupForm(true); }} className="p-1.5 text-foreground-muted hover:text-foreground rounded transition-colors mr-2 inline-flex">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteGroup(g.id)} className="p-1.5 text-rose-500/70 hover:text-rose-500 rounded transition-colors inline-flex">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
