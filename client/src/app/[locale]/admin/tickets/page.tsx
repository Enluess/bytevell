'use client';

import { useTranslations } from 'next-intl';
import { Ticket, Loader2, Save, CheckCircle2, Circle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Link } from '@/i18n/routing';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminTicketsPage() {
  const t = useTranslations('Admin.Tickets');
  const token = useAuthStore(state => state.token);
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const fetchTickets = async () => {
    try {
      const res = await api.get<any>('/admin/tickets');
      if (res.tickets) {
        setTickets(res.tickets);
        const initialStatuses: Record<string, string> = {};
        res.tickets.forEach((tick: any) => {
          initialStatuses[tick.id] = tick.status;
        });
        setStatuses(initialStatuses);
      }
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    setMessage('');
    try {
      const newStatus = statuses[id];
      await api.put(`/admin/tickets/${id}/status`, { status: newStatus });
      setMessage('Destek talebi güncellendi.');
      fetchTickets();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Güncelleme başarısız.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSavingId(null);
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
              <th className="px-6 py-4">{t('Konu')}</th>
              <th className="px-6 py-4">{t('Sahibi')}</th>
              <th className="px-6 py-4">{t('ncelik')}</th>
              <th className="px-6 py-4">{t('Durum')}</th>
              <th className="px-6 py-4">{t('Tarih')}</th>
              <th className="px-6 py-4 text-right">{t('Eylemler')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-surface-raised transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                      ticket.status === 'open' ? 'bg-orange-400/10 text-orange-400' : 'bg-surface-elevated text-foreground-muted'
                    }`}>
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground text-sm max-w-[200px] truncate">{ticket.subject}</h3>
                      <p className="text-xs text-foreground-secondary uppercase">#{ticket.id.substring(0,8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-foreground">{ticket.userName || 'İsimsiz'}</div>
                  <div className="text-xs text-foreground-secondary">{ticket.userEmail}</div>
                </td>
                <td className="px-6 py-4 text-foreground-secondary uppercase">{ticket.priority}</td>
                <td className="px-6 py-4">
                  <select 
                    value={statuses[ticket.id] || 'open'}
                    onChange={(e) => setStatuses({ ...statuses, [ticket.id]: e.target.value })}
                    className="bg-background border border-border rounded px-2 py-1 text-foreground text-xs outline-none focus:border-primary"
                  >
                    <option value="open">{t('AkOpen')}</option>
                    <option value="answered">{t('YantlandAnswere')}</option>
                    <option value="closed">{t('KapalClosed')}</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-foreground-secondary">
                  {new Date(ticket.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleSave(ticket.id)}
                      disabled={savingId === ticket.id || statuses[ticket.id] === ticket.status}
                      className="px-3 py-1.5 bg-surface-elevated hover:bg-surface-raised text-foreground rounded text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {savingId === ticket.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Kaydet
                    </button>
                    <Link 
                      href={`/admin/tickets/${ticket.id}`} 
                      className="px-3 py-1.5 bg-foreground text-background hover:bg-foreground/90 rounded text-xs font-medium transition-colors"
                    >
                      Detay
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-foreground-muted text-[13px]">
                  Destek talebi bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
