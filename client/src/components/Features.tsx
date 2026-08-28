'use client'

import { motion } from "framer-motion";
import { Cpu, ShieldCheck, HeadphonesIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function Features() {
  const t = useTranslations('Features');

  const featureKeys = ['f1', 'f2', 'f3'] as const;
  const featureIcons = [Cpu, ShieldCheck, HeadphonesIcon];

  return (
    <section className="py-24 md:py-32 bg-[#0a0b0d] relative z-10 border-t border-white/5 overflow-hidden">
      {/* Subtle dot pattern background to match FAQ */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', 
          backgroundSize: '24px 24px',
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
        }} 
      />
      <div className="container mx-auto px-5 sm:px-6 md:px-10 max-w-6xl relative z-10">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight font-heading mb-6 leading-tight">
              {t('title')}
            </h2>
            <p className="text-foreground-secondary text-[16px] md:text-[18px] leading-relaxed">
              {t('description')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 border-t border-white/5 pt-16">
          {featureKeys.map((key, index) => {
            const Icon = featureIcons[index];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col items-start"
              >
                <div className="mb-6 text-white/40 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white mb-3 font-heading">
                  {t(`${key}_title` as any)}
                </h3>
                <p className="text-[15px] text-foreground-secondary leading-relaxed">
                  {t(`${key}_desc` as any)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
