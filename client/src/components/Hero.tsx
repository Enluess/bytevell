'use client'

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import { ByteVellAscii } from "@/components/ByteVellAscii";

export function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="relative flex flex-col items-center justify-center pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-24 md:pb-32 overflow-hidden min-h-[85vh] bg-background">
      {/* Subtle grid background pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', 
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }} 
      />
      
      {/* Subtle top light gradient */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] max-w-4xl h-[500px] pointer-events-none opacity-[0.12]" 
        style={{ 
          background: 'radial-gradient(ellipse at top, var(--primary) 0%, transparent 70%)' 
        }} 
      />

      <div className="container mx-auto px-5 sm:px-6 md:px-10 max-w-6xl relative z-10 flex flex-col items-center text-center gap-6 md:gap-8">

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-[42px] sm:text-[52px] md:text-[60px] lg:text-[68px] font-bold font-heading text-white tracking-tight leading-[1.05] max-w-4xl"
        >
          {t('title1')} <br className="hidden sm:block" />
          <span>{t('title2')}</span>
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
            className="inline-flex items-center justify-center bg-white text-black font-semibold rounded-xl px-8 py-3.5 text-[15px] hover:bg-white/90 active:scale-[0.98] transition-all duration-200 w-full sm:w-auto shadow-sm"
          >
            {t('button')}
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] pointer-events-none opacity-80 mix-blend-screen flex items-end justify-center z-0"
           style={{ maskImage: 'radial-gradient(ellipse at bottom, black 40%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse at bottom, black 40%, transparent 80%)' }}
      >
        <ByteVellAscii className="w-full pointer-events-auto pb-4" density={0.8} speed={0.6} />
      </div>
    </section>
  );
}
