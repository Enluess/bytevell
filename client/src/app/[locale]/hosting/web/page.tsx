'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck, Server, History, Headphones, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { useTranslations } from "next-intl";

const FaqSection = dynamic(() => import('@/components/FaqSection').then(mod => mod.FaqSection));
const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));
export default function WebHostingPage() {
  const t = useTranslations("WebHosting");

  const faqs = [
    { question: t('faqs.q1'), answer: t('faqs.a1') },
    { question: t('faqs.q2'), answer: t('faqs.a2') },
    { question: t('faqs.q3'), answer: t('faqs.a3') },
  ];

  const plans = [
    {
      name: t('plans.starter.name'),
      desc: t('plans.starter.desc'),
      price: { 'try': '49', 'usd': '1.5', 'eur': '1.3' },
      features: [t('plans.starter.f1'), t('plans.starter.f2'), t('plans.starter.f3'), t('plans.starter.f4'), t('plans.starter.f5')]
    },
    {
      name: t('plans.pro.name'),
      desc: t('plans.pro.desc'),
      price: { 'try': '99', 'usd': '3', 'eur': '2.8' },
      features: [t('plans.pro.f1'), t('plans.pro.f2'), t('plans.pro.f3'), t('plans.pro.f4'), t('plans.pro.f5'), t('plans.pro.f6')]
    },
    {
      name: t('plans.ultra.name'),
      desc: t('plans.ultra.desc'),
      price: { 'try': '199', 'usd': '6', 'eur': '5.5' },
      features: [t('plans.ultra.f1'), t('plans.ultra.f2'), t('plans.ultra.f3'), t('plans.ultra.f4'), t('plans.ultra.f5'), t('plans.ultra.f6')]
    }
  ];


  return (
    <main className="flex-1 text-white min-h-screen">

      <section className="relative px-6 pb-20 pt-32 text-center flex flex-col items-center justify-center overflow-hidden">
        <BackgroundEffects />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-10 max-w-4xl select-none text-5xl font-medium leading-[1.05] tracking-tight lg:text-[72px] md:text-6xl"
          dangerouslySetInnerHTML={{ __html: t("title") }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-8 max-w-2xl text-base text-white/60 font-normal leading-relaxed tracking-wide md:text-[17px]"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-20 mt-10 flex justify-center"
        >
        </motion.div>
      </section>

      <section id="pricing" className="container mx-auto px-6 pb-20 space-y-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col relative overflow-hidden rounded-xl bg-white/1 border border-white/10 p-8 hover:bg-white/2 transition-colors"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-white/50">{plan.desc}</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold">₺{plan.price['try']}</span>
                <span className="text-white/50">{t("perMonth")}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                    <Check className="w-5 h-5 text-white/40 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/checkout?plan=${plan.name.toLowerCase()}`} className="block w-full py-3 text-center rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-all">
                {t("orderBtn")}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>


      <div className="container mx-auto px-6 max-w-6xl pb-20">
        <FaqSection faqs={faqs} />
      </div>

      <Footer />
    </main>
  );
}
