<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
          <h1 class="text-3xl font-bold">Hizmet Yönetimi</h1>
      </div>
    </div>

      <div v-if="pending" class="text-neutral-400">Loading services...</div>
      
      <div v-else class="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-neutral-800 border-b border-neutral-700">
            <tr>
              <th class="px-6 py-4 text-sm font-medium text-neutral-300">ID</th>
              <th class="px-6 py-4 text-sm font-medium text-neutral-300">User</th>
              <th class="px-6 py-4 text-sm font-medium text-neutral-300">Type</th>
              <th class="px-6 py-4 text-sm font-medium text-neutral-300">Name</th>
              <th class="px-6 py-4 text-sm font-medium text-neutral-300">Status</th>
              <th class="px-6 py-4 text-sm font-medium text-neutral-300">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-800">
            <tr v-for="service in services" :key="service.id" class="hover:bg-neutral-800/50">
              <td class="px-6 py-4 text-sm text-neutral-400 font-mono text-xs">{{ service.id.substring(0,8) }}...</td>
              <td class="px-6 py-4 text-sm">
                <div>{{ service.userName || 'N/A' }}</div>
                <div class="text-xs text-neutral-400">{{ service.userEmail }}</div>
              </td>
              <td class="px-6 py-4 text-sm capitalize">{{ service.type }}</td>
              <td class="px-6 py-4 text-sm">{{ service.name }}</td>
              <td class="px-6 py-4 text-sm">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  service.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                  service.status === 'suspended' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                ]">
                  {{ service.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm space-x-2">
                <button 
                  v-if="service.status !== 'active'"
                  @click="updateStatus(service, 'active')" 
                  class="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Activate
                </button>
                <button 
                  v-if="service.status !== 'suspended'"
                  @click="updateStatus(service, 'suspended')" 
                  class="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Suspend
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const api = useApi()

const { data, pending, refresh } = await useAsyncData('admin-services', () => 
  api<{ services: any[] }>('/admin/services')
)

const services = computed(() => data.value?.services || [])

const updateStatus = async (service: any, status: string) => {
    try {
        await api(`/admin/services/${service.id}/status`, {
            method: 'PUT',
            body: { status }
        })
        await refresh()
    } catch (e) {
        alert('Failed to update service status')
    }
}
</script>
