'use client'

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[100svh] pt-24 pb-20 overflow-hidden bg-background">
      {/* Subtle top light gradient — single soft glow, no grid */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] max-w-5xl h-[600px] pointer-events-none opacity-[0.15]" 
        style={{ 
          background: 'radial-gradient(ellipse at top, var(--primary) 0%, transparent 60%)' 
        }} 
      />


      {/* Central strong glow like Nodesty */}
      <div 
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[80%] max-w-2xl h-[300px] pointer-events-none opacity-20 blur-[100px]" 
        style={{ background: 'var(--primary)' }}
      />
      {/* Text content */}
      <div className="container mx-auto px-8 sm:px-10 md:px-12 max-w-6xl relative z-10 flex flex-col items-center text-center gap-6 md:gap-8">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-[36px] sm:text-[52px] lg:text-[72px] font-bold font-heading text-white leading-[1.1] tracking-tight max-w-4xl"
        >
          {t('title1')} <br />
          <span>{t('title2')}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-[16px] md:text-[18px] text-foreground-secondary max-w-2xl font-normal leading-relaxed"
        >
          {t('description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex flex-row flex-wrap items-center justify-center gap-4 w-auto"
        >
          <Link
            href="/servers/vds"
            className="inline-flex items-center justify-center bg-white text-black font-semibold rounded-xl px-8 py-3.5 text-[15px] hover:bg-white/90 active:scale-[0.98] transition-all duration-200 w-auto shadow-sm"
          >
            {t('button')}
          </Link>
        </motion.div>
      </div>

      {/* Bottom fade for seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
