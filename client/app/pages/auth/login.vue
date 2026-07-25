<template>
  <div class="min-h-screen flex">
    <!-- Left Panel - Branding -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-zinc-950 flex-col justify-between p-12 border-r border-white/5">
      <div class="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent"></div>
      <div class="relative z-10">
        <NuxtLink to="/" class="inline-flex items-center gap-2">
          <span class="text-2xl font-bold tracking-tight">
            <span class="text-white">Hosti</span><span class="text-zinc-400">Hub</span>
          </span>
        </NuxtLink>
      </div>
      <div class="relative z-10">
        <p class="text-sm text-zinc-500 mb-3">Giriş Yap</p>
        <h2 class="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
          Sunucunuzu Dakikalar<br>İçinde Başlatın
        </h2>
        <p class="text-zinc-400 text-lg">
          Siz en iyisini istiyorsunuz, biz sağlıyoruz.
        </p>
      </div>
      <div class="relative z-10"></div>
    </div>

    <!-- Right Panel - Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-black">
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden mb-8 text-center">
          <NuxtLink to="/" class="inline-flex items-center gap-2">
            <span class="text-2xl font-bold tracking-tight">
              <span class="text-white">Hosti</span><span class="text-zinc-400">Hub</span>
            </span>
          </NuxtLink>
        </div>

        <GlowCard>
          <div class="p-8">
            <h1 class="text-2xl font-bold text-white mb-2">Tekrar hoş geldin!</h1>
            <p class="text-sm text-zinc-500 mb-8">Giriş yapmak için e-posta adresinizi ve şifrenizi giriniz.</p>

            <!-- Error -->
            <div v-if="error" class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {{ error }}
            </div>

            <form @submit.prevent="handleLogin" class="space-y-5">
              <div>
                <label class="block text-sm text-zinc-300 mb-2">E-posta <span class="text-red-400">*</span></label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="ornek@email.com"
                  required
                  class="w-full px-4 py-3 bg-zinc-900/80 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all"
                />
              </div>
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm text-zinc-300">Şifre <span class="text-red-400">*</span></label>
                  <NuxtLink to="/auth/forgot-password" class="text-xs text-white hover:text-zinc-300 underline underline-offset-4 transition-colors">
                    Şifrenizi mi unuttunuz? Sıfırlayın.
                  </NuxtLink>
                </div>
                <div class="relative">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    required
                    class="w-full px-4 py-3 bg-zinc-900/80 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all pr-12"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <EyeOff v-if="showPassword" class="w-4 h-4" />
                    <Eye v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-white hover:bg-zinc-200 text-black rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
                Giriş Yap
              </button>
            </form>

            <p class="text-center text-sm text-zinc-500 mt-6">
              Bir hesabınız yok mu?
              <NuxtLink to="/auth/register" class="text-white hover:text-zinc-300 underline underline-offset-4 transition-colors font-medium">
                Kayıt olun.
              </NuxtLink>
            </p>

          </div>
        </GlowCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Eye, EyeOff, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false,
})

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  email: '',
  password: '',
})
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(form.email, form.password)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.message || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.'
  } finally {
    loading.value = false
  }
}
</script>
