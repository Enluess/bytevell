'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslations } from 'next-intl';
import { Mail, CheckCircle2, XCircle } from 'lucide-react';

export default function EmailsPage() {
  const t = useTranslations('Panel.Emails');
  const token = useAuthStore(state => state.token);
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<any>('/emails/history');
        if (res.emails) setEmails(res.emails);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-surface-elevated rounded mb-8"></div>
        <div className="h-64 bg-surface border border-border rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="pb-8 border-b border-white/5">
        <h1 className="text-[32px] font-semibold tracking-tight text-white mb-2">{t('title')}</h1>
        <p className="text-[14px] text-white/50 tracking-wide">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {emails.length > 0 ? (
          emails.map((email) => (
            <div 
              key={email.id} 
              className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.04] transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-6 backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                  <Mail className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-[15px] tracking-tight mb-1">
                    {email.subject}
                  </h3>
                  <p className="text-[13px] text-white/50 font-mono tracking-wide">
                    {email.recipientEmail}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:gap-10 w-full sm:w-auto relative z-10">
                <div className="flex flex-col sm:items-end">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1.5">{t('status')}</span>
                  <div className="flex items-center gap-2">
                    {email.status === 'sent' ? (
                      <div className="px-3 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase bg-emerald-400/10 border-emerald-400/20 text-emerald-400">
                        {t('sent')}
                      </div>
                    ) : email.status === 'failed' ? (
                      <div className="px-3 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase bg-red-400/10 border-red-400/20 text-red-400">
                        {t('error')}
                      </div>
                    ) : (
                      <div className="px-3 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase bg-orange-400/10 border-orange-400/20 text-orange-400">
                        {t('queued')}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end min-w-[120px]">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1.5">{t('date')}</span>
                  <span className="text-[14px] text-white/70 font-mono tracking-wide">
                    {new Date(email.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-20 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
            <Mail className="w-12 h-12 text-white/20 mb-4" />
            <h3 className="text-white font-medium text-lg tracking-tight mb-2">{t('no_emails') || 'No Emails'}</h3>
            <p className="text-white/40 text-[14px] max-w-sm tracking-wide">You have no email history.</p>
          </div>
        )}
      </div>
    </div>
  );
}
