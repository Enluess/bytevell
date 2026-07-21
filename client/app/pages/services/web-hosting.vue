<template>
  <div>
    <PageHero
      badge="Web Hosting"
      title="Web Hosting Çözümleri"
      description="Kişisel ve kurumsal web siteleri için güvenilir hosting."
    />
    <SectionContainer>
      <FeatureList :features="features" />
    </SectionContainer>
    <CtaBanner
      title="Hemen Başlayın"
      primaryText="Fiyatları İncele"
      primaryLink="/pricing"
      secondaryText="Bize Ulaşın"
      secondaryLink="/contact"
    />
  </div>
</template>

<script setup lang="ts">
const features = [
  'NVMe SSD depolama',
  'Ücretsiz SSL sertifikası',
  'Günlük yedekleme',
  'cPanel kontrol paneli',
  'Tek tıkla uygulama kurulumu',
  'E-posta hesapları',
  'DDoS koruması',
  '7/24 teknik destek'
]

useHead({
  title: 'Web Hosting - HostiHub'
})
</script>
