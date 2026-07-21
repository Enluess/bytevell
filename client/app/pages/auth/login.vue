<template>
  <div class="min-h-screen flex">
    <!-- Left Panel - Branding -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-zinc-950 flex-col justify-between p-12 border-r border-white/5">
      <div class="absolute inset-0 bg-gradient-to-br from-orange-950/20 via-transparent to-orange-950/10"></div>
      <div class="relative z-10">
        <NuxtLink to="/" class="inline-flex items-center gap-2">
          <span class="text-2xl font-bold tracking-tight">
            <span class="text-white">Hosti</span><span class="text-orange-500">Hub</span>
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
              <span class="text-white">Hosti</span><span class="text-orange-500">Hub</span>
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
                  class="w-full px-4 py-3 bg-zinc-900/80 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                />
              </div>
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm text-zinc-300">Şifre <span class="text-red-400">*</span></label>
                  <NuxtLink to="/auth/forgot-password" class="text-xs text-orange-400 hover:text-orange-300 transition-colors">
                    Şifrenizi mi unuttunuz? Sıfırlayın.
                  </NuxtLink>
                </div>
                <div class="relative">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    required
                    class="w-full px-4 py-3 bg-zinc-900/80 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all pr-12"
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
                class="w-full btn-accent py-3 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
                Giriş Yap
              </button>
            </form>

            <p class="text-center text-sm text-zinc-500 mt-6">
              Bir hesabınız yok mu?
              <NuxtLink to="/auth/register" class="text-orange-400 hover:text-orange-300 transition-colors font-medium">
                Kayıt olun.
              </NuxtLink>
            </p>

            <!-- Social Login Divider -->
            <div class="flex items-center gap-4 my-8">
              <div class="flex-1 h-px bg-white/5"></div>
              <span class="text-xs text-zinc-600">veya</span>
              <div class="flex-1 h-px bg-white/5"></div>
            </div>

            <!-- Social Login -->
            <div class="flex items-center justify-center gap-4">
              <button class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
              </button>
              <button class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </button>
            </div>
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
