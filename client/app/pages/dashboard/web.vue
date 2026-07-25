<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Web Hosting</h1>
        <p class="text-zinc-400">Hosting paketlerinizi ve domainlerinizi yönetin.</p>
      </div>
      <NuxtLink to="/pricing" class="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-200 transition-colors">
        <Plus class="w-4 h-4" /> Yeni Satın Al
      </NuxtLink>
    </div>

    <div v-if="pending" class="flex justify-center p-12">
      <Loader2 class="w-8 h-8 animate-spin text-zinc-500" />
    </div>
    <div v-else-if="services.length === 0" class="bg-zinc-900/30 border border-white/5 rounded-2xl p-12 text-center">
      <Globe class="w-16 h-16 text-zinc-600 mx-auto mb-4" />
      <h3 class="text-xl font-medium text-white mb-2">Web Hosting Bulunmuyor</h3>
      <p class="text-zinc-400 mb-6">Hemen güçlü bir web hosting paketi seçerek sitenizi yayınlayın.</p>
      <NuxtLink to="/hosting/web" class="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-zinc-200 transition-colors">
        Paketleri İncele
      </NuxtLink>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink 
        v-for="service in services" 
        :key="service.id"
        :to="`/dashboard/service/${service.id}`"
        class="group bg-zinc-900/50 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-all flex flex-col"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-zinc-300 group-hover:bg-white group-hover:text-black transition-colors">
            <Globe class="w-6 h-6" />
          </div>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-xs font-medium" :class="service.status === 'active' ? 'text-green-400' : 'text-yellow-400'">
            <span class="w-1.5 h-1.5 rounded-full" :class="service.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'"></span>
            {{ service.status === 'active' ? 'Aktif' : 'Bekliyor' }}
          </span>
        </div>
        <h3 class="text-lg font-bold text-white mb-1">{{ service.name }}</h3>
        <p class="text-sm text-zinc-400 mb-6">cPanel & LiteSpeed</p>
        
        <div class="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-sm">
          <span class="text-zinc-500">Aylık Ödeme</span>
          <span class="font-medium text-white">{{ service.price }}</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Globe, Loader2, Plus } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const api = useApi()
const pending = ref(true)
const services = ref<any[]>([])

onMounted(async () => {
  try {
    const data = await api<{ services: any[] }>('/services?type=web')
    services.value = data.services || []
  } catch (e) {
    console.error(e)
  } finally {
    pending.value = false
  }
})
</script>
