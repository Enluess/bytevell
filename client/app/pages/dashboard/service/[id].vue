<template>
  <div>
    <div class="mb-8 flex items-center gap-4">
      <button @click="$router.back()" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <div>
        <h1 class="text-3xl font-bold text-white mb-1">{{ service?.name || 'Yükleniyor...' }}</h1>
        <p class="text-zinc-400">Hizmet Detayları ve Yönetim Paneli</p>
      </div>
    </div>

    <div v-if="pending" class="flex justify-center p-12">
      <Loader2 class="w-8 h-8 animate-spin text-zinc-500" />
    </div>
    
    <div v-else-if="service" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Info Column -->
      <div class="space-y-6">
        <div class="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
          <h2 class="text-lg font-bold text-white mb-4">Hizmet Bilgileri</h2>
          <div class="space-y-4">
            <div>
              <p class="text-sm text-zinc-500 mb-1">Durum</p>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" :class="service.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'"></div>
                <span class="text-sm font-medium text-white capitalize">{{ service.status }}</span>
              </div>
            </div>
            <div>
              <p class="text-sm text-zinc-500 mb-1">IP Adresi</p>
              <p class="text-sm font-medium text-white">{{ service.ipAddress || 'Yok' }}</p>
            </div>
            <div>
              <p class="text-sm text-zinc-500 mb-1">Hizmet Tipi</p>
              <p class="text-sm font-medium text-white uppercase">{{ service.type }}</p>
            </div>
            <div>
              <p class="text-sm text-zinc-500 mb-1">Fiyatlandırma</p>
              <p class="text-sm font-medium text-white">{{ service.price }} / Ay</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Column -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
          <h2 class="text-lg font-bold text-white mb-6">İşlemler</h2>
          
          <div v-if="service.type === 'vps' || service.type === 'dedicated'" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button @click="performAction('restart')" :disabled="actionLoading" class="flex flex-col items-center justify-center p-6 rounded-xl border border-white/5 bg-black/20 hover:bg-white/5 transition-colors group disabled:opacity-50">
              <RotateCw class="w-8 h-8 text-zinc-400 group-hover:text-white mb-3" />
              <span class="text-sm font-medium text-zinc-300 group-hover:text-white">Yeniden Başlat</span>
            </button>
            <button @click="performAction('stop')" :disabled="actionLoading" class="flex flex-col items-center justify-center p-6 rounded-xl border border-white/5 bg-black/20 hover:bg-white/5 transition-colors group disabled:opacity-50">
              <PowerOff class="w-8 h-8 text-zinc-400 group-hover:text-red-400 mb-3" />
              <span class="text-sm font-medium text-zinc-300 group-hover:text-red-400">Durdur</span>
            </button>
            <button @click="performAction('reinstall')" :disabled="actionLoading" class="flex flex-col items-center justify-center p-6 rounded-xl border border-white/5 bg-black/20 hover:bg-white/5 transition-colors group disabled:opacity-50">
              <HardDrive class="w-8 h-8 text-zinc-400 group-hover:text-white mb-3" />
              <span class="text-sm font-medium text-zinc-300 group-hover:text-white">Format At</span>
            </button>
          </div>
          
          <div v-else-if="service.type === 'web'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button @click="performAction('cpanel')" :disabled="actionLoading" class="flex flex-col items-center justify-center p-6 rounded-xl border border-white/5 bg-black/20 hover:bg-white/5 transition-colors group disabled:opacity-50">
              <Globe class="w-8 h-8 text-zinc-400 group-hover:text-white mb-3" />
              <span class="text-sm font-medium text-zinc-300 group-hover:text-white">cPanel'e Git</span>
            </button>
            <button @click="performAction('ftp')" :disabled="actionLoading" class="flex flex-col items-center justify-center p-6 rounded-xl border border-white/5 bg-black/20 hover:bg-white/5 transition-colors group disabled:opacity-50">
              <FileUp class="w-8 h-8 text-zinc-400 group-hover:text-white mb-3" />
              <span class="text-sm font-medium text-zinc-300 group-hover:text-white">FTP Bilgileri</span>
            </button>
          </div>

          <div v-if="actionMessage" class="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-400 flex items-center justify-between">
            {{ actionMessage }}
            <button @click="actionMessage = ''" class="text-green-400 hover:text-green-300"><X class="w-4 h-4" /></button>
          </div>
        </div>

        <!-- Graph placeholder for servers -->
        <div v-if="service.type === 'vps' || service.type === 'dedicated'" class="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
          <h2 class="text-lg font-bold text-white mb-6">Kaynak Kullanımı</h2>
          <div class="h-48 border border-dashed border-white/10 rounded-xl flex items-center justify-center">
            <p class="text-zinc-500 text-sm">Grafik verisi bekleniyor...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Loader2, RotateCw, PowerOff, HardDrive, Globe, FileUp, X } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const route = useRoute()
const api = useApi()

const serviceId = route.params.id as string
const pending = ref(true)
const service = ref<any>(null)
const actionLoading = ref(false)
const actionMessage = ref('')

onMounted(async () => {
  try {
    const data = await api<{ service: any }>(`/services/${serviceId}`)
    service.value = data.service
  } catch (e) {
    console.error(e)
  } finally {
    pending.value = false
  }
})

async function performAction(action: string) {
  actionLoading.value = true
  actionMessage.value = ''
  try {
    const data = await api<{ message: string }>(`/services/${serviceId}/action`, {
      method: 'POST',
      body: { action }
    })
    actionMessage.value = data.message
  } catch (e: any) {
    actionMessage.value = 'Hata: ' + (e.message || 'İşlem başarısız')
  } finally {
    actionLoading.value = false
    setTimeout(() => {
      actionMessage.value = ''
    }, 5000)
  }
}
</script>
