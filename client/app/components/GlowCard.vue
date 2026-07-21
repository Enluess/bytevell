<script setup lang="ts">
import { cn } from '~/lib/utils'
import { Box } from '@/components/ui/layout'

interface Props {
  class?: string
}

defineProps<Props>()
</script>

<template>
  <Box :class="cn('relative group bg-white/[0.02] border border-white/5 rounded-2xl transition-all duration-300 hover:bg-white/[0.04] hover:border-white/10', $props.class)">
    <Box class="absolute inset-0 rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 glow-shadow pointer-events-none" />
    <slot />
  </Box>
</template>

<style scoped>
.glow-shadow {
  box-shadow: 0 0 40px -10px rgba(255, 144, 0, 0.1);
}
</style>
