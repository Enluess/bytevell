'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { Loader2 } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { api, ApiError } from '@/lib/api';

export default function RegisterPage() {
  const t = useTranslations('Auth.Register');
  const router = useRouter();

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateForm, setStateForm] = useState('');
  const [country, setCountry] = useState('Türkiye');
  const [postalCode, setPostalCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 3) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor!"); // Or use translation if available
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/auth/register', { name, email, phone, address, city, state: stateForm, country, postalCode, password });

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

  const stepTitles = [
    'Kişisel Bilgiler',
    'Fatura Bilgileri',
    'Güvenlik'
  ];

  return (
    <div className="w-full max-w-[460px] mx-auto px-4">
      {/* Header */}
      <div className="mb-8 text-center flex flex-col items-center">
        <h1 className="text-[32px] font-semibold text-white mb-2 tracking-tight">{t('title')}</h1>
        <div className="text-white/60 text-[15px] tracking-wide">
          {stepTitles[step - 1]} • {step} / {totalSteps}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/5 rounded-full mb-10 overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[14px] text-center font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[14px] text-center font-medium">
          {success}
        </div>
      )}

      <form onSubmit={handleNext} className="space-y-6">
        {/* STEP 1: Kişisel Bilgiler */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[13px] text-white/70 flex gap-1">{t('name')} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#0A0A0A]/50 border border-white/5 hover:border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-white text-[14px] outline-none transition-all placeholder:text-white/20"
                  placeholder={t('name_placeholder')}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] text-white/70 flex gap-1">{t('phone')} <span className="text-red-500">*</span></label>
                <PhoneInput
                  defaultCountry="TR"
                  value={phone}
                  onChange={(val) => setPhone(val || "")}
                  required
                  placeholder={t('phone_placeholder')}
                />
              </div>
            </div>

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
          </div>
        )}

        {/* STEP 2: Adres */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[13px] text-white/70 flex gap-1">{t('city')} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full bg-[#0A0A0A]/50 border border-white/5 hover:border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-white text-[14px] outline-none transition-all placeholder:text-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] text-white/70 flex gap-1">{t('state')} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={stateForm}
                  onChange={(e) => setStateForm(e.target.value)}
                  required
                  className="w-full bg-[#0A0A0A]/50 border border-white/5 hover:border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-white text-[14px] outline-none transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] text-white/70 flex gap-1">{t('address')} <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full bg-[#0A0A0A]/50 border border-white/5 hover:border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-white text-[14px] outline-none transition-all placeholder:text-white/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[13px] text-white/70 flex gap-1">{t('country')} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="w-full bg-[#0A0A0A]/50 border border-white/5 hover:border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-white text-[14px] outline-none transition-all placeholder:text-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] text-white/70 flex gap-1">{t('postal_code')} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="w-full bg-[#0A0A0A]/50 border border-white/5 hover:border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-white text-[14px] outline-none transition-all placeholder:text-white/20"
                />
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: Güvenlik */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-2">
              <label className="text-[13px] text-white/70 flex gap-1">{t('password')} <span className="text-red-500">*</span></label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0A0A0A]/50 border border-white/5 hover:border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-white text-[14px] outline-none transition-all placeholder:text-white/20"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[13px] text-white/70 flex gap-1">{t('confirm_password')} <span className="text-red-500">*</span></label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-[#0A0A0A]/50 border border-white/5 hover:border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-white text-[14px] outline-none transition-all placeholder:text-white/20"
                placeholder="••••••••"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-2 flex items-center gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 bg-[#1A1A1A] text-white hover:bg-[#222] rounded-xl py-3.5 text-[15px] font-medium transition-all"
            >
              Geri Dön
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] bg-indigo-500 text-white hover:bg-indigo-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-3.5 text-[15px] font-medium transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              step === 3 ? 'Kayıt Ol' : 'Devam Et'
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center text-[14px] text-white/50">
        {t('have_account')}{' '}
        <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          {t('login_link')}
        </Link>
      </div>
    </div>
  );
}
