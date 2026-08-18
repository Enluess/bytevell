'use client';

import { useTranslations } from 'next-intl';
import { Users, Server, Ticket, Loader2, Receipt } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/api';

export default function AdminDashboardPage() {
  const t = useTranslations('Admin.Dashboard');
  const token = useAuthStore(state => state.token);
  
  const [data, setData] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get<any>('/admin/stats');
        setData(statsRes);
        
        const usersRes = await api.get<any>('/admin/users');
        if (usersRes.users) {
          setUsersList(usersRes.users.slice(0, 5)); // Just take top 5 recent users
        }
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="p-6 rounded-md bg-surface border border-border">
              <div className="h-4 w-24 bg-surface-elevated rounded mb-4"></div>
              <div className="h-8 w-16 bg-surface-elevated rounded"></div>
            </div>
          ))}
        </div>
        <div>
          <div className="h-6 w-32 bg-surface-elevated rounded mb-6"></div>
          <div className="h-40 bg-surface border border-border rounded-md"></div>
        </div>
      </div>
    );
  }

  const totalUsers = data?.stats?.totalUsers || 0;
  const totalServices = data?.stats?.totalServices || 0;
  const pendingTickets = data?.stats?.pendingTickets || 0;
  const unpaidInvoices = data?.stats?.unpaidInvoices || 0;

  return (
    <div className="space-y-10">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-md bg-surface border border-border relative overflow-hidden flex flex-col justify-between">
          <p className="text-[13px] font-medium text-foreground-muted mb-4">{t('ToplamKullanc')}</p>
          <p className="text-3xl font-semibold text-foreground">{totalUsers}</p>
          <Users className="absolute -right-4 -bottom-4 w-24 h-24 text-foreground/5 rotate-12" />
        </div>

        <div className="p-6 rounded-md bg-surface border border-border flex flex-col justify-between relative overflow-hidden">
          <p className="text-[13px] font-medium text-foreground-muted mb-4">{t('ToplamHizmet')}</p>
          <p className="text-3xl font-semibold text-foreground">{totalServices}</p>
          <Server className="absolute -right-4 -bottom-4 w-24 h-24 text-foreground/5 rotate-12" />
        </div>

        <div className="p-6 rounded-md bg-surface border border-border flex flex-col justify-between relative overflow-hidden">
          <p className="text-[13px] font-medium text-foreground-muted mb-4">{t('AkDestekTalebi')}</p>
          <p className="text-3xl font-semibold text-foreground">{pendingTickets}</p>
          <Ticket className="absolute -right-4 -bottom-4 w-24 h-24 text-foreground/5 rotate-12" />
        </div>

        <div className="p-6 rounded-md bg-surface border border-border flex flex-col justify-between relative overflow-hidden">
          <p className="text-[13px] font-medium text-foreground-muted mb-4">{t('denmemiFaturala')}</p>
          <p className="text-3xl font-semibold text-foreground">{unpaidInvoices}</p>
          <Receipt className="absolute -right-4 -bottom-4 w-24 h-24 text-foreground/5 rotate-12" />
        </div>
      </div>

      {/* Recent Users Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-foreground tracking-wide">{t('SonKaytOlanKull')}</h2>
        </div>

        <div className="w-full rounded-md bg-surface border border-border overflow-hidden">
          <table className="w-full text-left text-[13px] whitespace-nowrap">
            <thead className="bg-surface-elevated text-foreground-muted font-medium border-b border-border text-[12px]">
              <tr>
                <th className="px-6 py-4">{t('sim')}</th>
                <th className="px-6 py-4">{t('Eposta')}</th>
                <th className="px-6 py-4">{t('Rol')}</th>
                <th className="px-6 py-4">{t('Bakiye')}</th>
                <th className="px-6 py-4 text-right">{t('KaytTarihi')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {usersList.length > 0 ? (
                usersList.map((u: any, i: number) => (
                  <tr key={i} className="hover:bg-surface-raised transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{u.name}</td>
                    <td className="px-6 py-4 text-foreground-secondary">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                        u.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-400' : 'bg-surface-elevated text-foreground-muted'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground-secondary">₺{u.balance}</td>
                    <td className="px-6 py-4 text-right text-foreground-secondary">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-foreground-muted text-[13px]">
                    Kullanıcı bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
