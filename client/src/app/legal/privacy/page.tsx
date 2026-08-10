import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Gizlilik Politikası" lastUpdated="Ağustos 2026">
      <h2>1. Toplanan Bilgiler</h2>
      <p>Hesap oluştururken, hizmet satın alırken veya destek talebi açarken bize sağladığınız isim, e-posta adresi, fatura adresi gibi kişisel bilgileri topluyoruz.</p>
      
      <h2>2. Bilgilerin Kullanımı</h2>
      <p>Topladığımız bilgileri; hizmet sağlamak, ödemeleri işlemek, destek sağlamak ve önemli hesap güncellemelerini bildirmek amacıyla kullanıyoruz.</p>

      <h2>3. Veri Güvenliği</h2>
      <p>Kişisel bilgilerinizin güvenliğini ciddiye alıyoruz. Verilerinizi yetkisiz erişime, değiştirilmeye veya ifşa edilmeye karşı korumak için sektör standardı güvenlik önlemleri uyguluyoruz.</p>

      <h2>4. Çerezler (Cookies)</h2>
      <p>Sitemizin işlevselliğini artırmak ve oturum yönetimini sağlamak için çerezler kullanmaktayız. Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.</p>

      <h2>5. Üçüncü Taraflarla Paylaşım</h2>
      <p>Kişisel bilgilerinizi, ödeme sağlayıcıları gibi hizmetleri yürütebilmek için zorunlu olan üçüncü taraflar dışında, pazarlama amacıyla asla satmıyor veya paylaşmıyoruz.</p>
    </LegalPageLayout>
  );
}
