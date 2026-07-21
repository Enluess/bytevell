export const useApi = () => {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    return <T>(url: string, options: any = {}) => {
        const headers: Record<string, string> = {
            ...options.headers,
        }

        if (authStore.token) {
            headers['Authorization'] = `Bearer ${authStore.token}`
        }

        return $fetch<T>(`${config.public.apiBase}${url}`, {
            ...options,
            headers,
        })
    }
}
