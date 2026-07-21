<template>
  <Box>
    <PageHero 
      title="Web Hosting Planları" 
      description="Hızlı, güvenilir ve uygun fiyatlı hosting çözümleri. İhtiyacınıza uygun planı seçin." 
    />

    <SectionContainer>
      <!-- Category Tabs -->
      <Flex justify="center" class="mb-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Tabs :default-value="selectedCategory" @update:model-value="v => selectedCategory = v" class="w-full max-w-3xl">
          <TabsList class="flex w-full items-center justify-between gap-2 flex-wrap glassmorphism bg-white/5 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <TabsTrigger
              v-for="cat in categories"
              :key="cat.id"
              :value="cat.id"
              class="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-white/20 text-zinc-400 hover:text-white hover:bg-white/10"
            >
              {{ cat.name }}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Flex>

      <!-- Plans List -->
      <Flex direction="column" gap="3" class="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <PricingPlanRow 
          v-for="plan in filteredPlans" 
          :key="plan.name" 
          :name="plan.name" 
          :specs="plan.specs" 
          :price="plan.price" 
          buy-link="/auth/register" 
        />
      </Flex>

      <!-- Empty State -->
      <Flex v-if="filteredPlans.length === 0" align="center" justify="center" class="py-16">
        <Text class="text-zinc-500 animate-pulse glow">Bu kategori için henüz plan bulunmuyor.</Text>
      </Flex>
    </SectionContainer>

    <CtaBanner 
      title="Barındırmaya bugünden başla!" 
      primary-text="Şimdi Başlayın" 
      primary-link="/auth/register" 
      secondary-text="Bize Ulaşın" 
      secondary-link="/contact" 
    />
  </Box>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

useHead({
  title: 'Hizmetler - HostiHub',
  meta: [
    { name: 'description', content: 'HostiHub hosting planları ve fiyatları.' }
  ]
})

const selectedCategory = ref('web-hosting')

const categories = [
  { id: 'web-hosting', name: 'Web Hosting' },
  { id: 'vps', name: 'Sanal Sunucular' },
  { id: 'dedicated', name: 'Dedicated Sunucular' },
  { id: 'mail', name: 'Mail Hosting' },
]

const plans = [
  // Web Hosting
  { category: 'web-hosting', name: 'Starter', specs: ['5 GB NVMe SSD', '1 Web Sitesi', 'Ücretsiz SSL', '50 GB Bant Genişliği'], price: '49' },
  { category: 'web-hosting', name: 'Pro', specs: ['25 GB NVMe SSD', '10 Web Sitesi', 'Ücretsiz SSL', '200 GB Bant Genişliği'], price: '99' },
  { category: 'web-hosting', name: 'Business', specs: ['50 GB NVMe SSD', '25 Web Sitesi', 'Wildcard SSL', '500 GB Bant Genişliği'], price: '199' },
  { category: 'web-hosting', name: 'Enterprise', specs: ['100 GB NVMe SSD', 'Sınırsız Site', 'Wildcard SSL', 'Sınırsız Bant'], price: '399' },
  // VPS
  { category: 'vps', name: '2GB RAM', specs: ['30 GB NVMe Disk', '1 Core CPU @ 5.7 GHz', '20 Gbps Internet'], price: '212' },
  { category: 'vps', name: '4GB RAM', specs: ['40 GB NVMe Disk', '2 Core CPU @ 5.7 GHz', '20 Gbps Internet'], price: '424' },
  { category: 'vps', name: '6GB RAM', specs: ['50 GB NVMe Disk', '4 Core CPU @ 5.7 GHz', '20 Gbps Internet'], price: '636' },
  { category: 'vps', name: '8GB RAM', specs: ['60 GB NVMe Disk', '4 Core CPU @ 5.7 GHz', '20 Gbps Internet'], price: '848' },
  { category: 'vps', name: '12GB RAM', specs: ['80 GB NVMe Disk', '4 Core CPU @ 5.7 GHz', '20 Gbps Internet'], price: '1.272' },
  { category: 'vps', name: '16GB RAM', specs: ['100 GB NVMe Disk', '4 Core CPU @ 5.7 GHz', '20 Gbps Internet'], price: '1.696' },
  // Dedicated
  { category: 'dedicated', name: 'Starter', specs: ['Ryzen 9 9950X', '64 GB DDR5 RAM', '1 TB NVMe SSD', '20 Gbps Internet'], price: '7.999' },
  { category: 'dedicated', name: 'Pro', specs: ['Ryzen 9 9950X', '128 GB DDR5 RAM', '2 TB NVMe SSD', '20 Gbps Internet'], price: '12.999' },
  // Mail
  { category: 'mail', name: 'Basic', specs: ['5 E-posta Hesabı', '10 GB Depolama', 'Spam Koruması'], price: '29' },
  { category: 'mail', name: 'Pro', specs: ['25 E-posta Hesabı', '50 GB Depolama', 'Gelişmiş Spam Filtresi'], price: '79' },
  { category: 'mail', name: 'Business', specs: ['Sınırsız Hesap', '100 GB Depolama', 'Kurumsal Filtre'], price: '149' },
]

const filteredPlans = computed(() =>
  plans.filter(p => p.category === selectedCategory.value)
)
</script>
