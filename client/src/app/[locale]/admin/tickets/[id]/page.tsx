'use client';

import { useTranslations } from 'next-intl';
import { Ticket, Loader2, Send, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/api';
import { Link, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export default function AdminTicketDetailsPage() {
  const t = useTranslations('Admin.Tickets');
  const token = useAuthStore(state => state.token);
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;
  
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ticketId) fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const res = await api.get<any>(`/admin/tickets/${ticketId}`);
      if (res.ticket) {
        setTicket(res.ticket);
        setMessages(res.ticketMessages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      await api.post(`/admin/tickets/${ticketId}/messages`, { message: replyText });
      setReplyText('');
      fetchTicket();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-[#151515] rounded mb-8"></div>
        <div className="h-[600px] bg-[#0A0A0A] border border-white/5 rounded-lg"></div>
      </div>
    );
  }

  if (!ticket) {
    return <div className="text-[#888888] p-8 text-center text-[13px]">{t('Destektalebibul')}</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/tickets" className="p-2 bg-[#0D0D0D] hover:bg-[#151515] rounded transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#888888]" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white mb-0.5">{ticket.subject}</h1>
            <p className="text-[#888888] text-xs">Sahibi: {ticket.userEmail}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
             ticket.status === 'open' ? 'bg-orange-400/10 text-orange-400 border-orange-400/20' : 'bg-white/5 text-[#888888] border-white/10'
           }`}>
             {ticket.status === 'open' ? 'AÇIK' : ticket.status === 'answered' ? 'YANITLANDI' : 'KAPALI'}
           </div>
           <div className="px-2 py-0.5 rounded text-[11px] font-medium border bg-white/5 text-[#888888] border-white/10 uppercase">
             {ticket.priority}
           </div>
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-lg flex flex-col h-[calc(100vh-220px)] min-h-[500px]">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg: any) => {
            const isAdmin = msg.senderRole === 'ADMIN' || msg.senderRole === 'staff';
            return (
              <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-4 ${isAdmin ? 'bg-white text-black' : 'bg-[#111111] border border-white/5 text-white'}`}>
                  <div className={`text-[11px] font-medium mb-2 ${isAdmin ? 'text-black/50' : 'text-[#888888]'}`}>
                    {isAdmin ? 'Yetkili' : (ticket.userName || ticket.userEmail)} • {new Date(msg.createdAt).toLocaleString()}
                  </div>
                  <div className="whitespace-pre-wrap text-[13px] leading-relaxed">
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Area */}
        <div className="p-4 border-t border-white/5 bg-[#050505] rounded-b-lg">
          <form onSubmit={handleReply} className="flex items-end gap-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-[#111111] border border-[#222222] rounded px-4 py-3 text-white text-[13px] outline-none focus:border-white/30 resize-none min-h-[80px]"
              placeholder={t('Yantnzburayayaz')}
            />
            <button 
              type="submit" 
              disabled={submitting || !replyText.trim()}
              className="h-[80px] px-6 bg-white text-black hover:bg-gray-200 disabled:opacity-50 rounded font-medium transition-colors flex items-center justify-center shrink-0"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
