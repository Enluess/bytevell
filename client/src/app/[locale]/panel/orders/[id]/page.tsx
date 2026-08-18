'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, FileText, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function OrderDetailsPage() {
  const t = useTranslations('Panel.OrderDetail');
  const { id } = useParams();
  const router = useRouter();
  const token = useAuthStore(state => state.token);
  const [data, setData] = useState<{ order: any, items: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const res = await api.get<any>(`/orders/${id}`);
        setData(res);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchOrder();
  }, [id, token]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-surface-elevated rounded mb-8"></div>
        <div className="h-64 bg-surface border border-border rounded-md"></div>
      </div>
    );
  }

  if (!data || !data.order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">{t('not_found_title')}</h2>
        <p className="text-foreground-muted mb-6">{t('not_found_desc')}</p>
        <button onClick={() => router.push('/panel/orders')} className="px-4 py-2 bg-surface-elevated hover:bg-surface-raised text-foreground rounded-md transition-colors">
          {t('back_to_orders')}
        </button>
      </div>
    );
  }

  const { order, items } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/panel/orders" className="p-2 bg-surface-elevated hover:bg-surface-raised rounded-md transition-colors">
          <ArrowLeft className="w-4 h-4 text-foreground-muted" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
            {t('order_title')}{order.orderNumber}
            <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
              order.status === 'active' || order.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' :
              order.status === 'pending_payment' ? 'bg-orange-500/10 text-orange-500' :
              order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
              'bg-blue-500/10 text-blue-500'
            }`}>{order.status}</span>
          </h1>
          <p className="text-sm text-foreground-muted mt-1">{t('date')}{new Date(order.createdAt).toLocaleString('tr-TR')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-md overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-surface-elevated/50 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-foreground-muted" /> {t('order_items')}
              </h2>
            </div>
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-raised/50 transition-colors">
                  <div>
                    <h3 className="text-base font-medium text-foreground">{item.productName}</h3>
                    <p className="text-sm text-foreground-secondary mt-1">{t('cycle')}{item.billingCycle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-medium text-foreground">
                      {(parseFloat(item.recurringPrice) + parseFloat(item.setupFee)).toFixed(2)} {order.currency}
                    </p>
                    {parseFloat(item.setupFee) > 0 && (
                      <p className="text-[11px] text-foreground-muted mt-1">+{parseFloat(item.setupFee).toFixed(2)} {order.currency} {t('setup')}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-md p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider text-foreground-muted">{t('order_summary')}</h2>
            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between text-foreground-secondary">
                <span>{t('subtotal')}</span>
                <span>{parseFloat(order.subtotal).toFixed(2)} {order.currency}</span>
              </div>
              {parseFloat(order.discountAmount) > 0 && (
                <div className="flex justify-between text-emerald-500">
                  <span>{t('discount')}</span>
                  <span>-{parseFloat(order.discountAmount).toFixed(2)} {order.currency}</span>
                </div>
              )}
              <div className="flex justify-between text-foreground-secondary">
                <span>{t('tax')}</span>
                <span>{parseFloat(order.taxAmount).toFixed(2)} {order.currency}</span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between font-semibold text-base text-foreground">
                <span>{t('total')}</span>
                <span>{parseFloat(order.total).toFixed(2)} {order.currency}</span>
              </div>
            </div>

            {order.invoiceId && (
              <div className="mt-6 pt-6 border-t border-border">
                <Link href={`/panel/invoices/${order.invoiceId}`} className="w-full flex items-center justify-center gap-2 py-2.5 bg-surface-elevated hover:bg-surface-raised text-foreground rounded-md transition-colors text-sm font-medium">
                  <FileText className="w-4 h-4" /> {t('view_invoice')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
