'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslations } from 'next-intl';
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, Loader2 } from 'lucide-react';

export default function WalletPage() {
  const t = useTranslations('Panel.Wallet');
  const token = useAuthStore(state => state.token);
  const [balance, setBalance] = useState('0.00');
  const [currency, setCurrency] = useState('TRY');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balRes, txRes] = await Promise.all([
          api.get<any>('/finance/balance'),
          api.get<any>('/finance/transactions'),
        ]);
        if (balRes.balance) { setBalance(balRes.balance); setCurrency(balRes.currency); }
        if (txRes.transactions) setTransactions(txRes.transactions);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-surface-elevated rounded mb-8"></div>
        <div className="h-32 bg-surface border border-border rounded-md"></div>
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

      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-8 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-50"></div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-[11px] uppercase tracking-widest font-bold text-white/30 mb-3">{t('current_balance')}</p>
            <p className="text-5xl font-semibold text-white tracking-tight flex items-baseline gap-2">
              {parseFloat(balance).toFixed(2)} <span className="text-xl text-white/40 tracking-widest font-medium">{currency}</span>
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-sm">
            <Wallet className="w-8 h-8 text-white/50" />
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-white tracking-tight mb-4">{t('transaction_history')}</h2>
        <div className="grid grid-cols-1 gap-4">
          {transactions.length > 0 ? (
            transactions.map((tx) => {
              const isCredit = parseFloat(tx.amount) > 0;
              return (
                <div key={tx.id} className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.04] transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-6 backdrop-blur-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${isCredit ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' : 'bg-red-400/10 border-red-400/20 text-red-400'}`}>
                      {isCredit ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-[15px] tracking-tight mb-1 capitalize">{tx.type} - {tx.description}</h3>
                      <p className="text-[13px] text-white/50 font-mono tracking-wide">{new Date(tx.createdAt).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:gap-10 w-full sm:w-auto relative z-10">
                    <div className="flex flex-col sm:items-end">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1.5">{t('amount')}</span>
                      <span className={`text-xl font-semibold tracking-tight ${isCredit ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isCredit ? '+' : ''}{parseFloat(tx.amount).toFixed(2)} {tx.currency}
                      </span>
                    </div>
                    <div className="flex flex-col items-end min-w-[80px]">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1.5">{t('balance')}</span>
                      <span className="text-[15px] text-white/70 font-mono tracking-wide">
                        {parseFloat(tx.balanceAfter).toFixed(2)} {tx.currency}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-6 py-20 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
              <Wallet className="w-12 h-12 text-white/20 mb-4" />
              <p className="text-white/40 text-[14px] tracking-wide">{t('no_transactions')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
