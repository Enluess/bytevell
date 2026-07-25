<template>
  <div class="min-h-screen bg-black text-white flex">
    <!-- Sidebar -->
    <aside class="w-64 border-r border-white/5 bg-zinc-950 flex flex-col hidden md:flex">
      <div class="p-6">
        <NuxtLink to="/" class="inline-flex items-center gap-2">
          <span class="text-2xl font-bold tracking-tight">
            <span class="text-white">Hosti</span><span class="text-zinc-400">Hub</span>
          </span>
        </NuxtLink>
      </div>
      <div class="px-4 pb-4">
        <p class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">Müşteri Paneli</p>
        <nav class="space-y-1">
          <NuxtLink to="/dashboard" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors" active-class="bg-white/10 text-white">
            <LayoutDashboard class="w-4 h-4" />
            Genel Bakış
          </NuxtLink>
        </nav>
      </div>
      <div class="px-4 pb-4">
        <p class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">Hizmetlerim</p>
        <nav class="space-y-1">
          <NuxtLink to="/dashboard/web" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors" active-class="bg-white/10 text-white">
            <Globe class="w-4 h-4" />
            Web Hosting
          </NuxtLink>
          <NuxtLink to="/dashboard/vps" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors" active-class="bg-white/10 text-white">
            <Server class="w-4 h-4" />
            VDS Sunucular
          </NuxtLink>
          <NuxtLink to="/dashboard/dedicated" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors" active-class="bg-white/10 text-white">
            <Database class="w-4 h-4" />
            Dedicated Sunucular
          </NuxtLink>
        </nav>
      </div>
      <div class="mt-auto px-4 pb-6">
        <button @click="handleLogout" class="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
          <LogOut class="w-4 h-4" />
          Çıkış Yap
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-h-screen max-w-full">
      <!-- Topbar -->
      <header class="h-16 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
        <div class="flex items-center gap-4 md:hidden">
          <NuxtLink to="/" class="text-xl font-bold tracking-tight text-white">HostiHub</NuxtLink>
        </div>
        <div class="hidden md:block"></div>
        <div class="flex items-center gap-4">
          <NuxtLink to="/pricing" class="hidden md:flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
            <Plus class="w-4 h-4" /> Yeni Sipariş
          </NuxtLink>
          <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">
            {{ userInitial }}
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 p-6 md:p-8 overflow-y-auto">
        <div class="max-w-5xl mx-auto">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { LayoutDashboard, Globe, Server, Database, LogOut, Plus } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const userInitial = computed(() => {
  return authStore.userName?.charAt(0).toUpperCase() || 'U'
})

function handleLogout() {
  authStore.logout()
}
</script>
