import { Hero } from "@/components/Hero";
import { ReferenceBar } from "@/components/ReferenceBar";
import dynamic from 'next/dynamic';

const Features = dynamic(() => import('@/components/Features').then(mod => mod.Features));
const FaqSection = dynamic(() => import('@/components/FaqSection').then(mod => mod.FaqSection));
const CtaBanner = dynamic(() => import('@/components/CtaBanner').then(mod => mod.CtaBanner));
const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export default function Home() {
  const faqs = [
    {
      question: 'Nasıl hizmet satın alabilirim?',
      answer: 'Hizmet satın almak için öncelikle müşteri paneli üzerinden sitemize ücretsiz üye olmanız gerekmektedir. Üyeliğinizi tamamladıktan sonra, projenize en uygun hosting veya sunucu paketini seçip sepetinize ekleyebilir ve 3D Secure güvencesiyle (Kredi Kartı veya Havale/EFT) siparişinizi anında tamamlayabilirsiniz. Sipariş sonrası tüm süreç otomasyonla ilerler.'
    },
    {
      question: 'Satın aldığım sunucu ne zaman aktif olur?',
      answer: 'Bytevell altyapısında tam otomasyon sistemi kullanmaktayız. Ödemeniz sistem tarafından başarıyla onaylandığı andan itibaren, sanal sunucunuz veya hosting paketiniz saniyeler içerisinde otomatik olarak kurulur. Kurulum tamamlanır tamamlanmaz tüm erişim bilgileriniz (IP, şifre vs.) kayıtlı e-posta adresinize anında gönderilir ve müşteri panelinize yansır.'
    },
    {
      question: 'Memnun kalmazsam iade garantiniz var mı?',
      answer: 'Kesinlikle evet. Müşteri memnuniyeti bizim için her şeyden önce gelir. Eğer aldığınız hizmetten herhangi bir sebepten ötürü memnun kalmazsanız, sipariş tarihinizden itibaren ilk 7 gün içerisinde hiçbir koşul veya mazeret bildirmeksizin ödemenizi kesintisiz olarak iade alabilirsiniz. İade süreci için destek talebi açmanız yeterlidir.'
    },
    {
      question: 'Teknik destek hizmetiniz nasıl çalışıyor?',
      answer: 'Uzman teknik ekibimiz, yılın 365 günü 7/24 kesintisiz olarak size yardımcı olmak için aktif çalışmaktadır. Müşteri paneliniz üzerinden oluşturacağınız destek bildirimleri (ticket) ortalama 15 dakika içerisinde yanıtlanır. Karşılaştığınız her türlü donanımsal veya sistemsel sorunda ekibimiz daima yanınızdadır.'
    }
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
