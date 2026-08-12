import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function SupportPolicyPage() {
  return (
    <LegalPageLayout title="Genel Destek Politikası" lastUpdated="Ağustos 2026">
      <h2>1. Destek Kapsamı</h2>
      <p>Teknik destek ekibimiz, sunucu altyapısı, ağ bağlantısı, donanım arızaları ve Bytevell tarafından sağlanan kontrol panelleriyle ilgili sorunlarda 7/24 hizmet vermektedir.</p>
      
      <h2>2. Kapsam Dışı Konular</h2>
      <p>Unmanaged (Yönetimsiz) sunucularda işletim sistemi içi yapılandırmalar, üçüncü parti yazılım kurulumları, web sitesi yazılım hataları ve SEO/tasarım düzenlemeleri standart destek kapsamı dışındadır.</p>

      <h2>3. Yanıt Süreleri</h2>
      <p>Destek taleplerinize öncelik sırasına göre en hızlı şekilde yanıt verilmektedir. Ortalama ilk yanıt süremiz 15 dakikadır.</p>

      <h2>4. İletişim Kanalları</h2>
      <p>Destek taleplerinizi müşteri panelinizdeki bilet (ticket) sistemi üzerinden iletmeniz gerekmektedir. Canlı destek hattımız sadece satış öncesi bilgi ve acil durumlar için hizmet vermektedir.</p>
    </LegalPageLayout>
  );
}
