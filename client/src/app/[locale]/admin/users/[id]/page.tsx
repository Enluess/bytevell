'use client';

import { useTranslations } from 'next-intl';
import { Loader2, ArrowLeft, Server, Receipt, Ticket, Shield, Mail, User as UserIcon, Calendar, Info } from 'lucide-react';
import { useEffect, useState, use } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/api';
import { Link } from '@/i18n/routing';

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const t = useTranslations('Admin.Users');
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editProfileData, setEditProfileData] = useState({ name: '', email: '', tc: '' });
  
  const [balanceOpen, setBalanceOpen] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState('');
  
  const [serviceOpen, setServiceOpen] = useState(false);
  const [serviceData, setServiceData] = useState({ type: 'VDS', name: '', price: '', ipAddress: '' });
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      const res = await api.get<any>(`/admin/users/${id}/details`);
      setData(res);
      setEditProfileData({ name: res.user.name || '', email: res.user.email || '', tc: res.user.taxId || '' });
      setBalanceAmount(res.user.balance || '0.00');
    } catch (err) {
      console.error("Failed to fetch user details", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/admin/users/${id}/profile`, editProfileData);
      setEditProfileOpen(false);
      fetchUserDetails();
    } catch(err) {
      console.error(err);
    } finally { setSubmitting(false); }
  };

  const handleUpdateBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/admin/users/${id}/balance`, { balance: balanceAmount });
      setBalanceOpen(false);
      fetchUserDetails();
    } catch(err) {
      console.error(err);
    } finally { setSubmitting(false); }
  };

  const handleAssignService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/admin/users/${id}/services`, serviceData);
      setServiceOpen(false);
      setServiceData({ type: 'VDS', name: '', price: '', ipAddress: '' });
      fetchUserDetails();
    } catch(err) {
      console.error(err);
    } finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-surface-elevated rounded mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-surface border border-border rounded-md"></div>
          <div className="lg:col-span-2 h-96 bg-surface border border-border rounded-md"></div>
        </div>
      </div>
    );
  }

  if (!data || !data.user) {
    return <div className="text-foreground-muted p-10 text-center">{t('Kullancbulunama')}</div>;
  }

  const { user, services, tickets, invoices } = data;

  return (
    <div className="space-y-6 relative">
      {/* Edit Profile Modal */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-surface-elevated border border-border rounded-md p-6 w-full max-w-md relative shadow-2xl">
            <h2 className="text-lg font-bold text-foreground mb-4">{t('ProfiliDzenle')}</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">{t('sim')}</label>
                <input required type="text" value={editProfileData.name} onChange={e => setEditProfileData({...editProfileData, name: e.target.value})} className="w-full bg-background border border-border rounded px-3 py-2 text-foreground outline-none focus:border-primary text-[13px]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">{t('Eposta')}</label>
                <input required type="email" value={editProfileData.email} onChange={e => setEditProfileData({...editProfileData, email: e.target.value})} className="w-full bg-background border border-border rounded px-3 py-2 text-foreground outline-none focus:border-primary text-[13px]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">{t('TCKimlikNo')}</label>
                <input type="text" value={editProfileData.tc} onChange={e => setEditProfileData({...editProfileData, tc: e.target.value})} className="w-full bg-background border border-border rounded px-3 py-2 text-foreground outline-none focus:border-primary text-[13px]" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setEditProfileOpen(false)} className="px-4 py-2 bg-surface-raised hover:bg-surface border border-border text-foreground rounded text-xs transition-colors">{t('ptal')}</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 rounded text-xs font-medium transition-colors disabled:opacity-50">{submitting ? 'Kaydediliyor...' : 'Kaydet'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Balance Modal */}
      {balanceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-surface-elevated border border-border rounded-md p-6 w-full max-w-sm relative shadow-2xl">
            <h2 className="text-lg font-bold text-foreground mb-4">{t('BakiyeDzenle')}</h2>
            <form onSubmit={handleUpdateBalance} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">{t('YeniBakiye')}</label>
                <input required type="number" step="0.01" value={balanceAmount} onChange={e => setBalanceAmount(e.target.value)} className="w-full bg-background border border-border rounded px-3 py-2 text-foreground outline-none focus:border-primary text-[13px]" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setBalanceOpen(false)} className="px-4 py-2 bg-surface-raised hover:bg-surface border border-border text-foreground rounded text-xs transition-colors">{t('ptal')}</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 rounded text-xs font-medium transition-colors disabled:opacity-50">{submitting ? 'Kaydediliyor...' : 'Kaydet'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Service Modal */}
      {serviceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-surface-elevated border border-border rounded-md p-6 w-full max-w-md relative shadow-2xl">
            <h2 className="text-lg font-bold text-foreground mb-4">{t('ManuelHizmetAta')}</h2>
            <form onSubmit={handleAssignService} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">{t('HizmetTr')}</label>
                <select value={serviceData.type} onChange={e => setServiceData({...serviceData, type: e.target.value})} className="w-full bg-background border border-border rounded px-3 py-2 text-foreground outline-none focus:border-primary text-[13px]">
                  <option value="VDS">{t('VDSSunucu')}</option>
                  <option value="WEB">{t('WebHosting')}</option>
                  <option value="DEDICATED">{t('FizikselSunucu')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">{t('HizmetAdrnVDSPr')}</label>
                <input required type="text" value={serviceData.name} onChange={e => setServiceData({...serviceData, name: e.target.value})} className="w-full bg-background border border-border rounded px-3 py-2 text-foreground outline-none focus:border-primary text-[13px]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">{t('AtanacakIPOpsiy')}</label>
                <input type="text" value={serviceData.ipAddress} onChange={e => setServiceData({...serviceData, ipAddress: e.target.value})} className="w-full bg-background border border-border rounded px-3 py-2 text-foreground outline-none focus:border-primary text-[13px]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">{t('AylkFiyat')}</label>
                <input required type="number" step="0.01" value={serviceData.price} onChange={e => setServiceData({...serviceData, price: e.target.value})} className="w-full bg-background border border-border rounded px-3 py-2 text-foreground outline-none focus:border-primary text-[13px]" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setServiceOpen(false)} className="px-4 py-2 bg-surface-raised hover:bg-surface border border-border text-foreground rounded text-xs transition-colors">{t('ptal')}</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 rounded text-xs font-medium transition-colors disabled:opacity-50">{submitting ? 'Kaydediliyor...' : 'Oluştur'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/users" className="p-2 bg-surface hover:bg-surface-elevated rounded transition-colors">
            <ArrowLeft className="w-4 h-4 text-foreground-muted" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground mb-0.5">{t('KullancDetaylar')}</h1>
            <p className="text-foreground-muted text-xs">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => setEditProfileOpen(true)} className="px-4 py-2 bg-surface border border-border hover:border-primary/50 rounded text-xs text-foreground transition-colors">{t('ProfiliDzenle')}</button>
           <button onClick={() => setBalanceOpen(true)} className="px-4 py-2 bg-surface border border-border hover:border-primary/50 rounded text-xs text-foreground transition-colors">{t('BakiyeDzenle')}</button>
           <button onClick={() => setServiceOpen(true)} className="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 rounded text-xs font-medium transition-colors">{t('HizmetAta')}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kullanıcı Profili */}
        <div className="col-span-1 bg-surface border border-border rounded-md p-6 h-fit">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-surface-elevated rounded flex items-center justify-center text-foreground-muted text-lg font-bold">
              {user.name ? user.name.substring(0, 2).toUpperCase() : 'JD'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{user.name || 'İsimsiz'}</h2>
              <div className="px-2 py-0.5 bg-surface-elevated rounded text-[10px] font-medium text-foreground-muted inline-block mt-1 uppercase tracking-wider">
                {user.role}
              </div>
            </div>
          </div>
          
          <div className="space-y-0 divide-y divide-border text-[13px]">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-foreground-secondary"><Mail className="w-3.5 h-3.5" />{t('Eposta')}</div>
              <div className="text-foreground">{user.email}</div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-foreground-secondary"><Info className="w-3.5 h-3.5" />{t('TCKimlikNo')}</div>
              <div className="text-foreground">{user.taxId || 'Belirtilmemiş'}</div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-foreground-secondary"><Receipt className="w-3.5 h-3.5" />{t('Bakiye')}</div>
              <div className="text-foreground font-medium">₺{user.balance}</div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-foreground-secondary"><Calendar className="w-3.5 h-3.5" />{t('KaytTarihi')}</div>
              <div className="text-foreground-muted">{new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Detaylı Listeler */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          {/* Hizmetler */}
          <div className="bg-surface border border-border rounded-md overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-[14px] font-semibold text-foreground flex items-center gap-2">
                <Server className="w-4 h-4 text-foreground-muted" /> Hizmetler ({services.length})
              </h3>
            </div>
            <div className="divide-y divide-border">
              {services.length === 0 ? <p className="px-6 py-8 text-center text-foreground-secondary text-[13px]">{t('Kaytlhizmetbulu')}</p> : null}
              {services.map((srv: any) => (
                <div key={srv.id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-raised transition-colors">
                  <div>
                    <div className="text-foreground font-medium text-[13px]">{srv.name}</div>
                    <div className="text-foreground-secondary text-[11px] mt-1 uppercase">{srv.type} • IP: {srv.ipAddress || 'Atanmadı'}</div>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                    srv.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                    srv.status === 'suspended' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                    'bg-surface-elevated text-foreground-muted border-border'
                  }`}>
                    {srv.status === 'active' ? 'AKTİF' : srv.status === 'suspended' ? 'ASKIDA' : 'PASİF'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Destek Talepleri */}
          <div className="bg-surface border border-border rounded-md overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-[14px] font-semibold text-foreground flex items-center gap-2">
                <Ticket className="w-4 h-4 text-foreground-muted" /> Destek Talepleri ({tickets.length})
              </h3>
            </div>
            <div className="divide-y divide-border">
              {tickets.length === 0 ? <p className="px-6 py-8 text-center text-foreground-secondary text-[13px]">{t('Destektalebibul')}</p> : null}
              {tickets.map((tick: any) => (
                <div key={tick.id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-raised transition-colors">
                  <div>
                    <div className="text-foreground font-medium text-[13px]">{tick.subject}</div>
                    <div className="text-foreground-secondary text-[11px] mt-1">{new Date(tick.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                    tick.status === 'open' ? 'bg-orange-400/10 text-orange-400 border-orange-400/20' : 'bg-surface-elevated text-foreground-muted border-border'
                  }`}>
                    {tick.status === 'open' ? 'AÇIK' : tick.status === 'answered' ? 'YANITLANDI' : 'KAPALI'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Faturalar */}
          <div className="bg-surface border border-border rounded-md overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-[14px] font-semibold text-foreground flex items-center gap-2">
                <Receipt className="w-4 h-4 text-foreground-muted" /> Faturalar ({invoices.length})
              </h3>
            </div>
            <div className="divide-y divide-border">
              {invoices.length === 0 ? <p className="px-6 py-8 text-center text-foreground-secondary text-[13px]">{t('Faturabulunamad')}</p> : null}
              {invoices.map((inv: any) => (
                <div key={inv.id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-raised transition-colors">
                  <div>
                    <div className="text-foreground font-medium text-[13px]">₺{inv.total || inv.amount}</div>
                    <div className="text-foreground-secondary text-[11px] mt-1">Oluşturuldu: {new Date(inv.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                    inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {inv.status === 'paid' ? 'ÖDENDİ' : 'ÖDENMEDİ'}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
