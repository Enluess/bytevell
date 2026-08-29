'use client'

import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";

interface Props {
  title: string;
  description?: string;
  primaryText: string;
  primaryLink: string;
  secondaryText?: string;
  secondaryLink?: string;
}

export function CtaBanner({ title, description, primaryText, primaryLink, secondaryText, secondaryLink }: Props) {
  return (
    <section className="relative z-10 overflow-hidden bg-background py-24 sm:py-32 border-t border-white/5">
      {/* Subtle top light gradient */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] pointer-events-none opacity-[0.08]" 
        style={{ 
          background: 'radial-gradient(ellipse at top, var(--primary) 0%, transparent 70%)' 
        }} 
      />

      <div className="relative z-20 mx-auto max-w-4xl w-full px-6 text-center space-y-8">
        
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white tracking-tight leading-tight"
        >
          {title}
        </motion.h2>
        
        {description && (
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-[16px] md:text-[18px] text-foreground-secondary max-w-2xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link 
            href={primaryLink}
            className="rounded-xl px-8 py-3.5 bg-white text-black text-[15px] font-semibold hover:bg-white/90 active:scale-[0.98] transition-all duration-200 w-full sm:w-auto text-center shadow-sm"
          >
            {primaryText}
          </Link>
          
          {secondaryText && secondaryLink && (
            <Link 
              href={secondaryLink}
              className="px-6 py-3.5 text-[15px] text-foreground-secondary hover:text-white font-medium active:scale-[0.98] transition-all duration-200 w-full sm:w-auto text-center"
            >
              {secondaryText}
            </Link>
          )}
        </motion.div>
        
      </div>
    </section>
  );
}
