<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  ChevronDown, Menu, X, LogIn, LayoutDashboard, 
  Server, HardDrive, Globe, Mail, Headphones, MessageCircle, ShoppingCart
} from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'

import Box from '@/components/ui/layout/Box.vue'
import Flex from '@/components/ui/layout/Flex.vue'
import Container from '@/components/ui/layout/Container.vue'
import Text from '@/components/ui/typography/Text.vue'
import { Button } from '@/components/ui/button'

const auth = useAuthStore()
const cartStore = useCartStore()

onMounted(() => {
  cartStore.initCart()
})

const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const activeDropdown = ref<string | null>(null)
let timeoutId: ReturnType<typeof setTimeout> | null = null

const openDropdown = (name: string) => {
  if (timeoutId) clearTimeout(timeoutId)
  activeDropdown.value = name
}

const closeDropdown = () => {
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    activeDropdown.value = null
  }, 150)
}
</script>

<template>
  <Box as="header" 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent"
    :class="{ 'bg-black/80 backdrop-blur-xl border-white/5 shadow-lg shadow-black/50': scrolled }"
  >
    <Container size="lg">
      <Flex align="center" justify="between" class="h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="group">
          <Flex align="center" gap="2">
            <Text as="span" size="2xl" weight="bold" class="text-white tracking-tight">Hosti<span class="text-primary">Hub</span></Text>
          </Flex>
        </NuxtLink>

        <!-- Desktop Nav -->
        <Flex as="nav" class="hidden md:flex items-center" gap="8">
          <!-- Hosting -->
          <Box class="relative group" @mouseenter="openDropdown('hosting')" @mouseleave="closeDropdown">
            <Flex as="button" align="center" gap="1" class="text-zinc-300 hover:text-white font-medium transition-colors py-2">
              Hosting
              <ChevronDown class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': activeDropdown === 'hosting' }" />
            </Flex>
            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <Box v-if="activeDropdown === 'hosting'" class="absolute top-full left-1/2 -translate-x-1/2 w-64 pt-2">
                <Box class="bg-zinc-900 border border-white/10 rounded-2xl p-2 shadow-2xl">
                  <NuxtLink to="/hosting/web" class="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group/item">
                    <Globe class="w-5 h-5 text-zinc-400 group-hover/item:text-primary mt-0.5" />
                    <Box>
                      <Box class="text-sm font-medium text-white mb-0.5">Web Hosting</Box>
                      <Box class="text-xs text-zinc-500">Hızlı ve güvenilir paylaşımlı hosting</Box>
                    </Box>
                  </NuxtLink>
                  <NuxtLink to="/hosting/mail" class="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group/item mt-1">
                    <Mail class="w-5 h-5 text-zinc-400 group-hover/item:text-primary mt-0.5" />
                    <Box>
                      <Box class="text-sm font-medium text-white mb-0.5">Mail Hosting</Box>
                      <Box class="text-xs text-zinc-500">Kurumsal e-posta çözümleri</Box>
                    </Box>
                  </NuxtLink>
                </Box>
              </Box>
            </Transition>
          </Box>

          <!-- Sunucular -->
          <Box class="relative group" @mouseenter="openDropdown('servers')" @mouseleave="closeDropdown">
            <Flex as="button" align="center" gap="1" class="text-zinc-300 hover:text-white font-medium transition-colors py-2">
              Sunucular
              <ChevronDown class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': activeDropdown === 'servers' }" />
            </Flex>
            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <Box v-if="activeDropdown === 'servers'" class="absolute top-full left-1/2 -translate-x-1/2 w-64 pt-2">
                <Box class="bg-zinc-900 border border-white/10 rounded-2xl p-2 shadow-2xl">
                  <NuxtLink to="/servers/vps" class="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group/item">
                    <Server class="w-5 h-5 text-zinc-400 group-hover/item:text-primary mt-0.5" />
                    <Box>
                      <Box class="text-sm font-medium text-white mb-0.5">VDS Sunucu</Box>
                      <Box class="text-xs text-zinc-500">Yüksek performanslı sanal sunucular</Box>
                    </Box>
                  </NuxtLink>
                  <NuxtLink to="/servers/dedicated" class="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group/item mt-1">
                    <HardDrive class="w-5 h-5 text-zinc-400 group-hover/item:text-primary mt-0.5" />
                    <Box>
                      <Box class="text-sm font-medium text-white mb-0.5">Dedicated Sunucu</Box>
                      <Box class="text-xs text-zinc-500">Tamamen size ait fiziksel sunucular</Box>
                    </Box>
                  </NuxtLink>
                </Box>
              </Box>
            </Transition>
          </Box>

          <!-- Destek -->
          <Box class="relative group" @mouseenter="openDropdown('support')" @mouseleave="closeDropdown">
            <Flex as="button" align="center" gap="1" class="text-zinc-300 hover:text-white font-medium transition-colors py-2">
              Destek
              <ChevronDown class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': activeDropdown === 'support' }" />
            </Flex>
            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <Box v-if="activeDropdown === 'support'" class="absolute top-full left-1/2 -translate-x-1/2 w-56 pt-2">
                <Box class="bg-zinc-900 border border-white/10 rounded-2xl p-2 shadow-2xl">
                  <NuxtLink to="/contact" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group/item">
                    <Headphones class="w-4 h-4 text-zinc-400 group-hover/item:text-primary" />
                    <Text as="span" size="sm" weight="medium" class="text-white">Bize Ulaşın</Text>
                  </NuxtLink>
                  <a href="#" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group/item mt-1">
                    <MessageCircle class="w-4 h-4 text-zinc-400 group-hover/item:text-primary" />
                    <Text as="span" size="sm" weight="medium" class="text-white">Discord</Text>
                  </a>
                </Box>
              </Box>
            </Transition>
          </Box>
        </Flex>

        <!-- Right actions -->
        <Flex class="hidden md:flex items-center" gap="4">
          <NuxtLink to="/checkout" class="relative text-zinc-400 hover:text-white transition-colors">
            <ShoppingCart class="w-6 h-6" />
            <span v-if="cartStore.totalItems > 0" class="absolute -top-2 -right-2 bg-primary text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {{ cartStore.totalItems }}
            </span>
          </NuxtLink>

          <Button v-if="!auth.isAuthenticated" variant="outline" asChild class="px-5 py-2.5 rounded-xl border-white/10 hover:bg-white/10">
            <NuxtLink to="/auth/login">
              <LogIn class="w-4 h-4 mr-2" />
              Müşteri Paneli
            </NuxtLink>
          </Button>
          <template v-else>
            <Button v-if="auth.user?.role === 'ADMIN'" variant="outline" asChild class="px-5 py-2.5 rounded-xl border-white/10 hover:bg-white/10 mr-2">
              <NuxtLink to="/admin">
                Admin
              </NuxtLink>
            </Button>
            <Button asChild class="px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20">
              <NuxtLink to="/dashboard">
                <LayoutDashboard class="w-4 h-4 mr-2" />
                Dashboard
              </NuxtLink>
            </Button>
          </template>
        </Flex>

        <!-- Mobile Menu Button -->
        <Box as="button" class="md:hidden p-2 -mr-2 text-zinc-400 hover:text-white" @click="mobileMenuOpen = !mobileMenuOpen">
          <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </Box>
      </Flex>
    </Container>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-full"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-full"
    >
      <Box v-if="mobileMenuOpen" class="absolute top-full left-0 right-0 bg-zinc-900 border-b border-white/10 shadow-2xl md:hidden overflow-hidden origin-top">
        <Box class="px-4 pt-2 pb-6 space-y-1">
          <Box class="py-2">
            <Box class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-3">Hosting</Box>
            <NuxtLink to="/hosting/web" class="block px-3 py-2 rounded-lg text-white hover:bg-white/5" @click="mobileMenuOpen = false">Web Hosting</NuxtLink>
            <NuxtLink to="/hosting/mail" class="block px-3 py-2 rounded-lg text-white hover:bg-white/5" @click="mobileMenuOpen = false">Mail Hosting</NuxtLink>
          </Box>
          <Box class="py-2">
            <Box class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-3">Sunucular</Box>
            <NuxtLink to="/servers/vps" class="block px-3 py-2 rounded-lg text-white hover:bg-white/5" @click="mobileMenuOpen = false">VDS Sunucu</NuxtLink>
            <NuxtLink to="/servers/dedicated" class="block px-3 py-2 rounded-lg text-white hover:bg-white/5" @click="mobileMenuOpen = false">Dedicated Sunucu</NuxtLink>
          </Box>
          <Box class="py-2 border-b border-white/5 mb-4">
            <Box class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-3">Destek</Box>
            <NuxtLink to="/contact" class="block px-3 py-2 rounded-lg text-white hover:bg-white/5" @click="mobileMenuOpen = false">Bize Ulaşın</NuxtLink>
          </Box>
          <Box class="px-3 pt-2">
            <Button asChild variant="outline" class="w-full justify-center px-4 py-3 rounded-xl border-white/10 bg-white/5 text-white mb-2" @click="mobileMenuOpen = false">
              <NuxtLink to="/checkout" class="flex items-center gap-2">
                <ShoppingCart class="w-4 h-4" /> 
                Sepetim ({{ cartStore.totalItems }})
              </NuxtLink>
            </Button>
            <Button v-if="!auth.isAuthenticated" variant="outline" asChild class="w-full justify-center px-4 py-3 rounded-xl border-white/10 bg-white/5 text-white" @click="mobileMenuOpen = false">
              <NuxtLink to="/auth/login">Müşteri Paneli</NuxtLink>
            </Button>
            <template v-else>
              <Button v-if="auth.user?.role === 'ADMIN'" variant="outline" asChild class="w-full justify-center px-4 py-3 rounded-xl border-white/10 bg-white/5 text-white mb-2" @click="mobileMenuOpen = false">
                <NuxtLink to="/admin">Admin Panel</NuxtLink>
              </Button>
              <Button asChild class="w-full justify-center px-4 py-3 rounded-xl text-white" @click="mobileMenuOpen = false">
                <NuxtLink to="/dashboard">Dashboard</NuxtLink>
              </Button>
            </template>
          </Box>
        </Box>
      </Box>
    </Transition>
  </Box>
</template>
