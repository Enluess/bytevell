'use client'

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 grid-pattern opacity-50" />


      {/* Optimized ambient glow using radial-gradient instead of heavy blur */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          top: '-10%', left: '-5%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%)',
          animation: 'float 30s ease-in-out infinite alternate'
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          bottom: '-10%', right: '-5%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 70%)',
          animation: 'float 35s ease-in-out infinite alternate',
          animationDelay: '-10s'
        }}
      />
    </div>
  );
}

export function Hero() {
  return (
    <>
      <ThreeBackground />
      <section className="relative min-h-[75vh] flex items-center justify-center pt-20 pb-10 overflow-hidden">
        {/* Full-coverage glow background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-60 mix-blend-screen"
          style={{ background: 'radial-gradient(ellipse 100% 100% at center 45%, rgba(100,107,242,0.25) 0%, transparent 80%)' }}
        />

        {/* Decorative gradient orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-float pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(100,107,242,0.20) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[15%] right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-float pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(100,107,242,0.15) 0%, transparent 70%)', animationDelay: '-3s' }}
        />
        {/* Bottom area glow to fill the void */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center top, rgba(100,107,242,0.12) 0%, transparent 70%)' }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 text-center flex flex-col items-center gap-8">

          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_0_15px_rgba(100,107,242,0.15)] will-change-transform"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-foreground tracking-wide">Yüksek Performanslı Altyapı</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
            className="text-5xl md:text-[72px] font-medium font-sans text-white leading-[1.05] tracking-tight will-change-transform"
          >
            Kesintisiz sunucu <br /> performansını keşfedin.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-base md:text-[17px] text-foreground/70 max-w-2xl font-normal leading-relaxed tracking-wide will-change-transform"
          >
            Yüksek performanslı sanal sunucular, DDoS korumalı dedicated altyapısı ve benzersiz çalışma süresi ile projelerinizi özgürce büyütün.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: "easeOut" }}
            className="flex items-center gap-4 mt-6 relative z-20 will-change-transform"
          >
            <div
              className="absolute left-1/2 top-1/2 h-40 w-72 rounded-full -z-1 -translate-x-1/2 -translate-y-1/2"
              style={{ background: 'radial-gradient(circle, rgba(100,107,242,0.3) 0%, transparent 70%)' }}
            ></div>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center bg-white text-black font-semibold rounded-xl px-8 py-3 text-base shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300"
            >
              Sunucuları Keşfedin
            </Link>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>
    </>
  );
}
