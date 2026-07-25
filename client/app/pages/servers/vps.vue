<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Server, Activity, Shield, Cpu, HardDrive, Network, Lock, Terminal } from 'lucide-vue-next'
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

useHead({ title: 'VDS Sunucu - HostiHub Premium' })

const plans = [
  {
    name: 'VDS-1',
    specs: ['2 Core İşlemci', '4 GB RAM', '60 GB NVMe SSD', '1 Gbit Bağlantı'],
    price: '200₺/ay'
  },
  {
    name: 'VDS-2',
    specs: ['4 Core İşlemci', '8 GB RAM', '100 GB NVMe SSD', '1 Gbit Bağlantı'],
    price: '400₺/ay'
  },
  {
    name: 'VDS-3',
    specs: ['8 Core İşlemci', '16 GB RAM', '250 GB NVMe SSD', '1 Gbit Bağlantı'],
    price: '800₺/ay'
  }
]

const features = [
  { title: '%100 Dedike Kaynak', description: 'VDS teknolojisi ile işlemci ve RAM kaynaklarınız tamamen size aittir, paylaşımsız performans elde edersiniz.', icon: Cpu },
  { title: 'NVMe SSD Disk', description: 'Geleneksel SSD disklerden 6 kat daha hızlı NVMe teknolojisi ile I/O darboğazlarına son verin.', icon: HardDrive },
  { title: 'DDoS Koruması', description: 'Layer 3/4 ve Layer 7 seviyesindeki gelişmiş DDoS koruması ile projeleriniz her zaman güvende.', icon: Shield },
  { title: 'Yüksek Hızlı Ağ', yedekli: '1 Gbit/s port kapasitesi ve yedekli ağ altyapısı ile mükemmel bağlantı kalitesi.', icon: Network },
  { title: 'Tam Yönetim İzni', description: 'Kök (Root) erişimi ile sunucunuzun tam kontrolü sizdedir. İstediğiniz yazılımı kurun ve yapılandırın.', icon: Terminal },
  { title: 'Gelişmiş İzleme', description: 'Kaynak kullanımınızı anlık olarak takip edebileceğiniz detaylı izleme ve yönetim paneli.', icon: Activity }
]

const faqs = [
  { question: 'VDS sunucularınız hangi işletim sistemlerini destekliyor?', answer: 'Ubuntu, CentOS, Debian, AlmaLinux, Rocky Linux ve Windows Server dahil olmak üzere tüm popüler işletim sistemlerini destekliyoruz. Kurulum işlemi panel üzerinden tek tıkla yapılabilmektedir.' },
  { question: 'Kaynak yetersizliğinde paket yükseltmesi yapabilir miyim?', answer: 'Evet, VDS sunucularımızda kesinti yaşamadan hızlıca bir üst pakete geçiş yapabilirsiniz. Disk ve RAM anında tanımlanır.' },
  { question: 'DDoS koruması ücretsiz mi?', answer: 'Evet, tüm VDS paketlerimizde yurt dışı bazlı saldırılara karşı standart DDoS koruması ücretsiz olarak sunulmaktadır.' },
  { question: 'Sunucu yönetimi tarafınızdan yapılıyor mu?', answer: 'VDS paketlerimiz unmanaged (yönetimsiz) olarak teslim edilmektedir. Ancak kontrol paneli kurulumu gibi temel konularda destek ekibimiz yardımcı olmaktadır.' }
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
            <Server class="w-4 h-4 text-white/60" />
            <Text size="sm" weight="medium" class="text-zinc-300">Sanal Özel Sunucular</Text>
          </Flex>

          <Heading as="h1" size="h1" class="text-white leading-[1.1] animate-in fade-in duration-1000 delay-150 tracking-tight">
            Yüksek Performanslı<br>VDS Çözümleri
          </Heading>
          
          <Text size="lg" class="text-zinc-400 max-w-2xl animate-in fade-in duration-1000 delay-300 leading-relaxed mx-auto">
            Tamamen size ayrılmış kaynaklar ve yeni nesil NVMe altyapısı ile projelerinizi özgürce yönetin. Yüksek trafikli siteleriniz için ideal çözüm.
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
            type="vps"
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
            <Heading as="h2" size="h2" class="text-white">Üstün Teknik Altyapı</Heading>
            <Text size="lg" variant="muted" class="leading-relaxed">Sunucularımız güncel donanımlar ve optimize edilmiş network ile en iyi performansı sağlamak için tasarlanmıştır.</Text>
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
      title="Sanal sunucunuzu hemen oluşturun" 
      primary-text="Sipariş Ver" 
      primary-link="/auth/register" 
      secondary-text="Yardım Merkezi" 
      secondary-link="/contact" 
    />
  </Box>
</template>
