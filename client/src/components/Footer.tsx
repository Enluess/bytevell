'use client'

import Link from "next/link";
import Image from "next/image"; export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full border-t border-white/10 bg-transparent pt-12 sm:pt-16 md:pt-24 pb-8 sm:pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-8 mb-10 md:mb-16">

          <div className="lg:col-span-4 flex flex-col gap-6 pr-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold font-heading text-white tracking-tight">
                <Image src="/bytevell-beyaz.svg" alt="Bytevell Logo" width={135} height={36} className="object-contain" />
              </span>
            </Link>
            <p className="text-[15px] text-foreground/70 leading-relaxed font-normal">
              Yüksek performanslı, güvenilir ve yenilikçi hosting çözümleri. Dijital dünyadaki en sağlam altyapınız.
            </p>

            <div className="flex gap-4 mt-2">
              <a href="https://discord.gg/nahbgsaasC" className="text-foreground/50 hover:text-[#5865F2] transition-colors duration-200" aria-label="Discord">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-6">
              <h3 className="whitespace-nowrap text-sm font-semibold tracking-wide text-white uppercase">
                Hizmetler
              </h3>
              <ul className="flex flex-col gap-4">
                <li><Link href="/hosting/web" className="whitespace-nowrap text-[15px] text-foreground/70 hover:text-white transition-colors duration-200">Web Hosting</Link></li>
                <li><Link href="/hosting/mail" className="whitespace-nowrap text-[15px] text-foreground/70 hover:text-white transition-colors duration-200">Mail Hosting</Link></li>
                <li><Link href="/servers/vps" className="whitespace-nowrap text-[15px] text-foreground/70 hover:text-white transition-colors duration-200">Sanal Sunucu</Link></li>
                <li><Link href="/servers/dedicated" className="whitespace-nowrap text-[15px] text-foreground/70 hover:text-white transition-colors duration-200">Dedicated Sunucu</Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="whitespace-nowrap text-sm font-semibold tracking-wide text-white uppercase">
                Bağlantılar
              </h3>
              <ul className="flex flex-col gap-4">
                <li><Link href="/about" className="whitespace-nowrap text-[15px] text-foreground/70 hover:text-white transition-colors duration-200">Hakkımızda</Link></li>
                <li><Link href="/contact" className="whitespace-nowrap text-[15px] text-foreground/70 hover:text-white transition-colors duration-200">İletişim</Link></li>
                <li><Link href="/blog" className="whitespace-nowrap text-[15px] text-foreground/70 hover:text-white transition-colors duration-200">Blog</Link></li>
                <li><a href="https://status.bytevell.com" target="_blank" rel="noopener noreferrer" className="whitespace-nowrap text-[15px] text-foreground/70 hover:text-white transition-colors duration-200">Ağ Durumu</a></li>
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="whitespace-nowrap text-sm font-semibold tracking-wide text-white uppercase">
                Yasal
              </h3>
              <ul className="flex flex-col gap-4">
                <li><Link href="/legal/terms" className="whitespace-nowrap text-[15px] text-foreground/70 hover:text-white transition-colors duration-200">Kullanım Şartları</Link></li>
                <li><Link href="/legal/privacy" className="whitespace-nowrap text-[15px] text-foreground/70 hover:text-white transition-colors duration-200">Gizlilik Politikası</Link></li>
                <li><Link href="/legal/refund" className="whitespace-nowrap text-[15px] text-foreground/70 hover:text-white transition-colors duration-200">İade Koşulları</Link></li>
                <li><Link href="/legal/kvkk" className="whitespace-nowrap text-[15px] text-foreground/70 hover:text-white transition-colors duration-200">KVKK Aydınlatma</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-white/10 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] sm:text-[14px] text-foreground/60 text-center sm:text-left">
            &copy; {currentYear} Bytevell LLC. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-[13px] sm:text-[14px] text-foreground/60">
            <a href="mailto:iletisim@bytevell.com" className="hover:text-white transition-colors duration-200">
              iletisim@bytevell.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
