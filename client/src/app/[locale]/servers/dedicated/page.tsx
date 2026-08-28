import { Server } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { ReferenceBar } from "@/components/ReferenceBar";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Flex, Container, Section, Card, Badge, Heading, Text } from "@/components/ui";
import { getTranslations } from "next-intl/server";
import { fetchStorefrontProducts, getProductFeatures } from "@/lib/storefront";

import { Features } from "@/components/Features";
import { CtaBanner } from "@/components/CtaBanner";
const FaqSection = dynamic(() => import('@/components/FaqSection').then(mod => mod.FaqSection));
const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export default async function DedicatedServersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DedicatedServers" });
  
  const products = await fetchStorefrontProducts({ type: 'dedicated' });

  const faqs = [
    { question: t('faqs.q1'), answer: t('faqs.a1') },
    { question: t('faqs.q2'), answer: t('faqs.a2') },
    { question: t('faqs.q3'), answer: t('faqs.a3') },
    { question: t('faqs.q4'), answer: t('faqs.a4') },
    { question: t('faqs.q5'), answer: t('faqs.a5') }
  ];

  return (
    <Flex col className="flex-1 min-h-screen">
      
      <Flex col items="center" justify="center" className="relative px-6 pb-20 pt-32 text-center overflow-hidden">
        <BackgroundEffects />

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Heading level={1} className="mx-auto mt-10 max-w-4xl select-none leading-[1.05] tracking-tight" dangerouslySetInnerHTML={{ __html: t("title") }} />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <Text className="mx-auto mt-8 max-w-2xl md:text-[17px] tracking-wide">
            {t("subtitle")}
          </Text>
        </div>
      </Flex>

      <Section id="pricing" className="pt-0">
        <Container>
          <Flex col gap="3">
            {products.length === 0 ? (
               <div className="text-center text-white/50 py-10">No Dedicated plans available at the moment.</div>
            ) : products.map((plan, idx) => {
              const { features } = getProductFeatures(plan);
              const mainSpec = features.length > 0 ? features[0] : plan.name;
              const remainingSpecs = features.slice(1);
              const monthlyPrice = plan.prices.find(p => p.billingCycle === 'monthly')?.recurringPrice || '0.00';
              const currency = plan.prices[0]?.currency || 'TRY';

              return (
                <div key={plan.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                  <Card className="p-4 md:p-5 group border border-rose-500/10 hover:border-rose-500/30">
                    <Flex col className="md:flex-row md:items-center justify-between gap-5">
                      
                      <Flex className="flex-wrap md:flex-nowrap items-center w-full md:w-auto" gap="4 md:gap-6">
                        
                        <Flex items="center" gap="4" className="w-40 shrink-0">
                          <Flex items="center" justify="center" className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                            <Server className="w-6 h-6" strokeWidth={1.5} />
                          </Flex>
                          <Flex col>
                            <span className="text-[10px] font-bold text-white/20 tracking-wider uppercase">{plan.name}</span>
                            <span className="font-bold text-white text-[17px] tracking-wide">{mainSpec}</span>
                          </Flex>
                        </Flex>

                        <Flex items="center" gap="2" className="flex-wrap">
                          {remainingSpecs.map((spec: string, i: number) => (
                             <Badge key={i} className="bg-rose-500/5 text-rose-200 border-rose-500/10">{spec}</Badge>
                          ))}
                        </Flex>
                      </Flex>

                      <Flex className="w-full md:w-auto pt-4 md:pt-0 border-t border-white/5 md:border-0 mt-2 md:mt-0" items="center" justify="between" gap="6 md:gap-8">
                        <Flex items="baseline" gap="1">
                          <span className="text-xl font-black text-white tracking-tight">{currency === 'TRY' ? '₺' : (currency === 'USD' ? '$' : '€')}{monthlyPrice}</span>
                          <span className="text-xs font-medium text-white/20 tracking-wider">{t("perMonth")}</span>
                        </Flex>
                        <Link href={`/checkout?plan=${plan.slug}`} className="px-8 py-2.5 rounded-lg bg-white text-black font-semibold hover:bg-white/90 active:scale-[0.98] transition-all text-sm shadow-sm  shrink-0">
                          {t("orderBtn")}
                        </Link>
                      </Flex>

                    </Flex>
                  </Card>
                </div>
              );
            })}
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
