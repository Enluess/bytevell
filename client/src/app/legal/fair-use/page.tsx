import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function FairUsePage() {
  return (
    <LegalPageLayout title="Adil Kullanım Politikası" lastUpdated="Ağustos 2026">
      <h2>1. Amacımız</h2>
      <p>Adil Kullanım Politikamız (AKP), tüm müşterilerimize yüksek kalitede ve kesintisiz hizmet sunabilmemizi sağlamak için tasarlanmıştır. "Limitsiz" olarak sunulan hizmetlerin suistimal edilmesini önlemeyi amaçlar.</p>
      
      <h2>2. Limitsiz Trafik ve Bant Genişliği</h2>
      <p>VDS ve Dedicated sunucularda sunulan limitsiz trafik, normal ve meşru kullanım standartlarına tabidir. Sunucu hatlarını sürekli ve aralıksız olarak %100 kapasitede kullanarak ağ altyapısına zarar veren kullanımlar bu kapsama girmez.</p>

      <h2>3. Kaynak Kullanımı</h2>
      <p>Paylaşımlı web hosting hizmetlerinde CPU, RAM ve I/O kaynaklarının diğer kullanıcıları olumsuz etkileyecek düzeyde ve sürekli olarak yüksek kullanılması durumunda hesabınız sınırlandırılabilir.</p>

      <h2>4. Depolama Sınırları</h2>
      <p>Hosting paketlerindeki disk alanları, sadece web sitesi dosyalarının barındırılması içindir. Kişisel yedekleme arşivi, dosya paylaşım merkezi veya bulut disk olarak kullanılamaz.</p>
    </LegalPageLayout>
  );
}
