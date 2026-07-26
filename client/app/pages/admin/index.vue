<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold">Admin Dashboard</h1>
    </div>

      <div v-if="pending" class="text-neutral-400">Loading stats...</div>
      
      <div v-else-if="stats" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 class="text-neutral-400 mb-2">Total Users</h2>
          <p class="text-4xl font-bold">{{ stats.totalUsers }}</p>
        </div>
        
        <div class="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 class="text-neutral-400 mb-2">Total Services</h2>
          <p class="text-4xl font-bold">{{ stats.totalServices }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const api = useApi()

const { data, pending } = await useAsyncData('admin-stats', () => 
  api<{ stats: { totalUsers: number, totalServices: number } }>('/admin/stats')
)

const stats = computed(() => data.value?.stats)
</script>
