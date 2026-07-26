<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
          <h1 class="text-3xl font-bold">Kullanıcı Yönetimi</h1>
      </div>
    </div>

      <div v-if="pending" class="text-neutral-400">Loading users...</div>
      
      <div v-else class="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-neutral-800 border-b border-neutral-700">
            <tr>
              <th class="px-6 py-4 text-sm font-medium text-neutral-300">ID</th>
              <th class="px-6 py-4 text-sm font-medium text-neutral-300">Name</th>
              <th class="px-6 py-4 text-sm font-medium text-neutral-300">Email</th>
              <th class="px-6 py-4 text-sm font-medium text-neutral-300">Role</th>
              <th class="px-6 py-4 text-sm font-medium text-neutral-300">Joined</th>
              <th class="px-6 py-4 text-sm font-medium text-neutral-300">Balance</th>
              <th class="px-6 py-4 text-sm font-medium text-neutral-300">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-800">
            <tr v-for="user in users" :key="user.id" class="hover:bg-neutral-800/50">
              <td class="px-6 py-4 text-sm text-neutral-400 font-mono text-xs">{{ user.id }}</td>
              <td class="px-6 py-4 text-sm">{{ user.name || 'N/A' }}</td>
              <td class="px-6 py-4 text-sm">{{ user.email }}</td>
              <td class="px-6 py-4 text-sm">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-neutral-800 text-neutral-400'
                ]">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-neutral-400">{{ new Date(user.createdAt).toLocaleDateString() }}</td>
              <td class="px-6 py-4 text-sm">
                <span class="font-medium text-emerald-400">{{ user.balance }}₺</span>
              </td>
              <td class="px-6 py-4 text-sm space-x-3">
                <button 
                  @click="toggleRole(user)" 
                  class="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Make {{ user.role === 'ADMIN' ? 'USER' : 'ADMIN' }}
                </button>
                <button 
                  @click="editBalance(user)" 
                  class="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Edit Balance
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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

const { data, pending, refresh } = await useAsyncData('admin-users', () => 
  api<{ users: any[] }>('/admin/users')
)

const users = computed(() => data.value?.users || [])

const toggleRole = async (user: any) => {
    try {
        const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
        await api(`/admin/users/${user.id}/role`, {
            method: 'PUT',
            body: { role: newRole }
        })
        await refresh()
    } catch (e) {
        alert('Failed to update user role')
    }
}

const editBalance = async (user: any) => {
    const newBalance = prompt(`Enter new balance for ${user.email} (current: ${user.balance}):`, user.balance)
    if (newBalance === null) return
    
    if (isNaN(parseFloat(newBalance)) || parseFloat(newBalance) < 0) {
        alert('Please enter a valid positive number.')
        return
    }
    
    try {
        await api(`/admin/users/${user.id}/balance`, {
            method: 'PUT',
            body: { balance: newBalance }
        })
        await refresh()
    } catch (e) {
        alert('Failed to update user balance')
    }
}
</script>
