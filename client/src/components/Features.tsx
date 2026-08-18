'use client'

import { motion } from "framer-motion";
import { Cpu, Headset, TrendingUp } from "lucide-react";
import { Flex, Grid, Container, Section, Heading, Text, Badge } from "@/components/ui";
import { useTranslations } from "next-intl";

const featureKeys = ['f1', 'f2', 'f3'] as const;
const featureIcons = [Cpu, Headset, TrendingUp];
const featureGradients = [
  'from-blue-500/20 to-primary/20',
  'from-primary/20 to-purple-500/20',
  'from-purple-500/20 to-pink-500/20'
];

export function Features() {
  const t = useTranslations('Features');
  return (
    <Section className="relative z-10 bg-transparent">
      <Flex col items="center" gap="12" className="w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl px-6 space-y-4"
        >


          <Heading level={2} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15]">
            {t('title')}
          </Heading>

          <Text className="mx-auto max-w-2xl text-base md:text-[17px]">
            {t('description')}
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mt-16 bg-white/1 border-y border-white/10 w-full"
        >
          <Grid cols={1} className="lg:grid-cols-3 max-w-7xl mx-auto">
            {featureKeys.map((key, index) => {
              const Icon = featureIcons[index];
              const gradient = featureGradients[index];
              return (
                <Flex col justify="between" key={index} className={`group min-h-80 sm:min-h-95 lg:min-h-115 border-b border-white/10 lg:border-b-0 ${index !== featureKeys.length - 1 ? 'lg:border-r lg:border-white/10' : ''}`}>
                  <Flex items="center" justify="center" className="relative h-44 sm:h-52 md:h-64 w-full overflow-hidden py-6 sm:py-8">
                    <div className={`absolute w-48 h-48 rounded-full bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl`} />
                    <Flex items="center" justify="center" className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40">
                      <div className="absolute inset-0 rounded-full border border-white/6 group-hover:border-primary/20 group-hover:scale-110 transition-all duration-700" />
                      <div className="absolute inset-4 rounded-full border border-white/8 group-hover:border-primary/30 group-hover:scale-105 transition-all duration-500" />
                      <div className="absolute inset-8 rounded-full border border-white/10 group-hover:border-primary/40 transition-all duration-300" />
                      <Flex items="center" justify="center" className="relative z-10 w-16 h-16 rounded-2xl bg-white/3 border border-white/10 group-hover:border-primary/40 group-hover:bg-primary/10 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(100,107,242,0.2)]">
                        <Icon className="w-7 h-7 text-white/70 group-hover:text-primary transition-colors duration-500" strokeWidth={1.5} />
                      </Flex>
                    </Flex>
                  </Flex>

                  <div className="px-5 sm:px-8 md:px-10 pb-8 sm:pb-10 md:pb-12 pt-4 sm:pt-6 text-left space-y-2 sm:space-y-3">
                    <Heading level={3} className="text-2xl font-semibold tracking-tight text-white group-hover:text-primary transition-colors duration-300">
                      {t(`${key}_title` as any)}
                    </Heading>
                    <Text className="text-[15px] group-hover:text-white/90 transition-colors duration-300">
                      {t(`${key}_desc` as any)}
                    </Text>
                  </div>
                </Flex>
              );
            })}
          </Grid>
        </motion.div>
      </Flex>
    </Section>
  );
}
