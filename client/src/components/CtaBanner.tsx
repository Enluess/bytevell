'use client'

import Link from "next/link";
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
    <section className="relative z-10 overflow-hidden bg-transparent pt-32 pb-0 mb-32 border-t border-white/10">
      <div className="relative z-20 mx-auto max-w-4xl w-full px-6 text-center space-y-8">
        
        {/* Optimized giant indigo glow using radial-gradient */}
        <div 
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-full -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(ellipse at center, rgba(100,107,242,0.15) 0%, transparent 60%)' }}
        ></div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-5xl lg:text-7xl font-medium font-sans text-white tracking-tight leading-[1.1]"
        >
          {title}
        </motion.h2>
        
        {description && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-lg text-foreground/70"
          >
            {description}
          </motion.p>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8"
        >
          <Link 
            href={primaryLink}
            className="rounded-xl px-8 py-3 bg-white text-black font-semibold hover:bg-white/80 transition-all active:scale-95 duration-200"
          >
            {primaryText}
          </Link>
          
          {secondaryText && secondaryLink && (
            <Link 
              href={secondaryLink}
              className="text-foreground/70 font-medium hover:text-white transition-colors duration-200"
            >
              {secondaryText}
            </Link>
          )}
        </motion.div>
        
      </div>
    </section>
  );
}
