'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { Server, Globe, Mail, HardDrive, Loader2, Cloud } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface ProductGroup {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isVisible: boolean;
}

interface GroupWithPrice extends ProductGroup {
  lowestPrice: string | null;
  currency: string;
  productCount: number;
}

const groupIcons: Record<string, any> = {
  'vps': Server,
  'vds': Server,
  'web-hosting': Globe,
  'mail-hosting': Mail,
  'dedicated': HardDrive,
};

const groupColors: Record<string, { bg: string; text: string; border: string; priceBg: string; priceText: string }> = {
  'vps': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', priceBg: 'bg-blue-500/20', priceText: 'text-blue-300' },
  'vds': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', priceBg: 'bg-blue-500/20', priceText: 'text-blue-300' },
  'web-hosting': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', priceBg: 'bg-emerald-500/20', priceText: 'text-emerald-300' },
  'mail-hosting': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', priceBg: 'bg-purple-500/20', priceText: 'text-purple-300' },
  'dedicated': { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', priceBg: 'bg-rose-500/20', priceText: 'text-rose-300' },
};

const defaultColor = { bg: 'bg-white/10', text: 'text-white/70', border: 'border-white/20', priceBg: 'bg-white/20', priceText: 'text-white/70' };

export default function StorePage() {
  const t = useTranslations('Panel.Store');
  const [groups, setGroups] = useState<GroupWithPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // Fetch groups
        const groupsRes = await fetch(`${API_URL}/products/groups`);
        const groupsData = await groupsRes.json();
        const allGroups: ProductGroup[] = (groupsData.groups || []).filter((g: ProductGroup) => g.isVisible);

        // Fetch all products to get lowest prices
        const productsRes = await fetch(`${API_URL}/products`);
        const productsData = await productsRes.json();
        const allProducts = productsData.products || [];

        const groupsWithPrices: GroupWithPrice[] = allGroups.map(group => {
          const groupProducts = allProducts.filter((p: any) => p.groupId === group.id);
          let lowestPrice: string | null = null;
          let currency = 'TRY';
          
          groupProducts.forEach((p: any) => {
            if (p.prices && p.prices.length > 0) {
              const monthlyPrice = p.prices.find((pr: any) => pr.billingCycle === 'monthly');
              if (monthlyPrice) {
                const price = parseFloat(monthlyPrice.recurringPrice);
                if (lowestPrice === null || price < parseFloat(lowestPrice)) {
                  lowestPrice = monthlyPrice.recurringPrice;
                  currency = monthlyPrice.currency || 'TRY';
                }
              }
            }
          });

          return {
            ...group,
            lowestPrice,
            currency,
            productCount: groupProducts.length,
          };
        });

        setGroups(groupsWithPrices);
      } catch (err) {
        console.error('Failed to fetch groups', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const getCurrencySymbol = (currency: string) => {
    if (currency === 'TRY') return '₺';
    if (currency === 'USD') return '$';
    if (currency === 'EUR') return '€';
    return currency;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-white/30" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="pb-8 border-b border-white/5">
        <h1 className="text-[32px] font-semibold tracking-tight text-white mb-2">{t('title')}</h1>
        <p className="text-[14px] text-white/50 tracking-wide max-w-xl">{t('subtitle')}</p>
      </div>

      {groups.length === 0 ? (
        <div className="px-8 py-20 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
          <Cloud className="w-12 h-12 text-white/20 mb-4" />
          <h3 className="text-white font-semibold text-[16px] tracking-tight mb-2">{t('no_groups')}</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {groups.map((group) => {
            const colors = groupColors[group.slug] || defaultColor;
            const IconComponent = groupIcons[group.slug] || Cloud;

            return (
              <Link
                key={group.id}
                href={`/panel/store/${group.slug}`}
                className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-7 hover:bg-white/[0.04] transition-all duration-500 flex flex-col backdrop-blur-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-2xl ${colors.bg} flex items-center justify-center mb-6 border ${colors.border} transition-transform group-hover:scale-110 duration-500`}>
                    <IconComponent className={`w-6 h-6 ${colors.text}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-[18px] font-semibold text-white tracking-tight mb-3">{group.name}</h3>

                  {/* Price Badge */}
                  {group.lowestPrice && (
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${colors.priceBg} border ${colors.border} mb-4`}>
                      <span className={`text-[12px] font-bold tracking-wide ${colors.priceText}`}>
                        {t('starting_from', { price: `${getCurrencySymbol(group.currency)}${parseFloat(group.lowestPrice).toFixed(2)}` })}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  {group.description && (
                    <p className="text-[13px] text-white/40 leading-relaxed tracking-wide line-clamp-3">
                      {group.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
