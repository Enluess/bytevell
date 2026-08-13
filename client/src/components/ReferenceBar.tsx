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
    <div className="relative z-10 w-full bg-white/1 border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {references.map((ref, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className={`group relative flex flex-col items-center justify-center text-center py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 border-b border-white/10 lg:border-b-0 ${index !== references.length - 1 ? 'lg:border-r lg:border-white/10' : ''
                } ${index % 2 !== 1 ? 'border-r border-white/10 lg:border-r-0' : ''
                } ${index >= 2 ? 'max-sm:border-b-0' : ''
                }`}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(circle at center, rgba(100,107,242,0.1) 0%, transparent 60%)' }}
              />

              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-1 sm:mb-2 relative z-10 group-hover:text-primary transition-colors duration-300">
                {ref.count}
              </div>
              <div className="text-sm font-medium text-foreground/60 uppercase tracking-widest relative z-10 group-hover:text-foreground/90 transition-colors duration-300">
                {ref.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
