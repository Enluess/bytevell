'use client';
import { useTranslations } from 'next-intl';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrderDetailsPage() {
  const t = useTranslations('Admin');
  const { id } = useParams();
  const router = useRouter();
  const token = useAuthStore(state => state.token);
  const [data, setData] = useState<{ order: any, items: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const res = await api.get<any>(`/orders/admin/${id}`);
        setData(res);
        if (res.order) {
          setStatus(res.order.status);
          setAdminNotes(res.order.adminNotes || '');
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchOrder();
  }, [id, token]);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await api.put(`/orders/admin/${id}/status`, { status, adminNotes });
      alert('Sipariş güncellendi.');
    } catch (err) { console.error(err); alert('Hata oluştu.'); }
    finally { setSaving(false); }
  };

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
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">{t('SipariBulunamad')}</h2>
      </div>
    );
  }

  const { order, items } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 bg-surface-elevated hover:bg-surface-raised rounded-md transition-colors">
          <ArrowLeft className="w-4 h-4 text-foreground-muted" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Sipariş {order.orderNumber}
          </h1>
          <p className="text-sm text-foreground-muted mt-1">{t('Mteri')}<Link href={`/admin/users/${order.userId}`} className="text-primary hover:underline">{order.userName}</Link></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-md overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-surface-elevated/50 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-foreground-muted" /> Sipariş Kalemleri
              </h2>
            </div>
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-raised/50 transition-colors">
                  <div>
                    <h3 className="text-base font-medium text-foreground">{item.productName}</h3>
                    <p className="text-sm text-foreground-secondary mt-1">Döngü: {item.billingCycle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-medium text-foreground">
                      {(parseFloat(item.recurringPrice) + parseFloat(item.setupFee)).toFixed(2)} {order.currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Order Details */}
          <div className="bg-surface border border-border rounded-md p-6 space-y-4">
            <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider text-foreground-muted">{t('SipariYnetimi')}</h2>
            
            <div>
              <label className="block text-xs font-medium text-foreground-muted mb-1.5 uppercase tracking-wider">{t('Durum')}</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-surface-elevated border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none">
                <option value="pending_payment">{t('demeBekliyor')}</option>
                <option value="paid">{t('dendilemBekliyo')}</option>
                <option value="active">{t('AktifTamamland')}</option>
                <option value="cancelled">{t('ptalEdildi')}</option>
                <option value="fraud">{t('Sahtekarlkphesi')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-muted mb-1.5 uppercase tracking-wider">{t('YneticiNotlarMt')}</label>
              <textarea 
                value={adminNotes} 
                onChange={e => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full bg-surface-elevated border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none resize-none"
              />
            </div>

            <button onClick={handleUpdate} disabled={saving} className="w-full flex items-center justify-center gap-2 py-2.5 bg-foreground text-background rounded-md transition-colors text-[13px] font-medium disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>

          <div className="bg-surface border border-border rounded-md p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider text-foreground-muted">{t('Finansalzet')}</h2>
            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between text-foreground-secondary">
                <span>{t('AraToplam')}</span>
                <span>{parseFloat(order.subtotal).toFixed(2)} {order.currency}</span>
              </div>
              <div className="flex justify-between text-foreground-secondary">
                <span>{t('ndirim')}</span>
                <span>-{parseFloat(order.discountAmount).toFixed(2)} {order.currency}</span>
              </div>
              <div className="flex justify-between text-foreground-secondary">
                <span>{t('Vergi')}</span>
                <span>{parseFloat(order.taxAmount).toFixed(2)} {order.currency}</span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between font-semibold text-base text-foreground">
                <span>{t('Toplam')}</span>
                <span>{parseFloat(order.total).toFixed(2)} {order.currency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
