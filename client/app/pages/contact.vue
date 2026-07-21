<template>
  <Box>
    <PageHero 
      title="Bize Ulaşın" 
      description="Sorularınız veya destek talepleriniz için bizimle iletişime geçin." 
    />

    <SectionContainer>
      <Box class="max-w-xl mx-auto mb-16 animate-in fade-in zoom-in-95 duration-500">
        <Box class="p-2 sm:p-4 rounded-[2rem] glassmorphism bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.03)] relative overflow-hidden">
          <Box class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <Box class="relative z-10">
            <ContactForm />
          </Box>
        </Box>
      </Box>

      <Grid class="grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <ContactInfoCard 
          title="E-posta" 
          value="destek@hostihub.com" 
          :icon="Mail" 
          class="glassmorphism backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 rounded-2xl" 
        />
        <ContactInfoCard 
          title="Discord" 
          value="discord.gg/hostihub" 
          :icon="MessageCircle" 
          class="glassmorphism backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 delay-75 rounded-2xl" 
        />
        <ContactInfoCard 
          title="Çalışma Saatleri" 
          value="7/24 Destek" 
          :icon="Clock" 
          class="glassmorphism backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 delay-150 rounded-2xl" 
        />
      </Grid>
    </SectionContainer>
  </Box>
</template>

<script setup lang="ts">
import { Mail, MessageCircle, Clock } from 'lucide-vue-next'
useHead({ title: 'İletişim - HostiHub' })
</script>
