'use client';

import { motion } from "framer-motion";
import { Cpu } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Flex, Container, Section, Card, Badge, Heading, Text } from "@/components/ui";
import { useTranslations } from "next-intl";

const FaqSection = dynamic(() => import('@/components/FaqSection').then(mod => mod.FaqSection));
const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export default function DedicatedServersPage() {
  const t = useTranslations("DedicatedServers");

  const faqs = [
    { question: t('faqs.q1'), answer: t('faqs.a1') },
    { question: t('faqs.q2'), answer: t('faqs.a2') },
    { question: t('faqs.q3'), answer: t('faqs.a3') },
    { question: t('faqs.q4'), answer: t('faqs.a4') },
    { question: t('faqs.q5'), answer: t('faqs.a5') }
  ];

  const plans = [
    { cpuBrand: 'AMD Ryzen', cpuModel: '7 7700X', ram: '64GB', disk: '2x 1TB NVMe Disk', cpuInfo: '8 Core / 16 Thread', net: '1 Gbps Port / Limitsiz', price: '2.450,00' },
    { cpuBrand: 'AMD Ryzen', cpuModel: '9 7950X', ram: '128GB', disk: '2x 2TB NVMe Disk', cpuInfo: '16 Core / 32 Thread', net: '1 Gbps Port / Limitsiz', price: '4.850,00' },
    { cpuBrand: 'AMD Ryzen', cpuModel: '9 9950X', ram: '192GB', disk: '2x 4TB NVMe Disk', cpuInfo: '16 Core / 32 Thread', net: '10 Gbps Port / Limitsiz', price: '7.250,00' },
    { cpuBrand: 'AMD EPYC', cpuModel: '7763', ram: '256GB', disk: '4x 2TB NVMe Disk', cpuInfo: '64 Core / 128 Thread', net: '10 Gbps Port / Limitsiz', price: '12.450,00' },
    { cpuBrand: 'AMD EPYC', cpuModel: '9654', ram: '512GB', disk: '4x 4TB NVMe Disk', cpuInfo: '96 Core / 192 Thread', net: '10 Gbps Port / Limitsiz', price: '19.850,00' }
  ];

  return (
    <Flex col className="flex-1 min-h-screen">
      
      <Flex col items="center" justify="center" className="relative px-6 pb-20 pt-32 text-center overflow-hidden">
        <BackgroundEffects />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Heading level={1} className="mx-auto mt-10 max-w-4xl select-none leading-[1.05] tracking-tight" dangerouslySetInnerHTML={{ __html: t("title") }} />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Text className="mx-auto mt-8 max-w-2xl md:text-[17px] tracking-wide">
            {t("subtitle")}
          </Text>
        </motion.div>
      </Flex>

      <Section id="pricing" className="pt-12 md:pt-16">
        <Container>
          <Flex col gap="3">
            {plans.map((plan, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.05 }}>
                <Card className="p-4 md:p-5 group">
                  <Flex col className="md:flex-row md:items-center justify-between gap-5">
                    
                    <Flex className="flex-wrap md:flex-nowrap items-center w-full md:w-auto" gap="4 md:gap-6">
                      <Flex items="center" gap="4" className="w-48 shrink-0">
                        <Flex items="center" justify="center" className="p-2.5 rounded-xl bg-white/5 text-white/50 group-hover:text-white group-hover:bg-white/10 transition-colors">
                          <Cpu className="w-6 h-6" strokeWidth={1.5} />
                        </Flex>
                        <Flex col>
                          <span className="text-[10px] font-bold text-white/40 tracking-wider uppercase">{plan.cpuBrand}</span>
                          <span className="font-bold text-white text-[15px] tracking-wide leading-tight">{plan.cpuModel}</span>
                        </Flex>
                      </Flex>

                      <Flex items="center" gap="2" className="flex-wrap">
                        <Badge>{plan.ram} RAM</Badge>
                        <Badge>{plan.cpuInfo}</Badge>
                        <Badge>{plan.disk}</Badge>
                        <Badge>{plan.net}</Badge>
                      </Flex>
                    </Flex>

                    <Flex className="w-full md:w-auto pt-4 md:pt-0 border-t border-white/5 md:border-0 mt-2 md:mt-0" items="center" justify="between" gap="6 md:gap-8">
                      <Flex items="baseline" gap="1" className="shrink-0">
                        <span className="text-xl font-black text-white tracking-tight">₺{plan.price}</span>
                        <span className="text-xs font-medium text-white/40 tracking-wider">{t("perMonth")}</span>
                      </Flex>
                      <Link href={`/checkout?plan=dedicated-${idx}`} className="px-8 py-2.5 rounded-xl bg-white text-black font-bold hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] shrink-0">
                        {t("orderBtn")}
                      </Link>
                    </Flex>

                  </Flex>
                </Card>
              </motion.div>
            ))}
          </Flex>
        </Container>
      </Section>

      <Container className="max-w-6xl pb-20">
        <FaqSection faqs={faqs} />
      </Container>

      <Footer />
    </Flex>
  );
}
