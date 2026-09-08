import { Check, Mail, Shield, ShieldCheck, MailOpen, Layers, Users, Server } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { ReferenceBar } from "@/components/ReferenceBar";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { getTranslations } from "next-intl/server";
import { fetchStorefrontProducts, getProductFeatures } from "@/lib/storefront";

import { Features } from "@/components/Features";
import { CtaBanner } from "@/components/CtaBanner";
const FaqSection = dynamic(() => import('@/components/FaqSection').then(mod => mod.FaqSection));
const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export default async function MailHostingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MailHosting" });

  const products = await fetchStorefrontProducts({ groupSlug: 'mail-hosting' });

  const faqs = [
    { question: t('faqs.q1'), answer: t('faqs.a1') },
    { question: t('faqs.q2'), answer: t('faqs.a2') },
    { question: t('faqs.q3'), answer: t('faqs.a3') },
    { question: t('faqs.q4'), answer: t('faqs.a4') }
  ];

  return (
    <main className="flex-1 text-white min-h-screen">

      <section className="relative flex flex-col items-center pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-28 overflow-hidden bg-background">
        <BackgroundEffects />

        <div className="container mx-auto px-8 sm:px-10 md:px-12 max-w-6xl relative z-10 flex flex-col items-center text-center gap-6 md:gap-8">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1
              className="text-5xl sm:text-6xl lg:text-[72px] font-bold font-heading text-white leading-[1.15] tracking-tight max-w-4xl"
              dangerouslySetInnerHTML={{ __html: t("title") }}
            />
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <p className="mt-6 text-[16px] md:text-[18px] text-foreground-secondary max-w-2xl font-normal leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="mt-10 flex flex-row flex-wrap items-center justify-center gap-4 w-auto">
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center bg-white text-black font-semibold rounded-xl px-8 py-3.5 text-[15px] hover:bg-white/90 active:scale-[0.98] transition-all duration-200 w-auto shadow-sm"
            >
              Paketleri İncele
            </Link>
          </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="container mx-auto px-8 sm:px-10 md:px-12 pb-20 space-y-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-8">
          {products.length === 0 ? (
             <div className="col-span-full text-center text-white/50 py-10">No Mail Hosting plans available at the moment.</div>
          ) : products.map((plan, idx) => {
            const { features } = getProductFeatures(plan);
            const monthlyPrice = plan.prices.find(p => p.billingCycle === 'monthly')?.recurringPrice || '0.00';
            const currency = plan.prices[0]?.currency || 'TRY';

            return (
              <div
                key={plan.id}
                className="flex flex-col relative overflow-hidden rounded-xl bg-[#0a0b0d]/50 border border-white/5 p-6 sm:p-8 hover:bg-white/[0.03] transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold font-heading text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-foreground-secondary">Perfect for business email</p>
                </div>
                <div className="mb-8">
                  <span className="text-4xl md:text-5xl font-bold font-heading text-white">{currency === 'TRY' ? '₺' : (currency === 'USD' ? '$' : '€')}{monthlyPrice}</span>
                  <span className="text-white/50">{t("perMonth")}</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {features.length > 0 ? features.map((feat: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-foreground-secondary">
                      <Check className="w-5 h-5 text-white/20 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  )) : (
                    <li className="flex items-center gap-3 text-sm text-foreground-secondary">
                      <span>No features listed.</span>
                    </li>
                  )}
                </ul>
                <Link href={`/checkout?plan=${plan.slug}`} className="block w-full py-3.5 text-center rounded-xl bg-white text-black hover:bg-white/90 font-semibold active:scale-[0.98] transition-all text-[15px] shadow-sm">
                  {t("orderBtn")}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <ReferenceBar />
      <Features />

      <div className="container mx-auto px-8 sm:px-10 md:px-12 max-w-6xl pb-20">
        <FaqSection faqs={faqs} />
      </div>

      <CtaBanner 
        title="Hazır mısınız?"
        description="Hemen sipariş verin, projenizi saniyeler içinde hayata geçirin."
        primaryText="Sipariş Ver"
        primaryLink="/checkout"
      />

      <Footer />
    </main>
  );
}
