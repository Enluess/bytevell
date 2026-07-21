<template>
  <div>
    <PageHero
      badge="E-Posta Hosting"
      title="Profesyonel E-Posta Çözümleri"
      description="Kurumsal iletişiminizi güçlendirin."
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
  'Özel domain ile e-posta',
  'Spam ve virüs koruması',
  'IMAP/POP3/SMTP desteği',
  'Webmail erişimi',
  'Yedekleme',
  '7/24 teknik destek'
]

useHead({
  title: 'E-Posta Hosting - HostiHub'
})
</script>
