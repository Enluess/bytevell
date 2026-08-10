import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function AboutPage() {
  return (
    <LegalPageLayout title="Hakkımızda" lastUpdated="Ağustos 2026">
      <h2>Biz Kimiz?</h2>
      <p>HostiHub, yenilikçi altyapısı ve müşteri odaklı vizyonuyla kurumsal ve bireysel kullanıcılara yüksek performanslı barındırma hizmetleri sunan bir teknoloji şirketidir.</p>
      
      <h2>Misyonumuz</h2>
      <p>Müşterilerimizin dijital dünyada kesintisiz, hızlı ve güvenli bir şekilde var olmalarını sağlamak. En yeni teknolojileri ulaşılabilir fiyatlarla sunarak, her boyuttaki projenin büyümesine katkıda bulunmak.</p>

      <h2>Altyapımız</h2>
      <p>Hizmetlerimizi donanım seviyesinde %100 yedekli ağ mimarisi, en yeni nesil AMD Ryzen ve EPYC işlemciler, ve kurumsal NVMe diskler ile güçlendiriyoruz. Güvenliği asla şansa bırakmıyor, gelişmiş Layer 4/7 DDoS korumasıyla sistemlerinizi koruma altında tutuyoruz.</p>

      <h2>Neden HostiHub?</h2>
      <ul>
        <li><strong>Performans:</strong> Sektördeki en iyi donanım bileşenlerini kullanıyoruz.</li>
        <li><strong>Güvenilirlik:</strong> %99.9 Uptime garantisi ve kesintisiz hizmet.</li>
        <li><strong>Destek:</strong> İhtiyaç duyduğunuz her an yanınızda olan uzman teknik ekip.</li>
        <li><strong>Şeffaflık:</strong> Gizli ücretler yok, net ve anlaşılır hizmet sözleşmeleri.</li>
      </ul>
    </LegalPageLayout>
  );
}
