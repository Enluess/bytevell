'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { api, ApiError } from '@/lib/api';

export default function RegisterPage() {
  const t = useTranslations('Auth.Register');
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tc, setTc] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/auth/register', { name, email, tc, password });

      setSuccess(t('success'));
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
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

        {success && (
          <div className="mb-6 p-4 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">{t('name')}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#111111] border border-white/10 rounded-md py-2.5 pl-10 pr-4 text-white text-sm outline-none focus:border-white/30 focus:bg-[#151515] transition-all placeholder:text-white/30"
                placeholder="Enes Çevik"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">{t('tc') || 'T.C. Kimlik No'}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={tc}
                onChange={(e) => setTc(e.target.value.replace(/\D/g, '').slice(0, 11))}
                required
                minLength={11}
                maxLength={11}
                className="w-full bg-[#111111] border border-white/10 rounded-md py-2.5 pl-10 pr-4 text-white text-sm outline-none focus:border-white/30 focus:bg-[#151515] transition-all placeholder:text-white/30"
                placeholder="11 Haneli T.C. Kimlik Numaranız"
              />
            </div>
          </div>

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
            disabled={loading || !!success}
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
          {t('have_account')}{' '}
          <Link href="/auth/login" className="text-white hover:underline font-medium">
            {t('login_link')}
          </Link>
        </div>
      </div>
    </div>
  );
}
