'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Globe, Eye, RefreshCw, Shield } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function DomainsPage() {
  const t = useTranslations('Panel.Domains');
  const token = useAuthStore(state => state.token);
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await api.get<any>('/domains');
        if (res.domains) setDomains(res.domains);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchDomains();
  }, [token]);

  const toggleAutoRenew = async (id: string) => {
    try {
      await api.post(`/domains/${id}/auto-renew`, {});
      setDomains(prev => prev.map(d => d.id === id ? { ...d, autoRenew: !d.autoRenew } : d));
    } catch (err) { console.error(err); }
  };

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">{t('title')}</h1>
        <p className="text-sm text-foreground-muted">{t('subtitle')}</p>
      </div>

      <div className="w-full rounded-md overflow-x-auto bg-surface border border-border">
        <table className="w-full text-left text-[13px] whitespace-nowrap">
          <thead className="bg-surface-elevated text-foreground-muted font-medium border-b border-border text-[12px]">
            <tr>
              <th className="px-6 py-4">{t('domain')}</th>
              <th className="px-6 py-4">{t('status')}</th>
              <th className="px-6 py-4">{t('expiration_date')}</th>
              <th className="px-6 py-4">{t('auto_renew')}</th>
              <th className="px-6 py-4 text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {domains.map((domain) => (
              <tr key={domain.id} className="hover:bg-surface-raised transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-elevated flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4 text-foreground-muted" />
                    </div>
                    <span className="font-medium text-foreground text-sm">{domain.domainName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    domain.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                    domain.status === 'expired' ? 'bg-red-500/10 text-red-500' :
                    'bg-orange-500/10 text-orange-500'
                  }`}>{domain.status}</span>
                </td>
                <td className="px-6 py-4 text-foreground-secondary">
                  {domain.expirationDate ? new Date(domain.expirationDate).toLocaleDateString('tr-TR') : '—'}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleAutoRenew(domain.id)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      domain.autoRenew ? 'bg-emerald-500/10 text-emerald-500' : 'bg-surface-elevated text-foreground-muted'
                    }`}
                  >
                    {domain.autoRenew ? t('active') : t('disabled')}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/panel/domains/${domain.id}`} className="px-3 py-1.5 bg-surface-elevated hover:bg-surface-raised text-foreground-secondary text-xs rounded transition-colors inline-flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> {t('manage')}
                  </Link>
                </td>
              </tr>
            ))}
            {domains.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-foreground-muted text-[13px]">{t('no_domains')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
