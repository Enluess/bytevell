'use client';

import { useTranslations } from 'next-intl';
import { Ticket, Loader2, MessageSquare, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Link } from '@/i18n/routing';
import { api, ApiError } from '@/lib/api';

export default function TicketsPage() {
  const t = useTranslations('Panel.Tickets');
  const user = useAuthStore(state => state.user);
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const json = await api.get<{ success: boolean; tickets: any[] }>('/tickets');
      setTickets(json.tickets || []);
    } catch (err: any) {
      console.error("Failed to fetch tickets", err);
      setError(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setError('');
    try {
      const json = await api.post<{ success: boolean; message: string }>('/tickets', { 
        subject, 
        message, 
        priority 
      });
      
      setSuccessMsg(json.message || t('success'));
      setSubject('');
      setMessage('');
      setShowNew(false);
      fetchTickets();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create ticket');
      }
      setTimeout(() => setError(''), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="h-7 w-48 bg-surface rounded mb-2 border border-border"></div>
            <div className="h-4 w-72 bg-surface rounded border border-border"></div>
          </div>
          <div className="h-8 w-28 bg-surface rounded-md border border-border"></div>
        </div>
        <div className="border border-border rounded-md bg-surface divide-y divide-border">
          {[1, 2, 3].map(i => (
            <div key={i} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-surface-elevated border border-border"></div>
                <div>
                  <div className="h-4 w-48 bg-surface-elevated rounded mb-2"></div>
                  <div className="h-3 w-32 bg-surface-elevated rounded"></div>
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-white/5">
        <div>
          <h1 className="text-[32px] font-semibold tracking-tight text-white mb-2">{t('title')}</h1>
          <p className="text-[14px] text-white/50 tracking-wide">{t('subtitle')}</p>
        </div>
        <button 
          onClick={() => setShowNew(!showNew)}
          className="bg-white text-black hover:bg-white/90 px-6 py-3 rounded-xl text-[14px] font-semibold transition-all duration-300 flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          <MessageSquare className="w-4 h-4" />
          {t('new_ticket')}
        </button>
      </div>

      {successMsg && (
        <div className="px-6 py-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm font-medium backdrop-blur-md">
          {successMsg}
        </div>
      )}
      
      {error && !showNew && (
        <div className="px-6 py-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium backdrop-blur-md">
          {error}
        </div>
      )}

      {showNew && (
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <form onSubmit={handleCreate} className="space-y-6">
            {error && (
              <div className="px-6 py-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium backdrop-blur-md">
                {error}
              </div>
            )}
            <div>
              <label className="block text-[11px] uppercase tracking-widest font-bold text-white/30 mb-3">{t('subject')}</label>
              <input 
                type="text" 
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-white/30 transition-all text-[15px]"
                placeholder={t('placeholder_subject')}
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest font-bold text-white/30 mb-3">{t('message')}</label>
              <textarea 
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-white/30 transition-all resize-none text-[15px]"
                placeholder={t('placeholder_message')}
              />
            </div>
            <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
              <button 
                type="button"
                onClick={() => setShowNew(false)}
                className="px-6 py-3 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all text-[14px] font-semibold"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submitting}
                className="bg-white text-black hover:bg-white/90 disabled:opacity-50 px-6 py-3 rounded-xl text-[14px] font-semibold transition-all flex items-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {t('send')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {tickets.length > 0 ? (
          tickets.map((ticket, i) => (
            <Link 
              href={`/panel/tickets/${ticket.id}`}
              key={ticket.id} 
              className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.04] transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-6 backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                  <Ticket className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg max-w-[280px] sm:max-w-md truncate tracking-tight mb-1">
                    {ticket.subject}
                  </h3>
                  <p className="text-[13px] text-white/50 mt-1 font-mono tracking-wide">
                    #{ticket.id.split('-')[0].toUpperCase()} <span className="text-white/20 mx-2">•</span> <span className="font-sans">{t('created')}: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:gap-10 w-full sm:w-auto relative z-10">
                <div className="flex flex-col sm:items-end">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1.5">{t('status')}</span>
                  <div className={`px-3 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase ${
                    ticket.status === 'open' ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' : 
                    ticket.status === 'customer_reply' ? 'bg-orange-400/10 border-orange-400/20 text-orange-400' :
                    ticket.status === 'answered' ? 'bg-blue-400/10 border-blue-400/20 text-blue-400' : 'bg-white/5 border-white/10 text-white/50'
                  }`}>
                    {t(ticket.status) || ticket.status}
                  </div>
                </div>
                <div className="flex flex-col items-end min-w-[80px]">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1.5">{t('priority')}</span>
                  <span className="text-[14px] text-white font-medium capitalize tracking-wide">{t(ticket.priority) || ticket.priority}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="px-6 py-20 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
            <MessageSquare className="w-12 h-12 text-white/20 mb-4" />
            <h3 className="text-white font-medium text-lg tracking-tight mb-2">{t('no_tickets')}</h3>
            <p className="text-white/40 text-[14px] tracking-wide">{t('no_tickets_desc')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
