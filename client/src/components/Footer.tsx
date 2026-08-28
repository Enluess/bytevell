'use client'

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full border-t border-white/5 bg-background pt-16 md:pt-24 pb-8 sm:pb-12">
      <div className="container mx-auto px-5 sm:px-6 lg:px-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          <div className="lg:col-span-5 flex flex-col gap-6 pr-8">
            <Link href="/" className="flex items-center">
              <Image src="/bytevell-beyaz.svg" alt="Bytevell Logo" width={120} height={32} className="object-contain" style={{ width: 'auto', height: 'auto' }} />
            </Link>
            <p className="text-[15px] text-foreground-secondary leading-relaxed max-w-md">
              {t('desc')}
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-6">
              <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider font-mono">
                {t('col1')}
              </h3>
              <ul className="flex flex-col gap-3.5">
                <li><Link href="/hosting/web" className="text-[15px] text-foreground-secondary hover:text-white transition-colors">{t('l1_1')}</Link></li>
                <li><Link href="/hosting/mail" className="text-[15px] text-foreground-secondary hover:text-white transition-colors">{t('l1_2')}</Link></li>
                <li><Link href="/servers/vps" className="text-[15px] text-foreground-secondary hover:text-white transition-colors">{t('l1_3')}</Link></li>
                <li><Link href="/servers/dedicated" className="text-[15px] text-foreground-secondary hover:text-white transition-colors">{t('l1_4')}</Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider font-mono">
                {t('col2')}
              </h3>
              <ul className="flex flex-col gap-3.5">
                <li><Link href="/about" className="text-[15px] text-foreground-secondary hover:text-white transition-colors">{t('l2_1')}</Link></li>
                <li><Link href="/contact" className="text-[15px] text-foreground-secondary hover:text-white transition-colors">{t('l2_2')}</Link></li>
                <li><Link href="/blog" className="text-[15px] text-foreground-secondary hover:text-white transition-colors">{t('l2_3')}</Link></li>
                <li><a href="https://status.bytevell.com" target="_blank" rel="noopener noreferrer" className="text-[15px] text-foreground-secondary hover:text-white transition-colors">{t('l2_4')}</a></li>
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider font-mono">
                {t('col3')}
              </h3>
              <ul className="flex flex-col gap-3.5">
                <li><Link href="/legal/terms" className="text-[15px] text-foreground-secondary hover:text-white transition-colors">{t('l3_1')}</Link></li>
                <li><Link href="/legal/privacy" className="text-[15px] text-foreground-secondary hover:text-white transition-colors">{t('l3_2')}</Link></li>
                <li><Link href="/legal/refund" className="text-[15px] text-foreground-secondary hover:text-white transition-colors">{t('l3_3')}</Link></li>
                <li><Link href="/legal/kvkk" className="text-[15px] text-foreground-secondary hover:text-white transition-colors">{t('l3_4')}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-[14px] text-foreground-secondary text-center md:text-left">
            &copy; {currentYear} {t('copyright')}
          </p>
          <div className="flex items-center gap-6 text-[14px] text-foreground-secondary">
            <a href="mailto:iletisim@bytevell.com" className="hover:text-white transition-colors">iletisim@bytevell.com</a>
            <a href="https://discord.gg/bytevell" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
