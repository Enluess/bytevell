import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
        return navigateTo('/auth/login')
    }

    if (authStore.user?.role !== 'ADMIN') {
        return navigateTo('/')
    }
})
