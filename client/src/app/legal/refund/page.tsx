import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function RefundPage() {
  return (
    <LegalPageLayout title="Teslimat ve İade Politikası" lastUpdated="Ağustos 2026">
      <h2>1. Hizmet Teslimatı</h2>
      <p>Ödemesi onaylanan Sanal Sunucu (VDS) ve Web Hosting paketlerimiz genellikle saniyeler içerisinde otomatik olarak kurulur ve teslim edilir. Fiziksel (Dedicated) sunucuların kurulum süresi donanıma göre 1 ile 48 saat arasında değişebilir.</p>
      
      <h2>2. İade Koşulları</h2>
      <p>Yeni müşterilerimiz için ilk satın alımlarda (Fiziksel sunucular ve alan adları hariç) 3 gün içerisinde koşulsuz şartsız iade garantisi sunuyoruz.</p>

      <h2>3. İade Edilemeyen Hizmetler</h2>
      <ul>
        <li>Alan adı (Domain) kayıt, yenileme ve transfer işlemleri</li>
        <li>Fiziksel (Dedicated) Sunucular</li>
        <li>SSL Sertifikaları</li>
        <li>Özel yazılım lisansları (cPanel, LiteSpeed vb.)</li>
      </ul>

      <h2>4. İade Süreci</h2>
      <p>İade talebinizi müşteri panelinizden destek talebi (ticket) açarak bize iletebilirsiniz. İadeniz onaylandıktan sonra, ödeme yönteminize bağlı olarak 3-7 iş günü içerisinde tarafınıza yansıtılacaktır.</p>
    </LegalPageLayout>
  );
}
