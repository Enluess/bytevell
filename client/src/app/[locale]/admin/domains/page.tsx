'use client';
import { useTranslations } from 'next-intl';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Globe, Plus, Save, Trash2, Edit, Network } from 'lucide-react';
import Link from 'next/link';

export default function AdminDomainsPage() {
  const t = useTranslations('Admin');
  const token = useAuthStore(state => state.token);
  const [activeTab, setActiveTab] = useState<'domains' | 'registrars' | 'pricing'>('domains');
  
  const [domains, setDomains] = useState<any[]>([]);
  const [registrars, setRegistrars] = useState<any[]>([]);
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [showRegForm, setShowRegForm] = useState(false);
  const [regForm, setRegForm] = useState({ name: '', type: 'manual' });
  
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [priceForm, setPriceForm] = useState({ id: '', registrarId: '', tld: '', registerPrice: '', renewPrice: '', transferPrice: '', currency: 'TRY' });

  useEffect(() => {
    fetchData();
  }, [token, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'domains') {
        const res = await api.get<any>('/domains/admin/all');
        if (res.domains) setDomains(res.domains);
      } else if (activeTab === 'registrars') {
        const res = await api.get<any>('/domains/admin/registrars');
        if (res.registrars) setRegistrars(res.registrars);
      } else if (activeTab === 'pricing') {
        const [pRes, rRes] = await Promise.all([
          api.get<any>('/domains/admin/tld-prices'),
          api.get<any>('/domains/admin/registrars') // Need registrars for the dropdown
        ]);
        if (pRes.prices) setPrices(pRes.prices);
        if (rRes.registrars) setRegistrars(rRes.registrars);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSaveRegistrar = async () => {
    try {
      await api.post('/domains/admin/registrars', regForm);
      setShowRegForm(false);
      fetchData();
    } catch (err) { console.error(err); alert('Hata'); }
  };

  const handleSavePrice = async () => {
    try {
      await api.post('/domains/admin/tld-prices', priceForm);
      setShowPriceForm(false);
      fetchData();
    } catch (err) { console.error(err); alert('Hata'); }
  };

  if (loading && domains.length === 0 && registrars.length === 0 && prices.length === 0) {
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
          <Globe className="w-6 h-6" /> Domain Yönetimi
        </h1>
        <p className="text-sm text-foreground-muted">{t('Tmdomainleriyaz')}</p>
      </div>

      <div className="flex border-b border-border">
        <button onClick={() => setActiveTab('domains')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'domains' ? 'border-primary text-primary' : 'border-transparent text-foreground-muted hover:text-foreground'}`}>
          Tüm Domainler
        </button>
        <button onClick={() => setActiveTab('pricing')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'pricing' ? 'border-primary text-primary' : 'border-transparent text-foreground-muted hover:text-foreground'}`}>
          TLD Fiyatlandırma
        </button>
        <button onClick={() => setActiveTab('registrars')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'registrars' ? 'border-primary text-primary' : 'border-transparent text-foreground-muted hover:text-foreground'}`}>
          Yazmanlar (Registrars)
        </button>
      </div>

      {activeTab === 'domains' && (
        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead className="bg-surface-elevated/50 text-foreground-muted font-medium border-b border-border text-[12px]">
                <tr>
                  <th className="px-6 py-3">{t('Domain')}</th>
                  <th className="px-6 py-3">{t('Mteri')}</th>
                  <th className="px-6 py-3">{t('BitiTarihi')}</th>
                  <th className="px-6 py-3">{t('Durum')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {domains.map((d) => (
                  <tr key={d.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-foreground">{d.domainName}</td>
                    <td className="px-6 py-3">
                      <Link href={`/admin/users/${d.userId}`} className="text-foreground-secondary hover:text-primary transition-colors">
                        {d.userName}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-foreground-secondary">
                      {d.expirationDate ? new Date(d.expirationDate).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        d.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                        d.status === 'expired' ? 'bg-red-500/10 text-red-500' :
                        'bg-orange-500/10 text-orange-500'
                      }`}>{d.status}</span>
                    </td>
                  </tr>
                ))}
                {domains.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-foreground-muted text-[13px]">{t('Domainbulunamad')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'registrars' && (
        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-surface-elevated/50 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">{t('APIYazmanlar')}</h2>
            <button 
              onClick={() => { setRegForm({ name: '', type: 'manual' }); setShowRegForm(true); }}
              className="px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded hover:bg-foreground/90 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Yeni Ekle
            </button>
          </div>

          {showRegForm && (
            <div className="p-6 bg-surface-raised/30 border-b border-border space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('YazmanAd')}</label>
                  <input type="text" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('Tr')}</label>
                  <select value={regForm.type} onChange={e => setRegForm({...regForm, type: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none">
                    <option value="manual">{t('ManuelAPIYok')}</option>
                    <option value="resellerclub">{t('ResellerClub')}</option>
                    <option value="namecheap">{t('Namecheap')}</option>
                    <option value="enom">{t('eNom')}</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowRegForm(false)} className="px-4 py-2 text-[13px] font-medium text-foreground-muted hover:text-foreground transition-colors">{t('ptal')}</button>
                <button onClick={handleSaveRegistrar} className="px-4 py-2 bg-foreground text-background font-medium text-[13px] rounded-md hover:bg-foreground/90 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> Kaydet
                </button>
              </div>
            </div>
          )}

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead className="bg-surface-elevated/50 text-foreground-muted font-medium border-b border-border text-[12px]">
                <tr>
                  <th className="px-6 py-3">{t('YazmanAd')}</th>
                  <th className="px-6 py-3">{t('Tr')}</th>
                  <th className="px-6 py-3">{t('Durum')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {registrars.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-foreground">{r.name}</td>
                    <td className="px-6 py-3 text-foreground-secondary">{r.type}</td>
                    <td className="px-6 py-3"><span className="text-emerald-500 font-medium">{t('Aktif')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-surface-elevated/50 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">{t('TLDFiyatlandrma')}</h2>
            <button 
              onClick={() => { setPriceForm({ id: '', registrarId: '', tld: '', registerPrice: '', renewPrice: '', transferPrice: '', currency: 'TRY' }); setShowPriceForm(true); }}
              className="px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded hover:bg-foreground/90 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Fiyat Ekle
            </button>
          </div>

          {showPriceForm && (
            <div className="p-6 bg-surface-raised/30 border-b border-border space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('TLDUzantsrncom')}</label>
                  <input type="text" value={priceForm.tld} onChange={e => setPriceForm({...priceForm, tld: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('BalYazmanRegist')}</label>
                  <select value={priceForm.registrarId} onChange={e => setPriceForm({...priceForm, registrarId: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none">
                    <option value="">{t('Seiniz')}</option>
                    {registrars.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('KaytFiyat')}</label>
                  <input type="number" value={priceForm.registerPrice} onChange={e => setPriceForm({...priceForm, registerPrice: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('YenilemeFiyat')}</label>
                  <input type="number" value={priceForm.renewPrice} onChange={e => setPriceForm({...priceForm, renewPrice: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('TransferFiyat')}</label>
                  <input type="number" value={priceForm.transferPrice} onChange={e => setPriceForm({...priceForm, transferPrice: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('ParaBirimi')}</label>
                  <input type="text" value={priceForm.currency} onChange={e => setPriceForm({...priceForm, currency: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowPriceForm(false)} className="px-4 py-2 text-[13px] font-medium text-foreground-muted hover:text-foreground transition-colors">{t('ptal')}</button>
                <button onClick={handleSavePrice} className="px-4 py-2 bg-foreground text-background font-medium text-[13px] rounded-md hover:bg-foreground/90 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> Kaydet
                </button>
              </div>
            </div>
          )}

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead className="bg-surface-elevated/50 text-foreground-muted font-medium border-b border-border text-[12px]">
                <tr>
                  <th className="px-6 py-3">{t('TLD')}</th>
                  <th className="px-6 py-3">{t('Yazman')}</th>
                  <th className="px-6 py-3 text-right">{t('Kayt')}</th>
                  <th className="px-6 py-3 text-right">{t('Yenileme')}</th>
                  <th className="px-6 py-3 text-right">{t('Transfer')}</th>
                  <th className="px-6 py-3 text-right">{t('lem')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {prices.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-foreground">{p.tld}</td>
                    <td className="px-6 py-3 text-foreground-secondary">{p.registrarName}</td>
                    <td className="px-6 py-3 text-right text-foreground-secondary">{parseFloat(p.registerPrice).toFixed(2)} {p.currency}</td>
                    <td className="px-6 py-3 text-right text-foreground-secondary">{parseFloat(p.renewPrice).toFixed(2)} {p.currency}</td>
                    <td className="px-6 py-3 text-right text-foreground-secondary">{parseFloat(p.transferPrice).toFixed(2)} {p.currency}</td>
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => { setPriceForm({ ...p }); setShowPriceForm(true); }} className="p-1.5 text-foreground-muted hover:text-foreground rounded transition-colors inline-flex">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {prices.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-foreground-muted text-[13px]">{t('Fiyatlandrmabul')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
