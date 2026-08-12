'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Mail, Shield, ShieldCheck, MailOpen, Layers, Users, Server } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { BackgroundEffects } from "@/components/BackgroundEffects";

const FaqSection = dynamic(() => import('@/components/FaqSection').then(mod => mod.FaqSection));
const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export default function MailHostingPage() {

  const faqs = [
    {
      question: 'Kendi alan adım (domain) ile e-posta kullanabilir miyim?',
      answer: 'Kesinlikle. Sahip olduğunuz mevcut alan adınızı (örn: adiniz@sirketiniz.com) sistemlerimize bağlayarak dakikalar içinde profesyonel e-posta gönderip almaya başlayabilirsiniz.'
    },
    {
      question: 'Outlook veya akıllı telefonumdan e-postalarımı kontrol edebilir miyim?',
      answer: 'Tüm mail hosting sunucularımız POP3, IMAP ve SMTP protokollerini tam olarak destekler. Outlook, Apple Mail, Gmail uygulaması veya herhangi bir mobil cihazdan e-postalarınızı senkronize edebilirsiniz.'
    },
    {
      question: 'Anti-Spam (Gereksiz e-posta) koruması var mı?',
      answer: 'Evet, kurumsal mail sunucularımızda yapay zeka destekli gelişmiş Anti-Spam ve Anti-Virüs koruması bulunmaktadır. Gelen kutunuz gereksiz ve zararlı yazılımlardan %99 oranında temizlenir.'
    },
    {
      question: 'Eski maillerimi size taşıyabilir miyim?',
      answer: 'Taşıma uzmanlarımız, eski e-posta sunucunuzdaki veya standart hostinginizdeki tüm mailleri klasör yapıları bozulmadan yeni kurumsal mail servisine ücretsiz olarak taşımaktadır.'
    }
  ];

  const plans = [
    {
      name: "Kurumsal 10",
      desc: "Giriş seviyesi işletmeler ve startup'lar için.",
      price: { 'try': '39', 'usd': '1.2', 'eur': '1.1' },
      features: ['10 GB E-Posta Kotası', '5 Adet Mail Hesabı', 'Gelişmiş Anti-Spam', 'IMAP/POP3 Desteği', 'Mobil & Webmail Uyumlu']
    },
    {
      name: "Kurumsal 50",
      desc: "Yoğun mail trafiği olan orta ölçekli şirketler için.",
      price: { 'try': '79', 'usd': '2.5', 'eur': '2.3' },
      features: ['50 GB E-Posta Kotası', '25 Adet Mail Hesabı', 'Gelişmiş Anti-Spam', 'Ortak Takvim & Ajanda', 'Ücretsiz Mail Taşıma', 'Öncelikli Destek']
    },
    {
      name: "Kurumsal Limitsiz",
      desc: "Kurumsal büyük markalar ve ajanslar için.",
      price: { 'try': '149', 'usd': '4.5', 'eur': '4.2' },
      features: ['Limitsiz E-Posta Kotası', 'Limitsiz Mail Hesabı', 'Özel IP Adresi', 'Gelişmiş Anti-Spam', 'Ortak Takvim & Ajanda', 'Sınırsız Arşivleme']
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
        >
          Kurumsal <br /> Mail Hosting
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-8 max-w-2xl text-base text-white/60 font-normal leading-relaxed tracking-wide md:text-[17px]"
        >
          İşletmeniz için özel olarak tasarlanmış yüksek spam filtreli, hiçbir zaman çakılmayan premium e-posta barındırma hizmeti.
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
                <span className="text-white/50">/ay</span>
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
                Sipariş Ver
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
