'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { api, ApiError } from '@/lib/api';

export default function LoginPage() {
  const t = useTranslations('Auth.Login');
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.post<{ token: string; user: any }>('/auth/login', { email, password });
      
      setAuth(data.token, data.user);
      router.push('/panel/dashboard');
      router.refresh();
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(t('error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[460px] mx-auto px-4">
      {/* Header */}
      <div className="mb-8 text-center flex flex-col items-center">
        <h1 className="text-[32px] font-semibold text-white mb-2 tracking-tight">{t('title')}</h1>
        <div className="text-white/60 text-[15px] tracking-wide">
          {t('subtitle')}
        </div>
      </div>

      {/* Decorative Line matching Register */}
      <div className="w-full h-[2px] bg-white/5 rounded-full mb-10 overflow-hidden">
        <div className="h-full w-1/3 bg-indigo-500 rounded-full" />
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[14px] text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[13px] text-white/70 flex gap-1">{t('email')} <span className="text-red-500">*</span></label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#0A0A0A]/50 border border-white/5 hover:border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-white text-[14px] outline-none transition-all placeholder:text-white/20"
            placeholder={t('email_placeholder')}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-white/70 flex gap-1">{t('password')} <span className="text-red-500">*</span></label>
            <Link href="/auth/forgot-password" className="text-[12px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              {t('forgot_password')}
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[#0A0A0A]/50 border border-white/5 hover:border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-white text-[14px] outline-none transition-all placeholder:text-white/20"
            placeholder={t('password_placeholder')}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-8 bg-indigo-500 text-white hover:bg-indigo-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-3.5 text-[15px] font-medium transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('button')}
        </button>
      </form>

      <div className="mt-8 text-center text-[14px] text-white/50">
        {t('no_account')}{' '}
        <Link href="/auth/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          {t('register_link')}
        </Link>
      </div>
    </div>
  );
}
