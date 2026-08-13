'use client'

import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { useTranslations } from "next-intl";


export function Hero() {
  const t = useTranslations('Hero');

  return (
    <>
      <section className="relative flex items-center justify-center pt-28 sm:pt-32 md:pt-40 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
        <BackgroundEffects />

        <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-4xl relative z-10 text-center flex flex-col items-center gap-5 sm:gap-6 md:gap-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_0_15px_rgba(100,107,242,0.15)] will-change-transform"
          >
            <span className="text-xs font-medium text-foreground tracking-wide">{t('badge')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
            className="text-[28px] leading-[1.15] sm:text-4xl md:text-5xl lg:text-[72px] font-medium font-sans text-white md:leading-[1.05] tracking-tight will-change-transform"
          >
            {t('title1')} <br className="hidden sm:block" />{t('title2')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-sm sm:text-base md:text-[17px] text-foreground/70 max-w-2xl font-normal leading-relaxed tracking-wide will-change-transform px-2 sm:px-0"
          >
            {t('description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: "easeOut" }}
            className="flex items-center gap-4 mt-4 sm:mt-6 relative z-20 will-change-transform w-full sm:w-auto justify-center"
          >
            <div
              className="absolute left-1/2 top-1/2 h-40 w-72 rounded-full -z-1 -translate-x-1/2 -translate-y-1/2"
              style={{ background: 'radial-gradient(circle, rgba(100,107,242,0.3) 0%, transparent 70%)' }}
            ></div>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center bg-white text-black font-semibold rounded-xl px-8 py-3.5 sm:py-3 text-base shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto"
            >
              {t('button')}
            </Link>
          </motion.div>
        </div>


      </section>
    </>
  );
}
