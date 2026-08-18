'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, ArrowLeft, Send, User, Server } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { api, ApiError } from '@/lib/api';

export default function TicketDetailPage() {
  const { id } = useParams();
  const t = useTranslations('Panel.TicketDetail');
  
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchTicket = async () => {
    try {
      const json = await api.get<{ success: boolean; ticket: any; messages: any[] }>(`/tickets/${id}`);
      setTicket(json.ticket);
      setMessages(json.messages || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setSubmitting(true);
    setError('');
    try {
      const json = await api.post<{ success: boolean; message: string; reply: any }>(`/tickets/${id}/reply`, { 
        message: reply 
      });
      
      setReply('');
      // Optionally just push the new message instead of fetching everything
      setMessages(prev => [...prev, json.reply]);
      setTicket((prev: any) => ({ ...prev, status: 'customer_reply' }));
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to send reply');
      }
      setTimeout(() => setError(''), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="h-96 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-foreground-muted" /></div>;
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-foreground-secondary bg-surface border border-border rounded-md mt-8">
        {error || t('not_found')}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="shrink-0 mb-8 border-b border-white/5 pb-8">
        <Link href="/panel/tickets" className="text-white/40 hover:text-white flex items-center gap-2 text-[13px] font-medium tracking-wide mb-6 transition-colors w-fit group">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          {t('back_to_tickets')}
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-semibold tracking-tight text-white mb-3 flex items-center gap-4">
              {ticket.subject}
              <div className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                ticket.status === 'open' ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' : 
                ticket.status === 'customer_reply' ? 'bg-orange-400/10 border-orange-400/20 text-orange-400' :
                ticket.status === 'answered' ? 'bg-blue-400/10 border-blue-400/20 text-blue-400' : 'bg-white/5 border-white/10 text-white/40'
              }`}>
                {ticket.status}
              </div>
            </h1>
            <p className="text-white/40 text-[14px] font-mono tracking-wide mt-1">
              {t('ticket')} <span className="text-white/70">#{ticket.id.split('-')[0].toUpperCase()}</span> • {t('created_at')} {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {error && !submitting && (
        <div className="shrink-0 px-6 py-4 mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-[14px] font-medium tracking-wide">
          {error}
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-8 pr-4 space-y-8 scrollbar-hide">
        {/* Initial Ticket Message */}
        {ticket.message && (
          <div className="flex gap-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 shrink-0 flex items-center justify-center text-white/50 shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-3xl rounded-tl-sm p-6 text-white backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                <span className="font-semibold text-[15px] tracking-tight">{t('you')}</span>
                <span className="text-[12px] font-mono text-white/30">{new Date(ticket.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-white/70 tracking-wide">{ticket.message}</p>
            </div>
          </div>
        )}

        {/* Replies */}
        {messages.map((msg: any) => {
          const isAdmin = msg.senderRole === 'ADMIN';
          return (
            <div key={msg.id} className={`flex gap-6 ${isAdmin ? 'flex-row-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center shadow-sm border ${
                isAdmin 
                  ? 'bg-blue-400/10 border-blue-400/20 text-blue-400' 
                  : 'bg-white/5 border-white/10 text-white/50'
              }`}>
                {isAdmin ? <Server className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`flex-1 max-w-[85%] border rounded-3xl p-6 text-white backdrop-blur-xl ${
                isAdmin 
                  ? 'bg-blue-400/[0.02] border-blue-400/10 rounded-tr-sm' 
                  : 'bg-white/[0.02] border-white/5 rounded-tl-sm'
              }`}>
                <div className={`flex items-center justify-between mb-4 border-b pb-4 ${isAdmin ? 'border-blue-400/10' : 'border-white/5'}`}>
                  <span className={`font-semibold text-[15px] tracking-tight ${isAdmin ? 'text-blue-400' : 'text-white'}`}>
                    {isAdmin ? t('support') : t('you')}
                  </span>
                  <span className="text-[12px] font-mono text-white/30">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <p className={`text-[15px] leading-relaxed whitespace-pre-wrap tracking-wide ${isAdmin ? 'text-white/80' : 'text-white/70'}`}>{msg.message}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Input */}
      {ticket.status !== 'closed' ? (
        <form onSubmit={handleReply} className="shrink-0 bg-white/[0.02] border border-white/5 rounded-3xl p-6 focus-within:border-white/20 transition-all duration-300 backdrop-blur-xl shadow-lg">
          <textarea 
            required
            rows={3}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-white resize-none text-[15px] placeholder:text-white/20 tracking-wide leading-relaxed"
            placeholder={t('reply_placeholder')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleReply(e);
              }
            }}
          />
          <div className="flex justify-end mt-4 pt-4 border-t border-white/5">
            <button 
              type="submit" 
              disabled={submitting || !reply.trim()}
              className="bg-white text-black hover:bg-white/90 disabled:opacity-50 px-6 py-3 rounded-xl text-[14px] font-semibold tracking-wide transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {t('send_reply')}
            </button>
          </div>
        </form>
      ) : (
        <div className="shrink-0 p-6 rounded-3xl border border-white/5 bg-white/[0.02] text-center text-white/40 text-[14px] font-medium tracking-wide backdrop-blur-xl">
          {t('closed_warning')}
        </div>
      )}
    </div>
  );
}
