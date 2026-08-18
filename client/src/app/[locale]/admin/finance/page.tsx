'use client';
import { useTranslations } from 'next-intl';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Activity, Plus, Save, Trash2, Edit } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminFinancePage() {
  const t = useTranslations('Admin');
  const token = useAuthStore(state => state.token);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [taxRules, setTaxRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Currency form
  const [showCurrencyForm, setShowCurrencyForm] = useState(false);
  const [currencyForm, setCurrencyForm] = useState({ id: '', code: '', name: '', symbol: '', exchangeRate: '1.000000' });

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [currRes, taxRes] = await Promise.all([
        api.get<any>('/finance/currencies'),
        api.get<any>('/finance/tax-rules')
      ]);
      if (currRes.currencies) setCurrencies(currRes.currencies);
      if (taxRes.taxRules) setTaxRules(taxRes.taxRules);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const saveCurrency = async () => {
    try {
      if (currencyForm.id) {
        await api.put(`/finance/currencies/${currencyForm.id}`, currencyForm);
      } else {
        await api.post('/finance/currencies', currencyForm);
      }
      setShowCurrencyForm(false);
      fetchData();
    } catch (err) { console.error(err); alert('Hata oluştu.'); }
  };

  const deleteCurrency = async (id: string) => {
    if (!confirm('Emin misiniz?')) return;
    try {
      await api.delete(`/finance/currencies/${id}`);
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
          <Activity className="w-6 h-6" /> Finans & Vergiler
        </h1>
        <p className="text-sm text-foreground-muted">{t('Parabirimleridv')}</p>
      </div>

      {/* Currencies Section */}
      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-surface-elevated/50 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">{t('ParaBirimleri')}</h2>
          <button 
            onClick={() => { setCurrencyForm({ id: '', code: '', name: '', symbol: '', exchangeRate: '1.000000' }); setShowCurrencyForm(true); }}
            className="px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded hover:bg-foreground/90 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Yeni Para Birimi
          </button>
        </div>

        {showCurrencyForm && (
          <div className="p-6 bg-surface-raised/30 border-b border-border space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('KODrnUSD')}</label>
                <input type="text" value={currencyForm.code} onChange={e => setCurrencyForm({...currencyForm, code: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('simrnUSDollar')}</label>
                <input type="text" value={currencyForm.name} onChange={e => setCurrencyForm({...currencyForm, name: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('Sembolrn')}</label>
                <input type="text" value={currencyForm.symbol} onChange={e => setCurrencyForm({...currencyForm, symbol: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1.5">{t('Kurarpan')}</label>
                <input type="text" value={currencyForm.exchangeRate} onChange={e => setCurrencyForm({...currencyForm, exchangeRate: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCurrencyForm(false)} className="px-4 py-2 text-[13px] font-medium text-foreground-muted hover:text-foreground transition-colors">{t('ptal')}</button>
              <button onClick={saveCurrency} className="px-4 py-2 bg-foreground text-background font-medium text-[13px] rounded-md hover:bg-foreground/90 transition-colors flex items-center gap-2">
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
                <th className="px-6 py-3">{t('sim')}</th>
                <th className="px-6 py-3">{t('Sembol')}</th>
                <th className="px-6 py-3">{t('KurVarsaylanaGr')}</th>
                <th className="px-6 py-3">{t('Durum')}</th>
                <th className="px-6 py-3 text-right">{t('lemler')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currencies.map((curr) => (
                <tr key={curr.id} className="hover:bg-surface-raised/50 transition-colors">
                  <td className="px-6 py-3 font-medium text-foreground">{curr.code}</td>
                  <td className="px-6 py-3 text-foreground-secondary">{curr.name}</td>
                  <td className="px-6 py-3 text-foreground-secondary">{curr.symbol}</td>
                  <td className="px-6 py-3 text-foreground-secondary font-mono">{curr.exchangeRate}</td>
                  <td className="px-6 py-3">
                    {curr.isDefault ? <span className="text-xs text-primary font-medium">{t('Varsaylan')}</span> : <span className="text-xs text-foreground-muted">{t('Ek')}</span>}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => { setCurrencyForm(curr); setShowCurrencyForm(true); }} className="p-1.5 text-foreground-muted hover:text-foreground rounded transition-colors mr-2 inline-flex">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {!curr.isDefault && (
                      <button onClick={() => deleteCurrency(curr.id)} className="p-1.5 text-foreground-muted hover:text-red-500 rounded transition-colors inline-flex">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
