<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: 'HostiHub - Premium Web Hosting',
  meta: [
    { name: 'description', content: 'HostiHub - Hızlı, güvenli ve uygun fiyatlı hosting çözümleri.' }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
  ]
})
</script>
