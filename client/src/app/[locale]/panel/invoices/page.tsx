'use client';

import { useTranslations } from 'next-intl';
import { Receipt, CheckCircle2, Clock, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';

export default function InvoicesPage() {
  const t = useTranslations('Panel.Invoices');
  
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const json = await api.get<{ success: boolean; invoices: any[] }>('/invoices');
      setInvoices(json.invoices || []);
    } catch (err: any) {
      console.error("Failed to fetch invoices", err);
      setError(err.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const payInvoice = async (id: string) => {
    setPaying(id);
    setMessage('');
    setError('');
    try {
      const json = await api.post<{ success: boolean; message?: string }>(`/invoices/${id}/pay`);
      setMessage(json.message || t('pay_success'));
      fetchInvoices();
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Payment failed');
      }
      setTimeout(() => setError(''), 3000);
    } finally {
      setPaying(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div>
          <div className="h-7 w-48 bg-surface rounded mb-2 border border-border"></div>
          <div className="h-4 w-72 bg-surface rounded border border-border"></div>
        </div>
        <div className="border border-border rounded-md bg-surface divide-y divide-border">
          {[1, 2, 3].map(i => (
            <div key={i} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-surface-elevated border border-border"></div>
                <div>
                  <div className="h-4 w-32 bg-surface-elevated rounded mb-2"></div>
                  <div className="h-3 w-24 bg-surface-elevated rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="pb-8 border-b border-white/5">
        <h1 className="text-[32px] font-semibold tracking-tight text-white mb-2">{t('title')}</h1>
        <p className="text-[14px] text-white/50 tracking-wide">{t('subtitle')}</p>
      </div>

      {message && (
        <div className="px-6 py-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm font-medium backdrop-blur-md">
          {message}
        </div>
      )}
      
      {error && !paying && (
        <div className="px-6 py-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium backdrop-blur-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {invoices.length > 0 ? (
          invoices.map((invoice, i) => (
            <div 
              key={invoice.id} 
              className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.04] transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-6 backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                  <Receipt className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg tracking-tight mb-1 font-mono">
                    #{invoice.id.split('-')[0].toUpperCase()}
                  </h3>
                  <p className="text-[13px] text-white/50 font-mono tracking-wide">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:gap-10 w-full sm:w-auto relative z-10">
                <div className="flex flex-col sm:items-end">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1.5">{t('status')}</span>
                  <div className={`px-3 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase ${invoice.status === 'paid' ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' : invoice.status === 'unpaid' ? 'bg-orange-400/10 border-orange-400/20 text-orange-400' : 'bg-red-400/10 border-red-400/20 text-red-400'}`}>
                    {t(invoice.status) || invoice.status}
                  </div>
                </div>
                <div className="flex flex-col items-end min-w-[80px]">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1.5">{t('amount')}</span>
                  <span className="text-xl text-white font-semibold tracking-tight">₺{invoice.amount || invoice.total}</span>
                </div>

                {invoice.status === 'unpaid' && (
                  <button 
                    onClick={() => payInvoice(invoice.id)}
                    disabled={paying === invoice.id}
                    className="ml-6 bg-white text-black hover:bg-white/90 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold text-[13px] transition-all duration-300 flex items-center gap-2 tracking-wide"
                  >
                    {paying === invoice.id ? <Loader2 className="w-4 h-4 animate-spin" /> : t('pay_now')}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-20 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
            <Receipt className="w-12 h-12 text-white/20 mb-4" />
            <h3 className="text-white font-medium text-lg tracking-tight mb-2">{t('no_invoices')}</h3>
            <p className="text-white/40 text-[14px] max-w-sm tracking-wide">{t('no_invoices_desc')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
