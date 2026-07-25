<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { HardDrive, Cpu, ShieldAlert, Zap, Globe, Gauge, Database, Anchor } from 'lucide-vue-next'
import Box from '@/components/ui/layout/Box.vue'
import Flex from '@/components/ui/layout/Flex.vue'
import Grid from '@/components/ui/layout/Grid.vue'
import Section from '@/components/ui/layout/Section.vue'
import Container from '@/components/ui/layout/Container.vue'
import Heading from '@/components/ui/typography/Heading.vue'
import Text from '@/components/ui/typography/Text.vue'

import PricingPlanRow from '@/components/PricingPlanRow.vue'
import FeatureCard from '@/components/FeatureCard.vue'
import FaqSection from '@/components/FaqSection.vue'
import CtaBanner from '@/components/CtaBanner.vue'

useHead({ title: 'Dedicated Sunucu - HostiHub Premium' })

const plans = [
  {
    name: 'Dedi-1',
    specs: ['Intel Xeon E-2288G', '64 GB ECC RAM', '2x 1TB NVMe (RAID 1)', '1 Gbit Port'],
    price: '3000₺/ay'
  },
  {
    name: 'Dedi-2',
    specs: ['AMD Ryzen 9 5950X', '128 GB ECC RAM', '2x 2TB NVMe (RAID 1)', '1 Gbit Port'],
    price: '5000₺/ay'
  },
  {
    name: 'Dedi-3',
    specs: ['AMD EPYC 7443P', '256 GB ECC RAM', '4x 2TB NVMe (RAID 10)', '10 Gbit Port'],
    price: '9000₺/ay'
  }
]

const features = [
  { title: '%100 Fiziksel Donanım', description: 'Sunucunun tüm işlemci, bellek ve disk kaynakları fiziksel olarak yalnızca size aittir.', icon: Cpu },
  { title: '10 Gbit/s Port', description: 'Yüksek bant genişliği gerektiren projeleriniz için 10 Gbps\'e varan bağlantı seçenekleri.', icon: Gauge },
  { title: 'KVM / IPMI Erişimi', description: 'Sunucunuz kapalı dahi olsa uzaktan BIOS erişimi ve format atma imkanı.', icon: Anchor },
  { title: 'Donanım RAID Desteği', description: 'Veri güvenliği ve performans için kurumsal seviye donanımsal RAID kartları.', icon: Database },
  { title: 'Özel IP Blokları & BGP', description: 'Kendi IP bloklarınızı anons edebilir, tamamen özel ağ mimarinizi kurabilirsiniz.', icon: Globe },
  { title: 'SLA Garantisi', description: 'Datacenter altyapımız ile elektrik ve soğutmada %99.98 SLA garantisi sunuyoruz.', icon: ShieldAlert }
]

const faqs = [
  { question: 'Fiziksel sunucu teslimatı ne kadar sürer?', answer: 'Stokta bulunan standart konfigürasyonlar 2 ila 4 saat içerisinde, özel donanım istekleri ise 24 saat içerisinde teslim edilmektedir.' },
  { question: 'Donanım arızası durumunda süreç nasıl işliyor?', answer: '7/24 nöbetçi ekibimiz olası donanım arızalarına anında müdahale etmektedir. Yedek parçalar datacenter stoklarımızda daima hazır bulundurulur.' },
  { question: 'BGP (Kendi IP bloklarımı) anons edebilir miyim?', answer: 'Evet, uygun şartları sağlamanız durumunda AS numaranız ve IP bloklarınız teknik ekibimiz tarafından routerlarımızda anons edilmektedir.' },
  { question: 'Hangi Datacenter konumlarında hizmet veriyorsunuz?', answer: 'Dedicated sunucularımız Türkiye (İstanbul) ve Almanya lokasyonlu Tier III sertifikalı veri merkezlerinde barındırılmaktadır.' }
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
      
      <Container size="md" class="relative z-10 text-center py-20">
        <Flex direction="col" align="center" gap="6">
          <Flex 
            align="center" 
            gap="2" 
            class="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm animate-in fade-in duration-700"
          >
            <HardDrive class="w-4 h-4 text-white/60" />
            <Text size="sm" weight="medium" class="text-zinc-300">Fiziksel Sunucu Barındırma</Text>
          </Flex>

          <Heading as="h1" size="h1" class="text-white leading-[1.1] animate-in fade-in duration-1000 delay-150 tracking-tight">
            Maksimum Güç,<br>Tam Kontrol
          </Heading>
          
          <Text size="lg" class="text-zinc-400 max-w-2xl animate-in fade-in duration-1000 delay-300 leading-relaxed mx-auto">
            Hiçbir kaynağı paylaşmadan, kurumsal seviye donanımlarla sınırları zorlayın. Yoğun veritabanları ve büyük ölçekli uygulamalar için tasarlandı.
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
            type="dedicated"
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
            <Heading as="h2" size="h2" class="text-white">Gerçek Donanım Gücü</Heading>
            <Text size="lg" variant="muted" class="leading-relaxed">Kurumsal ihtiyaçlarınıza özel, yüksek kapasiteli ve kesintisiz fiziksel altyapı.</Text>
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
      title="Fiziksel sunucu yapılandırmanızı planlayalım" 
      primary-text="Özel Teklif Al" 
      primary-link="/contact" 
      secondary-text="Fiyat Listesi" 
      secondary-link="/pricing" 
    />
  </Box>
</template>
