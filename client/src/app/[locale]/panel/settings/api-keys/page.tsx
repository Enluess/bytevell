'use client';

import { useTranslations } from 'next-intl';
import { Key, Plus, Trash2, Loader2, Copy, Check } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';

export default function ApiKeysPage() {
  const t = useTranslations('Panel.Settings');
  
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const json = await api.get<{ success: boolean; apiKeys: any[] }>('/apikeys');
      setKeys(json.apiKeys || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setCreating(true);
    setError('');
    try {
      const json = await api.post<{ success: boolean; key: string }>('/apikeys', { 
        name: newKeyName 
      });
      setGeneratedKey(json.key);
      setNewKeyName('');
      fetchKeys();
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create API key');
      }
      setTimeout(() => setError(''), 3000);
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm(t('revoke_confirm'))) return;
    
    setError('');
    try {
      await api.delete(`/apikeys/${id}`);
      setKeys(keys.filter(k => k.id !== id));
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to revoke API key');
      }
      setTimeout(() => setError(''), 3000);
    }
  };

  const copyToClipboard = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="pb-8 border-b border-white/5">
        <h1 className="text-[32px] font-semibold tracking-tight text-white mb-2">{t('title')}</h1>
        <p className="text-[14px] text-white/50 tracking-wide">{t('api_subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-white/5">
        <Link href="/panel/settings/profile" className="pb-4 text-[12px] font-bold transition-all uppercase tracking-widest relative text-white/40 hover:text-white/70">
          {t('tab_profile')}
        </Link>
        <Link href="/panel/settings/security" className="pb-4 text-[12px] font-bold transition-all uppercase tracking-widest relative text-white/40 hover:text-white/70">
          {t('tab_security')}
        </Link>
        <Link href="/panel/settings/api-keys" className="pb-4 text-[12px] font-bold transition-all uppercase tracking-widest relative text-white">
          {t('tab_api_keys')}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-full shadow-[0_-2px_10px_rgba(255,255,255,0.5)]"></div>
        </Link>
        <Link href="/panel/settings/activity" className="pb-4 text-[12px] font-bold transition-all uppercase tracking-widest relative text-white/40 hover:text-white/70">
          {t('tab_activity')}
        </Link>
      </div>

      {error && (
        <div className="px-6 py-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-[14px] font-medium tracking-wide">
          {error}
        </div>
      )}

      {generatedKey && (
        <div className="p-8 border border-emerald-500/20 bg-emerald-500/5 rounded-3xl backdrop-blur-xl">
          <h3 className="text-emerald-400 font-bold text-[14px] mb-3 flex items-center gap-3">
            <Key className="w-5 h-5" /> {t('new_key_generated')}
          </h3>
          <p className="text-white/50 text-[14px] mb-6 tracking-wide">
            {t('copy_key_warning')}
          </p>
          <div className="flex items-center gap-4">
            <input 
              type="text" 
              readOnly 
              value={generatedKey} 
              className="flex-1 bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-white text-[15px] font-mono outline-none tracking-wider"
            />
            <button 
              onClick={copyToClipboard}
              className="px-6 py-3 bg-white text-black hover:bg-white/90 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <button 
            onClick={() => setGeneratedKey(null)}
            className="mt-6 text-white/40 hover:text-white text-[12px] uppercase font-bold tracking-widest transition-colors"
          >
            {t('saved_key')}
          </button>
        </div>
      )}

      <div className="bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <h2 className="text-[11px] uppercase tracking-widest font-bold text-white/30 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
              <Key className="w-4 h-4 text-white/50" />
            </div>
            {t('active_keys')}
          </h2>
          <form onSubmit={handleCreateKey} className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder={t('key_name_placeholder')}
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none text-[13px] text-white placeholder:text-white/30 w-56 focus:border-white/20 transition-colors tracking-wide"
              required
            />
            <button 
              type="submit" 
              disabled={creating || !newKeyName.trim()}
              className="px-5 py-2.5 bg-white text-black hover:bg-white/90 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {t('generate')}
            </button>
          </form>
        </div>

        {loading ? (
          <div className="p-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-white/20" />
          </div>
        ) : keys.length > 0 ? (
          <div className="divide-y divide-white/5">
            {keys.map((k) => (
              <div key={k.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                <div>
                  <h3 className="font-semibold text-white text-[15px] tracking-tight">{k.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                    <p className="text-[13px] text-white/40 font-mono tracking-wider">
                      {k.keyHash.substring(0, 12)}...
                    </p>
                    <p className="text-[12px] text-white/30 tracking-wide">
                      {t('created')} {new Date(k.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-[12px] text-white/30 tracking-wide">
                      {t('last_used')} {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleString() : t('never')}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleRevoke(k.id)}
                  className="p-3 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title={t('revoke')}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-8 py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
              <Key className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-white font-semibold text-[16px] tracking-tight mb-2">{t('no_keys')}</h3>
            <p className="text-white/40 text-[14px] tracking-wide max-w-sm">{t('no_keys_desc')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
