'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Mail, Shield, ShieldCheck, MailOpen, Layers, Users, Server } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { useTranslations } from "next-intl";

const FaqSection = dynamic(() => import('@/components/FaqSection').then(mod => mod.FaqSection));
const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export default function MailHostingPage() {
  const t = useTranslations("MailHosting");

  const faqs = [
    { question: t('faqs.q1'), answer: t('faqs.a1') },
    { question: t('faqs.q2'), answer: t('faqs.a2') },
    { question: t('faqs.q3'), answer: t('faqs.a3') },
    { question: t('faqs.q4'), answer: t('faqs.a4') }
  ];

  const plans = [
    {
      name: t('plans.kurumsal10.name'),
      desc: t('plans.kurumsal10.desc'),
      price: { 'try': '39', 'usd': '1.2', 'eur': '1.1' },
      features: [t('plans.kurumsal10.f1'), t('plans.kurumsal10.f2'), t('plans.kurumsal10.f3'), t('plans.kurumsal10.f4'), t('plans.kurumsal10.f5')]
    },
    {
      name: t('plans.kurumsal50.name'),
      desc: t('plans.kurumsal50.desc'),
      price: { 'try': '79', 'usd': '2.5', 'eur': '2.3' },
      features: [t('plans.kurumsal50.f1'), t('plans.kurumsal50.f2'), t('plans.kurumsal50.f3'), t('plans.kurumsal50.f4'), t('plans.kurumsal50.f5'), t('plans.kurumsal50.f6')]
    },
    {
      name: t('plans.kurumsallimitsiz.name'),
      desc: t('plans.kurumsallimitsiz.desc'),
      price: { 'try': '149', 'usd': '4.5', 'eur': '4.2' },
      features: [t('plans.kurumsallimitsiz.f1'), t('plans.kurumsallimitsiz.f2'), t('plans.kurumsallimitsiz.f3'), t('plans.kurumsallimitsiz.f4'), t('plans.kurumsallimitsiz.f5'), t('plans.kurumsallimitsiz.f6')]
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
              <Link href={`/checkout?plan=mail-${idx}`} className="block w-full py-3 text-center rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-all">
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
