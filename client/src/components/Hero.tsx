'use client'

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";

export function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="relative flex flex-col items-center justify-center pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-24 md:pb-32 overflow-hidden min-h-[85vh] bg-background">
      {/* Extremely subtle background accent, no huge glows */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <div className="container mx-auto px-5 sm:px-6 md:px-10 max-w-6xl relative z-10 flex flex-col items-center text-center gap-6 md:gap-8">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[12px] font-medium text-white/70 font-mono uppercase tracking-widest">
            {t('eyebrow')}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-[42px] sm:text-[52px] md:text-[60px] lg:text-[68px] font-bold font-heading text-white tracking-tight leading-[1.05] max-w-4xl"
        >
          {t('title1')} <br className="hidden sm:block" />
          <span className="text-white/80">{t('title2')}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="text-[16px] md:text-[18px] text-foreground-secondary max-w-2xl font-normal leading-relaxed"
        >
          {t('description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/servers/vds"
            className="inline-flex items-center justify-center bg-white text-black font-semibold rounded-md px-8 py-3.5 text-[15px] hover:bg-white/90 active:scale-[0.98] transition-all duration-200 w-full sm:w-auto shadow-sm"
          >
            {t('button')}
          </Link>
          <Link
            href="/servers/dedicated"
            className="inline-flex items-center justify-center text-white/80 hover:text-white font-medium rounded-md border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 px-8 py-3.5 text-[15px] active:scale-[0.98] transition-all duration-200 w-full sm:w-auto group"
          >
            {t('secondary_button')}
            <ChevronRight className="w-4 h-4 ml-1 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
