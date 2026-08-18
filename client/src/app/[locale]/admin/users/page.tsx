'use client';

import { useTranslations } from 'next-intl';
import { Users, Loader2, Save, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/api';
import { Link } from '@/i18n/routing';

export default function AdminUsersPage() {
  const t = useTranslations('Admin.Users');
  const token = useAuthStore(state => state.token);
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  // Editable states
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [roles, setRoles] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const res = await api.get<any>('/admin/users');
      if (res.users) {
        setUsers(res.users);
        const initialBalances: Record<string, string> = {};
        const initialRoles: Record<string, string> = {};
        res.users.forEach((u: any) => {
          initialBalances[u.id] = u.balance;
          initialRoles[u.id] = u.role;
        });
        setBalances(initialBalances);
        setRoles(initialRoles);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    setMessage('');
    try {
      const newBalance = balances[id];
      const newRole = roles[id];

      await api.put(`/admin/users/${id}/role`, { role: newRole });
      await api.put(`/admin/users/${id}/balance`, { balance: newBalance });

      setMessage('Kullanıcı güncellendi.');
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Güncelleme başarısız oldu.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSavingId(null);
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">{t('title')}</h1>
          <p className="text-sm text-foreground-muted">{t('subtitle')}</p>
        </div>
        
        {message && (
          <div className="px-4 py-2 rounded bg-emerald-500/10 text-emerald-400 text-sm font-medium">
            {message}
          </div>
        )}
      </div>

      <div className="w-full rounded-md bg-surface border border-border overflow-x-auto">
        <table className="w-full text-left text-[13px] whitespace-nowrap">
          <thead className="bg-surface-elevated text-foreground-muted font-medium border-b border-border text-[12px]">
            <tr>
              <th className="px-6 py-4">{t('Kullanc')}</th>
              <th className="px-6 py-4">{t('Rol')}</th>
              <th className="px-6 py-4">{t('Bakiye')}</th>
              <th className="px-6 py-4">{t('KaytTarihi')}</th>
              <th className="px-6 py-4 text-right">{t('Eylemler')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-surface-raised transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-elevated flex items-center justify-center shrink-0">
                      {roles[user.id] === 'ADMIN' ? <Shield className="w-4 h-4 text-rose-500" /> : <Users className="w-4 h-4 text-foreground-muted" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{user.name || 'İsimsiz'}</h3>
                      <p className="text-xs text-foreground-secondary">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={roles[user.id] || 'USER'}
                    onChange={(e) => setRoles({ ...roles, [user.id]: e.target.value })}
                    className="bg-background border border-border rounded px-2 py-1 text-foreground text-xs outline-none focus:border-primary"
                  >
                    <option value="USER">{t('USER')}</option>
                    <option value="ADMIN">{t('ADMIN')}</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="relative inline-block w-24">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-foreground-secondary text-xs">₺</span>
                    <input 
                      type="number"
                      step="0.01"
                      value={balances[user.id] || '0.00'}
                      onChange={(e) => setBalances({ ...balances, [user.id]: e.target.value })}
                      className="w-full bg-background border border-border rounded pl-6 pr-2 py-1 text-foreground text-xs outline-none focus:border-primary"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-foreground-secondary">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleSave(user.id)}
                      disabled={savingId === user.id}
                      className="px-3 py-1.5 bg-surface-elevated hover:bg-surface-raised text-foreground rounded text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {savingId === user.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Kaydet
                    </button>
                    <Link 
                      href={`/admin/users/${user.id}`} 
                      className="px-3 py-1.5 bg-foreground text-background hover:opacity-90 rounded text-xs font-medium transition-colors"
                    >
                      Detay
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
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
  );
}
