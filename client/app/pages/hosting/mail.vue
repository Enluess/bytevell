<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Mail, Shield, Smartphone, RefreshCw, Lock, CheckCircle2, ArrowRight } from 'lucide-vue-next'
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

useHead({ title: 'Mail Hosting - HostiHub Premium' })

const plans = [
  {
    name: 'Starter Mail',
    specs: ['5 E-posta Hesabı', '10 GB Alan', 'Antispam Koruması', 'Webmail'],
    price: '40₺/ay'
  },
  {
    name: 'Pro Mail',
    specs: ['25 E-posta Hesabı', '50 GB Alan', 'Antispam Koruması', 'Webmail'],
    price: '80₺/ay'
  },
  {
    name: 'Business Mail',
    specs: ['Sınırsız E-posta', '100 GB Alan', 'Antispam Koruması', 'Webmail'],
    price: '150₺/ay'
  }
]

const features = [
  { title: 'Premium Antispam', description: 'Gelişmiş yapay zeka destekli filtreleme ile spam ve virüsleri gelen kutunuza ulaşmadan durdurun.', icon: Shield },
  { title: 'Mobil Uyumlu', description: 'IMAP/POP3/SMTP desteği ile e-postalarınıza telefon, tablet veya bilgisayarınızdan anında erişin.', icon: Smartphone },
  { title: 'Webmail Arayüzü', description: 'Modern ve hızlı Roundcube arayüzü ile dünyanın her yerinden maillerinizi yönetin.', icon: Mail },
  { title: 'Tam Güvenlik', description: 'TLS/SSL şifreleme standartları ile kurumsal iletişiminiz her zaman güvende ve gizli.', icon: Lock },
  { title: 'Kesintisiz İletişim', description: '%99.9 uptime garantisi ile e-posta trafiğiniz hiçbir zaman kesintiye uğramasın.', icon: CheckCircle2 },
  { title: 'Otomatik Yedekleme', description: 'E-postalarınız günlük olarak yedeklenir. Olası bir veri kaybında anında geri yükleme yapın.', icon: RefreshCw }
]

const faqs = [
  { question: 'Kendi alan adımla (isim@sirketim.com) e-posta kullanabilir miyim?', answer: 'Evet, sahip olduğunuz herhangi bir alan adı ile kurumsal e-posta adresleri oluşturabilir ve profesyonel bir görünüm elde edebilirsiniz.' },
  { question: 'E-postalarımı telefonumdan okuyabilir miyim?', answer: 'Kesinlikle. Tüm mail hosting paketlerimiz IMAP ve POP3 protokollerini destekler. iOS Mail, Gmail, Outlook gibi tüm mobil uygulamalarla tam uyumludur.' },
  { question: 'Eski firmamdaki e-postaları size taşıyabilir miyim?', answer: 'Evet, uzman teknik ekibimiz eski sunucunuzdaki tüm maillerinizi hiçbir veri kaybı yaşamadan ücretsiz olarak yeni sunucularımıza taşımaktadır.' },
  { question: 'Spam koruması nasıl çalışıyor?', answer: 'Sunucularımızda bulunan gelişmiş SpamAssassin ve yapay zeka destekli filtreler sayesinde spam maillerin %99\'u gelen kutunuza düşmeden engellenir.' }
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
            <Mail class="w-4 h-4 text-white/60" />
            <Text size="sm" weight="medium" class="text-zinc-300">Kurumsal E-Posta Çözümleri</Text>
          </Flex>

          <Heading as="h1" size="h1" class="text-white leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both tracking-tight">
            İletişiminizi<br>güçlendirin
          </Heading>
          
          <Text size="lg" class="text-zinc-400 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both leading-relaxed">
            Spam içermeyen, yüksek güvenlikli ve kesintisiz kurumsal mail hosting hizmeti. 
            <span class="text-zinc-300">Profesyonel görünüm, mükemmel erişilebilirlik.</span>
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
              <Text size="xs" weight="semibold" class="text-zinc-400 uppercase tracking-wider">Avantajlar</Text>
            </Flex>
            <Heading as="h2" size="h2" class="text-white">Neden Premium Mail?</Heading>
            <Text size="lg" variant="muted" class="leading-relaxed">Kurumsal iletişiminizin güvenliği ve devamlılığı için tasarlanmış özel altyapı.</Text>
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
      title="Kurumsal e-posta adresinizi hemen oluşturun!" 
      primary-text="Şimdi Başlayın" 
      primary-link="/auth/register" 
      secondary-text="Bize Ulaşın" 
      secondary-link="/contact" 
    />
  </Box>
</template>
