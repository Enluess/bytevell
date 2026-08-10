import { Hero } from "@/components/Hero";
import { ReferenceBar } from "@/components/ReferenceBar";
import dynamic from 'next/dynamic';

const Features = dynamic(() => import('@/components/Features').then(mod => mod.Features));
const FaqSection = dynamic(() => import('@/components/FaqSection').then(mod => mod.FaqSection));
const CtaBanner = dynamic(() => import('@/components/CtaBanner').then(mod => mod.CtaBanner));
const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export default function Home() {
  const faqs = [
    { question: 'Nasıl satın alabilirim?', answer: 'Üye olup hemen satın alabilirsiniz.' },
    { question: 'Sunucum ne zaman kurulur?', answer: 'Ödemeniz onaylandığı anda otomatik kurulur.' },
    { question: 'İade garantisi var mı?', answer: 'İlk 7 gün içinde koşulsuz iade edebilirsiniz.' }
  ];

  return (
    <>
      <main className="flex-1">
        <Hero />
        <ReferenceBar />
        <Features />
        
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />
        
        <FaqSection faqs={faqs} />
        
        <CtaBanner 
          title="Sunucunuzu barındırmaya bugünden başlayın." 
          description="Premium altyapımızda sınırları aşarak projelerinizi inşa edin, ölçekleyin ve büyütün."
          primaryText="Hemen Başlayın" 
          primaryLink="/auth/register" 
          secondaryText="Bize Ulaşın" 
          secondaryLink="/contact" 
        />
      </main>
      <Footer />
    </>
  );
}
