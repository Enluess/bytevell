'use client';

import { useTranslations } from 'next-intl';
import { Receipt, Loader2, Save, CheckCircle2, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminInvoicesPage() {
  const t = useTranslations('Admin.Invoices');
  const token = useAuthStore(state => state.token);
  
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchInvoices();
  }, [token]);

  const fetchInvoices = async () => {
    try {
      const res = await api.get<any>('/admin/invoices');
      if (res.invoices) {
        setInvoices(res.invoices);
        const initialStatuses: Record<string, string> = {};
        res.invoices.forEach((inv: any) => {
          initialStatuses[inv.id] = inv.status;
        });
        setStatuses(initialStatuses);
      }
    } catch (err) {
      console.error("Failed to fetch invoices", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    setMessage('');
    try {
      const newStatus = statuses[id];
      await api.put(`/admin/invoices/${id}/status`, { status: newStatus });
      setMessage('Fatura güncellendi.');
      fetchInvoices();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Güncelleme başarısız.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu faturayı silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/admin/invoices/${id}`);
      setMessage('Fatura silindi.');
      fetchInvoices();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">{t('title')}</h1>
          <p className="text-sm text-foreground-muted">{t('subtitle')}</p>
        </div>
        
        {message && (
          <div className="px-4 py-2 rounded bg-emerald-500/10 text-emerald-400 text-sm font-medium">
            {message}
          </div>
        )}
      </div>

      <div className="w-full rounded-md overflow-x-auto bg-surface border border-border">
        <table className="w-full text-left text-[13px] whitespace-nowrap">
          <thead className="bg-surface-elevated text-foreground-muted font-medium border-b border-border text-[12px]">
            <tr>
              <th className="px-6 py-4">{t('FaturaNoTutar')}</th>
              <th className="px-6 py-4">{t('Sahibi')}</th>
              <th className="px-6 py-4">{t('Tarih')}</th>
              <th className="px-6 py-4">{t('Durum')}</th>
              <th className="px-6 py-4 text-right">{t('Eylemler')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-surface-raised transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-elevated flex items-center justify-center shrink-0">
                      <Receipt className="w-4 h-4 text-foreground-muted" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground text-sm">₺{invoice.total || invoice.amount}</h3>
                      <p className="text-xs text-foreground-secondary uppercase">{invoice.invoiceNumber || invoice.id.substring(0,8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-foreground">{invoice.userName || 'İsimsiz'}</div>
                  <div className="text-xs text-foreground-secondary">{invoice.userEmail}</div>
                </td>
                <td className="px-6 py-4 text-foreground-secondary">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={statuses[invoice.id] || 'unpaid'}
                    onChange={(e) => setStatuses({ ...statuses, [invoice.id]: e.target.value })}
                    className="bg-background border border-border rounded px-2 py-1 text-foreground text-xs outline-none focus:border-primary"
                  >
                    <option value="paid">{t('dendiPaid')}</option>
                    <option value="unpaid">{t('denmediUnpaid')}</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleSave(invoice.id)}
                      disabled={savingId === invoice.id || statuses[invoice.id] === invoice.status}
                      className="px-3 py-1.5 bg-surface-elevated hover:bg-surface-raised text-foreground rounded text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {savingId === invoice.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Kaydet
                    </button>
                    <button 
                      onClick={() => handleDelete(invoice.id)}
                      className="px-3 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded text-xs font-medium transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-foreground-muted text-[13px]">
                  Fatura bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
