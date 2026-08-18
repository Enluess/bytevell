'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Server, Cloud } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: string;
  features: any;
  groupName: string | null;
  groupSlug: string | null;
  prices: Array<{
    id: string;
    billingCycle: string;
    currency: string;
    setupFee: string;
    recurringPrice: string;
  }>;
}

export default function StoreGroupPage() {
  const t = useTranslations('Panel.Store');
  const params = useParams();
  const groupSlug = params.groupSlug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products?groupSlug=${groupSlug}`);
        const data = await res.json();
        const prods = data.products || [];
        setProducts(prods);
        if (prods.length > 0) {
          setGroupName(prods[0].groupName || groupSlug);
        }

        // Fetch group description
        const groupsRes = await fetch(`${API_URL}/products/groups`);
        const groupsData = await groupsRes.json();
        const group = (groupsData.groups || []).find((g: any) => g.slug === groupSlug);
        if (group) {
          setGroupName(group.name);
          setGroupDescription(group.description || '');
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [groupSlug]);

  const getCurrencySymbol = (currency: string) => {
    if (currency === 'TRY') return '₺';
    if (currency === 'USD') return '$';
    if (currency === 'EUR') return '€';
    return currency;
  };

  const getFeatureValue = (product: Product, key: string): string => {
    if (product.features && typeof product.features === 'object' && !Array.isArray(product.features)) {
      return product.features[key] || '-';
    }
    return '-';
  };

  const isTableView = products.length > 0 && products.some(p => 
    p.features && typeof p.features === 'object' && !Array.isArray(p.features) && 
    (p.features.cpu || p.features.ram || p.features.disk)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-white/30" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Back Button */}
      <Link
        href="/panel/store"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[12px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('title')}
      </Link>

      {/* Header */}
      <div className="pb-8 border-b border-white/5">
        <h1 className="text-[32px] font-semibold tracking-tight text-white mb-2">{groupName}</h1>
        {groupDescription && (
          <p className="text-[14px] text-white/50 tracking-wide max-w-2xl leading-relaxed">{groupDescription}</p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="px-8 py-20 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
          <Cloud className="w-12 h-12 text-white/20 mb-4" />
          <h3 className="text-white font-semibold text-[16px] tracking-tight mb-2">{t('no_products')}</h3>
        </div>
      ) : isTableView ? (
        /* TABLE VIEW for VPS/Dedicated style products */
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto_auto] gap-4 px-8 py-4 border-b border-white/5">
            <span className="text-[11px] uppercase tracking-widest font-bold text-white/30">{t('package')}</span>
            <span className="text-[11px] uppercase tracking-widest font-bold text-white/30">{t('location')}</span>
            <span className="text-[11px] uppercase tracking-widest font-bold text-white/30">{t('cpu')}</span>
            <span className="text-[11px] uppercase tracking-widest font-bold text-white/30">{t('ram')}</span>
            <span className="text-[11px] uppercase tracking-widest font-bold text-white/30">{t('disk')}</span>
            <span className="text-[11px] uppercase tracking-widest font-bold text-white/30 text-right">{t('total')}</span>
            <span className="text-[11px] uppercase tracking-widest font-bold text-white/30 text-right">{t('actions')}</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/5">
            {products.map((product) => {
              const monthlyPrice = product.prices.find(p => p.billingCycle === 'monthly');
              const price = monthlyPrice ? parseFloat(monthlyPrice.recurringPrice).toFixed(2) : '0.00';
              const currency = monthlyPrice?.currency || 'TRY';

              return (
                <div
                  key={product.id}
                  className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto_auto] gap-4 px-8 py-5 items-center hover:bg-white/[0.02] transition-colors group"
                >
                  <div>
                    <span className="text-[15px] font-bold text-white tracking-tight">{product.name}</span>
                  </div>
                  <div>
                    <span className="text-[13px] text-white/60 tracking-wide">{getFeatureValue(product, 'location') || 'Frankfurt'}</span>
                  </div>
                  <div>
                    <span className="text-[13px] text-white/60 tracking-wide">{getFeatureValue(product, 'cpu')}</span>
                  </div>
                  <div>
                    <span className="text-[13px] text-white/60 tracking-wide">{getFeatureValue(product, 'ram')}</span>
                  </div>
                  <div>
                    <span className="text-[13px] text-white/60 tracking-wide">{getFeatureValue(product, 'disk')}</span>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <span className="text-[15px] font-semibold text-white tracking-tight">
                      {getCurrencySymbol(currency)}{price}
                    </span>
                  </div>
                  <div className="text-right min-w-[120px]">
                    <Link
                      href={`/panel/store/${groupSlug}/${product.slug}`}
                      className="px-5 py-2.5 bg-white text-black hover:bg-white/90 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(255,255,255,0.08)] opacity-70 group-hover:opacity-100"
                    >
                      {t('configure')}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* CARD VIEW for Web Hosting / Mail Hosting style products */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => {
            const monthlyPrice = product.prices.find(p => p.billingCycle === 'monthly');
            const price = monthlyPrice ? parseFloat(monthlyPrice.recurringPrice).toFixed(2) : '0.00';
            const currency = monthlyPrice?.currency || 'TRY';

            // Parse features
            let featureList: string[] = [];
            if (Array.isArray(product.features)) {
              featureList = product.features;
            } else if (product.features && typeof product.features === 'object') {
              featureList = Object.entries(product.features).map(([k, v]) => `${k}: ${v}`);
            } else if (product.description) {
              const sep = product.description.includes('|') ? '|' : ',';
              featureList = product.description.split(sep).map(f => f.trim()).filter(Boolean);
            }

            return (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-7 hover:bg-white/[0.04] transition-all duration-500 flex flex-col backdrop-blur-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 flex flex-col flex-1">
                  <h3 className="text-[18px] font-semibold text-white tracking-tight mb-2">{product.name}</h3>
                  
                  <div className="mb-6">
                    <span className="text-[28px] font-bold text-white tracking-tight">{getCurrencySymbol(currency)}{price}</span>
                    <span className="text-[13px] text-white/40 ml-1 tracking-wide">/ ay</span>
                  </div>

                  {featureList.length > 0 && (
                    <ul className="space-y-3 mb-8 flex-1">
                      {featureList.slice(0, 6).map((feat, i) => (
                        <li key={i} className="flex items-center gap-3 text-[13px] text-white/60 tracking-wide">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0"></div>
                          <span>{String(feat)}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                    href={`/panel/store/${groupSlug}/${product.slug}`}
                    className="block w-full py-3.5 text-center bg-white text-black hover:bg-white/90 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.08)] mt-auto"
                  >
                    {t('configure')}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
