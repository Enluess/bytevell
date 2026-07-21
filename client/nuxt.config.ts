// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', 'shadcn-nuxt'],

  pages: true,

  components: [
    {
      path: '~/components',
      ignore: ['ui/**/*'],
    },
  ],

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5000/api'
    }
  }
})