import { Hero } from "@/components/Hero";
import { ReferenceBar } from "@/components/ReferenceBar";
import dynamic from 'next/dynamic';
import { useTranslations } from "next-intl";

const Features = dynamic(() => import('@/components/Features').then(mod => mod.Features));
const FaqSection = dynamic(() => import('@/components/FaqSection').then(mod => mod.FaqSection));
const CtaBanner = dynamic(() => import('@/components/CtaBanner').then(mod => mod.CtaBanner));
const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export default function Home() {
  const t = useTranslations('Home');

  const faqs = [
    {
      question: t('faq_q1'),
      answer: t('faq_a1')
    },
    {
      question: t('faq_q2'),
      answer: t('faq_a2')
    },
    {
      question: t('faq_q3'),
      answer: t('faq_a3')
    },
    {
      question: t('faq_q4'),
      answer: t('faq_a4')
    }
  ];

  return (
    <>
      <main className="flex-1">
        <Hero />
        <ReferenceBar />
        <Features />

        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent w-full" />

        <FaqSection faqs={faqs} />

        <CtaBanner
          title={t('cta_title')}
          description={t('cta_desc')}
          primaryText={t('cta_btn1')}
          primaryLink="/auth/register"
          secondaryText={t('cta_btn2')}
          secondaryLink="/contact"
        />
      </main>
      <Footer />
    </>
  );
}
