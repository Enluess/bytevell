import { defineStore } from 'pinia'

interface User {
    id: string
    email: string
    name: string | null
    role: string
    balance: string
}

interface AuthState {
    user: User | null
    token: string | null
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        token: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        userName: (state) => state.user?.name || state.user?.email || 'Kullanıcı',
    },

    actions: {
        async login(email: string, password: string) {
            const api = useApi()
            const data = await api<{ token: string; user: User }>('/auth/login', {
                method: 'POST',
                body: { email, password },
            })
            this.token = data.token
            this.user = data.user
            if (import.meta.client) {
                localStorage.setItem('auth_token', data.token)
            }
        },

        async register(name: string, email: string, password: string) {
            const api = useApi()
            const data = await api<{ token: string; user: User }>('/auth/register', {
                method: 'POST',
                body: { name, email, password },
            })
            this.token = data.token
            this.user = data.user
            if (import.meta.client) {
                localStorage.setItem('auth_token', data.token)
            }
        },

        logout() {
            this.user = null
            this.token = null
            if (import.meta.client) {
                localStorage.removeItem('auth_token')
            }
            navigateTo('/auth/login')
        },

        async fetchUser() {
            if (!this.token) return
            try {
                const api = useApi()
                const data = await api<{ user: User }>('/auth/me')
                this.user = data.user
            } catch {
                this.logout()
            }
        },

        initAuth() {
            if (import.meta.client) {
                const token = localStorage.getItem('auth_token')
                if (token) {
                    this.token = token
                    this.fetchUser()
                }
            }
        },
    },
})
