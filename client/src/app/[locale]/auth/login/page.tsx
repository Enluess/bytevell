'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { useAuthStore } from '@/store/useAuthStore';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { api, ApiError } from '@/lib/api';

export default function LoginPage() {
  const t = useTranslations('Auth.Login');
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);

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
      
      // Success
      setAuth(data.token, data.user);
      router.push('/panel/dashboard');
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
    <div className="w-full max-w-[420px]">
      <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white mb-2">{t('title')}</h1>
          <p className="text-white/60 text-sm">{t('subtitle')}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#111111] border border-white/10 rounded-md py-2.5 pl-10 pr-4 text-white text-sm outline-none focus:border-white/30 focus:bg-[#151515] transition-all placeholder:text-white/30"
                placeholder="ornek@mail.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#111111] border border-white/10 rounded-md py-2.5 pl-10 pr-4 text-white text-sm outline-none focus:border-white/30 focus:bg-[#151515] transition-all placeholder:text-white/30"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-md py-3 text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                {t('button')}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/5 text-center text-sm text-white/60">
          {t('no_account')}{' '}
          <Link href="/auth/register" className="text-white hover:underline font-medium">
            {t('register_link')}
          </Link>
        </div>
      </div>
    </div>
  );
}

