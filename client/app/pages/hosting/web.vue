<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Globe, Server, Shield, Zap, HardDrive, HeadphonesIcon, Settings, RefreshCw, ArrowRight, Sparkles } from 'lucide-vue-next'
import Box from '@/components/ui/layout/Box.vue'
import Flex from '@/components/ui/layout/Flex.vue'
import Grid from '@/components/ui/layout/Grid.vue'
import Section from '@/components/ui/layout/Section.vue'
import Container from '@/components/ui/layout/Container.vue'
import Heading from '@/components/ui/typography/Heading.vue'
import Text from '@/components/ui/typography/Text.vue'
import { Button } from '@/components/ui/button'

import PricingPlanRow from '@/components/PricingPlanRow.vue'
import FeatureCard from '@/components/FeatureCard.vue'
import FaqSection from '@/components/FaqSection.vue'
import CtaBanner from '@/components/CtaBanner.vue'

useHead({ title: 'Web Hosting - HostiHub Premium' })

const plans = [
  {
    name: 'Starter',
    specs: ['1 Web Sitesi', '10 GB NVMe SSD', 'Sınırsız Trafik', 'Ücretsiz SSL', '1 GB RAM'],
    price: '50₺/ay'
  },
  {
    name: 'Pro',
    specs: ['5 Web Sitesi', '50 GB NVMe SSD', 'Sınırsız Trafik', 'Ücretsiz SSL', '2 GB RAM'],
    price: '100₺/ay'
  },
  {
    name: 'Business',
    specs: ['Sınırsız Web Sitesi', '100 GB NVMe SSD', 'Sınırsız Trafik', 'Ücretsiz SSL', '4 GB RAM'],
    price: '200₺/ay'
  }
]

const features = [
  { title: 'LiteSpeed Web Server', description: 'Apache\'ye göre %84 daha hızlı web sayfaları ile arama motorlarında üst sıralara çıkın.', icon: Zap },
  { title: 'cPanel Kontrol Paneli', description: 'Sektör lideri kontrol paneli ile sitenizi ve e-postalarınızı tek bir yerden kolayca yönetin.', icon: Settings },
  { title: 'Günlük Yedekleme', description: 'Otomatik günlük yedeklemeler ile verileriniz her zaman güvende. Tek tıkla geri yükleyin.', icon: RefreshCw },
  { title: 'Imunify360 Güvenliği', description: 'Gelişmiş yapay zeka destekli güvenlik duvarı ile sitenizi zararlı yazılımlardan koruyun.', icon: Shield },
  { title: 'NVMe SSD Depolama', description: 'Standart SSD\'lere göre 6 kat daha hızlı okuma/yazma hızları ile mükemmel performans.', icon: HardDrive },
  { title: '7/24 Kesintisiz Destek', description: 'Uzman teknik ekibimiz karşılaştığınız her sorunda 7/24 size yardımcı olmaya hazır.', icon: HeadphonesIcon }
]

const faqs = [
  { question: 'Hosting paketimi daha sonra yükseltebilir miyim?', answer: 'Evet, istediğiniz zaman müşteri paneliniz üzerinden veri kaybı yaşamadan paket yükseltmesi yapabilirsiniz. Yalnızca aradaki fiyat farkını ödersiniz.' },
  { question: 'Farklı bir firmadan ücretsiz site taşıma yapıyor musunuz?', answer: 'Evet, teknik destek ekibimiz eski firmanızdaki sitenizi ücretsiz ve kesintisiz olarak sunucularımıza taşımaktadır.' },
  { question: 'Yedekleme hizmetiniz nasıl çalışıyor?', answer: 'Tüm web hosting paketlerimizde düzenli olarak günlük ve haftalık tam yedek alınmaktadır. Olası bir sorunda tek tıkla geri yükleme yapabilirsiniz.' },
  { question: 'WordPress kurulumu zor mu?', answer: 'Hayır, cPanel içerisinde bulunan Softaculous aracı sayesinde sadece birkaç tıklama ile saniyeler içerisinde WordPress kurabilirsiniz.' }
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
    <Flex as="section" align="center" justify="center" class="relative min-h-[70vh] grid-pattern overflow-hidden pt-20">
      <!-- Enhanced multi-layer glow background -->
      <Box class="hero-glow-enhanced absolute inset-0" />
      
      <!-- Decorative gradient orbs -->
      <Box class="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl animate-float pointer-events-none" />
      <Box class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl animate-float pointer-events-none" style="animation-delay: -3s" />
      
      <Container size="md" class="relative z-10 text-center">
        <Flex direction="col" align="center" gap="8">
          <!-- Animated badge -->
          <Flex 
            align="center" 
            gap="2" 
            class="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <Globe class="w-4 h-4 text-white/60" />
            <Text size="sm" weight="medium" class="text-zinc-300">Yüksek Performanslı Web Hosting</Text>
          </Flex>

          <Heading as="h1" size="h1" class="text-white leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both tracking-tight">
            Web sitenizi<br>uçuşa hazırlayın
          </Heading>
          
          <Text size="lg" class="text-zinc-400 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both leading-relaxed">
            LiteSpeed ve NVMe altyapısıyla desteklenen yeni nesil hosting çözümleri. 
            <span class="text-zinc-300">Hız, güvenlik ve kesintisiz performans.</span>
          </Text>
        </Flex>
      </Container>

      <!-- Bottom gradient fade -->
      <Box class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </Flex>

    <!-- Pricing Plans -->
    <Section padding="xl" class="relative z-10">
      <Container size="lg">
        <Flex direction="col" gap="4" class="max-w-4xl mx-auto reveal-on-scroll">
          <PricingPlanRow 
            v-for="plan in plans" 
            :key="plan.name" 
            v-bind="plan" 
          />
        </Flex>
      </Container>
    </Section>

    <!-- Gradient Separator -->
    <Box class="gradient-separator" />

    <!-- Features -->
    <Section variant="muted" padding="xl">
      <Container size="lg">
        <Flex direction="col" align="center" gap="16">
          <Flex direction="col" align="center" gap="4" class="text-center max-w-2xl reveal-on-scroll">
            <Flex align="center" gap="2" class="px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] mb-2">
              <Box class="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
              <Text size="xs" weight="semibold" class="text-zinc-400 uppercase tracking-wider">Özellikler</Text>
            </Flex>
            <Heading as="h2" size="h2" class="text-white">Premium Standartlar</Heading>
            <Text size="lg" variant="muted" class="leading-relaxed">Tüm hosting paketlerimizde standart olarak sunduğumuz ayrıcalıklar.</Text>
          </Flex>

          <Grid cols="1" class="md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
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
      title="Web siteni barındırmaya bugünden başla!" 
      primary-text="Şimdi Başlayın" 
      primary-link="/auth/register" 
      secondary-text="Bize Ulaşın" 
      secondary-link="/contact" 
    />
  </Box>
</template>
