'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useParams, useRouter } from 'next/navigation';
import { Globe, ArrowLeft, Plus, Server, Save, Trash2, Shield, Calendar, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function DomainDetailsPage() {
  const t = useTranslations('Panel.DomainDetail');
  const { id } = useParams();
  const router = useRouter();
  const token = useAuthStore(state => state.token);
  const [data, setData] = useState<{ domain: any, dnsRecords: any[], events: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Nameservers state
  const [ns1, setNs1] = useState('');
  const [ns2, setNs2] = useState('');
  const [savingNs, setSavingNs] = useState(false);

  // DNS Record state
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({ type: 'A', name: '', content: '', ttl: 3600, proxied: false });

  useEffect(() => {
    if (!id) return;
    const fetchDomain = async () => {
      try {
        const res = await api.get<any>(`/domains/${id}`);
        setData(res);
        if (res.domain?.nameservers) {
          const ns = res.domain.nameservers;
          setNs1(ns[0] || '');
          setNs2(ns[1] || '');
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchDomain();
  }, [id, token]);

  const saveNameservers = async () => {
    try {
      setSavingNs(true);
      const nameservers = [ns1, ns2].filter(Boolean);
      await api.put(`/domains/${id}/nameservers`, { nameservers });
      alert(t('ns_updated'));
    } catch (err) { console.error(err); alert(t('error_occurred')); }
    finally { setSavingNs(false); }
  };

  const addDnsRecord = async () => {
    try {
      const res = await api.post<any>(`/domains/${id}/dns`, newRecord);
      setData(prev => prev ? { ...prev, dnsRecords: [...prev.dnsRecords, res.record] } : prev);
      setShowAddRecord(false);
      setNewRecord({ type: 'A', name: '', content: '', ttl: 3600, proxied: false });
    } catch (err) { console.error(err); alert(t('record_add_error')); }
  };

  const deleteDnsRecord = async (recordId: string) => {
    if (!confirm(t('delete_confirm'))) return;
    try {
      await api.delete(`/domains/${id}/dns/${recordId}`);
      setData(prev => prev ? { ...prev, dnsRecords: prev.dnsRecords.filter(r => r.id !== recordId) } : prev);
    } catch (err) { console.error(err); alert(t('delete_error')); }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-surface-elevated rounded mb-8"></div>
        <div className="h-64 bg-surface border border-border rounded-md"></div>
      </div>
    );
  }

  if (!data || !data.domain) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Globe className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">{t('not_found_title')}</h2>
        <p className="text-foreground-muted mb-6">{t('not_found_desc')}</p>
        <button onClick={() => router.push('/panel/domains')} className="px-4 py-2 bg-surface-elevated hover:bg-surface-raised text-foreground rounded-md transition-colors">
          {t('back_to_domains')}
        </button>
      </div>
    );
  }

  const { domain, dnsRecords, events } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/panel/domains" className="p-2 bg-surface-elevated hover:bg-surface-raised rounded-md transition-colors">
          <ArrowLeft className="w-4 h-4 text-foreground-muted" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
            {domain.domainName}
            <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
              domain.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
              domain.status === 'expired' ? 'bg-red-500/10 text-red-500' :
              'bg-orange-500/10 text-orange-500'
            }`}>{domain.status}</span>
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            {t('expires')} {domain.expirationDate ? new Date(domain.expirationDate).toLocaleDateString('tr-TR') : t('not_specified')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* DNS Records */}
          <div className="bg-surface border border-border rounded-md overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-surface-elevated/50 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Globe className="w-4 h-4 text-foreground-muted" /> {t('dns_records')}
              </h2>
              <button onClick={() => setShowAddRecord(!showAddRecord)} className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium rounded transition-colors flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> {t('new_record')}
              </button>
            </div>

            {showAddRecord && (
              <div className="p-6 bg-surface-raised/30 border-b border-border space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-foreground-muted mb-1.5 uppercase tracking-wider">{t('type')}</label>
                    <select value={newRecord.type} onChange={e => setNewRecord({...newRecord, type: e.target.value})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none">
                      {['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'SRV'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-foreground-muted mb-1.5 uppercase tracking-wider">{t('name')}</label>
                    <input type="text" value={newRecord.name} onChange={e => setNewRecord({...newRecord, name: e.target.value})} placeholder="@" className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-foreground-muted mb-1.5 uppercase tracking-wider">{t('content')}</label>
                    <input type="text" value={newRecord.content} onChange={e => setNewRecord({...newRecord, content: e.target.value})} placeholder="192.168.1.1" className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-foreground-muted mb-1.5 uppercase tracking-wider">{t('ttl')}</label>
                    <select value={newRecord.ttl} onChange={e => setNewRecord({...newRecord, ttl: parseInt(e.target.value)})} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none">
                      <option value={3600}>{t('1_hour')}</option>
                      <option value={14400}>{t('4_hours')}</option>
                      <option value={86400}>{t('1_day')}</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={addDnsRecord} className="px-4 py-2 bg-foreground text-background font-medium text-[13px] rounded-md hover:bg-foreground/90 transition-colors">
                    {t('add_record')}
                  </button>
                </div>
              </div>
            )}

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-[13px] whitespace-nowrap">
                <thead className="bg-surface-elevated/50 text-foreground-muted font-medium border-b border-border text-[12px]">
                  <tr>
                    <th className="px-6 py-3">{t('type')}</th>
                    <th className="px-6 py-3">{t('name')}</th>
                    <th className="px-6 py-3">{t('content')}</th>
                    <th className="px-6 py-3">{t('ttl')}</th>
                    <th className="px-6 py-3 text-right">{t('action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dnsRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-surface-raised/50 transition-colors">
                      <td className="px-6 py-3 font-medium text-foreground">{record.type}</td>
                      <td className="px-6 py-3 text-foreground-secondary">{record.name}</td>
                      <td className="px-6 py-3 text-foreground-secondary">{record.content}</td>
                      <td className="px-6 py-3 text-foreground-secondary">{record.ttl}s</td>
                      <td className="px-6 py-3 text-right">
                        <button onClick={() => deleteDnsRecord(record.id)} className="p-1.5 text-foreground-muted hover:text-red-500 rounded bg-surface-elevated hover:bg-red-500/10 transition-colors inline-flex">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {dnsRecords.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-foreground-muted text-[13px]">{t('no_dns_records')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Nameservers */}
          <div className="bg-surface border border-border rounded-md overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-surface-elevated/50 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Server className="w-4 h-4 text-foreground-muted" /> {t('nameservers')}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1.5 uppercase tracking-wider">NS 1</label>
                <input type="text" value={ns1} onChange={e => setNs1(e.target.value)} placeholder="ns1.bytevell.com" className="w-full bg-surface-elevated border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none focus:border-foreground-muted transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1.5 uppercase tracking-wider">NS 2</label>
                <input type="text" value={ns2} onChange={e => setNs2(e.target.value)} placeholder="ns2.bytevell.com" className="w-full bg-surface-elevated border border-border rounded-md px-3 py-2 text-[13px] text-foreground outline-none focus:border-foreground-muted transition-colors" />
              </div>
              <button onClick={saveNameservers} disabled={savingNs} className="w-full flex items-center justify-center gap-2 py-2.5 bg-foreground text-background rounded-md transition-colors text-[13px] font-medium disabled:opacity-50">
                  <Save className="w-4 h-4" /> {savingNs ? t('saving') : t('save_nameservers')}
              </button>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-surface border border-border rounded-md overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-surface-elevated/50 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-foreground-muted" /> {t('protection_renewal')}
              </h2>
            </div>
            <div className="p-6 space-y-4 text-[13px]">
              <div className="flex justify-between items-center">
                <span className="text-foreground-secondary flex items-center gap-2"><RefreshCw className="w-4 h-4 text-foreground-muted" /> Otomatik Yenileme</span>
                <span className={`font-medium ${domain.autoRenew ? 'text-emerald-500' : 'text-foreground-muted'}`}>{domain.autoRenew ? t('active') : t('disabled')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground-secondary flex items-center gap-2"><Calendar className="w-4 h-4 text-foreground-muted" /> Bitiş Tarihi</span>
                <span className="font-medium text-foreground">{domain.expirationDate ? new Date(domain.expirationDate).toLocaleDateString('tr-TR') : '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
