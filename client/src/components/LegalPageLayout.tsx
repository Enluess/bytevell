'use client';
import { motion } from "framer-motion";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import dynamic from 'next/dynamic';
import React from 'react';
import { Flex, Container, Section, Heading, Text } from "@/components/ui";

const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export function LegalPageLayout({ title, lastUpdated, children }: { title: string, lastUpdated: string, children: React.ReactNode }) {
  return (
    <Flex col className="flex-1 min-h-screen">
      <Flex col items="center" justify="center" className="relative px-6 pb-12 pt-32 text-center overflow-hidden shrink-0">
        <BackgroundEffects />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Heading level={1} className="mx-auto mt-10 max-w-4xl select-none leading-[1.05] tracking-tight">
            {title}
          </Heading>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Text className="mt-6 text-sm">
            Son Güncelleme: {lastUpdated}
          </Text>
        </motion.div>
      </Flex>

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
