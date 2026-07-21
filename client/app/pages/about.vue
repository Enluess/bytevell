<template>
  <Box>
    <PageHero 
      title="Hakkımızda" 
      description="HostiHub, yüksek kaliteli hosting çözümleri sunmak amacıyla kurulmuş bir teknoloji şirketidir." 
    />

    <SectionContainer>
      <Grid class="grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <GlowCard class="glassmorphism backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.02)] hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]">
          <Box class="p-6">
            <Heading as="h3" class="text-xl font-bold text-white mb-2 glow">Misyonumuz</Heading>
            <Text class="text-zinc-400 leading-relaxed">Müşterilerimize en iyi ve en hızlı hosting deneyimini yaşatmak.</Text>
          </Box>
        </GlowCard>
        <GlowCard class="glassmorphism backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all delay-100 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.02)] hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]">
          <Box class="p-6">
            <Heading as="h3" class="text-xl font-bold text-white mb-2 glow">Altyapımız</Heading>
            <Text class="text-zinc-400 leading-relaxed">Son teknoloji sunucular ve 6Tbps+ kapasiteli ağ yapımızla kesintisiz hizmet.</Text>
          </Box>
        </GlowCard>
        <GlowCard class="glassmorphism backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all delay-200 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.02)] hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]">
          <Box class="p-6">
            <Heading as="h3" class="text-xl font-bold text-white mb-2 glow">Neden Biz?</Heading>
            <Text class="text-zinc-400 leading-relaxed">%99.9 Uptime garantisi, 7/24 destek ve üst düzey güvenlik sağlıyoruz.</Text>
          </Box>
        </GlowCard>
      </Grid>
    </SectionContainer>

    <CtaBanner 
      title="Bizimle çalışmaya hazır mısınız?" 
      primary-text="Hemen Başlayın" 
      primary-link="/auth/register" 
    />
  </Box>
</template>

<script setup lang="ts">
useHead({ title: 'Hakkımızda - HostiHub' })
</script>
