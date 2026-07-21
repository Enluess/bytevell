<script setup lang="ts">
import { Shield, Zap, HeadphonesIcon, HardDrive } from 'lucide-vue-next'
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
  { title: 'DDoS Koruması', description: 'Gelişmiş koruma kalkanımızla güvendesiniz.', icon: Shield },
  { title: '6Tbps+ Ağ', description: 'Yüksek hızlı ve kesintisiz internet erişimi.', icon: Zap },
  { title: '7/24 Destek', description: 'Uzman ekibimiz her zaman yanınızda.', icon: HeadphonesIcon },
  { title: 'NVMe Depolama', description: 'Işık hızında veri okuma ve yazma.', icon: HardDrive }
]

const faqs = [
  { question: 'Nasıl satın alabilirim?', answer: 'Üye olup hemen satın alabilirsiniz.' },
  { question: 'Sunucum ne zaman kurulur?', answer: 'Ödemeniz onaylandığı anda otomatik kurulur.' },
  { question: 'İade garantisi var mı?', answer: 'İlk 7 gün içinde koşulsuz iade edebilirsiniz.' }
]
</script>

<template>
  <Box>
    <!-- Hero Section -->
    <Flex as="section" align="center" justify="center" class="relative min-h-[90vh] grid-pattern section-glow overflow-hidden">
      <Box class="hero-glow absolute inset-0" />
      <Container size="md" class="relative z-10 text-center pt-20">
        <Flex direction="col" align="center" gap="8">
          <Heading as="h1" size="h1" class="text-white leading-[1.15] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Sunucunuzu dakikalar<br>içinde başlatın
          </Heading>
          
          <Text size="lg" class="text-[#94a3b8] max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both leading-relaxed">
            6Tbps+ ağ ile mükemmel güvenilirliği deneyimleyin. Siz en iyisini istiyorsunuz, biz sağlıyoruz.
          </Text>
          
          <Box class="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            <Button size="lg" asChild class="px-10 py-6 text-base font-semibold shadow-lg shadow-primary/20">
              <NuxtLink to="/pricing">Hemen Keşfet</NuxtLink>
            </Button>
          </Box>
        </Flex>
      </Container>
    </Flex>

    <!-- References -->
    <ReferenceBar :references="references" />

    <!-- Features -->
    <Section variant="muted" padding="xl">
      <Container size="lg">
        <Flex direction="col" align="center" gap="12">
          <Flex direction="col" align="center" gap="4" class="text-center max-w-2xl">
            <Heading as="h2" size="h2">Neden HostiHub?</Heading>
            <Text size="lg" variant="muted">En güncel donanımlar ve optimize edilmiş ağ altyapısı ile projelerinizi uçurun.</Text>
          </Flex>

          <Grid cols="1" class="md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            <FeatureCard v-for="f in features" :key="f.title" v-bind="f" />
          </Grid>
        </Flex>
      </Container>
    </Section>

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
