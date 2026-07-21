<template>
  <div>
    <PageHero
      badge="Dedicated Sunucular"
      title="Fiziksel Sunucu Çözümleri"
      description="Yüksek trafik ve özel projeler için tam kontrol."
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
  'Özel donanım kaynakları',
  'Root erişimi',
  'Özel IP adresi',
  'DDoS koruması',
  'Tam özelleştirme',
  '7/24 teknik destek'
]

useHead({
  title: 'Dedicated Sunucular - HostiHub'
})
</script>
