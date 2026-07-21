<template>
  <div>
    <PageHero
      badge="VPS Sunucular"
      title="Sanal Özel Sunucular"
      description="Esneklik ve performansı bir arada sunan VPS çözümleri."
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
  'Garantili CPU kaynakları',
  'NVMe SSD depolama',
  'Root erişimi',
  'Özel IP adresi',
  'DDoS koruması',
  'Anında kurulum',
  'Kolay ölçeklendirme',
  '7/24 teknik destek'
]

useHead({
  title: 'VPS Sunucular - HostiHub'
})
</script>
