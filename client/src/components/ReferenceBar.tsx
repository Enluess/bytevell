'use client'

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function ReferenceBar() {
  const t = useTranslations('ReferenceBar');
  
  const references = [
    { name: t('r1_name'), count: t('r1_count') },
    { name: t('r2_name'), count: t('r2_count') },
    { name: t('r3_name'), count: t('r3_count') },
    { name: t('r4_name'), count: t('r4_count') }
  ];
  
  return (
    <div className="relative z-10 w-full bg-background py-10 md:py-14 hidden md:block">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {references.map((ref, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
              className="flex flex-col items-center justify-center text-center px-4"
            >
              <div className="text-[13px] font-medium text-foreground-muted uppercase tracking-widest mb-3 font-mono">
                {ref.name}
              </div>
              <div className="text-3xl md:text-4xl font-bold tracking-tight text-white font-heading">
                {ref.count}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Subtle separator line */}
      <div className="max-w-4xl mx-auto mt-10 md:mt-14">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
}
