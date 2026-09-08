'use client';
import { motion } from "framer-motion";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import dynamic from 'next/dynamic';
import React from 'react';
import { Flex, Container, Section, Heading, Text } from "@/components/ui";

import { useTranslations } from "next-intl";

const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export function LegalPageLayout({ title, lastUpdated, children }: { title: string, lastUpdated: string, children: React.ReactNode }) {
  const t = useTranslations('Legal');
  return (
    <Flex col className="flex-1 min-h-screen">
      <section className="relative flex flex-col items-center pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-28 overflow-hidden bg-background shrink-0 text-center">
        <BackgroundEffects />
        
        <div className="container mx-auto px-8 sm:px-10 md:px-12 max-w-6xl relative z-10 flex flex-col items-center gap-6 md:gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-[40px] sm:text-[52px] lg:text-[72px] font-bold font-heading text-white tracking-tight leading-[1.05] max-w-4xl select-none">
              {title}
            </h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <p className="text-[16px] md:text-[18px] text-foreground-secondary font-normal leading-relaxed max-w-2xl">
              {t('lastUpdatedLabel')}: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      <Container size="3xl" className="pb-24 relative z-10 flex-1">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/70 space-y-6 text-[15px] leading-relaxed [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-white [&>h3]:mt-8 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>a]:text-primary [&>a]:underline [&>strong]:text-white"
        >
          {children}
        </motion.div>
      </Container>
      
      <Footer />
    </Flex>
  );
}
