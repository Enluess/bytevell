<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Hoş Geldin, {{ authStore.userName }}</h1>
      <p class="text-zinc-400">Hosting hizmetlerinizin genel durumu ve hesap özetiniz.</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
        <div class="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium text-zinc-400">Aktif Hizmetler</span>
            <Server class="w-5 h-5 text-zinc-500" />
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.services }}</p>
        </div>
      </div>
      <div class="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
        <div class="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium text-zinc-400">Ödenmemiş Faturalar</span>
            <CreditCard class="w-5 h-5 text-zinc-500" />
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.unpaid }}</p>
        </div>
      </div>
      <div class="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
        <div class="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium text-zinc-400">Açık Talepler</span>
            <HeadphonesIcon class="w-5 h-5 text-zinc-500" />
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.tickets }}</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions & Recent Services -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <h2 class="text-xl font-bold text-white mb-4">Son Alınan Hizmetler</h2>
        <div v-if="pending" class="flex justify-center p-8">
          <Loader2 class="w-6 h-6 animate-spin text-zinc-500" />
        </div>
        <div v-else-if="services.length === 0" class="bg-zinc-900/30 border border-white/5 rounded-2xl p-8 text-center">
          <Globe class="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-white mb-2">Henüz bir hizmetiniz yok</h3>
          <p class="text-sm text-zinc-400 mb-6">Hemen yeni bir VDS veya Web Hosting satın alarak başlayın.</p>
          <NuxtLink to="/pricing" class="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-200 transition-colors">
            Hizmet Satın Al
          </NuxtLink>
        </div>
        <div v-else class="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-white/5 text-sm text-zinc-500 bg-black/20">
                <th class="p-4 font-medium">Hizmet Adı</th>
                <th class="p-4 font-medium">Türü</th>
                <th class="p-4 font-medium">Durum</th>
                <th class="p-4 font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="service in services.slice(0, 5)" :key="service.id" class="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                <td class="p-4">
                  <p class="font-medium text-white">{{ service.name }}</p>
                  <p class="text-xs text-zinc-500">{{ service.ipAddress || 'IP Atanmadı' }}</p>
                </td>
                <td class="p-4">
                  <span class="inline-flex items-center px-2 py-1 rounded-md bg-white/5 text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    {{ service.type }}
                  </span>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full" :class="service.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'"></div>
                    <span class="text-sm text-zinc-300 capitalize">{{ service.status }}</span>
                  </div>
                </td>
                <td class="p-4">
                  <NuxtLink :to="`/dashboard/service/${service.id}`" class="text-sm font-medium text-white hover:text-zinc-300 transition-colors">
                    Yönet →
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div>
        <h2 class="text-xl font-bold text-white mb-4">Hızlı İşlemler</h2>
        <div class="grid gap-4">
          <NuxtLink to="/pricing" class="group flex items-center gap-4 bg-zinc-900/50 border border-white/5 p-4 rounded-2xl hover:border-white/10 transition-colors">
            <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-300 group-hover:bg-white group-hover:text-black transition-colors">
              <Plus class="w-5 h-5" />
            </div>
            <div>
              <p class="font-medium text-white text-sm">Yeni Sipariş Ver</p>
              <p class="text-xs text-zinc-500">VDS, Dedicated veya Web Hosting</p>
            </div>
          </NuxtLink>
          <NuxtLink to="/contact" class="group flex items-center gap-4 bg-zinc-900/50 border border-white/5 p-4 rounded-2xl hover:border-white/10 transition-colors">
            <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-300 group-hover:bg-white group-hover:text-black transition-colors">
              <HeadphonesIcon class="w-5 h-5" />
            </div>
            <div>
              <p class="font-medium text-white text-sm">Destek Talebi</p>
              <p class="text-xs text-zinc-500">Yardıma mı ihtiyacınız var?</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Server, CreditCard, HeadphonesIcon, Globe, Loader2, Plus } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const authStore = useAuthStore()
const api = useApi()

const pending = ref(true)
const services = ref<any[]>([])

const stats = reactive({
  services: 0,
  unpaid: 0,
  tickets: 0
})

onMounted(async () => {
  try {
    const data = await api<{ services: any[] }>('/services')
    services.value = data.services || []
    stats.services = services.value.length
  } catch (e) {
    console.error(e)
  } finally {
    pending.value = false
  }
})
</script>
