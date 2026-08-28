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
    <div className="relative z-10 w-full bg-background border-y border-white/5 py-8 md:py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-white/5">
          {references.map((ref, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
              className="flex flex-col items-center justify-center text-center px-4"
            >
              <div className="text-[12px] font-medium text-foreground-secondary uppercase tracking-widest mb-2 font-mono">
                {ref.name}
              </div>
              <div className="text-xl md:text-2xl font-bold tracking-tight text-white font-heading">
                {ref.count}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
