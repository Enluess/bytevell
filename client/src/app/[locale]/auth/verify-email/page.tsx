'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { Loader2, MailCheck, ArrowRight } from 'lucide-react';
import { api, ApiError } from '@/lib/api';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [isResending, setIsResending] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !success) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown, success]);

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setError('');
    
    try {
      await api.post('/auth/resend-verification', { email });
      setCountdown(120);
    } catch (err: any) {
      setError(err.message || 'Kod yeniden gönderilemedi.');
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (!email) {
      router.push('/auth/register');
    }
  }, [email, router]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      setError('Lütfen 6 haneli kodu eksiksiz girin.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/verify-email', { email, code: fullCode });
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Doğrulama başarısız. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 text-center">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
          <MailCheck className="w-8 h-8 text-indigo-500" />
        </div>
        <h1 className="text-[32px] font-semibold text-white mb-2 tracking-tight">Kodu Girin</h1>
        <p className="text-white/60 text-[15px] tracking-wide leading-relaxed">
          <span className="text-white font-medium">{email}</span> adresine 6 haneli bir doğrulama kodu gönderdik.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[14px] font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[14px] font-medium">
          Doğrulama başarılı! Giriş sayfasına yönlendiriliyorsunuz...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-between gap-2">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={success || loading}
              className="w-12 h-14 text-center text-xl font-bold text-white bg-[#0A0A0A]/50 border border-white/5 hover:border-white/10 focus:border-indigo-500/50 focus:bg-[#0A0A0A] rounded-xl outline-none transition-all disabled:opacity-50"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || success || code.join('').length !== 6}
          className="w-full bg-indigo-500 text-white hover:bg-indigo-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-3.5 text-[15px] font-medium transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(90,81,214,0.3)]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              Doğrula ve Tamamla
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
        
        <div className="pt-4 flex flex-col items-center gap-2">
          <p className="text-[13px] text-white/50">Kodu almadınız mı?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0 || isResending || success}
            className="text-[14px] font-medium text-indigo-400 hover:text-indigo-300 disabled:text-white/30 disabled:cursor-not-allowed transition-colors"
          >
            {isResending ? 'Gönderiliyor...' : countdown > 0 ? `Kodu Yeniden Gönder (${countdown}s)` : 'Kodu Yeniden Gönder'}
          </button>
        </div>
      </form>
    </div>
  );
}
