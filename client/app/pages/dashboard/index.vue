<template>
  <SectionContainer>
    <SectionHeader
      align="left"
      :title="`Hoş Geldin, ${authStore.user?.name || 'Kullanıcı'}`"
      description="Hosting hizmetlerinizi buradan yönetin."
    />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <DashboardStatCard title="Aktif Hizmetler" value="0" :icon="Server" />
      <DashboardStatCard title="Domainler" value="0" :icon="Globe" />
      <DashboardStatCard title="Aylık Harcama" value="₺0" :icon="CreditCard" />
      <DashboardStatCard title="Uptime" value="%0" :icon="Activity" />
    </div>

    <SectionHeader
      align="left"
      title="Hızlı İşlemler"
      description="Hosting hizmetlerinizi yönetin"
    />
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <QuickActionCard title="Yeni Hizmet Al" :icon="Plus" to="/pricing" />
      <QuickActionCard title="Destek Talebi" :icon="ArrowUpRight" to="/contact" />
      <QuickActionCard title="Fatura Öde" :icon="CreditCard" />
    </div>
  </SectionContainer>
</template>

<script setup lang="ts">
import { Server, Globe, CreditCard, Activity, Plus, ArrowUpRight } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()

useHead({
  title: 'Dashboard - HostiHub'
})
</script>
