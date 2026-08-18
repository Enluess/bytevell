'use client';
import { useTranslations } from 'next-intl';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Receipt, Search, Eye, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const t = useTranslations('Admin');
  const token = useAuthStore(state => state.token);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get<any>('/orders/admin/all');
        if (res.orders) setOrders(res.orders);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchOrders();
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" /> Siparişler
          </h1>
          <p className="text-sm text-foreground-muted">{t('Platformdakitmm')}</p>
        </div>
      </div>

      <div className="w-full rounded-md overflow-x-auto bg-surface border border-border">
        <table className="w-full text-left text-[13px] whitespace-nowrap">
          <thead className="bg-surface-elevated text-foreground-muted font-medium border-b border-border text-[12px]">
            <tr>
              <th className="px-6 py-4">{t('SipariNo')}</th>
              <th className="px-6 py-4">{t('Mteri')}</th>
              <th className="px-6 py-4">{t('Tarih')}</th>
              <th className="px-6 py-4">{t('Tutar')}</th>
              <th className="px-6 py-4">{t('Durum')}</th>
              <th className="px-6 py-4 text-right">{t('lemler')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-surface-raised transition-colors">
                <td className="px-6 py-4 font-mono font-medium text-foreground text-[12px]">{order.orderNumber}</td>
                <td className="px-6 py-4">
                  <Link href={`/admin/users/${order.userId}`} className="font-medium text-foreground hover:text-primary transition-colors">
                    {order.userName || 'İsimsiz'}
                  </Link>
                  <p className="text-[11px] text-foreground-muted">{order.userEmail}</p>
                </td>
                <td className="px-6 py-4 text-foreground-secondary">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
                <td className="px-6 py-4 font-medium text-foreground">{parseFloat(order.total).toFixed(2)} {order.currency}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                    order.status === 'active' || order.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' :
                    order.status === 'pending_payment' ? 'bg-orange-500/10 text-orange-500' :
                    order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>{order.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/orders/${order.id}`} className="px-3 py-1.5 bg-surface-elevated hover:bg-surface-raised text-foreground-secondary text-xs rounded transition-colors inline-flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Detay
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-foreground-muted text-[13px]">{t('Hisiparibulunam')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
