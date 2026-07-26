<template>
  <div class="min-h-screen bg-black text-white pt-24 pb-12 px-6">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6">
            <ArrowLeft class="w-4 h-4" /> Geri Dön
          </NuxtLink>
          <h1 class="text-4xl font-bold mb-2">Sepetim</h1>
          <p class="text-zinc-400">Sepetinizdeki hizmetleri inceleyin ve siparişinizi tamamlayın.</p>
        </div>
        <button v-if="cartStore.totalItems > 0" @click="cartStore.clearCart" class="text-red-400 hover:text-red-300 text-sm flex items-center gap-2">
          <Trash2 class="w-4 h-4" /> Sepeti Temizle
        </button>
      </div>

      <!-- Empty Cart -->
      <div v-if="cartStore.totalItems === 0" class="bg-zinc-900/30 border border-white/5 rounded-2xl p-16 text-center">
        <ShoppingCart class="w-16 h-16 text-zinc-600 mx-auto mb-4" />
        <h2 class="text-xl font-medium text-white mb-2">Sepetiniz Boş</h2>
        <p class="text-zinc-400 mb-6">Sitemizdeki yüksek performanslı paketleri inceleyerek hemen sepete ekleyebilirsiniz.</p>
        <NuxtLink to="/pricing" class="inline-flex items-center justify-center bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-zinc-200 transition-colors">
          Paketleri İncele
        </NuxtLink>
      </div>

      <!-- Cart Items & Summary -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-6">
          
          <!-- User Info -->
          <div class="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl">
            <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
              <User class="w-5 h-5 text-zinc-400" /> Hesap Bilgileri
            </h2>
            <div v-if="authStore.isAuthenticated" class="text-sm">
              <p class="text-zinc-400 mb-1">Şu anki hesapla devam ediliyor:</p>
              <p class="font-medium text-white mb-2">{{ authStore.user?.email }}</p>
              <div class="inline-flex items-center gap-2 bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-700/50">
                <span class="text-zinc-400 text-xs">Mevcut Bakiye:</span>
                <span class="font-bold text-emerald-400">{{ authStore.user?.balance || '0.00' }}₺</span>
              </div>
            </div>
            <div v-else class="text-sm">
              <p class="text-zinc-400 mb-4">Siparişi tamamlamak için giriş yapmalısınız.</p>
              <NuxtLink to="/auth/login" class="inline-flex items-center justify-center bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors">
                Giriş Yap
              </NuxtLink>
            </div>
          </div>

          <!-- Items List -->
          <div class="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl">
            <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
              <Box class="w-5 h-5 text-zinc-400" /> Sepetteki Ürünler ({{ cartStore.totalItems }})
            </h2>
            <div class="space-y-4">
              <div v-for="item in cartStore.items" :key="item.id" class="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-black/20 group hover:border-white/10 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Server v-if="item.type === 'vps'" class="w-5 h-5 text-zinc-400" />
                    <HardDrive v-else-if="item.type === 'dedicated'" class="w-5 h-5 text-zinc-400" />
                    <Globe v-else class="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h3 class="font-medium text-white">{{ item.name }}</h3>
                    <p class="text-xs text-zinc-500 uppercase">{{ item.type }} Hizmeti</p>
                  </div>
                </div>
                <div class="flex items-center gap-6">
                  <span class="font-bold text-white">{{ item.price }}</span>
                  <button @click="cartStore.removeItem(item.id)" class="text-zinc-500 hover:text-red-400 transition-colors" title="Sil">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="space-y-6">
          <div class="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl sticky top-24">
            <h2 class="text-lg font-bold mb-4">Sipariş Özeti</h2>
            <div class="space-y-3 text-sm mb-6 border-b border-white/5 pb-4">
              <div class="flex justify-between text-zinc-400">
                <span>Ara Toplam</span>
                <span>{{ formattedTotalPrice }}₺</span>
              </div>
              <div class="flex justify-between text-zinc-400">
                <span>Vergi (KDV %20)</span>
                <span>{{ (cartStore.totalPrice * 0.2).toFixed(2) }}₺</span>
              </div>
            </div>
            <div class="flex justify-between font-bold text-lg mb-6">
              <span>Toplam</span>
              <span>{{ (cartStore.totalPrice * 1.2).toFixed(2) }}₺</span>
            </div>

            <!-- Error/Success Messages -->
            <div v-if="error" class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {{ error }}
            </div>
            <div v-if="success" class="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-400">
              {{ success }}
            </div>

            <button 
              @click="handlePurchase" 
              :disabled="loading || !authStore.isAuthenticated || success !== '' || !hasEnoughBalance"
              class="w-full bg-white hover:bg-zinc-200 text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:bg-white transition-all mt-4"
            >
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              <span v-if="success">Sipariş Alındı!</span>
              <span v-else-if="!hasEnoughBalance && authStore.isAuthenticated">Yetersiz Bakiye</span>
              <span v-else>Siparişi Onayla</span>
            </button>
            <p class="text-center text-xs text-zinc-500 mt-4">
              Güvenli alışveriş. Şimdilik test modunda çalışır.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, User, Box, Check, Loader2, ShoppingCart, Trash2, Server, HardDrive, Globe } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const api = useApi()

const loading = ref(false)
const error = ref('')
const success = ref('')

const formattedTotalPrice = computed(() => {
  return cartStore.totalPrice.toFixed(2)
})

const finalPrice = computed(() => {
  return cartStore.totalPrice * 1.2
})

const hasEnoughBalance = computed(() => {
  if (!authStore.isAuthenticated) return false
  const balance = parseFloat(authStore.user?.balance || '0')
  return balance >= finalPrice.value
})

async function handlePurchase() {
  if (!authStore.isAuthenticated) {
    router.push('/auth/login')
    return
  }

  if (cartStore.items.length === 0) return

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    // Toplu alımı mocklamak için frontend'de her ürünü ayrı ayrı sipariş edelim (Basitlik açısından)
    const promises = cartStore.items.map(item => {
      return api<{ message: string }>('/services/purchase', {
        method: 'POST',
        body: {
          type: item.type,
          name: item.name,
          price: item.price
        }
      })
    })

    await Promise.all(promises)

    success.value = 'Tüm ürünler başarıyla satın alındı!'
    cartStore.clearCart()
    await authStore.fetchUser() // Refresh balance

    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)

  } catch (e: any) {
    error.value = e.message || 'Satın alım başarısız oldu.'
  } finally {
    loading.value = false
  }
}
</script>
