<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Shield, Zap, HeadphonesIcon, HardDrive, ArrowRight, Sparkles } from 'lucide-vue-next'
import Box from '@/components/ui/layout/Box.vue'
import Flex from '@/components/ui/layout/Flex.vue'
import Grid from '@/components/ui/layout/Grid.vue'
import Section from '@/components/ui/layout/Section.vue'
import Container from '@/components/ui/layout/Container.vue'
import Heading from '@/components/ui/typography/Heading.vue'
import Text from '@/components/ui/typography/Text.vue'
import { Button } from '@/components/ui/button'

import ReferenceBar from '@/components/ReferenceBar.vue'
import FeatureCard from '@/components/FeatureCard.vue'
import FaqSection from '@/components/FaqSection.vue'
import CtaBanner from '@/components/CtaBanner.vue'

useHead({ title: 'HostiHub - Premium Hosting' })

const references = [
  { name: 'Mutlu Müşteri', count: '10K+' },
  { name: 'Aktif Sunucu', count: '50K+' },
  { name: 'Uptime', count: '%99.9' },
  { name: 'Destek', count: '7/24' }
]

const features = [
  { title: 'DDoS Koruması', description: 'Gelişmiş koruma kalkanımızla sunucularınız her zaman güvende. Katman 3-7 DDoS saldırılarına karşı koruma.', icon: Shield },
  { title: '6Tbps+ Ağ', description: 'Yüksek hızlı ve kesintisiz internet erişimi. Türkiye ve Avrupa POP noktaları.', icon: Zap },
  { title: '7/24 Destek', description: 'Uzman teknik ekibimiz her zaman yanınızda. Ortalama 5 dakika cevap süresi.', icon: HeadphonesIcon },
  { title: 'NVMe Depolama', description: 'Işık hızında veri okuma ve yazma. RAID korumalı enterprise SSD diskler.', icon: HardDrive }
]

const faqs = [
  { question: 'Nasıl satın alabilirim?', answer: 'Üye olup hemen satın alabilirsiniz.' },
  { question: 'Sunucum ne zaman kurulur?', answer: 'Ödemeniz onaylandığı anda otomatik kurulur.' },
  { question: 'İade garantisi var mı?', answer: 'İlk 7 gün içinde koşulsuz iade edebilirsiniz.' }
]

// Intersection Observer for scroll reveal
const observerRef = ref<IntersectionObserver | null>(null)

onMounted(() => {
  observerRef.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )

  document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
    observerRef.value?.observe(el)
  })
})

onUnmounted(() => {
  observerRef.value?.disconnect()
})
</script>

<template>
  <Box>
    <!-- Hero Section -->
    <Flex as="section" align="center" justify="center" class="relative min-h-[90vh] grid-pattern overflow-hidden pt-20">
      <!-- Enhanced multi-layer glow background -->
      <Box class="hero-glow-enhanced absolute inset-0" />
      
      <!-- Decorative gradient orbs -->
      <Box class="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl animate-float pointer-events-none" />
      <Box class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl animate-float pointer-events-none" style="animation-delay: -3s" />
      
      <Container size="md" class="relative z-10 text-center">
        <Flex direction="col" align="center" gap="8">
          <!-- Animated badge -->
          <Flex 
            align="center" 
            gap="2" 
            class="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <Sparkles class="w-4 h-4 text-white/60" />
            <Text size="sm" weight="medium" class="text-zinc-300">Türkiye'nin Premium Hosting Platformu</Text>
          </Flex>

          <Heading as="h1" size="h1" class="text-white leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both tracking-tight">
            Sunucunuzu dakikalar<br>içinde başlatın
          </Heading>
          
          <Text size="lg" class="text-zinc-400 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both leading-relaxed">
            6Tbps+ ağ altyapısı ile mükemmel güvenilirliği deneyimleyin. 
            <span class="text-zinc-300">Siz en iyisini istiyorsunuz</span>, biz sağlıyoruz.
          </Text>
          
          <Flex direction="col" class="sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
            <Button size="lg" asChild class="px-10 py-6 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.03] transition-all duration-300">
              <NuxtLink to="/pricing">
                Hemen Keşfet
                <ArrowRight class="ml-2 w-4 h-4" />
              </NuxtLink>
            </Button>
            <Button variant="ghost" size="lg" asChild class="text-zinc-400 hover:text-white transition-all duration-300">
              <NuxtLink to="/contact">İletişime Geçin</NuxtLink>
            </Button>
          </Flex>
        </Flex>
      </Container>

      <!-- Bottom gradient fade -->
      <Box class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </Flex>

    <!-- References / Stats -->
    <ReferenceBar :references="references" />



    <!-- Features -->
    <Section variant="muted" padding="xl">
      <Container size="lg">
        <Flex direction="col" align="center" gap="16">
          <Flex direction="col" align="center" gap="4" class="text-center max-w-2xl reveal-on-scroll">
            <Flex align="center" gap="2" class="px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] mb-2">
              <Box class="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
              <Text size="xs" weight="semibold" class="text-zinc-400 uppercase tracking-wider">Özellikler</Text>
            </Flex>
            <Heading as="h2" size="h2" class="text-white">Neden HostiHub?</Heading>
            <Text size="lg" variant="muted" class="leading-relaxed">En güncel donanımlar ve optimize edilmiş ağ altyapısı ile projelerinizi uçurun.</Text>
          </Flex>

          <Grid cols="1" class="md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            <FeatureCard 
              v-for="(f, index) in features" 
              :key="f.title" 
              v-bind="f" 
              :index="index"
            />
          </Grid>
        </Flex>
      </Container>
    </Section>

    <!-- Gradient Separator -->
    <Box class="gradient-separator" />

    <!-- FAQ -->
    <FaqSection :faqs="faqs" />

    <!-- CTA -->
    <CtaBanner 
      title="Sunucunu barındırmaya bugünden başla!" 
      primary-text="Şimdi Başlayın" 
      primary-link="/auth/register" 
      secondary-text="Bize Ulaşın" 
      secondary-link="/contact" 
    />
  </Box>
</template>
